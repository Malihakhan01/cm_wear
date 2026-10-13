<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Set proper sort orders for root categories
$orderMap = [
    'casual-wear' => 1,
    'equestrian-clothing' => 2,
    'ice-hockey' => 3,
    'cycling' => 4,
    'rugby' => 5,
    'basketball' => 6,
    'ski-wear' => 7,
    'go-karting-racing' => 8,
    'bavarian-wear' => 9,
    'martial-arts' => 10,
];

foreach ($orderMap as $slug => $order) {
    $updated = \App\Models\Category::where('slug', $slug)->update(['sort_order' => $order]);
    echo "Category '{$slug}' set sort_order = {$order} (rows: {$updated})\n";
}

// Check count of products for each
foreach ($orderMap as $slug => $order) {
    $cat = \App\Models\Category::where('slug', $slug)->withCount('products')->first();
    if ($cat) {
        echo "- {$cat->name} (#{$cat->sort_order}): {$cat->products_count} direct products\n";
    }
}
