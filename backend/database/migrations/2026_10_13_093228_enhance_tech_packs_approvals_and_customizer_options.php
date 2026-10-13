<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Customizer Configuration Options Table
        if (!Schema::hasTable('customizer_options')) {
            Schema::create('customizer_options', function (Blueprint $table) {
                $table->id();
                $table->string('category', 60)->index(); // color_swatch, decoration_method, font, garment_template, size_chart, trim, artwork_preset
                $table->string('key', 100)->index();
                $table->string('name', 255);
                $table->json('value');
                $table->json('garment_types')->nullable(); // ["hoodie", "varsity", "equestrian", "basketball"]
                $table->boolean('is_active')->default(true)->index();
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        // 2. Enhance Tech Packs Table with Approvals, Versioning & Fingerprint
        Schema::table('tech_packs', function (Blueprint $table) {
            if (!Schema::hasColumn('tech_packs', 'status')) {
                $table->string('status', 40)->default('submitted')->index()->after('style_name');
            }
            if (!Schema::hasColumn('tech_packs', 'version')) {
                $table->string('version', 20)->default('1.0')->after('status');
            }
            if (!Schema::hasColumn('tech_packs', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->after('version');
            }
            if (!Schema::hasColumn('tech_packs', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            }
            if (!Schema::hasColumn('tech_packs', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('approved_at');
            }
            if (!Schema::hasColumn('tech_packs', 'revision_history')) {
                $table->json('revision_history')->nullable()->after('rejection_reason');
            }
            if (!Schema::hasColumn('tech_packs', 'design_fingerprint')) {
                $table->string('design_fingerprint', 64)->nullable()->index()->after('code');
            }
        });

        // 3. Enhance Customizer Designs Table with Status, Version & Fingerprint
        Schema::table('customizer_designs', function (Blueprint $table) {
            if (!Schema::hasColumn('customizer_designs', 'status')) {
                $table->string('status', 40)->default('active')->index()->after('design_name');
            }
            if (!Schema::hasColumn('customizer_designs', 'version')) {
                $table->string('version', 20)->default('1.0')->after('status');
            }
            if (!Schema::hasColumn('customizer_designs', 'design_fingerprint')) {
                $table->string('design_fingerprint', 64)->nullable()->index()->after('design_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customizer_options');

        Schema::table('tech_packs', function (Blueprint $table) {
            if (Schema::hasColumn('tech_packs', 'approved_by')) {
                $table->dropForeign(['approved_by']);
            }
            $table->dropColumn([
                'status',
                'version',
                'approved_by',
                'approved_at',
                'rejection_reason',
                'revision_history',
                'design_fingerprint',
            ]);
        });

        Schema::table('customizer_designs', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'version',
                'design_fingerprint',
            ]);
        });
    }
};
