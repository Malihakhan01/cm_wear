<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\ProductWholesaleTier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['categories', 'primaryImage', 'images', 'wholesaleTiers', 'variants']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('product_type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', (int) $request->category);
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $allowedPerPage = [10, 15, 25, 50, 100, 250];
        $perPage = in_array((int) $request->get('per_page'), $allowedPerPage)
            ? (int) $request->get('per_page')
            : 15;

        $products = $query->latest()->paginate($perPage)->withQueryString();

        $categories = Category::orderBy('name')->get();

        return view('admin.products.index', compact('products', 'categories', 'perPage'));
    }

    public function create()
    {
        $categories = Category::whereNull('parent_id')
            ->orderByRaw('CASE WHEN sort_order > 0 THEN 0 ELSE 1 END, sort_order ASC, name ASC')
            ->with(['children' => fn($q) => $q->orderBy('sort_order')->orderBy('name')])
            ->get();

        return view('admin.products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'product_type' => ['required', 'in:simple,variable,customizable_apparel'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'moq' => ['required', 'integer', 'min:1'],
            'default_gsm' => ['nullable', 'integer'],
            'fit' => ['nullable', 'string'],
            'lead_time_days' => ['required', 'integer', 'min:1'],
            'sample_available' => ['nullable', 'boolean'],
            'sample_price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:published,draft,archived'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'categories' => ['nullable', 'array'],
            'primary_image' => ['nullable', 'image', 'max:10240'],
            'primary_image_url' => ['nullable', 'string', 'max:1000'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['nullable', 'image', 'max:10240'],
            'wholesale_tiers' => ['nullable', 'array'],
            'wholesale_tiers.*.min_quantity' => ['nullable', 'integer', 'min:1'],
            'wholesale_tiers.*.max_quantity' => ['nullable', 'integer', 'min:1'],
            'wholesale_tiers.*.unit_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $slug = Str::slug($validated['name']);
        $baseSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_customizable'] = $request->boolean('is_customizable');
        $validated['sample_available'] = $request->boolean('sample_available', true);

        // Determine base wholesale price from Tier 1 if available
        $tiers = $request->input('wholesale_tiers', []);
        $firstTierPrice = null;
        if (!empty($tiers)) {
            foreach ($tiers as $t) {
                if (isset($t['unit_price']) && is_numeric($t['unit_price'])) {
                    $firstTierPrice = (float) $t['unit_price'];
                    break;
                }
            }
        }
        $validated['wholesale_price'] = $firstTierPrice ?? ($request->filled('wholesale_price') ? (float) $request->wholesale_price : (float) $validated['regular_price']);

        $validated['meta_title'] = !empty($validated['meta_title']) ? $validated['meta_title'] : $validated['name'];
        $validated['meta_description'] = $this->sanitizeMetaDescription($validated['meta_description'] ?? null, $validated['short_description'] ?? null, $validated['description'] ?? null);

        $product = Product::create($validated);

        if (!empty($request->categories)) {
            $product->categories()->sync($request->categories);
        }

        // Save Alibaba 4-Tier Wholesale Pricing
        $this->saveWholesaleTiers($product, $request->input('wholesale_tiers', []));

        // Handle Primary / Main Image
        if ($request->hasFile('primary_image')) {
            $path = $request->file('primary_image')->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                'file_path' => $path,
                'is_primary' => true,
                'alt_text' => $product->name,
                'sort_order' => 0,
            ]);
        } elseif ($request->filled('primary_image_url')) {
            ProductImage::create([
                'product_id' => $product->id,
                'file_path' => $request->primary_image_url,
                'is_primary' => true,
                'alt_text' => $product->name,
                'sort_order' => 0,
            ]);
        }

        // Handle Gallery Images
        if ($request->hasFile('gallery_images')) {
            $sort = 1;
            foreach ($request->file('gallery_images') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'file_path' => $path,
                        'is_primary' => false,
                        'alt_text' => $product->name . " gallery {$sort}",
                        'sort_order' => $sort,
                    ]);
                    $sort++;
                }
            }
        }

        return redirect()->route('admin.products.edit', $product->id)
            ->with('success', "Product '{$product->name}' created successfully with 4-tier MOQ pricing.");
    }

    public function edit(Product $product)
    {
        $product->load(['categories', 'wholesaleTiers', 'variants.attributeValues', 'images']);
        $categories = Category::whereNull('parent_id')
            ->orderByRaw('CASE WHEN sort_order > 0 THEN 0 ELSE 1 END, sort_order ASC, name ASC')
            ->with(['children' => fn($q) => $q->orderBy('sort_order')->orderBy('name')])
            ->get();

        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:products,sku,' . $product->id],
            'product_type' => ['required', 'in:simple,variable,customizable_apparel'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'moq' => ['required', 'integer', 'min:1'],
            'default_gsm' => ['nullable', 'integer'],
            'fit' => ['nullable', 'string'],
            'lead_time_days' => ['required', 'integer', 'min:1'],
            'sample_available' => ['nullable', 'boolean'],
            'sample_price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:published,draft,archived'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'canonical_url' => ['nullable', 'string'],
            'categories' => ['nullable', 'array'],
            'primary_image' => ['nullable', 'image', 'max:10240'],
            'primary_image_url' => ['nullable', 'string', 'max:1000'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['nullable', 'image', 'max:10240'],
            'wholesale_tiers' => ['nullable', 'array'],
            'wholesale_tiers.*.min_quantity' => ['nullable', 'integer', 'min:1'],
            'wholesale_tiers.*.max_quantity' => ['nullable', 'integer', 'min:1'],
            'wholesale_tiers.*.unit_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_customizable'] = $request->boolean('is_customizable');
        $validated['sample_available'] = $request->boolean('sample_available', true);

        // Determine base wholesale price from Tier 1 if available
        $tiers = $request->input('wholesale_tiers', []);
        $firstTierPrice = null;
        if (!empty($tiers)) {
            foreach ($tiers as $t) {
                if (isset($t['unit_price']) && is_numeric($t['unit_price'])) {
                    $firstTierPrice = (float) $t['unit_price'];
                    break;
                }
            }
        }
        $validated['wholesale_price'] = $firstTierPrice ?? ($request->filled('wholesale_price') ? (float) $request->wholesale_price : (float) $validated['regular_price']);

        $validated['meta_title'] = !empty($validated['meta_title']) ? $validated['meta_title'] : $validated['name'];
        $validated['meta_description'] = $this->sanitizeMetaDescription($validated['meta_description'] ?? null, $validated['short_description'] ?? null, $validated['description'] ?? null);

        $product->update($validated);

        $product->categories()->sync($request->input('categories', []));

        // Save Alibaba 4-Tier Wholesale Pricing
        $this->saveWholesaleTiers($product, $request->input('wholesale_tiers', []));

        // Handle Primary / Main Image replacement
        if ($request->hasFile('primary_image')) {
            // Unmark existing primary images
            ProductImage::where('product_id', $product->id)->where('is_primary', true)->update(['is_primary' => false]);
            $path = $request->file('primary_image')->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                'file_path' => $path,
                'is_primary' => true,
                'alt_text' => $product->name,
                'sort_order' => 0,
            ]);
        } elseif ($request->filled('primary_image_url')) {
            ProductImage::where('product_id', $product->id)->where('is_primary', true)->update(['is_primary' => false]);
            ProductImage::create([
                'product_id' => $product->id,
                'file_path' => $request->primary_image_url,
                'is_primary' => true,
                'alt_text' => $product->name,
                'sort_order' => 0,
            ]);
        } elseif ($request->filled('set_primary_image_id')) {
            $targetImage = ProductImage::where('product_id', $product->id)->where('id', $request->input('set_primary_image_id'))->first();
            if ($targetImage) {
                ProductImage::where('product_id', $product->id)->update(['is_primary' => false]);
                $targetImage->update([
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }
        }

        // Handle Additional Gallery Images upload
        if ($request->hasFile('gallery_images')) {
            $nextSort = (int) ProductImage::where('product_id', $product->id)->max('sort_order') + 1;
            foreach ($request->file('gallery_images') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'file_path' => $path,
                        'is_primary' => false,
                        'alt_text' => $product->name . " gallery {$nextSort}",
                        'sort_order' => $nextSort,
                    ]);
                    $nextSort++;
                }
            }
        }

        return redirect()->route('admin.products.edit', $product->id)
            ->with('success', "Product updated successfully.");
    }

    public function setPrimaryImage(Request $request, Product $product, ProductImage $image)
    {
        if ($image->product_id === $product->id) {
            ProductImage::where('product_id', $product->id)->update(['is_primary' => false]);
            $image->update([
                'is_primary' => true,
                'sort_order' => 0,
            ]);

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Main featured image set successfully.',
                    'image_id' => $image->id,
                    'image_url' => $image->url,
                ]);
            }

            return redirect()->back()->with('success', 'Main featured image updated successfully.');
        }

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json(['success' => false, 'message' => 'Image does not belong to this product.'], 403);
        }

        return redirect()->back()->with('error', 'Image does not belong to this product.');
    }

    public function deleteImage(Request $request, Product $product, ProductImage $image)
    {
        if ($image->product_id === $product->id) {
            if (!filter_var($image->file_path, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete($image->file_path);
            }
            $image->delete();

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'Image removed']);
            }

            return redirect()->back()->with('success', 'Image removed from product gallery.');
        }

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json(['success' => false, 'message' => 'Image not found'], 404);
        }

        return redirect()->back()->with('error', 'Image not found.');
    }

    public function destroy(Product $product)
    {
        $name = $product->name;
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', "Product '{$name}' moved to trash.");
    }

    /**
     * Helper to store/update 4-tier Alibaba style wholesale pricing
     */
    protected function saveWholesaleTiers(Product $product, array $tiers): void
    {
        if (empty($tiers)) {
            return;
        }

        // Clean out existing tiers
        ProductWholesaleTier::where('product_id', $product->id)->delete();

        $sort = 1;
        foreach ($tiers as $tier) {
            $minQty = isset($tier['min_quantity']) && is_numeric($tier['min_quantity']) ? (int) $tier['min_quantity'] : null;
            $unitPrice = isset($tier['unit_price']) && is_numeric($tier['unit_price']) ? (float) $tier['unit_price'] : null;

            if ($minQty !== null && $unitPrice !== null && $unitPrice >= 0) {
                $maxQty = isset($tier['max_quantity']) && is_numeric($tier['max_quantity']) && (int) $tier['max_quantity'] > 0
                    ? (int) $tier['max_quantity']
                    : null;

                ProductWholesaleTier::create([
                    'product_id' => $product->id,
                    'min_quantity' => $minQty,
                    'max_quantity' => $maxQty,
                    'unit_price' => $unitPrice,
                    'sort_order' => $sort,
                ]);
                $sort++;
            }
        }
    }
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:products,id'],
        ]);

        $count = Product::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('admin.products.index')
            ->with('success', "{$count} product(s) successfully deleted.");
    }

    public function bulkDeleteByDate(Request $request)
    {
        $request->validate([
            'date' => ['required', 'date'],
        ]);

        $date = $request->input('date');
        $count = Product::whereDate('created_at', $date)->delete();

        $label = ($date === now()->toDateString()) ? 'today' : "on {$date}";

        return redirect()->route('admin.products.index')
            ->with('success', "{$count} product(s) added {$label} were permanently deleted.");
    }

    protected function sanitizeMetaDescription(?string $metaDescription, ?string $shortDesc = null, ?string $desc = null): ?string
    {
        if (!empty($metaDescription)) {
            $clean = str_replace(['\r\n', '\r', '\n', "\r\n", "\r", "\n"], ' ', $metaDescription);
            return Str::limit(trim(preg_replace('/\s+/', ' ', $clean)), 160, '');
        }

        $source = !empty($shortDesc) ? $shortDesc : ($desc ?? '');
        if (!empty($source)) {
            $clean = str_replace(['\r\n', '\r', '\n', "\r\n", "\r", "\n"], ' ', strip_tags($source));
            return Str::limit(trim(preg_replace('/\s+/', ' ', $clean)), 155, '');
        }

        return null;
    }
}
