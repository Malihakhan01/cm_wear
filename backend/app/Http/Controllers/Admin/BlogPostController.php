<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with(['category', 'author'])->latest('created_at');

        if ($request->filled('category_id')) {
            $query->where('blog_category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('summary', 'like', "%{$s}%")
                  ->orWhere('content', 'like', "%{$s}%");
            });
        }

        $posts = $query->paginate(12)->withQueryString();
        $categories = BlogCategory::where('is_active', true)->get();

        return view('admin.blogs.index', compact('posts', 'categories'));
    }

    public function create()
    {
        $categories = BlogCategory::where('is_active', true)->orderBy('sort_order')->get();
        return view('admin.blogs.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'blog_category_id' => 'nullable|exists:blog_categories,id',
            'summary' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|string|max:500',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:300',
            'meta_keywords' => 'nullable|string|max:255',
            'status' => 'required|string|in:draft,published,archived',
            'is_featured' => 'nullable|boolean',
        ]);

        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);

        $post = BlogPost::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'blog_category_id' => $validated['blog_category_id'] ?? null,
            'author_id' => auth()->id(),
            'summary' => $validated['summary'] ?? null,
            'content' => $validated['content'],
            'cover_image' => $validated['cover_image'] ?? null,
            'meta_title' => !empty($validated['meta_title']) ? $validated['meta_title'] : $validated['title'],
            'meta_description' => !empty($validated['meta_description']) ? $validated['meta_description'] : (!empty($validated['summary']) ? Str::limit($validated['summary'], 155) : Str::limit(strip_tags($validated['content']), 155)),
            'meta_keywords' => $validated['meta_keywords'] ?? null,
            'status' => $validated['status'],
            'is_featured' => $request->boolean('is_featured'),
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return redirect()->route('admin.blogs.index')->with('success', "Article '{$post->title}' created successfully.");
    }

    public function edit(BlogPost $blog)
    {
        $categories = BlogCategory::where('is_active', true)->orderBy('sort_order')->get();
        return view('admin.blogs.edit', ['post' => $blog, 'categories' => $categories]);
    }

    public function update(Request $request, BlogPost $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => "nullable|string|max:255|unique:blog_posts,slug,{$blog->id}",
            'blog_category_id' => 'nullable|exists:blog_categories,id',
            'summary' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|string|max:500',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:300',
            'meta_keywords' => 'nullable|string|max:255',
            'status' => 'required|string|in:draft,published,archived',
            'is_featured' => 'nullable|boolean',
        ]);

        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);

        $blog->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'blog_category_id' => $validated['blog_category_id'] ?? null,
            'summary' => $validated['summary'] ?? null,
            'content' => $validated['content'],
            'cover_image' => $validated['cover_image'] ?? null,
            'meta_title' => !empty($validated['meta_title']) ? $validated['meta_title'] : $validated['title'],
            'meta_description' => !empty($validated['meta_description']) ? $validated['meta_description'] : (!empty($validated['summary']) ? Str::limit($validated['summary'], 155) : Str::limit(strip_tags($validated['content']), 155)),
            'meta_keywords' => $validated['meta_keywords'] ?? null,
            'status' => $validated['status'],
            'is_featured' => $request->boolean('is_featured'),
            'published_at' => ($validated['status'] === 'published' && !$blog->published_at) ? now() : $blog->published_at,
        ]);

        return redirect()->route('admin.blogs.index')->with('success', "Article '{$blog->title}' updated successfully.");
    }

    public function destroy(BlogPost $blog)
    {
        $blog->delete();
        return redirect()->route('admin.blogs.index')->with('success', 'Article removed.');
    }
}
