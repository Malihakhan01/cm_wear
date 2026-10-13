<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessWooCommerceCsvJob;
use App\Models\ImportError;
use App\Models\ImportJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WooCommerceImportController extends Controller
{
    public function index()
    {
        $recentJobs = ImportJob::with(['user', 'errors'])
            ->withCount('errors')
            ->latest()
            ->paginate(10);

        return view('admin.products.import', compact('recentJobs'));
    }

    public function upload(Request $request)
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:51200'], // 50MB max
        ]);

        $file = $request->file('csv_file');
        $fileName = $file->getClientOriginalName();
        $storedPath = $file->store('csv_imports', 'local');
        $absolutePath = Storage::disk('local')->path($storedPath);

        $job = ImportJob::create([
            'user_id' => auth()->id(),
            'file_name' => $fileName,
            'file_path' => $absolutePath,
            'status' => 'pending',
        ]);

        // Dispatch background processing job
        ProcessWooCommerceCsvJob::dispatch($job->id);

        return redirect()->route('admin.products.import')
            ->with('success', "CSV '{$fileName}' uploaded successfully and queued for background import.");
    }

    public function showErrors(ImportJob $job)
    {
        $errors = $job->errors()->paginate(25);

        return view('admin.products.import-errors', compact('job', 'errors'));
    }

    public function retry(ImportJob $job)
    {
        $job->update([
            'status' => 'pending',
            'processed_rows' => 0,
            'successful_rows' => 0,
            'failed_rows' => 0,
            'started_at' => null,
            'completed_at' => null,
        ]);

        $job->errors()->delete();

        ProcessWooCommerceCsvJob::dispatch($job->id);

        return redirect()->route('admin.products.import')
            ->with('success', "Import job #{$job->id} has been re-queued for processing.");
    }

    public function destroy(ImportJob $job)
    {
        // 1. Permanently delete uploaded CSV file from disk
        if (!empty($job->file_path)) {
            if (file_exists($job->file_path)) {
                @unlink($job->file_path);
            }
            if (Storage::disk('local')->exists($job->file_path)) {
                Storage::disk('local')->delete($job->file_path);
            }
        }

        $fileName = $job->file_name ?? basename($job->file_path);

        // 2. Delete associated error logs
        $job->errors()->delete();

        // 3. Delete the job record
        $job->delete();

        return redirect()->route('admin.products.import')
            ->with('success', "Import job #{$job->id} ({$fileName}) and its uploaded CSV file have been deleted.");
    }
}
