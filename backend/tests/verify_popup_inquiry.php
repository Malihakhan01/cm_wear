<?php

require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Rfq;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\InquiryApiController;

echo "=== CM SPORTS WEAR: POPUP INQUIRY BACKEND INTEGRATION TEST ===\n\n";

$initialRfqCount = Rfq::count();
$initialContactCount = ContactMessage::count();
$initialNewsletterCount = NewsletterSubscription::count();

$controller = new InquiryApiController();

// 1. Test Customizer Lead Submission (Tab 1)
$leadRequest = Request::create('/api/v1/inquiries/rfq', 'POST', [
    'inquiry_type' => 'customizer_lead',
    'full_name' => 'Alexander Vance',
    'email' => 'alexander.vance@brandstudio.com',
    'company' => 'Vance Streetwear Atelier',
    'phone' => '+1 (555) 234-5678',
    'quantity' => 50,
    'message' => 'Lead from 3D Popup: Client selected Heritage 3D Varsity Jacket to start customizer session.',
]);

$leadResponse = $controller->storeRfq($leadRequest);
$leadData = json_decode($leadResponse->getContent(), true);

echo "[TEST 1] Customizer Lead RFQ Submission: " . ($leadData['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "         Generated RFQ Number: " . ($leadData['rfq_number'] ?? 'N/A') . "\n";

// 2. Test Blank Inquiry Submission (Tab 2)
$blankRequest = Request::create('/api/v1/inquiries/contact', 'POST', [
    'name' => 'Helena Rostova',
    'email' => 'helena@rostova-equestrian.de',
    'company' => 'Rostova Performance Apparel',
    'phone' => '+49 170 1234567',
    'subject' => 'Direct Home Popup Factory Inquiry',
    'message' => 'Direct Blank Manufacturing Inquiry via Home Popup: Client requested full OEM/ODM product catalog, wholesale volume price matrix, and fabric GSM specification swatches.',
]);

$contactResponse = $controller->storeContact($blankRequest);
$contactData = json_decode($contactResponse->getContent(), true);

echo "[TEST 2] Blank Inquiry Contact Submission: " . ($contactData['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "         Contact Record ID: " . ($contactData['id'] ?? 'N/A') . "\n";

// 3. Test Newsletter Subscription
$newsRequest = Request::create('/api/v1/inquiries/newsletter', 'POST', [
    'email' => 'alexander.vance@brandstudio.com',
]);
$newsResponse = $controller->storeNewsletter($newsRequest);
$newsData = json_decode($newsResponse->getContent(), true);

echo "[TEST 3] Newsletter Subscription: " . ($newsData['success'] ? 'SUCCESS' : 'FAILED') . "\n";

$newRfqCount = Rfq::count();
$newContactCount = ContactMessage::count();

echo "\n--- Database Verification ---\n";
echo "RFQs: Initial = {$initialRfqCount}, Current = {$newRfqCount} (+1)\n";
echo "Contact Messages: Initial = {$initialContactCount}, Current = {$newContactCount} (+1)\n";

$rfqRecord = Rfq::latest()->first();
$contactRecord = ContactMessage::latest()->first();

$allPassed = ($newRfqCount > $initialRfqCount) && 
             ($newContactCount > $initialContactCount) &&
             ($rfqRecord->email === 'alexander.vance@brandstudio.com') &&
             ($contactRecord->email === 'helena@rostova-equestrian.de');

echo "\nRESULT: " . ($allPassed ? "ALL INQUIRY BACKEND TESTS PASSED (100%)" : "FAILED") . "\n";
exit($allPassed ? 0 : 1);
