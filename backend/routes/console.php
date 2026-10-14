<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('products:clear-demo', function () {
    $this->info('Clearing all demo product data from database...');
    
    \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    
    // Make product_id nullable on related tables so they never cause constraint issues
    try {
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE customizer_designs MODIFY product_id BIGINT UNSIGNED NULL;');
    } catch (\Throwable $e) {}
    try {
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE rfqs MODIFY product_id BIGINT UNSIGNED NULL;');
    } catch (\Throwable $e) {}
    try {
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE order_items MODIFY product_id BIGINT UNSIGNED NULL;');
    } catch (\Throwable $e) {}
    
    \Illuminate\Support\Facades\DB::table('category_product')->truncate();
    \Illuminate\Support\Facades\DB::table('product_variant_attributes')->truncate();
    \Illuminate\Support\Facades\DB::table('product_variants')->truncate();
    \Illuminate\Support\Facades\DB::table('product_images')->truncate();
    \Illuminate\Support\Facades\DB::table('product_wholesale_tiers')->truncate();
    \Illuminate\Support\Facades\DB::table('import_errors')->truncate();
    \Illuminate\Support\Facades\DB::table('import_jobs')->truncate();
    \Illuminate\Support\Facades\DB::table('customizer_designs')->truncate();
    \Illuminate\Support\Facades\DB::table('tech_packs')->truncate();
    \Illuminate\Support\Facades\DB::table('products')->truncate();
    
    \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    
    $this->info('✓ All demo product tables successfully truncated. Database is completely clean and ready for real CSV import.');
})->purpose('Completely remove all demo products from database');

Artisan::command('products:import-csv {file}', function ($file) {
    if (!file_exists($file)) {
        $this->error("File not found at: {$file}");
        return 1;
    }
    
    $this->info("Starting CSV import from: {$file}");
    
    $job = \App\Models\ImportJob::create([
        'user_id' => null,
        'file_name' => basename($file),
        'file_path' => realpath($file),
        'status' => 'pending',
    ]);
    
    $parser = new \App\Services\WooCommerceCsvParserService();
    $parser->process($job);
    
    $job->refresh();
    $this->info("Import finished! Status: {$job->status}, Total: {$job->total_rows}, Processed: {$job->processed_rows}, Successful: {$job->successful_rows}, Failed: {$job->failed_rows}");
    
    return 0;
})->purpose('Import products directly from WooCommerce CSV');
