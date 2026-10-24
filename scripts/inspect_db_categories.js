const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const conn = new Client();
conn.on('ready', () => {
  const cmd = `cd /home/u382928869/domains/cmsportswear.pk/backend && php artisan tinker --execute="\\$cats = App\\Models\\Category::all(); echo json_encode(\\$cats->map(fn(\\$c) => ['id' => \\$c->id, 'name' => \\$c->name, 'slug' => \\$c->slug, 'parent_id' => \\$c->parent_id]));"`;
  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => out += d.toString());
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => {
      try {
        const list = JSON.parse(out);
        console.log(`TOTAL CATEGORIES: ${list.length}`);
        const roots = list.filter(c => c.parent_id === null);
        console.log(`ROOT CATEGORIES (${roots.length}):`);
        roots.forEach(r => console.log(` - ID ${r.id}: ${r.name} (${r.slug})`));
        const children = list.filter(c => c.parent_id !== null);
        console.log(`\nCHILD CATEGORIES (${children.length}) sample:`);
        children.slice(0, 25).forEach(c => console.log(` - ID ${c.id}: ${c.name} (${c.slug}) -> parent_id: ${c.parent_id}`));
      } catch (e) {
        console.log('RAW:', out.slice(0, 1000));
      }
      conn.end();
    });
  });
}).connect(config);
