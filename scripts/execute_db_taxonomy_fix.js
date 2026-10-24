const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BACKEND = '/home/u382928869/domains/cmsportswear.pk/backend';

// The PHP script to execute on remote server inside Laravel environment
const phpMigrationScript = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\\Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();

use App\\Models\\Category;
use App\\Models\\Product;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

DB::beginTransaction();

try {
    echo "=== STEP 1: CREATE / UPDATE LEVEL 1 PILLAR DIVISIONS ===\\n";
    $pillars = [
        ['name' => 'Team Sports Wear', 'slug' => 'team-sports-wear', 'sort_order' => 1, 'tagline' => 'High-performance team uniforms, match jerseys, and technical kits for professional athletics.'],
        ['name' => 'Martial Arts & Combat Wear', 'slug' => 'martial-arts-combat-wear', 'sort_order' => 2, 'tagline' => 'Championship BJJ gis, fight rash guards, compression singlets, and combat apparel.'],
        ['name' => 'Activewear & Fitness', 'slug' => 'activewear-fitness', 'sort_order' => 3, 'tagline' => 'Engineered 4-way stretch gym wear, compression layers, and women’s performance activewear.'],
        ['name' => 'Casual & Lifestyle Wear', 'slug' => 'casual-lifestyle-wear', 'sort_order' => 4, 'tagline' => 'Custom streetwear, heavyweight hoodies, oversized tees, and lifestyle apparel.'],
        ['name' => 'Jackets & Outerwear', 'slug' => 'jackets-outerwear', 'sort_order' => 5, 'tagline' => 'Premium varsity jackets, leather bombers, softshells, and technical outerwear.'],
        ['name' => 'Kids & Youth Wear', 'slug' => 'kids-youth-wear', 'sort_order' => 6, 'tagline' => 'High-durability youth team uniforms, athletic blanks, and school sports apparel.'],
        ['name' => 'Workwear & Medical Wear', 'slug' => 'workwear-medical-wear', 'sort_order' => 7, 'tagline' => 'Certified high-vis safety wear, industrial workwear, and medical scrubs.'],
        ['name' => 'Sports Accessories', 'slug' => 'sports-accessories', 'sort_order' => 8, 'tagline' => 'Custom sports bags, team socks, headwear, training bibs, and sports equipment.'],
        ['name' => 'Gloves', 'slug' => 'gloves', 'sort_order' => 9, 'tagline' => 'Elite grip sports gloves, winter thermal handwear, and protective work gloves.'],
    ];

    $pillarMap = []; // slug => Category model
    foreach ($pillars as $pData) {
        $pillar = Category::firstOrNew(['slug' => $pData['slug']]);
        $pillar->name = $pData['name'];
        $pillar->parent_id = null; // Level 1 root
        $pillar->sort_order = $pData['sort_order'];
        $pillar->tagline = $pData['tagline'];
        $pillar->is_active = true;
        $pillar->save();
        $pillarMap[$pData['slug']] = $pillar;
        echo " ✓ Pillar ready: [ID {$pillar->id}] {$pillar->name} ({$pillar->slug})\\n";
    }

    echo "\\n=== STEP 2: CREATE / UPDATE LEVEL 2 SUBCATEGORIES ===\\n";
    $subcategories = [
        // 01 Team Sports Wear
        ['parent' => 'team-sports-wear', 'name' => 'Ice Hockey', 'slug' => 'ice-hockey', 'sort' => 1],
        ['parent' => 'team-sports-wear', 'name' => 'Soccer & Football', 'slug' => 'soccer-football', 'sort' => 2],
        ['parent' => 'team-sports-wear', 'name' => 'American Football', 'slug' => 'american-football', 'sort' => 3],
        ['parent' => 'team-sports-wear', 'name' => 'Basketball', 'slug' => 'basketball', 'sort' => 4],
        ['parent' => 'team-sports-wear', 'name' => 'Baseball & Softball', 'slug' => 'baseball-softball', 'sort' => 5],
        ['parent' => 'team-sports-wear', 'name' => 'Cricket', 'slug' => 'cricket', 'sort' => 6],
        ['parent' => 'team-sports-wear', 'name' => 'Rugby', 'slug' => 'rugby', 'sort' => 7],
        ['parent' => 'team-sports-wear', 'name' => 'Lacrosse', 'slug' => 'lacrosse', 'sort' => 8],
        ['parent' => 'team-sports-wear', 'name' => 'Volleyball', 'slug' => 'volleyball', 'sort' => 9],
        ['parent' => 'team-sports-wear', 'name' => 'Tennis & Golf', 'slug' => 'tennis-golf', 'sort' => 10],

        // 02 Martial Arts & Combat Wear
        ['parent' => 'martial-arts-combat-wear', 'name' => 'BJJ & Grappling', 'slug' => 'bjj-grappling', 'sort' => 1],
        ['parent' => 'martial-arts-combat-wear', 'name' => 'MMA', 'slug' => 'mma', 'sort' => 2],
        ['parent' => 'martial-arts-combat-wear', 'name' => 'Boxing & Muay Thai', 'slug' => 'boxing-muay-thai', 'sort' => 3],
        ['parent' => 'martial-arts-combat-wear', 'name' => 'Karate', 'slug' => 'karate', 'sort' => 4],
        ['parent' => 'martial-arts-combat-wear', 'name' => 'Judo', 'slug' => 'judo', 'sort' => 5],
        ['parent' => 'martial-arts-combat-wear', 'name' => 'Taekwondo', 'slug' => 'taekwondo', 'sort' => 6],
        ['parent' => 'martial-arts-combat-wear', 'name' => 'Wrestling', 'slug' => 'wrestling', 'sort' => 7],

        // 03 Activewear & Fitness
        ['parent' => 'activewear-fitness', 'name' => 'Gym & Training Wear', 'slug' => 'gym-training-wear', 'sort' => 1],
        ['parent' => 'activewear-fitness', 'name' => 'Compression Wear', 'slug' => 'compression-wear', 'sort' => 2],
        ['parent' => 'activewear-fitness', 'name' => 'Women’s Activewear', 'slug' => 'womens-activewear', 'sort' => 3],
        ['parent' => 'activewear-fitness', 'name' => 'Running & Athletics', 'slug' => 'running-athletics', 'sort' => 4],
        ['parent' => 'activewear-fitness', 'name' => 'Cycling Wear', 'slug' => 'cycling-wear', 'sort' => 5],

        // 04 Casual & Lifestyle Wear
        ['parent' => 'casual-lifestyle-wear', 'name' => 'T-Shirts & Tops', 'slug' => 't-shirts-tops', 'sort' => 1],
        ['parent' => 'casual-lifestyle-wear', 'name' => 'Hoodies & Sweatshirts', 'slug' => 'hoodies-sweatshirts', 'sort' => 2],
        ['parent' => 'casual-lifestyle-wear', 'name' => 'Tracksuits & Matching Sets', 'slug' => 'tracksuits-sets', 'sort' => 3],
        ['parent' => 'casual-lifestyle-wear', 'name' => 'Pants & Bottoms', 'slug' => 'pants-bottoms', 'sort' => 4],
        ['parent' => 'casual-lifestyle-wear', 'name' => 'Streetwear', 'slug' => 'streetwear', 'sort' => 5],

        // 05 Jackets & Outerwear
        ['parent' => 'jackets-outerwear', 'name' => 'Varsity Jackets', 'slug' => 'varsity-jackets', 'sort' => 1],
        ['parent' => 'jackets-outerwear', 'name' => 'Leather Jackets', 'slug' => 'leather-jackets', 'sort' => 2],
        ['parent' => 'jackets-outerwear', 'name' => 'Softshell Jackets', 'slug' => 'softshell-jackets', 'sort' => 3],
        ['parent' => 'jackets-outerwear', 'name' => 'Windbreakers', 'slug' => 'windbreakers', 'sort' => 4],
        ['parent' => 'jackets-outerwear', 'name' => 'Winter Wear', 'slug' => 'winter-wear', 'sort' => 5],
        ['parent' => 'jackets-outerwear', 'name' => 'Rainwear', 'slug' => 'rainwear', 'sort' => 6],

        // 06 Kids & Youth Wear
        ['parent' => 'kids-youth-wear', 'name' => 'Youth Team Uniforms', 'slug' => 'youth-team-uniforms', 'sort' => 1],
        ['parent' => 'kids-youth-wear', 'name' => 'Kids’ Activewear', 'slug' => 'kids-activewear', 'sort' => 2],
        ['parent' => 'kids-youth-wear', 'name' => 'Kids’ T-Shirts', 'slug' => 'kids-t-shirts', 'sort' => 3],
        ['parent' => 'kids-youth-wear', 'name' => 'Kids’ Hoodies', 'slug' => 'kids-hoodies', 'sort' => 4],
        ['parent' => 'kids-youth-wear', 'name' => 'Kids’ Tracksuits', 'slug' => 'kids-tracksuits', 'sort' => 5],

        // 07 Workwear & Medical Wear
        ['parent' => 'workwear-medical-wear', 'name' => 'Medical Scrubs', 'slug' => 'medical-scrubs', 'sort' => 1],
        ['parent' => 'workwear-medical-wear', 'name' => 'Work Uniforms', 'slug' => 'work-uniforms', 'sort' => 2],
        ['parent' => 'workwear-medical-wear', 'name' => 'Work Polo Shirts', 'slug' => 'work-polo-shirts', 'sort' => 3],

        // 08 Sports Accessories
        ['parent' => 'sports-accessories', 'name' => 'Team Socks', 'slug' => 'team-socks', 'sort' => 1],
        ['parent' => 'sports-accessories', 'name' => 'Training Bibs', 'slug' => 'training-bibs', 'sort' => 2],
        ['parent' => 'sports-accessories', 'name' => 'Caps', 'slug' => 'caps', 'sort' => 3],
        ['parent' => 'sports-accessories', 'name' => 'Headbands', 'slug' => 'headbands', 'sort' => 4],
        ['parent' => 'sports-accessories', 'name' => 'Wristbands', 'slug' => 'wristbands', 'sort' => 5],
        ['parent' => 'sports-accessories', 'name' => 'Bags & Backpacks', 'slug' => 'bags-backpacks', 'sort' => 6],

        // 09 Gloves
        ['parent' => 'gloves', 'name' => 'Ice Hockey Gloves', 'slug' => 'ice-hockey-gloves', 'sort' => 1],
        ['parent' => 'gloves', 'name' => 'Goalkeeper Gloves', 'slug' => 'goalkeeper-gloves', 'sort' => 2],
        ['parent' => 'gloves', 'name' => 'Cricket Batting Gloves', 'slug' => 'cricket-batting-gloves', 'sort' => 3],
        ['parent' => 'gloves', 'name' => 'Baseball Batting Gloves', 'slug' => 'baseball-batting-gloves', 'sort' => 4],
        ['parent' => 'gloves', 'name' => 'Boxing Gloves', 'slug' => 'boxing-gloves', 'sort' => 5],
        ['parent' => 'gloves', 'name' => 'MMA Gloves', 'slug' => 'mma-gloves', 'sort' => 6],
        ['parent' => 'gloves', 'name' => 'Gym & Weightlifting Gloves', 'slug' => 'gym-weightlifting-gloves', 'sort' => 7],
        ['parent' => 'gloves', 'name' => 'Cycling Gloves', 'slug' => 'cycling-gloves', 'sort' => 8],
        ['parent' => 'gloves', 'name' => 'Winter Gloves', 'slug' => 'winter-gloves', 'sort' => 9],
        ['parent' => 'gloves', 'name' => 'Work Gloves', 'slug' => 'work-gloves', 'sort' => 10],
    ];

    $subMap = []; // slug => Category model
    foreach ($subcategories as $sData) {
        $parentPillar = $pillarMap[$sData['parent']] ?? Category::where('slug', $sData['parent'])->first();
        if (!$parentPillar) {
            echo " ! Error: Parent pillar {$sData['parent']} not found!\\n";
            continue;
        }

        $sub = Category::firstOrNew(['slug' => $sData['slug']]);
        $sub->name = $sData['name'];
        $sub->parent_id = $parentPillar->id;
        $sub->sort_order = $sData['sort'];
        $sub->is_active = true;
        $sub->save();
        $subMap[$sData['slug']] = $sub;
        echo " ✓ Subcategory ready: [ID {$sub->id}] {$sub->name} ({$sub->slug}) -> Parent: {$parentPillar->name}\\n";
    }

    echo "\\n=== STEP 3: RE-PARENT EXISTING FLAT/CHILD CATEGORIES UNDER LEVEL 2 ===\\n";
    // Mapping of existing category slugs to their new Level 2 parent subcategory slug
    $reParentMapping = [
        // Ice Hockey
        'ice-hockey-clothing' => 'ice-hockey',
        'sublimated-game-jerseys' => 'ice-hockey',
        'tackle-twill-embroidered-jerseys' => 'ice-hockey',
        'practice-jerseys' => 'ice-hockey',
        'coach-jackets' => 'ice-hockey',
        'hockey-pant-shells' => 'ice-hockey',
        'ice-hockey-jerseys' => 'ice-hockey',
        'hockey-pants' => 'ice-hockey',
        'hockey-shorts' => 'ice-hockey',
        'hockey-jackets' => 'ice-hockey',
        'hockey-training-wear' => 'ice-hockey',
        'custom-hockey-team-kits' => 'ice-hockey',
        'ice-hockey-socks' => 'ice-hockey',
        'graphite-sticks' => 'ice-hockey',
        'ice-hockey-uniforms' => 'ice-hockey',

        // Soccer & Football
        'soccerfootball' => 'soccer-football',
        'soccer-uniforms' => 'soccer-football',
        'soccer-team-kits' => 'soccer-football',
        'soccer-shorts' => 'soccer-football',
        'soccer-sets' => 'soccer-football',
        'custom-soccer-jerseys' => 'soccer-football',
        'goalkeeper-jerseys' => 'soccer-football',
        'goalkeeper-wear' => 'soccer-football',

        // American Football
        'american-footbal-uniform' => 'american-football',
        'american-football-uniform' => 'american-football',
        'american-football-pants' => 'american-football',

        // Basketball
        'basketball-uniform' => 'basketball',
        'basketball-jerseys' => 'basketball',
        'basketball-shorts' => 'basketball',
        'basketball-warm-up-suits' => 'basketball',
        'basketball-team-kits' => 'basketball',
        'basketball-sets' => 'basketball',
        'basketball-training-wear' => 'basketball',
        'custom-basketball-apparel' => 'basketball',

        // Baseball & Softball
        'baseball' => 'baseball-softball',
        'baseball-jeresy' => 'baseball-softball',
        'baseball-pants' => 'baseball-softball',
        'baseball-hoodies' => 'baseball-softball',
        'baseball-gear' => 'baseball-softball',
        'baseball-uniform' => 'baseball-softball',
        'baseball-equipment-set' => 'baseball-softball',

        // Cricket
        'cricket-uniform' => 'cricket',

        // Rugby
        'rugby-uniform' => 'rugby',
        'rugby-jerseys' => 'rugby',
        'rugby-shorts' => 'rugby',
        'rugby-training-wear' => 'rugby',
        'rugby-jackets' => 'rugby',
        'rugby-team-kits' => 'rugby',
        'custom-rugby-apparel' => 'rugby',

        // Lacrosse
        'lacrosse' => 'lacrosse',

        // Volleyball
        'volleyball' => 'volleyball',
        'volleyball-jersey' => 'volleyball',
        'volleyball-shorts' => 'volleyball',
        'volleyball-shorts-spandex' => 'volleyball',
        'volleyball-training-wear' => 'volleyball',
        'volleyball-accessories' => 'volleyball',

        // Tennis & Golf
        'golf' => 'tennis-golf',
        'polo' => 'tennis-golf',
        'polo-shirts' => 'tennis-golf',
        'skirts' => 'tennis-golf',

        // Gym & Training Wear
        'fitness-apparel' => 'gym-training-wear',
        'fitness-wear' => 'gym-training-wear',
        'training-trousers' => 'gym-training-wear',

        // Compression Wear
        'compression-shirts' => 'compression-wear',
        'compression-pants' => 'compression-wear',
        'compression-shorts' => 'compression-wear',
        'conductive-sports-garments' => 'compression-wear',
        'base-layers' => 'compression-wear',

        // Women's Activewear
        'bras-legging' => 'womens-activewear',
        'yoga-wear' => 'womens-activewear',
        'fitness-sets' => 'womens-activewear',

        // Running & Athletics
        'running-wear' => 'running-athletics',
        'track-field-hurdling' => 'running-athletics',

        // Cycling Wear
        'cycling-uniform' => 'cycling-wear',
        'cycling-shirts' => 'cycling-wear',
        'cycling-shorts' => 'cycling-wear',
        'cycling-bib-tights' => 'cycling-wear',
        'bmx-cycling' => 'cycling-wear',

        // Martial Arts & Combat
        'jiu-jitsu' => 'bjj-grappling',
        'combat-training-wear' => 'bjj-grappling',
        'combat-teamwear' => 'bjj-grappling',
        'combat-sports' => 'mma',
        'martial-arts' => 'bjj-grappling',
        'full-contact' => 'mma',
        'kick-boxing' => 'mma',
        'boxing' => 'boxing-muay-thai',
        'muay-thai' => 'boxing-muay-thai',
        'karate' => 'karate',
        'judo-uniform' => 'judo',
        'taekwondo' => 'taekwondo',
        'wrestling' => 'wrestling',
        'wresting-uniform' => 'wrestling',

        // Casual & Lifestyle
        'casual-wear' => 't-shirts-tops',
        'casual-wears' => 't-shirts-tops',
        'clothing' => 't-shirts-tops',
        'fashion-wear' => 't-shirts-tops',
        't-shirts-street' => 't-shirts-tops',
        'hoodies-sweatshirts' => 'hoodies-sweatshirts',
        'sweat-shirts' => 'hoodies-sweatshirts',
        'sweat-shirt' => 'hoodies-sweatshirts',
        'sweaters' => 'hoodies-sweatshirts',
        'track-suits' => 'tracksuits-sets',
        'tracksuits' => 'tracksuits-sets',
        'sweat-suits' => 'tracksuits-sets',
        'pants' => 'pants-bottoms',
        'trousers' => 'pants-bottoms',
        'sweat-pants' => 'pants-bottoms',
        'sweatpants' => 'pants-bottoms',
        'sweatpants-street' => 'pants-bottoms',
        'cargo-pants' => 'pants-bottoms',
        'denim-jeans' => 'pants-bottoms',
        'street-wear' => 'streetwear',

        // Jackets & Outerwear
        'bomber-jackets' => 'varsity-jackets',
        'puffer-jackets' => 'winter-wear',
        'coats' => 'winter-wear',
        'leather-jackets' => 'leather-jackets',
        'leather-vests' => 'leather-jackets',
        'leather-pants' => 'leather-jackets',
        'leather-shorts' => 'leather-jackets',
        'custom-leather-wear' => 'leather-jackets',
        'wind-breaker-set' => 'windbreakers',
        'safety-rain-wear' => 'rainwear',

        // Workwear & Medical
        'scrub-suit' => 'medical-scrubs',
        'safety-wear' => 'work-uniforms',
        'safety-suits' => 'work-uniforms',
        'safety-coveralls' => 'work-uniforms',
        'safety-heated-apparel' => 'work-uniforms',
        'safety-balaclava' => 'work-uniforms',
        'safety-bags' => 'work-uniforms',
        'toolbelt' => 'work-uniforms',
        'vests' => 'work-uniforms',

        // Accessories
        'socks' => 'team-socks',
        'training-bibs' => 'training-bibs',
        'honours-caps' => 'caps',
        'visor' => 'caps',
        'head-wear' => 'headbands',
        'headwear' => 'headbands',
        'beanie' => 'headbands',
        'balaclavas-ski-masks' => 'headbands',
        'masks' => 'headbands',
        'fitness-accessories' => 'wristbands',
        'accessories' => 'wristbands',
        'bags' => 'bags-backpacks',
        'backpack' => 'bags-backpacks',
        'duffle-bag' => 'bags-backpacks',
        'laptop-bag' => 'bags-backpacks',
        'sling-bag' => 'bags-backpacks',
        'guitar-bag' => 'bags-backpacks',
        'camera-bag' => 'bags-backpacks',

        // Gloves
        'polo-glove' => 'work-gloves',
        'motor-cross-glove' => 'work-gloves',
        'handball-glove' => 'work-gloves',
        'gardening-glove' => 'work-gloves',
        'snow-glove' => 'winter-gloves',
        'fishing-glove' => 'work-gloves',
        'motorcycling-glove' => 'work-gloves',
        'mittens-glove' => 'winter-gloves',
        'gaelic-gloves' => 'work-gloves',
        'hurling-gloves' => 'work-gloves',
        'rugby-gloves' => 'work-gloves',
    ];

    foreach ($reParentMapping as $childSlug => $parentSlug) {
        $child = Category::where('slug', $childSlug)->first();
        $parent = $subMap[$parentSlug] ?? Category::where('slug', $parentSlug)->first();
        if ($child && $parent) {
            // Only update parent_id if it's currently root or different
            if ($child->id !== $parent->id) {
                $child->parent_id = $parent->id;
                $child->save();
                echo " ✓ Re-parented: [ID {$child->id}] {$child->name} ({$child->slug}) -> Parent: [ID {$parent->id}] {$parent->name}\\n";
            }
        }
    }

    // Legacy sport roots (Sportswear ID 74, Sportwear ID 206, Sports Wears ID 239, Sports Wear ID 240)
    $teamSportsPillar = $pillarMap['team-sports-wear'];
    foreach (['sportswear', 'sportwear', 'sports-wears', 'sports-wear'] as $legacySportSlug) {
        $legacy = Category::where('slug', $legacySportSlug)->first();
        if ($legacy && $legacy->id !== $teamSportsPillar->id) {
            $legacy->parent_id = $teamSportsPillar->id;
            $legacy->save();
            echo " ✓ Re-parented legacy sport root: {$legacy->name} -> Team Sports Wear\\n";
        }
    }

    echo "\\n=== STEP 4: ASSOCIATE PRODUCTS TO SUB-CATEGORIES AND PILLARS ===\\n";
    // 1. Rugby products: attach to rugby, rugby-jerseys, rugby-shorts
    $rugbyCat = Category::where('slug', 'rugby')->first();
    $rugbyJerseysCat = Category::where('slug', 'rugby-jerseys')->first();
    $rugbyShortsCat = Category::where('slug', 'rugby-shorts')->first();
    $rugbyProducts = Product::whereHas('categories', fn($q) => $q->where('slug', 'rugby-uniform'))->get();
    echo "Found " . $rugbyProducts->count() . " rugby uniform products. Linking to rugby, rugby-jerseys, rugby-shorts, team-sports-wear...\\n";
    foreach ($rugbyProducts as $p) {
        $catIdsToSync = array_filter([
            $rugbyCat?->id,
            $rugbyJerseysCat?->id,
            $rugbyShortsCat?->id,
            $teamSportsPillar->id
        ]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 2. American football products: attach to american-football, american-football-uniform, team-sports-wear
    $afCat = Category::where('slug', 'american-football')->first();
    $afuCat = Category::where('slug', 'american-football-uniform')->first();
    $afProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['american-footbal-uniform', 'american-football-uniform']))->get();
    echo "Found " . $afProducts->count() . " american football products. Linking to american-football & team-sports-wear...\\n";
    foreach ($afProducts as $p) {
        $catIdsToSync = array_filter([$afCat?->id, $afuCat?->id, $teamSportsPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 3. Gym & Training Wear products
    $gymCat = Category::where('slug', 'gym-training-wear')->first();
    $activewearPillar = $pillarMap['activewear-fitness'];
    $gymProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['fitness-apparel', 'fitness-wear', 'training-trousers']))->get();
    echo "Found " . $gymProducts->count() . " gym products. Linking to gym-training-wear & activewear-fitness...\\n";
    foreach ($gymProducts as $p) {
        $catIdsToSync = array_filter([$gymCat?->id, $activewearPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 4. Compression Wear products
    $compCat = Category::where('slug', 'compression-wear')->first();
    $compProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['compression-shirts', 'compression-pants', 'compression-shorts', 'base-layers']))->get();
    echo "Found " . $compProducts->count() . " compression products. Linking to compression-wear & activewear-fitness...\\n";
    foreach ($compProducts as $p) {
        $catIdsToSync = array_filter([$compCat?->id, $activewearPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 5. Women's Activewear products
    $waCat = Category::where('slug', 'womens-activewear')->first();
    $waProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['bras-legging', 'yoga-wear', 'fitness-sets']))->get();
    echo "Found " . $waProducts->count() . " women's activewear products. Linking to womens-activewear & activewear-fitness...\\n";
    foreach ($waProducts as $p) {
        $catIdsToSync = array_filter([$waCat?->id, $activewearPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 6. Running & Athletics products
    $raCat = Category::where('slug', 'running-athletics')->first();
    $raProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['running-wear', 'track-field-hurdling']))->get();
    echo "Found " . $raProducts->count() . " running & athletics products. Linking to running-athletics & activewear-fitness...\\n";
    foreach ($raProducts as $p) {
        $catIdsToSync = array_filter([$raCat?->id, $activewearPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 7. Cycling Wear products
    $cyCat = Category::where('slug', 'cycling-wear')->first();
    $cyProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['cycling-uniform', 'cycling-shirts', 'cycling-shorts', 'cycling-bib-tights', 'bmx-cycling']))->get();
    echo "Found " . $cyProducts->count() . " cycling products. Linking to cycling-wear & activewear-fitness...\\n";
    foreach ($cyProducts as $p) {
        $catIdsToSync = array_filter([$cyCat?->id, $activewearPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 8. Ice Hockey products
    $ihCat = Category::where('slug', 'ice-hockey')->first();
    $ihProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['ice-hockey-clothing', 'sublimated-game-jerseys', 'tackle-twill-embroidered-jerseys', 'practice-jerseys', 'coach-jackets', 'hockey-pant-shells']))->get();
    echo "Found " . $ihProducts->count() . " ice hockey products. Linking to ice-hockey & team-sports-wear...\\n";
    foreach ($ihProducts as $p) {
        $catIdsToSync = array_filter([$ihCat?->id, $teamSportsPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 9. Soccer & Football products
    $socCat = Category::where('slug', 'soccer-football')->first();
    $socProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['soccerfootball', 'soccer-uniforms', 'soccer-team-kits', 'soccer-shorts', 'soccer-sets', 'custom-soccer-jerseys', 'goalkeeper-jerseys', 'goalkeeper-wear']))->get();
    echo "Found " . $socProducts->count() . " soccer products. Linking to soccer-football & team-sports-wear...\\n";
    foreach ($socProducts as $p) {
        $catIdsToSync = array_filter([$socCat?->id, $teamSportsPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 10. Baseball & Softball products
    $bbCat = Category::where('slug', 'baseball-softball')->first();
    $bbProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['baseball', 'baseball-jeresy', 'baseball-pants', 'baseball-hoodies', 'baseball-gear', 'baseball-uniform', 'baseball-equipment-set']))->get();
    echo "Found " . $bbProducts->count() . " baseball products. Linking to baseball-softball & team-sports-wear...\\n";
    foreach ($bbProducts as $p) {
        $catIdsToSync = array_filter([$bbCat?->id, $teamSportsPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 11. Volleyball products
    $vbCat = Category::where('slug', 'volleyball')->first();
    $vbProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['volleyball', 'volleyball-jersey', 'volleyball-shorts', 'volleyball-shorts-spandex', 'volleyball-training-wear', 'volleyball-accessories']))->get();
    echo "Found " . $vbProducts->count() . " volleyball products. Linking to volleyball & team-sports-wear...\\n";
    foreach ($vbProducts as $p) {
        $catIdsToSync = array_filter([$vbCat?->id, $teamSportsPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 12. Basketball products
    $bkCat = Category::where('slug', 'basketball')->first();
    $bkProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['basketball', 'basketball-uniform', 'basketball-jerseys', 'basketball-shorts', 'basketball-warm-up-suits', 'basketball-team-kits']))->get();
    echo "Found " . $bkProducts->count() . " basketball products. Linking to basketball & team-sports-wear...\\n";
    foreach ($bkProducts as $p) {
        $catIdsToSync = array_filter([$bkCat?->id, $teamSportsPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    // 13. Medical Scrubs & Workwear products
    $msCat = Category::where('slug', 'medical-scrubs')->first();
    $wuCat = Category::where('slug', 'work-uniforms')->first();
    $workwearPillar = $pillarMap['workwear-medical-wear'];
    $scrubProducts = Product::whereHas('categories', fn($q) => $q->where('slug', 'scrub-suit'))->get();
    echo "Found " . $scrubProducts->count() . " scrub products. Linking to medical-scrubs & workwear-medical-wear...\\n";
    foreach ($scrubProducts as $p) {
        $catIdsToSync = array_filter([$msCat?->id, $workwearPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    $safetyProducts = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['safety-wear', 'safety-suits', 'safety-coveralls', 'vests']))->get();
    echo "Found " . $safetyProducts->count() . " safety workwear products. Linking to work-uniforms & workwear-medical-wear...\\n";
    foreach ($safetyProducts as $p) {
        $catIdsToSync = array_filter([$wuCat?->id, $workwearPillar->id]);
        $p->categories()->syncWithoutDetaching($catIdsToSync);
    }

    DB::commit();
    echo "\\n=== ALL TAXONOMY & PRODUCT ASSOCIATIONS SUCCESSFULLY COMMITTED! ===\\n";

} catch (\\Exception $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\\n" . $e->getTraceAsString() . "\\n";
    exit(1);
}
`;

async function run() {
  console.log('Connecting to live server to execute taxonomy reorganization...');
  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ Connected via SSH.');

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));
  const remoteScriptPath = `${REMOTE_BACKEND}/taxonomy_migration.php`;

  await new Promise((resolve, reject) => {
    const stream = sftp.createWriteStream(remoteScriptPath);
    stream.on('close', resolve);
    stream.on('error', reject);
    stream.write(phpMigrationScript);
    stream.end();
  });
  console.log('✓ Uploaded migration script to remote server.');

  console.log('Executing taxonomy migration script in Laravel...');
  const cmd = `cd ${REMOTE_BACKEND} && php -f taxonomy_migration.php && rm -f taxonomy_migration.php && php artisan cache:clear && php artisan config:clear`;
  
  await new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error('Process exited with code ' + code));
      });
    });
  });

  conn.end();
  console.log('✓ Database taxonomy update completed!');
}

run().catch(console.error);
