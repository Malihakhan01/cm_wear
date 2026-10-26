const fs = require('fs');
const path = require('path');

const dbCats = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_categories_dump.json'), 'utf8'));

// Exact client document taxonomy
const TAXONOMY = [
  {
    pillar: "Team Sports Wear",
    pillarSlug: "team-sports-wear",
    subcategories: [
      { name: "Ice Hockey", slug: "ice-hockey", productTypes: ["Game Jerseys", "Practice Jerseys", "Hockey Socks", "Shell Pants"] },
      { name: "Soccer & Football", slug: "soccer-football", productTypes: ["Team Kits", "Jerseys", "Shorts", "Training Tops", "Goalkeeper Uniforms"] },
      { name: "American Football", slug: "american-football", productTypes: ["Game Jerseys", "Practice Jerseys", "Football Pants", "Compression Tops"] },
      { name: "Basketball", slug: "basketball", productTypes: ["Jerseys", "Shorts", "Complete Uniforms", "Reversible Bibs", "Warm-Up Suits"] },
      { name: "Baseball & Softball", slug: "baseball-softball", productTypes: ["Button-Up Jerseys", "Pullover Jerseys", "Pants", "Training Shirts"] },
      { name: "Cricket", slug: "cricket", productTypes: ["Match Shirts", "T20 Jerseys", "Trousers", "Training Kits"] },
      { name: "Rugby", slug: "rugby", productTypes: ["Match Jerseys", "Shorts", "Training Tops", "Team Kits"] },
      { name: "Lacrosse", slug: "lacrosse", productTypes: ["Game Jerseys", "Shorts", "Practice Pinnies", "Team Kits"] },
      { name: "Volleyball", slug: "volleyball", productTypes: ["Jerseys", "Shorts", "Team Kits", "Training Tops"] },
      { name: "Tennis & Golf", slug: "tennis-golf", productTypes: ["Polo Shirts", "Performance Tops", "Shorts", "Skirts", "Skorts"] },
    ]
  },
  {
    pillar: "Martial Arts & Combat Wear",
    pillarSlug: "martial-arts-combat-wear",
    subcategories: [
      { name: "BJJ & Grappling", slug: "bjj-grappling", productTypes: ["BJJ Gis", "Rash Guards", "Grappling Shorts", "Spats"] },
      { name: "MMA", slug: "mma", productTypes: ["Fight Shorts", "Rash Guards", "Compression Shorts", "Training Shirts"] },
      { name: "Boxing & Muay Thai", slug: "boxing-muay-thai", productTypes: ["Boxing Shorts", "Muay Thai Shorts", "Boxing Singlets", "Training Tracksuits"] },
      { name: "Karate", slug: "karate", productTypes: ["Training Gis", "Competition Gis", "Belts"] },
      { name: "Judo", slug: "judo", productTypes: ["Training Gis", "Competition Gis", "Belts"] },
      { name: "Taekwondo", slug: "taekwondo", productTypes: ["Training Doboks", "Competition Doboks", "Belts"] },
      { name: "Wrestling", slug: "wrestling", productTypes: ["Singlets", "Compression Tops", "Training Shorts"] },
    ]
  },
  {
    pillar: "Activewear & Fitness",
    pillarSlug: "activewear-fitness",
    subcategories: [
      { name: "Gym & Training Wear", slug: "gym-training-wear", productTypes: ["Gym T-Shirts", "Tank Tops", "Stringers", "Training Shorts", "Joggers"] },
      { name: "Compression Wear", slug: "compression-wear", productTypes: ["Short-Sleeve Tops", "Long-Sleeve Tops", "Compression Shorts", "Full-Length Tights"] },
      { name: "Women’s Activewear", slug: "womens-activewear", productTypes: ["Sports Bras", "Leggings", "Workout Shorts", "Tank Tops", "Matching Sets"] },
      { name: "Running & Athletics", slug: "running-athletics", productTypes: ["Running Singlets", "Performance Shirts", "Running Shorts", "Track Uniforms"] },
      { name: "Cycling Wear", slug: "cycling-wear", productTypes: ["Cycling Jerseys", "Cycling Shorts", "Bib Shorts", "Cycling Jackets"] },
    ]
  },
  {
    pillar: "Casual & Lifestyle Wear",
    pillarSlug: "casual-lifestyle-wear",
    subcategories: [
      { name: "T-Shirts & Tops", slug: "t-shirts-tops", productTypes: ["Crew-Neck T-Shirts", "V-Neck T-Shirts", "Oversized T-Shirts", "Polo Shirts"] },
      { name: "Hoodies & Sweatshirts", slug: "hoodies-sweatshirts", productTypes: ["Pullover Hoodies", "Zip-Up Hoodies", "Oversized Hoodies", "Crew-Neck Sweatshirts"] },
      { name: "Tracksuits & Matching Sets", slug: "tracksuits-sets", productTypes: ["Training Tracksuits", "Sweat Suits", "Hoodie & Jogger Sets", "Sweatshirt & Shorts Sets"] },
      { name: "Pants & Bottoms", slug: "pants-bottoms", productTypes: ["Joggers", "Sweatpants", "Track Pants", "Casual Shorts", "Cargo Pants"] },
    ]
  },
  {
    pillar: "Jackets & Outerwear",
    pillarSlug: "jackets-outerwear",
    subcategories: [
      { name: "Varsity Jackets", slug: "varsity-jackets", productTypes: ["Wool Varsity Jackets", "Fleece Varsity Jackets", "Leather-Sleeve Varsity Jackets"] },
      { name: "Leather Jackets", slug: "leather-jackets", productTypes: ["Biker Jackets", "Bomber Jackets", "Casual Leather Jackets"] },
      { name: "Softshell Jackets", slug: "softshell-jackets", productTypes: ["Full-Zip Softshell Jackets", "Hooded Softshell Jackets"] },
      { name: "Windbreakers", slug: "windbreakers", productTypes: ["Hooded Windbreakers", "Full-Zip Windbreakers", "Pullover Windbreakers"] },
      { name: "Winter Wear", slug: "winter-wear", productTypes: ["Puffer Jackets", "Fleece Jackets", "Thermal Tops", "Thermal Bottoms"] },
      { name: "Rainwear", slug: "rainwear", productTypes: ["Rain Jackets", "Waterproof Pants", "Rain Suits", "Lightweight Rain Shells"] },
    ]
  },
  {
    pillar: "Kids & Youth Wear",
    pillarSlug: "kids-youth-wear",
    subcategories: [
      { name: "Youth Team Uniforms", slug: "youth-team-uniforms", productTypes: ["Hockey Uniforms", "Soccer Kits", "Basketball Uniforms", "Baseball Uniforms"] },
      { name: "Kids’ Activewear", slug: "kids-activewear", productTypes: ["Training Shirts", "Training Shorts", "Leggings", "Joggers"] },
      { name: "Kids’ T-Shirts", slug: "kids-t-shirts", productTypes: ["Crew-Neck T-Shirts", "Polo Shirts", "Printed T-Shirts"] },
      { name: "Kids’ Hoodies", slug: "kids-hoodies", productTypes: ["Pullover Hoodies", "Zip-Up Hoodies", "Sweatshirts"] },
      { name: "Kids’ Tracksuits", slug: "kids-tracksuits", productTypes: ["Training Tracksuits", "Hoodie & Jogger Sets", "Sweat Suits"] },
    ]
  },
  {
    pillar: "Workwear & Medical Wear",
    pillarSlug: "workwear-medical-wear",
    subcategories: [
      { name: "Medical Scrubs", slug: "medical-scrubs", productTypes: ["Scrub Tops", "Scrub Pants", "Complete Scrub Sets"] },
      { name: "Work Uniforms", slug: "work-uniforms", productTypes: ["Work Shirts", "Work Trousers", "Work Jackets"] },
      { name: "Work Polo Shirts", slug: "work-polo-shirts", productTypes: ["Short-Sleeve Polos", "Long-Sleeve Polos", "Embroidered Logo Polos"] },
    ]
  },
  {
    pillar: "Sports Accessories",
    pillarSlug: "sports-accessories",
    subcategories: [
      { name: "Team Socks", slug: "team-socks", productTypes: ["Hockey Socks", "Soccer Socks", "Training Socks"] },
      { name: "Training Bibs", slug: "training-bibs", productTypes: ["Single-Layer Bibs", "Reversible Bibs", "Mesh Bibs"] },
      { name: "Caps", slug: "caps", productTypes: ["Baseball Caps", "Trucker Caps", "Sports Visors"] },
      { name: "Headbands", slug: "headbands", productTypes: ["Sports Headbands", "Running Headbands", "Winter Headbands"] },
      { name: "Wristbands", slug: "wristbands", productTypes: ["Sweatbands", "Embroidered Wristbands", "Printed Wristbands"] },
    ]
  },
  {
    pillar: "Gloves",
    pillarSlug: "gloves",
    subcategories: [
      { name: "Ice Hockey Gloves", slug: "ice-hockey-gloves", productTypes: ["Youth Hockey Gloves", "Senior Hockey Gloves", "Practice Hockey Gloves"] },
      { name: "Goalkeeper Gloves", slug: "goalkeeper-gloves", productTypes: ["Training Gloves", "Match Gloves", "Finger-Protection Gloves"] },
      { name: "Cricket Batting Gloves", slug: "cricket-batting-gloves", productTypes: ["Youth Batting Gloves", "Adult Batting Gloves", "Training Batting Gloves"] },
      { name: "Baseball Batting Gloves", slug: "baseball-batting-gloves", productTypes: ["Youth Batting Gloves", "Adult Batting Gloves"] },
      { name: "Boxing Gloves", slug: "boxing-gloves", productTypes: ["Training Gloves", "Sparring Gloves", "Bag Gloves"] },
      { name: "MMA Gloves", slug: "mma-gloves", productTypes: ["Competition Gloves", "Sparring Gloves", "Training Gloves"] },
      { name: "Gym & Weightlifting Gloves", slug: "gym-weightlifting-gloves", productTypes: ["Fingerless Gym Gloves", "Full-Finger Gym Gloves", "Wrist-Support Gloves"] },
      { name: "Cycling Gloves", slug: "cycling-gloves", productTypes: ["Short-Finger Cycling Gloves", "Full-Finger Cycling Gloves", "Winter Cycling Gloves"] },
      { name: "Winter Gloves", slug: "winter-gloves", productTypes: ["Fleece Gloves", "Insulated Gloves", "Touchscreen Gloves"] },
      { name: "Work Gloves", slug: "work-gloves", productTypes: ["General Work Gloves", "Leather Work Gloves", "Grip Gloves"] },
    ]
  }
];

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const existingSlugs = new Set(dbCats.map(c => c.slug));

// Build list of all items with desired unique slug and parent
const plan = [];

TAXONOMY.forEach((pillar) => {
  const pInDb = dbCats.find(c => c.slug === pillar.pillarSlug || norm(c.name) === norm(pillar.pillar));
  if (!pInDb) {
    console.error(`Pillar not found in DB: ${pillar.pillar}`);
    return;
  }

  pillar.subcategories.forEach((sub) => {
    let subInDb = dbCats.find(c => c.parent_id === pInDb.id && (norm(c.name) === norm(sub.name) || norm(c.slug) === norm(sub.slug)));
    if (!subInDb) {
      subInDb = dbCats.find(c => norm(c.name) === norm(sub.name) || norm(c.slug) === norm(sub.slug));
    }
    if (!subInDb) {
      console.error(`Subcategory not found: ${sub.name} under ${pillar.pillar}`);
      return;
    }

    sub.productTypes.forEach((ptName, idx) => {
      // Check if already exists under this exact subcategory
      const exactInDb = dbCats.find(c => c.parent_id === subInDb.id && (norm(c.name) === norm(ptName) || norm(c.slug) === norm(ptName)));

      if (exactInDb) {
        plan.push({
          pillar: pillar.pillar,
          subName: sub.name,
          subId: subInDb.id,
          name: ptName,
          slug: exactInDb.slug,
          action: 'exists',
          id: exactInDb.id,
          sort_order: idx + 1
        });
        return;
      }

      // Propose clean slug: e.g. "ice-hockey-game-jerseys" or "soccer-jerseys"
      let candidateSlug = `${slugify(sub.slug)}-${slugify(ptName)}`;
      if (candidateSlug.startsWith(`${slugify(sub.slug)}-${slugify(sub.slug)}-`)) {
        candidateSlug = candidateSlug.replace(`${slugify(sub.slug)}-${slugify(sub.slug)}-`, `${slugify(sub.slug)}-`);
      }

      // Check if a simpler slug is free (e.g. if ptName already contains sub name)
      const simpleSlug = slugify(ptName);
      if (!existingSlugs.has(simpleSlug) && simpleSlug.length > 5 && (simpleSlug.includes(slugify(sub.slug)) || simpleSlug.includes(slugify(pillar.pillarSlug)))) {
        candidateSlug = simpleSlug;
      }

      let finalSlug = candidateSlug;
      let counter = 1;
      while (existingSlugs.has(finalSlug)) {
        finalSlug = `${candidateSlug}-${counter}`;
        counter++;
      }
      existingSlugs.add(finalSlug);

      plan.push({
        pillar: pillar.pillar,
        subName: sub.name,
        subId: subInDb.id,
        name: ptName,
        slug: finalSlug,
        action: 'create',
        sort_order: idx + 1
      });
    });
  });
});

console.log(`Plan generated: Total items = ${plan.length}`);
const toCreate = plan.filter(p => p.action === 'create');
const existing = plan.filter(p => p.action === 'exists');
console.log(`Existing: ${existing.length}, To Create: ${toCreate.length}`);

fs.writeFileSync(path.join(__dirname, 'taxonomy_creation_plan.json'), JSON.stringify(plan, null, 2));

// Generate PHP seeder script to run on live server
let php = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\\Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();

use App\\Models\\Category;
use Illuminate\\Support\\Facades\\DB;

echo "Starting product types taxonomy sync...\\n";

$jsonStr = <<<'JSON'
` + JSON.stringify(toCreate) + `
JSON;

$plan = json_decode($jsonStr, true);

$created = 0;
$skipped = 0;

DB::beginTransaction();
try {
    foreach ($plan as $item) {
        $subId = $item['subId'];
        $name = $item['name'];
        $slug = $item['slug'];
        $sortOrder = $item['sort_order'];

        // Double check if exists under this subId
        $exists = Category::where('parent_id', $subId)
            ->where(function($q) use ($name, $slug) {
                $q->where('name', $name)->orWhere('slug', $slug);
            })->first();

        if ($exists) {
            echo "Already exists: [{$exists->id}] {$exists->name} under subId {$subId}\\n";
            $skipped++;
            continue;
        }

        // Ensure unique slug
        $baseSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $cat = Category::create([
            'name' => $name,
            'slug' => $slug,
            'parent_id' => $subId,
            'sort_order' => $sortOrder,
            'is_active' => true,
            'description' => "{$name} under {$item['subName']} - {$item['pillar']} technical export production.",
        ]);

        echo "Created: [{$cat->id}] {$cat->name} ({$cat->slug}) under parent {$subId}\\n";
        $created++;
    }

    DB::commit();
    echo "\\nSUCCESS: Created {$created} categories, skipped {$skipped}.\\n";
} catch (\\Exception $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\\n";
}
`;

fs.writeFileSync(path.join(__dirname, 'run_sync_product_types.php'), php);
console.log('Saved run_sync_product_types.php');
