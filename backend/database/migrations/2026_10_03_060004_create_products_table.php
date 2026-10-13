<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wc_id')->nullable()->index()->comment('Original WooCommerce Product ID');
            $table->string('sku', 100)->nullable()->unique()->comment('Nullable for variable parent products');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('product_type', 50)->default('simple'); // simple, variable, customizable_apparel
            $table->string('status', 50)->default('published');   // published, draft, archived
            $table->boolean('is_featured')->default(false);
            $table->string('visibility', 50)->default('visible'); // visible, catalog, search, hidden

            // Descriptions
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();

            // Pricing & Wholesale
            $table->decimal('regular_price', 10, 2)->default(0.00);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->decimal('wholesale_price', 10, 2)->default(0.00);
            $table->unsignedInteger('moq')->default(50);

            // Technical Specs & Lead Times
            $table->unsignedInteger('default_gsm')->nullable();
            $table->string('fit', 100)->nullable();
            $table->integer('lead_time_days')->default(25);
            $table->boolean('sample_available')->default(true);
            $table->decimal('sample_price', 10, 2)->default(75.00);

            // 3D Customizer Engine Data
            $table->boolean('is_customizable')->default(true);
            $table->string('three_d_model_path')->nullable();
            $table->json('garment_parts_config')->nullable()->comment('Canvas zones, masks & layer mappings');

            // Physical Stock & Dimensions (WooCommerce Parity)
            $table->boolean('manage_stock')->default(false);
            $table->integer('stock_quantity')->default(0);
            $table->string('stock_status', 50)->default('instock');
            $table->decimal('weight_kg', 8, 3)->nullable();
            $table->decimal('length_cm', 8, 2)->nullable();
            $table->decimal('width_cm', 8, 2)->nullable();
            $table->decimal('height_cm', 8, 2)->nullable();

            // SEO Metadata
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_image_path')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
