const { Client } = require('ssh2');

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
            console.log('TOTAL DB CATEGORIES:', all.length);

            const map = new Map();
            all.forEach(c => map.set(c.id, { ...c, childList: [] }));
            all.forEach(c => {
              if (c.parent_id && map.has(c.parent_id)) {
                map.get(c.parent_id).childList.push(map.get(c.id));
              }
            });

            const roots = all.filter(c => c.parent_id === null);
            console.log('\\n--- 9 MAIN PILLARS & THEIR HIERARCHY ---');
            const mainSlugs = [
              'team-sports-wear',
              'martial-arts-combat-wear',
              'activewear-fitness',
              'casual-lifestyle-wear',
              'jackets-outerwear',
              'kids-youth-wear',
              'workwear-medical-wear',
              'sports-accessories',
              'gloves'
            ];

            roots.filter(r => mainSlugs.includes(r.slug)).forEach(r => {
              const item = map.get(r.id);
              console.log(`\\n[ROOT ${r.id}] ${r.name} (${r.slug}) -> ${item.childList.length} subcategories:`);
              item.childList.forEach(sub => {
                console.log(`   ├─ [SUB ${sub.id}] ${sub.name} (${sub.slug}) -> ${sub.childList.length} product types`);
                sub.childList.forEach(pt => {
                  console.log(`   │    └─ [TYPE ${pt.id}] ${pt.name} (${pt.slug})`);
                });
              });
            });

          } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log(out.slice(0, 500));
          }
          conn.end();
        });
      });
    });
  });
}).connect(config);
