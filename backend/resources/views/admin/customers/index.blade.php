@extends('layouts.admin')

@section('title', 'Wholesale Buyers & Clients')
@section('header_title', 'Wholesale Buyers & Client Directory')

@section('content')
<div class="space-y-6">
    
    <!-- Search Bar -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form method="GET" action="{{ route('admin.customers.index') }}" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="relative flex-1 min-w-[240px]">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" 
                       name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Search by client name, company, email..." 
                       class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500">
            </div>

            <div class="flex items-center gap-3">
                <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span>Search</span>
                </button>

                @if(request('search'))
                    <a href="{{ route('admin.customers.index') }}" class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Customers Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($customers->isEmpty())
            <div class="py-12 text-center text-slate-400 text-sm">
                No customer accounts registered yet.
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3">Client Name</th>
                            <th class="pb-3">Company / Brand</th>
                            <th class="pb-3">Email & WhatsApp</th>
                            <th class="pb-3 text-center">Total Orders</th>
                            <th class="pb-3 text-center">Status</th>
                            <th class="pb-3">Registered</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($customers as $c)
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-4 font-bold text-slate-900 dark:text-white">{{ $c->full_name }}</td>
                                <td class="py-4 text-slate-700 dark:text-slate-300 font-medium">{{ $c->company_name ?: '—' }}</td>
                                <td class="py-4">
                                    <div class="text-xs text-blue-600 dark:text-blue-400 font-mono">{{ $c->email }}</div>
                                    @if($c->whatsapp)
                                        <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">WA: {{ $c->whatsapp }}</div>
                                    @endif
                                </td>
                                <td class="py-4 text-center font-bold text-slate-900 dark:text-white">
                                    {{ $c->orders_count }}
                                </td>
                                <td class="py-4 text-center">
                                    <span class="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        {{ ucfirst($c->status) }}
                                    </span>
                                </td>
                                <td class="py-4 text-xs text-slate-500">
                                    {{ $c->created_at->format('M d, Y') }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-6">
                {{ $customers->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
