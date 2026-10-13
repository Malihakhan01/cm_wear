<?php

use App\Http\Controllers\Api\BlogApiController;
use App\Http\Controllers\Api\FaqApiController;
use App\Http\Controllers\Api\InquiryApiController;
use App\Http\Controllers\Api\TechPackApiController;
use App\Http\Controllers\Api\TestimonialApiController;
use App\Http\Controllers\Api\V1\CategoryApiController;
use App\Http\Controllers\Api\V1\CustomizerApiController;
use App\Http\Controllers\Api\V1\OrderApiController;
use App\Http\Controllers\Api\V1\OrderTrackingApiController;
use App\Http\Controllers\Api\V1\ProductApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // API Health & Frontend Connection Status
    Route::get('/health', function () {
        return response()->json([
            'status' => 'operational',
            'app' => 'Tawfiq Industries Backend API Core',
            'version' => '1.0.0',
            'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    // Products
    Route::get('/products', [ProductApiController::class, 'index']);
    Route::get('/products/{slug}', [ProductApiController::class, 'show']);

    // Categories
    Route::get('/categories', [CategoryApiController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryApiController::class, 'show']);

    // 2D/3D Customizer State Engine, Dynamic Config & Artwork Vault
    Route::get('/customizer/config', [CustomizerApiController::class, 'config']);
    Route::get('/customizer/artworks', [CustomizerApiController::class, 'artworks']);
    Route::post('/customizer/upload-artwork', [CustomizerApiController::class, 'uploadArtwork'])->middleware('throttle:60,1');
    Route::post('/customizer/upload-logo', [CustomizerApiController::class, 'uploadArtwork'])->middleware('throttle:60,1');
    Route::post('/customizer/save', [CustomizerApiController::class, 'save'])->middleware('throttle:60,1');
    Route::get('/customizer/{code}', [CustomizerApiController::class, 'show']);

    // Factory Tech Packs & Specifications
    Route::post('/tech-packs', [TechPackApiController::class, 'store'])->middleware('throttle:60,1');
    Route::get('/tech-packs', [TechPackApiController::class, 'index']);
    Route::get('/tech-packs/{code}', [TechPackApiController::class, 'show']);

    // Commercial Orders
    Route::post('/orders', [OrderApiController::class, 'store']);
    Route::get('/orders/{orderNumber}', [OrderApiController::class, 'show']);

    // Live Factory Floor Order Tracker
    Route::get('/track/{orderNumber}', [OrderTrackingApiController::class, 'track']);

    // Inquiries, RFQs & Newsletter
    Route::post('/inquiries/rfq', [InquiryApiController::class, 'storeRfq']);
    Route::post('/inquiries/contact', [InquiryApiController::class, 'storeContact']);
    Route::post('/inquiries/newsletter', [InquiryApiController::class, 'storeNewsletter']);

    // Blog & Editorial Articles
    Route::get('/blogs', [BlogApiController::class, 'index']);
    Route::get('/blogs/{slug}', [BlogApiController::class, 'show']);
    Route::get('/blog-categories', [BlogApiController::class, 'categories']);

    // Testimonials & FAQs
    Route::get('/testimonials', [TestimonialApiController::class, 'index']);
    Route::get('/faqs', [FaqApiController::class, 'index']);
});
