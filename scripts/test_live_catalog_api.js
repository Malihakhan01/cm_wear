const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('Testing live backend API endpoints on cmsportswear.pk...\n');

  const tests = [
    { label: 'Activewear & Fitness Division', url: 'https://cmsportswear.pk/api/v1/products?category=activewear-fitness&per_page=10' },
    { label: 'Gym & Training Wear Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=gym-training-wear&per_page=10' },
    { label: 'Compression Wear Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=compression-wear&per_page=10' },
    { label: 'Rugby Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=rugby&per_page=10' },
    { label: 'Rugby Jerseys Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=rugby-jerseys&per_page=10' },
    { label: 'Rugby Shorts Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=rugby-shorts&per_page=10' },
    { label: 'Ice Hockey Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=ice-hockey&per_page=10' },
    { label: 'Soccer & Football Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=soccer-football&per_page=10' },
    { label: 'Baseball & Softball Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=baseball-softball&per_page=10' },
    { label: 'Cricket Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=cricket&per_page=10' },
    { label: 'Basketball Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=basketball&per_page=10' },
    { label: 'Volleyball Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=volleyball&per_page=10' },
    { label: 'Medical Scrubs Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=medical-scrubs&per_page=10' },
    { label: 'Work Uniforms Subcategory', url: 'https://cmsportswear.pk/api/v1/products?subcategory=work-uniforms&per_page=10' },
  ];

  for (const t of tests) {
    const res = await get(t.url);
    const count = res?.total ?? (Array.isArray(res?.data) ? res.data.length : 'error');
    console.log(`✓ ${t.label} -> total: ${count}`);
    if (res?.data && res.data[0]) {
      console.log(`   Sample product: "${res.data[0].name}" (SKU: ${res.data[0].sku})`);
    }
  }
}

runTests().catch(console.error);
