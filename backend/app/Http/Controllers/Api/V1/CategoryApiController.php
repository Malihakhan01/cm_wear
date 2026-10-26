<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryApiController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->with([
                'children' => fn($q) => $q->where('is_active', true)
                    ->with(['children' => fn($q2) => $q2->where('is_active', true)->withCount('products')->orderBy('sort_order')->orderBy('name')])
                    ->withCount('products')
                    ->orderBy('sort_order')
                    ->orderBy('name')
            ])
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with(['children', 'products' => fn($q) => $q->where('status', 'published')->with('primaryImage')])
            ->firstOrFail();

        return response()->json([
            'data' => $category,
        ]);
    }
}
