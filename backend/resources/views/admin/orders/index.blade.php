@extends('layouts.admin')

@section('title', 'Manufacturing Orders')
@section('header_title', 'Production & Manufacturing Orders')

@section('content')
<div class="space-y-6">
    
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">All Orders</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Wholesale purchase orders, sample prototypes, and direct retail</p>
        </div>

        <a href="{{ route('admin.orders.kanban') }}" class="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
            <span>Switch to Factory Kanban</span>
        </a>
    </div>

    <!-- Orders Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($orders->isEmpty())
            <div class="py-12 text-center text-slate-400 text-sm">
                No orders found.
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3">PO Number</th>
                            <th class="pb-3">Buyer / Company</th>
                            <th class="pb-3">Stage</th>
                            <th class="pb-3">Type</th>
                            <th class="pb-3 text-right">Units</th>
                            <th class="pb-3 text-right">Total Amount</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($orders as $o)
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                                    <a href="{{ route('admin.orders.show', $o->id) }}">{{ $o->order_number }}</a>
                                </td>
                                <td class="py-4">
                                    <div class="font-bold text-slate-900 dark:text-white">{{ $o->customer?->full_name ?? 'Client' }}</div>
                                    <div class="text-xs text-slate-400">{{ $o->customer?->company_name ?: ($o->customer?->email ?? '') }}</div>
                                </td>
                                <td class="py-4">
                                    <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                          style="background-color: {{ $o->currentStage->color_badge ?? '#64748b' }}15; color: {{ $o->currentStage->color_badge ?? '#64748b' }}">
                                        {{ $o->currentStage->name ?? 'Pending Review' }}
                                    </span>
                                </td>
                                <td class="py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    {{ ucfirst(str_replace('_', ' ', $o->order_type)) }}
                                </td>
                                <td class="py-4 text-right font-medium">
                                    {{ number_format($o->total_quantity) }}
                                </td>
                                <td class="py-4 text-right font-bold text-slate-900 dark:text-white">
                                    ${{ number_format($o->total_amount, 2) }}
                                </td>
                                <td class="py-4 text-right">
                                    <a href="{{ route('admin.orders.show', $o->id) }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        View Details &rarr;
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-6">
                {{ $orders->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
