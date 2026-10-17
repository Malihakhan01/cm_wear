"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { useHeaderStore } from "@/stores/useHeaderStore";
import { SectionHeading } from "@/components/common/SectionHeading";

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  image: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "DESIGN & TECH PACK",
    desc: "Send a sketch, a reference or a finished tech pack.",
    image: "/images/process/Streetwear Atelier Moodboard Workshop (1).png",
  },
  {
    step: "02",
    title: "SAMPLING",
    desc: "A physical sample to check fit, fabric and finish.",
    image: "/images/process/Garment Workshop with Red Appliqué Hoodies (1).png",
  },
  {
    step: "03",
    title: "CUTTING",
    desc: "Fabric cut to your approved pattern and size list.",
    image: "/images/process/Industrial Fabric Cutting Floor (1).png",
  },
  {
    step: "04",
    title: "STITCHING & FINISHING",
    desc: "Sewn, decorated and checked against your sample.",
    image: "/images/process/South Asian Tailor at Sewing Machine (1) (1).png",
  },
  {
    step: "05",
    title: "PACKING & SHIPPING",
    desc: "Folded, bagged and labelled your way.",
    image: "/images/process/Textile Factory Hoodie Packaging (2) (1).png",
  },
];

export const FabricLibrarySection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrollable, setIsScrollable] = useState(true);

  // Guarantee header is always visible throughout the site
  useEffect(() => {
    useHeaderStore.getState().setHeaderVisible(true);
  }, []);

  const checkScrollRaf = useRef<number | null>(null);

  const updateScrollState = () => {
    if (checkScrollRaf.current) return;
    checkScrollRaf.current = window.requestAnimationFrame(() => {
      checkScrollRaf.current = null;
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const hasOverflow = maxScroll > 10;
      setIsScrollable(hasOverflow);
      setCanScrollLeft(hasOverflow && scrollLeft > 15);
      setCanScrollRight(hasOverflow && scrollLeft < maxScroll - 15);

      if (progressBarRef.current && maxScroll > 0) {
        const progress = Math.min(Math.max(scrollLeft / maxScroll, 0), 1);
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
    });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      if (checkScrollRaf.current) window.cancelAnimationFrame(checkScrollRaf.current);
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    if (scrollWidth <= clientWidth + 5) return;

    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    updateScrollState();
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const offset = direction === "left" ? -400 : 400;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="relative bg-[#0A0A0A] text-white py-20 sm:py-24 w-full select-none overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation Controls */}
        <SectionHeading
          theme="dark"
          eyebrow="PRODUCTION TIMELINE"
          eyebrowColor="#D61C24"
          title={
            <>
              SKETCH TO<br />SHIPMENT
            </>
          }
          description="One seamless process for every line. Physical pre-production sample approved before bulk manufacturing begins."
          action={
            <div className="flex items-center gap-3">
              {isScrollable && (
                <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 uppercase tracking-wider mr-1">
                  <MoveHorizontal className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>Drag to explore</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll timeline left"
                className="w-10 h-10 rounded-full bg-[#161616] hover:bg-[#222222] border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer text-white shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll timeline right"
                className="w-10 h-10 rounded-full bg-[#161616] hover:bg-[#222222] border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer text-white shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          }
        />

        {/* Horizontal Draggable & Scrollable Process Cards Track */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`w-full overflow-x-auto select-none pb-6 pt-2 no-scrollbar ${
            isScrollable ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex items-stretch gap-5 sm:gap-7 w-max">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="w-[275px] sm:w-[350px] lg:w-[375px] shrink-0 bg-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300"
              >
                {/* Upper Image with Step Number */}
                <div className="relative w-full h-[175px] sm:h-[215px] overflow-hidden bg-[#1C1C1C] shrink-0">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 pointer-events-none select-none"
                  />
                  <span className="absolute top-3.5 left-4 text-3xl sm:text-5xl font-bold font-display text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] select-none pointer-events-none leading-none">
                    {step.step}
                  </span>
                </div>

                {/* Lower Card Info */}
                <div
                  className="bg-white flex flex-col justify-start shrink-0 w-full min-h-[105px]"
                  style={{
                    padding: "18px 20px 22px",
                    boxSizing: "border-box",
                  }}
                >
                  <h3
                    className="text-[15px] font-bold uppercase tracking-tight not-italic"
                    style={{
                      color: "#121212",
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: "15px",
                      lineHeight: "21.33px",
                      fontStyle: "normal",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    className="text-[13.5px]"
                    style={{
                      color: "#1212129E",
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: "13.5px",
                      lineHeight: "20.25px",
                      marginTop: "6px",
                      marginBottom: 0,
                      padding: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Sleek Progress Line */}
        <div className="w-full relative flex flex-col items-center shrink-0 pt-4 pb-2">
          <div className="w-full h-[2px] bg-white/15 relative overflow-hidden rounded-full">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 bottom-0 w-full bg-[#D61C24] origin-left will-change-transform transition-transform duration-100 ease-out"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
