"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Category } from "@/types";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSubcategory = searchParams.get("subcategory") || "all";

  const [allProducts, setAllProducts] = useState(PRODUCTS_DATA);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES_DATA);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string>(initialSubcategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "moq-asc">("featured");

  const { mode, toggleMode } = useStoreModeStore();

  useEffect(() => {
    Promise.all([productsService.getAll(), categoriesService.getAll()]).then(([prods, liveCats]) => {
      if (prods && prods.length > 0) {
        setAllProducts(prods);
      }

      const mergedMap = new Map<string, Category>();
      CATEGORIES_DATA.forEach((c) => mergedMap.set(c.id, c));

      if (liveCats && liveCats.length > 0) {
        liveCats.forEach((c) => {
          if (!mergedMap.has(c.id)) {
            mergedMap.set(c.id, c);
          } else {
            const existing = mergedMap.get(c.id)!;
            if (c.subcategories && c.subcategories.length > 0) {
              const subMap = new Map<string, { id: string; slug: string; name: string }>();
              existing.subcategories.forEach((s) => subMap.set(s.slug, s));
              c.subcategories.forEach((s) => subMap.set(s.slug, s));
              existing.subcategories = Array.from(subMap.values());
            }
          }
        });
      }

      if (prods && prods.length > 0) {
        prods.forEach((p) => {
          if (p.category && !mergedMap.has(p.category)) {
            const numStr = String(mergedMap.size + 1).padStart(2, "0");
            const catName = p.category
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");

            const distinctSubs = Array.from(
              new Set(
                prods
                  .filter((item) => item.category === p.category)
                  .map((item) => item.subcategory)
                  .filter(Boolean)
              )
            ).map((subName) => ({
              id: subName.toLowerCase().replace(/\s+/g, "-"),
              slug: subName.toLowerCase().replace(/\s+/g, "-"),
              name: subName,
            }));

            mergedMap.set(p.category, {
              id: p.category,
              slug: p.category,
              name: catName,
              number: numStr,
              shortDescription: `Custom manufacturing and private label production for ${catName}.`,
              description: `Export-grade apparel production for ${catName} with comprehensive size grading and custom finishes.`,
              heroImage: p.images[0] || "/placeholder.jpg",
              subcategories: distinctSubs,
              technicalHighlights: [
                "Industrial High-Density Stitching",
                "Custom Fabric Selection & Sizing Specs",
                "OEM / ODM Private Label Branding",
              ],
              capabilities: [
                "Custom Embroidery & Embellishments",
                "Bar-tack Reinforced Construction",
                "Polybag Packaging & Hangtags",
              ],
            });
          }
        });
      }

      setCategories(Array.from(mergedMap.values()));
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
    const sub = searchParams.get("subcategory");
    if (sub) setActiveSubcategory(sub);
  }, [searchParams]);

  const currentCategoryData = categories.find((c) => c.id === activeCategory || c.slug === activeCategory);

  const filteredProducts = allProducts.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory && p.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
    if (activeSubcategory !== "all") {
      const pSub = (p.subcategory || "").toLowerCase().replace(/[-_]/g, " ");
      const targetSub = activeSubcategory.toLowerCase().replace(/[-_]/g, " ");
      if (pSub !== targetSub && !pSub.includes(targetSub) && !targetSub.includes(pSub)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchDesc) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.retailPrice - b.retailPrice;
    if (sortBy === "price-desc") return b.retailPrice - a.retailPrice;
    if (sortBy === "moq-asc") return a.MOQ - b.MOQ;
    return 0;
  });

  return (
    <div className="w-full bg-[#FFFFFF]">
      
      {/* Editorial Header */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-16 sm:py-20 select-none">
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

            {/* Mode Switcher */}
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
      </section>

      {/* Filter Bar Sticky */}
      <section className="bg-[#F4F4EF] border-b border-[#DADBD2] py-4 sticky top-[72px] z-30 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveSubcategory("all");
              }}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition-all shrink-0 ${
                activeCategory === "all"
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2]"
              }`}
            >
              All Disciplines ({allProducts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSubcategory("all");
                }}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition-all shrink-0 flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2]"
                }`}
              >
                <span className="text-[10px] text-[#D61C24]">{cat.number}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Subcategories (if specific category selected) */}
          {currentCategoryData && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none border-t border-[#DADBD2]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#72726D] shrink-0 mr-1">
                Subcategories:
              </span>
              <button
                onClick={() => setActiveSubcategory("all")}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase rounded-[2px] transition-colors shrink-0 ${
                  activeSubcategory === "all"
                    ? "bg-[#D61C24] text-white font-bold"
                    : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2]"
                }`}
              >
                All
              </button>
              {currentCategoryData.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.name)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase rounded-[2px] transition-colors shrink-0 ${
                    activeSubcategory === sub.name
                      ? "bg-[#D61C24] text-white font-bold"
                      : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2]"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
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
              Showing <strong className="text-black">{filteredProducts.length}</strong> apparel products
            </div>
            <div className="text-xs font-mono text-[#D61C24] font-bold">
              Bulk Volume Tier Pricing Active
            </div>
          </div>

          {filteredProducts.length === 0 ? (
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
                className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-mono uppercase rounded-[2px]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

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
