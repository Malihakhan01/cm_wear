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
    \\$allCats = App\\Models\\Category::withCount('products')->get();
    echo 'ALL_CATS_JSON:' . json_encode(\\$allCats) . ':END_JSON';
  `;

  conn.exec(`cd /home/u382928869/domains/cmsportswear.pk/backend && php artisan tinker --execute="${tinker.replace(/\n/g, ' ')}"`, (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.on('close', () => {
      const start = out.indexOf('ALL_CATS_JSON:');
      const end = out.indexOf(':END_JSON');
      if (start !== -1 && end !== -1) {
        const jsonStr = out.substring(start + 'ALL_CATS_JSON:'.length, end);
        const cats = JSON.parse(jsonStr);
        console.log('Total categories in DB:', cats.length);
        
        // Find roots
        const roots = cats.filter(c => !c.parent_id);
        console.log('\n--- ROOT CATEGORIES IN DB (' + roots.length + ') ---');
        roots.forEach(r => {
          const children = cats.filter(c => c.parent_id === r.id);
          console.log(`[ID ${r.id}] ${r.name} (${r.slug}) => ${r.products_count} direct prods | ${children.length} children`);
        });

        // Zero count categories
        const zeroCats = cats.filter(c => c.products_count === 0);
        console.log('\n--- ZERO PRODUCT CATEGORIES IN DB (' + zeroCats.length + ') ---');
        zeroCats.forEach(z => {
          console.log(` - ID ${z.id} | ${z.name} (${z.slug}) parent_id=${z.parent_id}`);
        });
      } else {
        console.log('Could not parse JSON output:', out);
      }
      conn.end();
    });
  });
}).connect(config);
