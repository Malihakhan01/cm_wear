const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BACKEND = '/home/u382928869/domains/cmsportswear.pk/backend';

const cascadeScript = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\\Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();

use App\\Models\\Category;
use App\\Models\\Product;
use Illuminate\\Support\\Facades\\DB;

echo "=== CASCADING PRODUCT CATEGORIES TO PARENTS & GRANDPARENTS ===\\n";

// Map each category to its full ancestor IDs
$allCats = Category::all()->keyBy('id');
$ancestorMap = []; // id => array of parent/grandparent IDs

foreach ($allCats as $cat) {
    $ancestors = [];
    $curr = $cat;
    while ($curr && $curr->parent_id && isset($allCats[$curr->parent_id])) {
        $ancestors[] = $curr->parent_id;
        $curr = $allCats[$curr->parent_id];
    }
    $ancestorMap[$cat->id] = $ancestors;
}

echo "Computed ancestor chains for " . count($ancestorMap) . " categories.\\n";

// Now loop over category_product and insert missing ancestor relationships
$existingPairs = DB::table('category_product')->select('product_id', 'category_id')->get();
$pairSet = [];
foreach ($existingPairs as $p) {
    $pairSet[$p->product_id . '_' . $p->category_id] = true;
}
echo "Currently " . count($existingPairs) . " category-product links in DB.\\n";

$toInsert = [];
foreach ($existingPairs as $p) {
    $ancestors = $ancestorMap[$p->category_id] ?? [];
    foreach ($ancestors as $ancId) {
        $key = $p->product_id . '_' . $ancId;
        if (!isset($pairSet[$key])) {
            $pairSet[$key] = true;
            $toInsert[] = [
                'product_id' => $p->product_id,
                'category_id' => $ancId,
                'is_primary' => false,
            ];
        }
    }
}

echo "Found " . count($toInsert) . " ancestor links to insert.\\n";

if (!empty($toInsert)) {
    // Insert in chunks of 500
    foreach (array_chunk($toInsert, 500) as $chunk) {
        DB::table('category_product')->insert($chunk);
    }
    echo "✓ Successfully inserted all ancestor links!\\n";
}

// Special case: Cricket
$cricketCat = Category::where('slug', 'cricket')->first();
$cricketPillar = Category::where('slug', 'team-sports-wear')->first();
if ($cricketCat && $cricketPillar) {
    $cricketProds = Product::where('name', 'like', '%cricket%')->orWhere('description', 'like', '%cricket%')->get();
    foreach ($cricketProds as $p) {
        $p->categories()->syncWithoutDetaching([$cricketCat->id, $cricketPillar->id]);
    }
    echo "✓ Synced " . $cricketProds->count() . " cricket products to Cricket and Team Sports Wear!\\n";
}

// Special case: Tennis & Golf
$tgCat = Category::where('slug', 'tennis-golf')->first();
if ($tgCat && $cricketPillar) {
    $tgProds = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['golf', 'polo', 'polo-shirts', 'skirts']))->get();
    foreach ($tgProds as $p) {
        $p->categories()->syncWithoutDetaching([$tgCat->id, $cricketPillar->id]);
    }
    echo "✓ Synced " . $tgProds->count() . " tennis & golf products to Tennis & Golf and Team Sports Wear!\\n";
}

echo "\\n=== PRODUCT COUNTS FOR ALL 9 PILLARS ===\\n";
$pillars = ['team-sports-wear', 'martial-arts-combat-wear', 'activewear-fitness', 'casual-lifestyle-wear', 'jackets-outerwear', 'kids-youth-wear', 'workwear-medical-wear', 'sports-accessories', 'gloves'];
foreach ($pillars as $ps) {
    $c = Category::where('slug', $ps)->withCount('products')->first();
    if ($c) {
        echo " - [{$c->name}] ({$c->slug}) => {$c->products_count} products\\n";
    }
}
`;

async function run() {
  console.log('Connecting to live server to cascade product categories...');
  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));
  const remoteScriptPath = `${REMOTE_BACKEND}/cascade_migration.php`;

  await new Promise((resolve, reject) => {
    const stream = sftp.createWriteStream(remoteScriptPath);
    stream.on('close', resolve);
    stream.on('error', reject);
    stream.write(cascadeScript);
    stream.end();
  });

  const cmd = `cd ${REMOTE_BACKEND} && php -f cascade_migration.php && rm -f cascade_migration.php && php artisan cache:clear && php artisan config:clear`;
  
  await new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error('Process exited with code ' + code)));
    });
  });

  conn.end();
  console.log('✓ Product cascade completed!');
}

run().catch(console.error);
