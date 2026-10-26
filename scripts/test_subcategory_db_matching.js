const https = require('https');

async function main() {
  const [p1, p2, catRes] = await Promise.all([
    new Promise(res => https.get('https://cmsportswear.pk/api/v1/products?per_page=1000&page=1', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d).data || []));
    })),
    new Promise(res => https.get('https://cmsportswear.pk/api/v1/products?per_page=1000&page=2', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d).data || []));
    })),
    new Promise(res => https.get('https://cmsportswear.pk/api/v1/categories', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d).data || []));
    }))
  ]);

  const allProducts = [...p1, ...p2];
  console.log(`Loaded ${allProducts.length} products, ${catRes.length} root categories.`);

  catRes.forEach(root => {
    if (!root.children || root.children.length === 0) return;
    console.log(`\n========================================`);
    console.log(`ROOT: ${root.name} (${root.slug}, id=${root.id})`);
    console.log(`========================================`);

    root.children.forEach(sub => {
      // Find products that match this subcategory
      const matching = allProducts.filter(p => {
        const rawCats = p.categories || [];
        return rawCats.some(rc => {
          if (rc.id === sub.id) return true;
          if (rc.slug === sub.slug) return true;
          const rcNorm = (rc.slug || '').toLowerCase().replace(/[-_\s&]/g, '');
          const subNorm = (sub.slug || '').toLowerCase().replace(/[-_\s&]/g, '');
          if (rcNorm === subNorm) return true;
          // check if rc is child of sub in DB
          if (rc.parent_id === sub.id) return true;
          return false;
        });
      });
      console.log(`   ${sub.name.padEnd(30)} [${sub.slug.padEnd(25)}] => ${String(matching.length).padStart(3)} products`);
    });
  });
}

main().catch(console.error);
