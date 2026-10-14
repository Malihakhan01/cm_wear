<?php

namespace Database\Seeders;

use App\Models\CustomizerOption;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CustomizerOptionsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure the 4 Core Customizable Garment Products Exist in Database
        $this->ensureCoreProducts();

        // 2. Seed Color Swatches
        $this->seedColorSwatches();

        // 3. Seed Decoration Techniques
        $this->seedDecorationMethods();

        // 4. Seed Text & Typography Fonts
        $this->seedFonts();

        // 5. Seed Garment Templates & BOM/POM Profiles
        $this->seedGarmentTemplates();

        // 6. Seed Trims & Hardware Finishes
        $this->seedTrims();
    }

    protected function ensureCoreProducts(): void
    {
        // 1. Hoodie
        Product::firstOrCreate(
            ['slug' => '450-gsm-heavyweight-streetwear-hoodie'],
            [
                'name' => 'Architectural 450 GSM French Terry Hoodie',
                'sku' => 'SF-CAS-001',
                'product_type' => 'customizable_apparel',
                'is_customizable' => true,
                'regular_price' => 85.00,
                'wholesale_price' => 24.50,
                'moq' => 50,
                'default_gsm' => 450,
                'lead_time_days' => 16,
                'fit' => 'Boxy Oversized Drop-Shoulder',
                'description' => '100% Combed Cotton Loopback French Terry',
                'status' => 'published',
            ]
        );

        // 2. Varsity Jacket
        Product::firstOrCreate(
            ['slug' => 'heritage-melton-wool-varsity-jacket'],
            [
                'name' => 'Heritage Melton Wool & Leather Varsity Jacket',
                'sku' => 'SF-CAS-002',
                'product_type' => 'customizable_apparel',
                'is_customizable' => true,
                'regular_price' => 195.00,
                'wholesale_price' => 68.00,
                'moq' => 30,
                'default_gsm' => 650,
                'lead_time_days' => 22,
                'fit' => 'Classic Athletic Tailored',
                'description' => '24 oz Melton Wool + Full-Grain Supple Cowhide Leather',
                'status' => 'published',
            ]
        );

        // 3. Basketball Uniform Set
        Product::firstOrCreate(
            ['slug' => 'pro-diamond-mesh-basketball-uniform'],
            [
                'name' => 'Pro League Diamond Mesh Basketball Uniform Set',
                'sku' => 'SF-BB-001',
                'product_type' => 'customizable_apparel',
                'is_customizable' => true,
                'regular_price' => 55.00,
                'wholesale_price' => 18.50,
                'moq' => 30,
                'default_gsm' => 200,
                'lead_time_days' => 14,
                'fit' => 'Pro Athletic Tournament Fit',
                'description' => '200 GSM Diamond Air-Mesh & 220 GSM Interlock Mesh',
                'status' => 'published',
            ]
        );

        // 4. Equestrian Performance Jacket & Breeches
        Product::firstOrCreate(
            ['slug' => 'italian-softshell-equestrian-performance-suit'],
            [
                'name' => 'Italian Softshell Performance Equestrian Jacket',
                'sku' => 'SF-EQ-001',
                'product_type' => 'customizable_apparel',
                'is_customizable' => true,
                'regular_price' => 220.00,
                'wholesale_price' => 72.00,
                'moq' => 30,
                'default_gsm' => 320,
                'lead_time_days' => 21,
                'fit' => 'Articulated Ergonomic Competition Fit',
                'description' => '320 GSM 4-Way Stretch Italian Softshell',
                'status' => 'published',
            ]
        );
    }

    protected function seedColorSwatches(): void
    {
        $swatches = [
            // Ivy League & Forest Palette
            ['key' => 'swatch_ivy_pine_green', 'name' => 'Ivy Pine Green', 'hex' => '#1B3B2B', 'pantone' => 'PMS 5535 C', 'garments' => ['all'], 'sort' => 1],
            ['key' => 'swatch_deep_forest_rib', 'name' => 'Deep Forest Rib', 'hex' => '#12241A', 'pantone' => 'PMS 5605 C', 'garments' => ['all'], 'sort' => 2],
            ['key' => 'swatch_hunter_varsity_green', 'name' => 'Hunter Varsity Green', 'hex' => '#15803D', 'pantone' => 'PMS 348 C', 'garments' => ['all'], 'sort' => 3],
            ['key' => 'swatch_sage_olive_fleece', 'name' => 'Sage Olive Fleece', 'hex' => '#2E4738', 'pantone' => 'PMS 7736 C', 'garments' => ['all'], 'sort' => 4],

            // Harvard Crimson & Wine
            ['key' => 'swatch_harvard_crimson', 'name' => 'Harvard Crimson Wool', 'hex' => '#8B0000', 'pantone' => 'PMS 202 C', 'garments' => ['all'], 'sort' => 5],
            ['key' => 'swatch_wine_burgundy', 'name' => 'Wine Burgundy Wool', 'hex' => '#5A121A', 'pantone' => 'PMS 7428 C', 'garments' => ['all'], 'sort' => 6],
            ['key' => 'swatch_factory_red', 'name' => 'Factory Racing Red', 'hex' => '#D61C24', 'pantone' => 'PMS 186 C', 'garments' => ['all'], 'sort' => 7],

            // Stealth Noir & Charcoals
            ['key' => 'swatch_stealth_jet_black', 'name' => 'Stealth Jet Black', 'hex' => '#0B0B0B', 'pantone' => 'Black 6 C', 'garments' => ['all'], 'sort' => 8],
            ['key' => 'swatch_stealth_noir_wool', 'name' => 'Stealth Noir Wool', 'hex' => '#141414', 'pantone' => 'Black 7 C', 'garments' => ['all'], 'sort' => 9],
            ['key' => 'swatch_washed_graphite', 'name' => 'Washed Graphite', 'hex' => '#222224', 'pantone' => 'PMS 447 C', 'garments' => ['all'], 'sort' => 10],
            ['key' => 'swatch_charcoal_slate', 'name' => 'Charcoal Slate', 'hex' => '#20201E', 'pantone' => 'Cool Gray 11 C', 'garments' => ['all'], 'sort' => 11],
            ['key' => 'swatch_heather_grey', 'name' => 'Heather Grey Felt', 'hex' => '#7E7E7E', 'pantone' => 'Cool Gray 8 C', 'garments' => ['all'], 'sort' => 12],

            // Bone & Ecru
            ['key' => 'swatch_optic_snow_white', 'name' => 'Optic Snow White', 'hex' => '#FFFFFF', 'pantone' => 'Bright White', 'garments' => ['all'], 'sort' => 13],
            ['key' => 'swatch_vintage_oat_leather', 'name' => 'Vintage Oat Leather', 'hex' => '#EAE3D2', 'pantone' => 'PMS 7527 C', 'garments' => ['all'], 'sort' => 14],
            ['key' => 'swatch_raw_ecru_bone', 'name' => 'Raw Ecru / Bone', 'hex' => '#F4E8C1', 'pantone' => 'PMS 7499 C', 'garments' => ['all'], 'sort' => 15],

            // Navy & Gold
            ['key' => 'swatch_midnight_navy', 'name' => 'Archive Midnight Navy', 'hex' => '#111B2C', 'pantone' => 'PMS 533 C', 'garments' => ['all'], 'sort' => 16],
            ['key' => 'swatch_varsity_gold', 'name' => 'Athletic Varsity Gold', 'hex' => '#FBBF24', 'pantone' => 'PMS 1235 C', 'garments' => ['all'], 'sort' => 17],
            ['key' => 'swatch_vintage_mustard', 'name' => 'Vintage Mustard', 'hex' => '#CA8A04', 'pantone' => 'PMS 110 C', 'garments' => ['all'], 'sort' => 18],
        ];

        foreach ($swatches as $s) {
            CustomizerOption::updateOrCreate(
                ['key' => $s['key']],
                [
                    'category' => 'color_swatch',
                    'name' => $s['name'],
                    'value' => [
                        'hex' => $s['hex'],
                        'pantone' => $s['pantone'],
                    ],
                    'garment_types' => $s['garments'],
                    'is_active' => true,
                    'sort_order' => $s['sort'],
                ]
            );
        }
    }

    protected function seedDecorationMethods(): void
    {
        $methods = [
            [
                'key' => 'dec_tajima_3d_foam_embroidery',
                'name' => 'Tajima 3D Foam High-Loft Embroidery',
                'value' => [
                    'tagline' => '15-Needle Structural Crests',
                    'desc' => 'High-density satin stitching embroidered over 3mm high-density EVA foam for raised dimension and razor-sharp perimeter contour.',
                    'durability' => 'Indestructible Filament (100+ Washes)',
                    'moq' => 30,
                    'surcharge_per_unit' => 4.50,
                ],
                'garment_types' => ['varsity', 'hoodie', 'equestrian'],
                'sort' => 1,
            ],
            [
                'key' => 'dec_chenille_patches',
                'name' => 'Heirloom Collegiate Chenille Patches',
                'value' => [
                    'tagline' => 'Looped Wool Yarn Pile',
                    'desc' => 'Traditional looped pile chenille embroidered onto double-layer wool felt backing for vintage varsity letters and emblems.',
                    'durability' => 'Heritage Grade',
                    'moq' => 30,
                    'surcharge_per_unit' => 6.00,
                ],
                'garment_types' => ['varsity', 'hoodie'],
                'sort' => 2,
            ],
            [
                'key' => 'dec_laser_tackle_twill',
                'name' => 'Laser-Cut Pro Tackle Twill',
                'value' => [
                    'tagline' => 'Pro League Zigzag Lock',
                    'desc' => 'Laser-cut multi-layer athletic twill fabric sewn with heavy zigzag border stitching for professional league tournament aesthetics.',
                    'durability' => 'Pro League Tested',
                    'moq' => 25,
                    'surcharge_per_unit' => 5.00,
                ],
                'garment_types' => ['basketball', 'varsity', 'hoodie'],
                'sort' => 3,
            ],
            [
                'key' => 'dec_high_density_screen_print',
                'name' => 'High-Density Plastisol & Screen Print',
                'value' => [
                    'tagline' => 'Plastisol, Water-Based & Discharge',
                    'desc' => 'Ultra-sharp screen registration with premium tactile finish, high opacity on dark garments, and maximum wash longevity.',
                    'durability' => '100+ Wash Cycles',
                    'moq' => 50,
                    'surcharge_per_unit' => 2.50,
                ],
                'garment_types' => ['hoodie', 'basketball'],
                'sort' => 4,
            ],
            [
                'key' => 'dec_digital_italian_sublimation',
                'name' => 'Digital Italian Eco Sublimation',
                'value' => [
                    'tagline' => 'Molecular Fiber Infusion',
                    'desc' => 'Vapor-infusion printing penetrating polyester fibers with zero surface hand feel, infinite gradients, and zero fading.',
                    'durability' => 'Permanent Lifetime Color',
                    'moq' => 30,
                    'surcharge_per_unit' => 3.00,
                ],
                'garment_types' => ['basketball', 'equestrian'],
                'sort' => 5,
            ],
            [
                'key' => 'dec_dtf_transfers',
                'name' => 'Direct-to-Film (DTF) Stretch Transfers',
                'value' => [
                    'tagline' => 'Ultra-Fine Vector & Photorealistic',
                    'desc' => 'Digital transfers with flexible polyurethane powder adhesive reproducing multi-color fine art gradients with stretch resistance.',
                    'durability' => '60+ Wash Cycles',
                    'moq' => 30,
                    'surcharge_per_unit' => 3.50,
                ],
                'garment_types' => ['all'],
                'sort' => 6,
            ],
            [
                'key' => 'dec_silicone_badges',
                'name' => 'Silicone & Rubberized 3D Badges',
                'value' => [
                    'tagline' => 'Tactile High-Friction Grip',
                    'desc' => 'Liquid silicone injected into precision micro-molds, producing matte dimensional rubber badges with luxury hand.',
                    'durability' => '100+ Wash Cycles',
                    'moq' => 50,
                    'surcharge_per_unit' => 5.50,
                ],
                'garment_types' => ['equestrian', 'hoodie'],
                'sort' => 7,
            ],
        ];

        foreach ($methods as $m) {
            CustomizerOption::updateOrCreate(
                ['key' => $m['key']],
                [
                    'category' => 'decoration_method',
                    'name' => $m['name'],
                    'value' => $m['value'],
                    'garment_types' => $m['garment_types'],
                    'is_active' => true,
                    'sort_order' => $m['sort'],
                ]
            );
        }
    }

    protected function seedFonts(): void
    {
        $fonts = [
            [
                'key' => 'font_columbia_athletic',
                'name' => 'Columbia Athletic Varsity',
                'value' => [
                    'family' => "'Courier New', Courier, monospace",
                    'style' => 'Heavy Slab Collegiate',
                    'category' => 'Collegiate',
                ],
                'sort' => 1,
            ],
            [
                'key' => 'font_princeton_serif',
                'name' => 'Princeton Ivy League Serif',
                'value' => [
                    'family' => "'Playfair Display', Georgia, serif",
                    'style' => 'Historic Ivy Serif',
                    'category' => 'Editorial',
                ],
                'sort' => 2,
            ],
            [
                'key' => 'font_oxford_heavy',
                'name' => 'Oxford Heavy Block',
                'value' => [
                    'family' => "Impact, 'Arial Black', sans-serif",
                    'style' => 'High-Impact Streetwear',
                    'category' => 'Streetwear',
                ],
                'sort' => 3,
            ],
            [
                'key' => 'font_georgetown_gothic',
                'name' => 'Georgetown Athletic Gothic',
                'value' => [
                    'family' => "'Arial Narrow', 'Oswald', sans-serif",
                    'style' => 'Pro League Condensed',
                    'category' => 'Athletic',
                ],
                'sort' => 4,
            ],
            [
                'key' => 'font_harvard_script',
                'name' => 'Harvard Championship Script',
                'value' => [
                    'family' => "'Brush Script MT', cursive",
                    'style' => 'Heritage Signature Script',
                    'category' => 'Script',
                ],
                'sort' => 5,
            ],
            [
                'key' => 'font_tech_pack_mono',
                'name' => 'Technical Factory Mono',
                'value' => [
                    'family' => "var(--font-geist-mono), monospace",
                    'style' => 'Architectural Specification',
                    'category' => 'Technical',
                ],
                'sort' => 6,
            ],
        ];

        foreach ($fonts as $f) {
            CustomizerOption::updateOrCreate(
                ['key' => $f['key']],
                [
                    'category' => 'font',
                    'name' => $f['name'],
                    'value' => $f['value'],
                    'garment_types' => ['all'],
                    'is_active' => true,
                    'sort_order' => $f['sort'],
                ]
            );
        }
    }

    protected function seedGarmentTemplates(): void
    {
        $templates = [
            [
                'key' => 'template_hoodie',
                'name' => 'Heavyweight Streetwear Hoodie',
                'value' => [
                    'model_type' => 'hoodie',
                    'slug' => 'custom-hoodie',
                    'default_gsm' => 450,
                    'fabric' => '450 GSM 100% Combed Cotton French Terry',
                    'zones' => [
                        ['id' => 'body', 'name' => 'Torso / Main Body', 'default_hex' => '#222224'],
                        ['id' => 'sleeves', 'name' => 'Drop-Shoulder Sleeves', 'default_hex' => '#222224'],
                        ['id' => 'hood', 'name' => 'Double-Layer Hood', 'default_hex' => '#222224'],
                        ['id' => 'pocket', 'name' => 'Kangaroo Pocket', 'default_hex' => '#222224'],
                        ['id' => 'cuffs', 'name' => 'Ribbed Cuffs', 'default_hex' => '#222224'],
                        ['id' => 'waistband', 'name' => 'Ribbed Waistband', 'default_hex' => '#222224'],
                    ],
                    'default_bom' => [
                        ['item' => 'Main Body Fabric', 'spec' => '450 GSM 100% Combed Cotton French Terry', 'consumption' => '1.45 meters'],
                        ['item' => 'Rib Knit 2x1', 'spec' => '95% Cotton / 5% Elastane 420 GSM', 'consumption' => '0.35 meters'],
                        ['item' => 'Sewing Thread', 'spec' => '100% Core-Spun Poly #40 Ticket 120', 'consumption' => '120 meters'],
                        ['item' => 'Neck Label', 'spec' => 'High-Density Damask Woven Label', 'consumption' => '1 pc'],
                        ['item' => 'Care Label', 'spec' => 'Satin Heat-Transfer / Printed', 'consumption' => '1 pc'],
                        ['item' => 'Packaging', 'spec' => '80-Micron Biodegradable Frosted Ziplock Polybag', 'consumption' => '1 pc'],
                    ],
                    'pom_grading' => [
                        'XS' => ['chest_width' => 54, 'body_length' => 68, 'shoulder_drop' => 50, 'sleeve_length' => 63],
                        'S' => ['chest_width' => 57, 'body_length' => 70, 'shoulder_drop' => 52, 'sleeve_length' => 64],
                        'M' => ['chest_width' => 60, 'body_length' => 72, 'shoulder_drop' => 54, 'sleeve_length' => 65],
                        'L' => ['chest_width' => 63, 'body_length' => 74, 'shoulder_drop' => 56, 'sleeve_length' => 66],
                        'XL' => ['chest_width' => 66, 'body_length' => 76, 'shoulder_drop' => 58, 'sleeve_length' => 67],
                        '2XL' => ['chest_width' => 69, 'body_length' => 78, 'shoulder_drop' => 60, 'sleeve_length' => 68],
                        '3XL' => ['chest_width' => 72, 'body_length' => 80, 'shoulder_drop' => 62, 'sleeve_length' => 69],
                    ],
                    'wholesale_tiers' => [
                        ['min_qty' => 50, 'max_qty' => 99, 'unit_price' => 24.50, 'savings' => 'Standard MOQ'],
                        ['min_qty' => 100, 'max_qty' => 249, 'unit_price' => 21.80, 'savings' => 'Save 11%'],
                        ['min_qty' => 250, 'max_qty' => 499, 'unit_price' => 19.20, 'savings' => 'Save 22%'],
                        ['min_qty' => 500, 'max_qty' => null, 'unit_price' => 16.50, 'savings' => 'Save 33%'],
                    ],
                ],
                'sort' => 1,
            ],
            [
                'key' => 'template_varsity',
                'name' => 'Heritage Melton Wool & Leather Varsity Jacket',
                'value' => [
                    'model_type' => 'varsity',
                    'slug' => 'custom-varsity-jacket',
                    'default_gsm' => 650,
                    'fabric' => '24 oz Melton Wool + Full-Grain Supple Cowhide Leather',
                    'zones' => [
                        ['id' => 'body', 'name' => 'Melton Wool Body', 'default_hex' => '#800020'],
                        ['id' => 'sleeves', 'name' => 'Cowhide Leather Arms', 'default_hex' => '#FFFFFF'],
                        ['id' => 'pockets', 'name' => 'Pocket Welts', 'default_hex' => '#FFFFFF'],
                        ['id' => 'collar', 'name' => 'Collar Ribbing', 'default_hex' => '#111827'],
                        ['id' => 'cuffs', 'name' => 'Cuff Ribbing', 'default_hex' => '#111827'],
                        ['id' => 'waistband', 'name' => 'Waistband Ribbing', 'default_hex' => '#111827'],
                        ['id' => 'buttons', 'name' => 'Snap Fasteners', 'default_hex' => '#E5E7EB'],
                    ],
                    'default_bom' => [
                        ['item' => 'Shell Fabric', 'spec' => '24 oz 80% Wool / 20% Polyamide Melton', 'consumption' => '1.60 meters'],
                        ['item' => 'Sleeve Leather', 'spec' => '1.2mm Drum-Dyed Supple Cowhide', 'consumption' => '18 sq ft'],
                        ['item' => 'Lining', 'spec' => 'Cupro Diamond-Quilted with 120 GSM Thermal Polyfill', 'consumption' => '1.70 meters'],
                        ['item' => 'Rib Trims', 'spec' => '2x2 Heavy Poly-Cotton Yarn-Dyed Rib', 'consumption' => '0.45 meters'],
                        ['item' => 'Snap Hardware', 'spec' => 'Antique Powder-Coated Brass Snaps #24', 'consumption' => '7 pcs'],
                    ],
                    'pom_grading' => [
                        'S' => ['chest_width' => 58, 'body_length' => 67, 'shoulder_drop' => 49, 'sleeve_length' => 65],
                        'M' => ['chest_width' => 61, 'body_length' => 69, 'shoulder_drop' => 51, 'sleeve_length' => 66],
                        'L' => ['chest_width' => 64, 'body_length' => 71, 'shoulder_drop' => 53, 'sleeve_length' => 67],
                        'XL' => ['chest_width' => 67, 'body_length' => 73, 'shoulder_drop' => 55, 'sleeve_length' => 68],
                        '2XL' => ['chest_width' => 70, 'body_length' => 75, 'shoulder_drop' => 57, 'sleeve_length' => 69],
                    ],
                    'wholesale_tiers' => [
                        ['min_qty' => 50, 'max_qty' => 99, 'unit_price' => 68.00, 'savings' => 'Standard MOQ'],
                        ['min_qty' => 100, 'max_qty' => 249, 'unit_price' => 62.50, 'savings' => 'Save 8%'],
                        ['min_qty' => 250, 'max_qty' => 499, 'unit_price' => 56.00, 'savings' => 'Save 18%'],
                        ['min_qty' => 500, 'max_qty' => null, 'unit_price' => 49.50, 'savings' => 'Save 27%'],
                    ],
                ],
                'sort' => 2,
            ],
            [
                'key' => 'template_basketball',
                'name' => 'Pro League Diamond Mesh Basketball Uniform Set',
                'value' => [
                    'model_type' => 'basketball',
                    'slug' => 'custom-basketball-jersey',
                    'default_gsm' => 200,
                    'fabric' => '200 GSM Diamond Air-Mesh & 220 GSM Interlock Mesh',
                    'zones' => [
                        ['id' => 'jersey', 'name' => 'Game Jersey Torso', 'default_hex' => '#1E3A2F'],
                        ['id' => 'ribs', 'name' => 'Neck & Armhole Ribs', 'default_hex' => '#FFFFFF'],
                        ['id' => 'shorts', 'name' => 'Game Shorts', 'default_hex' => '#1E3A2F'],
                    ],
                    'default_bom' => [
                        ['item' => 'Jersey Mesh', 'spec' => '200 GSM Diamond Air-Mesh 100% Poly', 'consumption' => '0.90 meters'],
                        ['item' => 'Shorts Fabric', 'spec' => '220 GSM Heavy-Duty Poly Interlock', 'consumption' => '1.10 meters'],
                        ['item' => 'Elastic Waist', 'spec' => '2" Multi-Needle Encased Heavy Elastic', 'consumption' => '0.85 meters'],
                        ['item' => 'Drawcord', 'spec' => 'Heavy Braided Polyester Flat Cord', 'consumption' => '1.40 meters'],
                    ],
                    'pom_grading' => [
                        'S' => ['jersey_chest' => 52, 'jersey_length' => 74, 'shorts_waist' => 38, 'shorts_inseam' => 21],
                        'M' => ['jersey_chest' => 55, 'jersey_length' => 76, 'shorts_waist' => 41, 'shorts_inseam' => 22],
                        'L' => ['jersey_chest' => 58, 'jersey_length' => 78, 'shorts_waist' => 44, 'shorts_inseam' => 23],
                        'XL' => ['jersey_chest' => 61, 'jersey_length' => 80, 'shorts_waist' => 47, 'shorts_inseam' => 24],
                    ],
                    'wholesale_tiers' => [
                        ['min_qty' => 50, 'max_qty' => 99, 'unit_price' => 28.00, 'savings' => 'Standard MOQ'],
                        ['min_qty' => 100, 'max_qty' => 249, 'unit_price' => 24.50, 'savings' => 'Save 12%'],
                        ['min_qty' => 250, 'max_qty' => 499, 'unit_price' => 21.00, 'savings' => 'Save 25%'],
                        ['min_qty' => 500, 'max_qty' => null, 'unit_price' => 18.00, 'savings' => 'Save 36%'],
                    ],
                ],
                'sort' => 3,
            ],
            [
                'key' => 'template_equestrian',
                'name' => 'Italian Softshell Performance Equestrian Jacket',
                'value' => [
                    'model_type' => 'equestrian',
                    'slug' => 'custom-riding-jacket',
                    'default_gsm' => 320,
                    'fabric' => '320 GSM 4-Way Stretch Italian Softshell',
                    'zones' => [
                        ['id' => 'body', 'name' => 'Main Torso Shell', 'default_hex' => '#111B2C'],
                        ['id' => 'sleeves', 'name' => 'Articulated Sleeves', 'default_hex' => '#0A0A0A'],
                        ['id' => 'ribs', 'name' => 'Collar & Placket Ribs', 'default_hex' => '#D61C24'],
                        ['id' => 'leggings', 'name' => 'Hex-Grip Breeches', 'default_hex' => '#20201E'],
                    ],
                    'default_bom' => [
                        ['item' => 'Jacket Shell', 'spec' => '320 GSM 4-Way Stretch Italian Softshell', 'consumption' => '1.50 meters'],
                        ['item' => 'Breeches Fabric', 'spec' => '82% Nylon / 18% Spandex Hex Compression', 'consumption' => '1.20 meters'],
                        ['item' => 'Silicone Grip', 'spec' => 'Hex-Grip Full-Seat Micro-Injected Silicone', 'consumption' => '1 set'],
                        ['item' => 'Crest Buttons', 'spec' => 'Laser-Engraved Antique Silver Crest Fasteners', 'consumption' => '5 pcs'],
                    ],
                    'pom_grading' => [
                        'XS' => ['chest' => 46, 'waist' => 40, 'back_length' => 64, 'sleeve' => 61],
                        'S' => ['chest' => 49, 'waist' => 43, 'back_length' => 66, 'sleeve' => 62],
                        'M' => ['chest' => 52, 'waist' => 46, 'back_length' => 68, 'sleeve' => 63],
                        'L' => ['chest' => 55, 'waist' => 49, 'back_length' => 70, 'sleeve' => 64],
                    ],
                    'wholesale_tiers' => [
                        ['min_qty' => 50, 'max_qty' => 99, 'unit_price' => 58.00, 'savings' => 'Standard MOQ'],
                        ['min_qty' => 100, 'max_qty' => 249, 'unit_price' => 52.00, 'savings' => 'Save 10%'],
                        ['min_qty' => 250, 'max_qty' => 499, 'unit_price' => 46.00, 'savings' => 'Save 20%'],
                        ['min_qty' => 500, 'max_qty' => null, 'unit_price' => 40.00, 'savings' => 'Save 31%'],
                    ],
                ],
                'sort' => 4,
            ],
        ];

        foreach ($templates as $t) {
            CustomizerOption::updateOrCreate(
                ['key' => $t['key']],
                [
                    'category' => 'garment_template',
                    'name' => $t['name'],
                    'value' => $t['value'],
                    'garment_types' => [$t['value']['model_type']],
                    'is_active' => true,
                    'sort_order' => $t['sort'],
                ]
            );
        }
    }

    protected function seedTrims(): void
    {
        $trims = [
            ['key' => 'trim_snap_silver', 'name' => 'Polished Nickel / Silver Snaps', 'value' => ['hex' => '#E4E4E7', 'material' => 'Nickel Plated Brass'], 'sort' => 1],
            ['key' => 'trim_snap_gold', 'name' => 'Varsity Heavy Brass 18K Gold', 'value' => ['hex' => '#CA8A04', 'material' => 'PVD Electroplated Gold'], 'sort' => 2],
            ['key' => 'trim_snap_matte_noir', 'name' => 'Matte Noir Powder-Coated Snaps', 'value' => ['hex' => '#141414', 'material' => 'Matte Powder-Coated Metal'], 'sort' => 3],
            ['key' => 'trim_lining_satin_black', 'name' => 'Silk-Satin Thermal Noir Lining', 'value' => ['hex' => '#0A0A0A', 'material' => 'Cupro Silk Satin'], 'sort' => 4],
            ['key' => 'trim_lining_quilted_diamond', 'name' => 'Insulated Diamond-Quilted Bemberg', 'value' => ['hex' => '#1C1C1E', 'material' => '120 GSM Thermal Polyfill + Bemberg'], 'sort' => 5],
        ];

        foreach ($trims as $tr) {
            CustomizerOption::updateOrCreate(
                ['key' => $tr['key']],
                [
                    'category' => 'trim',
                    'name' => $tr['name'],
                    'value' => $tr['value'],
                    'garment_types' => ['all'],
                    'is_active' => true,
                    'sort_order' => $tr['sort'],
                ]
            );
        }
    }
}
