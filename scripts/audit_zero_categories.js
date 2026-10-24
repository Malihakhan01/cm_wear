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
    \\$totalProds = App\\Models\\Product::count();
    \\$publishedProds = App\\Models\\Product::where('status', 'published')->count();
    echo 'TOTAL_PRODUCTS: ' . \\$totalProds . ', PUBLISHED: ' . \\$publishedProds . PHP_EOL;

    \\$zeroCats = App\\Models\\Category::doesntHave('products')->get(['id', 'name', 'slug', 'parent_id']);
    echo 'ZERO_COUNT_CATEGORIES (' . \\$zeroCats->count() . '):' . PHP_EOL;
    foreach (\\$zeroCats as \\$zc) {
      echo ' - ID ' . \\$zc->id . ' | ' . \\$zc->name . ' (' . \\$zc->slug . ') parent_id=' . (\\$zc->parent_id ?? 'null') . PHP_EOL;
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
