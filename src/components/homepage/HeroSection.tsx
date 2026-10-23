"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { useHeaderStore } from "@/stores/useHeaderStore";

interface HeroSlide {
  id: string;
  categoryLabel: string;
  categoryTag: string;
  number: string;
  image: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  accentColor: string;
  specLabel: string;
  link: string;
}

// Hero Slides matching the high-resolution imagery in public/HERO
const HERO_SLIDES: HeroSlide[] = [
  {
    id: "ice-hockey",
    categoryLabel: "ICE HOCKEY",
    categoryTag: "PRO COMBAT · TACKLE TWILL · SUB-ZERO PERFORMANCE",
    number: "01",
    image: "/HERO/Dynamic Hockey Player in Motion.webp",
    titleLine1: "DOMINATE •",
    titleLine2: "THE ICE",
    description:
      "Tournament-grade ice hockey jerseys, reinforced double-elbow combat panels, custom tackle twill embroidery, and moisture-wicking heavy air-knit fabrics engineered for elite rinks.",
    accentColor: "#0284C7",
    specLabel: "SPEC: CM-HOCKEY-001 • 360 GSM PRO AIR-KNIT",
    link: "/catalog/?category=ice-hockey",
  },
  {
    id: "team-sports-wear",
    categoryLabel: "TEAM SPORTS WEAR",
    categoryTag: "PRO MATCH · REINFORCED · SUBLIMATED TEAM KITS",
    number: "02",
    image: "/HERO/Cinematic Basketball Duo in Arena.png",
    titleLine1: "OWN •",
    titleLine2: "THE ARENA",
    description:
      "Pro arena jerseys, diamond air-knit mesh uniforms, reinforced coverstitching, and tournament team kits crafted for collegiate and professional leagues.",
    accentColor: "#E85923",
    specLabel: "SPEC: CM-TEAM-002 • 330 GSM SPEED MESH",
    link: "/catalog/?category=team-sports-wear",
  },
  {
    id: "martial-arts-combat-wear",
    categoryLabel: "COMBAT SPORTS",
    categoryTag: "BJJ GIS · FIGHT SHORTS · COMPRESSION APPAREL",
    number: "03",
    image: "/HERO/Cinematic MMA Fighters in Industrial Gym (1).png",
    titleLine1: "FORGED FOR •",
    titleLine2: "THE CAGE",
    description:
      "Championship BJJ Gis, 4-way stretch fight rash guards, tear-resistant combat shorts, and competition doboks engineered for high friction.",
    accentColor: "#D61C24",
    specLabel: "SPEC: CM-COMBAT-003 • 550 GSM PEARL WEAVE",
    link: "/catalog/?category=martial-arts-combat-wear",
  },
  {
    id: "workwear-medical-wear",
    categoryLabel: "WORKWEAR & UNIFORMS",
    categoryTag: "DUTY-GRADE · FLUID-SHIELD · REINFORCED TWILL",
    number: "04",
    image: "/HERO/Emergency Response Heroes.png",
    titleLine1: "BUILT FOR •",
    titleLine2: "EVERY SHIFT",
    description:
      "Antimicrobial medical scrubs, industrial work uniforms, utility polo shirts, and high-visibility response apparel engineered to protect.",
    accentColor: "#0284C7",
    specLabel: "SPEC: CM-WORK-004 • LIQUID-REPELLENT TWILL",
    link: "/catalog/?category=workwear-medical-wear",
  },
];

const SLIDE_DURATION_MS = 4800; // Calmer, editorial pace so slides stay long enough to read comfortably

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // Always keep header visible
  useEffect(() => {
    useHeaderStore.getState().setHeaderVisible(true);
  }, []);

  // Infinite Auto Animation Effect across all 8 categories in sequential order
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((curr) => (curr + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [activeIdx]);

  // Automatically scroll horizontal tabs container only (NEVER scroll the page or window)
  useEffect(() => {
    const container = tabsContainerRef.current;
    const activeTabEl = tabRefs.current[activeIdx];
    if (container && activeTabEl) {
      const targetScrollLeft =
        activeTabEl.offsetLeft - container.clientWidth / 2 + activeTabEl.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  }, [activeIdx]);

  const goToSlide = useCallback((index: number) => {
    setActiveIdx(index);
  }, []);

  const handleScrollDown = () => {
    if (containerRef.current) {
      const nextSection = containerRef.current.nextElementSibling as HTMLElement | null;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  const currentSlide = HERO_SLIDES[activeIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0A0A0A] select-none"
    >
      {/* Hero Stage with Dynamic Viewport Height & Zero Overflow Clipping */}
      <section className="relative w-full h-[320px] sm:h-[400px] lg:h-[100svh] lg:max-h-[1080px] overflow-hidden bg-[#0A0A0A] text-white flex flex-col justify-between mt-14 sm:mt-16 lg:mt-0">
        {/* ======================================================== */}
        {/* BACKGROUND SLIDES: CINEMATIC ANIMATION ON ALL SLIDES      */}
        {/* ======================================================== */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.categoryLabel}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={idx === 0 ? "high" : "low"}
                  className="w-full h-full object-cover object-top sm:object-center brightness-100 contrast-105 select-none pointer-events-none scale-100"
                />
                {/* Subtle gradient focused only on the text area on left */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/55 via-25% to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent via-15% to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TOP CONTROLS: CATEGORY TABS & SLIDE COUNTER              */}
        {/* ======================================================== */}
        <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-3 sm:pt-5 lg:pt-24 pb-1 sm:pb-2 flex items-center justify-between shrink-0">
          {/* Top Left: Category Toggle Pills for all 8 categories with active animated progress effect */}
          <div 
            ref={tabsContainerRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-[68%] sm:max-w-none pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={slide.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  onClick={() => goToSlide(idx)}
                  className={`relative overflow-hidden px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-xs font-mono font-bold tracking-wider uppercase rounded-[2px] transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-white text-[#0A0A0A] shadow-lg ring-1 ring-white/60"
                      : "bg-black/50 hover:bg-black/80 text-white/70 border border-white/20 hover:border-white/50 backdrop-blur-sm"
                  }`}
                >
                  <span className="relative z-10">{slide.categoryLabel}</span>
                  {/* Animation progress effect active on current tab, moving seamlessly across all 8 tabs */}
                  {isActive && (
                    <span
                      key={`tab-progress-${activeIdx}`}
                      className="absolute bottom-0 left-0 h-[2.5px] bg-[#D61C24] animate-hero-progress z-20 pointer-events-none"
                      style={{
                        animationDuration: `${SLIDE_DURATION_MS}ms`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Top Right: Slide Number and Animated Infinite Progress Line */}
          <div className="flex flex-col items-end gap-1 text-right shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5 font-mono text-xs text-white/80">
              <span className="font-bold text-white text-xs sm:text-sm">
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <div className="w-10 sm:w-16 h-[2px] bg-white/20 relative overflow-hidden rounded-full">
                <div
                  key={`top-progress-${activeIdx}`}
                  className="h-full bg-white animate-hero-progress"
                  style={{
                    animationDuration: `${SLIDE_DURATION_MS}ms`,
                  }}
                />
              </div>
              <span className="text-white/40">
                {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 hidden sm:block">
              {currentSlide.specLabel}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN EDITORIAL HEADLINE & COPY (FLEX-1 CENTERED CONTENT) */}
        {/* ======================================================== */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex-1 min-h-0 flex flex-col justify-center py-2 sm:py-4">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Scaled Responsive Display Headline (Ensures breathing room for bottom banners) */}
            <h1
              className="text-2xl sm:text-5xl md:text-7xl lg:text-[5.2rem] xl:text-[5.8rem] font-black uppercase tracking-tighter text-[#F4F4EF] leading-[0.92] sm:leading-[0.88] select-none font-display drop-shadow-md"
            >
              <div className="overflow-hidden py-0.5 sm:py-1">
                <span
                  key={`line1-${activeIdx}`}
                  className="inline-flex items-center animate-in fade-in slide-in-from-bottom-8 duration-300 ease-out fill-mode-both"
                >
                  {currentSlide.titleLine1.includes("•") ? (
                    <>
                      <span>{currentSlide.titleLine1.replace("•", "").trim()}</span>
                      <span className="inline-block w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full bg-[#D61C24] ml-2 sm:ml-3 shadow-[0_0_15px_rgba(214,28,36,0.8)] animate-pulse" />
                    </>
                  ) : (
                    currentSlide.titleLine1
                  )}
                </span>
              </div>
              <div className="overflow-hidden py-0.5 sm:py-1">
                <span
                  key={`line2-${activeIdx}`}
                  className="block animate-in fade-in slide-in-from-bottom-10 duration-400 delay-75 ease-out fill-mode-both text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-white/90"
                >
                  {currentSlide.titleLine2}
                </span>
              </div>
            </h1>

            {/* Supporting Copy */}
            <p
              key={`desc-${activeIdx}`}
              className="text-[11px] sm:text-sm md:text-base text-neutral-300 max-w-md font-normal leading-relaxed mt-1 sm:mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-150 fill-mode-both line-clamp-1 sm:line-clamp-none"
            >
              {currentSlide.description}
            </p>

            {/* Action Row */}
            <div
              key={`actions-${activeIdx}`}
              className="flex flex-wrap items-center gap-2 sm:gap-3.5 pt-2 sm:pt-6 animate-in fade-in slide-in-from-bottom-3 duration-300 delay-200 fill-mode-both"
            >
              <Link
                href={currentSlide.link}
                className="px-3.5 sm:px-6 py-2 sm:py-3.5 bg-white hover:bg-neutral-200 text-[#0A0A0A] text-[9.5px] sm:text-xs font-bold font-mono tracking-wider uppercase rounded-[2px] transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-102 group"
              >
                <span>VIEW THE RANGES</span>
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Tag Pill with Plus Icon */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-white/80 hover:border-white/50 transition-colors">
                <span className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center text-[10px] leading-none text-[#D61C24] font-bold">
                  +
                </span>
                <span className="tracking-wider text-[11px] sm:text-xs">{currentSlide.categoryTag}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM ELEMENTS: FLOATING QUOTE CAPSULE & SCROLL DOWN    */}
        {/* Guaranteed never-clip shrink-0 layout with safe padding  */}
        {/* ======================================================== */}
        <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-5 sm:pb-7 pt-2 flex items-center justify-between shrink-0">
          <div className="hidden lg:block w-32" />

          {/* Center Floating Pill: "Samples first. Your label, your spec. | GET A QUOTE ↗" */}
          <div className="mx-auto sm:mx-0">
            <div className="bg-[#121210]/95 backdrop-blur-md border border-white/20 rounded-full pl-3.5 sm:pl-5 pr-1.5 sm:pr-2 py-1 sm:py-1.5 flex items-center gap-2 sm:gap-3 text-xs shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
              <span className="text-white/80 text-[10px] sm:text-xs">
                <strong className="text-white font-bold">Samples first.</strong>{" "}
                <span className="hidden sm:inline">Your label, your spec.</span>
              </span>
              <Link
                href="/request-quote"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#D90429] hover:bg-[#9E001B] text-white text-[10px] sm:text-xs font-bold font-mono uppercase tracking-wider rounded-full transition-colors flex items-center gap-1 shadow-md group"
              >
                <span>GET A QUOTE</span>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right: Scroll Down Button (Clickable Smooth Scroll) */}
          <button
            onClick={handleScrollDown}
            className="hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/60 hover:text-white uppercase transition-colors cursor-pointer group"
          >
            <span>SCROLL DOWN</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
