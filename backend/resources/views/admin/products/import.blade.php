@extends('layouts.admin')

@section('title', 'WooCommerce CSV Importer')
@section('header_title', 'WooCommerce CSV Product Importer')

@section('content')
<div class="space-y-8" 
     @if($recentJobs->whereIn('status', ['pending', 'processing'])->isNotEmpty())
        x-data="{ timer: null }"
        x-init="timer = setInterval(() => { window.location.reload(); }, 4000)"
     @endif
>
    
    <!-- Upload Section (Full Width Grid) -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left 7 Cols: Dropzone & Upload Form -->
            <div class="lg:col-span-7 space-y-4">
                <div class="flex items-center gap-3">
                    <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <div>
                        <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Import WooCommerce Products & Variations</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Standard WooCommerce CSV export compatible (Simple, Variable & Customizer Garments)</p>
                    </div>
                </div>

                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Upload your WooCommerce product export CSV. The engine automatically builds category hierarchies, creates variable products, queues image downloads with local caching, and populates SEO meta tags.
                </p>

                <form method="POST" action="{{ route('admin.products.import.upload') }}" enctype="multipart/form-data" class="space-y-4 pt-2">
                    @csrf

                    <div class="flex items-center justify-center w-full">
                        <label for="csv_file" class="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950/50 dark:border-slate-800 dark:hover:bg-slate-950 transition">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                </div>
                                <p class="mb-1.5 text-sm text-slate-700 dark:text-slate-200 font-bold"><span class="text-emerald-600 dark:text-emerald-400 underline">Click to upload CSV</span> or drag and drop</p>
                                <p class="text-xs text-slate-400 dark:text-slate-500">Standard WooCommerce Product CSV Export (Up to 50MB)</p>
                            </div>
                            <input id="csv_file" name="csv_file" type="file" accept=".csv,text/csv" required class="hidden" onchange="document.getElementById('selected-filename').innerText = this.files[0] ? '✓ Selected: ' + this.files[0].name : '';" />
                        </label>
                    </div>

                    <div id="selected-filename" class="text-xs font-bold text-emerald-600 dark:text-emerald-400"></div>

                    <div class="flex items-center justify-between pt-2">
                        <span class="text-xs text-slate-400 dark:text-slate-500">Fast asynchronous parsing via background queue.</span>
                        <button type="submit" class="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition">
                            Start Asynchronous Import
                        </button>
                    </div>
                </form>
            </div>

            <!-- Right 5 Cols: Supported Columns & Import Checklist -->
            <div class="lg:col-span-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/50 space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Automatic Mapping Engine</span>
                </h3>

                <ul class="text-xs space-y-2.5 text-slate-600 dark:text-slate-400">
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-500 font-bold">✓</span>
                        <span><strong>WordPress & WooCommerce CDN Images:</strong> Downloads remote image URLs to local storage with instant preview fallback.</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-500 font-bold">✓</span>
                        <span><strong>Variable Products & SKUs:</strong> Handles Parent/Variation matching even when parent SKU is empty.</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-500 font-bold">✓</span>
                        <span><strong>Category Tree Builder:</strong> Parses hierarchical strings like <code>Sporting Goods > Belts</code>.</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-500 font-bold">✓</span>
                        <span><strong>Auto SEO Generation:</strong> Auto-fills meta title and meta descriptions if missing.</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-500 font-bold">✓</span>
                        <span><strong>Custom Specs:</strong> Supports <code>Meta: wholesale_price</code>, <code>Meta: moq</code>, <code>Meta: default_gsm</code>, and dimensions.</span>
                    </li>
                </ul>
            </div>

        </div>
    </div>

    <!-- Recent Import Jobs Log Table (Full Width) -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Import History & Processing Logs</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Background queue status, successful rows, and failure logs</p>
            </div>

            @if($recentJobs->whereIn('status', ['pending', 'processing'])->isNotEmpty())
                <span class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                    <span class="h-2 w-2 rounded-full bg-blue-600"></span>
                    Live Syncing (Auto-refresh active)
                </span>
            @endif
        </div>

        @if($recentJobs->isEmpty())
            <div class="py-12 text-center text-slate-400 text-sm">
                No CSV import jobs have been run yet.
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3">Job ID</th>
                            <th class="pb-3">File Name</th>
                            <th class="pb-3">Status</th>
                            <th class="pb-3 text-center">Progress</th>
                            <th class="pb-3 text-center">Success</th>
                            <th class="pb-3 text-center">Errors</th>
                            <th class="pb-3">Date</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($recentJobs as $job)
                            @php
                                $hasErrors = ($job->failed_rows > 0 || ($job->errors_count ?? $job->errors->count()) > 0 || $job->status === 'failed');
                                $latestError = $job->errors->first();
                            @endphp
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-4 font-mono font-bold text-slate-500">#{{ $job->id }}</td>
                                <td class="py-4 font-bold text-slate-900 dark:text-white truncate max-w-xs">
                                    <div class="flex items-center gap-1.5">
                                        <span>{{ $job->file_name ?? basename($job->file_path) }}</span>
                                    </div>
                                    @if($job->status === 'failed' && $latestError)
                                        <div class="text-[11px] font-normal text-rose-500 line-clamp-1 mt-0.5" title="{{ $latestError->error_message }}">
                                            Error: {{ Str::limit($latestError->error_message, 65) }}
                                        </div>
                                    @endif
                                </td>
                                <td class="py-4">
                                    @if($job->status === 'completed' || ($job->status === 'completed' && $job->failed_rows == 0))
                                        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            ✓ Completed (All {{ $job->successful_rows }} Success)
                                        </span>
                                    @elseif($job->status === 'completed_with_errors' || ($job->failed_rows > 0 && $job->successful_rows > 0))
                                        <a href="{{ route('admin.products.import.errors', $job->id) }}" class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition" title="Click to view errors">
                                            ⚠ Completed ({{ $job->failed_rows }} Errors)
                                        </a>
                                    @elseif($job->status === 'processing')
                                        <span class="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                                            ⟳ Processing ({{ $job->processed_rows }}/{{ $job->total_rows }})...
                                        </span>
                                    @elseif($job->status === 'failed')
                                        <a href="{{ route('admin.products.import.errors', $job->id) }}" class="inline-flex items-center gap-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400 transition" title="Click to view failure details">
                                            ✕ Failed
                                        </a>
                                    @else
                                        <span class="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                                            ⏳ Queued
                                        </span>
                                    @endif
                                </td>
                                <td class="py-4 text-center font-medium">
                                    {{ $job->processed_rows }} / {{ $job->total_rows }}
                                </td>
                                <td class="py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                                    {{ $job->successful_rows }}
                                </td>
                                <td class="py-4 text-center">
                                    @if($hasErrors)
                                        <a href="{{ route('admin.products.import.errors', $job->id) }}" class="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition">
                                            <span>{{ max($job->failed_rows, $job->errors_count ?? $job->errors->count()) }}</span>
                                            <span class="text-[10px]">Errors</span>
                                        </a>
                                    @else
                                        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">0</span>
                                    @endif
                                </td>
                                <td class="py-4 text-xs text-slate-500">
                                    {{ $job->created_at->format('M d, Y H:i') }}
                                </td>
                                <td class="py-4 text-right space-x-2 whitespace-nowrap">
                                    @if($hasErrors)
                                        <a href="{{ route('admin.products.import.errors', $job->id) }}" 
                                           class="inline-flex items-center gap-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 transition">
                                            <span>View {{ max($job->failed_rows, $job->errors_count ?? $job->errors->count()) }} Errors</span>
                                        </a>
                                    @endif

                                    <form method="POST" action="{{ route('admin.products.import.retry', $job->id) }}" class="inline">
                                        @csrf
                                        <button type="submit" title="Retry Import Job" class="text-xs font-bold text-slate-400 hover:text-blue-500 transition px-1.5 py-1">
                                            Retry
                                        </button>
                                    </form>

                                    <form method="POST" action="{{ route('admin.products.import.destroy', $job->id) }}" class="inline" onsubmit="return confirm('Permanently delete this import job and its uploaded CSV file?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" title="Delete CSV & Import Job" class="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-1">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            <span class="sr-only sm:not-sr-only">Delete</span>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $recentJobs->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
