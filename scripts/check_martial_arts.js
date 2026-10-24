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
    \\$cs = App\\Models\\Category::where('slug', 'combat-sports')->withCount('products')->first();
    \\$ma = App\\Models\\Category::where('slug', 'martial-arts')->withCount('products')->first();
    \\$bjj = App\\Models\\Category::where('slug', 'bjj-grappling')->withCount('products')->first();
    \\$mma = App\\Models\\Category::where('slug', 'mma')->withCount('products')->first();
    echo 'Combat Sports prods: ' . (\\$cs ? \\$cs->products_count : 0) . PHP_EOL;
    echo 'Martial Arts prods: ' . (\\$ma ? \\$ma->products_count : 0) . PHP_EOL;
    echo 'BJJ Grappling prods: ' . (\\$bjj ? \\$bjj->products_count : 0) . PHP_EOL;
    echo 'MMA prods: ' . (\\$mma ? \\$mma->products_count : 0) . PHP_EOL;

    // Check sample products under combat-sports and martial-arts
    \\$sample = App\\Models\\Product::whereHas('categories', fn(\\$q) => \\$q->whereIn('slug', ['combat-sports', 'martial-arts']))->take(10)->pluck('name');
    echo PHP_EOL . 'SAMPLE MARTIAL / COMBAT PRODUCTS:' . PHP_EOL;
    foreach (\\$sample as \\$n) {
      echo ' - ' . \\$n . PHP_EOL;
    }
  `;

  conn.exec(`cd /home/u382928869/domains/cmsportswear.pk/backend && php artisan tinker --execute="${tinker.replace(/\n/g, ' ')}"`, (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect(config);
