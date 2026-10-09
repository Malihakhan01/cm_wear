"use client";

import React from "react";
import Link from "next/link";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { siteConfig } from "@/config/site.config";
import { ShieldCheck, Truck, MessageCircle } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const { mode, toggleMode } = useStoreModeStore();

  return (
    <div className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] text-[11px] font-mono tracking-wider select-none relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        
        {/* Left: Manufacturing Facility & Export Corridor */}
        <div className="flex items-center gap-4 text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D61C24] animate-pulse" />
            <span className="text-neutral-300">FACILITY 01 ONLINE</span>
          </div>
          <span className="hidden md:inline text-neutral-600">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-neutral-400">
            <Truck className="w-3.5 h-3.5 text-[#D61C24]" />
            <span>GLOBAL AIR & SEA CORRIDOR (EXW / FOB / CIF / DDP)</span>
          </div>
        </div>

        {/* Center: Lead Time Status */}
        <div className="hidden lg:flex items-center gap-2 text-neutral-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D61C24]" />
          <span>PRODUCTION LEAD TIME: <strong className="text-white">14–18 DAYS</strong></span>
        </div>

        {/* Right: Direct WhatsApp & Store Mode Indicator */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent(`Hello ${siteConfig.name}, I would like to inquire about apparel manufacturing.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#D61C24]" />
            <span className="hidden sm:inline">WhatsApp:</span>
            <span className="font-semibold text-white">{siteConfig.whatsAppNumber}</span>
          </a>

          <span className="text-neutral-700">|</span>

          {/* Quick Wholesale / Retail Pill Switch */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 bg-[#20201E] hover:bg-[#2A2A28] border border-[#3A3A36] px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer text-[10px] uppercase font-bold"
            title="Toggle between Wholesale (B2B Volume & Quotes) and Retail (Direct Purchase)"
          >
            <span className="text-neutral-400">MODE:</span>
            <span className={mode === "wholesale" ? "text-[#FF333D]" : "text-white"}>
              {mode.toUpperCase()}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
