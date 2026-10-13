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

        $products = $query->latest()->paginate(15);

        return view('admin.products.index', compact('products'));
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
        $validated['meta_description'] = !empty($validated['meta_description']) ? $validated['meta_description'] : (!empty($validated['short_description']) ? Str::limit(strip_tags($validated['short_description']), 155) : Str::limit(strip_tags($validated['description'] ?? ''), 155));

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
        $validated['meta_description'] = !empty($validated['meta_description']) ? $validated['meta_description'] : (!empty($validated['short_description']) ? Str::limit(strip_tags($validated['short_description']), 155) : Str::limit(strip_tags($validated['description'] ?? ''), 155));

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
}

