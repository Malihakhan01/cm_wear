@extends('layouts.admin')

@section('title', 'Articles & Blog Management')
@section('header_title', 'Blog & Editorial Articles')

@section('content')
<div class="space-y-6">
    
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Editorial & Manufacturing Articles</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Publish garment guides, factory insights, fabric education, and customizer tutorials</p>
        </div>

        <div class="flex items-center gap-3">
            <a href="{{ route('admin.blogs.categories.index') }}" class="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <span>Manage Categories</span>
            </a>

            <a href="{{ route('admin.blogs.create') }}" class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span>Write New Article</span>
            </a>
        </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form method="GET" action="{{ route('admin.blogs.index') }}" class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div class="relative flex-1 min-w-[240px]">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" 
                       name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Search by article title, summary or content..." 
                       class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500">
            </div>

            <div class="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <select name="category_id" class="w-full sm:w-auto min-w-[170px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Categories</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                    @endforeach
                </select>

                <select name="status" class="w-full sm:w-auto min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Statuses</option>
                    <option value="published" {{ request('status') === 'published' ? 'selected' : '' }}>Published</option>
                    <option value="draft" {{ request('status') === 'draft' ? 'selected' : '' }}>Draft</option>
                    <option value="archived" {{ request('status') === 'archived' ? 'selected' : '' }}>Archived</option>
                </select>

                <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    <span>Filter</span>
                </button>

                @if(request()->hasAny(['search', 'category_id', 'status']))
                    <a href="{{ route('admin.blogs.index') }}" class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Blog Posts Grid / Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($posts->isEmpty())
            <div class="py-16 text-center text-slate-400 text-sm">
                <p>No blog articles published yet.</p>
                <a href="{{ route('admin.blogs.create') }}" class="mt-3 inline-block font-bold text-blue-600 dark:text-blue-400 hover:underline">Write the first article &rarr;</a>
            </div>
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($posts as $post)
                    <div class="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-950/60 transition hover:shadow-md">
                        <!-- Cover Image Preview -->
                        <div class="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            @if($post->cover_image)
                                <img src="{{ $post->cover_image }}" alt="{{ $post->title }}" class="h-full w-full object-cover">
                            @else
                                <div class="h-full w-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                                    No Cover Image
                                </div>
                            @endif

                            <div class="absolute top-3 left-3 flex gap-2">
                                <span class="rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                                    {{ $post->category->name ?? 'Uncategorized' }}
                                </span>
                            </div>

                            <div class="absolute top-3 right-3">
                                <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider {{ $post->status === 'published' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white' }}">
                                    {{ $post->status }}
                                </span>
                            </div>
                        </div>

                        <!-- Content Info -->
                        <div class="flex flex-1 flex-col p-5 space-y-3">
                            <h3 class="font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                {{ $post->title }}
                            </h3>

                            @if($post->summary)
                                <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {!! strip_tags($post->summary) !!}
                                </p>
                            @endif

                            <div class="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                                <span>{{ $post->published_at?->format('M d, Y') ?? 'Unscheduled' }}</span>
                                <span>{{ $post->views_count }} views</span>
                            </div>

                            <!-- Actions -->
                            <div class="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                                <div class="flex items-center gap-3">
                                    <a href="{{ route('admin.blogs.edit', $post->id) }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Edit
                                    </a>
                                    @if($post->status === 'published')
                                        <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/blog/{{ $post->slug }}" target="_blank" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                                            <span>View on Live Site &nearr;</span>
                                        </a>
                                    @endif
                                </div>

                                <form method="POST" action="{{ route('admin.blogs.destroy', $post->id) }}" onsubmit="return confirm('Delete this article?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">Delete</button>
                                </form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="mt-6">
                {{ $posts->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
