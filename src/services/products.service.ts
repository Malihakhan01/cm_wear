import { Product, FilterState, MainCategoryId } from "@/types";
import { PRODUCTS_DATA } from "@/data/products.data";
import { delay, stripHtml } from "@/lib/utils";
import { apiClient } from "@/services/api.client";

export { PRODUCTS_DATA };

interface BackendProductRaw {
  id: number | string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  short_description?: string;
  regular_price?: number | string;
  sale_price?: number | string;
  is_featured?: boolean;
  product_type?: string;
  three_d_model_url?: string;
  categories?: Array<{ id: number; name: string; slug: string }>;
  primary_image?: { url: string };
  images?: Array<{ url: string }>;
  meta?: {
    wholesale_price?: number | string;
    moq?: number | string;
    lead_time_days?: number | string;
    default_gsm?: number | string;
    fit?: string;
  };
}

const MAIN_CAT_IDS: MainCategoryId[] = [
  "casual-wear",
  "streetwear",
  "equestrian-clothing",
  "ice-hockey",
  "cycling",
  "rugby",
  "basketball",
  "ski-wear",
  "go-karting-racing",
  "bavarian-wear",
  "martial-arts",
];

function normalizeImageUrl(url?: string): string {
  if (!url) return "/placeholder.jpg";
  if (url.includes("localhost:8000")) {
    url = url.replace(/http:\/\/localhost:8000/, "");
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const clean = url.replace(/^\/?storage\//, "").replace(/^\//, "");
  return `/storage/${clean}`;
}

function mapBackendProductToFrontend(p: BackendProductRaw): Product {
  const primaryRaw = p.primary_image?.url || p.images?.[0]?.url;
  const primaryImg = normalizeImageUrl(primaryRaw);
  const rawGallery = p.images && p.images.length > 0
    ? p.images.map((img) => normalizeImageUrl(img.url))
    : [primaryImg];
  const gallery = [primaryImg, ...rawGallery.filter((u) => u !== primaryImg)];

  // Match main category and subcategory intelligently from assigned categories
  const mainCat = p.categories?.find((c) => MAIN_CAT_IDS.includes(c.slug as MainCategoryId))
    || p.categories?.[0];

  const subCat = p.categories?.find((c) => c.slug !== mainCat?.slug && c.name?.toLowerCase() !== mainCat?.name?.toLowerCase())
    || p.categories?.[1];

  const catSlug = (mainCat?.slug || "casual-wear") as MainCategoryId;

  // Format clean human-readable subcategory label
  let subSlug = subCat?.name || subCat?.slug;
  if (!subSlug || subSlug.toLowerCase() === catSlug.toLowerCase()) {
    const pNameLower = p.name.toLowerCase();
    if (pNameLower.includes("bodice")) {
      subSlug = "Trachten Bodice";
    } else if (pNameLower.includes("t-shirt") || pNameLower.includes("tee")) {
      subSlug = "Trachten T-shirts";
    } else if (pNameLower.includes("hoodie")) {
      subSlug = "Hoodies & Sweatshirts";
    } else if (pNameLower.includes("jacket")) {
      subSlug = "Jackets";
    } else if (pNameLower.includes("aikido")) {
      subSlug = "Aikido Uniforms";
    } else if (pNameLower.includes("jiu jitsu") || pNameLower.includes("bjj")) {
      subSlug = "Jiu Jitsu Uniforms";
    } else if (pNameLower.includes("karate")) {
      subSlug = "Karate Uniforms";
    } else if (pNameLower.includes("taekwondo")) {
      subSlug = "Taekwondo Uniforms";
    } else if (pNameLower.includes("judo")) {
      subSlug = "Judo Uniforms";
    } else if (pNameLower.includes("kung fu")) {
      subSlug = "Kung Fu Uniforms";
    } else if (pNameLower.includes("belt")) {
      subSlug = "Martial Arts Belts";
    } else if (pNameLower.includes("glove")) {
      subSlug = "MMA & Sparring Gloves";
    } else if (catSlug === "martial-arts") {
      subSlug = "Martial Arts Uniforms";
    } else {
      subSlug = mainCat?.name || "Apparel";
    }
  }

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    sku: p.sku || `TI-${p.id}`,
    category: catSlug,
    subcategory: subSlug,
    description: stripHtml(p.description || p.short_description || ""),
    shortDescription: stripHtml(p.short_description || p.description || ""),
    images: gallery,
    retailPrice: Number(p.regular_price || p.sale_price || 65),
    wholesalePrice: Number(p.meta?.wholesale_price || p.sale_price || 35),
    MOQ: Number(p.meta?.moq || 50),
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: [
      { id: "c-black", name: "Stealth Black", hex: "#0A0A0A" },
      { id: "c-grey", name: "Heather Grey", hex: "#7E7E7E" },
      { id: "c-red", name: "Factory Red", hex: "#D61C24" },
    ],
    fabric: "100% Technical Engineered Fabric",
    material: "Technical Knitted Fleece / Performance Poly",
    fit: p.meta?.fit || "Athletic Pro Cut",
    technicalFeatures: [
      "Aerodynamic & Ergonomic Construction",
      "Reinforced Seams & Bar-tacking",
      "Pre-shrunk dimensional stability",
    ],
    customizable: false,
    sampleAvailable: true,
    leadTime: `${p.meta?.lead_time_days || 21} Days`,
    decorationMethods: ["Embroidery", "Screen Printing", "Sublimation"],
    featured: Boolean(p.is_featured),
    threeDModel: p.three_d_model_url,
    specifications: [
      { label: "Fabric Construction", value: "Technical Engineered Knit / Weave" },
      { label: "Fit Silhouette", value: p.meta?.fit || "Athletic Pro Cut" },
      { label: "Factory Origin", value: "Sialkot Industrial Facility" },
    ],
  };
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const res = await apiClient.get<{ data?: BackendProductRaw[] } | BackendProductRaw[]>("/products?per_page=250");
      const list = Array.isArray(res) ? res : res?.data;
      if (list && list.length > 0) {
        const liveProducts = list.map(mapBackendProductToFrontend);
        const liveSlugs = new Set(liveProducts.map((p) => p.slug));
        const remainingStatic = PRODUCTS_DATA.filter((p) => !liveSlugs.has(p.slug));
        return [...liveProducts, ...remainingStatic];
      }
    } catch (e) {
      console.warn("Live backend products fetch fallback:", e);
    }
    await delay(50);
    return [...PRODUCTS_DATA];
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await apiClient.get<{ data?: BackendProductRaw }>(`/products/${slug}`);
      if (res?.data) {
        return mapBackendProductToFrontend(res.data);
      }
    } catch (e) {
      console.warn("Live backend product by slug fetch fallback:", e);
    }
    await delay(50);
    return PRODUCTS_DATA.find((p) => p.slug === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    const all = await this.getAll();
    return all.find((p) => p.id === id) || PRODUCTS_DATA.find((p) => p.id === id) || null;
  },

  async getByCategory(category: string): Promise<Product[]> {
    try {
      const res = await apiClient.get<{ data?: BackendProductRaw[] } | BackendProductRaw[]>(`/products?category=${category}&per_page=250`);
      const list = Array.isArray(res) ? res : res?.data;
      if (list && list.length > 0) {
        const liveProducts = list.map(mapBackendProductToFrontend);
        const liveSlugs = new Set(liveProducts.map((p) => p.slug));
        const staticMatches = PRODUCTS_DATA.filter((p) => p.category === category && !liveSlugs.has(p.slug));
        return [...liveProducts, ...staticMatches];
      }
    } catch (e) {
      console.warn("Live backend products by category fetch fallback:", e);
    }
    await delay(50);
    return PRODUCTS_DATA.filter((p) => p.category === category);
  },

  async getFeatured(): Promise<Product[]> {
    try {
      const res = await apiClient.get<{ data?: BackendProductRaw[] }>("/products?featured=1");
      const list = res?.data;
      if (list && list.length > 0) {
        const liveProducts = list.map(mapBackendProductToFrontend);
        const liveSlugs = new Set(liveProducts.map((p) => p.slug));
        const staticMatches = PRODUCTS_DATA.filter((p) => p.featured && !liveSlugs.has(p.slug));
        return [...liveProducts, ...staticMatches];
      }
    } catch (e) {
      console.warn("Live backend featured products fetch fallback:", e);
    }
    await delay(50);
    return PRODUCTS_DATA.filter((p) => p.featured);
  },

  async filterProducts(filters: FilterState): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.subcategory && p.subcategory !== filters.subcategory) return false;
      if (filters.customizableOnly && !p.customizable) return false;
      if (filters.sampleAvailableOnly && !p.sampleAvailable) return false;
      if (filters.threeDOnly && !p.threeDModel) return false;
      if (filters.minPrice && p.retailPrice < filters.minPrice) return false;
      if (filters.maxPrice && p.retailPrice > filters.maxPrice) return false;
      if (filters.minMoq && p.MOQ < filters.minMoq) return false;
      if (filters.maxMoq && p.MOQ > filters.maxMoq) return false;
      if (filters.size && !p.sizes.includes(filters.size)) return false;
      if (filters.color && !p.colors.some((c) => c.name.toLowerCase().includes(filters.color!.toLowerCase()))) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchSub = p.subcategory.toLowerCase().includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchSub && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.retailPrice - b.retailPrice;
      if (filters.sortBy === "price-desc") return b.retailPrice - a.retailPrice;
      if (filters.sortBy === "moq-asc") return a.MOQ - b.MOQ;
      return 0;
    });
  },
};
