"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Category, MainCategoryId, Product } from "@/types";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import { menuService } from "@/services/menu.service";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { Search, SlidersHorizontal, ArrowRight, Box, ChevronDown, X } from "lucide-react";

function findParentCategorySlug(slugOrName: string): string {
  const norm = (slugOrName || "").toLowerCase().replace(/[-_\s]/g, "");

  // 1. Gloves
  if (norm.includes("glove")) {
    return "gloves";
  }
  // 2. Martial Arts & Combat Wear
  if (
    norm.includes("martial") ||
    norm.includes("combat") ||
    norm.includes("bjj") ||
    norm.includes("grappling") ||
    norm.includes("mma") ||
    norm.includes("boxing") ||
    norm.includes("karate") ||
    norm.includes("judo") ||
    norm.includes("taekwondo") ||
    norm.includes("wrestling") ||
    norm.includes("aikido") ||
    norm.includes("kungfu") ||
    norm.includes("championshipbelt")
  ) {
    return "martial-arts-combat-wear";
  }
  // 3. Workwear & Medical Wear
  if (
    norm.includes("medical") ||
    norm.includes("scrub") ||
    norm.includes("workwear") ||
    norm.includes("safety") ||
    norm.includes("reflective") ||
    norm.includes("hivis") ||
    norm.includes("highvisibility") ||
    norm.includes("flame") ||
    norm.includes("industrial")
  ) {
    return "workwear-medical-wear";
  }
  // 4. Jackets & Outerwear
  if (
    norm.includes("jacket") ||
    norm.includes("outerwear") ||
    norm.includes("varsity") ||
    norm.includes("leather") ||
    norm.includes("softshell") ||
    norm.includes("windbreaker") ||
    norm.includes("rainwear") ||
    norm.includes("winterwear") ||
    norm.includes("equestrian") ||
    norm.includes("riding")
  ) {
    return "jackets-outerwear";
  }
  // 5. Activewear & Fitness
  if (
    norm.includes("fitness") ||
    norm.includes("activewear") ||
    norm.includes("gym") ||
    norm.includes("compression") ||
    norm.includes("running") ||
    norm.includes("cycling") ||
    norm.includes("athletic") ||
    norm.includes("legging") ||
    norm.includes("sportsbra")
  ) {
    return "activewear-fitness";
  }
  // 6. Casual & Lifestyle Wear
  if (
    norm.includes("casual") ||
    norm.includes("streetwear") ||
    norm.includes("lifestyle") ||
    norm.includes("hoodie") ||
    norm.includes("sweatshirt") ||
    norm.includes("tshirt") ||
    norm.includes("tee") ||
    norm.includes("polo") ||
    norm.includes("tracksuit") ||
    norm.includes("sweatpant") ||
    norm.includes("cargopant") ||
    norm.includes("pant") ||
    norm.includes("short") ||
    norm.includes("bavarian") ||
    norm.includes("trachten")
  ) {
    return "casual-lifestyle-wear";
  }
  // 7. Kids & Youth Wear
  if (
    norm.includes("kid") ||
    norm.includes("youth") ||
    norm.includes("junior") ||
    norm.includes("child")
  ) {
    return "kids-youth-wear";
  }
  // 8. Sports Accessories
  if (
    norm.includes("accessori") ||
    norm.includes("sock") ||
    norm.includes("bib") ||
    norm.includes("cap") ||
    norm.includes("headband") ||
    norm.includes("wristband") ||
    norm.includes("bag") ||
    norm.includes("belt")
  ) {
    return "sports-accessories";
  }
  // Default to Team Sports Wear (soccer, basketball, hockey, baseball, rugby, cricket, archery, rowing, sailing, shooting, skiing, squash, etc.)
  return "team-sports-wear";
}

function isProductInParentCategory(p: Product, parentCat: Category): boolean {
  const normActive = parentCat.slug.toLowerCase().replace(/[-_\s]/g, "");
  const prodCatNorm = (p.category || "").toLowerCase().replace(/[-_\s]/g, "");
  const prodSubNorm = (p.subcategory || "").toLowerCase().replace(/[-_\s]/g, "");

  // Direct match
  if (prodCatNorm === normActive || p.category === parentCat.slug || p.category === parentCat.id) {
    return true;
  }

  // Mapped parent category check
  if (findParentCategorySlug(p.category || "") === parentCat.slug) {
    return true;
  }

  // Check subcategories list
  if (parentCat.subcategories && parentCat.subcategories.length > 0) {
    const hasSub = parentCat.subcategories.some((sub) => {
      const sSlug = (sub.slug || "").toLowerCase().replace(/[-_\s]/g, "");
      const sName = (sub.name || "").toLowerCase().replace(/[-_\s]/g, "");
      return (
        prodCatNorm === sSlug ||
        prodCatNorm === sName ||
        prodSubNorm === sSlug ||
        prodSubNorm === sName ||
        (sSlug.length > 3 && prodCatNorm.includes(sSlug)) ||
        (sName.length > 3 && prodCatNorm.includes(sName)) ||
        (sSlug.length > 3 && prodSubNorm.includes(sSlug)) ||
        (sName.length > 3 && prodSubNorm.includes(sName))
      );
    });
    if (hasSub) return true;
  }

  // Check rawCategories
  if (p.rawCategories && p.rawCategories.length > 0) {
    const rawMatch = p.rawCategories.some((rc: any) => {
      const rcSlug = (rc.slug || "").toLowerCase().replace(/[-_\s]/g, "");
      const rcName = (rc.name || "").toLowerCase().replace(/[-_\s]/g, "");
      if (rcSlug === normActive || rcName === normActive) return true;
      if (findParentCategorySlug(rc.slug || rc.name || "") === parentCat.slug) return true;
      if (parentCat.subcategories && parentCat.subcategories.length > 0) {
        return parentCat.subcategories.some((sub) => {
          const sSlug = (sub.slug || "").toLowerCase().replace(/[-_\s]/g, "");
          const sName = (sub.name || "").toLowerCase().replace(/[-_\s]/g, "");
          return rcSlug === sSlug || rcName === sName;
        });
      }
      return false;
    });
    if (rawMatch) return true;
  }

  return false;
}

function getSportswearSubcategoryPriority(nameOrSlug: string): number {
  const text = (nameOrSlug || "").toLowerCase();
  if (text.includes("ice hockey") || text.includes("ice-hockey")) return 1;
  if (text.includes("american football") || text.includes("american-football") || text.includes("gridiron")) return 2;
  if (text.includes("hockey")) return 3;
  if (text.includes("soccer") || (text.includes("football") && !text.includes("american") && !text.includes("gridiron"))) return 4;
  if (text.includes("basketball")) return 5;
  if (text.includes("baseball") || text.includes("softball")) return 6;
  if (text.includes("cricket")) return 7;
  if (text.includes("rugby")) return 8;
  if (text.includes("lacrosse")) return 9;
  if (text.includes("volleyball")) return 10;
  if (text.includes("tennis") || text.includes("golf")) return 11;
  return 100;
}

function getSportswearProductPriority(p: Product): number {
  const rawCatNames = p.rawCategories ? p.rawCategories.map((rc: any) => `${rc.name} ${rc.slug}`).join(" ") : "";
  const text = `${p.name} ${p.subcategory || ""} ${p.category || ""} ${rawCatNames}`.toLowerCase();

  // 1. Ice Hockey first
  if (text.includes("ice hockey") || text.includes("hockey")) return 1;

  // 2. American Football then
  if (text.includes("american football") || text.includes("american") || text.includes("gridiron")) return 2;

  // 3. Soccer then (ensure not american football)
  if (text.includes("soccer") || (text.includes("football") && !text.includes("american") && !text.includes("gridiron"))) return 3;

  // 4. Basketball then
  if (text.includes("basketball")) return 4;

  // 5. Baseball & Softball
  if (text.includes("baseball") || text.includes("softball")) return 5;

  // 6. Cricket
  if (text.includes("cricket")) return 6;

  // 7. Rugby
  if (text.includes("rugby")) return 7;

  // 8. Lacrosse
  if (text.includes("lacrosse")) return 8;

  // 9. Volleyball
  if (text.includes("volleyball")) return 9;

  // 10. Tennis & Golf
  if (text.includes("tennis") || text.includes("golf")) return 10;

  return 100;
}

function matchesSportSubcategory(pSubOrCat: string, targetSub: string): boolean {
  const normP = (pSubOrCat || "").toLowerCase().replace(/[-_\s&]/g, "");
  const normT = (targetSub || "").toLowerCase().replace(/[-_\s&]/g, "");
  if (!normP || !normT) return false;
  if (normP === normT || (normT.length > 3 && normP.includes(normT)) || (normP.length > 3 && normT.includes(normP))) return true;

  if (normT.includes("icehockey") || normT.includes("hockey")) {
    return normP.includes("hockey");
  }
  if (normT.includes("soccer") || (normT.includes("football") && !normT.includes("american"))) {
    return normP.includes("soccer") || (normP.includes("football") && !normP.includes("american"));
  }
  if (normT.includes("americanfootball") || normT.includes("american")) {
    return normP.includes("american") || normP.includes("gridiron");
  }
  if (normT.includes("basketball")) {
    return normP.includes("basketball");
  }
  if (normT.includes("baseball") || normT.includes("softball")) {
    return normP.includes("baseball") || normP.includes("softball");
  }
  if (normT.includes("cricket")) {
    return normP.includes("cricket");
  }
  if (normT.includes("rugby")) {
    return normP.includes("rugby");
  }
  if (normT.includes("volleyball")) {
    return normP.includes("volleyball");
  }
  if (normT.includes("tennis") || normT.includes("golf")) {
    return normP.includes("tennis") || normP.includes("golf");
  }

  return false;
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const paramCat = searchParams.get("category");
  const initialCategory = paramCat !== null ? paramCat : "team-sports-wear";
  const initialSubcategory = searchParams.get("subcategory") || "all";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [categories, setCategories] = useState<Category[]>(() => CATEGORIES_DATA);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string>(initialSubcategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "moq-asc">("featured");

  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [mobileDrawerCat, setMobileDrawerCat] = useState<Category | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mode, toggleMode } = useStoreModeStore();

  useEffect(() => {
    const loadCatalogData = () => {
      Promise.all([
        productsService.getAll().catch(() => []),
        categoriesService.getAll().catch(() => []),
        menuService.getHeaderMegaMenu().catch(() => []),
      ]).then(([prods, liveCats, megaMenu]) => {
        if (prods && prods.length > 0) {
          setAllProducts(prods);
        } else {
          setAllProducts(PRODUCTS_DATA);
        }
        setLoading(false);

        const mergedMap = new Map<string, Category>();

        // 1. Populate ONLY with the main parent categories (from megaMenu or static CATEGORIES_DATA)
        const baseParentCats =
          megaMenu && megaMenu.length > 0
            ? megaMenu.map((m, idx) => {
                const numStr = m.number || String(idx + 1).padStart(2, "0");
                const matchingStatic = CATEGORIES_DATA.find((c) => c.slug === m.slug || c.id === m.id);
                const subs = (m.subcategories || []).map((subName) => ({
                  id: subName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  slug: subName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  name: subName,
                }));

                return {
                  id: (m.slug as MainCategoryId) || (matchingStatic?.id as MainCategoryId),
                  slug: m.slug,
                  name: m.name,
                  number: numStr,
                  shortDescription:
                    matchingStatic?.shortDescription ||
                    m.tagline ||
                    `Custom manufacturing and private label production for ${m.name}.`,
                  description:
                    matchingStatic?.description ||
                    m.tagline ||
                    `Export-grade apparel production for ${m.name} with comprehensive size grading and custom finishes.`,
                  heroImage: m.image || matchingStatic?.heroImage || "/placeholder.jpg",
                  subcategories: subs,
                  technicalHighlights: matchingStatic?.technicalHighlights || [
                    "Industrial High-Density Stitching",
                    "Custom Fabric Selection & Sizing Specs",
                    "OEM / ODM Private Label Branding",
                  ],
                  capabilities: matchingStatic?.capabilities || [
                    "Custom Embroidery & Embellishments",
                    "Bar-tack Reinforced Construction",
                    "Polybag Packaging & Hangtags",
                  ],
                  faqs: matchingStatic?.faqs || [],
                };
              })
            : CATEGORIES_DATA;

        baseParentCats.forEach((c) => {
          mergedMap.set(c.slug, {
            ...c,
            subcategories: [...(c.subcategories || [])],
          });
        });

        // 2. Attach live subcategories from liveCats into their respective parent categories (DO NOT add as root tabs)
        if (liveCats && liveCats.length > 0) {
          liveCats.forEach((c) => {
            if (mergedMap.has(c.slug)) {
              // It is a parent category: merge its subcategories
              const existing = mergedMap.get(c.slug)!;
              if (c.subcategories && c.subcategories.length > 0) {
                const subMap = new Map<string, { id: string; slug: string; name: string }>();
                existing.subcategories.forEach((s) => subMap.set(s.slug, s));
                c.subcategories.forEach((s) => subMap.set(s.slug, s));
                existing.subcategories = Array.from(subMap.values());
              }
            } else {
              // It is a child category: nest inside its parent category, NEVER add as a top-level tab
              const parentSlug = findParentCategorySlug(c.slug || c.name);
              const parent = mergedMap.get(parentSlug);
              if (parent) {
                const exists = parent.subcategories.some(
                  (s) => s.slug === c.slug || s.name.toLowerCase() === c.name.toLowerCase()
                );
                if (!exists) {
                  parent.subcategories.push({
                    id: String(c.id || c.slug),
                    slug: c.slug,
                    name: c.name,
                    description: c.description,
                  });
                }
              }
            }
          });
        }

        // 3. Attach imported product categories into parent subcategories (NEVER as root tabs)
        if (prods && prods.length > 0) {
          prods.forEach((p) => {
            if (p.category && !mergedMap.has(p.category)) {
              const parentSlug = findParentCategorySlug(p.category);
              const parent = mergedMap.get(parentSlug);
              if (parent) {
                const subSlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const subName = p.category
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
                const exists = parent.subcategories.some(
                  (s) => s.slug === subSlug || s.name.toLowerCase() === subName.toLowerCase()
                );
                if (!exists) {
                  parent.subcategories.push({
                    id: subSlug,
                    slug: subSlug,
                    name: subName,
                  });
                }
              }
            }
          });
        }

        // Ensure Team Sportswear subcategories have Ice Hockey Uniforms first and American Football Uniform second
        mergedMap.forEach((parentCat) => {
          const isSport =
            parentCat.slug === "team-sports-wear" ||
            parentCat.slug === "sportswear" ||
            parentCat.id === "team-sports-wear" ||
            parentCat.id === "sportswear" ||
            (parentCat.name || "").toLowerCase().includes("sport");

          if (isSport && parentCat.subcategories) {
            const others = parentCat.subcategories.filter((s) => {
              const str = (s.name || s.slug || "").toLowerCase();
              return (
                !str.includes("ice hockey") &&
                !str.includes("american football") &&
                str !== "ice hockey uniforms" &&
                str !== "american football uniform"
              );
            });

            parentCat.subcategories = [
              { id: "ice-hockey-uniforms", slug: "ice-hockey-uniforms", name: "Ice Hockey Uniforms" },
              { id: "american-football-uniform", slug: "american-football-uniform", name: "American Football Uniform" },
              ...others,
            ];

            parentCat.subcategories.sort((a, b) => {
              const prioA = getSportswearSubcategoryPriority(a.name || a.slug);
              const prioB = getSportswearSubcategoryPriority(b.name || b.slug);
              if (prioA !== prioB) return prioA - prioB;
              return (a.name || a.slug).localeCompare(b.name || b.slug);
            });
          }
        });

        setCategories(Array.from(mergedMap.values()));
      });
    };

    loadCatalogData();

    const handleUpdate = () => loadCatalogData();
    window.addEventListener("cm_products_updated", handleUpdate);
    window.addEventListener("cm_menu_updated", handleUpdate);
    return () => {
      window.removeEventListener("cm_products_updated", handleUpdate);
      window.removeEventListener("cm_menu_updated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    const sub = searchParams.get("subcategory");
    if (cat) {
      const isParent = categories.some((c) => c.slug === cat || c.id === cat);
      if (isParent) {
        setActiveCategory(cat);
        if (sub) setActiveSubcategory(sub);
      } else {
        const parentSlug = findParentCategorySlug(cat);
        setActiveCategory(parentSlug);
        setActiveSubcategory(cat);
      }
    } else if (sub) {
      setActiveSubcategory(sub);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    setVisibleCount(8);
  }, [activeCategory, activeSubcategory, searchQuery, sortBy]);

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      setHoveredCat(null);
      setDropdownPos(null);
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleCategoryMouseEnter = (cat: Category, btnElement: HTMLButtonElement) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (!cat.subcategories || cat.subcategories.length === 0) {
      setHoveredCat(null);
      setDropdownPos(null);
      return;
    }

    const rect = btnElement.getBoundingClientRect();
    const dropdownWidth = 320;
    let left = rect.left;

    if (typeof window !== "undefined") {
      if (left + dropdownWidth > window.innerWidth - 16) {
        left = Math.max(16, window.innerWidth - dropdownWidth - 16);
      }
      if (left < 16) {
        left = 16;
      }
    }

    setDropdownPos({
      top: rect.bottom + 4,
      left: left,
    });
    setHoveredCat(cat);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCat(null);
      setDropdownPos(null);
    }, 220);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCat(null);
      setDropdownPos(null);
    }, 220);
  };

  const getSubcategoryCount = (category: Category, subName: string): number => {
    return allProducts.filter((p) => {
      if (!isProductInParentCategory(p, category)) return false;
      const pSub = p.subcategory || "";
      const pCat = p.category || "";
      const pName = p.name || "";
      return (
        matchesSportSubcategory(pSub, subName) ||
        matchesSportSubcategory(pCat, subName) ||
        matchesSportSubcategory(pName, subName) ||
        (p.rawCategories &&
          p.rawCategories.some((rc: any) =>
            matchesSportSubcategory(rc.slug || "", subName) ||
            matchesSportSubcategory(rc.name || "", subName)
          ))
      );
    }).length;
  };

  function normalizeCategoryTarget(slugOrName?: string): string {
    const norm = (slugOrName || "").toLowerCase().replace(/[-_\s]/g, "");
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

  const currentCategoryData = categories.find(
    (c) =>
      c.id === activeCategory ||
      c.slug === activeCategory ||
      c.slug.toLowerCase().replace(/[-_\s]/g, "") === activeCategory.toLowerCase().replace(/[-_\s]/g, "") ||
      normalizeCategoryTarget(c.slug) === normalizeCategoryTarget(activeCategory)
  );

  const filteredProducts = allProducts
    .filter((p) => {
      if (activeCategory !== "all") {
        const selectedParent = categories.find(
          (c) =>
            c.id === activeCategory ||
            c.slug === activeCategory ||
            normalizeCategoryTarget(c.slug) === normalizeCategoryTarget(activeCategory)
        );

        if (selectedParent) {
          if (!isProductInParentCategory(p, selectedParent)) return false;
        } else {
          // In case activeCategory is a direct subcategory slug
          const normActive = activeCategory.toLowerCase().replace(/[-_\s]/g, "");
          const prodCatNorm = (p.category || "").toLowerCase().replace(/[-_\s]/g, "");
          const prodSubNorm = (p.subcategory || "").toLowerCase().replace(/[-_\s]/g, "");
          const hasDirectMatch =
            prodCatNorm === normActive ||
            prodSubNorm === normActive ||
            (p.rawCategories &&
              p.rawCategories.some((c: any) => {
                const cSlug = (c.slug || "").toLowerCase().replace(/[-_\s]/g, "");
                const cName = (c.name || "").toLowerCase().replace(/[-_\s]/g, "");
                return cSlug === normActive || cName === normActive;
              }));
          if (!hasDirectMatch) return false;
        }
      }

      if (activeSubcategory !== "all") {
        const subTarget = activeSubcategory;
        const pSub = p.subcategory || "";
        const pCat = p.category || "";
        const pName = p.name || "";

        const hasSubMatch =
          matchesSportSubcategory(pSub, subTarget) ||
          matchesSportSubcategory(pCat, subTarget) ||
          matchesSportSubcategory(pName, subTarget) ||
          (p.rawCategories &&
            p.rawCategories.some((c: any) =>
              matchesSportSubcategory(c.slug || "", subTarget) ||
              matchesSportSubcategory(c.name || "", subTarget)
            ));

        if (!hasSubMatch) return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchDesc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.retailPrice - b.retailPrice;
      if (sortBy === "price-desc") return b.retailPrice - a.retailPrice;
      if (sortBy === "moq-asc") return a.MOQ - b.MOQ;

      // Default "featured": prioritize Ice Hockey first, then Soccer, then American Football, then Basketball
      const prioA = getSportswearProductPriority(a);
      const prioB = getSportswearProductPriority(b);
      if (prioA !== prioB) return prioA - prioB;
      return 0;
    });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="w-full bg-[#FFFFFF]">
      
      {/* Editorial Header */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="eyebrow-label text-[#FF333D]">
                EXPORT ARCHIVE • {String(categories.length).padStart(2, "0")} DIVISIONS
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white font-display">
                Complete Apparel Catalog
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl font-sans">
                Browse our verified export production catalog. Every silhouette is engineered for custom private label manufacturing, sublimation, or technical team kits.
              </p>
            </div>

            {/* Actions: Mode Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-[#20201E] border border-[#3A3A36] p-2 rounded-[2px]">
                <span className="text-xs font-mono uppercase text-neutral-400 pl-2">
                  Purchasing Mode:
                </span>
                <button
                  onClick={toggleMode}
                  className="px-3.5 py-1.5 bg-[#0A0A0A] border border-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px]"
                >
                  <span className="text-[#FF333D]">{mode.toUpperCase()}</span>
                  <span className="text-[10px] text-neutral-400 ml-1.5">(Switch)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar: Relative on Mobile (scrolls naturally with page) and Sticky on Desktop */}
      <section className="bg-[#F4F4EF] border-b border-[#DADBD2] py-4 relative lg:sticky lg:top-[72px] z-30 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          {/* Category Tabs */}
          <div
            onScroll={() => {
              if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
              setHoveredCat(null);
              setDropdownPos(null);
            }}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
          >
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveSubcategory("all");
                setHoveredCat(null);
                setDropdownPos(null);
              }}
              onMouseEnter={() => {
                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                setHoveredCat(null);
                setDropdownPos(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition-all shrink-0 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#0A0A0A] text-white border border-[#0A0A0A]"
                  : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2] hover:border-black"
              }`}
            >
              All Disciplines {allProducts.length > 0 ? `(${allProducts.length})` : loading ? "" : "(0)"}
            </button>
            {categories.map((cat) => {
              const isHovered = hoveredCat?.id === cat.id;
              const isActive =
                activeCategory === cat.id ||
                activeCategory === cat.slug ||
                normalizeCategoryTarget(activeCategory) === normalizeCategoryTarget(cat.slug) ||
                normalizeCategoryTarget(activeCategory) === normalizeCategoryTarget(cat.id);
              const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      if (hasSubcategories) {
                        setMobileDrawerCat(cat);
                        return;
                      }
                    }
                    setActiveCategory(cat.id);
                    setActiveSubcategory("all");
                    setHoveredCat(null);
                    setDropdownPos(null);
                  }}
                  onMouseEnter={(e) => handleCategoryMouseEnter(cat, e.currentTarget)}
                  onMouseLeave={handleMouseLeave}
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isHovered
                      ? "bg-[#D61C24] text-white border border-[#D61C24] shadow-sm"
                      : isActive
                      ? "bg-[#0A0A0A] text-white border border-[#0A0A0A]"
                      : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2] hover:border-black"
                  }`}
                >
                  <span
                    className={`text-[10px] ${
                      isHovered ? "text-white/90" : isActive ? "text-[#FF333D]" : "text-[#D61C24]"
                    }`}
                  >
                    {cat.number}
                  </span>
                  <span>{cat.name}</span>
                  {hasSubcategories && (
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isHovered ? "rotate-180 text-white" : "text-[#72726D]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Subcategory Tabs Row for Current Selected Category */}
          {currentCategoryData && currentCategoryData.subcategories && currentCategoryData.subcategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-[#DADBD2]/70">
              <button
                onClick={() => setActiveSubcategory("all")}
                className={`px-3 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition-all shrink-0 cursor-pointer ${
                  activeSubcategory === "all"
                    ? "bg-[#D61C24] text-white shadow-xs"
                    : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2] hover:border-black"
                }`}
              >
                All {currentCategoryData.name} ({allProducts.filter((p) => isProductInParentCategory(p, currentCategoryData)).length})
              </button>
              {currentCategoryData.subcategories.map((sub) => {
                const isSubActive = activeSubcategory.toLowerCase() === sub.name.toLowerCase();
                const count = getSubcategoryCount(currentCategoryData, sub.name);
                return (
                  <button
                    key={sub.id || sub.slug || sub.name}
                    onClick={() => setActiveSubcategory(sub.name)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isSubActive
                        ? "bg-[#D61C24] text-white shadow-xs"
                        : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2] hover:border-black"
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span className={`text-[10px] ${isSubActive ? "text-white/90" : "text-[#A8A8A8]"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Filter Indicator Tags (Subcategories removed from slide) */}
          {(activeCategory !== "all" || activeSubcategory !== "all") && (
            <div className="flex items-center gap-2 pt-1 border-t border-[#DADBD2] text-xs font-mono flex-wrap">
              <span className="text-[10px] text-[#72726D] uppercase font-bold tracking-wider">Filtered By:</span>
              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#0A0A0A] text-white text-[11px] font-mono uppercase rounded-[2px]">
                  <span>{currentCategoryData?.name || activeCategory}</span>
                  {activeSubcategory === "all" && (
                    <button
                      onClick={() => setActiveCategory("all")}
                      className="hover:text-[#FF333D] font-bold text-sm leading-none ml-1 cursor-pointer"
                      title="Clear category filter"
                    >
                      ×
                    </button>
                  )}
                </span>
              )}
              {activeSubcategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#D61C24] text-white text-[11px] font-mono uppercase rounded-[2px] font-bold">
                  <span>{activeSubcategory}</span>
                  <button
                    onClick={() => setActiveSubcategory("all")}
                    className="hover:text-black font-bold text-sm leading-none ml-1 cursor-pointer"
                    title="Clear subcategory filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveSubcategory("all");
                }}
                className="text-[10px] text-[#D61C24] hover:underline uppercase font-bold ml-1 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

            {/* Search, Badges & Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#DADBD2]">
              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#72726D] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword or SKU..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DADBD2] text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-[#DADBD2] px-2.5 py-1.5 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="moq-asc">MOQ: Lowest</option>
                </select>
              </div>
            </div>

        </div>
      </section>

      {/* Product Grid Area */}
      <section className="py-16 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DADBD2]">
            <div className="text-xs font-mono text-[#72726D]">
              {loading ? (
                <span className="flex items-center gap-2 text-black font-semibold">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#D61C24] animate-ping" />
                  Loading export catalog specimens...
                </span>
              ) : (
                <>Showing <strong className="text-black">{displayedProducts.length}</strong> of <strong className="text-black">{filteredProducts.length}</strong> apparel products</>
              )}
            </div>
            <div className="text-xs font-mono text-[#D61C24] font-bold">
              Bulk Volume Tier Pricing Active
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-[#DADBD2] rounded-[2px] p-2.5 sm:p-3 space-y-2 sm:space-y-3 bg-[#FAFAF8] overflow-hidden">
                  <div className="aspect-square bg-neutral-200/80 rounded-[2px] relative overflow-hidden animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  </div>
                  <div className="h-3.5 sm:h-4 bg-neutral-200/90 rounded-[2px] w-3/4 animate-pulse" />
                  <div className="h-2.5 sm:h-3 bg-neutral-200/70 rounded-[2px] w-1/2 animate-pulse" />
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                    <div className="h-3.5 sm:h-4 bg-neutral-200/80 rounded-[2px] w-1/3 animate-pulse" />
                    <div className="h-3 sm:h-3.5 bg-neutral-200/60 rounded-[2px] w-1/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : allProducts.length === 0 ? (
            <div className="py-20 text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-[#F4F4EF] border border-[#DADBD2] rounded-full flex items-center justify-center">
                <Box className="w-8 h-8 text-[#D61C24]" />
              </div>
              <div className="space-y-2">
                <span className="eyebrow-label text-[#D61C24]">CATALOG ARCHIVE</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                  Apparel Collections Updating
                </h2>
                <p className="text-sm text-[#72726D]">
                  Our seasonal private-label export catalog is currently being updated. You can design custom styles in our customizer studio or contact our factory production team.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/customize/custom-hoodie"
                  className="inline-flex px-6 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors items-center justify-center gap-2 shadow-md"
                >
                  <span>Open Customizer Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-sm text-[#72726D]">
                No styles found matching the current search criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveSubcategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-mono uppercase rounded-[2px] cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button and Pagination Status */}
              {filteredProducts.length > visibleCount && (
                <div className="mt-12 pt-6 border-t border-[#DADBD2] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs font-mono text-[#72726D]">
                    Showing <strong className="text-black">{displayedProducts.length}</strong> of{" "}
                    <strong className="text-black">{filteredProducts.length}</strong> products ({filteredProducts.length - displayedProducts.length} remaining)
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 8)}
                      className="flex-1 sm:flex-none px-8 py-3.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                    >
                      <span>Load More Products (+8)</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibleCount(filteredProducts.length)}
                      className="px-5 py-3.5 bg-white hover:bg-neutral-100 border border-[#DADBD2] hover:border-black text-[#0A0A0A] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-all cursor-pointer"
                      title="Load all remaining products"
                    >
                      <span>Show All ({filteredProducts.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {filteredProducts.length <= visibleCount && filteredProducts.length > 8 && (
                <div className="mt-12 pt-6 border-t border-[#DADBD2]/50 text-center text-xs font-mono text-[#72726D]">
                  ✓ All <strong className="text-black">{filteredProducts.length}</strong> apparel products loaded for this selection
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* Subcategory Hover Dropdown Menu */}
      {hoveredCat && dropdownPos && (
        <div
          style={{
            position: "fixed",
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            zIndex: 9999,
          }}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
          className="hidden lg:block w-80 bg-white border border-[#DADBD2] shadow-2xl rounded-[2px] overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* Dropdown Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#F0F0ED] bg-[#FAFAF8]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] truncate pr-2">
              {hoveredCat.name}
            </span>
            <button
              onClick={() => {
                setActiveCategory(hoveredCat.id);
                setActiveSubcategory("all");
                setHoveredCat(null);
                setDropdownPos(null);
              }}
              className="text-[10px] font-mono uppercase font-bold text-[#72726D] hover:text-[#D61C24] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Subcategory List */}
          <div className="max-h-[360px] overflow-y-auto py-1.5 scrollbar-thin">
            {(hoveredCat.subcategories || []).map((sub) => {
              const isSelected =
                (activeCategory === hoveredCat.id || activeCategory === hoveredCat.slug) &&
                activeSubcategory.toLowerCase() === sub.name.toLowerCase();
              const count = getSubcategoryCount(hoveredCat, sub.name);

              return (
                <button
                  key={sub.id || sub.slug || sub.name}
                  onClick={() => {
                    setActiveCategory(hoveredCat.id);
                    setActiveSubcategory(sub.name);
                    setHoveredCat(null);
                    setDropdownPos(null);
                  }}
                  className={`w-full group px-4 py-2 flex items-center justify-between text-left transition-colors text-xs cursor-pointer ${
                    isSelected
                      ? "bg-[#FFF1F2] text-[#D61C24] font-semibold"
                      : "text-[#333333] hover:bg-[#FFF1F2] hover:text-[#D61C24]"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className={`text-sm leading-none shrink-0 ${
                        isSelected ? "text-[#D61C24]" : "text-[#A8A8A8] group-hover:text-[#D61C24]"
                      }`}
                    >
                      •
                    </span>
                    <span className="truncate">{sub.name}</span>
                  </span>
                  <span
                    className={`text-[11px] font-mono ml-2 shrink-0 ${
                      isSelected ? "text-[#D61C24] font-bold" : "text-[#72726D] group-hover:text-[#D61C24]"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Category Sub-disciplines Drawer / Bottom Sheet */}
      {mobileDrawerCat && (
        <div
          className="lg:hidden fixed inset-0 z-[9999] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setMobileDrawerCat(null)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#DADBD2] animate-in slide-in-from-bottom duration-250 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#F0F0ED] bg-[#FAFAF8] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-[#D61C24] bg-[#F4F4EF] px-1.5 py-0.5 rounded-[2px]">
                    {mobileDrawerCat.number}
                  </span>
                  <span className="text-xs font-mono text-[#72726D] uppercase">
                    {allProducts.filter((p) => isProductInParentCategory(p, mobileDrawerCat)).length} Products
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                  {mobileDrawerCat.name}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMobileDrawerCat(null)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer"
                aria-label="Close subcategory menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action: View All Products */}
            <div className="p-3 bg-[#FBFBFA] border-b border-[#F0F0ED]">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(mobileDrawerCat.id);
                  setActiveSubcategory("all");
                  setMobileDrawerCat(null);
                }}
                className="w-full py-2.5 px-4 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>View All {mobileDrawerCat.name} Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subcategories List with live counts */}
            <div className="overflow-y-auto p-3 space-y-1 max-h-[50vh] divide-y divide-[#F0F0ED]">
              {(mobileDrawerCat.subcategories || []).map((sub) => {
                const isSelected =
                  (activeCategory === mobileDrawerCat.id || activeCategory === mobileDrawerCat.slug) &&
                  activeSubcategory.toLowerCase() === sub.name.toLowerCase();
                const count = getSubcategoryCount(mobileDrawerCat, sub.name);

                return (
                  <button
                    key={sub.id || sub.slug || sub.name}
                    type="button"
                    onClick={() => {
                      setActiveCategory(mobileDrawerCat.id);
                      setActiveSubcategory(sub.name);
                      setMobileDrawerCat(null);
                    }}
                    className={`w-full py-2.5 px-3 rounded-[2px] flex items-center justify-between text-left transition-colors text-xs font-medium cursor-pointer ${
                      isSelected
                        ? "bg-[#FFF1F2] text-[#D61C24] font-bold"
                        : "text-[#20201E] hover:bg-neutral-100"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <span className={`text-sm leading-none shrink-0 ${isSelected ? "text-[#D61C24]" : "text-[#A8A8A8]"}`}>
                        •
                      </span>
                      <span className="truncate">{sub.name}</span>
                    </span>
                    <span className={`text-[11px] font-mono shrink-0 ${isSelected ? "text-[#D61C24] font-bold" : "text-[#72726D]"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono">Loading Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
