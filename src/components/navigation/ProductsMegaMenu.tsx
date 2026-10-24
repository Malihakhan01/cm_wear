"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { menuService, MegaMenuPillar } from "@/services/menu.service";
import { ArrowRight, Sparkles, Search } from "lucide-react";

function getSportswearSubcategoryPriority(nameOrSlug: string): number {
  const text = (nameOrSlug || "").toLowerCase();
  if (text.includes("ice hockey") || text.includes("ice-hockey")) return 1;
  if (text.includes("soccer") || (text.includes("football") && !text.includes("american") && !text.includes("gridiron"))) return 4;
  if (text.includes("american football") || text.includes("american-football") || text.includes("gridiron")) return 2;
  if (text.includes("basketball")) return 5;
  if (text.includes("baseball") || text.includes("softball")) return 6;
  if (text.includes("rugby")) return 8;
  if (text.includes("lacrosse")) return 9;
  if (text.includes("cricket")) return 7;
  if (text.includes("hockey")) return 3;
  if (text.includes("volleyball")) return 10;
  if (text.includes("tennis") || text.includes("golf")) return 11;
  return 100;
}

interface ProductsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductsMegaMenu: React.FC<ProductsMegaMenuProps> = ({ isOpen, onClose }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");
  const [categories, setCategories] = useState<MegaMenuPillar[]>(() =>
    siteConfig.mainCategories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      number: c.number,
      image: c.image,
      tagline: "Minimum order 30–50 pieces with full Pantone lab-dip matching and custom tech-pack development.",
      subcategories: c.subcategories,
    }))
  );

  useEffect(() => {
    const handleMenuUpdate = (e?: Event) => {
      const customEvent = e as CustomEvent<MegaMenuPillar[]>;
      if (customEvent?.detail && Array.isArray(customEvent.detail) && customEvent.detail.length > 0) {
        setCategories(customEvent.detail);
      } else {
        menuService.getHeaderMegaMenu(true).then((livePillars) => {
          if (livePillars && livePillars.length > 0) {
            setCategories(livePillars);
          }
        });
      }
    };

    window.addEventListener("cm_menu_updated", handleMenuUpdate);
    window.addEventListener("focus", handleMenuUpdate);

    menuService.getHeaderMegaMenu().then((livePillars) => {
      if (livePillars && livePillars.length > 0) {
        setCategories(livePillars);
      }
    });

    return () => {
      window.removeEventListener("cm_menu_updated", handleMenuUpdate);
      window.removeEventListener("focus", handleMenuUpdate);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      menuService.getHeaderMegaMenu().then((livePillars) => {
        if (livePillars && livePillars.length > 0) {
          setCategories(livePillars);
        }
      });
    }
  }, [isOpen]);

  const filteredCategories = useMemo(() => {
    if (!filterQuery.trim()) return categories;
    const q = filterQuery.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        (cat.subcategories && cat.subcategories.some((sub) => sub.toLowerCase().includes(q)))
    );
  }, [categories, filterQuery]);

  if (!isOpen) return null;

  const activeCategory =
    filteredCategories[activeCategoryIndex] ||
    categories[activeCategoryIndex] ||
    categories[0];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FFFFFF] border-b border-[#DADBD2] shadow-2xl z-40 transition-all duration-200 animate-in fade-in slide-in-from-top-1"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        <div className="grid grid-cols-12 gap-8">

          {/* Column 1: Category Selector (4 cols) */}
          <div className="col-span-4 border-r border-[#DADBD2] pr-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#72726D]">
                  {String(categories.length).padStart(2, "0")} Apparel Divisions
                </span>
                <span className="text-[10px] font-mono text-[#D61C24] font-bold">LIVE CATALOG</span>
              </div>

              {categories.length > 8 && (
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => {
                      setFilterQuery(e.target.value);
                      setActiveCategoryIndex(0);
                    }}
                    placeholder="Quick search division..."
                    className="w-full text-xs pl-8 pr-2 py-1.5 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] focus:outline-none focus:border-[#0A0A0A] font-mono placeholder:text-neutral-400"
                  />
                  {filterQuery && (
                    <button
                      onClick={() => setFilterQuery("")}
                      className="absolute right-2 top-2 text-xs text-neutral-400 hover:text-black font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}

              <div className="max-h-[460px] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                {filteredCategories.map((cat, idx) => {
                  const isActive = activeCategory && (activeCategory.slug === cat.slug || activeCategory.id === cat.id);
                  return (
                    <div
                      key={cat.id || cat.slug || idx}
                      onMouseEnter={() => {
                        const originalIdx = categories.findIndex((c) => c.slug === cat.slug || c.id === cat.id);
                        if (originalIdx !== -1) setActiveCategoryIndex(originalIdx);
                      }}
                      className={`group flex items-center justify-between px-3 py-2 rounded-[2px] transition-all cursor-pointer ${isActive
                          ? "bg-[#0A0A0A] text-white"
                          : "hover:bg-[#F4F4EF] text-[#0A0A0A]"
                        }`}
                    >
                      <Link
                        href={`/catalog/?category=${cat.slug || cat.id}`}
                        onClick={onClose}
                        className="flex items-center gap-2.5 w-full truncate"
                      >
                        <span
                          className={`text-xs font-mono font-bold shrink-0 ${isActive ? "text-[#FF333D]" : "text-[#72726D]"
                            }`}
                        >
                          {cat.number || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1)}
                        </span>
                        <span className="text-xs font-semibold tracking-tight uppercase truncate">
                          {cat.name}
                        </span>
                      </Link>
                      <ArrowRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive
                            ? "text-[#FF333D] translate-x-1"
                            : "text-transparent group-hover:text-[#72726D]"
                          }`}
                      />
                    </div>
                  );
                })}

                {filteredCategories.length === 0 && (
                  <div className="py-8 text-center text-xs text-neutral-400 font-mono">
                    No division matches &quot;{filterQuery}&quot;
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#DADBD2] mt-2">
              <Link
                href="/catalog/"
                onClick={onClose}
                className="text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24] flex items-center justify-between"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Subcategories Grid (5 cols) */}
          <div className="col-span-5 pr-6 flex flex-col justify-between">
            {activeCategory ? (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DADBD2]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D61C24]">
                      {activeCategory.number}
                    </span>
                    <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A]">
                      {activeCategory.name}
                    </h3>
                  </div>
                  <Link
                    href={`/catalog/?category=${activeCategory.slug || activeCategory.id}`}
                    onClick={onClose}
                    className="text-xs font-mono uppercase text-[#D61C24] hover:text-[#A31017] flex items-center gap-1 font-semibold"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Subcategories 2-column list */}
                <div className="max-h-[380px] overflow-y-auto pr-1 custom-scrollbar grid grid-cols-2 gap-x-4 gap-y-2">
                  {[...(activeCategory.subcategories || [])]
                    .sort((a, b) => {
                      const isSport = (activeCategory.slug || activeCategory.id || activeCategory.name || "").toLowerCase().includes("sport");
                      if (isSport) {
                        const prioA = getSportswearSubcategoryPriority(a);
                        const prioB = getSportswearSubcategoryPriority(b);
                        if (prioA !== prioB) return prioA - prioB;
                      }
                      return 0;
                    })
                    .map((sub) => (
                      <Link
                        key={sub}
                        href={`/catalog/?category=${activeCategory.slug || activeCategory.id}&subcategory=${encodeURIComponent(sub)}`}
                        onClick={onClose}
                        className="text-xs text-[#72726D] hover:text-[#0A0A0A] hover:translate-x-1 transition-all py-1 flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#DADBD2] group-hover:bg-[#D61C24] transition-colors shrink-0" />
                        <span className="truncate">{sub}</span>
                      </Link>
                    ))}
                  {(!activeCategory.subcategories || activeCategory.subcategories.length === 0) && (
                    <div className="col-span-2 py-6 text-xs text-neutral-400 font-mono">
                      Full custom silhouette manufacturing available for this division.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* Quick Action Bar for the active category */}
            <div className="mt-6 pt-4 border-t border-[#DADBD2] flex items-center justify-between bg-[#F4F4EF] p-3 rounded-[2px]">
              <div className="text-[11px] text-[#72726D]">
                Customizable Blank Tech Packs Available
              </div>
              <Link
                href="/customize"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D61C24]" />
                Launch Customizer
              </Link>
            </div>
          </div>

          {/* Column 3: Editorial Image & Sourcing Spotlight (3 cols) */}
          <div className="col-span-3 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-4 flex flex-col justify-between">
            {activeCategory && (
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] mb-3 bg-[#0A0A0A]">
                  <img
                    src={activeCategory.image || "/categories/Casual wear (1).png"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.endsWith("/categories/Casual wear (1).png")) {
                        target.src = "/categories/Casual wear (1).png";
                      }
                    }}
                    alt={activeCategory.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-[#0A0A0A]/80 backdrop-blur-xs text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded-[2px]">
                    FACTORY GRADE
                  </div>
                </div>

                <div className="text-xs font-bold uppercase tracking-tight text-[#0A0A0A] mb-1">
                  {activeCategory.name} Sourcing
                </div>
                <p className="text-[11px] text-[#72726D] leading-relaxed mb-3 line-clamp-3">
                  {activeCategory.tagline || "Minimum order 30–50 pieces with full Pantone lab-dip matching and custom tech-pack development."}
                </p>
              </div>
            )}

            <Link
              href={`/request-quote?category=${activeCategory?.slug || activeCategory?.id || ""}`}
              onClick={onClose}
              className="w-full text-center py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-semibold transition-colors rounded-[2px]"
            >
              Request Category Quote
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
