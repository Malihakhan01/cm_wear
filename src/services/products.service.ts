import { Product, FilterState, MainCategoryId } from "@/types";
import { PRODUCTS_DATA } from "@/data/products.data";
import { delay, stripHtml, cleanProductText, parseHtmlTableSpecs } from "@/lib/utils";
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
  categories?: Array<{ id: number | string; name: string; slug: string; parent_id?: number | string | null }>;
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
  "sportswear",
  "casual-wear",
  "equestrian-clothing",
  "ice-hockey",
  "cycling",
  "rugby",
  "basketball",
  "ski-wear",
  "go-karting-racing",
];

export function getProductDemoImage(category?: string, name?: string, subcategory?: string): string {
  const text = `${name || ""} ${category || ""} ${subcategory || ""}`.toLowerCase();
  if (text.includes("hoodie") || text.includes("fleece") || text.includes("sweatshirt") || text.includes("pullover")) {
    return "/hoodie/hoodie_front.png";
  }
  if (text.includes("varsity") || text.includes("jacket") || text.includes("leather") || text.includes("bomber") || text.includes("coat")) {
    return "/varsity_jacket/FRONT_BODY.png";
  }
  if (text.includes("basketball") || text.includes("jersey") || text.includes("mesh") || text.includes("court")) {
    return "/basketball/front (3) (1).png";
  }
  if (text.includes("equestrian") || text.includes("riding") || text.includes("horse") || text.includes("breeches")) {
    return "/equastarian/front (2) (1).png";
  }
  if (text.includes("cycling") || text.includes("cyclist") || text.includes("bike")) {
    return "/categories/Cyclist Conquering the Mountain Pass.png";
  }
  if (text.includes("rugby")) {
    return "/categories/rugby-action-match.png";
  }
  if (text.includes("soccer") || text.includes("football") || text.includes("ball") || text.includes("team")) {
    return "/categories/Confident Soccer Portrait with Ball.png";
  }
  if (text.includes("hockey")) {
    return "/HERO/Dynamic Ice Hockey Turn in Motion.png";
  }
  return "/placeholder.jpg";
}

export function normalizeImageUrl(url?: string, category?: string, name?: string, subcategory?: string): string {
  if (!url || url.trim() === "" || url === "/placeholder.jpg") {
    return getProductDemoImage(category, name, subcategory);
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url.replace("https://darkcyan-bear-847672.hostingersite.com", "https://cmsportswear.pk");
  }
  if (
    url.startsWith("/hoodie") ||
    url.startsWith("/varsity") ||
    url.startsWith("/basketball") ||
    url.startsWith("/equastarian") ||
    url.startsWith("/categories") ||
    url.startsWith("/HERO") ||
    url.startsWith("/images")
  ) {
    return url;
  }
  const clean = url.replace(/^\/?storage\//, "").replace(/^\//, "");
  let backendBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendBase) {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      backendBase = "http://127.0.0.1:8000";
    } else {
      backendBase = "https://cmsportswear.pk";
    }
  }
  return `${backendBase}/storage/${clean}`;
}

function mapBackendProductToFrontend(p: BackendProductRaw): Product {
  const primaryRaw = p.primary_image?.url || p.images?.[0]?.url;
  const primaryImg = normalizeImageUrl(primaryRaw, p.categories?.[0]?.slug, p.name, p.categories?.[1]?.slug);
  const rawGallery = p.images && p.images.length > 0
    ? p.images.map((img) => normalizeImageUrl(img.url, p.categories?.[0]?.slug, p.name, p.categories?.[1]?.slug))
    : [primaryImg];
  const gallery = [primaryImg, ...rawGallery.filter((u) => u !== primaryImg)];

  // 1. Match root parent category (parent_id === null or undefined or 0)
  let rootCat = p.categories?.find((c) => c.parent_id === null || c.parent_id === undefined || c.parent_id === 0)
    || p.categories?.find((c) => MAIN_CAT_IDS.includes(c.slug as MainCategoryId));

  // 2. Match child subcategory (has a parent_id, or distinct from rootCat)
  let childCat = p.categories?.find((c) => (c.parent_id !== null && c.parent_id !== undefined && c.parent_id !== 0) && c.slug !== rootCat?.slug)
    || p.categories?.find((c) => c.id !== rootCat?.id && c.slug !== rootCat?.slug && c.name?.toLowerCase() !== rootCat?.name?.toLowerCase())
    || (p.categories && p.categories.length > 1 && p.categories[0]?.slug === rootCat?.slug ? p.categories[1] : undefined);

  // 3. Fallback when product only has a subcategory without explicit parent category in p.categories
  if (!rootCat && p.categories && p.categories.length > 0) {
    const firstCat = p.categories[0];
    const s = (firstCat.slug || firstCat.name || "").toLowerCase();
    if (
      firstCat.parent_id === 74 ||
      s.includes("ice-hockey") ||
      s.includes("hockey") ||
      s.includes("football") ||
      s.includes("soccer") ||
      s.includes("basketball") ||
      s.includes("baseball") ||
      s.includes("cricket") ||
      s.includes("rugby")
    ) {
      rootCat = { id: 74, name: "Team Sportswear", slug: "sportswear" } as any;
      childCat = firstCat;
    } else {
      rootCat = firstCat;
    }
  }

  const catSlug = (rootCat?.slug || "casual-wear") as MainCategoryId;

  // Format clean human-readable subcategory label
  let subSlug = childCat?.name || childCat?.slug;
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
      subSlug = rootCat?.name || "Apparel";
    }
  }

  const rawDesc = p.description || "";
  const rawShortDesc = p.short_description || "";
  const tableSpecs = parseHtmlTableSpecs(rawShortDesc || rawDesc);
  const cleanedDesc = cleanProductText(rawDesc || rawShortDesc);

  let shortDesc = "";
  if (rawShortDesc && !rawShortDesc.includes("<table") && !rawShortDesc.includes("Specification")) {
    shortDesc = cleanProductText(rawShortDesc);
  } else {
    const firstPara = cleanedDesc.split("\n\n")[0] || cleanedDesc;
    shortDesc = firstPara.length > 250 ? firstPara.substring(0, 247) + "..." : firstPara;
  }

  const fabricSpec = tableSpecs.find((s) => s.label.toLowerCase().includes("fabric"));
  const fitSpec = tableSpecs.find((s) => s.label.toLowerCase().includes("fit"));

  const mergedSpecs = tableSpecs.length > 0 ? tableSpecs : [
    { label: "Fabric Construction", value: "Technical Engineered Knit / Weave" },
    { label: "Fit Silhouette", value: p.meta?.fit || "Athletic Pro Cut" },
    { label: "Factory Origin", value: "Sialkot Industrial Facility" },
  ];

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    sku: (p.sku && p.sku.trim()) ? (p.sku.trim().startsWith("TI-") ? p.sku.trim().replace(/^TI-/, "CM-") : p.sku.trim()) : `CM-${p.id}`,
    category: catSlug,
    subcategory: subSlug,
    description: cleanedDesc,
    shortDescription: shortDesc,
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
    fabric: fabricSpec ? fabricSpec.value : "100% Technical Engineered Fabric",
    material: "Technical Knitted Fleece / Performance Poly",
    fit: fitSpec ? fitSpec.value : (p.meta?.fit || "Athletic Pro Cut"),
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
    specifications: mergedSpecs,
    rawCategories: [
      ...(rootCat && (!p.categories || !p.categories.some((c) => c.slug === rootCat.slug))
        ? [{ id: String(rootCat.id || rootCat.slug), name: rootCat.name || "Sportswear", slug: rootCat.slug, parentId: null }]
        : []),
      ...(p.categories?.map((c) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug,
        parentId: c.parent_id ? String(c.parent_id) : null,
      })) || []),
    ],
  };
}

export function getLocalImportedProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cm_imported_products");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Error reading imported products from localStorage", e);
  }
  return [];
}

export function saveLocalImportedProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cm_imported_products", JSON.stringify(products));
    window.dispatchEvent(new Event("cm_products_updated"));
  } catch (e) {
    console.warn("Error saving imported products to localStorage", e);
  }
}

let memoryProductsCache: Product[] | null = null;
let inFlightPromise: Promise<Product[]> | null = null;
let lastFetchTime = 0;
const CACHED_PRODUCTS_STORAGE_KEY = "cm_cached_products_catalog_v3";

export function getCachedProducts(): Product[] {
  if (memoryProductsCache && memoryProductsCache.length > 0) {
    return memoryProductsCache;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CACHED_PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryProductsCache = parsed;
          return parsed;
        }
      }
    } catch (e) {
      // Storage unavailable / JSON error
    }
  }
  return [];
}

function saveProductsToLocalStorage(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    const compact = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      category: p.category,
      subcategory: p.subcategory,
      description: p.description,
      shortDescription: p.shortDescription,
      images: p.images,
      retailPrice: p.retailPrice,
      wholesalePrice: p.wholesalePrice,
      MOQ: p.MOQ,
      sizes: p.sizes,
      colors: p.colors,
      fabric: p.fabric,
      material: p.material,
      fit: p.fit,
      leadTime: p.leadTime,
      featured: p.featured,
      specifications: p.specifications,
      rawCategories: p.rawCategories,
    }));
    localStorage.setItem(CACHED_PRODUCTS_STORAGE_KEY, JSON.stringify(compact));
  } catch (e) {
    console.warn("Could not save products to localStorage:", e);
  }
}

export const productsService = {
  getCachedProducts(): Product[] {
    return getCachedProducts();
  },

  async getAll(forceFresh = false): Promise<Product[]> {
    // 1. Instant Cache Hit: Return cached products immediately if fresh enough (< 3 minutes)
    const now = Date.now();
    const cached = getCachedProducts();
    const isFresh = now - lastFetchTime < 180000;

    if (!forceFresh && cached.length > 0) {
      if (!isFresh && !inFlightPromise) {
        // Trigger background revalidation quietly without blocking caller
        this.revalidateInBackground();
      }
      return cached;
    }

    // 2. De-duplicate concurrent calls: if already fetching, reuse the active promise
    if (inFlightPromise) {
      return inFlightPromise;
    }

    inFlightPromise = (async () => {
      const localImported = getLocalImportedProducts();
      const staticBase = [...PRODUCTS_DATA, ...localImported];
      const seen = new Set<string>();
      const uniqueBase = staticBase.filter((p) => {
        if (seen.has(p.slug)) return false;
        seen.add(p.slug);
        return true;
      });

      const sanitizedBase = uniqueBase.map((p) => {
        const demoFallback = getProductDemoImage(p.category, p.name, p.subcategory);
        const validImages = (p.images || []).map((img) => {
          if (!img || img === "/placeholder.jpg") return demoFallback;
          return img;
        });
        return {
          ...p,
          images: validImages.length > 0 ? validImages : [demoFallback],
        };
      });

      try {
        // Fetch up to 1000 products in one single fast request
        const resPage1 = await apiClient.get<{ data?: BackendProductRaw[]; total?: number } | BackendProductRaw[]>(
          `/products?per_page=1000&page=1&_t=${now}`
        );
        const list1 = Array.isArray(resPage1) ? resPage1 : resPage1?.data || [];
        const total = !Array.isArray(resPage1) && resPage1?.total ? resPage1.total : list1.length;

        let allLiveRaw: BackendProductRaw[] = [...list1];
        if (total > list1.length) {
          // If total ever exceeds 1000, fetch page 2
          const resPage2 = await apiClient.get<{ data?: BackendProductRaw[] }>(
            `/products?per_page=1000&page=2&_t=${now}`
          );
          if (resPage2?.data && Array.isArray(resPage2.data)) {
            allLiveRaw = [...allLiveRaw, ...resPage2.data];
          }
        }

        if (allLiveRaw.length > 0) {
          const liveProducts = allLiveRaw.map(mapBackendProductToFrontend);
          const liveSlugs = new Set(liveProducts.map((p) => p.slug));
          const remainingStatic = sanitizedBase.filter((p) => !liveSlugs.has(p.slug));
          const combined = [...liveProducts, ...remainingStatic];

          memoryProductsCache = combined;
          lastFetchTime = Date.now();
          saveProductsToLocalStorage(combined);

          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("cm_products_updated", { detail: combined }));
          }

          return combined;
        }
      } catch (e) {
        console.warn("Live backend products fetch fallback:", e);
      }

      if (cached.length > 0) {
        return cached;
      }

      return sanitizedBase;
    })().finally(() => {
      inFlightPromise = null;
    });

    return inFlightPromise;
  },

  revalidateInBackground(): void {
    if (typeof window === "undefined" || inFlightPromise) return;
    this.getAll(true).catch(() => { });
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const cleanSlug = decodeURIComponent(slug).trim();
    try {
      const res = await apiClient.get<{ data?: BackendProductRaw }>(`/products/${encodeURIComponent(cleanSlug)}`);
      if (res?.data) {
        return mapBackendProductToFrontend(res.data);
      }
    } catch (e) {
      console.warn("Live backend product by slug fetch fallback:", e);
    }

    try {
      // Robust fuzzy/prefix fallback across all products
      const all = await this.getAll();
      const normSlug = cleanSlug.toLowerCase().replace(/[-_]/g, "");
      const matched = all.find((p) => {
        const pNorm = p.slug.toLowerCase().replace(/[-_]/g, "");
        return (
          p.slug === cleanSlug ||
          pNorm === normSlug ||
          p.slug.startsWith(cleanSlug.replace(/-+$/, "")) ||
          cleanSlug.startsWith(p.slug) ||
          (cleanSlug.length > 10 && pNorm.includes(normSlug)) ||
          (pNorm.length > 10 && normSlug.includes(pNorm))
        );
      });
      if (matched) return matched;
    } catch (e) {
      console.warn("Fuzzy product slug match error:", e);
    }

    return null;
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
