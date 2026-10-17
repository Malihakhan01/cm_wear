"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { menuService, MegaMenuPillar } from "@/services/menu.service";
import { ArrowRight, Sparkles } from "lucide-react";

interface ProductsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductsMegaMenu: React.FC<ProductsMegaMenuProps> = ({ isOpen, onClose }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
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
    menuService.getHeaderMegaMenu().then((livePillars) => {
      if (livePillars && livePillars.length > 0) {
        setCategories(livePillars);
      }
    });
  }, []);

  if (!isOpen) return null;

  const activeCategory = categories[activeCategoryIndex] || categories[0];
  if (!activeCategory) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FFFFFF] border-b border-[#DADBD2] shadow-2xl z-40 transition-all duration-200 animate-in fade-in slide-in-from-top-1"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Column 1: Category Selector (4 cols) */}
          <div className="col-span-4 border-r border-[#DADBD2] pr-6 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#72726D] mb-3 px-3">
              {String(categories.length).padStart(2, "0")} Specialized Apparel Categories
            </div>

            {categories.map((cat, idx) => {
              const isActive = idx === activeCategoryIndex;
              return (
                <div
                  key={cat.id || cat.slug || idx}
                  onMouseEnter={() => setActiveCategoryIndex(idx)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-[2px] transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0A0A0A] text-white"
                      : "hover:bg-[#F4F4EF] text-[#0A0A0A]"
                  }`}
                >
                  <Link
                    href={`/catalog?category=${cat.slug || cat.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 w-full"
                  >
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? "text-[#FF333D]" : "text-[#72726D]"
                      }`}
                    >
                      {cat.number || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1)}
                    </span>
                    <span className="text-sm font-semibold tracking-tight uppercase">
                      {cat.name}
                    </span>
                  </Link>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive
                        ? "text-[#FF333D] translate-x-1"
                        : "text-transparent group-hover:text-[#72726D]"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Column 2: Subcategories Grid (5 cols) */}
          <div className="col-span-5 pr-6 flex flex-col justify-between">
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
                  href={`/catalog?category=${activeCategory.slug || activeCategory.id}`}
                  onClick={onClose}
                  className="text-xs font-mono uppercase text-[#D61C24] hover:text-[#A31017] flex items-center gap-1 font-semibold"
                >
                  View All Products <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Subcategories 2-column list */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {(activeCategory.subcategories || []).map((sub) => (
                  <Link
                    key={sub}
                    href={`/catalog?category=${activeCategory.slug || activeCategory.id}&subcategory=${encodeURIComponent(sub)}`}
                    onClick={onClose}
                    className="text-xs text-[#72726D] hover:text-[#0A0A0A] hover:translate-x-1 transition-all py-1 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#DADBD2]" />
                    <span className="truncate">{sub}</span>
                  </Link>
                ))}
              </div>
            </div>

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
              <p className="text-[11px] text-[#72726D] leading-relaxed mb-3">
                {activeCategory.tagline || "Minimum order 30–50 pieces with full Pantone lab-dip matching and custom tech-pack development."}
              </p>
            </div>

            <Link
              href={`/request-quote?category=${activeCategory.slug || activeCategory.id}`}
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
