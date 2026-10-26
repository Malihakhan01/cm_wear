<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')
            ->with([
                'children' => fn($q) => $q->withCount('products')
                    ->orderByRaw('CASE WHEN sort_order > 0 THEN 0 ELSE 1 END, sort_order ASC, name ASC')
                    ->with([
                        'children' => fn($cq) => $cq->withCount('products')
                            ->orderByRaw('CASE WHEN sort_order > 0 THEN 0 ELSE 1 END, sort_order ASC, name ASC')
                    ])
            ])
            ->withCount('products')
            ->orderByRaw('CASE WHEN sort_order > 0 THEN 0 ELSE 1 END, sort_order ASC, name ASC')
            ->get();

        $totalCategories = Category::count();
        $totalParents = $categories->count();
        $l1Ids = Category::whereNull('parent_id')->pluck('id');
        $totalSubcategories = Category::whereIn('parent_id', $l1Ids)->count();
        $l2Ids = Category::whereIn('parent_id', $l1Ids)->pluck('id');
        $totalProductTypes = Category::whereIn('parent_id', $l2Ids)->count();

        // For parent select dropdown (Level 1 pillars and Level 2 subcategories)
        $parentCategories = Category::whereNull('parent_id')
            ->orderByRaw('CASE WHEN sort_order > 0 THEN 0 ELSE 1 END, sort_order ASC, name ASC')
            ->with(['children' => fn($q) => $q->orderByRaw('CASE WHEN sort_order > 0 THEN 0 ELSE 1 END, sort_order ASC, name ASC')])
            ->get();

        return view('admin.categories.index', compact('categories', 'totalCategories', 'totalParents', 'totalSubcategories', 'totalProductTypes', 'parentCategories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        $slug = Str::slug($validated['name']);
        $baseSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', "Category '{$validated['name']}' created successfully.");
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug,' . $category->id],
            'parent_id' => ['nullable', 'exists:categories,id', function ($attribute, $value, $fail) use ($category) {
                if ($value == $category->id) {
                    $fail('A category cannot be its own parent.');
                }
            }],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $baseSlug = $validated['slug'];
        $counter = 1;
        while (Category::where('slug', $validated['slug'])->where('id', '!=', $category->id)->exists()) {
            $validated['slug'] = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', "Category '{$category->name}' updated successfully.");
    }

    public function destroy(Category $category)
    {
        $name = $category->name;
        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', "Category '{$name}' deleted.");
    }
}
