"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Video, Camera, ArrowRight, ShieldCheck } from "lucide-react";

const MANUFACTURING_VIDEOS = [
  "/videos/VID-20200925-WA0003.mp4",
  "/videos/VID-20211001-WA0017.mp4",
  "/videos/VID-20220127-WA0062.mp4",
  "/videos/VID-20220127-WA0065.mp4",
  "/videos/20210202_141449.mp4",
  "/videos/VID-20200925-WA0002.mp4",
  "/videos/VID-20201009-WA0007.mp4",
  "/videos/VID-20211001-WA0016.mp4",
  "/videos/VID-20211108-WA0019.mp4",
  "/videos/VID-20220127-WA0061.mp4",
  "/videos/VID-20220127-WA0063.mp4",
  "/videos/VID-20220127-WA0064.mp4",
];

const MANUFACTURING_IMAGES = [
  "/production/1.jpg",
  "/production/2.jpg",
  "/production/3.jpg",
  "/production/8.jpg",
  "/production/10.jpg",
  "/production/14.jpg",
  "/production/15.jpg",
  "/production/20.jpg",
  "/production/21.jpg",
  "/production/20181031_164334.jpg",
  "/production/20181031_200345.jpg",
  "/production/20181101_114818.jpg",
  "/production/20181101_114820.jpg",
  "/production/20210202_141618.jpg",
  "/production/20210202_142759.jpg",
  "/production/20210202_143213.jpg",
];

export const ProductionTourSection: React.FC = () => {
  const videoScrollRef = useRef<HTMLDivElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const isImageHovered = useRef(false);

  useEffect(() => {
    const el = imageScrollRef.current;
    if (!el) return;

    let animId: number;
    const speed = 1.1; // Smooth continuous auto-sliding speed

    const step = () => {
      if (!isImageHovered.current && el) {
        el.scrollLeft += speed;
        // Halfway wrap for infinite seamless loop
        if (el.scrollLeft >= (el.scrollWidth - el.clientWidth) / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  const scrollVideos = (direction: "left" | "right") => {
    if (videoScrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      videoScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollImages = (direction: "left" | "right") => {
    if (imageScrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      imageScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] text-white border-b border-[#2A2A28] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#20201E]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-pulse" />
              <span className="eyebrow-label text-[#FF333D]">SIALKOT CAMPUS PRODUCTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.93]">
              Manufacturing Operations
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Direct, unedited factory floor footage and photography showing our heavy industrial sewing lines, embroidery setups, and finishing departments in Sialkot, Pakistan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <div className="px-4 py-2 rounded-[2px] bg-[#141414] border border-[#2A2A28]">
              <span className="text-[#FF333D] font-bold">50,000+</span> Units Monthly
            </div>
            <div className="px-4 py-2 rounded-[2px] bg-[#141414] border border-[#2A2A28]">
              <span className="text-emerald-400 font-bold">AQL 2.5</span> Inspection Standard
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. INFINITE CAROUSEL: MANUFACTURING VIDEOS               */}
        {/* ======================================================== */}
        <div className="space-y-4 mb-20">
          <div className="flex items-center justify-between pb-2 border-b border-[#20201E]">
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-[#FF333D]" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-white">
                Factory Video Reel ({MANUFACTURING_VIDEOS.length} Clips)
              </span>
              <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                &bull; Click any video to play with audio
              </span>
            </div>

            {/* Manual Scroll Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollVideos("left")}
                aria-label="Previous video"
                className="w-8 h-8 rounded-[1px] bg-[#141414] hover:bg-[#20201E] border border-[#2A2A28] hover:border-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollVideos("right")}
                aria-label="Next video"
                className="w-8 h-8 rounded-[1px] bg-[#141414] hover:bg-[#20201E] border border-[#2A2A28] hover:border-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Infinite Track Container */}
          <div className="relative overflow-hidden w-full group">
            {/* Edge Shadow Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

            <div
              ref={videoScrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
            >
              {/* Render duplicated list for infinite marquee feel */}
              {[...MANUFACTURING_VIDEOS, ...MANUFACTURING_VIDEOS].map((videoSrc, idx) => (
                <div
                  key={`video-${idx}`}
                  className="shrink-0 w-[280px] sm:w-[340px] md:w-[380px] aspect-[16/10] bg-[#141414] border border-[#2A2A28] hover:border-[#D61C24] rounded-[2px] overflow-hidden transition-all shadow-lg"
                >
                  <video
                    src={videoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover bg-black"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. INFINITE CAROUSEL: MANUFACTURING IMAGES               */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#20201E]">
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-[#FF333D]" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-white">
                Factory Floor Photography ({MANUFACTURING_IMAGES.length} Shots)
              </span>
              <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                &bull; Verified campus facilities &amp; machinery
              </span>
            </div>

            {/* Manual Scroll Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollImages("left")}
                aria-label="Previous photos"
                className="w-8 h-8 rounded-[1px] bg-[#141414] hover:bg-[#20201E] border border-[#2A2A28] hover:border-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollImages("right")}
                aria-label="Next photos"
                className="w-8 h-8 rounded-[1px] bg-[#141414] hover:bg-[#20201E] border border-[#2A2A28] hover:border-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Infinite Track Container */}
          <div className="relative overflow-hidden w-full group">
            {/* Edge Shadow Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

            <div
              ref={imageScrollRef}
              onMouseEnter={() => (isImageHovered.current = true)}
              onMouseLeave={() => (isImageHovered.current = false)}
              className="flex gap-4 overflow-x-auto no-scrollbar py-2"
            >
              {[...MANUFACTURING_IMAGES, ...MANUFACTURING_IMAGES].map((imgSrc, idx) => (
                <div
                  key={`photo-${idx}`}
                  className="shrink-0 w-[240px] sm:w-[280px] md:w-[320px] aspect-[4/3] bg-[#141414] border border-[#2A2A28] hover:border-[#D61C24] rounded-[2px] overflow-hidden transition-all shadow-md group/card cursor-pointer"
                >
                  <img
                    src={imgSrc}
                    alt="CM SPORTS WEAR Factory Floor"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA / Verification Strip */}
        <div className="mt-16 pt-8 border-t border-[#20201E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D61C24]" />
            <span>Facility Address: Taj Palace, Khadim Ali Road, Sialkot 51310, Pakistan</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
            >
              Factory Specs
            </Link>
            <Link
              href="/catalogs"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
            >
              View Catalogs
            </Link>
            <Link
              href="/request-quote"
              className="px-5 py-2.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
            >
              <span>Submit Tech Pack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
