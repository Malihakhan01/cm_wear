"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { X, ChevronDown, ArrowRight, MessageCircle, Sparkles } from "lucide-react";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const [productsExpanded, setProductsExpanded] = useState(false);
  const { mode, toggleMode } = useStoreModeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      className="fixed inset-0 z-[99999] bg-[#0A0A0A]/80 backdrop-blur-sm flex justify-end"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm sm:max-w-md bg-[#FFFFFF] h-screen max-h-screen flex flex-col justify-between overflow-y-auto border-l border-[#DADBD2] p-4 sm:p-5 animate-in slide-in-from-right duration-200"
      >
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-[#DADBD2] mb-3.5">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <img
                src="/logo (2).png"
                alt="TAWFIQ INDUSTRIES"
                className="h-8 w-auto object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight uppercase font-display text-[#0A0A0A]">
                  TAWFIQ
                </span>
                <span className="text-[7.5px] font-mono tracking-[0.25em] uppercase text-neutral-500 font-bold">
                  INDUSTRIES
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#F4F4EF] rounded-[2px] text-[#0A0A0A] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="bg-[#F4F4EF] px-3 py-2 rounded-[2px] border border-[#DADBD2] mb-3 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-semibold text-[#72726D]">
              Purchasing Mode:
            </span>
            <button
              onClick={toggleMode}
              className="px-2.5 py-1 bg-[#0A0A0A] text-white text-[11px] font-mono uppercase font-bold rounded-[2px] flex items-center gap-1.5 cursor-pointer hover:bg-black/90 transition-colors"
            >
              <span className="text-[#FF333D]">{mode.toUpperCase()}</span>
              <span className="text-[9px] text-neutral-400 font-normal">(SWITCH)</span>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="divide-y divide-[#F4F4EF]">
            {/* Products with Accordion */}
            <div className="py-0.5">
              <button
                onClick={() => setProductsExpanded(!productsExpanded)}
                className="w-full flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors cursor-pointer"
              >
                <span>Products (8 Categories)</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    productsExpanded ? "rotate-180 text-[#D61C24]" : "text-[#72726D]"
                  }`}
                />
              </button>

              {productsExpanded && (
                <div className="pl-3 py-2 space-y-1.5 border-l-2 border-[#D61C24] my-1 bg-[#F4F4EF] rounded-[2px]">
                  {siteConfig.mainCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.id}`}
                      onClick={onClose}
                      className="block text-[11px] uppercase font-semibold text-[#72726D] hover:text-[#0A0A0A] py-0.5"
                    >
                      <span className="font-mono text-[#D61C24] mr-2">{cat.number}</span>
                      {cat.name}
                    </Link>
                  ))}
                  <div className="pt-1.5 border-t border-[#DADBD2]/60">
                    <Link
                      href="/catalog"
                      onClick={onClose}
                      className="text-[11px] font-mono uppercase font-bold text-[#0A0A0A] flex items-center gap-1 hover:text-[#D61C24] transition-colors"
                    >
                      View All Catalog <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Main Nav Items */}
            <Link
              href="/customize"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D61C24]" /> Customize
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>

            <Link
              href="/manufacturing"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span>Manufacturing</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>

            <Link
              href="/private-label"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span>Private Label</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>

            <Link
              href="/wholesale"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span>Wholesale</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>

            <Link
              href="/track-order"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span>Track Order</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>

            <Link
              href="/resources"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span>Resources & Guides</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span>About Us</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-1 text-[13px] sm:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3.5 border-t border-[#DADBD2] space-y-2 shrink-0">
          <Link
            href="/request-quote"
            onClick={onClose}
            className="w-full block text-center py-2.5 bg-[#0A0A0A] text-white font-mono uppercase text-[11px] font-bold tracking-wider rounded-[2px] hover:bg-[#D61C24] transition-colors"
          >
            Request Factory Quote
          </Link>

          <a
            href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-mono uppercase text-[11px] font-bold rounded-[2px] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Inquire on WhatsApp
          </a>

          <div className="text-center text-[9.5px] font-mono text-[#72726D]">
            Sialkot Industrial Zone • ISO 9001 Facility
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(drawerContent, document.body) : null;
};
