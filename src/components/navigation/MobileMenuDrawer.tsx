"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { menuService, MegaMenuPillar } from "@/services/menu.service";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { X, ChevronDown, ArrowRight, MessageCircle, Sparkles, Factory, Tag, ShieldCheck, Truck, BookOpen, Users, Mail, Heart } from "lucide-react";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const [productsExpanded, setProductsExpanded] = useState(false);
  const { mode, toggleMode } = useStoreModeStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<MegaMenuPillar[]>(() =>
    siteConfig.mainCategories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      number: c.number,
      image: c.image,
      subcategories: c.subcategories,
    }))
  );

  useEffect(() => {
    setMounted(true);
    menuService.getHeaderMegaMenu().then((livePillars) => {
      if (livePillars && livePillars.length > 0) {
        setCategories(livePillars);
      }
    });
  }, []);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const drawerContent = (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-[#0A0A0A]/75 backdrop-blur-sm flex justify-end transition-opacity duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] xs:max-w-xs sm:max-w-sm bg-[#FFFFFF] h-full max-h-[100dvh] flex flex-col justify-between overflow-hidden border-l border-[#E5E5DE] shadow-2xl animate-in slide-in-from-right duration-250 ease-out"
      >
        
        {/* Top Header - Fixed */}
        <div className="shrink-0 px-4 sm:px-5 pt-4 pb-3 border-b border-[#E5E5DE] flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center group"
          >
            <img
              src="/cm_logo/Red and White Wear Emblem.png"
              alt="CM SPORTS WEAR"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-3 space-y-3">
          
          {/* Mode Switcher Box - Compact & Professional */}
          <div className="bg-[#F8F9F7] px-3 py-2 rounded-md border border-[#E5E5DE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D61C24] animate-pulse" />
              <span className="text-[10.5px] font-mono uppercase tracking-wider font-semibold text-neutral-500">
                Pricing Mode
              </span>
            </div>
            <button
              onClick={toggleMode}
              className="px-2.5 py-1 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10.5px] font-mono uppercase font-bold rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              title="Toggle Wholesale or Retail mode"
            >
              <span className={mode === "wholesale" ? "text-[#FF333D]" : "text-emerald-400"}>
                {mode.toUpperCase()}
              </span>
              <span className="text-[8.5px] text-neutral-400 font-normal uppercase">(SWITCH)</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="divide-y divide-neutral-100/90">
            
            {/* Home Link */}
            <div className="py-0.5">
              <Link
                href="/"
                onClick={onClose}
                className="w-full flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
              >
                <span>Home</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>

            {/* Products with Accordion & Direct Link */}
            <div className="py-0.5">
              <div className="w-full flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 transition-colors group">
                <Link
                  href="/catalog"
                  onClick={onClose}
                  className="text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 group-hover:text-[#D61C24] transition-colors flex-1"
                >
                  Products (9 Categories)
                </Link>
                <button
                  type="button"
                  onClick={() => setProductsExpanded(!productsExpanded)}
                  className="p-1 -mr-1 text-neutral-400 hover:text-black cursor-pointer transition-colors"
                  aria-label="Toggle products categories"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      productsExpanded ? "rotate-180 text-[#D61C24]" : "text-neutral-500"
                    }`}
                  />
                </button>
              </div>

              {productsExpanded && (
                <div className="ml-2 pl-3 py-2 space-y-1 border-l-2 border-[#D61C24] bg-[#F8F9F7] rounded-r-[3px] my-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      href={`/catalog?category=${cat.slug || cat.id}`}
                      onClick={onClose}
                      className="flex items-center justify-between text-[11px] font-mono uppercase font-semibold text-neutral-600 hover:text-[#D61C24] py-1 px-1.5 rounded hover:bg-white/80 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#D61C24] font-bold text-[10px]">{cat.number}</span>
                        <span>{cat.name}</span>
                      </span>
                      <ArrowRight className="w-2.5 h-2.5 opacity-40" />
                    </Link>
                  ))}
                  <div className="pt-1.5 mt-1 border-t border-[#E5E5DE]">
                    <Link
                      href="/catalog"
                      onClick={onClose}
                      className="text-[11px] font-mono uppercase font-bold text-neutral-900 flex items-center justify-between py-1 px-1.5 hover:text-[#D61C24] transition-colors"
                    >
                      <span>View Complete Catalog</span>
                      <ArrowRight className="w-3 h-3 text-[#D61C24]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Customize (Featured Item) */}
            <Link
              href="/customize"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D61C24]" />
                <span>Customize</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[8.5px] font-mono text-[#D61C24] bg-[#D61C24]/10 px-1.5 py-0.5 rounded-[2px] font-bold">
                  STUDIO
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-[#D61C24]" />
                <span>Wishlist</span>
              </span>
              <span className="flex items-center gap-1.5">
                {wishlistItems.length > 0 && (
                  <span className="text-[9px] font-mono text-white bg-[#D61C24] px-1.5 py-0.5 rounded-full font-bold">
                    {wishlistItems.length}
                  </span>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>

            {/* Manufacturing */}
            <Link
              href="/manufacturing"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Manufacturing</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Private Label */}
            <Link
              href="/private-label"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Private Label</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Wholesale */}
            <Link
              href="/wholesale"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Wholesale</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Track Order */}
            <Link
              href="/track-order"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Track Order</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Editorial Blog & Guides */}
            <Link
              href="/blog"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Blog & Articles</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Official Catalogs */}
            <Link
              href="/catalogs"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Catalogs (8 PDFs)</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Certifications */}
            <Link
              href="/certifications"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Certifications</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Exhibitions */}
            <Link
              href="/exhibitions"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span className="flex items-center gap-1.5">
                <span>Global Exhibitions</span>
                <span className="text-[8.5px] font-mono text-white bg-[#D61C24] px-1.5 py-0.5 rounded-[2px] font-bold">
                  ARCHIVE
                </span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Resources & Guides */}
            <Link
              href="/resources"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Resources & Guides</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>About Us</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1.5 rounded-md hover:bg-neutral-50 text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 hover:text-[#D61C24] transition-colors group"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D61C24] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </nav>
        </div>

        {/* Bottom Actions - Fixed to Bottom */}
        <div className="shrink-0 p-4 border-t border-[#E5E5DE] bg-white space-y-2">
          <Link
            href="/request-quote"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white font-mono uppercase text-xs font-bold tracking-wider rounded-[3px] transition-all shadow-xs group"
          >
            <span>Request Factory Quote</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <a
            href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-mono uppercase text-xs font-bold rounded-[3px] transition-colors shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Inquire on WhatsApp</span>
          </a>

          <div className="text-center text-[9px] font-mono uppercase tracking-widest text-neutral-400 pt-0.5">
            Sialkot Industrial Hub • ISO 9001:2015
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(drawerContent, document.body) : null;
};
