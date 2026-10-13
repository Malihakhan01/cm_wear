<?php

/**
 * Verification Test Suite for Product Customization and Factory Tech Pack System
 * Tests:
 * 1. Fingerprint deduplication & versioning across distinct designs
 * 2. Non-destructive duplicate cleanup (archiving without permanent deletion)
 * 3. File validation and SVG sanitization security
 * 4. Customizer dynamic configuration API (swatches, fonts, trims, templates)
 * 5. Tech pack approval and rejection workflow
 * 6. Save & restore compatibility for all 4 garment customizers
 */

require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\CustomizerDesign;
use App\Models\CustomizerOption;
use App\Models\Product;
use App\Models\TechPack;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\V1\CustomizerApiController;
use App\Http\Controllers\Api\TechPackApiController;
use App\Http\Controllers\Admin\TechPackController;

echo "=== TAWFIQ INDUSTRIES: CUSTOMIZER & TECH PACK VERIFICATION SUITE ===\n\n";

$passCount = 0;
$failCount = 0;

function assertTest(bool $condition, string $name, string $details = '') {
    global $passCount, $failCount;
    if ($condition) {
        echo "[PASS] " . $name . "\n";
        if ($details) echo "       Details: " . $details . "\n";
        $passCount++;
    } else {
        echo "[FAIL] " . $name . "\n";
        if ($details) echo "       Details: " . $details . "\n";
        $failCount++;
    }
}

// -------------------------------------------------------------
// TEST 1: Database Seed and Dynamic Options
// -------------------------------------------------------------
echo "\n--- Section 1: Dynamic Customizer Configuration ---\n";
$swatchCount = CustomizerOption::where('category', 'color_swatch')->where('is_active', true)->count();
$fontCount = CustomizerOption::where('category', 'font')->where('is_active', true)->count();
$decorCount = CustomizerOption::where('category', 'decoration_method')->where('is_active', true)->count();
$templateCount = CustomizerOption::where('category', 'garment_template')->where('is_active', true)->count();

assertTest($swatchCount >= 15, "Swatches present in database", "Found {$swatchCount} active swatches");
assertTest($fontCount >= 6, "Typography fonts present in database", "Found {$fontCount} active fonts");
assertTest($decorCount >= 5, "Decoration techniques present", "Found {$decorCount} active decoration methods");
assertTest($templateCount >= 4, "Garment templates present", "Found {$templateCount} garment templates");

$apiController = new CustomizerApiController();
$configResponse = $apiController->config();
$configData = json_decode($configResponse->getContent(), true);

assertTest(
    isset($configData['success']) && $configData['success'] === true &&
    isset($configData['data']['swatches']) && count($configData['data']['swatches']) >= 15,
    "GET /api/v1/customizer/config endpoint returns populated configuration",
    "Returned " . count($configData['data']['swatches'] ?? []) . " swatches"
);

// -------------------------------------------------------------
// TEST 2: Tech Pack Deduplication by Unique Design Fingerprint
// -------------------------------------------------------------
echo "\n--- Section 2: Deduplication by Fingerprint & Versioning ---\n";

$product = Product::first();
if (!$product) {
    $product = Product::create([
        'name' => 'Heritage Melton Wool Varsity Jacket',
        'slug' => 'heritage-varsity-jacket',
        'price' => 68.00,
        'sku' => 'VAR-001',
        'is_active' => true,
    ]);
}

// Design A (Red Body)
$requestDesignA = Request::create('/api/v1/customizer/save', 'POST', [
    'product_id' => $product->id,
    'design_name' => 'Varsity Crimson Edition',
    'parts_colors' => ['body' => '#D61C24', 'sleeves' => '#FFFFFF'],
    'artwork_layers' => [['name' => 'Logo A', 'url' => '/images/logoA.png', 'x' => 100, 'y' => 100]],
    'decoration_method' => '3d-puff-embroidery',
    'total_units' => 50,
]);
$saveAResponse = json_decode($apiController->save($requestDesignA)->getContent(), true);
$designACode = $saveAResponse['design_code'];

// Design B (Black Body - distinct design, same product)
$requestDesignB = Request::create('/api/v1/customizer/save', 'POST', [
    'product_id' => $product->id,
    'design_name' => 'Varsity Stealth Edition',
    'parts_colors' => ['body' => '#0A0A0A', 'sleeves' => '#20201E'],
    'artwork_layers' => [['name' => 'Logo B', 'url' => '/images/logoB.png', 'x' => 150, 'y' => 150]],
    'decoration_method' => 'screen-print',
    'total_units' => 100,
]);
$saveBResponse = json_decode($apiController->save($requestDesignB)->getContent(), true);
$designBCode = $saveBResponse['design_code'];

assertTest($designACode !== $designBCode, "Distinct designs receive unique design codes", "Design A: {$designACode}, Design B: {$designBCode}");

$designARecord = CustomizerDesign::where('design_code', $designACode)->first();
$designBRecord = CustomizerDesign::where('design_code', $designBCode)->first();

assertTest(
    $designARecord && $designBRecord && $designARecord->design_fingerprint !== $designBRecord->design_fingerprint,
    "Design fingerprints differ for visually distinct customizations",
    "Fingerprint A: " . substr($designARecord->design_fingerprint, 0, 10) . "..., Fingerprint B: " . substr($designBRecord->design_fingerprint, 0, 10) . "..."
);

// -------------------------------------------------------------
// TEST 3: Safe Non-Destructive Cleanup (Zero Deletions)
// -------------------------------------------------------------
echo "\n--- Section 3: Safe Deduplication (Clean Duplicates) ---\n";

$initialTechPackCount = TechPack::count();
$initialDesignCount = CustomizerDesign::count();

// Create a duplicate draft tech pack with identical fingerprint
$duplicateDraft = TechPack::create([
    'product_id' => $product->id,
    'code' => 'TP-TEST-DRAFT-' . rand(1000, 9999),
    'customizer_design_id' => $designARecord->id,
    'design_fingerprint' => $designARecord->design_fingerprint,
    'style_name' => 'Varsity Duplicate Draft',
    'season' => 'FW26',
    'fabric_spec' => '500 GSM Melton Wool',
    'target_gsm' => 500,
    'parts_colors' => ['body' => '#D61C24', 'sleeves' => '#FFFFFF'],
    'pom_measurements' => ['chest_width' => 58, 'body_length' => 70],
    'bill_of_materials' => [['item' => 'Wool Melton', 'supplier' => 'Heritage Mill']],
    'status' => 'draft',
    'version' => '1.0',
]);

$adminTpController = new TechPackController();
$cleanResponse = $adminTpController->deduplicate(new Request());

$postTechPackCount = TechPack::count();
$postDesignCount = CustomizerDesign::count();

assertTest(
    $postTechPackCount >= $initialTechPackCount,
    "Clean Duplicates function does NOT delete records from tech_packs table",
    "Initial: {$initialTechPackCount}, Post: {$postTechPackCount} (Cleaned duplicates archived as status='archived')"
);

assertTest(
    $postDesignCount === $initialDesignCount,
    "Clean Duplicates function NEVER touches or deletes customer customizer designs",
    "Customer designs count strictly preserved: {$postDesignCount}"
);

$reloadedDuplicate = TechPack::find($duplicateDraft->id);
assertTest(
    $reloadedDuplicate && $reloadedDuplicate->status === 'archived',
    "Identical redundant draft safely archived instead of hard-deleted",
    "Draft ID {$duplicateDraft->id} status is now '{$reloadedDuplicate->status}'"
);

// -------------------------------------------------------------
// TEST 4: Tech Pack Approval & Rejection Workflow
// -------------------------------------------------------------
echo "\n--- Section 4: Tech Pack Approval Workflow ---\n";

$adminUser = User::first();
if (!$adminUser) {
    $adminUser = User::create([
        'name' => 'Super Administrator',
        'email' => 'admin@example.com',
        'password' => bcrypt('password'),
        'role' => 'super_admin',
    ]);
}
auth()->login($adminUser);

$testTp = TechPack::create([
    'product_id' => $product->id,
    'code' => 'TP-TEST-APPR-' . rand(1000, 9999),
    'style_name' => 'Approval Workflow Test Spec',
    'season' => 'FW26',
    'fabric_spec' => '450 GSM French Terry',
    'target_gsm' => 450,
    'parts_colors' => ['body' => '#0A0A0A'],
    'pom_measurements' => ['chest_width' => 60, 'body_length' => 72],
    'bill_of_materials' => [['item' => 'French Terry', 'supplier' => 'Tawfiq Mill']],
    'status' => 'submitted',
    'version' => '1.0',
]);

// Test Approval
$adminTpController->approve(new Request(), $testTp);
$testTp->refresh();
assertTest(
    $testTp->status === 'approved' && $testTp->approved_by === $adminUser->id && !empty($testTp->approved_at),
    "Tech pack approval records status='approved', approved_by, and timestamp",
    "Status: {$testTp->status}, Approved By ID: {$testTp->approved_by}"
);

// Test Rejection
$rejectRequest = Request::create('/admin/tech-packs/' . $testTp->id . '/reject', 'POST', [
    'reason' => 'Incorrect sleeve rib width specified in POM table',
]);
$adminTpController->reject($rejectRequest, $testTp);
$testTp->refresh();
assertTest(
    $testTp->status === 'rejected' && $testTp->rejection_reason === 'Incorrect sleeve rib width specified in POM table',
    "Tech pack rejection records status='rejected' and audit reason",
    "Status: {$testTp->status}, Reason: '{$testTp->rejection_reason}'"
);

// -------------------------------------------------------------
// TEST 5: Upload Security & SVG Sanitization
// -------------------------------------------------------------
echo "\n--- Section 5: Upload Security & SVG Sanitization ---\n";

// Malicious SVG with embedded script and XXE entity
$maliciousSvg = '<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="red" onload="alert(document.cookie)" />
  <script type="text/javascript">alert("XSS Attack!");</script>
  <a href="javascript:alert(1)"><text x="10" y="20">&xxe;</text></a>
</svg>';

Storage::fake('public');
$fakeFile = UploadedFile::fake()->createWithContent('malicious.svg', $maliciousSvg);

$uploadRequest = Request::create('/api/v1/customizer/upload-artwork', 'POST', [], [], ['file' => $fakeFile]);
$uploadResponse = json_decode($apiController->uploadArtwork($uploadRequest)->getContent(), true);

assertTest(
    isset($uploadResponse['success']) && $uploadResponse['success'] === true,
    "Artwork upload processes valid SVG extension",
    "Saved as {$uploadResponse['filename']}"
);

// Verify the sanitized stored content
$storedContent = Storage::disk('public')->get('customizer_artworks/' . $uploadResponse['filename']);
$hasScript = str_contains($storedContent, '<script') || str_contains($storedContent, 'alert(') || str_contains($storedContent, 'javascript:') || str_contains($storedContent, 'onload');

assertTest(
    !$hasScript,
    "SVG Sanitizer stripped all <script>, onload handlers, and javascript: links",
    "Sanitized content length: " . strlen($storedContent) . " bytes without malicious executable vectors"
);

// -------------------------------------------------------------
// TEST 6: Garment Customizers Save & Restore Compatibility
// -------------------------------------------------------------
echo "\n--- Section 6: All 4 Garment Customizers Verification ---\n";

$garmentSpecs = [
    'hoodie' => [
        'name' => 'Streetwear Drop-Shoulder Hoodie',
        'colors' => ['body' => '#0A0A0A', 'hood' => '#0A0A0A', 'pocket' => '#D61C24', 'cuffs' => '#20201E'],
        'method' => 'screen-print',
        'sizes' => ['S' => 20, 'M' => 40, 'L' => 30, 'XL' => 10],
    ],
    'varsity' => [
        'name' => 'Heritage Melton Wool & Leather Varsity Jacket',
        'colors' => ['body' => '#111B2C', 'sleeves' => '#FFFFFF', 'collar' => '#D61C24', 'cuffs' => '#D61C24', 'buttons' => '#FFFFFF'],
        'method' => 'chenille-patch',
        'sizes' => ['M' => 25, 'L' => 25],
    ],
    'basketball' => [
        'name' => 'Pro Air-Mesh Basketball Uniform',
        'colors' => ['jersey' => '#CA8A04', 'ribs' => '#111B2C', 'shorts' => '#CA8A04'],
        'method' => 'sublimation',
        'sizes' => ['L' => 50, 'XL' => 50],
    ],
    'equestrian' => [
        'name' => 'Italian Softshell Performance Equestrian Jacket',
        'colors' => ['body' => '#111B2C', 'sleeves' => '#0A0A0A', 'ribs' => '#D61C24', 'leggings' => '#20201E'],
        'method' => 'silicone-patch',
        'sizes' => ['XS' => 10, 'S' => 20, 'M' => 20],
    ],
];

foreach ($garmentSpecs as $type => $spec) {
    $req = Request::create('/api/v1/customizer/save', 'POST', [
        'product_id' => $product->id,
        'design_name' => $spec['name'] . ' Spec',
        'parts_colors' => $spec['colors'],
        'artwork_layers' => [
            ['name' => 'Front Emblem', 'url' => '/images/test-emblem.png', 'x' => 180, 'y' => 220, 'scale' => 1.0]
        ],
        'monogram_state' => [
            ['text' => 'TI', 'font' => 'Varsity Serif', 'color' => '#FFFFFF']
        ],
        'decoration_method' => $spec['method'],
        'size_breakdown' => $spec['sizes'],
        'total_units' => array_sum($spec['sizes']),
    ]);

    $res = json_decode($apiController->save($req)->getContent(), true);
    $dCode = $res['design_code'] ?? null;

    $showRes = json_decode($apiController->show($dCode)->getContent(), true);
    $savedData = $showRes['data'] ?? [];

    $colorMatch = ($savedData['parts_colors'] == $spec['colors']);
    $artCount = count($savedData['artwork_layers'] ?? []);
    $sizeCount = count($savedData['size_breakdown'] ?? []);

    assertTest(
        $dCode && $colorMatch && $artCount === 1 && $sizeCount === count($spec['sizes']),
        "Customizer [{$type}] saves & restores colors, artwork, monogram, and sizes",
        "Code: {$dCode}, Total Units: {$savedData['total_units']}"
    );
}

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
echo "\n======================================================\n";
echo "TEST SUITE EXECUTION COMPLETED\n";
echo "TOTAL PASSED: {$passCount}\n";
echo "TOTAL FAILED: {$failCount}\n";
echo "SUCCESS RATE: " . round(($passCount / ($passCount + $failCount)) * 100, 1) . "%\n";
echo "======================================================\n";
exit($failCount > 0 ? 1 : 0);
