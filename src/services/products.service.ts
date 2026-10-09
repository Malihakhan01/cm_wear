import { Product, FilterState } from "@/types";
import { PRODUCTS_DATA } from "@/data/products.data";
import { delay } from "@/lib/utils";

export { PRODUCTS_DATA };

export const productsService = {
  async getAll(): Promise<Product[]> {
    await delay(100);
    return [...PRODUCTS_DATA];
  },

  async getBySlug(slug: string): Promise<Product | null> {
    await delay(100);
    return PRODUCTS_DATA.find((p) => p.slug === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    await delay(50);
    return PRODUCTS_DATA.find((p) => p.id === id) || null;
  },

  async getByCategory(category: string): Promise<Product[]> {
    await delay(100);
    return PRODUCTS_DATA.filter((p) => p.category === category);
  },

  async getFeatured(): Promise<Product[]> {
    await delay(50);
    return PRODUCTS_DATA.filter((p) => p.featured);
  },

  async filterProducts(filters: FilterState): Promise<Product[]> {
    await delay(150);
    return PRODUCTS_DATA.filter((p) => {
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
