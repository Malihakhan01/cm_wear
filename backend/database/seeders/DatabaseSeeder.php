<?php

namespace Database\Seeders;

use App\Models\ProductionStage;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles & Permissions Setup
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view_dashboard',
            'manage_products',
            'import_woocommerce_csv',
            'manage_categories',
            'manage_customers',
            'manage_orders',
            'update_production_milestones',
            'manage_tech_packs',
            'manage_settings',
            'manage_users',
        ];

        foreach ($permissions as $perm) {
            Permission::findOrCreate($perm, 'web');
        }

        $superAdminRole = Role::findOrCreate('super_admin', 'web');
        $superAdminRole->givePermissionTo(Permission::all());

        $factoryManagerRole = Role::findOrCreate('factory_manager', 'web');
        $factoryManagerRole->givePermissionTo([
            'view_dashboard',
            'manage_products',
            'manage_orders',
            'update_production_milestones',
            'manage_tech_packs',
        ]);

        $qcInspectorRole = Role::findOrCreate('qc_inspector', 'web');
        $qcInspectorRole->givePermissionTo([
            'view_dashboard',
            'manage_orders',
            'update_production_milestones',
            'manage_tech_packs',
        ]);

        // 2. Default Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $admin->assignRole('super_admin');

        // 3. Default Production Stages
        $stages = [
            ['name' => 'CAD Pattern & Precision Cutting', 'slug' => 'cad_cutting', 'color_badge' => '#3b82f6', 'sort_order' => 1],
            ['name' => 'Assembly & Stitching', 'slug' => 'assembly_sewing', 'color_badge' => '#0ea5e9', 'sort_order' => 2],
            ['name' => 'Garment Washing & Finishing', 'slug' => 'garment_washing', 'color_badge' => '#14b8a6', 'sort_order' => 3],
            ['name' => 'AQL 2.5 Quality Inspection', 'slug' => 'qc_inspection', 'color_badge' => '#f59e0b', 'sort_order' => 4],
            ['name' => 'Packing & Barcoding', 'slug' => 'packing', 'color_badge' => '#10b981', 'sort_order' => 5],
            ['name' => 'Customs Freight & Dispatched', 'slug' => 'dispatched', 'color_badge' => '#22c55e', 'sort_order' => 6],
        ];

        foreach ($stages as $stage) {
            ProductionStage::updateOrCreate(['slug' => $stage['slug']], $stage);
        }

        // 4. Default Whitelabel Settings
        $defaultSettings = [
            ['key' => 'site_name', 'value' => 'CM SPORTS WEAR', 'group' => 'general', 'type' => 'string'],
            ['key' => 'site_tagline', 'value' => 'Premium Custom Sportswear & Performance Apparel Manufacturing', 'group' => 'general', 'type' => 'string'],
            ['key' => 'contact_email', 'value' => 'info@cmsportswear.pk', 'group' => 'general', 'type' => 'string'],
            ['key' => 'currency_code', 'value' => 'USD', 'group' => 'pricing', 'type' => 'string'],
            ['key' => 'currency_symbol', 'value' => '$', 'group' => 'pricing', 'type' => 'string'],
            ['key' => 'default_moq', 'value' => '50', 'group' => 'pricing', 'type' => 'number'],
            ['key' => 'default_sample_price', 'value' => '75.00', 'group' => 'pricing', 'type' => 'number'],
            ['key' => 'default_lead_time_days', 'value' => '25', 'group' => 'pricing', 'type' => 'number'],
            ['key' => 'customizer_enabled', 'value' => '1', 'group' => 'customizer', 'type' => 'boolean'],
        ];

        foreach ($defaultSettings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }

        // 5. Seed Sample Blog Categories & Posts
        $cat1 = \App\Models\BlogCategory::updateOrCreate(['slug' => 'manufacturing-insights'], [
            'name' => 'Manufacturing Insights',
            'description' => 'Behind-the-scenes engineering of streetwear fabrics, loopback fleece, and dye methods.',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $cat2 = \App\Models\BlogCategory::updateOrCreate(['slug' => 'customizer-guides'], [
            'name' => 'Customizer & Design Studio',
            'description' => 'How-to guides on leveraging mockups and precision embroidery placement.',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        \App\Models\BlogPost::updateOrCreate(['slug' => 'fleece-hoodie-gsm-guide'], [
            'title' => 'The Complete Guide to Fleece GSM: 380 GSM vs 450 GSM vs 500 GSM',
            'slug' => 'fleece-hoodie-gsm-guide',
            'blog_category_id' => $cat1->id,
            'author_id' => $admin->id,
            'summary' => 'Understanding fabric density, diagonal loopback vs brushed interior, and pre-shrunk cotton standards for premium streetwear.',
            'content' => "## Understanding GSM in Streetwear Manufacturing\n\nFabric weight is measured in **Grams per Square Meter (GSM)**. For high-end luxury streetwear, 450+ GSM French Terry and heavy fleece ensure structural drape and durability after multiple wash cycles.\n\n### 1. 380 GSM (Mid-to-Heavyweight)\nIdeal for standard hoodies and transitional seasons.\n\n### 2. 450 GSM - 500 GSM (Ultra-Heavyweight Boxy Fits)\nFavored by luxury streetwear brands for rigid hoods, oversized drop-shoulders, and premium drape.",
            'cover_image' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
            'status' => 'published',
            'published_at' => now()->subDays(2),
            'views_count' => 142,
            'is_featured' => true,
        ]);

        // 6. Seed Sample Testimonials
        $testimonials = [
            [
                'client_name' => 'Alexander Hayes',
                'client_role' => 'Founder & Creative Director',
                'company' => 'Aether Studios UK',
                'country' => 'United Kingdom',
                'country_flag' => '🇬🇧',
                'rating' => 5,
                'quote' => 'The fabric weight and vintage acid wash consistency exceeded our expectations. The customizer shortened our sampling turnaround by 2 weeks.',
                'sort_order' => 1,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'client_name' => 'Sofia Rossi',
                'client_role' => 'Production Lead',
                'company' => 'Milano Heavy Apparel',
                'country' => 'Italy',
                'country_flag' => '🇮🇹',
                'rating' => 5,
                'quote' => 'Flawless rib-knit stitching and direct-to-garment print density. Live factory milestone tracking gave our team complete peace of mind.',
                'sort_order' => 2,
                'is_featured' => true,
                'is_active' => true,
            ]
        ];

        foreach ($testimonials as $t) {
            \App\Models\Testimonial::updateOrCreate(['client_name' => $t['client_name']], $t);
        }

        // 7. Seed Sample FAQs
        $faqs = [
            [
                'topic' => 'MOQ & Pricing',
                'question' => 'What is the standard Minimum Order Quantity (MOQ) for custom blanks?',
                'answer' => 'Our factory MOQ starts at 50 units per colorway for custom garments with custom dyeing and size breakdowns (S-XXL).',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'topic' => 'Sampling & Lead Times',
                'question' => 'How long does physical sample development take?',
                'answer' => 'Rapid prototyping samples typically take 5-7 business days for production and 3-4 days for expedited DHL Express air delivery.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'topic' => 'Customizer & Factory Tools',
                'question' => 'Can we export factory-ready vector tech packs from the customizer?',
                'answer' => 'Yes! The customizer automatically compiles Pantone references, print coordinate dimensions, stitch specs, and size grading splits into a factory PDF tech pack.',
                'sort_order' => 3,
                'is_active' => true,
            ]
        ];

        foreach ($faqs as $f) {
            \App\Models\Faq::updateOrCreate(['question' => $f['question']], $f);
        }

        // 8. Seed Sample RFQ & Contact Message
        \App\Models\Rfq::updateOrCreate(['rfq_number' => 'RFQ-2026-00812'], [
            'full_name' => 'Liam Sterling',
            'email' => 'liam@sterlingapparel.co',
            'company' => 'Sterling Athletic & Street',
            'country' => 'United States',
            'phone' => '+1 (555) 234-8891',
            'inquiry_type' => 'bulk_manufacturing',
            'quantity' => 250,
            'target_price' => 34.00,
            'target_lead_days' => 25,
            'incoterm' => 'DDP',
            'destination_port' => 'Los Angeles (LAX)',
            'message' => 'Looking to produce 250 units of 460 GSM Heavyweight Zip Hoodies with puff screen printing on the chest and custom woven neck tags.',
            'items' => [
                ['product_name' => 'Heavyweight Vintage Zip Hoodie', 'color' => 'Washed Onyx', 'material' => '460 GSM Fleece', 'quantity' => 150],
                ['product_name' => 'Heavyweight Boxy Tee', 'color' => 'Vintage White', 'material' => '280 GSM Single Jersey', 'quantity' => 100],
            ],
            'status' => 'new',
            'assigned_user_id' => $admin->id,
        ]);

        \App\Models\ContactMessage::updateOrCreate(['email' => 'buyer@nordicstreet.se'], [
            'name' => 'Elin Lindqvist',
            'email' => 'buyer@nordicstreet.se',
            'phone' => '+46 8 123 456',
            'company' => 'Nordic Streetwear AB',
            'subject' => 'Wholesale Catalog & Color Swatches Request',
            'message' => 'Hi team, we would like to request fabric swatch booklets for 400-500 GSM loopback cotton fleece and current wholesale lead times for Q4.',
            'status' => 'unread',
        ]);

        // 9. CM Sports Wear Categories & Product Taxonomy
        $this->call(CareMasterCategoriesAndProductsSeeder::class);
    }
}
