<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customizer_designs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('design_code', 50)->unique();
            $table->string('design_name');
            $table->string('preview_front')->nullable();
            $table->string('preview_back')->nullable();
            $table->json('parts_colors')->comment('Hex color mapping for garment zones');
            $table->json('artwork_layers')->nullable()->comment('Uploaded vector logos, positioning, scale');
            $table->json('monogram_state')->nullable()->comment('Text, varsity fonts, felt border colors');
            $table->timestamps();
        });

        Schema::create('tech_packs', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('customizer_design_id')->nullable()->constrained('customizer_designs')->nullOnDelete();
            $table->string('style_name');
            $table->string('season', 50)->default('FW26');
            $table->string('fabric_spec');
            $table->unsignedInteger('target_gsm');
            $table->text('stitching_notes')->nullable();
            $table->json('pom_measurements')->comment('Points of Measure grading matrix XS-XXL');
            $table->json('bill_of_materials')->comment('BOM listing trims, labels, threads');
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tech_packs');
        Schema::dropIfExists('customizer_designs');
    }
};
