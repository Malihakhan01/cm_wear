@extends('layouts.admin')

@section('title', 'Category Taxonomy')
@section('header_title', 'Product Categories & Pillars')

@section('content')
<div class="space-y-6" 
     x-data="{
         searchCat: '',
         editModalOpen: false,
         editCategory: {
             id: null,
             name: '',
             slug: '',
             parent_id: '',
             tagline: '',
             description: '',
             slugManuallyEdited: false
         },
         openEdit(cat) {
             this.editCategory = {
                 id: cat.id,
                 name: cat.name,
                 slug: cat.slug,
                 parent_id: cat.parent_id || '',
                 tagline: cat.tagline || '',
                 description: cat.description || '',
                 slugManuallyEdited: true
             };
             this.editModalOpen = true;
         },
         slugify(text) {
             return text.toString().toLowerCase()
                 .replace(/\s+/g, '-')
                 .replace(/[^\w\-]+/g, '')
                 .replace(/\-\-+/g, '-')
                 .replace(/^-+/, '')
                 .replace(/-+$/, '');
         },
         onEditNameInput() {
             if (!this.editCategory.slugManuallyEdited || this.editCategory.slug === '') {
                 this.editCategory.slug = this.slugify(this.editCategory.name);
             }
         }
     }"
     @keydown.escape.window="editModalOpen = false">

    <!-- Top Summary Metrics Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Categories</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{{ $totalCategories }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Parent Pillars</p>
                <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{{ $totalParents }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subcategories</p>
                <p class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{{ $totalSubcategories }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
            </div>
        </div>
    </div>
    
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
                    <textarea name="description" rows="3" placeholder="Optional category overview..." class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"></textarea>
                </div>

                <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                    Create Category
                </button>
            </form>
        </div>

        <!-- Right Column: Category Hierarchy Tree Table (2 Cols) -->
        <div class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Category Hierarchy</h3>
                    <p class="text-xs text-slate-400">Click Edit to modify names, slugs, or parent assignments</p>
                </div>

                <div class="relative min-w-[200px]">
                    <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input type="text" 
                           x-model="searchCat" 
                           placeholder="Filter categories..." 
                           class="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                </div>
            </div>

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
                                <th class="pb-3 text-center">Subcategories</th>
                                <th class="pb-3 text-center">Products</th>
                                <th class="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                            @foreach($categories as $parent)
                                <tr class="bg-slate-50/70 dark:bg-slate-800/40 font-bold transition hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                                    x-show="!searchCat || '{{ strtolower($parent->name . ' ' . $parent->slug) }}'.includes(searchCat.toLowerCase()) || '{{ strtolower($parent->children->pluck('name')->join(' ')) }}'.includes(searchCat.toLowerCase())">
                                    <td class="py-3.5 text-slate-900 dark:text-white flex items-center gap-2">
                                        <svg class="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                        <span class="font-extrabold">{{ $parent->name }}</span>
                                    </td>
                                    <td class="py-3.5 font-mono text-xs text-slate-500">
                                        {{ $parent->slug }}
                                    </td>
                                    <td class="py-3.5 text-center">
                                        <span class="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                            {{ $parent->children->count() }} Subcats
                                        </span>
                                    </td>
                                    <td class="py-3.5 text-center font-bold text-blue-600 dark:text-blue-400">
                                        {{ $parent->products_count }}
                                    </td>
                                    <td class="py-3.5 text-right space-x-2">
                                        <button type="button" 
                                                @click="openEdit({
                                                    id: {{ $parent->id }},
                                                    name: {{ Js::from($parent->name) }},
                                                    slug: {{ Js::from($parent->slug) }},
                                                    parent_id: '',
                                                    tagline: {{ Js::from($parent->tagline ?? '') }},
                                                    description: {{ Js::from($parent->description ?? '') }}
                                                })"
                                                class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                            Edit
                                        </button>
                                        <form method="POST" action="{{ route('admin.categories.destroy', $parent->id) }}" class="inline" onsubmit="return confirm('Delete category? Subcategories will be deleted.');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">Delete</button>
                                        </form>
                                    </td>
                                </tr>

                                @foreach($parent->children as $child)
                                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition"
                                        x-show="!searchCat || '{{ strtolower($child->name . ' ' . $child->slug . ' ' . $parent->name) }}'.includes(searchCat.toLowerCase())">
                                        <td class="py-2.5 pl-8 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <span class="text-slate-400">&mdash;</span>
                                            <span>{{ $child->name }}</span>
                                        </td>
                                        <td class="py-2.5 font-mono text-xs text-slate-400">{{ $child->slug }}</td>
                                        <td class="py-2.5 text-center text-xs text-slate-400">
                                            <span class="text-[10px] text-slate-400">&mdash;</span>
                                        </td>
                                        <td class="py-2.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            {{ $child->products_count }}
                                        </td>
                                        <td class="py-2.5 text-right space-x-2">
                                            <button type="button" 
                                                    @click="openEdit({
                                                        id: {{ $child->id }},
                                                        name: {{ Js::from($child->name) }},
                                                        slug: {{ Js::from($child->slug) }},
                                                        parent_id: {{ $parent->id }},
                                                        tagline: {{ Js::from($child->tagline ?? '') }},
                                                        description: {{ Js::from($child->description ?? '') }}
                                                    })"
                                                    class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                                Edit
                                            </button>
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

    <!-- Dynamic Edit Category Modal (WordPress Style) -->
    <div x-show="editModalOpen" 
         x-cloak
         class="fixed inset-0 z-50 overflow-y-auto"
         aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
             @click="editModalOpen = false"
             x-transition:enter="ease-out duration-200"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="ease-in duration-150"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:border-slate-800 dark:bg-slate-900 p-6 space-y-5"
                 x-transition:enter="ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="ease-in duration-150"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95">
                
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white" id="modal-title">Edit Category</h3>
                        <p class="text-xs text-slate-400">Update category taxonomy details and slug</p>
                    </div>
                    <button type="button" @click="editModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form method="POST" :action="'/admin/categories/' + editCategory.id" class="space-y-4">
                    @csrf
                    @method('PUT')

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                            Category Name *
                        </label>
                        <input type="text" 
                               name="name" 
                               x-model="editCategory.name" 
                               @input="onEditNameInput()"
                               required 
                               class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                Slug (URL Path) *
                            </label>
                            <span class="text-[10px] text-slate-400">e.g. /catalog?category=<span x-text="editCategory.slug"></span></span>
                        </div>
                        <input type="text" 
                               name="slug" 
                               x-model="editCategory.slug" 
                               @input="editCategory.slugManuallyEdited = true"
                               required 
                               class="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                            Parent Pillar
                        </label>
                        <select name="parent_id" 
                                x-model="editCategory.parent_id"
                                class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                            <option value="">None (Top-Level Pillar)</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                            Tagline (Optional)
                        </label>
                        <input type="text" 
                               name="tagline" 
                               x-model="editCategory.tagline"
                               placeholder="e.g. Custom teamwear and tournament kits" 
                               class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                            Description
                        </label>
                        <textarea name="description" 
                                  rows="3" 
                                  x-model="editCategory.description"
                                  class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"></textarea>
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" @click="editModalOpen = false" class="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition">
                            Cancel
                        </button>
                        <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                            Save Changes
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>

</div>
@endsection
