const fs = require('fs');
const path = require('path');

const dbCats = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_categories_dump.json'), 'utf8'));

const CLIENT_DOCUMENT = [
  {
    pillar: "Team Sports Wear",
    pillarSlug: "team-sports-wear",
    subcategories: [
      { name: "Ice Hockey", productTypes: ["Game Jerseys", "Practice Jerseys", "Hockey Socks", "Shell Pants"] },
      { name: "Soccer & Football", productTypes: ["Team Kits", "Jerseys", "Shorts", "Training Tops", "Goalkeeper Uniforms"] },
      { name: "American Football", productTypes: ["Game Jerseys", "Practice Jerseys", "Football Pants", "Compression Tops"] },
      { name: "Basketball", productTypes: ["Jerseys", "Shorts", "Complete Uniforms", "Reversible Bibs", "Warm-Up Suits"] },
      { name: "Baseball & Softball", productTypes: ["Button-Up Jerseys", "Pullover Jerseys", "Pants", "Training Shirts"] },
      { name: "Cricket", productTypes: ["Match Shirts", "T20 Jerseys", "Trousers", "Training Kits"] },
      { name: "Rugby", productTypes: ["Match Jerseys", "Shorts", "Training Tops", "Team Kits"] },
      { name: "Lacrosse", productTypes: ["Game Jerseys", "Shorts", "Practice Pinnies", "Team Kits"] },
      { name: "Volleyball", productTypes: ["Jerseys", "Shorts", "Team Kits", "Training Tops"] },
      { name: "Tennis & Golf", productTypes: ["Polo Shirts", "Performance Tops", "Shorts", "Skirts", "Skorts"] },
    ]
  },
  {
    pillar: "Martial Arts & Combat Wear",
    pillarSlug: "martial-arts-combat-wear",
    subcategories: [
      { name: "BJJ & Grappling", productTypes: ["BJJ Gis", "Rash Guards", "Grappling Shorts", "Spats"] },
      { name: "MMA", productTypes: ["Fight Shorts", "Rash Guards", "Compression Shorts", "Training Shirts"] },
      { name: "Boxing & Muay Thai", productTypes: ["Boxing Shorts", "Muay Thai Shorts", "Boxing Singlets", "Training Tracksuits"] },
      { name: "Karate", productTypes: ["Training Gis", "Competition Gis", "Belts"] },
      { name: "Judo", productTypes: ["Training Gis", "Competition Gis", "Belts"] },
      { name: "Taekwondo", productTypes: ["Training Doboks", "Competition Doboks", "Belts"] },
      { name: "Wrestling", productTypes: ["Singlets", "Compression Tops", "Training Shorts"] },
    ]
  },
  {
    pillar: "Activewear & Fitness",
    pillarSlug: "activewear-fitness",
    subcategories: [
      { name: "Gym & Training Wear", productTypes: ["Gym T-Shirts", "Tank Tops", "Stringers", "Training Shorts", "Joggers"] },
      { name: "Compression Wear", productTypes: ["Short-Sleeve Tops", "Long-Sleeve Tops", "Compression Shorts", "Full-Length Tights"] },
      { name: "Women’s Activewear", productTypes: ["Sports Bras", "Leggings", "Workout Shorts", "Tank Tops", "Matching Sets"] },
      { name: "Running & Athletics", productTypes: ["Running Singlets", "Performance Shirts", "Running Shorts", "Track Uniforms"] },
      { name: "Cycling Wear", productTypes: ["Cycling Jerseys", "Cycling Shorts", "Bib Shorts", "Cycling Jackets"] },
    ]
  },
  {
    pillar: "Casual & Lifestyle Wear",
    pillarSlug: "casual-lifestyle-wear",
    subcategories: [
      { name: "T-Shirts & Tops", productTypes: ["Crew-Neck T-Shirts", "V-Neck T-Shirts", "Oversized T-Shirts", "Polo Shirts"] },
      { name: "Hoodies & Sweatshirts", productTypes: ["Pullover Hoodies", "Zip-Up Hoodies", "Oversized Hoodies", "Crew-Neck Sweatshirts"] },
      { name: "Tracksuits & Matching Sets", productTypes: ["Training Tracksuits", "Sweat Suits", "Hoodie & Jogger Sets", "Sweatshirt & Shorts Sets"] },
      { name: "Pants & Bottoms", productTypes: ["Joggers", "Sweatpants", "Track Pants", "Casual Shorts", "Cargo Pants"] },
    ]
  },
  {
    pillar: "Jackets & Outerwear",
    pillarSlug: "jackets-outerwear",
    subcategories: [
      { name: "Varsity Jackets", productTypes: ["Wool Varsity Jackets", "Fleece Varsity Jackets", "Leather-Sleeve Varsity Jackets"] },
      { name: "Leather Jackets", productTypes: ["Biker Jackets", "Bomber Jackets", "Casual Leather Jackets"] },
      { name: "Softshell Jackets", productTypes: ["Full-Zip Softshell Jackets", "Hooded Softshell Jackets"] },
      { name: "Windbreakers", productTypes: ["Hooded Windbreakers", "Full-Zip Windbreakers", "Pullover Windbreakers"] },
      { name: "Winter Wear", productTypes: ["Puffer Jackets", "Fleece Jackets", "Thermal Tops", "Thermal Bottoms"] },
      { name: "Rainwear", productTypes: ["Rain Jackets", "Waterproof Pants", "Rain Suits", "Lightweight Rain Shells"] },
    ]
  },
  {
    pillar: "Kids & Youth Wear",
    pillarSlug: "kids-youth-wear",
    subcategories: [
      { name: "Youth Team Uniforms", productTypes: ["Hockey Uniforms", "Soccer Kits", "Basketball Uniforms", "Baseball Uniforms"] },
      { name: "Kids’ Activewear", productTypes: ["Training Shirts", "Training Shorts", "Leggings", "Joggers"] },
      { name: "Kids’ T-Shirts", productTypes: ["Crew-Neck T-Shirts", "Polo Shirts", "Printed T-Shirts"] },
      { name: "Kids’ Hoodies", productTypes: ["Pullover Hoodies", "Zip-Up Hoodies", "Sweatshirts"] },
      { name: "Kids’ Tracksuits", productTypes: ["Training Tracksuits", "Hoodie & Jogger Sets", "Sweat Suits"] },
    ]
  },
  {
    pillar: "Workwear & Medical Wear",
    pillarSlug: "workwear-medical-wear",
    subcategories: [
      { name: "Medical Scrubs", productTypes: ["Scrub Tops", "Scrub Pants", "Complete Scrub Sets"] },
      { name: "Work Uniforms", productTypes: ["Work Shirts", "Work Trousers", "Work Jackets"] },
      { name: "Work Polo Shirts", productTypes: ["Short-Sleeve Polos", "Long-Sleeve Polos", "Embroidered Logo Polos"] },
    ]
  },
  {
    pillar: "Sports Accessories",
    pillarSlug: "sports-accessories",
    subcategories: [
      { name: "Team Socks", productTypes: ["Hockey Socks", "Soccer Socks", "Training Socks"] },
      { name: "Training Bibs", productTypes: ["Single-Layer Bibs", "Reversible Bibs", "Mesh Bibs"] },
      { name: "Caps", productTypes: ["Baseball Caps", "Trucker Caps", "Sports Visors"] },
      { name: "Headbands", productTypes: ["Sports Headbands", "Running Headbands", "Winter Headbands"] },
      { name: "Wristbands", productTypes: ["Sweatbands", "Embroidered Wristbands", "Printed Wristbands"] },
    ]
  },
  {
    pillar: "Gloves",
    pillarSlug: "gloves",
    subcategories: [
      { name: "Ice Hockey Gloves", productTypes: ["Youth Hockey Gloves", "Senior Hockey Gloves", "Practice Hockey Gloves"] },
      { name: "Goalkeeper Gloves", productTypes: ["Training Gloves", "Match Gloves", "Finger-Protection Gloves"] },
      { name: "Cricket Batting Gloves", productTypes: ["Youth Batting Gloves", "Adult Batting Gloves", "Training Batting Gloves"] },
      { name: "Baseball Batting Gloves", productTypes: ["Youth Batting Gloves", "Adult Batting Gloves"] },
      { name: "Boxing Gloves", productTypes: ["Training Gloves", "Sparring Gloves", "Bag Gloves"] },
      { name: "MMA Gloves", productTypes: ["Competition Gloves", "Sparring Gloves", "Training Gloves"] },
      { name: "Gym & Weightlifting Gloves", productTypes: ["Fingerless Gym Gloves", "Full-Finger Gym Gloves", "Wrist-Support Gloves"] },
      { name: "Cycling Gloves", productTypes: ["Short-Finger Cycling Gloves", "Full-Finger Cycling Gloves", "Winter Cycling Gloves"] },
      { name: "Winter Gloves", productTypes: ["Fleece Gloves", "Insulated Gloves", "Touchscreen Gloves"] },
      { name: "Work Gloves", productTypes: ["General Work Gloves", "Leather Work Gloves", "Grip Gloves"] },
    ]
  }
];

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

console.log('=====================================================');
console.log('AUDIT: CLIENT DOCUMENT TAXONOMY VS DATABASE CATEGORIES');
console.log('=====================================================\n');

let totalRequiredTypes = 0;
let totalExistingInSub = 0;
let totalExistingElsewhere = 0;
let totalMissing = 0;

const actionsToAdd = [];

CLIENT_DOCUMENT.forEach((p) => {
  const pillarInDb = dbCats.find(c => c.slug === p.pillarSlug || norm(c.name) === norm(p.pillar));
  console.log(`\nPILLAR: ${p.pillar} (${p.pillarSlug}) -> DB ID: ${pillarInDb ? pillarInDb.id : 'NOT FOUND'}`);

  p.subcategories.forEach((sub) => {
    // Find subcategory in DB where parent_id is pillarInDb.id (or matches by name/slug)
    let subInDb = null;
    if (pillarInDb) {
      subInDb = dbCats.find(c => c.parent_id === pillarInDb.id && (norm(c.name) === norm(sub.name) || norm(c.slug) === norm(sub.name)));
    }
    if (!subInDb) {
      subInDb = dbCats.find(c => norm(c.name) === norm(sub.name) || norm(c.slug) === norm(sub.name));
    }

    console.log(`  ├─ SUB: ${sub.name} -> DB ID: ${subInDb ? `${subInDb.id} (parent_id: ${subInDb.parent_id})` : 'MISSING IN DB!'}`);

    sub.productTypes.forEach((pt) => {
      totalRequiredTypes++;

      // Check if product type exists under this exact subcategory in DB
      let exactMatch = null;
      if (subInDb) {
        exactMatch = dbCats.find(c => c.parent_id === subInDb.id && (norm(c.name) === norm(pt) || norm(c.slug) === norm(pt)));
      }

      // Check if product type exists anywhere in DB
      const anywhereMatch = dbCats.find(c => norm(c.name) === norm(pt) || norm(c.slug) === norm(pt));

      if (exactMatch) {
        totalExistingInSub++;
        console.log(`  │    ✓ [EXACT] ${pt.padEnd(30)} -> ID: ${exactMatch.id} under parent ${exactMatch.parent_id}`);
      } else if (anywhereMatch) {
        totalExistingElsewhere++;
        console.log(`  │    ~ [ELSEWHERE] ${pt.padEnd(26)} -> ID: ${anywhereMatch.id} under parent ${anywhereMatch.parent_id} (Needs reparenting or new entry under ${subInDb ? subInDb.id : '?'})`);
        actionsToAdd.push({
          pillar: p.pillar,
          subName: sub.name,
          subId: subInDb ? subInDb.id : null,
          productType: pt,
          status: 'exists_elsewhere',
          existingId: anywhereMatch.id,
          existingParent: anywhereMatch.parent_id
        });
      } else {
        totalMissing++;
        console.log(`  │    ✗ [MISSING] ${pt.padEnd(28)} -> Not in DB at all!`);
        actionsToAdd.push({
          pillar: p.pillar,
          subName: sub.name,
          subId: subInDb ? subInDb.id : null,
          productType: pt,
          status: 'missing'
        });
      }
    });
  });
});

console.log('\n=====================================================');
console.log(`SUMMARY:`);
console.log(`Total Required Product Types: ${totalRequiredTypes}`);
console.log(`Exact Matches under Subcategory: ${totalExistingInSub}`);
console.log(`Matches Elsewhere in DB: ${totalExistingElsewhere}`);
console.log(`Completely Missing in DB: ${totalMissing}`);
console.log(`Total to Add / Wire under Subcategories: ${actionsToAdd.length}`);
console.log('=====================================================');

fs.writeFileSync(path.join(__dirname, 'actions_to_add_taxonomy.json'), JSON.stringify(actionsToAdd, null, 2));
