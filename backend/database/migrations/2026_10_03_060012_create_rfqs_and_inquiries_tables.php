<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. RFQs / Custom Inquiries
        Schema::create('rfqs', function (Blueprint $table) {
            $table->id();
            $table->string('rfq_number')->unique(); // RFQ-2026-XXXX
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('company')->nullable();
            $table->string('country')->nullable();
            $table->string('phone')->nullable();
            $table->string('inquiry_type', 50)->default('bulk_manufacturing'); // sample, bulk_manufacturing, custom_design, tech_pack
            $table->integer('quantity')->nullable();
            $table->decimal('target_price', 10, 2)->nullable();
            $table->integer('target_lead_days')->nullable();
            $table->string('incoterm', 20)->nullable(); // FOB, CIF, DDP, EXW
            $table->string('destination_port')->nullable();
            $table->text('message')->nullable();
            $table->json('items')->nullable(); // Multi-item breakdown with sizes, colors, fabrics
            $table->json('requirements')->nullable(); // Specs, GSM, branding techniques
            $table->json('files')->nullable(); // Attached mockups / techpacks
            $table->json('quote')->nullable(); // Quote breakdown {unit_price, tooling_cost, shipping, lead_time_days, valid_until}
            $table->string('status', 30)->default('new'); // new, in_review, quoted, negotiating, won, lost, archived
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 2. RFQ Internal Notes & Timeline
        Schema::create('rfq_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rfq_id')->constrained('rfqs')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('note');
            $table->boolean('is_internal')->default(true);
            $table->timestamps();
        });

        // 3. General Contact Form Messages
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->string('status', 20)->default('unread'); // unread, read, replied, archived
            $table->timestamps();
        });

        // 4. Newsletter Subscriptions
        Schema::create('newsletter_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('source', 50)->default('website_footer');
            $table->boolean('is_subscribed')->default(true);
            $table->timestamp('subscribed_at')->useCurrent();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscriptions');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('rfq_notes');
        Schema::dropIfExists('rfqs');
    }
};
