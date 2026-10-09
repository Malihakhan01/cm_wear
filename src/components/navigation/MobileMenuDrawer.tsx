"use client";

import React, { useState } from "react";
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

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-[#0A0A0A]/80 backdrop-blur-sm flex justify-end"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FFFFFF] h-full flex flex-col justify-between overflow-y-auto border-l border-[#DADBD2] p-6 animate-in slide-in-from-right duration-200"
      >
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[#DADBD2] mb-6">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2.5"
            >
              <img
                src="/logo (2).png"
                alt="TAWFIQ INDUSTRIES"
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-black tracking-tight uppercase font-display text-[#0A0A0A]">
                  TAWFIQ
                </span>
                <span className="text-[8px] font-mono tracking-[0.25em] uppercase text-neutral-500 font-bold">
                  INDUSTRIES
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F4F4EF] rounded-[2px] text-[#0A0A0A] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="bg-[#F4F4EF] p-3 rounded-[2px] border border-[#DADBD2] mb-6 flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-semibold text-[#72726D]">
              Purchasing Mode:
            </span>
            <button
              onClick={toggleMode}
              className="px-3 py-1 bg-[#0A0A0A] text-white text-xs font-mono uppercase font-bold rounded-[2px] flex items-center gap-2"
            >
              <span className="text-[#FF333D]">{mode.toUpperCase()}</span>
              <span className="text-[10px] text-neutral-400">(Switch)</span>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {/* Products with Accordion */}
            <div>
              <button
                onClick={() => setProductsExpanded(!productsExpanded)}
                className="w-full flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] transition-colors border-b border-[#F4F4EF]"
              >
                <span>Products (8 Categories)</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    productsExpanded ? "rotate-180 text-[#D61C24]" : "text-[#72726D]"
                  }`}
                />
              </button>

              {productsExpanded && (
                <div className="pl-4 py-2 space-y-2 border-l-2 border-[#D61C24] my-2 bg-[#F4F4EF] rounded-[2px]">
                  {siteConfig.mainCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.id}`}
                      onClick={onClose}
                      className="block text-xs uppercase font-semibold text-[#72726D] hover:text-[#0A0A0A] py-1"
                    >
                      <span className="font-mono text-[#D61C24] mr-2">{cat.number}</span>
                      {cat.name}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-[#DADBD2]">
                    <Link
                      href="/catalog"
                      onClick={onClose}
                      className="text-xs font-mono uppercase font-bold text-[#0A0A0A] flex items-center gap-1"
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
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D61C24]" /> Customize
              </span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>

            <Link
              href="/manufacturing"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span>Manufacturing</span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>

            <Link
              href="/private-label"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span>Private Label</span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>

            <Link
              href="/wholesale"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span>Wholesale</span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>

            <Link
              href="/track-order"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span>Track Order</span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>

            <Link
              href="/resources"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span>Resources & Guides</span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span>About Us</span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-bold uppercase tracking-tight text-[#0A0A0A] hover:text-[#D61C24] border-b border-[#F4F4EF]"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 text-[#72726D]" />
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#DADBD2] space-y-3">
          <Link
            href="/request-quote"
            onClick={onClose}
            className="w-full block text-center py-3 bg-[#0A0A0A] text-white font-mono uppercase text-xs font-bold tracking-wider rounded-[2px] hover:bg-[#D61C24] transition-colors"
          >
            Request Factory Quote
          </Link>

          <a
            href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-mono uppercase text-xs font-bold rounded-[2px]"
          >
            <MessageCircle className="w-4 h-4" />
            Inquire on WhatsApp
          </a>

          <div className="text-center text-[10px] font-mono text-[#72726D]">
            Sialkot Industrial Zone • ISO 9001 Facility
          </div>
        </div>

      </div>
    </div>
  );
};
