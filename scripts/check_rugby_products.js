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
    \\$p = App\\Models\\Product::where('name', 'like', '%rugby%')->orWhereHas('categories', fn(\\$q) => \\$q->where('slug', 'like', '%rugby%'))->with('categories')->get();
    echo 'TOTAL RUGBY PRODS: ' . \\$p->count() . PHP_EOL;
    foreach (\\$p as \\$prod) {
      echo 'Product: ' . \\$prod->name . PHP_EOL;
      foreach (\\$prod->categories as \\$c) {
        echo '  Cat: ' . \\$c->name . ' (' . \\$c->slug . ') parent_id=' . (\\$c->parent_id ?? 'null') . PHP_EOL;
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
