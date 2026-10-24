const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const conn = new Client();
conn.on('ready', () => {
  const tinker = `
    \\$cp = App\\Models\\Product::where('name', 'like', '%cricket%')->orWhere('description', 'like', '%cricket%')->with('categories')->get();
    echo 'CRICKET PRODUCTS: ' . \\$cp->count() . PHP_EOL;
    foreach (\\$cp as \\$p) {
      echo ' - ' . \\$p->name . ' -> ' . \\$p->categories->pluck('slug')->join(', ') . PHP_EOL;
    }

    \\$tp = App\\Models\\Product::where('name', 'like', '%tennis%')->orWhere('name', 'like', '%golf%')->with('categories')->get();
    echo PHP_EOL . 'TENNIS / GOLF PRODUCTS: ' . \\$tp->count() . PHP_EOL;

    // Check all 9 pillars
    $pillars = ['team-sports-wear', 'martial-arts-combat-wear', 'activewear-fitness', 'casual-lifestyle-wear', 'jackets-outerwear', 'kids-youth-wear', 'workwear-medical-wear', 'sports-accessories', 'gloves'];
    echo PHP_EOL . '=== 9 PILLARS SUMMARY ===' . PHP_EOL;
    foreach ($pillars as $ps) {
      $c = App\\Models\\Category::where('slug', $ps)->withCount('products')->first();
      if ($c) {
        echo 'Pillar: ' . $c->name . ' (' . $c->slug . ') => ' . $c->products_count . ' direct products, ' . $c->children()->count() . ' subcategories' . PHP_EOL;
      }
    }
  `;

  conn.exec(`cd /home/u382928869/domains/cmsportswear.pk/backend && php artisan tinker --execute="${tinker.replace(/\n/g, ' ')}"`, (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect(config);
