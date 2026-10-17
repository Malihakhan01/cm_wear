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
                  href="/catalog/"
                  onClick={onClose}
                  className="text-[12.5px] sm:text-xs font-mono uppercase font-bold tracking-wider text-neutral-800 group-hover:text-[#D61C24] transition-colors flex-1"
                >
                  Products (6 Divisions)
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
                      href={`/catalog/?category=${cat.slug || cat.id}`}
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
                      href="/catalog/"
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

          <div className="flex items-center justify-center gap-3 pt-1">
            <a
              href={siteConfig.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-[#1877F2]/10 hover:text-[#1877F2] text-neutral-700 text-xs font-mono rounded-[3px] transition-colors border border-neutral-200"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook</span>
            </a>
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-[#E4405F]/10 hover:text-[#E4405F] text-neutral-700 text-xs font-mono rounded-[3px] transition-colors border border-neutral-200"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>Instagram</span>
            </a>
          </div>

          <div className="text-center text-[9px] font-mono uppercase tracking-widest text-neutral-400 pt-0.5">
            Sialkot Industrial Hub • ISO 9001:2015
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(drawerContent, document.body) : null;
};
