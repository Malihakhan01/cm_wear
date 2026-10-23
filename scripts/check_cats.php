<?php
require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== CATEGORIES ===\n";
foreach (\App\Models\Category::all() as $c) {
    if (preg_match('/hockey|soccer|football|basketball|sport/i', $c->name)) {
        echo "{$c->id} | {$c->name} | {$c->slug} | parent_id: {$c->parent_id}\n";
    }
}

echo "\n=== PRODUCT COUNTS PER KEYWORD ===\n";
foreach (['hockey', 'soccer', 'american football', 'football', 'basketball'] as $kw) {
    $count = \App\Models\Product::where('name', 'like', "%{$kw}%")->count();
    echo "Keyword '{$kw}': {$count} products\n";
    $first3 = \App\Models\Product::where('name', 'like', "%{$kw}%")->take(3)->pluck('name');
    foreach ($first3 as $n) {
        echo "  - {$n}\n";
    }
}
