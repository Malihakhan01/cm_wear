"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Category } from "@/types";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { Search, SlidersHorizontal, ArrowRight, Box, ChevronDown } from "lucide-react";

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

  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mode, toggleMode } = useStoreModeStore();

  useEffect(() => {
    const refreshProducts = () => {
      Promise.all([productsService.getAll(), categoriesService.getAll()]).then(([prods, liveCats]) => {
        setAllProducts(prods || []);
      });
    };

    window.addEventListener("cm_products_updated", refreshProducts);
    return () => window.removeEventListener("cm_products_updated", refreshProducts);

    Promise.all([productsService.getAll(), categoriesService.getAll()]).then(([prods, liveCats]) => {
      setAllProducts(prods || []);

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
    const targetSub = subName.toLowerCase().replace(/[-_]/g, " ").trim();
    return allProducts.filter((p) => {
      const catMatch =
        p.category === category.id ||
        p.category === category.slug ||
        p.category.toLowerCase() === category.id.toLowerCase() ||
        p.category.toLowerCase() === category.slug.toLowerCase();
      if (!catMatch) return false;
      if (!p.subcategory) return false;
      const pSub = p.subcategory.toLowerCase().replace(/[-_]/g, " ").trim();
      return pSub === targetSub || pSub.includes(targetSub) || targetSub.includes(pSub);
    }).length;
  };

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

      {/* Filter Bar Sticky */}
      <section className="bg-[#F4F4EF] border-b border-[#DADBD2] py-4 sticky top-[72px] z-30 select-none">
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
              All Disciplines ({allProducts.length})
            </button>
            {categories.map((cat) => {
              const isHovered = hoveredCat?.id === cat.id;
              const isActive = activeCategory === cat.id || activeCategory === cat.slug;
              const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
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
              Showing <strong className="text-black">{filteredProducts.length}</strong> apparel products
            </div>
            <div className="text-xs font-mono text-[#D61C24] font-bold">
              Bulk Volume Tier Pricing Active
            </div>
          </div>

          {allProducts.length === 0 ? (
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
          className="w-80 bg-white border border-[#DADBD2] shadow-2xl rounded-[2px] overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none"
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
