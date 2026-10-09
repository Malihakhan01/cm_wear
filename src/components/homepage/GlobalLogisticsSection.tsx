"use client";

import React from "react";
import Link from "next/link";
import { Plane, Ship, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export const GlobalLogisticsSection: React.FC = () => {
  return (
    <section className="bg-white py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#DADBD2] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">
                EXPORT CORRIDOR & LOGISTICS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Air Express & Sea Freight Dispatch
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#72726D] max-w-md font-sans">
            Direct air priority clearance via Sialkot and Lahore international airports, plus consolidated container shipping via Port Qasim / Karachi.
          </p>
        </div>

        {/* 2 Main Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Air Freight Box */}
          <div className="bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-[#0A0A0A] text-white rounded-[2px]">
                <Plane className="w-6 h-6 text-[#FF333D]" />
              </div>
              <span className="text-xs font-mono font-bold text-[#D61C24] uppercase bg-white border border-[#DADBD2] px-2.5 py-1 rounded-[2px]">
                3–5 BUSINESS DAYS
              </span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Air Express & Priority Courier
            </h3>
            <p className="text-xs text-[#72726D] leading-relaxed">
              Ideal for time-critical capsule drops, pre-production sample fitting rounds, and seasonal retail reorders. Direct tracking via DHL, FedEx, and commercial airline cargo corridors.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#0A0A0A] space-y-1">
              <div>• Typical transit to USA / UK / Europe: 3–5 days</div>
              <div>• Door-to-door tracking with customs pre-clearance</div>
            </div>
          </div>

          {/* Sea Freight Box */}
          <div className="bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-[#0A0A0A] text-white rounded-[2px]">
                <Ship className="w-6 h-6 text-[#FF333D]" />
              </div>
              <span className="text-xs font-mono font-bold text-[#D61C24] uppercase bg-white border border-[#DADBD2] px-2.5 py-1 rounded-[2px]">
                18–25 TRANSIT DAYS
              </span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Consolidated Ocean Container Freight
            </h3>
            <p className="text-xs text-[#72726D] leading-relaxed">
              Engineered for large-volume wholesale bulk production (1,000 to 50,000+ units) achieving lowest landed unit costs. Available in Full Container Load (FCL) or Less than Container Load (LCL).
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#0A0A0A] space-y-1">
              <div>• Palletized and shrink-wrapped export cartons</div>
              <div>• Port-to-port or DDP direct to your commercial warehouse</div>
            </div>
          </div>

        </div>

        {/* Incoterms Bar */}
        <div className="bg-[#0A0A0A] text-white p-6 rounded-[2px] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {siteConfig.commercialTerms.map((term) => (
            <div key={term.code} className="p-3 border border-[#2A2A28] rounded-[2px]">
              <div className="text-lg font-bold font-mono text-[#FF333D]">{term.code}</div>
              <div className="text-xs font-bold uppercase text-white mt-0.5">{term.name}</div>
              <div className="text-[10px] text-neutral-400 mt-1 leading-tight">{term.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
