const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BACKEND = '/home/u382928869/domains/cmsportswear.pk/backend';

const phpScript = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\\Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();

use App\\Models\\Category;
use App\\Models\\Product;
use Illuminate\\Support\\Facades\\DB;

echo "=== ADJUSTING EXTRA CATEGORIES & PRODUCT ASSOCIATIONS ===\\n";

$bjj = Category::where('slug', 'bjj-grappling')->first();
$mma = Category::where('slug', 'mma')->first();
$boxing = Category::where('slug', 'boxing-muay-thai')->first();
$karate = Category::where('slug', 'karate')->first();
$judo = Category::where('slug', 'judo')->first();
$taekwondo = Category::where('slug', 'taekwondo')->first();
$wrestling = Category::where('slug', 'wrestling')->first();
$martialPillar = Category::where('slug', 'martial-arts-combat-wear')->first();

// 1. Sync BJJ & Grappling products
$bjjProds = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['jiu-jitsu', 'martial-arts', 'combat-training-wear', 'combat-teamwear']))->get();
echo "Found " . $bjjProds->count() . " products for BJJ & Grappling. Linking...\\n";
foreach ($bjjProds as $p) {
    $p->categories()->syncWithoutDetaching([$bjj->id, $martialPillar->id]);
}

// 2. Sync MMA products
$mmaProds = Product::whereHas('categories', fn($q) => $q->whereIn('slug', ['combat-sports', 'full-contact', 'kick-boxing']))->get();
echo "Found " . $mmaProds->count() . " products for MMA. Linking...\\n";
foreach ($mmaProds as $p) {
    $p->categories()->syncWithoutDetaching([$mma->id, $martialPillar->id]);
}

// 3. Mark extra legacy categories as Level 3 children so they don't sit as top-level subcategories
// Move 'combat-sports' and 'martial-arts' as Level 3 under bjj-grappling and mma
$cs = Category::where('slug', 'combat-sports')->first();
if ($cs && $mma) {
    $cs->parent_id = $mma->id;
    $cs->save();
}
$ma = Category::where('slug', 'martial-arts')->first();
if ($ma && $bjj) {
    $ma->parent_id = $bjj->id;
    $ma->save();
}

// 4. Ensure all legacy sport roots (sportswear, sportwear, sports-wears, sports-wear) are children of team-sports-wear
$teamSportsPillar = Category::where('slug', 'team-sports-wear')->first();
foreach (['sportswear', 'sportwear', 'sports-wears', 'sports-wear'] as $sl) {
    $c = Category::where('slug', $sl)->first();
    if ($c && $teamSportsPillar) {
        $c->parent_id = $teamSportsPillar->id;
        $c->save();
    }
}

// 5. Ensure all soccer child categories are under soccer-football
$socParent = Category::where('slug', 'soccer-football')->first();
if ($socParent) {
    foreach (['soccer-team-kits', 'soccer-uniforms', 'soccerfootball', 'soccer-shorts', 'soccer-sets', 'custom-soccer-jerseys', 'goalkeeper-jerseys', 'goalkeeper-wear'] as $sl) {
        $c = Category::where('slug', $sl)->first();
        if ($c) {
            $c->parent_id = $socParent->id;
            $c->save();
        }
    }
}

// 6. Ensure all hockey child categories are under ice-hockey
$ihParent = Category::where('slug', 'ice-hockey')->first();
if ($ihParent) {
    foreach (['ice-hockey-clothing', 'ice-hockey-uniforms', 'sublimated-game-jerseys', 'tackle-twill-embroidered-jerseys', 'practice-jerseys', 'coach-jackets', 'hockey-pant-shells'] as $sl) {
        $c = Category::where('slug', $sl)->first();
        if ($c) {
            $c->parent_id = $ihParent->id;
            $c->save();
        }
    }
}

// 7. Ensure all baseball child categories are under baseball-softball
$bbParent = Category::where('slug', 'baseball-softball')->first();
if ($bbParent) {
    foreach (['baseball', 'baseball-jeresy', 'baseball-pants', 'baseball-hoodies', 'baseball-gear', 'baseball-uniform', 'baseball-equipment-set'] as $sl) {
        $c = Category::where('slug', $sl)->first();
        if ($c) {
            $c->parent_id = $bbParent->id;
            $c->save();
        }
    }
}

// 8. Ensure all volleyball child categories are under volleyball
$vbParent = Category::where('slug', 'volleyball')->first();
if ($vbParent) {
    foreach (['volleyball-jersey', 'volleyball-shorts', 'volleyball-training-wear', 'volleyball-accessories', 'volleyball-shorts-spandex'] as $sl) {
        $c = Category::where('slug', $sl)->first();
        if ($c) {
            $c->parent_id = $vbParent->id;
            $c->save();
        }
    }
}

echo "\\n=== VERIFYING COUNTS IN MARTIAL ARTS & COMBAT WEAR ===\\n";
$subs = Category::where('parent_id', $martialPillar->id)->withCount('products')->get();
foreach ($subs as $s) {
    echo " - [{$s->name}] ({$s->slug}) => {$s->products_count} products\\n";
}

echo "\\n=== VERIFYING COUNTS IN TEAM SPORTS WEAR ===\\n";
$teamSubs = Category::where('parent_id', $teamSportsPillar->id)->withCount('products')->get();
foreach ($teamSubs as $s) {
    echo " - [{$s->name}] ({$s->slug}) => {$s->products_count} products\\n";
}
`;

async function run() {
  console.log('Connecting to live server to adjust extras and sync products...');
  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));
  const remotePath = `${REMOTE_BACKEND}/adjust_extras.php`;

  await new Promise((resolve, reject) => {
    const stream = sftp.createWriteStream(remotePath);
    stream.on('close', resolve);
    stream.on('error', reject);
    stream.write(phpScript);
    stream.end();
  });

  const cmd = `cd ${REMOTE_BACKEND} && php -f adjust_extras.php && rm -f adjust_extras.php && php artisan cache:clear && php artisan config:clear`;
  
  await new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error('Process exited with code ' + code)));
    });
  });

  conn.end();
  console.log('✓ Extras adjusted and synced successfully!');
}

run().catch(console.error);
