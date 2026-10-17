import { apiClient } from "@/services/api.client";
import { siteConfig } from "@/config/site.config";

export interface MegaMenuPillar {
  id: string;
  slug: string;
  name: string;
  number: string;
  image: string;
  tagline?: string;
  subcategories: string[];
}

interface MenuApiResponse {
  success: boolean;
  data: MegaMenuPillar[];
}

let cachedMenu: MegaMenuPillar[] | null = null;

export const menuService = {
  async getHeaderMegaMenu(): Promise<MegaMenuPillar[]> {
    if (cachedMenu && cachedMenu.length > 0) {
      return cachedMenu;
    }

    // Try reading cached copy from localStorage for instantaneous hydration
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cm_header_mega_menu");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedMenu = parsed;
          }
        }
      } catch (e) {
        // Ignore JSON error
      }
    }

    try {
      const res = await apiClient.get<MenuApiResponse>("/menu/header", { timeoutMs: 4000 });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        cachedMenu = res.data;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("cm_header_mega_menu", JSON.stringify(res.data));
          } catch (e) {
            // Storage full / private mode
          }
        }
        return res.data;
      }
    } catch (e) {
      console.warn("Could not fetch live header mega menu, using cached / default fallback:", e);
    }

    // Return cached if available, else static default
    if (cachedMenu && cachedMenu.length > 0) {
      return cachedMenu;
    }

    return siteConfig.mainCategories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      number: c.number,
      image: c.image,
      tagline: "Minimum order 30–50 pieces with full Pantone lab-dip matching and custom tech-pack development.",
      subcategories: c.subcategories,
    }));
  },
};
