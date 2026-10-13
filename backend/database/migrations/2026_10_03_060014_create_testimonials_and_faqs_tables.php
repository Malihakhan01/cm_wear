<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Testimonials & Client Reviews
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('client_role')->nullable(); // e.g. Founder, Production Director
            $table->string('company')->nullable();     // e.g. Apex Streetwear London
            $table->string('country')->nullable();     // e.g. United Kingdom
            $table->string('country_flag')->nullable(); // e.g. 🇬🇧 or GB
            $table->string('avatar')->nullable();
            $table->text('quote');
            $table->integer('rating')->default(5); // 1-5
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. FAQs (Frequently Asked Questions)
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('topic', 50)->default('General'); // General, Customizer, MOQ & Pricing, Manufacturing, Shipping
            $table->text('question');
            $table->longText('answer');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
    }
};
