<?php

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
} else {
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
}
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = App\Models\Product::whereNotNull('meta_description')->get();
$updated = 0;

foreach ($products as $p) {
    $orig = $p->meta_description;
    $clean = trim(preg_replace('/\s+/', ' ', str_replace(['\r\n', '\r', '\n', "\r\n", "\r", "\n"], ' ', $orig)));
    if ($clean !== $orig) {
        $p->meta_description = $clean;
        $p->save();
        $updated++;
    }
}

echo "Cleaned products count: {$updated}\n";
