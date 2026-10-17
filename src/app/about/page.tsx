"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import {
  ShieldCheck,
  Factory,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PackageCheck,
  MessageCircle,
  FileText,
  Maximize2,
  X,
  Users,
  Check,
  ChevronRight,
  Truck,
  Layers,
  Shirt
} from "lucide-react";

export default function AboutPage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<"all" | "stitching" | "ready" | "shipping">("all");

  // Core production chapters (general, authentic, non-specific)
  const productionChapters = [
    {
      id: "stitching-halls",
      category: "PRODUCTION FLOOR",
      title: "Active Stitching Halls & Skilled Workforce",
      subtitle: "In-House Assembly Lines & Continuous Production",
      description:
        "Our expansive manufacturing floors bring together experienced garment craftsmen working on dedicated industrial sewing stations. From multi-needle assembly to precision seam finishing, work is organized in continuous line streams to maintain strict dimensional tolerance across small custom runs and mass export consignments.",
      primaryImage: "/production/20181101_114818.jpg",
      gallery: [
        "/production/20181101_114818.jpg",
        "/production/20181031_200345.jpg",
        "/production/20210202_141618.jpg",
        "/production/20181031_164334.jpg",
      ],
      highlights: [
        "Dedicated multi-station sewing and assembly lines",
        "Trained craftsmen with decades of apparel expertise",
        "Well-ventilated, ergonomic factory floor environment",
        "Real-time floor supervision and line-balancing",
      ],
    },
    {
      id: "ready-pieces",
      category: "FINISHED PIECES",
      title: "Finished Garments & Ready Piece Standards",
      subtitle: "Export-Grade Athletic Apparel & Streetwear Results",
      description:
        "Every completed garment represents our commitment to accurate fit, clean drape, and resilient construction. Whether crafting heavyweight streetwear fleece, varsity outerwear, technical cycling gear, or combat sports uniforms, all finished pieces are inspected and finalized to meet international retail standards.",
      primaryImage: "/production/1.jpg",
      gallery: [
        "/production/1.jpg",
        "/production/2.jpg",
        "/production/3.jpg",
        "/production/20.jpg",
      ],
      highlights: [
        "Accurate sizing specifications and pattern grading",
        "Premium fabric weight, drape, and tactile hand-feel",
        "Reinforced stress seams and long-lasting durability",
        "Complete retail-ready trims and brand detailing",
      ],
    },
    {
      id: "packaging-shipping",
      category: "DISPATCH & LOGISTICS",
      title: "Staging, Export Packaging & Global Shipping",
      subtitle: "Secure Consignments Ready for International Export",
      description:
        "Following thorough final inspection, garments are steam-pressed, polybagged, barcode-scanned, and packed into reinforced export master cartons. Orders are staged in our secure dispatch warehouse for direct air freight dispatch or containerized ocean shipments to destinations across the globe.",
      primaryImage: "/production/20210202_182243.jpg",
      gallery: [
        "/production/20210202_182243.jpg",
        "/production/20210202_182248.jpg",
        "/production/20210213_112712.jpg",
        "/production/20210213_133317.jpg",
      ],
      highlights: [
        "Reinforced 7-ply export-grade corrugated cartons",
        "Individual protective polybagging and carton labeling",
        "Organized warehouse staging and freight palletization",
        "Worldwide DDP, CIF, and FOB air and ocean freight logistics",
      ],
    },
  ];

  // Curated photo mosaic for full facility visual tour
  const allGalleryItems = [
    { src: "/production/20181101_114818.jpg", tab: "stitching", label: "Stitching Hall Floor" },
    { src: "/production/1.jpg", tab: "ready", label: "Finished Garment" },
    { src: "/production/20210202_182243.jpg", tab: "shipping", label: "Export Cartons & Packing" },
    { src: "/production/20181031_200345.jpg", tab: "stitching", label: "Factory Assembly Lines" },
    { src: "/production/2.jpg", tab: "ready", label: "Final Ready Piece" },
    { src: "/production/20210213_112712.jpg", tab: "shipping", label: "Warehouse Staging Area" },
    { src: "/production/20210202_141618.jpg", tab: "stitching", label: "Skilled Craftsmen at Work" },
    { src: "/production/3.jpg", tab: "ready", label: "Completed Export Order" },
    { src: "/production/20210213_133317.jpg", tab: "shipping", label: "Shipping Consignments" },
    { src: "/production/20.jpg", tab: "ready", label: "Ready Outerwear Piece" },
    { src: "/production/20181031_164334.jpg", tab: "stitching", label: "Production Hall Overview" },
    { src: "/production/20210202_182248.jpg", tab: "shipping", label: "Boxed Goods for Dispatch" },
  ];

  const filteredGallery = selectedGalleryTab === "all"
    ? allGalleryItems
    : allGalleryItems.filter(item => item.tab === selectedGalleryTab);

  const facilitySpecs = [
    { value: "65,000 SQ FT", label: "Campus Footprint", desc: "Dedicated manufacturing facility in Sialkot, Pakistan" },
    { value: "120K / MO", label: "Monthly Output", desc: "Scalable capacity across sports apparel and outerwear" },
    { value: "ISO 9001:2015", label: "Certified Facility", desc: "Standardized quality control & worker safety compliance" },
    { value: "35+ NATIONS", label: "Export Reach", desc: "Direct shipments to USA, UK, Europe, and Australia" },
  ];

  const pillars = [
    {
      icon: <Factory className="w-5 h-5 text-[#D61C24]" />,
      title: "100% In-House Facility Control",
      desc: "All garment assembly, finishing, quality checking, and dispatch take place within our unified Sialkot manufacturing campus without broker subcontracting.",
    },
    {
      icon: <Users className="w-5 h-5 text-[#D61C24]" />,
      title: "Skilled Team & Ethical Workplace",
      desc: "Fair compensation, safe and clean floor conditions, zero child labor, and continuous technical training for our dedicated production craftsmen.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#D61C24]" />,
      title: "Prototype Samples to Full Volume",
      desc: "Rapid turnaround on pre-production prototypes, allowing brands to verify fabrics, fits, and finishes before launching bulk runs.",
    },
    {
      icon: <Globe className="w-5 h-5 text-[#D61C24]" />,
      title: "Reliable Global Logistics (DDP / FOB)",
      desc: "Comprehensive export solutions including customs clearance, documentation, air express, and ocean container freight directly to your doorstep.",
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] text-[#0A0A0A] font-sans selection:bg-[#D61C24] selection:text-white pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D61C24]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[#FF333D] font-bold">About Us</span>
          </div>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D61C24]/15 border border-[#D61C24]/30 rounded-[2px]">
              <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-pulse" />
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#FF4D55] tracking-widest">
                CM SPORTS WEAR &bull; SIALKOT, PAKISTAN
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white font-display leading-[0.93]">
              Craftsmanship, Scale <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#D61C24]">
                &amp; Vertical Production
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl">
              Based in Sialkot, Pakistan, CM SPORTS WEAR is an integrated sports apparel and technical outerwear manufacturer. For over two decades, our factory operations have supplied international sporting goods brands, professional clubs, and private labels with export-ready athletic garments.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/request-quote"
                className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2 shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span>Request Factory Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent(`Hello ${siteConfig.name}, I would like to inquire about apparel manufacturing and production capacity.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Direct WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FACILITY SPECIFICATIONS & STATS                                        */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-3xl space-y-3">
            <span className="eyebrow-label text-[#D61C24]">SIALKOT PRODUCTION FACILITY</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display leading-[0.95]">
              Vertical Integration. Direct Factory Export.
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D] leading-relaxed font-sans pt-1">
              At <strong className="text-black font-semibold">CM SPORTS WEAR</strong>, we maintain complete oversight of the manufacturing lifecycle. From material inspection and high-precision cutting to multi-line stitching, final quality checks, and containerized dispatch, our centralized operations guarantee consistency and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {facilitySpecs.map((spec, i) => (
              <div key={i} className="bg-white border border-[#DADBD2] p-5 rounded-[2px] shadow-2xs hover:border-[#D61C24] transition-colors">
                <div className="text-lg sm:text-xl font-black text-black font-mono">{spec.value}</div>
                <div className="text-[10.5px] font-mono uppercase font-bold text-[#D61C24] mt-1">{spec.label}</div>
                <p className="text-xs text-[#72726D] mt-2 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-xs font-mono text-[#72726D] pt-2 border-t border-[#DADBD2]/60 flex flex-wrap items-center justify-between gap-3">
            <span>📍 Campus Location: {siteConfig.address.full}</span>
            <span className="text-[#D61C24] font-semibold">AQL 2.5 Quality Standards &bull; Worldwide Air & Sea Freight</span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE PRODUCTION CHAPTERS (STITCHING, READY PIECES, PACKAGING & SHIPPING) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">FACTORY OPERATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Inside Our Manufacturing Operations
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D] font-sans leading-relaxed">
              Explore authentic views of our facility in action—from active stitching halls staffed by skilled labor to finished apparel ready for distribution and export packing operations.
            </p>
          </div>

          {/* Chapters Stack */}
          <div className="space-y-16 lg:space-y-24">
            {productionChapters.map((chapter, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={chapter.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Left / Right Photo Column */}
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="relative bg-[#F4F4EF] border border-[#DADBD2] p-2.5 rounded-[2px] shadow-sm group">
                      
                      {/* Main Big Photo */}
                      <div 
                        onClick={() => setLightboxImage(chapter.primaryImage)}
                        className="relative aspect-4/3 overflow-hidden rounded-[1px] bg-neutral-900 cursor-pointer shadow-xs"
                      >
                        <img
                          src={chapter.primaryImage}
                          alt={chapter.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-[1px] uppercase tracking-wider">
                          {chapter.category}
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-mono text-xs">
                          <Maximize2 className="w-4 h-4" />
                          <span>Click to Enlarge</span>
                        </div>
                      </div>

                      {/* Small thumbnail strip */}
                      <div className="grid grid-cols-4 gap-2 mt-2.5">
                        {chapter.gallery.map((img, thumbIdx) => (
                          <button
                            key={thumbIdx}
                            onClick={() => setLightboxImage(img)}
                            className="relative aspect-square overflow-hidden rounded-[1px] border border-[#DADBD2] hover:border-[#D61C24] transition-colors bg-neutral-900 cursor-pointer"
                            title={`View photo ${thumbIdx + 1}`}
                          >
                            <img
                              src={img}
                              alt="Facility photo thumbnail"
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Left / Right Details Column */}
                  <div className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-bold text-[#D61C24] uppercase tracking-wider">
                        {chapter.subtitle}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                        {chapter.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#72726D] leading-relaxed font-sans">
                      {chapter.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono font-bold uppercase text-[#0A0A0A]">
                        Facility Highlights:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#20201E]">
                        {chapter.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[#F4F4EF] p-2 rounded-[2px] border border-[#DADBD2]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D61C24] shrink-0" />
                            <span className="text-[11px] leading-tight">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE PRODUCTION PHOTO MOSAIC GALLERY                            */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DADBD2]">
            <div className="space-y-2 max-w-2xl">
              <span className="eyebrow-label text-[#D61C24]">VISUAL ARCHIVE</span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
                Facility &amp; Production Floor Photography
              </h2>
              <p className="text-xs sm:text-sm text-[#72726D] font-sans">
                Real photographic documentation of our daily operations—stitching lines, finished sample pieces, and export packaging dispatch.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: "all", label: "All Photos" },
                { id: "stitching", label: "Stitching Halls" },
                { id: "ready", label: "Ready Pieces" },
                { id: "shipping", label: "Shipping & Packaging" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGalleryTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-[2px] text-xs font-mono uppercase font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    selectedGalleryTab === tab.id
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-xs"
                      : "bg-white text-[#72726D] border-[#DADBD2] hover:text-[#0A0A0A] hover:border-[#0A0A0A]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(item.src)}
                className="group relative aspect-4/3 overflow-hidden rounded-[2px] bg-neutral-900 border border-[#DADBD2] hover:border-[#D61C24] transition-all cursor-pointer shadow-2xs"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                  <div className="self-end bg-black/60 p-1.5 rounded-full">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-mono font-bold tracking-wide">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOUR OPERATIONAL PILLARS                                              */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="eyebrow-label text-[#D61C24]">THE FACTORY ADVANTAGE</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Why Global Brands Choose CM SPORTS WEAR
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D]">
              Direct factory contracts, clear wholesale volume tiers, and uncompromised apparel craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#DADBD2] p-6 rounded-[2px] space-y-3 hover:border-[#D61C24] transition-colors shadow-2xs"
              >
                <div className="p-2.5 bg-[#F4F4EF] w-fit rounded-[2px] border border-[#DADBD2]">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-bold uppercase font-display text-black">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#72726D] leading-relaxed font-sans">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="bg-[#0A0A0A] text-white py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF333D] font-bold">
              PLAN YOUR APPAREL PRODUCTION RUN
            </span>
            <h4 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
              Begin Manufacturing with CM SPORTS WEAR
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400">
              Submit your technical specification sheet or book a virtual factory walkthrough to inspect our stitching halls, finished garments, and export packing operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/request-quote"
              className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Tech Pack</span>
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent("Hello CM SPORTS WEAR, I would like to schedule a virtual tour or discuss apparel manufacturing.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FULLSCREEN LIGHTBOX MODAL                                              */}
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
              alt="Production Facility Full View"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-[2px] border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
