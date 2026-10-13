@extends('layouts.admin')

@section('title', 'Category Taxonomy')
@section('header_title', 'Product Categories & Pillars')

@section('content')
<div class="space-y-6">
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Add Category Form (1 Col) -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Add New Category</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Create parent pillars or subcategories</p>

            <form method="POST" action="{{ route('admin.categories.store') }}" class="space-y-4 pt-2">
                @csrf

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Category Name *</label>
                    <input type="text" name="name" required placeholder="e.g. Streetwear" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Parent Category</label>
                    <select name="parent_id" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        <option value="">None (Top-Level Pillar)</option>
                        @foreach($categories as $cat)
                            <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Featured Tagline</label>
                    <input type="text" name="tagline" placeholder="e.g. Heavyweight silhouettes & vintage stone washes" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Description</label>
                    <x-wysiwyg name="description" placeholder="Optional category overview or styling guide..." height="110px" :compact="true" />
                </div>

                <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                    Create Category
                </button>
            </form>
        </div>

        <!-- Right Column: Category Hierarchy Tree Table (2 Cols) -->
        <div class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Category Tree & Allocation</h3>

            @if($categories->isEmpty())
                <div class="py-12 text-center text-slate-400 text-sm">
                    No categories created yet.
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                                <th class="pb-3">Category Name</th>
                                <th class="pb-3">Slug</th>
                                <th class="pb-3 text-center">Products</th>
                                <th class="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                            @foreach($categories as $parent)
                                <tr class="bg-slate-50/60 dark:bg-slate-800/40 font-bold">
                                    <td class="py-3.5 text-slate-900 dark:text-white flex items-center gap-2">
                                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                        <span>{{ $parent->name }}</span>
                                    </td>
                                    <td class="py-3.5 font-mono text-xs text-slate-500">{{ $parent->slug }}</td>
                                    <td class="py-3.5 text-center font-bold text-blue-600 dark:text-blue-400">
                                        {{ $parent->products_count }}
                                    </td>
                                    <td class="py-3.5 text-right">
                                        <form method="POST" action="{{ route('admin.categories.destroy', $parent->id) }}" class="inline" onsubmit="return confirm('Delete category? Subcategories will be deleted.');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">Delete</button>
                                        </form>
                                    </td>
                                </tr>

                                @foreach($parent->children as $child)
                                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                                        <td class="py-2.5 pl-8 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <span class="text-slate-400">&mdash;</span>
                                            <span>{{ $child->name }}</span>
                                        </td>
                                        <td class="py-2.5 font-mono text-xs text-slate-400">{{ $child->slug }}</td>
                                        <td class="py-2.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            {{ $child->products_count }}
                                        </td>
                                        <td class="py-2.5 text-right">
                                            <form method="POST" action="{{ route('admin.categories.destroy', $child->id) }}" class="inline" onsubmit="return confirm('Delete subcategory?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-xs text-rose-500 hover:text-rose-700">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

    </div>

</div>
@endsection
