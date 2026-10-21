"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Globe, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { EXHIBITIONS_DATA } from "@/data/exhibitions.data";

export const ExhibitionsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<number>(0);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPos = container.scrollLeft;
    const cardWidth = container.clientWidth * 0.82;
    const index = Math.round(scrollPos / cardWidth);
    setActiveDot(Math.min(Math.max(index, 0), EXHIBITIONS_DATA.length - 1));
  };

  const scrollPrev = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-[#F4F4EF] text-[#0A0A0A] border-b border-[#DADBD2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-14 pb-4 sm:pb-6 border-b border-[#DADBD2]">
          <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">GLOBAL TRADE REPUTATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display leading-[0.95]">
              Over Two Decades of Global Exhibitions
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D] leading-relaxed font-sans">
              From Munich to North America and regional export summits, CM SPORTS WEAR has represented premier Pakistani craftsmanship at the world’s leading athletic trade arenas. Click any exhibition to explore stand photos, technical highlights, and event specs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-[#72726D]">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D61C24]" />
              <span>Trusted Worldwide Exporter Since 2000</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Chevrons */}
              <div className="flex items-center gap-1.5 md:hidden">
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous exhibition"
                  className="w-8 h-8 rounded-full border border-[#DADBD2] bg-white flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next exhibition"
                  className="w-8 h-8 rounded-full border border-[#DADBD2] bg-white flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <Link
                href="/exhibitions"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[10.5px] sm:text-[11px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                <span>All Exhibitions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Slider */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onScroll={handleScroll}
          className="md:hidden flex overflow-x-auto no-scrollbar scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing snap-x snap-mandatory gap-3.5 px-4 pb-2 -mx-4"
        >
          {EXHIBITIONS_DATA.map((item) => (
            <Link
              key={item.id}
              href={`/exhibitions#${item.id}`}
              onClick={handleCardClick}
              className="w-[82vw] max-w-[310px] shrink-0 snap-start bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-[#D61C24] transition-all cursor-pointer shadow-2xs group"
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
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#D61C24] font-bold">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.city}, {item.country}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase font-display text-black group-hover:text-[#D61C24] transition-colors leading-tight line-clamp-2">
                    {item.event}
                  </h3>
                  <p className="text-[11px] text-[#72726D] font-sans leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom tag */}
              <div className="px-3.5 py-2 border-t border-[#F4F4EF] flex items-center justify-between text-[10px] font-mono text-[#72726D] bg-neutral-50/50">
                <span className="group-hover:text-[#0A0A0A] font-semibold transition-colors">View Details & Stand</span>
                <span className="text-[#D61C24] group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="md:hidden flex items-center justify-center gap-1.5 mt-3 pt-1">
          {EXHIBITIONS_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!scrollContainerRef.current) return;
                const cardWidth = scrollContainerRef.current.clientWidth * 0.82;
                scrollContainerRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
              }}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeDot === idx ? "w-6 bg-[#D61C24]" : "w-1.5 bg-[#DADBD2]"
              }`}
            />
          ))}
        </div>

        {/* Desktop Feature Grid / Timeline - All 5 Exhibitions Deep-Linked */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
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
        <div className="mt-8 sm:mt-14 bg-white border border-[#DADBD2] rounded-[2px] p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] tracking-widest">
              WORLDWIDE PRIVATE LABEL DISTRIBUTION
            </span>
            <h4 className="text-lg sm:text-xl font-bold uppercase font-display text-black">
              Exporting to Over 35 Countries Worldwide
            </h4>
            <p className="text-xs text-[#72726D] font-sans leading-relaxed">
              We ship turnkey bulk orders directly to sporting goods brands, pro team equipment managers, martial arts academies, and private label streetwear companies across the USA, UK, Germany, France, Australia, and Canada.
            </p>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-center gap-3 shrink-0">
            <Link
              href="/catalogs"
              className="w-full sm:w-auto px-6 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2"
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

