"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Globe, 
  MapPin, 
  Calendar, 
  Award, 
  Building2, 
  Layers, 
  CheckCircle2, 
  MessageCircle, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  Maximize2, 
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Tag
} from "lucide-react";
import type { Exhibition } from "@/data/exhibitions.data";
import { siteConfig } from "@/config/site.config";

interface ExhibitionsClientProps {
  exhibitions: Exhibition[];
}

export default function ExhibitionsClient({ exhibitions }: ExhibitionsClientProps) {
  const [activeAnchor, setActiveAnchor] = useState<string>("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Smooth scroll and anchor highlight on initial mount and hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveAnchor(hash);
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          // Delay briefly to allow complete rendering and DOM metrics calculation
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 120);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveAnchor(id);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4EF] text-[#0A0A0A] font-sans selection:bg-[#D61C24] selection:text-white pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER                                                            */}
      {/* ========================================================================= */}
      <section className="relative bg-[#0A0A0A] text-white pt-28 pb-16 sm:pb-24 border-b border-[#2A2A28] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D61C24]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <Link href="/about" className="hover:text-white transition-colors">Company</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[#FF333D] font-bold">Exhibitions</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#222]">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D61C24]/15 border border-[#D61C24]/30 rounded-[2px]">
                <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-pulse" />
                <span className="text-[10.5px] font-mono uppercase font-bold text-[#FF4D55] tracking-widest">
                  GLOBAL TRADE ARCHIVE &bull; 2005 – PRESENT
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-display leading-[0.95]">
                International Trade Fairs <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#D61C24]">
                  & Global Exhibitions
                </span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl">
                From Munich to Las Vegas, Atlanta to Karachi, explore CM SPORTS WEAR’s rich exhibition heritage. For over two decades, our factory engineering leadership has represented premier Pakistani athletic apparel and combat gear craftsmanship at the world’s most prestigious sports business arenas.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/catalogs"
                className="px-5 py-3 bg-white text-[#0A0A0A] hover:bg-[#D61C24] hover:text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Download Catalogs</span>
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent("Hello CM SPORTS WEAR, I would like to inquire about your international trade exhibitions and schedule a private meeting.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#181D2C] hover:bg-[#20273A] border border-[#2B3347] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Meet at Next Show</span>
              </a>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <div className="bg-[#121212] border border-[#222] p-4 rounded-[2px]">
              <div className="text-2xl sm:text-3xl font-black font-display text-white">20+ Years</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide mt-1">International Trade Presence</div>
            </div>
            <div className="bg-[#121212] border border-[#222] p-4 rounded-[2px]">
              <div className="text-2xl sm:text-3xl font-black font-display text-[#D61C24]">4 Continents</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide mt-1">Global Trade Delegations</div>
            </div>
            <div className="bg-[#121212] border border-[#222] p-4 rounded-[2px]">
              <div className="text-2xl sm:text-3xl font-black font-display text-white">35+ Countries</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide mt-1">Export Distribution Network</div>
            </div>
            <div className="bg-[#121212] border border-[#222] p-4 rounded-[2px]">
              <div className="text-2xl sm:text-3xl font-black font-display text-emerald-400">100% Turnkey</div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide mt-1">Direct Factory OEM/ODM Sourcing</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STICKY QUICK JUMP NAVIGATION BAR                                       */}
      {/* ========================================================================= */}
      <div className="sticky top-16 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DADBD2] shadow-xs py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#72726D] shrink-0 mr-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#D61C24]" />
                <span className="hidden sm:inline">JUMP TO EVENT:</span>
              </span>
              
              {exhibitions.map((item) => {
                const isActive = activeAnchor === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                      isActive
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-xs"
                        : "bg-[#F4F4EF] text-[#0A0A0A] border-[#DADBD2] hover:border-[#0A0A0A]"
                    }`}
                  >
                    <span>{item.shortName}</span>
                    <span className="ml-1 text-[10px] text-neutral-400">({item.year})</span>
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-[#72726D] hidden md:inline shrink-0">
              Showing {exhibitions.length} Documented Exhibitions
            </span>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. EXHIBITION DETAILED SECTIONS                                           */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16 sm:space-y-24">
        {exhibitions.map((item, index) => {
          const isTargeted = activeAnchor === item.id;

          return (
            <section
              key={item.id}
              id={item.id}
              className={`scroll-mt-28 bg-white border rounded-[2px] transition-all duration-500 overflow-hidden shadow-xs ${
                isTargeted
                  ? "border-[#D61C24] ring-2 ring-[#D61C24]/20"
                  : "border-[#DADBD2] hover:border-neutral-400"
              }`}
            >
              
              {/* Event Top Banner */}
              <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#222]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#D61C24] text-white text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-[1px]">
                      {item.year} EDITION
                    </span>
                    <span className="bg-white/10 text-neutral-300 text-[11px] font-mono px-2.5 py-0.5 rounded-[1px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#FF4D55]" />
                      <span>{item.dates}</span>
                    </span>
                    <span className="bg-white/10 text-neutral-300 text-[11px] font-mono px-2.5 py-0.5 rounded-[1px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF4D55]" />
                      <span>{item.city}, {item.country}</span>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black uppercase font-display text-white tracking-tight">
                    {item.event}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 font-mono">
                    Venue: <span className="text-white">{item.venue}</span> &bull; Pavilion: <span className="text-[#FF4D55]">{item.pavilion}</span> ({item.booth})
                  </p>
                </div>

                {/* Right Badge */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                  <div className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-[2px] text-right">
                    <div className="text-[10px] font-mono uppercase text-neutral-400">Stand Classification</div>
                    <div className="text-xs font-mono font-bold text-white">{item.booth}</div>
                  </div>
                  <div className="text-[11px] font-mono text-[#FF4D55] font-bold">
                    &bull; {item.highlight}
                  </div>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="p-6 sm:p-8 lg:p-10 space-y-8">
                
                {/* 2-Column: Left Gallery & Right Technical / Commercial Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Gallery (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10.5px] font-mono uppercase font-bold text-[#D61C24] tracking-widest block">
                        OFFICIAL STAND PHOTOGRAPHY
                      </span>
                      <h3 className="text-base font-bold font-display uppercase text-[#0A0A0A]">
                        Live Trade Fair Exhibition Booth
                      </h3>
                    </div>

                    {/* Main Showcase Image */}
                    <div 
                      onClick={() => setLightboxImage(item.image)}
                      className="relative aspect-4/3 rounded-[2px] overflow-hidden bg-neutral-950 border border-[#DADBD2] cursor-pointer group shadow-2xs"
                    >
                      <img
                        src={item.image}
                        alt={`${item.event} Stand Photo`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs">
                        <Maximize2 className="w-5 h-5" />
                        <span>Click to Enlarge</span>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-[#0A0A0A]/90 text-white px-2 py-0.5 rounded-[1px] text-[10px] font-mono font-bold">
                        {item.city} Pavilion &bull; {item.year}
                      </div>
                    </div>

                    {/* Multi-Photo Thumbnails */}
                    {item.gallery && item.gallery.length > 1 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-[#72726D]">
                          Archive Stills ({item.gallery.length} photos available)
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {item.gallery.map((imgUrl, imgIdx) => (
                            <button
                              key={imgIdx}
                              onClick={() => setLightboxImage(imgUrl)}
                              className="relative aspect-square rounded-[2px] overflow-hidden border border-[#DADBD2] hover:border-[#D61C24] transition-all cursor-pointer group/thumb bg-neutral-900"
                              title={`View photo ${imgIdx + 1}`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Stand photo ${imgIdx + 1}`}
                                className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location Verification Card */}
                    <div className="bg-[#F8F8F5] border border-[#DADBD2] p-4 rounded-[2px] space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-neutral-500">
                        <span>TRADE SHOW DATES</span>
                        <span className="font-bold text-[#0A0A0A]">{item.dates}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-500">
                        <span>STAND / BOOTH</span>
                        <span className="font-bold text-[#D61C24]">{item.booth}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-500">
                        <span>EXHIBIT VENUE</span>
                        <span className="font-bold text-[#0A0A0A] text-right truncate max-w-[200px]">{item.venue}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right: Technical Specifications & Strategic Impact (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Event Executive Overview */}
                    <div className="space-y-2">
                      <span className="text-[10.5px] font-mono uppercase font-bold text-[#D61C24] tracking-widest block">
                        EXECUTIVE SUMMARY & TRADE SIGNIFICANCE
                      </span>
                      <p className="text-sm text-[#444] font-sans leading-relaxed">
                        {item.overview}
                      </p>
                    </div>

                    {/* Product Categories Showcased */}
                    <div className="space-y-2.5 pt-2 border-t border-[#F0F0EA]">
                      <span className="text-[10.5px] font-mono uppercase font-bold text-[#0A0A0A] tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#D61C24]" />
                        <span>GARMENT LINES & APPAREL CATEGORIES EXHIBITED</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.showcaseCategories.map((cat, catIdx) => (
                          <span
                            key={catIdx}
                            className="px-2.5 py-1 bg-[#F4F4EF] hover:bg-[#EAEAE2] border border-[#DADBD2] rounded-[2px] text-xs font-mono font-medium text-[#1A1A1A] transition-colors"
                          >
                            &bull; {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Technical Specifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      
                      {/* Box 1: Technical Highlights */}
                      <div className="bg-[#F8F8F5] border border-[#DADBD2] p-4 rounded-[2px] space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D61C24] uppercase">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Technical Manufacturing Highlights</span>
                        </div>
                        <p className="text-xs text-[#555] font-sans leading-relaxed">
                          {item.technicalHighlights}
                        </p>
                      </div>

                      {/* Box 2: Commercial Impact */}
                      <div className="bg-[#F8F8F5] border border-[#DADBD2] p-4 rounded-[2px] space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0A0A0A] uppercase">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Commercial Outcomes & Contracts</span>
                        </div>
                        <p className="text-xs text-[#555] font-sans leading-relaxed">
                          {item.commercialImpact}
                        </p>
                      </div>

                    </div>

                    {/* Delegation & On-Site Capabilities */}
                    <div className="bg-[#FAF7F7] border border-[#F0D5D6] p-4 rounded-[2px] space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D61C24] uppercase">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Factory Delegation & Direct Sourcing Desk</span>
                      </div>
                      <p className="text-xs text-[#444] font-sans leading-relaxed">
                        {item.delegationDetails}
                      </p>
                    </div>

                    {/* Quick Inquiry CTA Strip for this Exhibition Range */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="text-xs font-mono text-[#72726D]">
                        Interested in products exhibited at <span className="font-bold text-[#0A0A0A]">{item.shortName}</span>?
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/request-quote"
                          className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[11px] font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-1.5"
                        >
                          <span>Request Tech Packs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent(`Hello CM SPORTS WEAR, I would like to inquire about products exhibited at ${item.event} (${item.year}).`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Factory</span>
                        </a>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </section>
          );
        })}
      </main>

      {/* ========================================================================= */}
      {/* 4. WORLDWIDE COMMERCIAL REACH BANNER                                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-[#0A0A0A] text-white border border-[#222] rounded-[2px] p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D61C24]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-mono uppercase font-bold text-[#FF4D55] tracking-widest">
                SCHEDULE AN APPOINTMENT OR FACTORY VISIT
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase font-display text-white tracking-tight">
                Meeting Us at Upcoming International Fairs
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                CM SPORTS WEAR frequently exhibits at European and North American athletic sourcing events. Contact our export sales desk to book a dedicated booth session, inspect custom sample collections, or arrange an executive factory tour in Sialkot, Pakistan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent("Hello CM SPORTS WEAR, I would like to schedule a private trade booth meeting for your upcoming exhibitions.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#b8141b] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Meeting via WhatsApp</span>
              </a>
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2"
              >
                <span>Contact Sialkot Office</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LIGHTBOX MODAL FOR FULL RESOLUTION STAND IMAGES                        */}
      {/* ========================================================================= */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close image lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Trade Exhibition Booth Full View"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-[2px] border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
