<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$ma = App\Models\Category::where('slug', 'martial-arts')->first();
echo "MARTIAL ARTS:\n" . json_encode($ma, JSON_PRETTY_PRINT) . "\n\n";

$bw = App\Models\Category::where('slug', 'bavarian-wear')->first();
echo "BAVARIAN WEAR:\n" . json_encode($bw, JSON_PRETTY_PRINT) . "\n\n";

echo "MARTIAL ARTS CHILDREN:\n";
foreach ($ma->children as $ch) {
    echo "- ID: {$ch->id} | Name: {$ch->name} | Slug: {$ch->slug} | Products: " . $ch->products()->count() . "\n";
}

echo "BAVARIAN WEAR CHILDREN:\n";
foreach ($bw->children as $ch) {
    echo "- ID: {$ch->id} | Name: {$ch->name} | Slug: {$ch->slug} | Products: " . $ch->products()->count() . "\n";
}
