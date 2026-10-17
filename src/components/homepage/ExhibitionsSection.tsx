"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Award, Calendar, MapPin, ArrowRight, Sparkles, ExternalLink } from "lucide-react";

import { EXHIBITIONS_DATA } from "@/data/exhibitions.data";

export const ExhibitionsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#F4F4EF] text-[#0A0A0A] border-b border-[#DADBD2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 pb-6 border-b border-[#DADBD2]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">GLOBAL TRADE REPUTATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display leading-[0.95]">
              Over Two Decades of Global Exhibitions
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D] leading-relaxed font-sans">
              From Munich to North America and regional export summits, CM SPORTS WEAR has represented premier Pakistani craftsmanship at the world’s leading athletic trade arenas. Click any exhibition to explore stand photos, technical highlights, and event specs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#72726D]">
              <Globe className="w-4 h-4 text-[#D61C24]" />
              <span>Trusted Worldwide Exporter Since 2000</span>
            </div>
            <Link
              href="/exhibitions"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[11px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
            >
              <span>All Exhibitions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Grid / Timeline - All 5 Exhibitions Deep-Linked */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {EXHIBITIONS_DATA.map((item) => (
            <Link
              key={item.id}
              href={`/exhibitions#${item.id}`}
              className="bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-[#D61C24] transition-all cursor-pointer shadow-2xs group hover:-translate-y-1 duration-300"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={`${item.event} - ${item.city}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#0A0A0A]/90 text-white px-2 py-0.5 rounded-[1px] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {item.year}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-[#D61C24] text-white px-2 py-0.5 rounded-[1px] text-[9px] font-mono font-bold uppercase">
                    {item.highlight}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-[10.5px] font-mono text-[#D61C24] font-bold">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.city}, {item.country}</span>
                  </div>
                  <h3 className="text-sm font-bold uppercase font-display text-black group-hover:text-[#D61C24] transition-colors leading-tight line-clamp-2">
                    {item.event}
                  </h3>
                  <p className="text-[11.5px] text-[#72726D] font-sans leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom tag */}
              <div className="px-4 py-2.5 border-t border-[#F4F4EF] flex items-center justify-between text-[10.5px] font-mono text-[#72726D] bg-neutral-50/50">
                <span className="group-hover:text-[#0A0A0A] font-semibold transition-colors">View Details & Stand</span>
                <span className="text-[#D61C24] group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
              </div>

            </Link>
          ))}
        </div>

        {/* Global Distribution Map Banner */}
        <div className="mt-14 bg-white border border-[#DADBD2] rounded-[2px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] tracking-widest">
              WORLDWIDE PRIVATE LABEL DISTRIBUTION
            </span>
            <h4 className="text-xl font-bold uppercase font-display text-black">
              Exporting to Over 35 Countries Worldwide
            </h4>
            <p className="text-xs text-[#72726D] font-sans leading-relaxed">
              We ship turnkey bulk orders directly to sporting goods brands, pro team equipment managers, martial arts academies, and private label streetwear companies across the USA, UK, Germany, France, Australia, and Canada.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/catalogs"
              className="px-6 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
            >
              <span>Download Catalogs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
