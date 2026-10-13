@extends('layouts.admin')

@section('title', 'RFQ ' . $rfq->rfq_number)
@section('header_title', 'Inquiry Details — ' . $rfq->rfq_number)

@section('content')
<div class="space-y-6">
    
    <div class="flex items-center justify-between">
        <a href="{{ route('admin.inquiries.index') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Inquiries
        </a>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Inquiry Details & Breakdown (2 Cols) -->
        <div class="lg:col-span-2 space-y-6">
            
            <!-- Header Card -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Request for Quote</span>
                        <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ $rfq->rfq_number }}</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Submitted on {{ $rfq->created_at->format('F d, Y \a\t h:i A') }}</p>
                    </div>

                    <div class="text-right">
                        @php
                            $statusStyles = [
                                'new' => 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
                                'in_review' => 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                                'quoted' => 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
                                'negotiating' => 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
                                'won' => 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                                'lost' => 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                                'archived' => 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
                            ];
                        @endphp
                        <span class="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider {{ $statusStyles[$rfq->status] ?? $statusStyles['new'] }}">
                            {{ str_replace('_', ' ', $rfq->status) }}
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs">
                    <div>
                        <span class="font-bold text-slate-400 uppercase tracking-wider">Client Name</span>
                        <p class="font-bold text-slate-900 dark:text-white text-sm mt-1">{{ $rfq->full_name }}</p>
                        <p class="text-slate-500 mt-0.5">{{ $rfq->company ?: 'Independent / Startup' }}</p>
                    </div>

                    <div>
                        <span class="font-bold text-slate-400 uppercase tracking-wider">Contact Info</span>
                        <p class="font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">{{ $rfq->email }}</p>
                        <p class="text-slate-500 mt-0.5">{{ $rfq->phone ?: 'No phone provided' }}</p>
                    </div>

                    <div>
                        <span class="font-bold text-slate-400 uppercase tracking-wider">Destination & Incoterm</span>
                        <p class="font-bold text-slate-900 dark:text-white mt-1">{{ $rfq->country ?: 'Global' }} &bull; {{ $rfq->destination_port ?: 'Any Port' }}</p>
                        <p class="text-slate-500 mt-0.5">Term: {{ $rfq->incoterm ?: 'FOB' }}</p>
                    </div>
                </div>
            </div>

            <!-- Items & Requirements Breakdown -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Manufacturing Specifications & Garment Breakdown</h3>

                @if(!empty($rfq->message))
                    <div class="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Inquiries & Special Notes</span>
                        <p class="text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-line">{{ $rfq->message }}</p>
                    </div>
                @endif

                @if(!empty($rfq->items) && is_array($rfq->items))
                    <div class="overflow-x-auto pt-2">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                                    <th class="pb-2">Garment Item</th>
                                    <th class="pb-2">Color / Fabric</th>
                                    <th class="pb-2">Size Split</th>
                                    <th class="pb-2 text-right">Qty</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                @foreach($rfq->items as $item)
                                    <tr>
                                        <td class="py-3 font-bold text-slate-900 dark:text-white">{{ $item['product_name'] ?? ($item['name'] ?? 'Garment Custom Blank') }}</td>
                                        <td class="py-3 text-slate-600 dark:text-slate-400">{{ $item['color'] ?? 'Standard' }} / {{ $item['material'] ?? 'Heavyweight Cotton' }}</td>
                                        <td class="py-3 text-slate-600 dark:text-slate-400">{{ $item['size'] ?? 'Mixed Breakdown' }}</td>
                                        <td class="py-3 text-right font-bold text-slate-900 dark:text-white">{{ number_format($item['quantity'] ?? 1) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div class="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Target Total Qty</span>
                        <p class="text-base font-extrabold text-slate-900 dark:text-white mt-1">{{ $rfq->quantity ? number_format($rfq->quantity) . ' pcs' : 'N/A' }}</p>
                    </div>

                    <div class="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Target Unit Price</span>
                        <p class="text-base font-extrabold text-slate-900 dark:text-white mt-1">{{ $rfq->target_price ? '$' . number_format($rfq->target_price, 2) : 'Open Quote' }}</p>
                    </div>

                    <div class="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Target Lead Time</span>
                        <p class="text-base font-extrabold text-slate-900 dark:text-white mt-1">{{ $rfq->target_lead_days ? $rfq->target_lead_days . ' Days' : 'Standard (25d)' }}</p>
                    </div>

                    <div class="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200 dark:border-slate-800">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Inquiry Type</span>
                        <p class="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-1 uppercase">{{ str_replace('_', ' ', $rfq->inquiry_type) }}</p>
                    </div>
                </div>
            </div>

            <!-- Internal Notes Timeline -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Internal Production & Sales Notes</h3>

                <form method="POST" action="{{ route('admin.inquiries.note', $rfq->id) }}" class="space-y-3">
                    @csrf
                    <textarea name="note" rows="2" placeholder="Add an internal note about sample approval, factory lead time, or negotiation..." required class="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"></textarea>
                    <button type="submit" class="rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 px-4 py-2 text-xs font-bold transition">
                        Post Internal Note
                    </button>
                </form>

                @if($rfq->notes->isEmpty())
                    <p class="text-xs text-slate-400 italic pt-2">No internal notes logged yet.</p>
                @else
                    <div class="space-y-3 pt-3">
                        @foreach($rfq->notes as $n)
                            <div class="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-3.5 border border-slate-100 dark:border-slate-800 text-xs">
                                <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                                    <span class="font-bold text-slate-700 dark:text-slate-300">{{ $n->user->name ?? 'Studio Admin' }}</span>
                                    <span>{{ $n->created_at->diffForHumans() }}</span>
                                </div>
                                <p class="text-slate-800 dark:text-slate-200">{{ $n->note }}</p>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

        </div>

        <!-- Right Column: Status Update & Quote Builder (1 Col) -->
        <div class="space-y-6">
            
            <!-- Quote & Status Form -->
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Status & Formal Quote</h3>

                <form method="POST" action="{{ route('admin.inquiries.status', $rfq->id) }}" class="space-y-4">
                    @csrf
                    @method('PATCH')

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Inquiry Status</label>
                        <select name="status" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            <option value="new" {{ $rfq->status === 'new' ? 'selected' : '' }}>New Submission</option>
                            <option value="in_review" {{ $rfq->status === 'in_review' ? 'selected' : '' }}>In Review / Tech Assessment</option>
                            <option value="quoted" {{ $rfq->status === 'quoted' ? 'selected' : '' }}>Formally Quoted</option>
                            <option value="negotiating" {{ $rfq->status === 'negotiating' ? 'selected' : '' }}>Negotiating Specs / Terms</option>
                            <option value="won" {{ $rfq->status === 'won' ? 'selected' : '' }}>Won (Order Converted)</option>
                            <option value="lost" {{ $rfq->status === 'lost' ? 'selected' : '' }}>Lost / Declined</option>
                            <option value="archived" {{ $rfq->status === 'archived' ? 'selected' : '' }}>Archived</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Assigned Sales / Merchandiser</label>
                        <select name="assigned_user_id" class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            <option value="">Unassigned</option>
                            @foreach($users as $u)
                                <option value="{{ $u->id }}" {{ $rfq->assigned_user_id == $u->id ? 'selected' : '' }}>{{ $u->name }} ({{ $u->email }})</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Official Factory Quote</span>

                        <div>
                            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Quoted Unit Price ($)</label>
                            <input type="number" step="0.01" name="quote_unit_price" value="{{ old('quote_unit_price', $rfq->quote['unit_price'] ?? '') }}" placeholder="e.g. 32.50" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Lead Days</label>
                                <input type="number" name="quote_lead_days" value="{{ old('quote_lead_days', $rfq->quote['lead_days'] ?? 25) }}" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Freight / Est ($)</label>
                                <input type="number" step="0.01" name="quote_shipping" value="{{ old('quote_shipping', $rfq->quote['shipping'] ?? 0) }}" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Quote Remarks / Payment Terms</label>
                            <textarea name="quote_notes" rows="2" placeholder="e.g. 50% deposit, balance upon Bill of Lading copy" class="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950">{{ old('quote_notes', $rfq->quote['notes'] ?? '') }}</textarea>
                        </div>
                    </div>

                    <button type="submit" class="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition">
                        Save Status & Quote
                    </button>
                </form>
            </div>

        </div>

    </div>

</div>
@endsection
