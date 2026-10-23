import { Product, ProductColor } from "@/types";

export const COLOR_STEALTH: ProductColor = { id: "c-black", name: "Stealth Black", hex: "#0A0A0A", pantone: "Black 6 C" };
export const COLOR_OLIVE: ProductColor = { id: "c-olive", name: "Stark Olive", hex: "#D61C24", pantone: "Pantone 417 C" };
export const COLOR_CHARCOAL: ProductColor = { id: "c-charcoal", name: "Charcoal Slate", hex: "#20201E", pantone: "Cool Gray 11 C" };
export const COLOR_BONE: ProductColor = { id: "c-bone", name: "Bone Ecru", hex: "#F4F4EF", pantone: "Pantone 7527 C" };
export const COLOR_NAVY: ProductColor = { id: "c-navy", name: "Midnight Navy", hex: "#111B2C", pantone: "Pantone 533 C" };
export const COLOR_CRIMSON: ProductColor = { id: "c-crimson", name: "Racing Crimson", hex: "#8B0000", pantone: "Pantone 187 C" };
export const COLOR_WHITE: ProductColor = { id: "c-white", name: "Optic White", hex: "#FFFFFF", pantone: "Bright White" };

/**
 * PRODUCTION CATALOG PRODUCTS
 * Static base products (e.g. American Football Uniforms) merging with live API catalog
 */
export const PRODUCTS_DATA: Product[] = [
  {
    id: "cm-af-01",
    name: "Custom Pro Style American Football Uniform Set | Game Jersey & Integrated Pants",
    slug: "custom-pro-american-football-uniform-set",
    sku: "CM-AF-01",
    category: "sportswear",
    subcategory: "American Football",
    description: "Engineered pro-grade American Football uniform set designed for high impact gridiron play. Features 4-way stretch spandex body panels, reinforced dazzle cowl shoulders, double-layer yoke, and heavy-duty Lycra/poly pant integration with pad pockets. Sublimated graphics with zero cracking or fading.",
    shortDescription: "Heavy-duty 4-way stretch American football jersey and pant kit with reinforced shoulder yoke and pad pocket integration.",
    images: [
      "/american-football-uniform/front_base.png",
      "/american-football-uniform/back_base.png",
    ],
    retailPrice: 85,
    wholesalePrice: 42,
    MOQ: 30,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    colors: [
      COLOR_STEALTH,
      COLOR_CRIMSON,
      COLOR_NAVY,
      COLOR_WHITE,
    ],
    fabric: "280 GSM Heavy-Duty Spandex / Poly Mesh with Reinforced Dazzle Shoulders",
    material: "100% Technical Gridiron Poly / Lycra",
    fit: "Athletic Pro Cut / Pad Fit",
    technicalFeatures: [
      "Heavy-duty double-ply shoulder and yoke construction",
      "Reinforced coverstitch and bar-tack stress points",
      "Vented side mesh panels for moisture dissipation",
      "Integrated thigh and knee pad pockets in pants",
    ],
    customizable: true,
    sampleAvailable: true,
    leadTime: "14-18 Days",
    decorationMethods: ["Sublimation", "Tackle Twill", "Embroidery"],
    featured: true,
    specifications: [
      { label: "Fabric Construction", value: "280 GSM Heavy-Duty Dazzle & Spandex" },
      { label: "Fit Silhouette", value: "Pro Gridiron Athletic Fit (Pad Accommodating)" },
      { label: "Factory Origin", value: "Sialkot Export Manufacturing Hub" },
      { label: "Stitching", value: "Multi-Needle Heavy Duty Reinforced Flatlock" },
    ],
    rawCategories: [
      { id: "team-sports-wear", name: "Team Sports Wear", slug: "team-sports-wear" },
      { id: "sportswear", name: "Sportswear", slug: "sportswear" },
      { id: "american-football", name: "American Football", slug: "american-football" },
    ],
  },
  {
    id: "cm-af-02",
    name: "Pro Elite American Football Match Uniform Set | Compression Sleeve Kit",
    slug: "pro-elite-american-football-match-uniform",
    sku: "CM-AF-02",
    category: "sportswear",
    subcategory: "American Football",
    description: "Competition-level American Football match kit engineered for elite club and college programs. Features breathable micro-mesh torso, moisture-wicking anti-microbial finish, elasticated arm cuffs, and durable tackle twill roster personalization.",
    shortDescription: "Pro-calibre American football team uniform with elasticated sleeve cuffs, contoured fit, and high-impact reinforced seams.",
    images: [
      "/american-football-uniform/front.png",
      "/american-football-uniform/back.png",
    ],
    retailPrice: 90,
    wholesalePrice: 45,
    MOQ: 30,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    colors: [
      COLOR_STEALTH,
      COLOR_CRIMSON,
      COLOR_NAVY,
      COLOR_WHITE,
    ],
    fabric: "300 GSM Heavyweight Dazzle & 4-Way Stretch Lycra Mesh",
    material: "High-Tension Engineered Gridiron Mesh",
    fit: "Elite Compression & Pad Fit",
    technicalFeatures: [
      "Bar-tack reinforced stress seams",
      "Elasticated sleeve cuffs for snug pad adherence",
      "Fade-resistant Italian sublimation pigments",
      "Elastic waistband with silicone gripper in pants",
    ],
    customizable: true,
    sampleAvailable: true,
    leadTime: "14-18 Days",
    decorationMethods: ["Sublimation", "Tackle Twill", "Screen Printing"],
    featured: true,
    specifications: [
      { label: "Fabric Construction", value: "300 GSM Heavyweight Dazzle & Mesh" },
      { label: "Fit Silhouette", value: "Elite Pad Contour Fit" },
      { label: "Factory Origin", value: "Sialkot Export Manufacturing Hub" },
      { label: "Stitching", value: "Bar-tacked Multi-Needle Heavy Thread" },
    ],
    rawCategories: [
      { id: "team-sports-wear", name: "Team Sports Wear", slug: "team-sports-wear" },
      { id: "sportswear", name: "Sportswear", slug: "sportswear" },
      { id: "american-football", name: "American Football", slug: "american-football" },
    ],
  },
];
