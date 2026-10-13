<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\Faq;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentModulesComprehensiveSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first() ?? User::create([
            'name' => 'Super Administrator',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'status' => 'active',
        ]);

        // ==========================================
        // 1. FAQS SEEDING
        // ==========================================
        $faqs = [
            [
                'topic' => 'MOQ & Bulk Pricing',
                'question' => 'What is your factory Minimum Order Quantity (MOQ) for custom apparel manufacturing?',
                'answer' => 'Our standard wholesale production MOQ starts at 50 units per style and colorway for casual blanks, hoodies, t-shirts, and team kits. For technical performance garments (such as 3-layer waterproof ski jackets and Cordura karting suits), we accommodate lower initial runs of 25–30 units. You can split sizes (XS to 3XL) within this batch.',
                'sort_order' => 1,
            ],
            [
                'topic' => 'MOQ & Bulk Pricing',
                'question' => 'How does volume-tiered pricing work for bulk production runs?',
                'answer' => 'Our pricing structure is graduated based on factory production efficiency: Tier 1 (50–199 units), Tier 2 (200–499 units), Tier 3 (500–1,999 units), and Tier 4 (2,000+ units). Large volume runs achieve up to 35% cost reductions due to automated CNC cutting marker optimization and dedicated dye bath batching.',
                'sort_order' => 2,
            ],
            [
                'topic' => 'MOQ & Bulk Pricing',
                'question' => 'Do you require upfront payment for commercial orders?',
                'answer' => 'Standard export payment terms for bulk orders are 50% deposit upon final tech pack sign-off and lab-dip swatch approval, with the remaining 50% balance payable upon completion of AQL 2.5 quality control inspection and prior to international cargo dispatch.',
                'sort_order' => 3,
            ],
            [
                'topic' => 'Sampling & Prototypes',
                'question' => 'Can I order physical pre-production samples before committing to full bulk production?',
                'answer' => 'Yes, physical pre-production sampling is standard protocol. We develop a complete prototype according to your exact tech pack specifications within 5–7 business days, followed by priority DHL Express delivery (3–4 days worldwide) for tactile review and fit approval.',
                'sort_order' => 4,
            ],
            [
                'topic' => 'Sampling & Prototypes',
                'question' => 'What is the cost and turnaround time for a custom sample?',
                'answer' => 'Sample fees typically range from $40 to $80 depending on garment complexity, fabric GSM, and custom hardware. Importantly, sample fees are 100% credited back toward your commercial bulk invoice once the main production order is placed.',
                'sort_order' => 5,
            ],
            [
                'topic' => 'Sampling & Prototypes',
                'question' => 'How are fit corrections and sample revisions handled?',
                'answer' => 'Every sample includes a complimentary technical review with our master pattern cutters. If adjustments are required for sleeve pitch, body drape, or collar curvature, revised CAD pattern grading is completed within 48 hours.',
                'sort_order' => 6,
            ],
            [
                'topic' => 'Technical Materials & GSM',
                'question' => 'What fabric weights (GSM) and blends do you knit for streetwear blanks?',
                'answer' => 'We knit custom cotton and blended textiles ranging from 220 GSM single jersey up to 500 GSM diagonal loopback French Terry and 460 GSM brushed fleece. All premium fleece is combed, ring-spun, and pre-shrunk with anti-pilling finishing.',
                'sort_order' => 7,
            ],
            [
                'topic' => 'Technical Materials & GSM',
                'question' => 'Do you manufacture certified technical performance fabrics for activewear and cycling?',
                'answer' => 'Yes. We source and engineer 4-way stretch warp-knit Lycra, Italian Carvico-style aerodynamic speed meshes, Teflon-coated bonded softshell, and high-density chamois foam pads with antibacterial gel inserts for competitive cycling and equestrian apparel.',
                'sort_order' => 8,
            ],
            [
                'topic' => 'Technical Materials & GSM',
                'question' => 'Can you match custom Pantone (PMS) colors for fabric dyeing?',
                'answer' => 'Yes. We operate an automated in-house dye lab. Simply provide your Pantone TCX or TPX code, and we will formulate laboratory lab-dip swatches (under standard D65 light conditions) for approval within 72 hours.',
                'sort_order' => 9,
            ],
            [
                'topic' => 'Customizer & 3D Tools',
                'question' => 'How does the online 3D Customizer export into factory production files?',
                'answer' => 'Our customizer compiles your 3D canvas selections, Pantone hex codes, placement coordinates, custom badges, and size grade breakdowns directly into an industry-standard PDF tech pack and vector cutting file for our production floor.',
                'sort_order' => 10,
            ],
            [
                'topic' => 'Customizer & 3D Tools',
                'question' => 'Can I upload my own vector logos and branding artwork to the customizer?',
                'answer' => 'Yes. You can upload SVG, high-resolution PNG, and vector AI files. The customizer renders real-time tactile previews including embroidery stitches, chenille patches, rubber silicone prints, and screen print effects.',
                'sort_order' => 11,
            ],
            [
                'topic' => 'Private Label & Branding',
                'question' => 'What custom private label packaging and trims do you provide?',
                'answer' => 'We offer comprehensive end-to-end private label packages: custom woven damask neck labels, soft satin care tags, FSC-certified cardboard hangtags, metal eyelets and branded drawstrings, barcoded SKU stickers, and frosted biodegradable ziplock polybags.',
                'sort_order' => 12,
            ],
            [
                'topic' => 'Worldwide Shipping & Duties',
                'question' => 'Which international Incoterms and shipping methods do you support?',
                'answer' => 'We support EXW, FOB (Karachi Port / Sialkot Air Cargo), CIF, and turnkey DDP (Delivered Duty Paid) via air freight (DHL, FedEx, UPS) and commercial sea freight containers. For DDP orders, all customs clearance, port tariffs, and local courier delivery to your doorstep are handled seamlessly.',
                'sort_order' => 13,
            ],
            [
                'topic' => 'Worldwide Shipping & Duties',
                'question' => 'How does real-time factory order tracking work during manufacturing?',
                'answer' => 'Upon confirmation, every order receives a tracking reference (e.g., TI-563657). You can track live milestones 24/7 on our /track-order portal—from yarn knitting and pattern cutting to Tajima embroidery, AQL 2.5 needle inspection, and final flight manifest dispatch.',
                'sort_order' => 14,
            ],
        ];

        foreach ($faqs as $faqData) {
            Faq::updateOrCreate(
                ['question' => $faqData['question']],
                array_merge($faqData, ['is_active' => true])
            );
        }

        // ==========================================
        // 2. BLOG CATEGORIES SEEDING
        // ==========================================
        $categoriesData = [
            [
                'name' => 'Fabric Sourcing & GSM',
                'slug' => 'fabric-sourcing-gsm',
                'description' => 'Comprehensive breakdowns on textile weights, French Terry loopback structures, single jerseys, and yarn spinning.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Technical Manufacturing',
                'slug' => 'technical-manufacturing',
                'description' => 'Factory floor techniques, ultrasonic bonding, AQL 2.5 quality control standards, and precision needlework.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Private Label Strategy',
                'slug' => 'private-label-strategy',
                'description' => 'How high-growth D2C brands navigate tech packs, damask neck tags, custom hardware, and retail packaging.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Teamwear & Sports Tech',
                'slug' => 'teamwear-sports-tech',
                'description' => 'Engineering high-performance garments for cycling peloton clubs, equestrian federations, and pro ice hockey.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Logistics & Incoterms',
                'slug' => 'logistics-incoterms',
                'description' => 'Global freight optimization, comparing FOB vs DDP, customs documentation, and commercial container transit.',
                'sort_order' => 5,
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $cData) {
            $categories[$cData['slug']] = BlogCategory::updateOrCreate(
                ['slug' => $cData['slug']],
                array_merge($cData, ['is_active' => true])
            );
        }

        // ==========================================
        // 3. BLOG POSTS SEEDING
        // ==========================================
        $articles = [
            [
                'title' => 'The Complete Guide to Fleece GSM: 380 GSM vs 450 GSM vs 500 GSM',
                'slug' => 'fleece-hoodie-gsm-guide',
                'category_slug' => 'fabric-sourcing-gsm',
                'summary' => 'Understanding fabric density, diagonal loopback vs brushed interior, and pre-shrunk cotton standards for premium heavyweight streetwear hoodies.',
                'content' => "## Understanding GSM in Streetwear Manufacturing\n\nFabric weight is universally measured in **Grams per Square Meter (GSM)**. For high-end luxury streetwear, 450+ GSM French Terry and heavy fleece ensure structural drape, rigid hood posture, and long-term durability across repeated wash cycles.\n\n### 1. 380 GSM (Mid-to-Heavyweight)\nIdeal for standard year-round hoodies, transitional athletic wear, and layering pieces. Retains flexibility with moderate interior brushing.\n\n### 2. 450 GSM (Luxury Industry Benchmark)\nThe gold standard for contemporary streetwear. Features a tight 3-end diagonal loopback reverse, zero polyester blending, and a substantial 1.1kg garment weight per piece.\n\n### 3. 500 GSM (Ultra-Heavyweight Boxy Fits)\nFavored by bespoke luxury labels. The fabric is knitted on specialized high-gauge circular knitting machines, producing a virtually indestructible drape with pre-shrunk wash stability under 2% variance.\n\n### Ribbing & Finishing Considerations\nFor heavy fleece, standard 2x1 cotton-spandex ribbing (420 GSM) is required at cuffs and waistband to prevent pocket sagging and cuff distortion.",
                'cover_image' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'published_at' => now()->subDays(4),
                'views_count' => 312,
            ],
            [
                'title' => 'Custom Cycling Kit Engineering: Aerodynamic Speed Meshes & Chamois Density',
                'slug' => 'custom-cycling-kit-engineering',
                'category_slug' => 'teamwear-sports-tech',
                'summary' => 'How we construct pro-tour race jerseys combining dimpled airflow sleeve mesh, Italian warp-knit lycra bibs, and multi-density 8-hour gel chamois.',
                'content' => "## The Anatomy of a Pro-Peloton Cycling Jersey\n\nAerodynamics and thermal regulation dominate cycling apparel engineering. When racing across 200+ km stages, seam placement and micro-textured textiles directly impact power efficiency.\n\n### 1. Speed Mesh Sleeve Panels\nBy integrating dimpled honeycomb fabric across the leading shoulder edge, laminar airflow boundary layers remain attached longer, reducing aerodynamic drag by up to 4.2% at 40 km/h.\n\n### 2. Italian Warp-Knit Lycra for Bib Shorts\nStandard circular knits lose compression over time. We utilize 210 GSM warp-knit polyamide-elastane fabrics that deliver directional muscle compression and UV 50+ solar shielding.\n\n### 3. Chamois Sizing & 120kg/m³ Density Foam\nThe saddle interface utilizes high-density perforated foam laminated with hypoallergenic microfiber and bacteriostatic carbon threading to eliminate saddle sores on endurance brevets.\n\n### Sublimation Color Fidelity\nAll prints utilize Swiss OEKO-TEX certified sublimation inks, ensuring ultra-vivid team vector colors that resist UV fade and repeated machine washing.",
                'cover_image' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'published_at' => now()->subDays(7),
                'views_count' => 245,
            ],
            [
                'title' => 'Private Label Streetwear Blueprint: Woven Damask Labels, Tech Packs & Turnkey Packaging',
                'slug' => 'private-label-streetwear-blueprint',
                'category_slug' => 'private-label-strategy',
                'summary' => 'A step-by-step masterclass for apparel founders scaling from 50-piece prototypes to 5,000-piece container deliveries with full custom packaging.',
                'content' => "## Moving from Blanks to Custom Private Label Manufacturing\n\nMany emerging brands start with off-the-shelf catalog blanks. However, building long-term brand equity requires proprietary pattern cuts, bespoke Pantone dyeing, and custom branding trims.\n\n### 1. Creating a Factory-Ready Tech Pack\nAn actionable tech pack must include:\n- Flat sketch technical CAD drawings with annotated seam construction\n- Complete point-of-measurement (POM) grading charts (XS to 2XL)\n- Pantone TCX color references for fabric and thread\n- Print/embroidery coordinates accurate to within 2mm\n\n### 2. Woven Damask vs Heat-Transfer Labels\nHigh-density woven damask labels with laser-cut ultrasonic soft edges prevent neck irritation while establishing luxury tactile value. For athletic garments, tagless siliconized heat-transfers offer frictionless comfort.\n\n### 3. Retail Packaging Architecture\nEvery garment should ship in custom frosted 80-micron biodegradable ziplock polybags featuring printed SKU barcodes, ventilation hole punchings, and matte branded hangtags on 400 GSM FSC-certified craft paper.",
                'cover_image' => 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'published_at' => now()->subDays(11),
                'views_count' => 489,
            ],
            [
                'title' => 'Waterproof Outerwear Standards: 3-Layer Membranes, 20,000mm Hydrostatic Head & Seam Sealing',
                'slug' => 'waterproof-outerwear-standards-membranes-seam-sealing',
                'category_slug' => 'technical-manufacturing',
                'summary' => 'Deconstructing technical alpine ski wear and waterproof shell jackets: 20K/20K microporous membranes, DWR coatings, and hot-air seam taping.',
                'content' => "## Engineering Extreme Weather Outerwear\n\nMountain sports and alpine expeditions demand complete protection from driving snow and torrential rain while permitting body moisture vapor to escape during high exertion.\n\n### 1. Understanding 3-Layer (3L) Laminates\nA 3-layer fabric fuses:\n- **Face Fabric**: 70D ripstop nylon with C0 fluorocarbon-free water repellent (DWR)\n- **Membrane**: Microporous PTFE or hydrophilic PU membrane (20,000mm water column)\n- **Backer**: 20D micro-tricot mesh protecting the membrane from skin oils and abrasion\n\n### 2. Seam Sealing Technology\nNeedle perforations from standard sewing allow water penetration. All critical seams are sealed using 3-layer hot-air polyurethane seam tape applied at 210°C under precise pneumatic roller pressure.\n\n### 3. YKK Aquaguard & Cohaesive Cord Locks\nAll exterior pockets and pit-ventilation zippers feature YKK polyurethane-coated AquaGuard reverse coil zippers to seal against moisture ingress.",
                'cover_image' => 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
                'published_at' => now()->subDays(15),
                'views_count' => 178,
            ],
            [
                'title' => 'Tournament Ice Hockey Jerseys: Tackle Twill Cresting vs Digital Sublimation Durability',
                'slug' => 'tournament-ice-hockey-jerseys-tackle-twill-sublimation',
                'category_slug' => 'teamwear-sports-tech',
                'summary' => 'Comparing pro arena jersey tackle twill crest embroidery with 220 GSM birds-eye mesh and fight strap reinforcement for professional teams.',
                'content' => "## Pro Ice Hockey Jersey Construction\n\nIce hockey is among the most demanding sports for textile durability, requiring impact resistance against equipment padding, skate blades, and rink boards.\n\n### 1. K1 Birds-Eye Mesh & 330 GSM Air-Knit\nWe construct pro team jerseys from 100% filament polyester 330 GSM Air-Knit fabric on the chest and arms, paired with ventilated birds-eye mesh under the armpits for thermal release.\n\n### 2. Multi-Layer Tackle Twill Cresting\nFor tournament jerseys, multi-colored tackle twill patches are cut with laser precision and zigzag-stitched to the chest plate. This delivers dimensional prestige that printed jerseys cannot match.\n\n### 3. Authentic NHL-Spec Fight Straps\nPro jerseys include double-reinforced lower back nylon fight straps with brass snap closures and velcro tabs, anchored directly into reinforced double-needle stitched back panels.",
                'cover_image' => 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'published_at' => now()->subDays(18),
                'views_count' => 195,
            ],
            [
                'title' => 'Incoterms for Apparel Importers: Comparing FOB, CIF and DDP Shipping Costs',
                'slug' => 'incoterms-apparel-importers-fob-cif-ddp',
                'category_slug' => 'logistics-incoterms',
                'summary' => 'How international fashion brands and sports clubs minimize customs friction, port storage fees, and import duties when importing from Sialkot.',
                'content' => "## Demystifying International Commercial Shipping Terms\n\nNavigating international trade terms (Incoterms 2020) is critical for controlling landing costs and establishing insurance liability between factory dispatch and warehouse delivery.\n\n### 1. FOB (Free on Board - Sialkot Air / Karachi Port)\nThe factory covers domestic transit and export customs clearance up to the vessel or aircraft. The buyer assumes freight costs, marine cargo insurance, and destination import tariffs.\n\n### 2. CIF (Cost, Insurance & Freight)\nThe manufacturer arranges and pays for ocean or air carriage plus standard marine insurance to your destination port (e.g., Rotterdam, Los Angeles, or London Heathrow).\n\n### 3. DDP (Delivered Duty Paid - Turnkey Service)\nOur recommended turnkey option for emerging brands. TAWFIQ INDUSTRIES covers all air freight, customs brokerage, import VAT/GST, and final courier delivery directly to your door with zero hidden fees.",
                'cover_image' => 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
                'published_at' => now()->subDays(22),
                'views_count' => 380,
            ],
        ];

        foreach ($articles as $art) {
            $catId = $categories[$art['category_slug']]->id ?? null;
            BlogPost::updateOrCreate(
                ['slug' => $art['slug']],
                [
                    'title' => $art['title'],
                    'slug' => $art['slug'],
                    'blog_category_id' => $catId,
                    'author_id' => $admin->id,
                    'summary' => $art['summary'],
                    'content' => $art['content'],
                    'cover_image' => $art['cover_image'],
                    'meta_title' => $art['title'] . ' | TAWFIQ INDUSTRIES',
                    'meta_description' => Str::limit($art['summary'], 155),
                    'meta_keywords' => 'apparel manufacturing, custom sportswear, sialkot export, OEM apparel',
                    'status' => 'published',
                    'published_at' => $art['published_at'],
                    'views_count' => $art['views_count'],
                    'is_featured' => $art['is_featured'],
                ]
            );
        }

        // ==========================================
        // 4. TESTIMONIALS SEEDING
        // ==========================================
        $testimonials = [
            [
                'client_name' => 'Marcus Vance',
                'client_role' => 'Creative Director',
                'company' => 'Vance Atelier (New York)',
                'country' => 'United States',
                'country_flag' => '🇺🇸',
                'quote' => "TAWFIQ INDUSTRY's 450 GSM French Terry is by far the highest quality blank we have tested out of South Asia. The drape, double-hood density, and minimal shrinkage give our luxury label an incredible margin advantage.",
                'rating' => 5,
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'client_name' => 'Henrik Lindqvist',
                'client_role' => 'Head of Equipment',
                'company' => 'Nordic Peloton Club (Stockholm)',
                'country' => 'Sweden',
                'country_flag' => '🇸🇪',
                'quote' => "We ordered 300 sublimated race jerseys with aerodynamic dimpled sleeves and high-density chamois bibs. The color registration was exact to our CMYK vectors, and our riders praised the breathability across a 200km event.",
                'rating' => 5,
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'client_name' => 'Eleanor Sterling',
                'client_role' => 'Founder & Lead Designer',
                'company' => 'Sterling & Co. Equestrian (Cotswolds)',
                'country' => 'United Kingdom',
                'country_flag' => '🇬🇧',
                'quote' => "Tailoring Italian bonded softshell show jackets requires immense needle skill. TAWFIQ INDUSTRY's master pattern makers executed our silhouette flawlessly. The silicone full-seat grip on their breeches is tournament grade.",
                'rating' => 5,
                'sort_order' => 3,
                'is_featured' => true,
            ],
            [
                'client_name' => 'Alexander Hayes',
                'client_role' => 'Founder & Creative Lead',
                'company' => 'Aether Studios (London)',
                'country' => 'United Kingdom',
                'country_flag' => '🇬🇧',
                'quote' => "The fabric weight and vintage acid wash consistency exceeded our expectations. The 3D customizer shortened our sampling turnaround by 2 full weeks, and their DDP air shipping arrived ahead of schedule.",
                'rating' => 5,
                'sort_order' => 4,
                'is_featured' => true,
            ],
            [
                'client_name' => 'Sofia Rossi',
                'client_role' => 'Production Lead',
                'company' => 'Milano Heavy Apparel (Milan)',
                'country' => 'Italy',
                'country_flag' => '🇮🇹',
                'quote' => "Flawless rib-knit stitching and direct-to-garment print density. Live factory milestone tracking gave our team complete peace of mind throughout our 1,500-unit streetwear production run.",
                'rating' => 5,
                'sort_order' => 5,
                'is_featured' => true,
            ],
            [
                'client_name' => "Liam O'Connor",
                'client_role' => 'Team Manager',
                'company' => 'Dublin Ice Wolves HC',
                'country' => 'Ireland',
                'country_flag' => '🇮🇪',
                'quote' => "The tackle twill crest stitching on our team jerseys survived a brutal 30-game season with zero fraying. Fight straps and reinforced elbows are professional NHL standard.",
                'rating' => 5,
                'sort_order' => 6,
                'is_featured' => true,
            ],
            [
                'client_name' => 'Maximilian Weber',
                'client_role' => 'Race Director',
                'company' => 'Apex Karting Trophy (Stuttgart)',
                'country' => 'Germany',
                'country_flag' => '🇩🇪',
                'quote' => "Our custom Cordura 500D racing suits passed rigorous technical inspection. Floating arm gussets and breathable inner mesh lining give our drivers superior cockpit mobility.",
                'rating' => 5,
                'sort_order' => 7,
                'is_featured' => true,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(
                ['client_name' => $t['client_name']],
                array_merge($t, ['is_active' => true])
            );
        }
    }
}
