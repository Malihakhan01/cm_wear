@extends('layouts.admin')

@section('title', 'Product Catalog')
@section('header_title', 'Product Catalog')

@section('content')
<div class="space-y-6">
    
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">All Products</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Manage apparel blanks, customizable garments, and variants</p>
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
            <div class="relative flex-1 min-w-[240px]">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" 
                       name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Search by product name, SKU, or slug..." 
                       class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500">
            </div>

            <div class="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <select name="type" class="w-full sm:w-auto min-w-[170px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Product Types</option>
                    <option value="simple" {{ request('type') === 'simple' ? 'selected' : '' }}>Simple</option>
                    <option value="variable" {{ request('type') === 'variable' ? 'selected' : '' }}>Variable (WooCommerce)</option>
                    <option value="customizable_apparel" {{ request('type') === 'customizable_apparel' ? 'selected' : '' }}>Customizable Garment</option>
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

                @if(request()->hasAny(['search', 'type', 'status']))
                    <a href="{{ route('admin.products.index') }}" class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Products Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
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

            <div class="mt-6">
                {{ $products->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
