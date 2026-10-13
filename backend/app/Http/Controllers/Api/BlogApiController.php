<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogApiController extends Controller
{
    /**
     * List published blog posts with optional category filter & pagination.
     */
    public function index(Request $request)
    {
        $query = BlogPost::with(['category', 'author'])
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at');

        if ($request->filled('category')) {
            $catSlug = $request->category;
            $query->whereHas('category', fn ($q) => $q->where('slug', $catSlug));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $posts = $query->paginate($request->integer('per_page', 9));

        return response()->json([
            'success' => true,
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Show a single article by slug and increment view count.
     */
    public function show(string $slug)
    {
        $post = BlogPost::with(['category', 'author'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $post->increment('views_count');

        $related = BlogPost::with(['category'])
            ->where('status', 'published')
            ->where('id', '!=', $post->id)
            ->where('blog_category_id', $post->blog_category_id)
            ->latest('published_at')
            ->limit(3)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $post,
            'related' => $related,
        ]);
    }

    /**
     * List all active blog categories.
     */
    public function categories()
    {
        $categories = BlogCategory::where('is_active', true)
            ->withCount(['posts' => fn ($q) => $q->where('status', 'published')])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
