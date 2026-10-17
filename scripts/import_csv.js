/**
 * CM SPORTS WEAR - HIGH-PERFORMANCE CSV PRODUCT IMPORTER
 * Parses WooCommerce exports, Shopify exports, or custom apparel CSVs
 * and updates src/data/products.data.ts with clean TypeScript structures.
 *
 * Usage:
 *   node scripts/import_csv.js <path-to-csv-file>
 *   npm run import:csv <path-to-csv-file>
 */

const fs = require("fs");
const path = require("path");

// Robust RFC-4180 compliant CSV parser
function parseCSV(text) {
  // Strip UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field.trim());
        field = "";
      } else if (char === "\r" && nextChar === "\n") {
        row.push(field.trim());
        field = "";
        rows.push(row);
        row = [];
        i++; // skip \n
      } else if (char === "\n" || char === "\r") {
        row.push(field.trim());
        field = "";
        rows.push(row);
        row = [];
      } else {
        field += char;
      }
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    rows.push(row);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[\s\-_]+/g, "_"));
  const data = [];

  for (let r = 1; r < rows.length; r++) {
    const values = rows[r];
    if (values.length === 0 || (values.length === 1 && values[0] === "")) continue;

    const entry = {};
    for (let c = 0; c < headers.length; c++) {
      entry[headers[c]] = values[c] !== undefined ? values[c] : "";
    }
    data.push(entry);
  }

  return data;
}

function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanHtml(html) {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function mapToProduct(row, idx) {
  // Field resolution supporting WooCommerce, Shopify & Custom headers
  const name =
    row.name ||
    row.title ||
    row.product_name ||
    row.item_name ||
    `Product ${idx + 1}`;

  const sku =
    row.sku ||
    row.product_sku ||
    row.item_sku ||
    `TI-PROD-${String(idx + 1).padStart(3, "0")}`;

  const slug = slugify(row.slug || name || sku);

  // Price handling
  const rawRetail =
    parseFloat(row.regular_price || row.price || row.retail_price || "0") || 45;
  const rawSale =
    parseFloat(row.sale_price || row.wholesale_price || "0") ||
    Math.round(rawRetail * 0.45 * 10) / 10;

  const retailPrice = rawRetail;
  const wholesalePrice = rawSale < rawRetail ? rawSale : Math.round(rawRetail * 0.5 * 10) / 10;

  // Category & Subcategory resolution
  let rawCategory = row.categories || row.category || row.discipline || "casual-wear";
  let primaryCategory = "casual-wear";
  let subcategory = "Custom Apparel";

  if (rawCategory.includes(">")) {
    const parts = rawCategory.split(">").map((s) => s.trim());
    primaryCategory = slugify(parts[0]);
    subcategory = parts[1] || parts[0];
  } else if (rawCategory.includes(",")) {
    const parts = rawCategory.split(",").map((s) => s.trim());
    primaryCategory = slugify(parts[0]);
    subcategory = parts[1] || parts[0];
  } else {
    primaryCategory = slugify(rawCategory);
    subcategory = row.subcategory || rawCategory;
  }

  // Normalize category to known 8 core categories if closest match
  const validCategories = [
    "casual-wear",
    "equestrian-clothing",
    "ice-hockey",
    "cycling",
    "rugby",
    "basketball",
    "ski-wear",
    "go-karting-racing",
  ];

  const matchedCat = validCategories.find(
    (c) => primaryCategory.includes(c) || c.includes(primaryCategory)
  );
  if (matchedCat) primaryCategory = matchedCat;

  // Description
  const shortDesc = cleanHtml(row.short_description || row.summary || "");
  const fullDesc =
    cleanHtml(row.description || row.body_html || "") ||
    shortDesc ||
    `Export-grade manufacturing specification for ${name}.`;

  // Images resolution
  const rawImages = row.images || row.image || row.image_url || row.image_src || "";
  let images = [];
  if (rawImages) {
    images = rawImages
      .split(/[,\s]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/"));
  }
  if (images.length === 0) {
    images = ["/placeholder.jpg"];
  }

  // MOQ
  const MOQ = parseInt(row.moq || row.minimum_order_quantity || "25", 10) || 25;

  // Sizes
  let sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  if (row.sizes || row.attribute_pa_size || row.attribute_size) {
    const rawSizes = row.sizes || row.attribute_pa_size || row.attribute_size;
    sizes = rawSizes
      .split(/[,\s|]+/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
  }

  return {
    id: `prod-${idx + 1}-${slug.slice(0, 20)}`,
    slug,
    name,
    sku,
    category: primaryCategory,
    subcategory: subcategory,
    shortDescription: shortDesc.slice(0, 180) || fullDesc.slice(0, 180),
    description: fullDesc,
    images,
    retailPrice,
    wholesalePrice,
    wholesaleTiers: [
      { minQty: MOQ, maxQty: MOQ * 3, unitPrice: wholesalePrice },
      { minQty: MOQ * 3 + 1, maxQty: MOQ * 10, unitPrice: Math.round(wholesalePrice * 0.9 * 10) / 10 },
      { minQty: MOQ * 10 + 1, unitPrice: Math.round(wholesalePrice * 0.8 * 10) / 10 },
    ],
    MOQ,
    sizes,
    colors: [
      { id: "c-black", name: "Stealth Black", hex: "#0A0A0A" },
      { id: "c-navy", name: "Midnight Navy", hex: "#111B2C" },
      { id: "c-crimson", name: "Racing Crimson", hex: "#8B0000" },
      { id: "c-bone", name: "Bone Ecru", hex: "#F4F4EF" },
    ],
    fabric: row.fabric || "Premium Industrial Grade Apparel Fabric",
    material: row.material || "Technical Performance Blend",
    GSM: parseInt(row.gsm || "380", 10) || 380,
    fit: row.fit || "Engineered Athletic Fit",
    technicalFeatures: [
      "Industrial High-Density Stitching",
      "Pre-Shrunk Dimensional Stability",
      "Reinforced Seams & Bar-tacking",
    ],
    customizable: true,
    sampleAvailable: true,
    sampleLeadTime: "3–5 Days",
    leadTime: "14–21 Days",
    decorationMethods: ["Direct Embroidery", "Screen Printing", "Sublimation", "High-Density Puff"],
    featured: idx < 8,
    specifications: [
      { label: "Fabric Construction", value: row.fabric || "High-Density Knit / Weave" },
      { label: "Fit Silhouette", value: row.fit || "Engineered Athletic Fit" },
      { label: "Origin", value: "Sialkot Export Facility" },
    ],
  };
}

function runImport() {
  const args = process.argv.slice(2);
  let csvPath = args[0];

  if (!csvPath) {
    // Check common default locations
    const candidates = [
      path.join(process.cwd(), "products.csv"),
      path.join(process.cwd(), "real_products.csv"),
      path.join(process.cwd(), "woocommerce_products.csv"),
    ];
    csvPath = candidates.find((p) => fs.existsSync(p));
  }

  if (!csvPath || !fs.existsSync(csvPath)) {
    console.error("\n❌ Error: Please specify a valid CSV file path.");
    console.log("Usage: node scripts/import_csv.js <path-to-your-products.csv>\n");
    process.exit(1);
  }

  console.log(`\n📂 Reading CSV from: ${csvPath}`);
  const rawContent = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(rawContent);

  if (rows.length === 0) {
    console.error("❌ Error: No valid product rows found in the CSV file.");
    process.exit(1);
  }

  // Filter out variation rows in WooCommerce exports if parent exists
  const parentRows = rows.filter((r) => {
    const type = (r.type || "simple").toLowerCase();
    return type !== "variation";
  });

  const parsedProducts = parentRows.map((row, idx) => mapToProduct(row, idx));

  console.log(`✓ Parsed ${parsedProducts.length} real products successfully.`);

  // Generate TypeScript code
  const tsContent = `import { Product, ProductColor } from "@/types";

export const COLOR_STEALTH: ProductColor = { id: "c-black", name: "Stealth Black", hex: "#0A0A0A", pantone: "Black 6 C" };
export const COLOR_OLIVE: ProductColor = { id: "c-olive", name: "Stark Olive", hex: "#D61C24", pantone: "Pantone 417 C" };
export const COLOR_CHARCOAL: ProductColor = { id: "c-charcoal", name: "Charcoal Slate", hex: "#20201E", pantone: "Cool Gray 11 C" };
export const COLOR_BONE: ProductColor = { id: "c-bone", name: "Bone Ecru", hex: "#F4F4EF", pantone: "Pantone 7527 C" };
export const COLOR_NAVY: ProductColor = { id: "c-navy", name: "Midnight Navy", hex: "#111B2C", pantone: "Pantone 533 C" };
export const COLOR_CRIMSON: ProductColor = { id: "c-crimson", name: "Racing Crimson", hex: "#8B0000", pantone: "Pantone 187 C" };
export const COLOR_WHITE: ProductColor = { id: "c-white", name: "Optic White", hex: "#FFFFFF", pantone: "Bright White" };

/**
 * PRODUCTION CATALOG PRODUCTS (${parsedProducts.length} Items)
 * Imported automatically from: ${path.basename(csvPath)}
 * Date: ${new Date().toISOString()}
 */
export const PRODUCTS_DATA: Product[] = ${JSON.stringify(parsedProducts, null, 2)};
`;

  const targetPath = path.join(process.cwd(), "src", "data", "products.data.ts");
  fs.writeFileSync(targetPath, tsContent, "utf-8");

  console.log(`🎉 Successfully wrote ${parsedProducts.length} products to ${targetPath}!`);
  console.log(`Catalog is now populated with real products.\n`);
}

runImport();
