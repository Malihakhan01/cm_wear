@extends('layouts.admin')

@section('title', 'Header Menu & Mega Menu Editor')
@section('header_title', 'Header Menu & Navigation Taxonomy')

@section('content')
<script id="menu-data-current" type="application/json">@json($currentMenu)</script>
<script id="menu-data-parents" type="application/json">@json($dbParentCategories)</script>
<script id="menu-data-all" type="application/json">@json($dbAllCategories)</script>

<div class="space-y-6" x-data="menuEditor()">
    
    <!-- Header Banner & Action Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    WordPress Appearance &gt; Menus Style
                </span>
                <span class="text-xs text-slate-400">•</span>
                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Location: Header "Products" Dropdown</span>
            </div>
            <h2 class="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                Products Mega Menu & Category Navigation
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage the categories and subcategories shown in the main header mega menu dropdown. Changes reflect in real-time on the storefront.
            </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
            <form method="POST" action="{{ route('admin.menus.reset') }}" onsubmit="return confirm('Reset menu to default template? Any custom modifications will be replaced.');">
                @csrf
                <button type="submit" class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 transition">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Reset Defaults
                </button>
            </form>

            <form method="POST" action="{{ route('admin.menus.sync') }}" onsubmit="return confirm('Sync menu directly from database categories tree?');">
                @csrf
                <button type="submit" class="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 transition">
                    <svg class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z"></path></svg>
                    Sync From DB
                </button>
            </form>

            <button type="button" @click="saveMenu()" class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-blue-600/25 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Save Menu Changes
            </button>
        </div>
    </div>

    <!-- Hidden Form to submit saved JSON -->
    <form id="saveMenuForm" method="POST" action="{{ route('admin.menus.update') }}" class="hidden">
        @csrf
        <input type="hidden" name="menu" :value="JSON.stringify(menu)">
    </form>

    <!-- Main Grid: Left Side (Add Items) | Right Side (Menu Structure) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- ================= LEFT COLUMN: ADD TO MENU (4 Cols) ================= -->
        <div class="lg:col-span-4 space-y-4">
            
            <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Menu Items
                    </h3>
                    <span class="text-[11px] font-mono text-slate-400">@{{ filteredCategories.length }} Categories</span>
                </div>

                <!-- Tabs: Database Categories vs Custom Link -->
                <div class="flex border-b border-slate-200 dark:border-slate-800">
                    <button type="button" @click="addTab = 'categories'" :class="addTab === 'categories' ? 'border-b-2 border-blue-600 font-bold text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'" class="pb-2 px-3 text-xs">
                        DB Categories
                    </button>
                    <button type="button" @click="addTab = 'custom'" :class="addTab === 'custom' ? 'border-b-2 border-blue-600 font-bold text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'" class="pb-2 px-3 text-xs">
                        Custom Link
                    </button>
                </div>

                <!-- Tab 1: Database Categories -->
                <div x-show="addTab === 'categories'" class="space-y-3">
                    
                    <!-- Search Filter Box -->
                    <div class="relative">
                        <input type="text" x-model="searchQuery" placeholder="Search categories (e.g. Sportswear, Hoodies)..." class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    <!-- Category Checkbox List (Scrollable box like WordPress) -->
                    <div class="max-h-80 overflow-y-auto border border-slate-200 rounded-xl p-2.5 divide-y divide-slate-100 dark:border-slate-800 dark:divide-slate-800/60 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/30">
                        <template x-for="cat in filteredCategories" :key="cat.id">
                            <label class="flex items-center justify-between py-2 px-2 hover:bg-white dark:hover:bg-slate-800/60 rounded-lg cursor-pointer text-xs transition">
                                <div class="flex items-center gap-2.5">
                                    <input type="checkbox" :value="cat.id" x-model="selectedCategoryIds" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900">
                                    <span class="font-semibold text-slate-800 dark:text-slate-200" x-text="cat.name"></span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span x-show="cat.children && cat.children.length" class="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono" x-text="cat.children.length + ' subs'"></span>
                                    <span class="text-[10px] text-slate-400 font-mono" x-text="'#' + cat.slug"></span>
                                </div>
                            </label>
                        </template>

                        <div x-show="filteredCategories.length === 0" class="py-6 text-center text-xs text-slate-400">
                            No categories match your search.
                        </div>
                    </div>

                    <!-- Select All & Add Button -->
                    <div class="flex items-center justify-between pt-1">
                        <button type="button" @click="toggleSelectAll()" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                            <span x-text="selectedCategoryIds.length === filteredCategories.length ? 'Deselect All' : 'Select All'"></span>
                        </button>
                        <button type="button" @click="addSelectedCategoriesToMenu()" :disabled="selectedCategoryIds.length === 0" class="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white px-4 py-2 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed">
                            Add to Menu (<span x-text="selectedCategoryIds.length"></span>)
                        </button>
                    </div>
                </div>

                <!-- Tab 2: Custom Link / Pillar -->
                <div x-show="addTab === 'custom'" class="space-y-3 pt-1">
                    <div>
                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Navigation Label *</label>
                        <input type="text" x-model="customPillar.name" placeholder="e.g. Martial Arts / Compression" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Category Slug / URL *</label>
                        <input type="text" x-model="customPillar.slug" placeholder="e.g. martial-arts or /catalog?category=mma" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Number Badge</label>
                            <input type="text" x-model="customPillar.number" placeholder="e.g. 10" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Banner Image URL</label>
                            <input type="text" x-model="customPillar.image" placeholder="/categories/Casual wear (1).png" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Initial Subcategories (comma separated)</label>
                        <input type="text" x-model="customPillar.subcategories" placeholder="Judo, Karate, BJJ Gi, Belts" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    </div>
                    <button type="button" @click="addCustomPillarToMenu()" class="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white py-2.5 text-xs font-bold transition">
                        Add Custom Pillar
                    </button>
                </div>

            </div>

            <!-- Helpful Navigation Guide Tip Box -->
            <div class="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-700 dark:text-amber-400 space-y-1.5">
                <div class="font-bold flex items-center gap-1.5">
                    <svg class="w-4 h-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    How the Mega Menu Renders:
                </div>
                <p class="leading-relaxed text-[11px]">
                    The <strong>left column</strong> of the Header dropdown displays each Category Pillar in order with its number badge. Hovering or clicking a pillar reveals its <strong>subcategories grid in the middle</strong> and the <strong>promotional card on the right</strong>.
                </p>
            </div>

        </div>

        <!-- ================= RIGHT COLUMN: MENU STRUCTURE (8 Cols) ================= -->
        <div class="lg:col-span-8 space-y-4">
            
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
                <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">
                            Mega Menu Structure: Products Dropdown
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Reorder pillars, edit subcategories, and customize images. Click "Save Menu Changes" when finished.
                        </p>
                    </div>
                    <span class="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span x-text="menu.length"></span> Active Pillars
                    </span>
                </div>

                <!-- Empty State -->
                <div x-show="menu.length === 0" class="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                    <svg class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                    <div class="text-sm font-semibold text-slate-600 dark:text-slate-400">Your Mega Menu is currently empty</div>
                    <p class="text-xs text-slate-400 max-w-sm mx-auto">Select categories from the left column or click "Sync From DB" to load your categories tree.</p>
                </div>

                <!-- Draggable / Orderable Category Pillars List -->
                <div class="space-y-3">
                    <template x-for="(item, index) in menu" :key="item._uid">
                        <div class="rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40 overflow-hidden shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700">
                            
                            <!-- Accordion Header Bar -->
                            <div class="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                                
                                <div class="flex items-center gap-3">
                                    <!-- Order Controls (Up / Down) -->
                                    <div class="flex flex-col gap-0.5">
                                        <button type="button" @click="moveUp(index)" :disabled="index === 0" class="text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400">
                                             <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path></svg>
                                        </button>
                                        <button type="button" @click="moveDown(index)" :disabled="index === menu.length - 1" class="text-slate-400 hover:text-blue-600 disabled:opacity-20 disabled:hover:text-slate-400">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                    </div>

                                    <!-- Pillar Number Badge -->
                                    <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-blue-600 dark:text-blue-400" x-text="item.number || (index + 1 < 10 ? '0' + (index + 1) : index + 1)"></span>

                                    <!-- Title & Slug -->
                                    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                        <span class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight" x-text="item.name"></span>
                                        <span class="text-[11px] font-mono text-slate-400" x-text="'/catalog?category=' + item.slug"></span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <!-- Subcategories Count Badge -->
                                    <span class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-semibold" x-text="(item.subcategories ? item.subcategories.length : 0) + ' Subcategories'"></span>

                                    <!-- Expand / Edit Button -->
                                    <button type="button" @click="item.open = !item.open" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                        <svg class="w-4 h-4 transition-transform duration-200" :class="item.open ? 'rotate-180 text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>

                                    <!-- Remove Button -->
                                    <button type="button" @click.stop="removePillar(item)" title="Remove pillar from mega menu" class="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>

                            </div>

                            <!-- Expandable Drawer to Edit Pillar Details -->
                            <div x-show="item.open" x-transition class="p-5 border-t border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 space-y-4 text-xs">
                                
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Navigation Label *</label>
                                        <input type="text" x-model="item.name" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-semibold focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Category Slug / Filter *</label>
                                        <input type="text" x-model="item.slug" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Index Number Badge</label>
                                        <input type="text" x-model="item.number" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Promotional Banner Image URL</label>
                                        <input type="text" x-model="item.image" placeholder="/categories/Casual wear (1).png" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Card Tagline / Sourcing Hook</label>
                                        <input type="text" x-model="item.tagline" placeholder="Minimum order 30–50 pieces with full Pantone lab-dip matching..." class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    </div>
                                </div>

                                <!-- Subcategories Management Box -->
                                <div class="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-2.5">
                                    <div class="flex items-center justify-between">
                                        <label class="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            Subcategories Grid (<span x-text="item.subcategories ? item.subcategories.length : 0"></span> Items)
                                        </label>
                                        <span class="text-[10px] text-slate-400">Shown in the center column when hovered</span>
                                    </div>

                                    <!-- Subcategories Badges List -->
                                    <div class="flex flex-wrap gap-2 p-3 bg-slate-100/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[50px]">
                                        <template x-for="(sub, subIdx) in item.subcategories" :key="subIdx">
                                            <span class="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                                                <span x-text="sub"></span>
                                                <button type="button" @click="removeSubcategory(item, subIdx)" class="text-slate-400 hover:text-rose-500 ml-1">
                                                    &times;
                                                </button>
                                            </span>
                                        </template>

                                        <div x-show="!item.subcategories || item.subcategories.length === 0" class="text-xs text-slate-400 italic flex items-center">
                                            No subcategories yet. Type below or pick from DB categories.
                                        </div>
                                    </div>

                                    <!-- Add Subcategory Input & Dropdown -->
                                    <div class="flex flex-col sm:flex-row gap-2 items-center">
                                        <div class="relative flex-1 w-full">
                                            <input type="text" x-model="item.newSubcategoryInput" @keydown.enter.prevent="addSubcategory(item)" placeholder="Type new subcategory and press Enter..." class="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                        </div>

                                        <!-- Quick Pick from Database Categories -->
                                        <div class="w-full sm:w-auto shrink-0 flex items-center gap-2">
                                            <select @change="if($event.target.value) { addSubcategoryFromSelect(item, $event.target.value); $event.target.value = ''; }" class="rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                                <option value="">+ Pick from DB Categories</option>
                                                <template x-for="dbCat in allCategories" :key="dbCat.id">
                                                    <option :value="dbCat.name" x-text="dbCat.name"></option>
                                                </template>
                                            </select>

                                            <button type="button" @click="addSubcategory(item)" class="rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-bold text-white transition">
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </template>
                </div>

                <!-- Bottom Save Actions Bar -->
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-mono">
                        Tip: Auto-numbered pillars will be rendered as 01, 02... on the live header.
                    </span>
                    <button type="button" @click="saveMenu()" class="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/25 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Save Menu Changes
                    </button>
                </div>

            </div>

        </div>

    </div>

</div>

<!-- Alpine.js Menu Editor Logic -->
<script>
function menuEditor() {
    const parseJsonEl = (id) => {
        try {
            const el = document.getElementById(id);
            return el ? JSON.parse(el.textContent || '[]') : [];
        } catch (e) {
            console.warn('Failed parsing ' + id, e);
            return [];
        }
    };
    const initialMenu = parseJsonEl('menu-data-current');
    const parentCategories = parseJsonEl('menu-data-parents');
    const allCategories = parseJsonEl('menu-data-all');

    return {
        menu: (initialMenu || []).map((m, idx) => ({
            ...m,
            _uid: 'pillar-' + idx + '-' + Math.random().toString(36).substring(2, 8),
            number: m.number || (idx + 1 < 10 ? '0' + (idx + 1) : String(idx + 1)),
            subcategories: Array.isArray(m.subcategories) ? [...m.subcategories] : [],
            open: false,
            newSubcategoryInput: ''
        })),
        parentCategories: parentCategories || [],
        allCategories: allCategories || [],
        addTab: 'categories',
        searchQuery: '',
        selectedCategoryIds: [],
        customPillar: {
            name: '',
            slug: '',
            number: '',
            image: '/categories/Casual wear (1).png',
            subcategories: ''
        },

        get filteredCategories() {
            if (!this.searchQuery) return this.parentCategories;
            const q = this.searchQuery.toLowerCase();
            return this.parentCategories.filter(c => 
                c.name.toLowerCase().includes(q) || 
                c.slug.toLowerCase().includes(q)
            );
        },

        toggleSelectAll() {
            if (this.selectedCategoryIds.length === this.filteredCategories.length) {
                this.selectedCategoryIds = [];
            } else {
                this.selectedCategoryIds = this.filteredCategories.map(c => c.id);
            }
        },

        addSelectedCategoriesToMenu() {
            const additions = [];
            let currentLen = this.menu.length;
            this.selectedCategoryIds.forEach(id => {
                const cat = this.parentCategories.find(c => c.id === id);
                if (cat) {
                    currentLen++;
                    const formattedNum = currentLen < 10 ? '0' + currentLen : String(currentLen);
                    
                    // Extract subcategories from children
                    const subs = (cat.children && cat.children.length > 0) 
                        ? cat.children.map(ch => ch.name)
                        : [cat.name + ' Tops', cat.name + ' Sets', 'Custom ' + cat.name];

                    additions.push({
                        _uid: 'pillar-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
                        id: cat.slug,
                        slug: cat.slug,
                        name: cat.name,
                        number: formattedNum,
                        image: cat.hero_image || '/categories/Casual wear (1).png',
                        tagline: cat.tagline || 'Specialized export manufacturing for private labels & international brands.',
                        subcategories: subs,
                        open: true,
                        newSubcategoryInput: ''
                    });
                }
            });
            this.menu = [...this.menu, ...additions];
            this.selectedCategoryIds = [];
        },

        addCustomPillarToMenu() {
            if (!this.customPillar.name) {
                alert('Please enter a category name.');
                return;
            }
            const nextNum = this.menu.length + 1;
            const formattedNum = this.customPillar.number || (nextNum < 10 ? '0' + nextNum : String(nextNum));
            const slug = this.customPillar.slug || this.customPillar.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const subs = this.customPillar.subcategories
                ? this.customPillar.subcategories.split(',').map(s => s.trim()).filter(Boolean)
                : ['Blanks', 'Custom Styles', 'Private Label'];

            this.menu = [...this.menu, {
                _uid: 'pillar-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
                id: slug,
                slug: slug,
                name: this.customPillar.name,
                number: formattedNum,
                image: this.customPillar.image || '/categories/Casual wear (1).png',
                tagline: 'Engineered apparel manufacturing and worldwide export production.',
                subcategories: subs,
                open: true,
                newSubcategoryInput: ''
            }];

            this.customPillar.name = '';
            this.customPillar.slug = '';
            this.customPillar.subcategories = '';
        },

        moveUp(index) {
            if (index > 0) {
                const list = [...this.menu];
                const temp = list[index];
                list[index] = list[index - 1];
                list[index - 1] = temp;
                this.menu = list;
                this.renumberMenu();
            }
        },

        moveDown(index) {
            if (index < this.menu.length - 1) {
                const list = [...this.menu];
                const temp = list[index];
                list[index] = list[index + 1];
                list[index + 1] = temp;
                this.menu = list;
                this.renumberMenu();
            }
        },

        renumberMenu() {
            this.menu = this.menu.map((item, idx) => {
                const num = idx + 1;
                return {
                    ...item,
                    number: num < 10 ? '0' + num : String(num)
                };
            });
        },

        removePillar(targetItem) {
            this.menu = this.menu.filter(item => item !== targetItem && item._uid !== targetItem._uid);
            this.renumberMenu();
        },

        addSubcategory(item) {
            if (!item.newSubcategoryInput || !item.newSubcategoryInput.trim()) return;
            const val = item.newSubcategoryInput.trim();
            item.subcategories = [...(item.subcategories || []), val];
            item.newSubcategoryInput = '';
        },

        addSubcategoryFromSelect(item, subName) {
            if (!subName || !subName.trim()) return;
            const val = subName.trim();
            if (!(item.subcategories || []).includes(val)) {
                item.subcategories = [...(item.subcategories || []), val];
            }
        },

        removeSubcategory(item, subIndex) {
            item.subcategories = item.subcategories.filter((_, idx) => idx !== subIndex);
        },

        saveMenu() {
            // Clean up any temporary UI states before submit
            const payload = this.menu.map(item => ({
                id: item.id || item.slug,
                slug: item.slug,
                name: item.name,
                number: item.number,
                image: item.image,
                tagline: item.tagline,
                subcategories: item.subcategories || []
            }));

            document.getElementById('saveMenuForm').querySelector('input[name="menu"]').value = JSON.stringify(payload);
            document.getElementById('saveMenuForm').submit();
        }
    };
}
</script>
@endsection
