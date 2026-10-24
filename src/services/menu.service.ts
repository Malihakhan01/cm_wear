import { apiClient } from "@/services/api.client";
import { siteConfig } from "@/config/site.config";
import { MEGA_MENU_TAXONOMY, SubcategoryGroup, ProductTypeItem } from "@/config/megaMenuData";

export type MegaMenuProductType = ProductTypeItem;
export type MegaMenuSubcategoryGroup = SubcategoryGroup;

export interface MegaMenuPillar {
  id: string;
  slug: string;
  name: string;
  number: string;
  image: string;
  tagline?: string;
  subcategories: string[];
  groups?: MegaMenuSubcategoryGroup[];
}

interface MenuApiResponse {
  success: boolean;
  data: MegaMenuPillar[];
}

function normalizeDivisionSlug(slugOrId: string): string {
  const norm = (slugOrId || "").toLowerCase().replace(/[-_\s]/g, "");
  if (norm.includes("teamsport") || norm === "sportswear") return "team-sports-wear";
  if (norm.includes("martial") || norm.includes("combat")) return "martial-arts-combat-wear";
  if (norm.includes("fitness") || norm.includes("activewear")) return "activewear-fitness";
  if (norm.includes("casual") || norm.includes("lifestyle") || norm.includes("street")) return "casual-lifestyle-wear";
  if (norm.includes("jacket") || norm.includes("outerwear") || norm.includes("varsity")) return "jackets-outerwear";
  if (norm.includes("kid") || norm.includes("youth")) return "kids-youth-wear";
  if (norm.includes("safety") || norm.includes("workwear") || norm.includes("medical")) return "workwear-medical-wear";
  if (norm.includes("accessori")) return "sports-accessories";
  if (norm.includes("glove")) return "gloves";
  return norm;
}

function enrichPillarsWithTaxonomy(pillars: MegaMenuPillar[]): MegaMenuPillar[] {
  // If taxonomy has 9 pillars and input has fewer or legacy names, ensure all 9 client divisions are present
  const taxMap = new Map<string, typeof MEGA_MENU_TAXONOMY[0]>();
  MEGA_MENU_TAXONOMY.forEach((t) => {
    taxMap.set(t.slug, t);
    taxMap.set(t.id, t);
    taxMap.set(normalizeDivisionSlug(t.slug), t);
  });

  const processed: MegaMenuPillar[] = [];
  const handledKeys = new Set<string>();

  for (const pillar of pillars) {
    const key = normalizeDivisionSlug(pillar.slug || pillar.id);
    const tax = taxMap.get(key);

    if (tax) {
      handledKeys.add(tax.slug);
      processed.push({
        ...pillar,
        id: tax.id,
        slug: tax.slug,
        name: tax.name,
        number: tax.number,
        image: pillar.image && !pillar.image.includes("Casual wear (1).png") ? pillar.image : tax.image,
        tagline: pillar.tagline || tax.tagline,
        subcategories: tax.subcategories,
        groups: tax.groups,
      });
    } else {
      processed.push(pillar);
    }
  }

  // Ensure any missing taxonomy divisions (e.g. 05 Jackets, 06 Kids, 08 Accessories) are merged in
  for (const tax of MEGA_MENU_TAXONOMY) {
    if (!handledKeys.has(tax.slug)) {
      processed.push({
        id: tax.id,
        slug: tax.slug,
        name: tax.name,
        number: tax.number,
        image: tax.image,
        tagline: tax.tagline,
        subcategories: tax.subcategories,
        groups: tax.groups,
      });
      handledKeys.add(tax.slug);
    }
  }

  // Sort by number "01", "02", ... "09"
  processed.sort((a, b) => (a.number || "").localeCompare(b.number || ""));
  return processed;
}

let cachedMenu: MegaMenuPillar[] | null = null;

export const menuService = {
  getCachedMenu(): MegaMenuPillar[] {
    if (cachedMenu && cachedMenu.length > 0) {
      return cachedMenu;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cm_header_mega_menu_v3");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const enriched = enrichPillarsWithTaxonomy(parsed);
            cachedMenu = enriched;
            return enriched;
          }
        }
      } catch (e) {}
    }
    const defaults = enrichPillarsWithTaxonomy(MEGA_MENU_TAXONOMY);
    cachedMenu = defaults;
    return defaults;
  },

  async getHeaderMegaMenu(forceFresh = false): Promise<MegaMenuPillar[]> {
    if (!forceFresh && cachedMenu && cachedMenu.length > 0) {
      this.revalidateInBackground();
      return cachedMenu;
    }

    if (typeof window !== "undefined" && !cachedMenu) {
      try {
        const stored = localStorage.getItem("cm_header_mega_menu_v3");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedMenu = enrichPillarsWithTaxonomy(parsed);
          }
        }
      } catch (e) {}
    }

    try {
      const res = await apiClient.get<MenuApiResponse>(`/menu/header?_t=${Date.now()}`, {
        timeoutMs: 6000,
        cache: "no-store" as RequestCache,
        headers: { "Cache-Control": "no-cache" },
      });

      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const enriched = enrichPillarsWithTaxonomy(res.data);
        const hasChanged = JSON.stringify(cachedMenu) !== JSON.stringify(enriched);
        cachedMenu = enriched;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("cm_header_mega_menu_v3", JSON.stringify(enriched));
            if (hasChanged) {
              window.dispatchEvent(new CustomEvent("cm_menu_updated", { detail: enriched }));
            }
          } catch (e) {}
        }
        return enriched;
      }
    } catch (e) {
      console.warn("Could not fetch live header mega menu, using taxonomy fallback:", e);
    }

    if (cachedMenu && cachedMenu.length > 0) {
      return cachedMenu;
    }

    const fallback = enrichPillarsWithTaxonomy(MEGA_MENU_TAXONOMY);
    cachedMenu = fallback;
    return fallback;
  },

  revalidateInBackground(): void {
    if (typeof window === "undefined") return;
    apiClient
      .get<MenuApiResponse>(`/menu/header?_t=${Date.now()}`, {
        timeoutMs: 6000,
        cache: "no-store" as RequestCache,
        headers: { "Cache-Control": "no-cache" },
      })
      .then((res) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const enriched = enrichPillarsWithTaxonomy(res.data);
          const hasChanged = JSON.stringify(cachedMenu) !== JSON.stringify(enriched);
          if (hasChanged) {
            cachedMenu = enriched;
            try {
              localStorage.setItem("cm_header_mega_menu_v3", JSON.stringify(enriched));
            } catch (e) {}
            window.dispatchEvent(new CustomEvent("cm_menu_updated", { detail: enriched }));
          }
        }
      })
      .catch(() => {});
  },
};
