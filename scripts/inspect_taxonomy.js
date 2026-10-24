const fs = require('fs');

const content = fs.readFileSync('scripts/sync_live_menu_taxonomy.js', 'utf8');
const start = content.indexOf('const taxonomy = [');
const end = content.indexOf('const config = {');
const taxonomyCode = content.substring(start, end);

const cleanCode = taxonomyCode.replace('const taxonomy = ', '').trim().replace(/;$/, '');
const taxonomy = eval('(' + cleanCode + ')');

console.log('Loaded taxonomy with', taxonomy.length, 'pillars.');

taxonomy.forEach(p => {
  console.log(`\n[PILLAR] ${p.name} (slug: ${p.slug})`);
  p.groups.forEach(g => {
    console.log(`  └─ [GROUP] ${g.name} (slug: ${g.slug})`);
    g.productTypes.forEach(pt => {
      console.log(`       └─ [TYPE] ${pt.name} -> slugs: [${pt.slugs.join(', ')}]`);
    });
  });
});
