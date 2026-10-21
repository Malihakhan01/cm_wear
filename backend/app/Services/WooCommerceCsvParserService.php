<?php

namespace App\Services;

use App\Jobs\DownloadProductImageJob;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Category;
use App\Models\ImportError;
use App\Models\ImportJob;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\ProductWholesaleTier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use League\Csv\Reader;

class WooCommerceCsvParserService
{
    public function process(ImportJob $job): void
    {
        $job->update([
            'status' => 'processing',
            'started_at' => now(),
        ]);

        try {
            // Robust file path resolution across local disk, app, and private directories
            $fullPath = null;
            if (file_exists($job->file_path)) {
                $fullPath = $job->file_path;
            } elseif (Storage::disk('local')->exists($job->file_path)) {
                $fullPath = Storage::disk('local')->path($job->file_path);
            } elseif (file_exists(storage_path('app/' . $job->file_path))) {
                $fullPath = storage_path('app/' . $job->file_path);
            } elseif (file_exists(storage_path('app/private/' . $job->file_path))) {
                $fullPath = storage_path('app/private/' . $job->file_path);
            }

            if (!$fullPath || !file_exists($fullPath)) {
                throw new \Exception("CSV file could not be located at '{$job->file_path}'. Please re-upload the file.");
            }

            $csv = Reader::createFromPath($fullPath, 'r');
            $csv->setHeaderOffset(0);

            $records = $csv->getRecords();
            $totalCount = count($csv);

            $job->update(['total_rows' => $totalCount]);

            $processed = 0;
            $successful = 0;
            $failed = 0;

            // Cache parent products map during import
            $parentMap = [];

            foreach ($records as $offset => $row) {
                $processed++;
                $rowNumber = $offset + 1;

                try {
                    DB::beginTransaction();

                    $type = strtolower(trim($row['Type'] ?? 'simple'));
                    $sku = !empty($row['SKU']) ? trim($row['SKU']) : null;
                    $name = trim($row['Name'] ?? '');
                    $parentSku = trim($row['Parent'] ?? '');

                    if ($type === 'variation') {
                        // Handle WooCommerce Variation Row
                        $this->processVariationRow($row, $parentSku, $parentMap, $rowNumber, $job);
                    } else {
                        // Handle Simple, Variable, or Apparel Parent Row
                        $product = $this->processProductRow($row, $type, $sku, $name, $rowNumber, $job);
                        if ($sku) {
                            $parentMap[$sku] = $product;
                        }
                        if (!empty($row['ID'])) {
                            $parentMap['id_' . trim($row['ID'])] = $product;
                        }
                        if ($product->slug) {
                            $parentMap['slug_' . $product->slug] = $product;
                        }
                    }

                    DB::commit();
                    $successful++;
                } catch (\Throwable $e) {
                    DB::rollBack();
                    $failed++;

                    ImportError::create([
                        'import_job_id' => $job->id,
                        'row_number' => $rowNumber,
                        'sku' => $sku ?? ($parentSku ?: 'ROW_' . $rowNumber),
                        'error_message' => $e->getMessage(),
                        'raw_data' => $row,
                    ]);
                }

                if ($processed % 25 === 0) {
                    $job->update([
                        'processed_rows' => $processed,
                        'successful_rows' => $successful,
                        'failed_rows' => $failed,
                    ]);
                }
            }

            $jobStatus = 'completed';
            if ($failed > 0 && $successful === 0) {
                $jobStatus = 'failed';
            } elseif ($failed > 0) {
                $jobStatus = 'completed_with_errors';
            }

            $job->update([
                'processed_rows' => $processed,
                'successful_rows' => $successful,
                'failed_rows' => $failed,
                'status' => $jobStatus,
                'completed_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $job->update([
                'status' => 'failed',
                'completed_at' => now(),
            ]);

            ImportError::create([
                'import_job_id' => $job->id,
                'row_number' => 0,
                'sku' => 'GLOBAL',
                'error_message' => 'Fatal CSV parsing error: ' . $e->getMessage(),
                'raw_data' => null,
            ]);
        }
    }

    protected function processProductRow(array $row, string $type, ?string $sku, string $name, int $rowNumber, ImportJob $job): Product
    {
        if (empty($name) && empty($sku)) {
            throw new \Exception("Product row {$rowNumber} is missing both Name and SKU.");
        }

        $wcId = !empty($row['ID']) && is_numeric($row['ID']) ? (int)$row['ID'] : null;

        $slug = !empty($row['Slug']) ? Str::slug($row['Slug']) : Str::slug($name ?: ($sku ?: 'product-' . $wcId));
        if (empty($slug)) {
            $slug = 'product-' . ($wcId ?: ($sku ?: uniqid()));
        }

        // Find existing product ONLY by wc_id or existing non-empty sku (when updating existing products)
        $product = null;
        if ($wcId) {
            $product = Product::withTrashed()->where('wc_id', $wcId)->first();
        }
        if (!$product && !empty($sku)) {
            $product = Product::withTrashed()->where('sku', $sku)->first();
        }

        if ($product && $product->trashed()) {
            $product->restore();
        }

        // Ensure unique slug if creating a new product
        if (!$product) {
            $baseSlug = $slug;
            $counter = 1;
            while (Product::withTrashed()->where('slug', $slug)->exists()) {
                if ($wcId) {
                    $slug = "{$baseSlug}-{$wcId}";
                    if (Product::withTrashed()->where('slug', $slug)->exists()) {
                        $slug = "{$baseSlug}-{$wcId}-{$counter}";
                    }
                } else {
                    $slug = "{$baseSlug}-{$counter}";
                }
                $counter++;
            }
        } else {
            $slug = $product->slug;
        }

        // Robust pricing parsing
        $regularPrice = isset($row['Regular price']) && is_numeric($row['Regular price']) ? (float)$row['Regular price'] : 0.00;
        $salePrice = isset($row['Sale price']) && is_numeric($row['Sale price']) ? (float)$row['Sale price'] : null;
        
        $wholesalePrice = isset($row['Meta: wholesale_price']) && is_numeric($row['Meta: wholesale_price'])
            ? (float)$row['Meta: wholesale_price']
            : ($regularPrice > 0 ? round($regularPrice * 0.5, 2) : 0.00);

        $moq = isset($row['Meta: moq']) && is_numeric($row['Meta: moq']) ? (int)$row['Meta: moq'] : 50;

        // Weight parsing (lbs / kg)
        $weightKg = null;
        if (!empty($row['Weight (kg)']) && is_numeric($row['Weight (kg)'])) {
            $weightKg = (float)$row['Weight (kg)'];
        } elseif (!empty($row['Weight (lbs)']) && is_numeric($row['Weight (lbs)'])) {
            $weightKg = round((float)$row['Weight (lbs)'] * 0.453592, 2);
        } elseif (!empty($row['Weight']) && is_numeric($row['Weight'])) {
            $weightKg = (float)$row['Weight'];
        }

        // Dimensions parsing (cm / in)
        $lengthCm = null;
        if (!empty($row['Length (cm)']) && is_numeric($row['Length (cm)'])) {
            $lengthCm = (float)$row['Length (cm)'];
        } elseif (!empty($row['Length (in)']) && is_numeric($row['Length (in)'])) {
            $lengthCm = round((float)$row['Length (in)'] * 2.54, 2);
        }

        $widthCm = null;
        if (!empty($row['Width (cm)']) && is_numeric($row['Width (cm)'])) {
            $widthCm = (float)$row['Width (cm)'];
        } elseif (!empty($row['Width (in)']) && is_numeric($row['Width (in)'])) {
            $widthCm = round((float)$row['Width (in)'] * 2.54, 2);
        }

        $heightCm = null;
        if (!empty($row['Height (cm)']) && is_numeric($row['Height (cm)'])) {
            $heightCm = (float)$row['Height (cm)'];
        } elseif (!empty($row['Height (in)']) && is_numeric($row['Height (in)'])) {
            $heightCm = round((float)$row['Height (in)'] * 2.54, 2);
        }

        // SEO Meta Auto-Fill Fallbacks
        $metaTitle = $row['Meta: meta_title'] 
            ?? $row['Meta: _yoast_wpseo_title'] 
            ?? $row['Meta: rank_math_title'] 
            ?? (!empty($name) ? Str::limit($name, 60, '') : null);

        $metaDescription = $row['Meta: meta_description'] 
            ?? $row['Meta: _yoast_wpseo_metadesc'] 
            ?? $row['Meta: rank_math_description'] 
            ?? null;

        if (!empty($metaDescription)) {
            $metaDescription = Str::limit(trim(preg_replace('/\s+/', ' ', str_replace(['\r\n', '\r', '\n', "\r\n", "\r", "\n"], ' ', $metaDescription))), 160, '');
        } else {
            $plainShort = !empty($row['Short description']) ? strip_tags($row['Short description']) : '';
            $plainDesc = !empty($row['Description']) ? strip_tags($row['Description']) : '';
            $sourceText = !empty($plainShort) ? $plainShort : $plainDesc;
            if (!empty($sourceText)) {
                $cleanSource = str_replace(['\r\n', '\r', '\n', "\r\n", "\r", "\n"], ' ', $sourceText);
                $metaDescription = Str::limit(trim(preg_replace('/\s+/', ' ', $cleanSource)), 160, '');
            }
        }

        $productData = [
            'wc_id' => $wcId,
            'sku' => $sku,
            'name' => $name ?: ($sku ?: 'Garment Item #' . ($wcId ?: $rowNumber)),
            'slug' => $slug,
            'product_type' => in_array($type, ['variable', 'customizable_apparel']) ? $type : 'simple',
            'status' => isset($row['Published']) && $row['Published'] === '0' ? 'draft' : 'published',
            'is_featured' => !empty($row['Is featured?']) && in_array(strtolower((string)$row['Is featured?']), ['1', 'yes', 'true']),
            'visibility' => !empty($row['Visibility in catalog']) ? trim($row['Visibility in catalog']) : 'visible',
            'short_description' => $row['Short description'] ?? null,
            'description' => $row['Description'] ?? null,
            'regular_price' => $regularPrice,
            'sale_price' => $salePrice,
            'wholesale_price' => $wholesalePrice,
            'moq' => $moq,
            'default_gsm' => !empty($row['Meta: default_gsm']) ? (int)$row['Meta: default_gsm'] : null,
            'fit' => $row['Meta: fit'] ?? null,
            'lead_time_days' => !empty($row['Meta: lead_time_days']) ? (int)$row['Meta: lead_time_days'] : 25,
            'sample_available' => !isset($row['Meta: sample_available']) || in_array(strtolower((string)$row['Meta: sample_available']), ['1', 'yes', 'true']),
            'sample_price' => !empty($row['Meta: sample_price']) ? (float)$row['Meta: sample_price'] : 75.00,
            'is_customizable' => !isset($row['Meta: is_customizable']) || in_array(strtolower((string)$row['Meta: is_customizable']), ['1', 'yes', 'true']),
            'three_d_model_path' => $row['Meta: three_d_model_path'] ?? null,
            'manage_stock' => !empty($row['In stock?']),
            'stock_quantity' => isset($row['Stock']) && is_numeric($row['Stock']) ? (int)$row['Stock'] : 0,
            'stock_status' => (isset($row['In stock?']) && ((string)$row['In stock?'] === '0' || strtolower((string)$row['In stock?']) === 'outofstock')) ? 'outofstock' : 'instock',
            'weight_kg' => $weightKg,
            'length_cm' => $lengthCm,
            'width_cm' => $widthCm,
            'height_cm' => $heightCm,
            'meta_title' => $metaTitle,
            'meta_description' => $metaDescription,
        ];

        if ($product) {
            $product->update($productData);
        } else {
            $product = Product::create($productData);
        }

        // Process Categories (Many-to-Many)
        if (!empty($row['Categories'])) {
            $this->syncCategories($product, $row['Categories']);
        }

        // Process Images
        if (!empty($row['Images'])) {
            $this->queueImages($product, $row['Images']);
        }

        // Process Wholesale Tiers (if specified in Meta)
        if (!empty($row['Meta: wholesale_tiers'])) {
            $tiers = json_decode($row['Meta: wholesale_tiers'], true);
            if (is_array($tiers)) {
                $product->wholesaleTiers()->delete();
                foreach ($tiers as $index => $t) {
                    ProductWholesaleTier::create([
                        'product_id' => $product->id,
                        'min_quantity' => (int)($t['min_quantity'] ?? $t['minQty'] ?? 50),
                        'max_quantity' => isset($t['max_quantity']) ? (int)$t['max_quantity'] : (isset($t['maxQty']) ? (int)$t['maxQty'] : null),
                        'unit_price' => (float)($t['unit_price'] ?? $t['unitPrice'] ?? $wholesalePrice),
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        return $product;
    }

    protected function processVariationRow(array $row, string $parentSku, array &$parentMap, int $rowNumber, ImportJob $job): void
    {
        $parentProduct = null;

        if (!empty($parentSku)) {
            if (isset($parentMap[$parentSku])) {
                $parentProduct = $parentMap[$parentSku];
            } elseif (isset($parentMap['id_' . $parentSku])) {
                $parentProduct = $parentMap['id_' . $parentSku];
            } else {
                $parentProduct = Product::where('sku', $parentSku)->first();
            }
        }

        // Fallback: Check Parent ID column
        if (!$parentProduct && !empty($row['Parent'])) {
            $parentId = trim($row['Parent']);
            if (isset($parentMap[$parentId])) {
                $parentProduct = $parentMap[$parentId];
            } elseif (isset($parentMap['id_' . $parentId])) {
                $parentProduct = $parentMap['id_' . $parentId];
            } elseif (is_numeric($parentId)) {
                $parentProduct = Product::where('wc_id', (int)$parentId)->first();
            }
        }

        // Fallback: Infer from variant SKU (e.g. "TI-HD-001-BLK-M" -> "TI-HD-001")
        if (!$parentProduct && !empty($row['SKU'])) {
            foreach ($parentMap as $key => $p) {
                if (is_string($key) && !str_starts_with($key, 'id_') && !str_starts_with($key, 'slug_') && str_starts_with(trim($row['SKU']), $key)) {
                    $parentProduct = $p;
                    break;
                }
            }
        }

        if (!$parentProduct) {
            throw new \Exception("Parent product not found for variation at row {$rowNumber}. (Parent: '{$parentSku}', SKU: '" . ($row['SKU'] ?? '') . "')");
        }

        // Ensure parent is marked variable
        if ($parentProduct->product_type !== 'variable') {
            $parentProduct->update(['product_type' => 'variable']);
        }

        $sku = !empty($row['SKU']) ? trim($row['SKU']) : ($parentProduct->sku ?: 'PROD-' . $parentProduct->id) . '-VAR-' . ($row['ID'] ?? uniqid());
        $regularPrice = isset($row['Regular price']) && is_numeric($row['Regular price']) ? (float)$row['Regular price'] : $parentProduct->regular_price;
        $salePrice = isset($row['Sale price']) && is_numeric($row['Sale price']) ? (float)$row['Sale price'] : null;
        $wholesalePrice = isset($row['Meta: wholesale_price']) && is_numeric($row['Meta: wholesale_price']) ? (float)$row['Meta: wholesale_price'] : $parentProduct->wholesale_price;

        $weightKg = null;
        if (!empty($row['Weight (kg)']) && is_numeric($row['Weight (kg)'])) {
            $weightKg = (float)$row['Weight (kg)'];
        } elseif (!empty($row['Weight (lbs)']) && is_numeric($row['Weight (lbs)'])) {
            $weightKg = round((float)$row['Weight (lbs)'] * 0.453592, 2);
        }

        $variant = ProductVariant::updateOrCreate(
            ['sku' => $sku],
            [
                'product_id' => $parentProduct->id,
                'wc_variant_id' => !empty($row['ID']) && is_numeric($row['ID']) ? (int)$row['ID'] : null,
                'regular_price' => $regularPrice,
                'sale_price' => $salePrice,
                'wholesale_price' => $wholesalePrice,
                'stock_quantity' => isset($row['Stock']) && is_numeric($row['Stock']) ? (int)$row['Stock'] : 0,
                'manage_stock' => !empty($row['In stock?']),
                'stock_status' => (isset($row['In stock?']) && ((string)$row['In stock?'] === '0' || strtolower((string)$row['In stock?']) === 'outofstock')) ? 'outofstock' : 'instock',
                'weight_kg' => $weightKg,
            ]
        );

        // Sync Variant Attributes
        for ($i = 1; $i <= 10; $i++) {
            $attrName = trim($row["Attribute {$i} name"] ?? '');
            $attrValue = trim($row["Attribute {$i} value(s)"] ?? '');

            if (!empty($attrName) && !empty($attrValue)) {
                $attr = Attribute::firstOrCreate(
                    ['slug' => Str::slug($attrName)],
                    ['name' => $attrName]
                );

                $val = AttributeValue::firstOrCreate(
                    [
                        'attribute_id' => $attr->id,
                        'slug' => Str::slug($attrValue),
                    ],
                    [
                        'label' => $attrValue,
                        'sort_order' => 0,
                    ]
                );

                $variant->attributeValues()->syncWithoutDetaching([$val->id]);
            }
        }
    }

    protected function syncCategories(Product $product, string $categoryString): void
    {
        $rawCategories = explode(',', $categoryString);
        $categoryIds = [];
        $isFirst = true;

        foreach ($rawCategories as $rawCat) {
            $rawCat = trim($rawCat);
            if (empty($rawCat)) continue;

            // Handle hierarchical categories: "Sporting Goods > Championship Belts"
            $parts = explode('>', $rawCat);
            $parentId = null;

            foreach ($parts as $part) {
                $partName = trim($part);
                if (empty($partName)) continue;

                $slug = Str::slug($partName);
                $cat = Category::firstOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $partName,
                        'parent_id' => $parentId,
                        'is_active' => true,
                    ]
                );
                $parentId = $cat->id;
                $categoryIds[$cat->id] = ['is_primary' => $isFirst];
                $isFirst = false;
            }
        }

        if (!empty($categoryIds)) {
            $product->categories()->sync($categoryIds);
        }
    }

    protected function queueImages(Product $product, string $imagesString): void
    {
        // Support comma and newline separated image URLs
        $cleanedString = str_replace(["\r\n", "\r", "\n"], ',', $imagesString);
        $imageUrls = array_filter(array_map('trim', explode(',', $cleanedString)));
        $isFirst = true;

        foreach ($imageUrls as $index => $url) {
            if (!empty($url) && filter_var($url, FILTER_VALIDATE_URL)) {
                // Instantly register ProductImage with remote URL so images show immediately
                $existingImage = ProductImage::where('product_id', $product->id)
                    ->where(function ($q) use ($url) {
                        $filename = basename(parse_url($url, PHP_URL_PATH));
                        $q->where('file_path', $url)
                          ->orWhere('file_path', 'like', '%' . $filename);
                    })->first();

                if (!$existingImage) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'file_path' => $url,
                        'is_primary' => $isFirst,
                        'alt_text' => $product->name,
                        'sort_order' => $index,
                    ]);
                }

                // Dispatch background image download job to cache locally
                DownloadProductImageJob::dispatch($product->id, $url, $isFirst, $index);
                $isFirst = false;
            }
        }
    }
}
