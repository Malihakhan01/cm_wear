<?php

use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\OrderKanbanController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RfqController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TechPackController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\WooCommerceImportController;
use Illuminate\Support\Facades\Route;

// Redirect root to admin dashboard or login
Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

// Standard login route alias
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');

// Authentication Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login'])->name('login.submit');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // Protected Admin Panel Routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/products/import', [WooCommerceImportController::class, 'index'])->name('products.import');
        Route::post('/products/import/upload', [WooCommerceImportController::class, 'upload'])->name('products.import.upload');
        Route::get('/products/import/{job}/errors', [WooCommerceImportController::class, 'showErrors'])->name('products.import.errors');
        Route::post('/products/import/{job}/retry', [WooCommerceImportController::class, 'retry'])->name('products.import.retry');
        Route::delete('/products/import/{job}', [WooCommerceImportController::class, 'destroy'])->name('products.import.destroy');
        Route::delete('/products/{product}/images/{image}', [ProductController::class, 'deleteImage'])->name('products.images.destroy');
        Route::patch('/products/{product}/images/{image}/set-primary', [ProductController::class, 'setPrimaryImage'])->name('products.images.set-primary');
        Route::post('/products/{product}/images/{image}/set-primary', [ProductController::class, 'setPrimaryImage'])->name('products.images.set-primary.post');
        Route::post('/products/bulk-delete', [ProductController::class, 'bulkDestroy'])->name('products.bulk-delete');
        Route::resource('products', ProductController::class);

        // Categories Taxonomy
        Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);

        // Appearance & Header Mega Menu Manager (WordPress Appearance > Menus style)
        Route::get('/menus', [\App\Http\Controllers\Admin\MenuController::class, 'index'])->name('menus.index');
        Route::post('/menus', [\App\Http\Controllers\Admin\MenuController::class, 'update'])->name('menus.update');
        Route::post('/menus/sync', [\App\Http\Controllers\Admin\MenuController::class, 'syncFromDb'])->name('menus.sync');
        Route::post('/menus/reset', [\App\Http\Controllers\Admin\MenuController::class, 'reset'])->name('menus.reset');


        // Inquiries, RFQs, Contact Messages & Subscribers
        Route::get('/inquiries', [RfqController::class, 'index'])->name('inquiries.index');
        Route::get('/inquiries/{rfq}', [RfqController::class, 'show'])->name('inquiries.show');
        Route::patch('/inquiries/{rfq}/status', [RfqController::class, 'updateStatus'])->name('inquiries.status');
        Route::post('/inquiries/{rfq}/notes', [RfqController::class, 'addNote'])->name('inquiries.note');

        Route::get('/inquiries-messages', [ContactMessageController::class, 'index'])->name('inquiries.messages');
        Route::patch('/inquiries-messages/{message}/status', [ContactMessageController::class, 'updateStatus'])->name('inquiries.messages.status');
        Route::delete('/inquiries-messages/{message}', [ContactMessageController::class, 'destroy'])->name('inquiries.messages.destroy');

        Route::get('/inquiries-subscribers', [NewsletterController::class, 'index'])->name('inquiries.subscribers');
        Route::delete('/inquiries-subscribers/{subscriber}', [NewsletterController::class, 'destroy'])->name('inquiries.subscribers.destroy');

        // Blog & Editorial Articles (CMS)
        Route::get('/blogs/categories', [BlogCategoryController::class, 'index'])->name('blogs.categories.index');
        Route::post('/blogs/categories', [BlogCategoryController::class, 'store'])->name('blogs.categories.store');
        Route::delete('/blogs/categories/{category}', [BlogCategoryController::class, 'destroy'])->name('blogs.categories.destroy');
        Route::resource('blogs', BlogPostController::class);

        // Testimonials & FAQs
        Route::resource('testimonials', TestimonialController::class)->only(['index', 'store', 'destroy']);
        Route::resource('faqs', FaqController::class)->only(['index', 'store', 'destroy']);

        // Customers / Wholesale Buyers Directory
        Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');

        // Orders & Live Factory Kanban Board
        Route::get('/orders/kanban', [OrderKanbanController::class, 'kanban'])->name('orders.kanban');
        Route::post('/orders/{order}/stage', [OrderKanbanController::class, 'updateStage'])->name('orders.stage');
        Route::resource('orders', OrderKanbanController::class)->only(['index', 'show']);

        // Factory Tech Packs & Specifications
        Route::get('/tech-packs', [TechPackController::class, 'index'])->name('tech-packs.index');
        Route::post('/tech-packs/deduplicate', [TechPackController::class, 'deduplicate'])->name('tech-packs.deduplicate');
        Route::post('/tech-packs/{techPack}/approve', [TechPackController::class, 'approve'])->name('tech-packs.approve');
        Route::post('/tech-packs/{techPack}/reject', [TechPackController::class, 'reject'])->name('tech-packs.reject');
        Route::get('/tech-packs/{techPack}/print', [TechPackController::class, 'printSpec'])->name('tech-packs.print');
        Route::delete('/tech-packs/{techPack}', [TechPackController::class, 'destroy'])->name('tech-packs.destroy');

        // Studio Customizer: Saved Designs & Dynamic Configuration Hub
        Route::get('/customizer/designs', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'designs'])->name('customizer.designs');
        Route::get('/customizer/designs/{design}', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'showDesign'])->name('customizer.designs.show');
        Route::get('/customizer/settings', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'settings'])->name('customizer.settings');
        Route::post('/customizer/options', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'storeOption'])->name('customizer.options.store');
        Route::post('/customizer/options/{option}/toggle', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'toggleOption'])->name('customizer.options.toggle');
        Route::delete('/customizer/options/{option}', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'deleteOption'])->name('customizer.options.destroy');
        Route::post('/customizer/templates/{template}/pom', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'updatePomGrading'])->name('customizer.templates.pom');
        Route::post('/customizer/templates/{template}/pricing', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'updateWholesaleTiers'])->name('customizer.templates.pricing');
        Route::post('/customizer/artworks/upload', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'uploadArtwork'])->name('customizer.artworks.upload');
        Route::delete('/customizer/artworks', [\App\Http\Controllers\Admin\CustomizerAdminController::class, 'deleteArtwork'])->name('customizer.artworks.destroy');

        // Platform & Whitelabel Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

        // User Account Profile & Security
        Route::get('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [\App\Http\Controllers\Admin\ProfileController::class, 'updatePassword'])->name('profile.password');
        Route::delete('/profile/avatar', [\App\Http\Controllers\Admin\ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    });
});
