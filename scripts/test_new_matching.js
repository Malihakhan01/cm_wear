const https = require('https');

async function run() {
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

  const allProducts = [...p1, ...p2].map(p => ({
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.categories && p.categories[0] ? p.categories[0].slug : '',
    rawCategories: (p.categories || []).map(c => ({
      id: String(c.id),
      name: c.name,
      slug: c.slug,
      parentId: c.parent_id ? String(c.parent_id) : null
    }))
  }));

  const kidsParent = catRes.find(c => c.slug === 'kids-youth-wear');
  const parentCat = {
    id: String(kidsParent.id),
    slug: kidsParent.slug,
    name: kidsParent.name,
    subcategories: kidsParent.children.map(ch => ({
      id: String(ch.id),
      slug: ch.slug,
      name: ch.name
    }))
  };

  function isProductInParentCategory(p, parentCat) {
    const normActive = parentCat.slug.toLowerCase().replace(/[-_\s&]/g, '');
    const parentIdStr = String(parentCat.id || '');

    if (p.rawCategories && p.rawCategories.length > 0) {
      const rawMatch = p.rawCategories.some(rc => {
        const rcSlug = (rc.slug || '').toLowerCase().replace(/[-_\s&]/g, '');
        const rcName = (rc.name || '').toLowerCase().replace(/[-_\s&]/g, '');
        const rcId = String(rc.id || '');
        const rcParentId = String(rc.parentId || '');

        if (rcSlug === normActive || rcName === normActive || rcId === parentIdStr) return true;
        if (rcParentId && rcParentId === parentIdStr) return true;

        if (parentCat.subcategories && parentCat.subcategories.length > 0) {
          return parentCat.subcategories.some(sub => {
            const sSlug = (sub.slug || '').toLowerCase().replace(/[-_\s&]/g, '');
            const sName = (sub.name || '').toLowerCase().replace(/[-_\s&]/g, '');
            const sId = String(sub.id || '');
            return rcSlug === sSlug || rcName === sName || rcId === sId || rcParentId === sId;
          });
        }
        return false;
      });
      if (rawMatch) return true;
    }

    const prodCatNorm = (p.category || '').toLowerCase().replace(/[-_\s&]/g, '');
    if (prodCatNorm === normActive || p.category === parentCat.slug || String(p.category) === parentIdStr) {
      return true;
    }
    return false;
  }

  function isProductInSubcategory(p, subTarget, parentCat) {
    if (!subTarget || subTarget === 'all') return true;
    const targetNorm = subTarget.toLowerCase().replace(/[-_\s&]/g, '');

    if (p.rawCategories && p.rawCategories.length > 0) {
      const directMatch = p.rawCategories.some(rc => {
        const rcSlug = (rc.slug || '').toLowerCase().replace(/[-_\s&]/g, '');
        const rcName = (rc.name || '').toLowerCase().replace(/[-_\s&]/g, '');
        const rcId = String(rc.id || '');

        if (rcSlug === targetNorm || rcName === targetNorm || rcId === subTarget) return true;

        if (parentCat && parentCat.subcategories) {
          const matchingSub = parentCat.subcategories.find(
            s => s.slug === subTarget || s.id === subTarget || (s.slug || '').toLowerCase().replace(/[-_\s&]/g, '') === targetNorm || (s.name || '').toLowerCase().replace(/[-_\s&]/g, '') === targetNorm
          );
          if (matchingSub) {
            const subId = String(matchingSub.id || '');
            if (subId && rc.parentId && String(rc.parentId) === subId) return true;
          }
        }
        return false;
      });
      if (directMatch) return true;
    }

    const pSubNorm = (p.subcategory || '').toLowerCase().replace(/[-_\s&]/g, '');
    const pCatNorm = (p.category || '').toLowerCase().replace(/[-_\s&]/g, '');
    return pSubNorm === targetNorm || pCatNorm === targetNorm;
  }

  const validRoots = catRes.filter(r => r.children && r.children.length > 0);
  validRoots.forEach(root => {
    const parentCat = {
      id: String(root.id),
      slug: root.slug,
      name: root.name,
      subcategories: root.children.map(ch => ({
        id: String(ch.id),
        slug: ch.slug,
        name: ch.name
      }))
    };

    const inParent = allProducts.filter(p => isProductInParentCategory(p, parentCat));
    console.log(`\n=== ${parentCat.name} (${parentCat.slug}) => Total in parent: ${inParent.length} ===`);
    parentCat.subcategories.forEach(sub => {
      const inSub = inParent.filter(p => isProductInSubcategory(p, sub.slug, parentCat));
      console.log(`   ${sub.name.padEnd(30)} [${sub.slug.padEnd(25)}] => ${String(inSub.length).padStart(3)} products`);
    });
  });
}
run();
