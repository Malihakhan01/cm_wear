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

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "sportswear",
    categoryLabel: "SPORTSWEAR",
    categoryTag: "SPORTSWEAR · TEAMWEAR · PERFORMANCE",
    number: "01",
    image: "/HERO/hero-racing.png",
    titleLine1: "WE MAKE •",
    titleLine2: "WHAT MOVES",
    description:
      "Performance sportswear under your label. Loud prints, sharp fits, sampled before a single bulk piece is cut.",
    accentColor: "#D61C24",
    specLabel: "SPEC: TI-RACE-001 • PRO-COMP",
    link: "/catalog?category=go-karting-racing",
  },
  {
    id: "streetwear",
    categoryLabel: "STREETWEAR",
    categoryTag: "STREETWEAR · HEAVYWEIGHT · PRIVATE LABEL",
    number: "02",
    image: "/HERO/hero-streetwear.png",
    titleLine1: "CUT FOR",
    titleLine2: "THE STREET",
    description:
      "Maximalist streetwear built your way: rhinestones, puff print, chenille and washes, made to order.",
    accentColor: "#E85923",
    specLabel: "SPEC: TI-CAS-001 • 450 GSM FRENCH TERRY",
    link: "/catalog?category=casual-wear",
  },
  {
    id: "equestrian",
    categoryLabel: "EQUESTRIAN",
    categoryTag: "EQUESTRIAN · LUXURY · WATERPROOF",
    number: "03",
    image: "/HERO/hero-equestrian.png",
    titleLine1: "FORGED IN",
    titleLine2: "THE CHASE",
    description:
      "Technical equestrian and motorsport gear engineered to withstand extreme elements, friction, and competition demands.",
    accentColor: "#A31017",
    specLabel: "SPEC: TI-EQ-004 • SHIELD PERFORMANCE",
    link: "/catalog?category=equestrian-clothing",
  },
];

const SLIDE_DURATION_MS = 3600; // Snappier, faster slide transitions

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Always keep header visible
  useEffect(() => {
    useHeaderStore.getState().setHeaderVisible(true);
  }, []);

  // Infinite Auto Animation Effect
  useEffect(() => {
    if (isPaused) return;

    const intervalStep = 50; // update progress every 50ms for smooth bar fill
    const stepIncrement = (intervalStep / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next slide infinitely in a loop
          setActiveIdx((curr) => (curr + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = useCallback((index: number) => {
    setActiveIdx(index);
    setProgress(0);
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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Stage - Normal natural scroll without pinned hijacking */}
      <section className="relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden bg-[#0A0A0A] text-white flex flex-col justify-between">
        {/* ======================================================== */}
        {/* BACKGROUND SLIDES: INFINITE CROSSFADE WITH KEN BURNS ZOOM */}
        {/* ======================================================== */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-600 ease-in-out ${
                  isActive ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.categoryLabel}
                  className={`w-full h-full object-cover object-[75%_center] md:object-[70%_center] brightness-100 filter contrast-105 transition-transform duration-[3800ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                {/* Subtle gradient focused only on the text area on left, keeping the model/rider on right bright & clear */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/55 via-25% to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent via-15% to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TOP CONTROLS: CATEGORY TABS & SLIDE COUNTER              */}
        {/* ======================================================== */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 flex items-center justify-between">
          {/* Top Left: Category Toggle Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-[65%] sm:max-w-none">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-xs font-mono font-bold tracking-wider uppercase rounded-[2px] transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-white text-[#0A0A0A] shadow-lg scale-100"
                      : "bg-black/50 hover:bg-black/80 text-white/70 border border-white/20 hover:border-white/50 backdrop-blur-sm"
                  }`}
                >
                  {slide.categoryLabel}
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
                  className="h-full bg-white transition-[width] duration-75 ease-linear"
                  style={{
                    width: `${progress}%`,
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
        {/* MAIN EDITORIAL HEADLINE & COPY                           */}
        {/* ======================================================== */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-auto py-4">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Massive Kinetic Display Headline */}
            <h1
              className="text-4xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.2rem] font-black uppercase tracking-tighter text-[#F4F4EF] leading-[0.9] sm:leading-[0.88] select-none font-display drop-shadow-md"
            >
              <div className="overflow-hidden py-1">
                <span
                  key={`line1-${activeIdx}`}
                  className="inline-flex items-center animate-in fade-in slide-in-from-bottom-8 duration-300 ease-out fill-mode-both"
                >
                  {currentSlide.titleLine1.includes("•") ? (
                    <>
                      <span>{currentSlide.titleLine1.replace("•", "").trim()}</span>
                      <span className="inline-block w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-[#D61C24] ml-2 sm:ml-4 shadow-[0_0_15px_rgba(214,28,36,0.8)] animate-pulse" />
                    </>
                  ) : (
                    currentSlide.titleLine1
                  )}
                </span>
              </div>
              <div className="overflow-hidden py-1">
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
              className="text-xs sm:text-base text-neutral-300 max-w-md font-normal leading-relaxed mt-3 sm:mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-150 fill-mode-both line-clamp-3 sm:line-clamp-none"
            >
              {currentSlide.description}
            </p>

            {/* Action Row */}
            <div
              key={`actions-${activeIdx}`}
              className="flex flex-wrap items-center gap-3 pt-5 sm:pt-8 animate-in fade-in slide-in-from-bottom-3 duration-300 delay-200 fill-mode-both"
            >
              <Link
                href={currentSlide.link}
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-neutral-200 text-[#0A0A0A] text-[11px] sm:text-xs font-bold font-mono tracking-wider uppercase rounded-[2px] transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-102 group"
              >
                <span>VIEW THE RANGES</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Tag Pill with Plus Icon */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-white/80 hover:border-white/50 transition-colors">
                <span className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[10px] leading-none text-[#D61C24] font-bold">
                  +
                </span>
                <span className="tracking-wider">{currentSlide.categoryTag}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM ELEMENTS: FLOATING QUOTE CAPSULE & SCROLL DOWN    */}
        {/* ======================================================== */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6 flex items-center justify-between">
          <div className="hidden lg:block w-32" />

          {/* Center Floating Pill: "Samples first. Your label, your spec. | GET A QUOTE ↗" */}
          <div className="mx-auto sm:mx-0">
            <div className="bg-[#121210]/90 backdrop-blur-md border border-white/15 rounded-full pl-3.5 sm:pl-5 pr-1.5 sm:pr-2 py-1 sm:py-1.5 flex items-center gap-2 sm:gap-3 text-xs shadow-2xl">
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
