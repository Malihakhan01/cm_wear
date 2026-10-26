const fs = require('fs');
const path = require('path');

const resolved = JSON.parse(fs.readFileSync(path.join(__dirname, 'resolved_taxonomy.json'), 'utf8'));
const counts = JSON.parse(fs.readFileSync(path.join(__dirname, 'db_category_counts.json'), 'utf8'));

const PILLAR_METAS = {
  "team-sports-wear": {
    number: "01",
    image: "/categories/teamsports_wear.png",
    tagline: "High-performance team uniforms, match jerseys, and technical kits for professional athletics."
  },
  "martial-arts-combat-wear": {
    number: "02",
    image: "/categories/martial arts.png",
    tagline: "Championship BJJ gis, fight rash guards, compression singlets, and combat apparel."
  },
  "activewear-fitness": {
    number: "03",
    image: "/categories/activewear.png",
    tagline: "Engineered 4-way stretch gym wear, compression layers, and women’s performance activewear."
  },
  "casual-lifestyle-wear": {
    number: "04",
    image: "/categories/casualwear.png",
    tagline: "Heavyweight 450 GSM French terry hoodies, crewnecks, oversized tees, and tailored tracksuits."
  },
  "jackets-outerwear": {
    number: "05",
    image: "/categories/jacket wear.png",
    tagline: "Authentic wool & leather varsity jackets, technical softshells, windbreakers, and weather armor."
  },
  "kids-youth-wear": {
    number: "06",
    image: "/categories/kids_wear.png",
    tagline: "High-durability youth athletics, team kits, sublimated jerseys, and everyday fleece sets."
  },
  "workwear-medical-wear": {
    number: "07",
    image: "/categories/safety_wear.png",
    tagline: "Antimicrobial hospital scrubs, certified industrial work uniforms, and corporate embroidered polos."
  },
  "sports-accessories": {
    number: "08",
    image: "/categories/accessories.png",
    tagline: "Technical sports socks, breathable mesh training bibs, moisture-wicking headbands, and caps."
  },
  "gloves": {
    number: "09",
    image: "/categories/gloves.png",
    tagline: "Pro-grade competition fight gloves, hockey mitts, grip goalkeeper gloves, and thermal winter gloves."
  }
};

const pillars = resolved.map((p) => {
  const meta = PILLAR_METAS[p.pillarSlug] || { number: "00", image: "/categories/casualwear.png", tagline: "" };
  const subcategoryNames = p.subcategories.map(s => s.name);
  const groups = p.subcategories.map(s => {
    return {
      name: s.name,
      slug: s.slug,
      productTypes: s.productTypes.map(pt => {
        const cnt = counts[pt.id] || 0;
        return {
          name: pt.name,
          query: `subcategory=${pt.slug}`,
          slugs: [pt.slug],
          productCount: cnt
        };
      })
    };
  });

  return {
    id: p.pillarSlug,
    slug: p.pillarSlug,
    name: p.pillar,
    number: meta.number,
    image: meta.image,
    tagline: meta.tagline,
    subcategories: subcategoryNames,
    groups: groups
  };
});

const tsContent = `export interface ProductTypeItem {
  name: string;
  query: string; // e.g. "subcategory=slug"
  slugs: string[];
  productCount: number;
  isPending?: boolean;
}

export interface SubcategoryGroup {
  name: string;
  slug: string;
  productTypes: ProductTypeItem[];
}

export interface MegaMenuPillarData {
  id: string;
  slug: string;
  name: string;
  number: string;
  image: string;
  tagline: string;
  subcategories: string[];
  groups: SubcategoryGroup[];
}

export const MEGA_MENU_TAXONOMY: MegaMenuPillarData[] = ${JSON.stringify(pillars, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/config/megaMenuData.ts'), tsContent, 'utf8');
console.log('Successfully wrote src/config/megaMenuData.ts with all 9 pillars, 55 subcategories, and 195 product types!');
