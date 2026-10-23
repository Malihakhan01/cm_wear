"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/data/products.data";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { productsService } from "@/services/products.service";
import { Product } from "@/types";

import { menuService, MegaMenuPillar } from "@/services/menu.service";
import { siteConfig } from "@/config/site.config";

export const FeaturedProductsSection: React.FC = () => {
  const [categoriesList, setCategoriesList] = useState<MegaMenuPillar[]>(() =>
    siteConfig.mainCategories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      number: c.number,
      image: c.image,
      subcategories: c.subcategories,
    }))
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    siteConfig.mainCategories[0]?.slug || siteConfig.mainCategories[0]?.id || "team-sports-wear"
  );

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { mode, toggleMode } = useStoreModeStore();

  useEffect(() => {
    // 0. Safely rehydrate cached data from memory/localStorage after client hydration succeeds
    const cachedProds = productsService.getCachedProducts();
    if (cachedProds && cachedProds.length > 0) {
      setAllProducts(cachedProds);
      setLoading(false);
    }

    const cachedMenu = menuService.getCachedMenu();
    if (cachedMenu && cachedMenu.length > 0) {
      setCategoriesList(cachedMenu);
      setSelectedCategory((prev) => {
        if (!prev || !cachedMenu.some((p) => p.id === prev || p.slug === prev)) {
          return cachedMenu[0].id || cachedMenu[0].slug;
        }
        return prev;
      });
    }

    // 1. Fetch latest menu categories from DB
    menuService.getHeaderMegaMenu().then((livePillars) => {
      if (livePillars && livePillars.length > 0) {
        setCategoriesList(livePillars);
        setSelectedCategory((prev) => {
          if (!prev || !livePillars.some((p) => p.id === prev || p.slug === prev)) {
            return livePillars[0].id || livePillars[0].slug;
          }
          return prev;
        });
      }
    });

    const handleMenuUpdate = (e?: Event) => {
      const customEvent = e as CustomEvent<MegaMenuPillar[]>;
      const livePillars = customEvent?.detail || menuService.getCachedMenu();
      if (livePillars && livePillars.length > 0) {
        setCategoriesList(livePillars);
        setSelectedCategory((prev) => {
          if (!prev || !livePillars.some((p) => p.id === prev || p.slug === prev)) {
            return livePillars[0].id || livePillars[0].slug;
          }
          return prev;
        });
      }
    };
    window.addEventListener("cm_menu_updated", handleMenuUpdate);

    // 2. Fetch products
    productsService.getAll().then((prods) => {
      setAllProducts(prods || []);
      setLoading(false);
    });

    const handleProductsUpdate = (e?: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent?.detail && Array.isArray(customEvent.detail)) {
        setAllProducts(customEvent.detail);
        setLoading(false);
      } else {
        productsService.getAll().then((prods) => {
          setAllProducts(prods || []);
          setLoading(false);
        });
      }
    };
    window.addEventListener("cm_products_updated", handleProductsUpdate);

    return () => {
      window.removeEventListener("cm_menu_updated", handleMenuUpdate);
      window.removeEventListener("cm_products_updated", handleProductsUpdate);
    };
  }, []);

function normalizeCategoryTarget(slugOrName?: string): string {
  const norm = (slugOrName || "").toLowerCase().replace(/[-_\s]/g, "");
  if (norm.includes("teamsport") || norm === "sportswear") return "sportswear";
  if (norm.includes("martial") || norm.includes("combat")) return "martialarts";
  if (norm.includes("fitness") || norm.includes("activewear")) return "fitnesswear";
  if (norm.includes("casual") || norm.includes("lifestyle") || norm.includes("street")) return "casualwear";
  if (norm.includes("safety") || norm.includes("workwear") || norm.includes("medical")) return "safetywear";
  if (norm.includes("glove")) return "gloves";
  return norm;
}

function getSportswearProductPriority(p: Product): number {
  const rawCatNames = p.rawCategories ? p.rawCategories.map((rc) => `${rc.name} ${rc.slug}`).join(" ") : "";
  const text = `${p.name} ${p.subcategory || ""} ${p.category || ""} ${rawCatNames}`.toLowerCase();

  // 1. Ice Hockey first
  if (text.includes("ice hockey") || text.includes("hockey")) return 1;

  // 2. Soccer then (ensure not american football)
  if (text.includes("soccer") || (text.includes("football") && !text.includes("american") && !text.includes("gridiron"))) return 2;

  // 3. American Football then
  if (text.includes("american football") || text.includes("american") || text.includes("gridiron")) return 3;

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

  const selectedCat = categoriesList.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
  const targetCategoryKey = normalizeCategoryTarget(selectedCat?.slug || selectedCat?.id || selectedCategory);

  const categoryProducts = allProducts.filter((p) => {
    if (normalizeCategoryTarget(p.category) === targetCategoryKey) return true;

    if (p.rawCategories && p.rawCategories.length > 0) {
      return p.rawCategories.some((rc) => {
        return (
          normalizeCategoryTarget(rc.slug) === targetCategoryKey ||
          normalizeCategoryTarget(rc.name) === targetCategoryKey
        );
      });
    }

    return false;
  });

  let filteredProducts: Product[] = [];
  if (targetCategoryKey === "sportswear") {
    // 1. Ice Hockey first, 2. Soccer then, 3. American Football then, 4. Basketball
    const hockeyProds = categoryProducts.filter((p) => getSportswearProductPriority(p) === 1);
    const soccerProds = categoryProducts.filter((p) => getSportswearProductPriority(p) === 2);
    const americanFbProds = categoryProducts.filter((p) => getSportswearProductPriority(p) === 3);
    const basketballProds = categoryProducts.filter((p) => getSportswearProductPriority(p) === 4);

    const picked: Product[] = [
      ...hockeyProds.slice(0, 2),
      ...soccerProds.slice(0, 2),
      ...americanFbProds.slice(0, 2),
      ...basketballProds.slice(0, 2),
    ];

    const pickedIds = new Set(picked.map((p) => p.id));
    const remainingSportswear = categoryProducts
      .filter((p) => !pickedIds.has(p.id))
      .sort((a, b) => getSportswearProductPriority(a) - getSportswearProductPriority(b));

    filteredProducts = [...picked, ...remainingSportswear].slice(0, 8);
  } else {
    filteredProducts = categoryProducts.slice(0, 8);
  }

  return (
    <section className="bg-white py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeading
          eyebrow="EXPORT CATALOG SPECIMENS"
          eyebrowColor="#D61C24"
          title="OUR PRODUCTS"
          action={
            <div className="flex items-center gap-3 bg-[#F4F4EF] p-2 border border-[#DADBD2] rounded-[2px]">
              <span className="text-xs font-mono uppercase text-[#72726D] pl-2">
                Viewing as:
              </span>
              <button
                onClick={toggleMode}
                className="px-3 py-1 bg-[#0A0A0A] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors cursor-pointer"
              >
                <span className="text-[#FF333D]">{mode.toUpperCase()}</span>
              </button>
            </div>
          }
        />

        {/* Filter Pills (DB Categories Only - First selected by default, no ALL tab) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categoriesList.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
            const numStr = cat.number || String(idx + 1).padStart(2, "0");
            return (
              <button
                key={cat.id || cat.slug || idx}
                onClick={() => setSelectedCategory(cat.id || cat.slug)}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase font-semibold rounded-[2px] border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-xs"
                    : "bg-[#F4F4EF] text-[#72726D] border-[#DADBD2] hover:border-black hover:text-black"
                }`}
              >
                <span className={`text-[10px] font-bold ${isSelected ? "text-[#FF333D]" : "text-[#D61C24]"}`}>
                  {numStr}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {loading && filteredProducts.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pb-6 pt-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-[#DADBD2] rounded-[2px] p-2.5 sm:p-3 space-y-2 sm:space-y-3 bg-[#FAFAF8] animate-pulse">
                <div className="aspect-square bg-[#E8E8E2] rounded-[2px]" />
                <div className="h-3 bg-[#E0E0DA] rounded-[2px] w-3/4" />
                <div className="h-2.5 bg-[#E8E8E2] rounded-[2px] w-1/2" />
                <div className="h-3.5 sm:h-4 bg-[#E0E0DA] rounded-[2px] w-1/3 pt-1.5" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-14 text-center border border-dashed border-[#DADBD2] rounded-[2px] bg-white my-4 p-8 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-[#D61C24] font-bold">
              Production Archive
            </p>
            <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Export Styles Updating
            </h3>
            <p className="text-xs sm:text-sm text-[#72726D] max-w-md mx-auto">
              Our export apparel collections for this category are currently being prepared by our factory production team.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 pb-6 pt-2">
            {filteredProducts.map((p, idx) => (
              <div
                key={p.id}
                data-card-index={idx}
                className="product-card-entrance-wrapper h-full will-change-transform"
              >
                <div className="h-full rounded-[2px] transition-transform duration-200 hover:-translate-y-1">
                  <ProductCard product={p} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center pt-8 border-t border-[#DADBD2] flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
          <Link
            href="/catalog/"
            className="w-full max-w-[290px] sm:w-auto sm:max-w-none px-3.5 py-2 sm:px-6 sm:py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[10px] sm:text-xs font-mono uppercase font-bold tracking-normal sm:tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 leading-tight"
          >
            <span>Explore Complete Export Catalog (740+ Items)</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </Link>
          <Link
            href="/request-quote"
            className="w-full max-w-[290px] sm:w-auto sm:max-w-none px-3.5 py-2 sm:px-6 sm:py-3 bg-[#F4F4EF] hover:bg-[#DADBD2] border border-[#DADBD2] text-[#0A0A0A] text-[10px] sm:text-xs font-mono uppercase font-bold tracking-normal sm:tracking-wider rounded-[2px] transition-colors flex items-center justify-center text-center leading-tight"
          >
            Request Custom Factory Specification
          </Link>
        </div>

      </div>
    </section>
  );
};
