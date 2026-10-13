<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customizer_designs', function (Blueprint $table) {
            $table->longText('preview_front')->nullable()->change();
            $table->longText('preview_back')->nullable()->change();
            if (!Schema::hasColumn('customizer_designs', 'decoration_method')) {
                $table->string('decoration_method', 100)->nullable()->after('monogram_state');
            }
            if (!Schema::hasColumn('customizer_designs', 'wash_type')) {
                $table->string('wash_type', 100)->nullable()->after('decoration_method');
            }
            if (!Schema::hasColumn('customizer_designs', 'fabric_spec')) {
                $table->string('fabric_spec')->nullable()->after('wash_type');
            }
            if (!Schema::hasColumn('customizer_designs', 'target_gsm')) {
                $table->unsignedInteger('target_gsm')->nullable()->after('fabric_spec');
            }
            if (!Schema::hasColumn('customizer_designs', 'size_breakdown')) {
                $table->json('size_breakdown')->nullable()->after('target_gsm');
            }
            if (!Schema::hasColumn('customizer_designs', 'total_units')) {
                $table->unsignedInteger('total_units')->nullable()->after('size_breakdown');
            }
            if (!Schema::hasColumn('customizer_designs', 'trims_config')) {
                $table->json('trims_config')->nullable()->after('total_units');
            }
        });

        Schema::table('tech_packs', function (Blueprint $table) {
            if (!Schema::hasColumn('tech_packs', 'preview_front')) {
                $table->longText('preview_front')->nullable()->after('style_name');
            }
            if (!Schema::hasColumn('tech_packs', 'preview_back')) {
                $table->longText('preview_back')->nullable()->after('preview_front');
            }
            if (!Schema::hasColumn('tech_packs', 'parts_colors')) {
                $table->json('parts_colors')->nullable()->after('preview_back');
            }
            if (!Schema::hasColumn('tech_packs', 'artwork_layers')) {
                $table->json('artwork_layers')->nullable()->after('parts_colors');
            }
            if (!Schema::hasColumn('tech_packs', 'monogram_state')) {
                $table->json('monogram_state')->nullable()->after('artwork_layers');
            }
            if (!Schema::hasColumn('tech_packs', 'decoration_method')) {
                $table->string('decoration_method', 100)->nullable()->after('monogram_state');
            }
            if (!Schema::hasColumn('tech_packs', 'wash_type')) {
                $table->string('wash_type', 100)->nullable()->after('decoration_method');
            }
            if (!Schema::hasColumn('tech_packs', 'size_breakdown')) {
                $table->json('size_breakdown')->nullable()->after('wash_type');
            }
            if (!Schema::hasColumn('tech_packs', 'total_units')) {
                $table->unsignedInteger('total_units')->nullable()->after('size_breakdown');
            }
            if (!Schema::hasColumn('tech_packs', 'trims_config')) {
                $table->json('trims_config')->nullable()->after('total_units');
            }
        });
    }

    public function down(): void
    {
        Schema::table('customizer_designs', function (Blueprint $table) {
            $table->dropColumn([
                'decoration_method',
                'wash_type',
                'fabric_spec',
                'target_gsm',
                'size_breakdown',
                'total_units',
                'trims_config',
            ]);
        });

        Schema::table('tech_packs', function (Blueprint $table) {
            $table->dropColumn([
                'preview_front',
                'preview_back',
                'parts_colors',
                'artwork_layers',
                'monogram_state',
                'decoration_method',
                'wash_type',
                'size_breakdown',
                'total_units',
                'trims_config',
            ]);
        });
    }
};
