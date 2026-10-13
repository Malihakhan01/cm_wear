<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductApiController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('status', 'published')
            ->with(['categories', 'primaryImage', 'images', 'wholesaleTiers', 'variants.attributeValues']);

        if ($request->filled('category')) {
            $catSlug = $request->category;
            $cat = \App\Models\Category::where('slug', $catSlug)->first();
            if ($cat) {
                $catIds = $cat->children()->pluck('id')->push($cat->id);
                $query->whereHas('categories', fn($q) => $q->whereIn('categories.id', $catIds));
            } else {
                $query->whereHas('categories', fn($q) => $q->where('slug', $catSlug));
            }
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%");
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $perPage = min($request->integer('per_page', 250), 500);
        $products = $query->latest()->paginate($perPage);

        return response()->json($products);
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'published')
            ->with(['categories', 'images', 'wholesaleTiers', 'variants.attributeValues'])
            ->firstOrFail();

        return response()->json([
            'data' => $product,
        ]);
    }
}
