@extends('layouts.admin')

@section('title', 'Manufacturing Inquiries & RFQs')
@section('header_title', 'Inquiries & Quote Requests')

@section('content')
<div class="space-y-6">
    
    <!-- Top Action & Navigation Sub-tabs -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Manufacturing RFQs & Quotes</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Manage incoming garment customizer RFQs, bulk quotes, and client specifications</p>
        </div>

        <div class="flex items-center gap-2">
            <a href="{{ route('admin.inquiries.index') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition {{ !request()->routeIs('admin.inquiries.messages') && !request()->routeIs('admin.inquiries.subscribers') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700' }}">
                RFQs ({{ $counts['total'] }})
            </a>
            <a href="{{ route('admin.inquiries.messages') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition {{ request()->routeIs('admin.inquiries.messages') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700' }}">
                Contact Messages
            </a>
            <a href="{{ route('admin.inquiries.subscribers') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition {{ request()->routeIs('admin.inquiries.subscribers') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700' }}">
                Subscribers
            </a>
        </div>
    </div>

    <!-- Status Stats Pills -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <a href="{{ route('admin.inquiries.index', ['status' => 'new']) }}" class="rounded-2xl border p-4 transition {{ request('status') === 'new' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900' }}">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">New Submissions</span>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">{{ $counts['new'] }}</span>
            </div>
            <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ $counts['new'] }}</p>
        </a>

        <a href="{{ route('admin.inquiries.index', ['status' => 'in_review']) }}" class="rounded-2xl border p-4 transition {{ request('status') === 'in_review' ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900' }}">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Under Review</span>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-600 dark:text-amber-400">{{ $counts['in_review'] }}</span>
            </div>
            <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ $counts['in_review'] }}</p>
        </a>

        <a href="{{ route('admin.inquiries.index', ['status' => 'quoted']) }}" class="rounded-2xl border p-4 transition {{ request('status') === 'quoted' ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900' }}">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Quoted</span>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400">{{ $counts['quoted'] }}</span>
            </div>
            <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ $counts['quoted'] }}</p>
        </a>

        <a href="{{ route('admin.inquiries.index', ['status' => 'won']) }}" class="rounded-2xl border p-4 transition {{ request('status') === 'won' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900' }}">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Orders Won</span>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">{{ $counts['won'] }}</span>
            </div>
            <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ $counts['won'] }}</p>
        </a>
    </div>

    <!-- Filter & Search Bar -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form method="GET" action="{{ route('admin.inquiries.index') }}" class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div class="relative flex-1 min-w-[240px]">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" 
                       name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Search by RFQ number, client name, company, email..." 
                       class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500">
            </div>

            <div class="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <select name="type" class="w-full sm:w-auto min-w-[170px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Inquiry Types</option>
                    <option value="customizer_lead" {{ request('type') === 'customizer_lead' ? 'selected' : '' }}>🌟 3D Customizer Lead</option>
                    <option value="blank_inquiry" {{ request('type') === 'blank_inquiry' ? 'selected' : '' }}>✉️ Blank Manufacturing Inquiry</option>
                    <option value="bulk_manufacturing" {{ request('type') === 'bulk_manufacturing' ? 'selected' : '' }}>Bulk Production</option>
                    <option value="sample" {{ request('type') === 'sample' ? 'selected' : '' }}>Rapid Sampling</option>
                    <option value="custom_design" {{ request('type') === 'custom_design' ? 'selected' : '' }}>3D Garment Customizer</option>
                    <option value="tech_pack" {{ request('type') === 'tech_pack' ? 'selected' : '' }}>Tech Pack Development</option>
                </select>

                <select name="status" class="w-full sm:w-auto min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Statuses</option>
                    <option value="new" {{ request('status') === 'new' ? 'selected' : '' }}>New</option>
                    <option value="in_review" {{ request('status') === 'in_review' ? 'selected' : '' }}>In Review</option>
                    <option value="quoted" {{ request('status') === 'quoted' ? 'selected' : '' }}>Quoted</option>
                    <option value="negotiating" {{ request('status') === 'negotiating' ? 'selected' : '' }}>Negotiating</option>
                    <option value="won" {{ request('status') === 'won' ? 'selected' : '' }}>Won</option>
                    <option value="lost" {{ request('status') === 'lost' ? 'selected' : '' }}>Lost</option>
                </select>

                <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    <span>Filter</span>
                </button>

                @if(request()->hasAny(['search', 'type', 'status']))
                    <a href="{{ route('admin.inquiries.index') }}" class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- RFQs Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($rfqs->isEmpty())
            <div class="py-16 text-center text-slate-400 text-sm">
                No quote inquiries found matching your filters.
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3">RFQ Reference</th>
                            <th class="pb-3">Client & Company</th>
                            <th class="pb-3">Inquiry Type</th>
                            <th class="pb-3 text-right">Target Qty</th>
                            <th class="pb-3 text-right">Target Price</th>
                            <th class="pb-3 text-center">Status</th>
                            <th class="pb-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($rfqs as $rfq)
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-4">
                                    <div class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ $rfq->rfq_number }}</div>
                                    <div class="text-[11px] text-slate-400">{{ $rfq->created_at->format('M d, Y h:i A') }}</div>
                                </td>

                                <td class="py-4">
                                    <div class="font-bold text-slate-900 dark:text-white">{{ $rfq->full_name }}</div>
                                    <div class="text-xs text-slate-500 dark:text-slate-400">{{ $rfq->company ?: 'Independent Brand' }} &bull; {{ $rfq->country ?: 'Global' }}</div>
                                </td>

                                <td class="py-4">
                                    @if($rfq->inquiry_type === 'customizer_lead')
                                        <span class="rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2.5 py-1 text-xs font-bold inline-flex items-center gap-1">
                                            <span>✨ 3D Popup Lead</span>
                                        </span>
                                    @elseif($rfq->inquiry_type === 'blank_inquiry')
                                        <span class="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold inline-flex items-center gap-1">
                                            <span>✉️ Blank Inquiry</span>
                                        </span>
                                    @else
                                        <span class="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {{ ucwords(str_replace('_', ' ', $rfq->inquiry_type)) }}
                                        </span>
                                    @endif
                                </td>

                                <td class="py-4 text-right font-bold text-slate-900 dark:text-white">
                                    {{ $rfq->quantity ? number_format($rfq->quantity) . ' pcs' : '—' }}
                                </td>

                                <td class="py-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                                    {{ $rfq->target_price ? '$' . number_format($rfq->target_price, 2) : '—' }}
                                </td>

                                <td class="py-4 text-center">
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
                                    <span class="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider {{ $statusStyles[$rfq->status] ?? $statusStyles['new'] }}">
                                        {{ str_replace('_', ' ', $rfq->status) }}
                                    </span>
                                </td>

                                <td class="py-4 text-right">
                                    <a href="{{ route('admin.inquiries.show', $rfq->id) }}" class="rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white px-3.5 py-1.5 text-xs font-bold transition">
                                        Review & Quote &rarr;
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-6">
                {{ $rfqs->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
