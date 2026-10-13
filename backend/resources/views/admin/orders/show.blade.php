@extends('layouts.admin')

@section('title', "Order {$order->order_number}")
@section('header_title', "Order Details: {$order->order_number}")

@section('content')
<div class="space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <a href="{{ route('admin.orders.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2">
                &larr; Back to Orders
            </a>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">PO #{{ $order->order_number }}</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Placed on {{ $order->created_at->format('M d, Y H:i') }} | Incoterms: {{ $order->incoterms }}</p>
        </div>

        <!-- Stage Advance Selector Form -->
        <form method="POST" action="{{ route('admin.orders.stage', $order->id) }}" class="flex items-center gap-3">
            @csrf
            <select name="stage_id" class="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                @foreach($stages as $st)
                    <option value="{{ $st->id }}" {{ $order->current_stage_id === $st->id ? 'selected' : '' }}>
                        Stage: {{ $st->name }}
                    </option>
                @endforeach
            </select>

            <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                Advance Stage
            </button>
        </form>
    </div>

    <!-- Order Summary Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Order Items & Milestones -->
        <div class="lg:col-span-2 space-y-6">
            
            <!-- Items Table -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4">Garments Ordered ({{ $order->items->count() }})</h3>

                <div class="divide-y divide-slate-100 dark:divide-slate-800">
                    @foreach($order->items as $item)
                        <div class="py-4 flex gap-4 items-center">
                            <div class="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                @if($item->product && $item->product->primaryImage)
                                    <img src="{{ $item->product->primaryImage->url }}" alt="{{ $item->product_name }}" class="h-full w-full object-cover">
                                @else
                                    <span class="text-xs font-bold text-slate-400">Blank</span>
                                @endif
                            </div>

                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-slate-900 dark:text-white truncate">{{ $item->product_name }}</h4>
                                <p class="text-xs font-mono text-slate-400">SKU: {{ $item->sku }}</p>
                                
                                @if(!empty($item->size_breakdown))
                                    <div class="mt-2 flex flex-wrap gap-1.5">
                                        @foreach($item->size_breakdown as $size => $qty)
                                            <span class="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                                {{ $size }}: {{ $qty }} pcs
                                            </span>
                                        @endforeach
                                    </div>
                                @endif
                            </div>

                            <div class="text-right">
                                <p class="font-bold text-slate-900 dark:text-white">${{ number_format($item->total_price, 2) }}</p>
                                <p class="text-xs text-slate-400">{{ $item->quantity }} pcs @ ${{ number_format($item->unit_price, 2) }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>

                <!-- Financial Breakdown -->
                <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div class="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Subtotal ({{ number_format($order->total_quantity) }} units)</span>
                        <span class="font-bold">${{ number_format($order->subtotal, 2) }}</span>
                    </div>
                    <div class="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Surcharges (Printing / Washes / Trims)</span>
                        <span class="font-bold">${{ number_format($order->surcharges, 2) }}</span>
                    </div>
                    <div class="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Freight & Customs ({{ $order->incoterms }})</span>
                        <span class="font-bold">${{ number_format($order->shipping_cost, 2) }}</span>
                    </div>
                    <div class="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                        <span>Total PO Value</span>
                        <span class="text-blue-600 dark:text-blue-400">${{ number_format($order->total_amount, 2) }}</span>
                    </div>
                </div>
            </div>

            <!-- Milestone Production History -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Production Milestones Log</h3>

                @if($order->milestones->isEmpty())
                    <p class="text-xs text-slate-400">No milestone events logged yet.</p>
                @else
                    <div class="space-y-3">
                        @foreach($order->milestones as $m)
                            <div class="flex items-start gap-3 text-xs">
                                <span class="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                                <div>
                                    <p class="font-bold text-slate-800 dark:text-slate-200">{{ $m->title }}</p>
                                    <p class="text-slate-500 dark:text-slate-400">{{ $m->description }}</p>
                                    <span class="text-[10px] text-slate-400">{{ $m->created_at->format('M d, Y H:i') }}</span>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

        </div>

        <!-- Right 1 Col: Customer & Shipping Snapshot -->
        <div class="space-y-6">
            
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Buyer / Client Information</h3>

                <div>
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ $order->customer?->full_name ?? 'Client' }}</p>
                    <p class="text-xs text-slate-500">{{ $order->customer?->company_name ?: 'Individual Client' }}</p>
                </div>

                <div class="text-xs space-y-1">
                    <p class="text-slate-600 dark:text-slate-400"><strong class="text-slate-800 dark:text-slate-200">Email:</strong> {{ $order->customer?->email ?? 'N/A' }}</p>
                    @if($order->customer?->whatsapp)
                        <p class="text-emerald-600 dark:text-emerald-400"><strong>WhatsApp:</strong> {{ $order->customer->whatsapp }}</p>
                    @endif
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Shipping Destination Snapshot</h4>
                    @if(!empty($order->shipping_address_snapshot))
                        <div class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {{ $order->shipping_address_snapshot['address_line_1'] ?? '' }}<br>
                            @if(!empty($order->shipping_address_snapshot['address_line_2']))
                                {{ $order->shipping_address_snapshot['address_line_2'] }}<br>
                            @endif
                            {{ $order->shipping_address_snapshot['city'] ?? '' }}, {{ $order->shipping_address_snapshot['state'] ?? '' }} {{ $order->shipping_address_snapshot['postal_code'] ?? '' }}<br>
                            <strong>{{ $order->shipping_address_snapshot['country'] ?? '' }}</strong>
                        </div>
                    @else
                        <p class="text-xs text-slate-400">No snapshot recorded.</p>
                    @endif
                </div>
            </div>

        </div>

    </div>

</div>
@endsection
