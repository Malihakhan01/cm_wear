@extends('layouts.admin')

@section('title', 'Newsletter Subscribers')
@section('header_title', 'Newsletter Subscribers')

@section('content')
<div class="space-y-6">
    
    <!-- Top Action & Navigation Sub-tabs -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Email Subscribers Directory</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Total active subscribers: <span class="font-bold text-blue-600 dark:text-blue-400">{{ $totalSubscribers }}</span></p>
        </div>

        <div class="flex items-center gap-2">
            <a href="{{ route('admin.inquiries.index') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                RFQs
            </a>
            <a href="{{ route('admin.inquiries.messages') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                Contact Messages
            </a>
            <a href="{{ route('admin.inquiries.subscribers') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                Subscribers ({{ $totalSubscribers }})
            </a>
        </div>
    </div>

    <!-- Search -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form method="GET" action="{{ route('admin.inquiries.subscribers') }}" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="relative flex-1 min-w-[240px]">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" 
                       name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Search subscriber email address..." 
                       class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500">
            </div>

            <div class="flex items-center gap-3">
                <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span>Search</span>
                </button>

                @if(request('search'))
                    <a href="{{ route('admin.inquiries.subscribers') }}" class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Subscribers Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($subscribers->isEmpty())
            <div class="py-12 text-center text-slate-400 text-sm">
                No newsletter subscribers found.
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3">Subscriber Email</th>
                            <th class="pb-3">Source Channel</th>
                            <th class="pb-3 text-center">Status</th>
                            <th class="pb-3">Subscribed Date</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($subscribers as $sub)
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-3.5 font-mono font-bold text-slate-900 dark:text-white">{{ $sub->email }}</td>
                                <td class="py-3.5 text-xs text-slate-500 capitalize">{{ str_replace('_', ' ', $sub->source) }}</td>
                                <td class="py-3.5 text-center">
                                    <span class="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        Active
                                    </span>
                                </td>
                                <td class="py-3.5 text-xs text-slate-500">
                                    {{ $sub->subscribed_at?->format('M d, Y h:i A') ?? $sub->created_at->format('M d, Y') }}
                                </td>
                                <td class="py-3.5 text-right">
                                    <form method="POST" action="{{ route('admin.inquiries.subscribers.destroy', $sub->id) }}" onsubmit="return confirm('Remove subscriber?');" class="inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-xs font-bold text-rose-500 hover:text-rose-700">Remove</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-6">
                {{ $subscribers->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
