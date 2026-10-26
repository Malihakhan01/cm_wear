const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const phpCode = `<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\\Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();

$cats = \\App\\Models\\Category::select('id', 'name', 'slug', 'parent_id')->get();
echo json_encode($cats);
`;

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const remotePath = '/home/u382928869/domains/cmsportswear.pk/backend/dump_cats.php';
    const writeStream = sftp.createWriteStream(remotePath);
    writeStream.write(phpCode);
    writeStream.end();
    writeStream.on('close', () => {
      conn.exec('php /home/u382928869/domains/cmsportswear.pk/backend/dump_cats.php && rm -f /home/u382928869/domains/cmsportswear.pk/backend/dump_cats.php', (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => {
          try {
            const all = JSON.parse(out);
            fs.writeFileSync(path.join(__dirname, 'db_categories_dump.json'), JSON.stringify(all, null, 2));
            console.log(`Saved ${all.length} categories to db_categories_dump.json`);
          } catch (e) {
            console.error('Error parsing JSON:', e.message);
          }
          conn.end();
        });
      });
    });
  });
}).connect(config);
