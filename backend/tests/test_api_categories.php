<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$categories = \App\Models\Category::whereNull('parent_id')
    ->where('is_active', true)
    ->with(['children' => fn($q) => $q->where('is_active', true)->withCount('products')])
    ->withCount('products')
    ->where(function($q) {
        $q->where('sort_order', '>', 0)
          ->orWhereHas('products')
          ->orWhereHas('children', fn($ch) => $ch->has('products'));
    })
    ->orderByRaw('CASE WHEN sort_order > 0 THEN sort_order ELSE 100 + id END ASC')
    ->get();

echo "Returned Categories Count: " . $categories->count() . "\n";
foreach ($categories as $c) {
    echo "- #{$c->sort_order} | {$c->name} ({$c->slug}) | Products: {$c->products_count} | Children: " . $c->children->count() . "\n";
}
