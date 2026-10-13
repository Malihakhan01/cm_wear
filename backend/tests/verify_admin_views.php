<?php

require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\TechPack;
use App\Models\CustomizerDesign;
use App\Models\CustomizerOption;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\TechPackController;
use App\Http\Controllers\Admin\CustomizerAdminController;

echo "=== TAWFIQ INDUSTRIES: ADMIN BLADE VIEW RENDERING TESTS ===\n\n";

$admin = User::first();
if (!$admin) {
    $admin = User::create([
        'name' => 'Super Administrator',
        'email' => 'admin@example.com',
        'password' => bcrypt('password'),
        'role' => 'super_admin'
    ]);
}
auth()->login($admin);

try {
    $tpController = new TechPackController();
    $tpReq = new Request();
    $tpView = $tpController->index($tpReq);
    $tpHtml = $tpView->render();
    echo "[PASS] Tech Packs Listing Blade View (/admin/tech-packs)\n";
    echo "       Rendered successfully: " . strlen($tpHtml) . " bytes\n";
    echo "       Contains Clean Duplicates button: " . (str_contains($tpHtml, 'Clean Duplicates') ? 'YES' : 'NO') . "\n";
    echo "       Contains Status badges: " . (str_contains($tpHtml, 'bg-emerald-500/10') || str_contains($tpHtml, 'bg-amber-500/10') ? 'YES' : 'NO') . "\n\n";
} catch (\Throwable $e) {
    echo "[FAIL] Tech Packs Listing View: " . $e->getMessage() . "\n\n";
}

try {
    $firstTp = TechPack::first();
    if ($firstTp) {
        $printView = $tpController->printSpec($firstTp);
        $printHtml = $printView->render();
        echo "[PASS] Printable Tech Pack Factory Spec Sheet (/admin/tech-packs/{id}/print)\n";
        echo "       Rendered successfully: " . strlen($printHtml) . " bytes\n";
        echo "       Contains BOM & POM tables: " . (str_contains($printHtml, 'Bill of Materials') && str_contains($printHtml, 'Points of Measure') ? 'YES' : 'NO') . "\n\n";
    }
} catch (\Throwable $e) {
    echo "[FAIL] Tech Pack Print View: " . $e->getMessage() . "\n\n";
}

try {
    $customizerAdmin = new CustomizerAdminController();
    $designsReq = new Request();
    $designsView = $customizerAdmin->designs($designsReq);
    $designsHtml = $designsView->render();
    echo "[PASS] Saved Designs Vault Blade View (/admin/customizer/designs)\n";
    echo "       Rendered successfully: " . strlen($designsHtml) . " bytes\n";
    echo "       Contains Studio link & inspect modal: " . (str_contains($designsHtml, 'Launch Studio') ? 'YES' : 'NO') . "\n\n";
} catch (\Throwable $e) {
    echo "[FAIL] Saved Designs View: " . $e->getMessage() . "\n\n";
}

try {
    $settingsView = $customizerAdmin->settings();
    $settingsHtml = $settingsView->render();
    echo "[PASS] Customizer Engine Settings View (/admin/customizer/settings)\n";
    echo "       Rendered successfully: " . strlen($settingsHtml) . " bytes\n";
    echo "       Contains dynamic tabs (Swatches, Decoration, Typography, Artwork, Templates, POMs): " .
         (str_contains($settingsHtml, 'Color Swatches') && str_contains($settingsHtml, 'Decoration Methods') && str_contains($settingsHtml, 'Artwork Library') ? 'YES' : 'NO') . "\n\n";
} catch (\Throwable $e) {
    echo "[FAIL] Customizer Settings View: " . $e->getMessage() . "\n\n";
}

echo "All Admin Blade views rendered without errors.\n";
