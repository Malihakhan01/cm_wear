@extends('layouts.admin')

@section('title', 'Contact Inquiries')
@section('header_title', 'Contact Form Inquiries')

@section('content')
<div class="space-y-6">
    
    <!-- Top Action & Navigation Sub-tabs -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Customer & Client Inquiries</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Direct inquiries submitted from website contact forms</p>
        </div>

        <div class="flex items-center gap-2">
            <a href="{{ route('admin.inquiries.index') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                RFQs
            </a>
            <a href="{{ route('admin.inquiries.messages') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                Contact Messages ({{ $unreadCount }} new)
            </a>
            <a href="{{ route('admin.inquiries.subscribers') }}" class="rounded-xl px-4 py-2 text-xs font-bold transition bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                Subscribers
            </a>
        </div>
    </div>

    <!-- Search & Filters -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form method="GET" action="{{ route('admin.inquiries.messages') }}" class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div class="relative flex-1 min-w-[240px]">
                <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" 
                       name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Search sender name, email, subject, or message content..." 
                       class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500">
            </div>

            <div class="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <select name="status" class="w-full sm:w-auto min-w-[150px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <option value="">All Statuses</option>
                    <option value="unread" {{ request('status') === 'unread' ? 'selected' : '' }}>Unread</option>
                    <option value="read" {{ request('status') === 'read' ? 'selected' : '' }}>Read</option>
                    <option value="replied" {{ request('status') === 'replied' ? 'selected' : '' }}>Replied</option>
                </select>

                <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span>Search</span>
                </button>

                @if(request()->hasAny(['search', 'status']))
                    <a href="{{ route('admin.inquiries.messages') }}" class="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Messages List -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($messages->isEmpty())
            <div class="py-12 text-center text-slate-400 text-sm">
                No contact inquiries found.
            </div>
        @else
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
                @foreach($messages as $msg)
                    <div class="py-5 first:pt-0 last:pb-0 space-y-3">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400">
                                    {{ substr($msg->name, 0, 1) }}
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-bold text-slate-900 dark:text-white">{{ $msg->name }}</h4>
                                        @if($msg->company)
                                            <span class="text-xs text-slate-500">({{ $msg->company }})</span>
                                        @endif
                                        @if($msg->status === 'unread')
                                            <span class="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">New</span>
                                        @endif
                                    </div>
                                    <p class="text-xs text-blue-600 dark:text-blue-400 font-mono">{{ $msg->email }} @if($msg->phone)&bull; {{ $msg->phone }}@endif</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 text-xs">
                                <span class="text-slate-400">{{ $msg->created_at->format('M d, Y h:i A') }}</span>
                                
                                <form method="POST" action="{{ route('admin.inquiries.messages.status', $msg->id) }}" class="inline">
                                    @csrf
                                    @method('PATCH')
                                    <select name="status" onchange="this.form.submit()" class="rounded-lg border border-slate-200 bg-white py-1 px-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                        <option value="unread" {{ $msg->status === 'unread' ? 'selected' : '' }}>Unread</option>
                                        <option value="read" {{ $msg->status === 'read' ? 'selected' : '' }}>Read</option>
                                        <option value="replied" {{ $msg->status === 'replied' ? 'selected' : '' }}>Replied</option>
                                    </select>
                                </form>

                                <form method="POST" action="{{ route('admin.inquiries.messages.destroy', $msg->id) }}" onsubmit="return confirm('Delete message?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-slate-400 hover:text-rose-600 transition">&times;</button>
                                </form>
                            </div>
                        </div>

                        <div class="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-100 dark:border-slate-800 text-xs">
                            <div class="font-bold text-slate-800 dark:text-slate-200 mb-1">Subject: {{ $msg->subject ?: 'General Inquiry' }}</div>
                            <p class="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{{ $msg->message }}</p>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="mt-6">
                {{ $messages->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
