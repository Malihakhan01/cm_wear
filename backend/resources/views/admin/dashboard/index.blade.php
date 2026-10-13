@extends('layouts.admin')

@section('title', 'Manufacturing & Commerce Dashboard')
@section('header_title', 'Manufacturing & Commerce Overview')

@section('content')
<div class="space-y-8">

    <!-- 1. Top Core Metrics (6-Card Grid) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        
        <!-- Revenue Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
            <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Revenue</p>
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
            </div>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ $currencySymbol }}{{ number_format($totalRevenue, 2) }}
            </p>
            <div class="mt-2 flex items-center gap-1 text-[11px] font-semibold {{ $revenueDiffPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500' }}">
                <span>{{ $revenueDiffPct >= 0 ? '+' : '' }}{{ $revenueDiffPct }}%</span>
                <span class="text-slate-400 font-normal">vs previous period</span>
            </div>
        </div>

        <!-- Orders Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
            <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Orders</p>
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
            </div>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ number_format($totalOrders) }}
            </p>
            <div class="mt-2 flex items-center gap-1 text-[11px] font-semibold {{ $ordersDiffPct >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-500' }}">
                <span>{{ $ordersDiffPct >= 0 ? '+' : '' }}{{ $ordersDiffPct }}%</span>
                <span class="text-slate-400 font-normal">vs previous period</span>
            </div>
        </div>

        <!-- Avg Order Value Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
            <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Avg Order Value</p>
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
            </div>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ $currencySymbol }}{{ number_format($avgOrderValue, 2) }}
            </p>
            <div class="mt-2 text-[11px] font-semibold text-slate-400">
                <span>per confirmed order</span>
            </div>
        </div>

        <!-- New RFQs Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
            <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New RFQs</p>
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
            </div>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ number_format($newRfqsCount) }}
            </p>
            <div class="mt-2 flex items-center gap-1 text-[11px] font-semibold {{ $rfqsDiffPct >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500' }}">
                <span>{{ $totalRfqs }} total inquiries</span>
            </div>
        </div>

        <!-- New Customers Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
            <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Customers</p>
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
            </div>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ number_format($newCustomersCount) }}
            </p>
            <div class="mt-2 text-[11px] font-semibold text-slate-400">
                <span>{{ $totalCustomers }} registered buyers</span>
            </div>
        </div>

        <!-- Active Products Card -->
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
            <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Active Products</p>
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
            </div>
            <p class="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {{ number_format($activeProductsCount) }}
            </p>
            <div class="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span>{{ $featuredProductsCount }} featured</span>
                <span class="text-slate-400 font-normal">({{ $totalProducts }} total)</span>
            </div>
        </div>

    </div>

    <!-- 2. Primary Charts Row: Revenue Trend (8 Cols) & Orders by Status (4 Cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Revenue Trend Line Chart -->
        <div class="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Revenue Trend</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Daily gross revenue over the last 30 days</p>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span class="h-2 w-2 rounded-full bg-blue-600"></span>
                    Live Financials
                </span>
            </div>

            <div id="chart-revenue-trend" class="w-full min-h-[320px]"></div>
        </div>

        <!-- Orders by Status / Stage Bar Chart -->
        <div class="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Orders by Status</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Production pipeline stage allocation</p>
                </div>
                <a href="{{ route('admin.orders.kanban') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Kanban &rarr;
                </a>
            </div>

            <div id="chart-orders-status" class="w-full min-h-[320px]"></div>
        </div>

    </div>

    <!-- 3. Secondary 3-Chart Row: RFQs by Status, Top Categories Donut, Newsletter Growth -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- RFQs by Status -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">RFQs by Status</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Inquiry lifecycle conversion</p>
                </div>
                <a href="{{ route('admin.inquiries.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    View &rarr;
                </a>
            </div>

            <div id="chart-rfqs-status" class="w-full min-h-[280px]"></div>
        </div>

        <!-- Top Categories by Catalog Volume -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Top Categories</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Product catalog breakdown</p>
                </div>
                <a href="{{ route('admin.categories.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Taxonomy &rarr;
                </a>
            </div>

            <div id="chart-categories-volume" class="w-full min-h-[280px]"></div>
        </div>

        <!-- Newsletter Growth -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Newsletter Growth</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Monthly subscriber acquisitions</p>
                </div>
                <a href="{{ route('admin.inquiries.subscribers') }}" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    List &rarr;
                </a>
            </div>

            <div id="chart-newsletter-growth" class="w-full min-h-[280px]"></div>
        </div>

    </div>

    <!-- 4. Performance Insights: Top Selling Products & Top Customers -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Top Products Table -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Top Products</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Best performing garments by order volume</p>
                </div>
                <a href="{{ route('admin.products.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    All Products &rarr;
                </a>
            </div>

            @if($topProducts->where('total_sold', '>', 0)->isEmpty())
                <div class="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-3 text-slate-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <p class="text-xs font-semibold">No order items recorded yet</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">Products will rank automatically when purchase orders are confirmed.</p>
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                                <th class="pb-3">Product</th>
                                <th class="pb-3 text-center">Units Sold</th>
                                <th class="pb-3 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                            @foreach($topProducts as $tp)
                                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td class="py-3 flex items-center gap-3">
                                        <div class="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                            @php $thumb = $tp->primaryImage?->url ?? $tp->images->first()?->url; @endphp
                                            @if($thumb)
                                                <img src="{{ $thumb }}" alt="{{ $tp->name }}" class="h-full w-full object-cover">
                                            @else
                                                <div class="h-full w-full flex items-center justify-center text-[9px] font-bold text-slate-400">N/A</div>
                                            @endif
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ $tp->name }}</p>
                                            <p class="text-[11px] text-slate-400 font-mono mt-0.5">{{ $tp->sku ?: 'No SKU' }}</p>
                                        </div>
                                    </td>
                                    <td class="py-3 text-center font-bold text-slate-900 dark:text-white">
                                        {{ number_format($tp->total_sold) }}
                                    </td>
                                    <td class="py-3 text-right font-bold text-blue-600 dark:text-blue-400">
                                        {{ $currencySymbol }}{{ number_format($tp->total_earned, 2) }}
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

        <!-- Top Customers Table -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Top Customers</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Wholesale buyers and brands by lifetime volume</p>
                </div>
                <a href="{{ route('admin.customers.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Directory &rarr;
                </a>
            </div>

            @if($topCustomers->isEmpty() || $topCustomers->where('orders_count', '>', 0)->isEmpty())
                <div class="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-3 text-slate-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <p class="text-xs font-semibold">No customer order activity yet</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">Top clients will appear as purchase orders are invoiced.</p>
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                                <th class="pb-3">Customer</th>
                                <th class="pb-3 text-center">Orders</th>
                                <th class="pb-3 text-right">Spend</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                            @foreach($topCustomers as $tc)
                                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td class="py-3">
                                        <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ $tc->full_name }}</p>
                                        <p class="text-[11px] text-slate-400 truncate">{{ $tc->company_name ?: $tc->email }}</p>
                                    </td>
                                    <td class="py-3 text-center font-bold text-slate-900 dark:text-white">
                                        {{ number_format($tc->orders_count) }}
                                    </td>
                                    <td class="py-3 text-right font-bold text-blue-600 dark:text-blue-400">
                                        {{ $currencySymbol }}{{ number_format($tc->orders_sum_total_amount ?? 0, 2) }}
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

    </div>

    <!-- 5. Factory Floor Production Line Pipeline Status -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Factory Floor Production Pipeline</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Live order allocation across manufacturing stages</p>
            </div>
            <a href="{{ route('admin.orders.kanban') }}" class="inline-flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition">
                <span>Open Kanban Board</span> &rarr;
            </a>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            @foreach($stages as $stage)
                <div class="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center dark:border-slate-800/80 dark:bg-slate-950/40 transition hover:bg-white dark:hover:bg-slate-900">
                    <div class="h-1.5 w-full rounded-full mb-2.5" style="background-color: {{ $stage->color_badge }}"></div>
                    <p class="text-2xl font-black text-slate-900 dark:text-white">{{ $stage->orders_count }}</p>
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate" title="{{ $stage->name }}">
                        {{ $stage->name }}
                    </p>
                </div>
            @endforeach
        </div>
    </div>

    <!-- 6. Recent Manufacturing Orders Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Recent Manufacturing Orders</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Latest wholesale and sampling POs</p>
            </div>
            <a href="{{ route('admin.orders.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                View All Orders &rarr;
            </a>
        </div>

        @if($recentOrders->isEmpty())
            <div class="py-12 text-center text-slate-400 text-xs">
                <p>No manufacturing orders placed yet.</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3">PO Number</th>
                            <th class="pb-3">Customer</th>
                            <th class="pb-3">Customer Company</th>
                            <th class="pb-3">Status</th>
                            <th class="pb-3 text-right">Units</th>
                            <th class="pb-3 text-right">Grand Total</th>
                            <th class="pb-3 text-right">Placed</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($recentOrders as $order)
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                                    <a href="{{ route('admin.orders.show', $order->id) }}">{{ $order->order_number }}</a>
                                </td>
                                <td class="py-3.5 text-slate-900 dark:text-white font-semibold">
                                    {{ $order->customer->full_name ?? 'Guest Buyer' }}
                                </td>
                                <td class="py-3.5 text-xs text-slate-500 dark:text-slate-400">
                                    {{ $order->customer->company_name ?: '—' }}
                                </td>
                                <td class="py-3.5">
                                    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                          style="background-color: {{ $order->currentStage->color_badge ?? '#64748b' }}15; color: {{ $order->currentStage->color_badge ?? '#64748b' }}">
                                        {{ $order->currentStage->name ?? 'Pending' }}
                                    </span>
                                </td>
                                <td class="py-3.5 text-right font-medium text-slate-600 dark:text-slate-300">
                                    {{ number_format($order->total_quantity) }}
                                </td>
                                <td class="py-3.5 text-right font-bold text-slate-900 dark:text-white">
                                    {{ $currencySymbol }}{{ number_format($order->total_amount, 2) }}
                                </td>
                                <td class="py-3.5 text-right text-xs text-slate-400">
                                    {{ $order->created_at->format('M d, Y') }}
                                </td>
                                <td class="py-3.5 text-right">
                                    <a href="{{ route('admin.orders.show', $order->id) }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        View &rarr;
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>

</div>

@push('scripts')
<script>
function initDashboardCharts() {
    if (typeof ApexCharts === 'undefined') {
        setTimeout(initDashboardCharts, 60);
        return;
    }
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#1e293b' : '#f1f5f9';

    // 1. Revenue Trend Line / Area Chart
    const revenueOptions = {
        series: [{
            name: 'Gross Revenue',
            data: @json($revenueTrendValues)
        }],
        chart: {
            type: 'area',
            height: 320,
            toolbar: { show: false },
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            background: 'transparent'
        },
        colors: ['#f59e0b'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.02,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 3,
            colors: ['#f59e0b'],
            strokeColors: '#ffffff',
            strokeWidth: 2,
            hover: { size: 6 }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 4
        },
        xaxis: {
            categories: @json($revenueTrendDates),
            labels: {
                style: { colors: textColor, fontSize: '10px' },
                rotate: -45,
                rotateAlways: true
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: textColor, fontSize: '11px' },
                formatter: (val) => '{{ $currencySymbol }}' + val.toLocaleString()
            }
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            y: {
                formatter: (val) => '{{ $currencySymbol }}' + val.toFixed(2)
            }
        }
    };
    new ApexCharts(document.querySelector("#chart-revenue-trend"), revenueOptions).render();

    // 2. Orders by Status / Stage Bar Chart
    const ordersOptions = {
        series: [{
            name: 'Orders',
            data: @json($stageCounts)
        }],
        chart: {
            type: 'bar',
            height: 320,
            toolbar: { show: false },
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            background: 'transparent'
        },
        colors: ['#f59e0b'],
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '40%',
                distributed: false
            }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 4
        },
        xaxis: {
            categories: @json($stageLabels),
            labels: {
                style: { colors: textColor, fontSize: '10px' },
                rotate: -45,
                rotateAlways: true
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: textColor, fontSize: '11px' },
                formatter: (val) => Math.round(val)
            }
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light'
        }
    };
    new ApexCharts(document.querySelector("#chart-orders-status"), ordersOptions).render();

    // 3. RFQs by Status Chart
    const rfqOptions = {
        series: [{
            name: 'Inquiries',
            data: @json($rfqCounts)
        }],
        chart: {
            type: 'bar',
            height: 280,
            toolbar: { show: false },
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            background: 'transparent'
        },
        colors: ['#06b6d4'],
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '45%'
            }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 4
        },
        xaxis: {
            categories: @json($rfqLabels),
            labels: {
                style: { colors: textColor, fontSize: '10px' },
                rotate: -45,
                rotateAlways: true
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: textColor, fontSize: '11px' },
                formatter: (val) => Math.round(val)
            }
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light'
        }
    };
    new ApexCharts(document.querySelector("#chart-rfqs-status"), rfqOptions).render();

    // 4. Top Categories Donut Chart
    const catLabels = @json($categoryLabels);
    const catSeries = @json($categorySeries);
    const categoryOptions = {
        series: catSeries.length > 0 ? catSeries : [1],
        labels: catLabels.length > 0 ? catLabels : ['Catalog Active'],
        chart: {
            type: 'donut',
            height: 280,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            background: 'transparent'
        },
        colors: ['#d97706', '#0284c7', '#059669', '#7c3aed', '#e11d48'],
        stroke: {
            show: true,
            colors: isDark ? ['#0f172a'] : ['#ffffff'],
            width: 3
        },
        legend: {
            position: 'bottom',
            labels: { colors: textColor },
            fontSize: '10px',
            markers: { radius: 12 }
        },
        dataLabels: { enabled: false },
        tooltip: {
            theme: isDark ? 'dark' : 'light'
        }
    };
    new ApexCharts(document.querySelector("#chart-categories-volume"), categoryOptions).render();

    // 5. Newsletter Growth Line Chart
    const newsletterOptions = {
        series: [{
            name: 'Subscribers',
            data: @json($newsletterSeries)
        }],
        chart: {
            type: 'line',
            height: 280,
            toolbar: { show: false },
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            background: 'transparent'
        },
        colors: ['#10b981'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 4,
            colors: ['#10b981'],
            strokeColors: '#ffffff',
            strokeWidth: 2
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 4
        },
        xaxis: {
            categories: @json($newsletterMonths),
            labels: {
                style: { colors: textColor, fontSize: '10px' },
                rotate: -45,
                rotateAlways: true
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: textColor, fontSize: '11px' },
                formatter: (val) => Math.round(val)
            }
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light'
        }
    };
    new ApexCharts(document.querySelector("#chart-newsletter-growth"), newsletterOptions).render();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboardCharts);
} else {
    initDashboardCharts();
}
</script>
@endpush
@endsection
