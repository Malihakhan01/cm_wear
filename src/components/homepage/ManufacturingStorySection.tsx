"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SectionHeading } from "@/components/common/SectionHeading";

interface FinishItem {
  number: string;
  title: string;
  desc: string;
  image: string;
}

const FINISHES: FinishItem[] = [
  {
    number: "01",
    title: "SCULPTED PUFF EMBROIDERY",
    desc: "Satin stitches over foam for a raised, sculpted logo.",
    image: "/images/fabrics/Crimson Embroidered Jewel Flower.png",
  },
  {
    number: "02",
    title: "SCREEN PRINT",
    desc: "Crisp, opaque plastisol and water-based inks.",
    image: "/images/fabrics/Flocked Red Streaks on Black Knit.png",
  },
  {
    number: "03",
    title: "PUFF PRINT",
    desc: "Raised ink that puffs up under heat — soft, tactile, loud.",
    image: "/images/fabrics/Crimson Foam Waves on Black Knit.png",
  },
  {
    number: "04",
    title: "SUBLIMATION",
    desc: "All-over colour dyed into performance fabric.",
    image: "/images/fabrics/Vibrant Watercolor Floral Fabric Macro.png",
  },
  {
    number: "05",
    title: "RHINESTONES",
    desc: "Hot-fix crystals set in any pattern, dense or scattered.",
    image: "/images/fabrics/Teal and Crystal Rhinestone Swirls.png",
  },
  {
    number: "06",
    title: "CHENILLE",
    desc: "Fuzzy terry-loop patches with felt borders.",
    image: "/images/fabrics/Emerald Chenille Varsity Patch Close-Up.png",
  },
];

export const ManufacturingStorySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  const prevMouseX = useRef(0);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateTo = useRef<gsap.QuickToFunc | null>(null);

  // Initialize GSAP quickTo setters for fluid 60fps cursor follower
  useEffect(() => {
    if (!cardRef.current) return;

    xTo.current = gsap.quickTo(cardRef.current, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(cardRef.current, "y", {
      duration: 0.35,
      ease: "power3.out",
    });
    rotateTo.current = gsap.quickTo(cardRef.current, "rotation", {
      duration: 0.45,
      ease: "power2.out",
    });
  }, []);

  const handleMouseEnter = (index: number, e: React.MouseEvent) => {
    setActiveIndex(index);
    if (!sectionRef.current || !cardRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    prevMouseX.current = e.clientX;

    // Immediately jump position on initial enter so it doesn't fly across screen
    gsap.set(cardRef.current, { x, y, rotation: -3 });

    gsap.killTweensOf(cardRef.current);
    gsap.to(cardRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    xTo.current?.(x);
    yTo.current?.(y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only track position when an item is actually hovered to avoid wasteful layout recalculations
    if (activeIndex === null || !sectionRef.current || !cardRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate velocity for responsive dynamic card tilt (-8deg to +8deg)
    const deltaX = e.clientX - prevMouseX.current;
    prevMouseX.current = e.clientX;
    const targetTilt = Math.max(Math.min(deltaX * 0.45 - 3, 8), -8);

    xTo.current?.(x);
    yTo.current?.(y);
    rotateTo.current?.(targetTilt);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.88,
      duration: 0.2,
      ease: "power2.in",
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative bg-[#EDEDE9] text-[#0A0A0A] py-20 sm:py-28 border-b border-[#D5D5CF] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <SectionHeading
          eyebrow="EMBELLISHMENT &amp; FINISH STUDIO"
          eyebrowColor="#D61C24"
          title={
            <>
              EVERY FINISH,<br />
              MADE TO ORDER
            </>
          }
          description="Rhinestones, puff print, chenille and specialty embroidery. Hover a finish to explore textures up close."
        />

        {/* 6 Finishes Rows */}
        <div ref={rowsContainerRef} className="divide-y divide-[#D5D5CF]">
          {FINISHES.map((finish, idx) => {
            const isHovered = activeIndex === idx;

            return (
              <div
                key={finish.number}
                onMouseEnter={(e) => handleMouseEnter(idx, e)}
                onMouseLeave={handleMouseLeave}
                className="finish-row-item relative py-7 sm:py-9 transition-colors duration-200 cursor-pointer group"
                style={{
                  backgroundColor: isHovered ? "rgba(255, 255, 255, 0.72)" : "transparent",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                  {/* Left: 01 + Finish Title */}
                  <div className="flex items-baseline gap-6 sm:gap-12 md:gap-16">
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#0A0A0A] w-6 sm:w-8 shrink-0">
                      {finish.number}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black uppercase tracking-tight text-[#0A0A0A] font-display not-italic leading-none transition-transform duration-200 group-hover:translate-x-1.5"
                      style={{ fontStyle: "normal" }}
                    >
                      {finish.title}
                    </h3>
                  </div>

                  {/* Right: Description */}
                  <p className="text-xs sm:text-sm md:text-base text-[#555555] font-sans sm:text-left max-w-md pl-12 sm:pl-0">
                    {finish.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Image Cursor Follower Card (Active on desktop only) */}
      <div
        ref={cardRef}
        className="hidden md:block pointer-events-none absolute top-0 left-0 z-30 w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] border border-black/10 opacity-0 scale-90 will-change-transform bg-white"
        style={{ transformOrigin: "center center" }}
      >
        {FINISHES.map((finish, idx) => (
          <img
            key={finish.number}
            src={finish.image}
            alt={finish.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              activeIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ transitionProperty: "opacity, transform" }}
          />
        ))}
      </div>
    </section>
  );
};
