const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = { host: '31.97.120.64', port: 65002, username: 'u382928869', password: 'Sheikh2024@' };
const conn = new Client();

const script = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\\Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();
$counts = \\Illuminate\\Support\\Facades\\DB::table('category_product')
  ->select('category_id', \\Illuminate\\Support\\Facades\\DB::raw('count(*) as count'))
  ->groupBy('category_id')
  ->pluck('count', 'category_id');
echo json_encode($counts);
`;

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/home/u382928869/domains/cmsportswear.pk/backend/dump_counts.php');
    writeStream.write(script);
    writeStream.end();
    writeStream.on('close', () => {
      conn.exec('php /home/u382928869/domains/cmsportswear.pk/backend/dump_counts.php && rm -f /home/u382928869/domains/cmsportswear.pk/backend/dump_counts.php', (err, stream) => {
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.on('close', () => {
          fs.writeFileSync(path.join(__dirname, 'db_category_counts.json'), out);
          console.log('Saved db_category_counts.json!');
          conn.end();
        });
      });
    });
  });
}).connect(config);
