import { Category, MainCategoryId, Subcategory } from "@/types";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { delay } from "@/lib/utils";
import { apiClient } from "@/services/api.client";

interface BackendCategoryRaw {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  children?: Array<{ id: number | string; name: string; slug: string; description?: string }>;
}

function mapBackendCategoryToFrontend(c: BackendCategoryRaw, index: number): Category {
  const numStr = String(index + 1).padStart(2, "0");
  const matchingStatic = CATEGORIES_DATA.find((item) => item.slug === c.slug);

  const subcats: Subcategory[] = c.children && c.children.length > 0
    ? c.children.map((ch) => ({
        id: String(ch.id),
        slug: ch.slug,
        name: ch.name,
        description: ch.description || "",
      }))
    : matchingStatic?.subcategories || [];

  return {
    id: (matchingStatic?.id || (c.slug as MainCategoryId)) as MainCategoryId,
    slug: c.slug,
    name: c.name,
    number: matchingStatic?.number || numStr,
    shortDescription: matchingStatic?.shortDescription || c.description || "",
    description: c.description || matchingStatic?.description || "",
    heroImage: c.image_url || matchingStatic?.heroImage || "/placeholder.jpg",
    subcategories: subcats,
    technicalHighlights: matchingStatic?.technicalHighlights || [
      "Precision computerized cutting",
      "ISO 9001 certified stitching line",
      "OEKO-TEX standard yarn certification",
    ],
    capabilities: matchingStatic?.capabilities || [
      "Custom embroidery & sublimation",
      "AQL 2.5 needle scan quality control",
      "Private label branding & polybags",
    ],
    faqs: matchingStatic?.faqs || [],
  };
}

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    try {
      const res = await apiClient.get<{ data?: BackendCategoryRaw[] }>("/categories");
      const list = res?.data;
      if (list && list.length > 0) {
        return list.map(mapBackendCategoryToFrontend);
      }
    } catch (e) {
      console.warn("Live backend categories fetch fallback:", e);
    }
    await delay(50);
    return [...CATEGORIES_DATA];
  },

  async getBySlug(slug: string): Promise<Category | null> {
    try {
      const res = await apiClient.get<{ data?: BackendCategoryRaw }>(`/categories/${slug}`);
      if (res?.data) {
        return mapBackendCategoryToFrontend(res.data, 0);
      }
    } catch (e) {
      console.warn("Live backend category by slug fetch fallback:", e);
    }
    await delay(50);
    return CATEGORIES_DATA.find((c) => c.slug === slug) || null;
  },

  async getById(id: string): Promise<Category | null> {
    const all = await this.getAll();
    return all.find((c) => c.id === id) || CATEGORIES_DATA.find((c) => c.id === id) || null;
  },
};
