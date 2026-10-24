@extends('layouts.admin')

@section('title', 'Product Catalog')
@section('header_title', 'Product Catalog')

@section('content')
<div class="space-y-6">
    
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <div class="flex items-center gap-3">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">All Products</h2>
                <span class="rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-0.5 text-xs font-bold">
                    {{ number_format($products->total()) }} {{ request()->hasAny(['search', 'category_id', 'category', 'type', 'status']) ? 'Filtered' : 'Total' }} Products
                </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage apparel blanks, customizable garments, and variants</p>
            @if(request()->filled('category_id') || request()->filled('category'))
                @php
                    $activeCatId = request('category_id', request('category'));
                    $activeCategory = $activeCatId === 'uncategorized' ? 'Uncategorized (No Category)' : \App\Models\Category::find($activeCatId)?->name;
                @endphp
                @if($activeCategory)
                    <div class="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 text-xs text-blue-700 dark:text-blue-300">
                        <span>Filtered by: <strong>{{ $activeCategory }}</strong></span>
                        <a href="{{ route('admin.products.index', request()->except('category_id', 'category', 'page')) }}" class="hover:text-blue-900 dark:hover:text-white font-bold ml-1 text-sm leading-none" title="Clear category filter">&times;</a>
                    </div>
                @endif
            @endif
            @if(request()->filled('date'))
                <div class="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 text-xs text-blue-700 dark:text-blue-300">
                    <span>Date: <strong>{{ \Carbon\Carbon::parse(request('date'))->format('M d, Y') }}</strong></span>
                    <a href="{{ route('admin.products.index', request()->except('date', 'page')) }}" class="hover:text-blue-900 dark:hover:text-white font-bold ml-1 text-sm leading-none" title="Clear date filter">&times;</a>
                </div>
            @endif
        </div>

        <div class="flex items-center gap-3">
            <a href="{{ route('admin.products.import') }}" class="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <span>Import WooCommerce CSV</span>
            </a>

            <a href="{{ route('admin.products.create') }}" class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span>Add Product</span>
            </a>
        </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form method="GET" action="{{ route('admin.products.index') }}" class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div class="relative flex-1 min-w-[220px]">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" 
                       name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Search by product name, SKU, or slug..." 
                       class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500">
            </div>

            <div class="flex flex-wrap items-center gap-3">
                <select name="category_id" class="w-full sm:w-auto min-w-[190px] max-w-[260px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Categories</option>
                    <option value="uncategorized" {{ request('category_id') === 'uncategorized' || request('category') === 'uncategorized' ? 'selected' : '' }}>⚠️ Uncategorized (No Category)</option>
                    @if(isset($categories))
                        @foreach($categories as $parent)
                            <option value="{{ $parent->id }}" class="font-bold text-slate-900 dark:text-white" {{ request('category_id') == $parent->id || request('category') == $parent->id ? 'selected' : '' }}>
                                📁 {{ $parent->name }} (All)
                            </option>
                            @foreach($parent->children as $child)
                                <option value="{{ $child->id }}" class="text-slate-600 dark:text-slate-400" {{ request('category_id') == $child->id || request('category') == $child->id ? 'selected' : '' }}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;↳ {{ $child->name }}
                                </option>
                            @endforeach
                        @endforeach
                    @endif
                </select>

                <select name="type" class="w-full sm:w-auto min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Types</option>
                    <option value="simple" {{ request('type') === 'simple' ? 'selected' : '' }}>Simple</option>
                    <option value="variable" {{ request('type') === 'variable' ? 'selected' : '' }}>Variable (WooCommerce)</option>
                    <option value="customizable_apparel" {{ request('type') === 'customizable_apparel' ? 'selected' : '' }}>Customizable Garment</option>
                </select>

                <select name="status" class="w-full sm:w-auto min-w-[125px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Statuses</option>
                    <option value="published" {{ request('status') === 'published' ? 'selected' : '' }}>Published</option>
                    <option value="draft" {{ request('status') === 'draft' ? 'selected' : '' }}>Draft</option>
                    <option value="archived" {{ request('status') === 'archived' ? 'selected' : '' }}>Archived</option>
                </select>

                <input type="date" 
                       name="date" 
                       value="{{ request('date') }}" 
                       class="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                       title="Filter by creation date">

                <select name="per_page" class="w-full sm:w-auto min-w-[95px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300" title="Items per page">
                    <option value="10" {{ request('per_page', $perPage ?? 15) == 10 ? 'selected' : '' }}>10 / page</option>
                    <option value="15" {{ request('per_page', $perPage ?? 15) == 15 ? 'selected' : '' }}>15 / page</option>
                    <option value="25" {{ request('per_page', $perPage ?? 15) == 25 ? 'selected' : '' }}>25 / page</option>
                    <option value="50" {{ request('per_page', $perPage ?? 15) == 50 ? 'selected' : '' }}>50 / page</option>
                    <option value="100" {{ request('per_page', $perPage ?? 15) == 100 ? 'selected' : '' }}>100 / page</option>
                    <option value="250" {{ request('per_page', $perPage ?? 15) == 250 ? 'selected' : '' }}>250 / page</option>
                </select>

                <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    <span>Filter</span>
                </button>

                @if(request()->hasAny(['search', 'category_id', 'category', 'type', 'status', 'date', 'per_page']))
                    <a href="{{ route('admin.products.index') }}" class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    {{-- Bulk Delete by Day (temporarily commented out)
    <div class="rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 p-4 shadow-sm"
         x-data="{ open: false }">
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
                <div>
                    <p class="text-xs font-bold text-rose-700 dark:text-rose-400">Bulk Delete by Day</p>
                    <p class="text-[11px] text-rose-500 dark:text-rose-500">Permanently delete all products added on a specific date</p>
                </div>
            </div>
            <button @click="open = !open" type="button"
                    class="rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-400 transition flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                <span x-text="open ? 'Hide' : 'Show Options'"></span>
            </button>
        </div>

        <div x-show="open" x-cloak x-transition class="mt-4 pt-4 border-t border-rose-200 dark:border-rose-900/40">
            <form method="POST" action="{{ route('admin.products.bulk-delete-by-date') }}"
                  onsubmit="return confirm('PERMANENTLY delete ALL products added on ' + document.getElementById('delete-date-input').value + '? This CANNOT be undone!')">
                @csrf
                <div class="flex flex-wrap items-end gap-3">
                    <div>
                        <label class="block text-[11px] font-bold text-rose-700 dark:text-rose-400 mb-1">Select Date</label>
                        <input type="date" 
                               id="delete-date-input"
                               name="date" 
                               value="{{ now()->toDateString() }}"
                               required
                               class="rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none">
                    </div>

                    <div class="flex items-center gap-2">
                        <button type="button"
                                onclick="document.getElementById('delete-date-input').value = '{{ now()->toDateString() }}'"
                                class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                            Set to Today
                        </button>

                        <button type="submit"
                                class="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Delete All for This Date
                        </button>
                    </div>
                </div>
                <p class="mt-2 text-[11px] text-rose-500">Warning: This will permanently delete ALL products created on the selected date. This action cannot be undone.</p>
            </form>
        </div>
    </div>
    --}}

    <!-- Products Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 relative"
         x-data="{
             selected: [],
             allSelected: false,
             pageIds: [{{ $products->pluck('id')->join(',') }}],
             toggleAll() {
                 if (this.allSelected) {
                     this.selected = [];
                     this.allSelected = false;
                 } else {
                     this.selected = [...this.pageIds];
                     this.allSelected = true;
                 }
             },
             updateSelectAll() {
                 this.allSelected = this.pageIds.length > 0 && this.pageIds.every(id => this.selected.includes(id));
             }
         }">

        <!-- Floating Bulk Action Bar -->
        <div x-show="selected.length > 0" 
             x-cloak
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 translate-y-4"
             x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0"
             x-transition:leave-end="opacity-0 translate-y-4"
             class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 text-xs">
            <div class="flex items-center gap-2 font-bold">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span x-text="selected.length + ' product(s) selected'"></span>
            </div>
            <div class="h-4 w-px bg-white/20"></div>
            <form method="POST" action="{{ route('admin.products.bulk-delete') }}" onsubmit="return confirm('Permanently delete the selected ' + selected.length + ' product(s)? This action cannot be undone.');">
                @csrf
                <template x-for="id in selected" :key="id">
                    <input type="hidden" name="ids[]" :value="id">
                </template>
                <button type="submit" class="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-xl font-bold transition shadow-lg shadow-rose-600/30">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    <span>Delete Selected</span>
                </button>
            </form>
            <button type="button" @click="selected = []; allSelected = false" class="text-slate-400 hover:text-white underline text-[11px] ml-1">
                Deselect All
            </button>
        </div>

        @if($products->isEmpty())
            <div class="py-16 text-center text-slate-400 text-sm">
                <p>No products found matching your filters.</p>
                <a href="{{ route('admin.products.import') }}" class="mt-3 inline-block font-bold text-emerald-500 hover:underline">Import from WooCommerce CSV &rarr;</a>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3 w-10 text-center">
                                <input type="checkbox" @click="toggleAll()" :checked="allSelected" class="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer">
                            </th>
                            <th class="pb-3 w-16">Image</th>
                            <th class="pb-3">Product Name & SKU</th>
                            <th class="pb-3">Type & Categories</th>
                            <th class="pb-3 text-right">Wholesale / Retail</th>
                            <th class="pb-3 text-center">MOQ / GSM</th>
                            <th class="pb-3 text-center">Status</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($products as $prod)
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition" :class="selected.includes({{ $prod->id }}) ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''">
                                <td class="py-3.5 text-center">
                                    <input type="checkbox" :value="{{ $prod->id }}" x-model.number="selected" @change="updateSelectAll()" class="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer">
                                </td>
                                <td class="py-3.5">
                                    <div class="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                        @php
                                            $thumb = $prod->primaryImage?->url ?? $prod->images->first()?->url;
                                        @endphp
                                        @if($thumb)
                                            <img src="{{ $thumb }}" alt="{{ $prod->name }}" class="h-full w-full object-cover">
                                        @else
                                            <span class="text-[10px] font-bold text-slate-400">No img</span>
                                        @endif
                                    </div>
                                </td>
                                <td class="py-3.5">
                                    <a href="{{ route('admin.products.edit', $prod->id) }}" class="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                                        {{ $prod->name }}
                                    </a>
                                    <div class="text-xs text-slate-400 font-mono mt-0.5">
                                        SKU: {{ $prod->sku ?: 'Parent (No SKU)' }}
                                    </div>
                                    <div class="text-[10px] text-slate-400 mt-0.5">
                                        Added: {{ $prod->created_at->format('M d, Y') }}
                                    </div>
                                </td>
                                <td class="py-3.5">
                                    <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        {{ ucfirst(str_replace('_', ' ', $prod->product_type)) }}
                                    </div>
                                    <div class="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                                        {{ $prod->categories->pluck('name')->join(', ') ?: 'Uncategorized' }}
                                    </div>
                                </td>
                                <td class="py-3.5 text-right font-medium">
                                    <div class="font-bold text-blue-600 dark:text-blue-400">
                                        ${{ number_format($prod->wholesale_price, 2) }} <span class="text-[10px] text-slate-400 font-normal">WS</span>
                                    </div>
                                    <div class="text-xs text-slate-400">
                                        ${{ number_format($prod->regular_price, 2) }} Retail
                                    </div>
                                </td>
                                <td class="py-3.5 text-center">
                                    <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ $prod->moq }} pcs</span>
                                    @if($prod->default_gsm)
                                        <div class="text-[11px] text-slate-400 font-semibold">{{ $prod->default_gsm }} GSM</div>
                                    @endif
                                </td>
                                <td class="py-3.5 text-center">
                                    @if($prod->status === 'published')
                                        <span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            Published
                                        </span>
                                    @else
                                        <span class="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                            {{ ucfirst($prod->status) }}
                                        </span>
                                    @endif
                                </td>
                                <td class="py-3.5 text-right space-x-2">
                                    <a href="{{ route('admin.products.edit', $prod->id) }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Edit
                                    </a>

                                    <form method="POST" action="{{ route('admin.products.destroy', $prod->id) }}" class="inline" onsubmit="return confirm('Move this product to trash?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-6 flex items-center justify-between gap-4">
                <p class="text-xs text-slate-400">
                    Showing {{ $products->firstItem() }} - {{ $products->lastItem() }} of {{ number_format($products->total()) }} products
                </p>
                {{ $products->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
