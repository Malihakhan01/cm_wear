"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { useCartStore } from "@/stores/useCartStore";
import { useHeaderStore } from "@/stores/useHeaderStore";
import { ProductsMegaMenu } from "@/components/navigation/ProductsMegaMenu";
import { MobileMenuDrawer } from "@/components/navigation/MobileMenuDrawer";
import { SearchModal } from "@/components/common/SearchModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useWishlistStore } from "@/stores/useWishlistStore";
import {
  Search,
  ShoppingBag,
  Menu,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Heart,
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { mode, toggleMode } = useStoreModeStore();
  const { toggleCart, getTotalPieces } = useCartStore();
  const isVisible = useHeaderStore((state) => state.isVisible);
  const wishlistItems = useWishlistStore((state) => state.items);

  const totalPieces = getTotalPieces();

  // Scroll listener: detects when user has scrolled down to apply background color (RAF throttled)
  useEffect(() => {
    setMounted(true);
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 select-none transition-[background-color,border-color,box-shadow] duration-200 ease-out will-change-transform translate-y-0 opacity-100 ${
          isHome
            ? isScrolled
              ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
              : "bg-transparent border-b border-transparent text-white"
            : "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-sm text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between relative">
          
          {/* Left: Brand Identity Logo (Official CM SPORTS WEAR Emblem) */}
          <Link
            href="/"
            className="flex items-center group shrink-0 z-10"
          >
            <img
              src="/cm_logo/Red and White Wear Emblem.png"
              alt="CM SPORTS WEAR"
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
            />
          </Link>

          {/* Center: Desktop Navigation centered between logo and right actions */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 xl:mx-8 gap-4 xl:gap-6 2xl:gap-7 z-10 flex-nowrap">
            {/* Home menu item */}
            <Link
              href="/"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className={`text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap transition-colors ${
                isHome ? "text-white font-bold" : "text-white/80 hover:text-white"
              }`}
            >
              Home
            </Link>

            {/* Products with Mega Menu trigger */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setMegaMenuOpen(true)}
            >
              <Link
                href="/catalog"
                onClick={() => setMegaMenuOpen(false)}
                className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap transition-colors cursor-pointer ${
                  megaMenuOpen ? "text-[#FF333D]" : "text-white/80 hover:text-white"
                }`}
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    megaMenuOpen ? "rotate-180" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMegaMenuOpen((prev) => !prev);
                  }}
                />
              </Link>
            </div>

            <Link
              href="/catalogs"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap text-white/80 hover:text-white transition-colors"
            >
              Catalogs
            </Link>

            <Link
              href="/certifications"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap text-white/80 hover:text-white transition-colors"
            >
              Certifications
            </Link>

            <Link
              href="/exhibitions"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap text-white/80 hover:text-white transition-colors"
            >
              Exhibitions
            </Link>

            <Link
              href="/customize"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap text-white/80 hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF333D]" />
              <span>Customize</span>
            </Link>

            <Link
              href="/about"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-wider font-semibold py-2 whitespace-nowrap text-white/80 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 z-10 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
              title="Global Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wholesale / Retail Switcher (Compact Desktop) */}
            <button
              onClick={toggleMode}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-mono uppercase font-bold rounded-[2px] transition-colors text-white cursor-pointer"
              title="Toggle between Wholesale and Retail pricing"
            >
              <span className="text-white/50">MODE:</span>
              <span className={mounted && mode === "wholesale" ? "text-[#FF333D]" : "text-white"}>
                {mounted ? mode : "wholesale"}
              </span>
            </button>

            {/* Wishlist Link (Directly before Cart Drawer Trigger) */}
            <Link
              href="/wishlist"
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-0.5 bg-[#D61C24] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {mounted && totalPieces > 0 && (
                <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-0.5 bg-[#D61C24] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                  {totalPieces}
                </span>
              )}
            </button>

            {/* Primary CTA: Get a Quote */}
            <Link
              href="/request-quote"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-200 text-[#0A0A0A] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors shadow-xs group"
            >
              <span>Get a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-[2px] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Products Mega Menu Dropdown */}
        <ProductsMegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
        />
      </header>

      {/* Global Modals & Drawers */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <CartDrawer />

      {/* On non-home pages, keep 72px space in normal document flow so page content is not covered */}
      {!isHome && <div className="h-[72px] w-full shrink-0" aria-hidden="true" />}
    </>
  );
};
