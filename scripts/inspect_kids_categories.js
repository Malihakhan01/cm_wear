const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const conn = new Client();
conn.on('ready', () => {
  const phpCode = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$kids = App\\Models\\Category::where('slug', 'kids-youth-wear')->first();
if ($kids) {
  echo "=== KIDS & YOUTH WEAR (id=" . $kids->id . ") ===" . PHP_EOL;
  foreach ($kids->children as $ch) {
    $cnt = $ch->products()->count();
    echo "Sub: " . $ch->name . " (slug: " . $ch->slug . ", id: " . $ch->id . ") => " . $cnt . " products" . PHP_EOL;
    foreach ($ch->products as $p) {
      echo "    - [id=" . $p->id . "] " . $p->name . " (cats: " . $p->categories->pluck('slug')->join(', ') . ")" . PHP_EOL;
    }
  }
} else {
  echo "kids-youth-wear not found" . PHP_EOL;
}
`;

  conn.exec(`cat << 'EOF' > /home/u382928869/domains/cmsportswear.pk/backend/check_kids.php\n${phpCode}\nEOF\nphp /home/u382928869/domains/cmsportswear.pk/backend/check_kids.php\nrm -f /home/u382928869/domains/cmsportswear.pk/backend/check_kids.php`, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect(config);
