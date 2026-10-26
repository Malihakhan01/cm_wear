const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const phpCode = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$subs = App\\Models\\Category::whereIn('id', [298, 23, 300, 301, 39, 81, 266, 302, 46, 299])->get();
foreach ($subs as $s) {
  echo $s->name . ' (' . $s->slug . ', id=' . $s->id . ') children: ' . $s->children()->count() . PHP_EOL;
  foreach ($s->children as $c) {
    echo '   -> ' . $c->name . ' (' . $c->slug . ', id=' . $c->id . ') count=' . $c->products()->count() . PHP_EOL;
  }
}
`;
  conn.exec(`cat << 'EOF' > /home/u382928869/domains/cmsportswear.pk/backend/check_subs.php\n${phpCode}\nEOF\nphp /home/u382928869/domains/cmsportswear.pk/backend/check_subs.php\nrm -f /home/u382928869/domains/cmsportswear.pk/backend/check_subs.php`, (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
}).connect({ host: '31.97.120.64', port: 65002, username: 'u382928869', password: 'Sheikh2024@' });
