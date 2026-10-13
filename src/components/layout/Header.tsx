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
import {
  Search,
  ShoppingBag,
  Menu,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
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

  const totalPieces = getTotalPieces();

  // Scroll listener: detects when user has scrolled down to apply background color
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        } ${
          isHome
            ? isScrolled
              ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white"
              : "bg-transparent border-b border-transparent text-white"
            : "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-sm text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between relative">
          
          {/* Left: Brand Identity Logo (Official TAWFIQ INDUSTRIES Emblem & Wordmark) */}
          <Link
            href="/"
            className="flex items-center group shrink-0 z-10"
          >
            <img
              src="/logo (2).png"
              alt="TAWFIQ INDUSTRIES"
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
            />
          </Link>

          {/* Center: Desktop Navigation (Moved to Middle) */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {/* Products with Mega Menu trigger */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setMegaMenuOpen(true)}
            >
              <Link
                href="/catalog"
                onClick={() => setMegaMenuOpen(false)}
                className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold py-2 transition-colors cursor-pointer ${
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
              href="/customize"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-white/80 hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF333D]" />
              <span>Customize</span>
            </Link>

            <Link
              href="/about"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-wider font-semibold text-white/80 hover:text-white transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              onMouseEnter={() => setMegaMenuOpen(false)}
              className="text-xs font-mono uppercase tracking-wider font-semibold text-white/80 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Right: Actions (Wishlist and Saved icons removed) */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
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
