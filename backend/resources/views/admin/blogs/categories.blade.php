@extends('layouts.admin')

@section('title', 'Blog Categories')
@section('header_title', 'Blog Article Categories')

@section('content')
<div class="space-y-6">
    
    <div class="flex items-center justify-between">
        <a href="{{ route('admin.blogs.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Articles
        </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Add Category Form (1 Col) -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Add Blog Category</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Organize articles into topics like Manufacturing, Fabric Tech, Customizer Guides</p>

            <form method="POST" action="{{ route('admin.blogs.categories.store') }}" class="space-y-4 pt-2">
                @csrf

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Category Name *</label>
                    <input type="text" name="name" required placeholder="e.g. Garment Manufacturing" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Slug (Optional)</label>
                    <input type="text" name="slug" placeholder="garment-manufacturing" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Description</label>
                    <x-wysiwyg name="description" placeholder="Optional category overview or topic focus..." height="110px" :compact="true" />
                </div>

                <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                    Create Category
                </button>
            </form>
        </div>

        <!-- Right Column: Categories Table (2 Cols) -->
        <div class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Existing Categories</h3>

            @if($categories->isEmpty())
                <div class="py-12 text-center text-slate-400 text-sm">
                    No blog categories created yet.
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                                <th class="pb-3">Category</th>
                                <th class="pb-3">Slug</th>
                                <th class="pb-3 text-center">Articles</th>
                                <th class="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                            @foreach($categories as $cat)
                                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                                    <td class="py-3.5 font-bold text-slate-900 dark:text-white">{{ $cat->name }}</td>
                                    <td class="py-3.5 font-mono text-xs text-slate-400">{{ $cat->slug }}</td>
                                    <td class="py-3.5 text-center font-bold text-blue-600 dark:text-blue-400">{{ $cat->posts_count }}</td>
                                    <td class="py-3.5 text-right">
                                        <form method="POST" action="{{ route('admin.blogs.categories.destroy', $cat->id) }}" onsubmit="return confirm('Delete category?');" class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

    </div>

</div>
@endsection
