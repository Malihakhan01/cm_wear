@extends('layouts.admin')

@section('title', "Import Errors for Job #{$job->id}")
@section('header_title', "Import Errors Log — Job #{$job->id}")

@section('content')
<div class="space-y-6">
    
    <div class="flex items-center justify-between">
        <div>
            <a href="{{ route('admin.products.import') }}" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2">
                &larr; Back to Importer
            </a>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                Detailed Row Failures for <span class="font-mono text-emerald-500">{{ $job->file_name }}</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Total Failed Rows: {{ $job->failed_rows }} | Successful: {{ $job->successful_rows }}</p>
        </div>

        <form method="POST" action="{{ route('admin.products.import.retry', $job->id) }}">
            @csrf
            <button type="submit" class="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition">
                Retry Entire Job
            </button>
        </form>
    </div>

    <!-- Errors Table -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        @if($errors->isEmpty())
            <div class="py-12 text-center text-slate-400 text-sm">
                No error records found for this job.
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                            <th class="pb-3 w-16">Row #</th>
                            <th class="pb-3 w-32">SKU</th>
                            <th class="pb-3">Failure Reason</th>
                            <th class="pb-3 text-right">Raw Data Snapshot</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                        @foreach($errors as $err)
                            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                <td class="py-4 font-mono font-bold text-rose-500">{{ $err->row_number }}</td>
                                <td class="py-4 font-bold text-slate-900 dark:text-white">{{ $err->sku ?: '—' }}</td>
                                <td class="py-4 text-xs font-medium text-rose-600 dark:text-rose-400 leading-relaxed">
                                    {{ $err->error_message }}
                                </td>
                                <td class="py-4 text-right">
                                    @if(!empty($err->raw_data))
                                        <details class="text-xs text-left cursor-pointer inline-block">
                                            <summary class="font-bold text-blue-500 hover:underline">View Row JSON</summary>
                                            <pre class="mt-2 p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-[11px] max-w-lg max-h-48 overflow-auto border border-slate-800">{{ json_encode($err->raw_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) }}</pre>
                                        </details>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $errors->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
