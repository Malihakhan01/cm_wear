import { Category } from "@/types";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { delay } from "@/lib/utils";

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    await delay(50);
    return [...CATEGORIES_DATA];
  },

  async getBySlug(slug: string): Promise<Category | null> {
    await delay(50);
    return CATEGORIES_DATA.find((c) => c.slug === slug) || null;
  },

  async getById(id: string): Promise<Category | null> {
    await delay(50);
    return CATEGORIES_DATA.find((c) => c.id === id) || null;
  },
};
