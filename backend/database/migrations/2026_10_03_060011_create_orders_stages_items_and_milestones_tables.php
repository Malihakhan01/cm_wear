<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_stages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->string('color_badge', 20)->default('#3b82f6');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('customer_id')->constrained('customers')->restrictOnDelete();
            $table->foreignId('current_stage_id')->nullable()->constrained('production_stages')->nullOnDelete();
            $table->string('order_type', 50)->default('wholesale_bulk'); // wholesale_bulk, rapid_sample, retail_single
            $table->string('status', 50)->default('pending');             // pending, confirmed, in_production, completed, cancelled
            
            // Financial Totals
            $table->unsignedInteger('total_quantity');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('surcharges', 10, 2)->default(0.00);
            $table->decimal('shipping_cost', 10, 2)->default(0.00);
            $table->decimal('total_amount', 12, 2);
            $table->string('currency', 10)->default('USD');
            $table->string('incoterms', 20)->default('DDP');

            // Snapshot data
            $table->json('shipping_address_snapshot');
            $table->string('tracking_number', 100)->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('customizer_design_id')->nullable()->constrained('customizer_designs')->nullOnDelete();
            $table->foreignId('tech_pack_id')->nullable()->constrained('tech_packs')->nullOnDelete();

            $table->string('sku', 100);
            $table->string('product_name');
            $table->decimal('unit_price', 10, 2);
            $table->unsignedInteger('quantity');
            $table->json('size_breakdown')->nullable(); // e.g. {"S": 20, "M": 50, "L": 50}
            $table->decimal('total_price', 12, 2);
            $table->timestamps();
        });

        Schema::create('production_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('stage_id')->constrained('production_stages')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('photos')->nullable()->comment('Factory floor photo paths');
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_milestones');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('production_stages');
    }
};
