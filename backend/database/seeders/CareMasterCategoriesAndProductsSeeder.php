<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CareMasterCategoriesAndProductsSeeder extends Seeder
{
    public function run(): void
    {
        $categoriesData = [
            [
                'slug' => 'casual-wear',
                'name' => 'Casual Wear',
                'description' => 'Heavyweight streetwear blanks, French terry hoodies, oversized tees, and tailored tracksuits.',
                'hero_image' => '/categories/Casual wear (1).png',
                'sort_order' => 1,
                'subcategories' => [
                    ['slug' => 't-shirts', 'name' => 'T-Shirts'],
                    ['slug' => 'hoodies-sweatshirts', 'name' => 'Hoodies & Sweatshirts'],
                    ['slug' => 'sweatpants', 'name' => 'Sweatpants'],
                    ['slug' => 'cargo-pants', 'name' => 'Cargo Pants'],
                    ['slug' => 'shorts', 'name' => 'Shorts'],
                    ['slug' => 'jackets', 'name' => 'Jackets'],
                    ['slug' => 'tracksuits', 'name' => 'Tracksuits'],
                    ['slug' => 'custom-private-label', 'name' => 'Custom / Private Label Casual Wear'],
                ],
            ],
            [
                'slug' => 'equestrian-clothing',
                'name' => 'Equestrian Clothing',
                'description' => 'Luxury competition show jackets, technical silicone grip breeches, and aerodynamic sun-shirts.',
                'hero_image' => '/categories/Equestrian wear.png',
                'sort_order' => 2,
                'subcategories' => [
                    ['slug' => 'riding-jackets', 'name' => 'Riding Jackets'],
                    ['slug' => 'riding-breeches', 'name' => 'Riding Breeches'],
                    ['slug' => 'riding-trousers', 'name' => 'Riding Trousers'],
                    ['slug' => 'polo-shirts', 'name' => 'Polo Shirts'],
                    ['slug' => 'competition-shirts', 'name' => 'Competition Shirts'],
                    ['slug' => 'riding-tops', 'name' => 'Riding Tops'],
                    ['slug' => 'riding-vests', 'name' => 'Riding Vests'],
                    ['slug' => 'base-layers', 'name' => 'Base Layers'],
                    ['slug' => 'training-wear', 'name' => 'Training Wear'],
                    ['slug' => 'competition-wear', 'name' => 'Competition Wear'],
                    ['slug' => 'equestrian-team-wear', 'name' => 'Equestrian Team Wear'],
                    ['slug' => 'custom-equestrian', 'name' => 'Custom Equestrian Apparel'],
                ],
            ],
            [
                'slug' => 'ice-hockey',
                'name' => 'Ice Hockey',
                'description' => 'Sublimated pro-cut game jerseys, reinforced shell pants, and durable off-ice warmup kits.',
                'hero_image' => '/categories/Teamsport Wear.png',
                'sort_order' => 3,
                'subcategories' => [
                    ['slug' => 'ice-hockey-jerseys', 'name' => 'Ice Hockey Jerseys'],
                    ['slug' => 'hockey-pants', 'name' => 'Hockey Pants'],
                    ['slug' => 'hockey-shorts', 'name' => 'Hockey Shorts'],
                    ['slug' => 'hockey-jackets', 'name' => 'Hockey Jackets'],
                    ['slug' => 'hockey-training-wear', 'name' => 'Hockey Training Wear'],
                    ['slug' => 'custom-hockey-team-kits', 'name' => 'Custom Hockey Team Kits'],
                ],
            ],
            [
                'slug' => 'cycling',
                'name' => 'Cycling',
                'description' => 'Aerodynamic race jerseys, Italian-padded bib shorts, and ultra-packable wind vests.',
                'hero_image' => '/categories/Cyclist Conquering the Mountain Pass.png',
                'sort_order' => 4,
                'subcategories' => [
                    ['slug' => 'cycling-jerseys', 'name' => 'Cycling Jerseys'],
                    ['slug' => 'cycling-bib-shorts', 'name' => 'Cycling Bib Shorts'],
                    ['slug' => 'cycling-shorts', 'name' => 'Cycling Shorts'],
                    ['slug' => 'cycling-jackets', 'name' => 'Cycling Jackets'],
                    ['slug' => 'cycling-vests', 'name' => 'Cycling Vests'],
                    ['slug' => 'cycling-base-layers', 'name' => 'Cycling Base Layers'],
                    ['slug' => 'cycling-team-kits', 'name' => 'Cycling Team Kits'],
                    ['slug' => 'custom-cycling-apparel', 'name' => 'Custom Cycling Apparel'],
                ],
            ],
            [
                'slug' => 'rugby',
                'name' => 'Rugby',
                'description' => 'Tear-proof match jerseys, reinforced bar-tacked shorts, and all-weather training smocks.',
                'hero_image' => '/categories/Confident Soccer Portrait with Ball.png',
                'sort_order' => 5,
                'subcategories' => [
                    ['slug' => 'rugby-jerseys', 'name' => 'Rugby Jerseys'],
                    ['slug' => 'rugby-shorts', 'name' => 'Rugby Shorts'],
                    ['slug' => 'rugby-training-wear', 'name' => 'Rugby Training Wear'],
                    ['slug' => 'rugby-jackets', 'name' => 'Rugby Jackets'],
                    ['slug' => 'rugby-team-kits', 'name' => 'Rugby Team Kits'],
                    ['slug' => 'custom-rugby-apparel', 'name' => 'Custom Rugby Apparel'],
                ],
            ],
            [
                'slug' => 'basketball',
                'name' => 'Basketball',
                'description' => 'Air-mesh reversible jerseys, court shorts with deep pockets, and warmup shooting shirts.',
                'hero_image' => '/categories/Skyward Saintfour Basketball Portrait.png',
                'sort_order' => 6,
                'subcategories' => [
                    ['slug' => 'basketball-jerseys', 'name' => 'Basketball Jerseys'],
                    ['slug' => 'basketball-shorts', 'name' => 'Basketball Shorts'],
                    ['slug' => 'basketball-sets', 'name' => 'Basketball Sets'],
                    ['slug' => 'basketball-training-wear', 'name' => 'Basketball Training Wear'],
                    ['slug' => 'basketball-team-kits', 'name' => 'Basketball Team Kits'],
                    ['slug' => 'custom-basketball-apparel', 'name' => 'Custom Basketball Apparel'],
                ],
            ],
            [
                'slug' => 'ski-wear',
                'name' => 'Ski Wear',
                'description' => '3-layer 20,000mm waterproof alpine jackets, insulated bib pants, and merino thermal base layers.',
                'hero_image' => '/categories/Outdoor.png',
                'sort_order' => 7,
                'subcategories' => [
                    ['slug' => 'ski-jackets', 'name' => 'Ski Jackets'],
                    ['slug' => 'ski-pants', 'name' => 'Ski Pants'],
                    ['slug' => 'ski-suits', 'name' => 'Ski Suits'],
                    ['slug' => 'ski-bibs', 'name' => 'Ski Bibs'],
                    ['slug' => 'ski-base-layers', 'name' => 'Base Layers'],
                    ['slug' => 'thermal-wear', 'name' => 'Thermal Wear'],
                    ['slug' => 'waterproof-ski-wear', 'name' => 'Waterproof Ski Wear'],
                    ['slug' => 'windproof-ski-wear', 'name' => 'Windproof Ski Wear'],
                    ['slug' => 'custom-ski-apparel', 'name' => 'Custom Ski Apparel'],
                ],
            ],
            [
                'slug' => 'go-karting-racing',
                'name' => 'Go-Karting & Racing',
                'description' => 'Abrasion-resistant Cordura racing suits, pit-crew jackets, and ergonomic mechanics pants.',
                'hero_image' => '/categories/Charles Leclerc Monza 2025.jpg',
                'sort_order' => 8,
                'subcategories' => [
                    ['slug' => 'racing-suits', 'name' => 'Go-Karting Racing Suits'],
                    ['slug' => 'racing-jackets', 'name' => 'Racing Jackets'],
                    ['slug' => 'racing-pants', 'name' => 'Racing Pants'],
                    ['slug' => 'racing-team-apparel', 'name' => 'Racing Team Apparel'],
                    ['slug' => 'custom-racing-apparel', 'name' => 'Custom Racing Apparel'],
                ],
            ],
            [
                'slug' => 'streetwear',
                'name' => 'Streetwear',
                'description' => 'Heavyweight streetwear garments, oversized boxy drops, and luxury fleece.',
                'hero_image' => '/categories/Casual wear (1).png',
                'sort_order' => 9,
                'subcategories' => [
                    ['slug' => 'hoodies', 'name' => 'Hoodies'],
                    ['slug' => 't-shirts-street', 'name' => 'Streetwear Tees'],
                    ['slug' => 'varsity-jackets', 'name' => 'Varsity Jackets'],
                    ['slug' => 'sweatpants-street', 'name' => 'Heavy Sweatpants'],
                ],
            ],
        ];

        // 1. Seed Categories & Subcategories
        foreach ($categoriesData as $catData) {
            $parent = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                [
                    'name' => $catData['name'],
                    'description' => $catData['description'],
                    'hero_image' => $catData['hero_image'],
                    'sort_order' => $catData['sort_order'],
                    'is_active' => true,
                ]
            );

            if (!empty($catData['subcategories'])) {
                foreach ($catData['subcategories'] as $subIdx => $sub) {
                    Category::updateOrCreate(
                        ['slug' => $sub['slug']],
                        [
                            'parent_id' => $parent->id,
                            'name' => $sub['name'],
                            'sort_order' => $subIdx + 1,
                            'is_active' => true,
                        ]
                    );
                }
            }
        }

        // 2. Associate Product 198 ("Rain cycling gilet") with Cycling & Cycling Vests
        $cyclingCat = Category::where('slug', 'cycling')->first();
        $cyclingVestCat = Category::where('slug', 'cycling-vests')->first();
        $giletProduct = Product::where('slug', 'rain-cycling-gilet')
            ->orWhere('id', 198)
            ->first();

        if ($giletProduct && $cyclingCat) {
            $catIds = [$cyclingCat->id];
            if ($cyclingVestCat) {
                $catIds[] = $cyclingVestCat->id;
            }
            $giletProduct->categories()->sync($catIds);
        }

        // 3. Make sure seeded sample products match their categories
        $hoodieCat = Category::where('slug', 'hoodies')->first();
        $streetCat = Category::where('slug', 'streetwear')->first();
        $casCat = Category::where('slug', 'casual-wear')->first();

        $hoodieProd = Product::where('sku', 'CM-HD-001')->first();
        if ($hoodieProd && $streetCat) {
            $hoodieProd->categories()->sync(array_filter([$streetCat->id, $casCat?->id, $hoodieCat?->id]));
        }
    }
}
