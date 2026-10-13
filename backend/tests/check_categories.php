<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$cats = \App\Models\Category::whereIn('slug', ['martial-arts', 'bavarian-wear'])->get();
foreach ($cats as $c) {
    echo "=== CATEGORY: {$c->name} ===\n";
    print_r($c->toArray());
}

echo "\n=== QUERY RESULT FROM API CONTROLLER ===\n";
$apiCats = \App\Models\Category::whereNull('parent_id')
    ->where('is_active', true)
    ->with(['children' => fn($q) => $q->where('is_active', true)->withCount('products')])
    ->withCount('products')
    ->orderBy('sort_order')
    ->get();

echo "Total returned by CategoryApiController query: " . $apiCats->count() . "\n";
foreach ($apiCats as $ac) {
    echo "- ID: {$ac->id} | Name: {$ac->name} | Slug: {$ac->slug} | Sort: {$ac->sort_order} | Products: {$ac->products_count}\n";
}
