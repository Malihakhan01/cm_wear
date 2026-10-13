@extends('layouts.admin')

@section('title', 'Factory Production Kanban')
@section('header_title', 'Factory Floor Production Kanban')

@section('content')
<div class="space-y-6">
    
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Live Production Line Board</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Track active manufacturing orders across cutting, sewing, washing, and QC stages</p>
        </div>

        <a href="{{ route('admin.orders.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Switch to Table View
        </a>
    </div>

    <!-- Kanban Board Horizontal Scroller -->
    <div class="flex gap-4 overflow-x-auto pb-6">
        @foreach($stages as $stage)
            <div class="flex-shrink-0 w-80 rounded-3xl border border-slate-200 bg-slate-100/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col h-[calc(100vh-230px)]">
                
                <!-- Stage Column Header -->
                <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="h-2.5 w-2.5 rounded-full" style="background-color: {{ $stage->color_badge }}"></span>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate" title="{{ $stage->name }}">
                            {{ $stage->name }}
                        </h3>
                    </div>
                    <span class="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {{ $stage->orders->count() }}
                    </span>
                </div>

                <!-- Orders Container in this Stage -->
                <div class="flex-1 overflow-y-auto space-y-3 pr-1">
                    @forelse($stage->orders as $order)
                        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900">
                            <div class="flex items-center justify-between mb-2">
                                <a href="{{ route('admin.orders.show', $order->id) }}" class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    {{ $order->order_number }}
                                </a>
                                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    {{ $order->order_type === 'rapid_sample' ? 'Sample' : 'Bulk' }}
                                </span>
                            </div>

                            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {{ $order->customer?->company_name ?: ($order->customer?->full_name ?? 'Client') }}
                            </p>

                            <div class="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>{{ number_format($order->total_quantity) }} units</span>
                                <span class="font-bold text-slate-900 dark:text-white">${{ number_format($order->total_amount, 2) }}</span>
                            </div>
                        </div>
                    @empty
                        <div class="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/60 text-xs text-slate-400 font-medium">
                            No POs in this stage
                        </div>
                    @endforelse
                </div>

            </div>
        @endforeach
    </div>

</div>
@endsection
