@extends('layouts.admin')

@section('title', 'Category Taxonomy')
@section('header_title', 'Product Categories & Pillars')

@section('content')
<div class="space-y-6" 
     x-data="{
         searchCat: '',
         expandedPillars: {},
         expandedSubs: {},
         allExpanded: true,
         isPillarExpanded(id) {
             return this.expandedPillars[id] !== false;
         },
         togglePillar(id) {
             this.expandedPillars[id] = !this.isPillarExpanded(id);
         },
         isSubExpanded(id) {
             return this.expandedSubs[id] !== false;
         },
         toggleSub(id) {
             this.expandedSubs[id] = !this.isSubExpanded(id);
         },
         toggleAll() {
             this.allExpanded = !this.allExpanded;
             const state = this.allExpanded;
             @foreach($categories as $p)
                 this.expandedPillars[{{ $p->id }}] = state;
                 @foreach($p->children as $c)
                     this.expandedSubs[{{ $c->id }}] = state;
                 @endforeach
             @endforeach
         },
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

    <!-- Top Summary Metrics Bar (4-Tier Cards) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Categories -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Categories</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{{ $totalCategories }}</p>
                <span class="text-[10px] text-slate-400 font-mono">All Taxonomy Tiers</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
        </div>

        <!-- Card 2: Parent Pillars (L1) -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pillars (Level 1)</p>
                <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{{ $totalParents }}</p>
                <span class="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">Main Divisions</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            </div>
        </div>

        <!-- Card 3: Subcategories (L2) -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subcategories (Level 2)</p>
                <p class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{{ $totalSubcategories }}</p>
                <span class="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 font-mono">Sports & Segments</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
            </div>
        </div>

        <!-- Card 4: Product Types (L3) -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Product Types (Level 3)</p>
                <p class="text-2xl font-black text-amber-500 dark:text-amber-400 mt-0.5">{{ $totalProductTypes }}</p>
                <span class="text-[10px] text-amber-500/80 dark:text-amber-400/80 font-mono">Specific Garment Types</span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            </div>
        </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Add Category Form (1 Col) -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Add New Category</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Create parent pillar, subcategory, or product type</p>
            </div>

            <!-- Hierarchy Guide Card -->
            <div class="rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 p-3 text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <p class="font-bold flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    3-Level Hierarchy System:
                </p>
                <p class="text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-300/80">
                    <strong>Level 1:</strong> Pillar (e.g. <em>Team Sports Wear</em>)<br>
                    <strong>Level 2:</strong> Subcategory (e.g. <em>Ice Hockey</em>)<br>
                    <strong>Level 3:</strong> Product Type (e.g. <em>Game Jerseys</em>)
                </p>
            </div>

            <form method="POST" action="{{ route('admin.categories.store') }}" class="space-y-4 pt-1">
                @csrf

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Category Name *</label>
                    <input type="text" name="name" required placeholder="e.g. Game Jerseys or Ice Hockey" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Parent Category</label>
                    <select name="parent_id" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        <option value="">None (Top-Level Pillar - Level 1)</option>
                        @foreach($parentCategories as $pCat)
                            <option value="{{ $pCat->id }}" class="font-bold text-slate-900 dark:text-white">📁 {{ $pCat->name }} (Level 1 Pillar)</option>
                            @foreach($pCat->children as $cCat)
                                <option value="{{ $cCat->id }}" class="text-slate-600 dark:text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;↳ {{ $cCat->name }} (Level 2 Subcategory of {{ $pCat->name }})</option>
                            @endforeach
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Featured Tagline</label>
                    <input type="text" name="tagline" placeholder="e.g. Custom teamwear and tournament kits" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
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
                    <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Category Hierarchy Tree</span>
                        <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">3 Levels</span>
                    </h3>
                    <p class="text-xs text-slate-400">Pillar (L1) &rarr; Subcategory (L2) &rarr; Product Type (L3)</p>
                </div>

                <div class="flex items-center gap-2">
                    <button type="button" 
                            @click="toggleAll()" 
                            class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        <span x-text="allExpanded ? 'Collapse All' : 'Expand All'"></span>
                    </button>

                    <div class="relative min-w-[180px] sm:min-w-[220px]">
                        <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" 
                               x-model="searchCat" 
                               placeholder="Filter taxonomy..." 
                               class="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                </div>
            </div>

            @if($categories->isEmpty())
                <div class="py-12 text-center text-slate-400 text-sm">
                    No categories created yet.
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
                                <th class="py-3 px-3">Category Name & Hierarchy</th>
                                <th class="py-3 px-3">Slug (Route)</th>
                                <th class="py-3 px-3 text-center">Hierarchy Tier</th>
                                <th class="py-3 px-3 text-center">Products</th>
                                <th class="py-3 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
                            @foreach($categories as $parent)
                                <!-- Level 1: Parent Pillar Row -->
                                <tr class="bg-slate-100/90 dark:bg-slate-800/80 font-bold border-t-2 border-slate-200 dark:border-slate-700/60 transition hover:bg-slate-200/70 dark:hover:bg-slate-800"
                                    x-show="!searchCat || '{{ strtolower($parent->name . ' ' . $parent->slug . ' ' . $parent->children->pluck('name')->join(' ') . ' ' . $parent->children->flatMap->children->pluck('name')->join(' ')) }}'.includes(searchCat.toLowerCase())">
                                    <td class="py-3 px-3 text-slate-900 dark:text-white flex items-center gap-2.5">
                                        <button type="button" 
                                                @click.stop="togglePillar({{ $parent->id }})" 
                                                class="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                                            <svg class="w-3.5 h-3.5 transition-transform duration-150" 
                                                 :class="isPillarExpanded({{ $parent->id }}) ? 'rotate-90 text-blue-500' : ''" 
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                        <div class="w-6 h-6 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                        </div>
                                        <span class="font-extrabold text-xs uppercase tracking-tight">{{ $parent->name }}</span>
                                    </td>
                                    <td class="py-3 px-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                                        <a href="/catalog/?category={{ $parent->slug }}" target="_blank" class="hover:underline hover:text-blue-500 inline-flex items-center gap-1">
                                            {{ $parent->slug }}
                                            <svg class="w-2.5 h-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        </a>
                                    </td>
                                    <td class="py-3 px-3 text-center">
                                        <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                            <span>L1 Pillar</span>
                                            <span class="opacity-60">&bull;</span>
                                            <span>{{ $parent->children->count() }} Subcats</span>
                                        </span>
                                    </td>
                                    <td class="py-3 px-3 text-center">
                                        <span class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{{ $parent->products_count }}</span>
                                    </td>
                                    <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                                        <button type="button" 
                                                @click="openEdit({
                                                    id: {{ $parent->id }},
                                                    name: {{ Js::from($parent->name) }},
                                                    slug: {{ Js::from($parent->slug) }},
                                                    parent_id: '',
                                                    tagline: {{ Js::from($parent->tagline ?? '') }},
                                                    description: {{ Js::from($parent->description ?? '') }}
                                                })"
                                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition">
                                            Edit
                                        </button>
                                        <form method="POST" action="{{ route('admin.categories.destroy', $parent->id) }}" class="inline" onsubmit="return confirm('Delete category? Subcategories will be deleted.');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition">Delete</button>
                                        </form>
                                    </td>
                                </tr>

                                @foreach($parent->children as $child)
                                    <!-- Level 2: Subcategory Row -->
                                    <tr class="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/40"
                                        x-show="(!searchCat && isPillarExpanded({{ $parent->id }})) || (searchCat && '{{ strtolower($child->name . ' ' . $child->slug . ' ' . $parent->name . ' ' . $child->children->pluck('name')->join(' ')) }}'.includes(searchCat.toLowerCase()))">
                                        <td class="py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200">
                                            <div class="flex items-center gap-2 pl-6">
                                                <span class="text-slate-300 dark:text-slate-700 font-mono text-xs select-none">├──</span>
                                                @if($child->children->count() > 0)
                                                    <button type="button" 
                                                            @click.stop="toggleSub({{ $child->id }})" 
                                                            class="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                                                        <svg class="w-3 h-3 transition-transform duration-150" 
                                                             :class="isSubExpanded({{ $child->id }}) ? 'rotate-90 text-indigo-500' : ''" 
                                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                                        </svg>
                                                    </button>
                                                @else
                                                    <span class="w-5 inline-block"></span>
                                                @endif
                                                <span class="font-bold text-slate-800 dark:text-slate-100">{{ $child->name }}</span>
                                            </div>
                                        </td>
                                        <td class="py-2.5 px-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                                            <a href="/catalog/?category={{ $parent->slug }}&subcategory={{ $child->slug }}" target="_blank" class="hover:underline hover:text-indigo-400">
                                                {{ $child->slug }}
                                            </a>
                                        </td>
                                        <td class="py-2.5 px-3 text-center">
                                            <span class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                                                <span>L2 Subcat</span>
                                                @if($child->children->count() > 0)
                                                    <span class="opacity-60">&bull;</span>
                                                    <span>{{ $child->children->count() }} Types</span>
                                                @endif
                                            </span>
                                        </td>
                                        <td class="py-2.5 px-3 text-center font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            {{ $child->products_count }}
                                        </td>
                                        <td class="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                                            <button type="button" 
                                                    @click="openEdit({
                                                        id: {{ $child->id }},
                                                        name: {{ Js::from($child->name) }},
                                                        slug: {{ Js::from($child->slug) }},
                                                        parent_id: {{ $parent->id }},
                                                        tagline: {{ Js::from($child->tagline ?? '') }},
                                                        description: {{ Js::from($child->description ?? '') }}
                                                    })"
                                                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition">
                                                Edit
                                            </button>
                                            <form method="POST" action="{{ route('admin.categories.destroy', $child->id) }}" class="inline" onsubmit="return confirm('Delete subcategory?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition">Delete</button>
                                            </form>
                                        </td>
                                    </tr>

                                    @foreach($child->children as $grandchild)
                                        <!-- Level 3: Product Type Row -->
                                        <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition bg-slate-50/20 dark:bg-slate-950/20 border-b border-slate-100/60 dark:border-slate-800/20"
                                            x-show="(!searchCat && isPillarExpanded({{ $parent->id }}) && isSubExpanded({{ $child->id }})) || (searchCat && '{{ strtolower($grandchild->name . ' ' . $grandchild->slug . ' ' . $child->name . ' ' . $parent->name) }}'.includes(searchCat.toLowerCase()))">
                                            <td class="py-2 px-3 text-xs text-slate-600 dark:text-slate-400">
                                                <div class="flex items-center gap-2 pl-14">
                                                    <span class="text-slate-300 dark:text-slate-700 font-mono text-xs select-none">│&nbsp;&nbsp;&nbsp;└──</span>
                                                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                                                    <span class="text-xs text-slate-700 dark:text-slate-300 font-medium">{{ $grandchild->name }}</span>
                                                </div>
                                            </td>
                                            <td class="py-2 px-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                                                <a href="/catalog/?category={{ $parent->slug }}&subcategory={{ $grandchild->slug }}" target="_blank" class="hover:underline hover:text-cyan-400">
                                                    {{ $grandchild->slug }}
                                                </a>
                                            </td>
                                            <td class="py-2 px-3 text-center">
                                                <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[9px] font-mono font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                                                    <span>L3 Type</span>
                                                </span>
                                            </td>
                                            <td class="py-2 px-3 text-center font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {{ $grandchild->products_count }}
                                            </td>
                                            <td class="py-2 px-3 text-right space-x-1.5 whitespace-nowrap">
                                                <button type="button" 
                                                        @click="openEdit({
                                                            id: {{ $grandchild->id }},
                                                            name: {{ Js::from($grandchild->name) }},
                                                            slug: {{ Js::from($grandchild->slug) }},
                                                            parent_id: {{ $child->id }},
                                                            tagline: {{ Js::from($grandchild->tagline ?? '') }},
                                                            description: {{ Js::from($grandchild->description ?? '') }}
                                                        })"
                                                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition">
                                                    Edit
                                                </button>
                                                <form method="POST" action="{{ route('admin.categories.destroy', $grandchild->id) }}" class="inline" onsubmit="return confirm('Delete product type?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition">Delete</button>
                                                </form>
                                            </td>
                                        </tr>
                                    @endforeach
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
                        <p class="text-xs text-slate-400">Update category taxonomy details and hierarchy parent</p>
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
                            Parent Category
                        </label>
                        <select name="parent_id" 
                                x-model="editCategory.parent_id"
                                class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                            <option value="">None (Top-Level Pillar - Level 1)</option>
                            @foreach($parentCategories as $pCat)
                                <option value="{{ $pCat->id }}" class="font-bold text-slate-900 dark:text-white" :disabled="editCategory.id == {{ $pCat->id }}">📁 {{ $pCat->name }} (Level 1 Pillar)</option>
                                @foreach($pCat->children as $cCat)
                                    <option value="{{ $cCat->id }}" class="text-slate-600 dark:text-slate-300" :disabled="editCategory.id == {{ $cCat->id }}">&nbsp;&nbsp;&nbsp;&nbsp;↳ {{ $cCat->name }} (Level 2 Subcategory of {{ $pCat->name }})</option>
                                @endforeach
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
