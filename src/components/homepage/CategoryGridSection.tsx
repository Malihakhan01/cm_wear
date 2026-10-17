"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";

interface CategoryCardItem {
  id: string;
  name: string;
  number: string;
  badge: string;
  subcategories: string[];
  image: string;
  link: string;
}

// Exactly 8 categories matching the 01-08 divisions:
// Row 1 (Categories 01 to 05)
const ROW_ONE_CATEGORIES: CategoryCardItem[] = [
  {
    id: "team-sports-wear",
    name: "TEAM SPORTS WEAR",
    number: "01",
    badge: "PRO MATCH",
    subcategories: ["Ice Hockey", "Soccer & Football", "Basketball", "Rugby & Cricket"],
    image: "/categories/teamsports_wear.png",
    link: "/catalog?category=team-sports-wear",
  },
  {
    id: "martial-arts-combat-wear",
    name: "MARTIAL ARTS & COMBAT",
    number: "02",
    badge: "COMBAT SPORTS",
    subcategories: ["BJJ & Grappling", "MMA Fight Shorts", "Boxing & Muay Thai", "Karate & Judo"],
    image: "/categories/martial arts.png",
    link: "/catalog?category=martial-arts-combat-wear",
  },
  {
    id: "activewear-fitness",
    name: "ACTIVEWEAR & FITNESS",
    number: "03",
    badge: "ATHLEISURE",
    subcategories: ["Gym & Training Wear", "Compression Wear", "Women’s Activewear", "Running & Athletics"],
    image: "/categories/activewear.png",
    link: "/catalog?category=activewear-fitness",
  },
  {
    id: "casual-lifestyle-wear",
    name: "CASUAL & LIFESTYLE",
    number: "04",
    badge: "STREETWEAR",
    subcategories: ["T-Shirts & Polos", "450 GSM Hoodies", "Matching Tracksuits", "Joggers & Shorts"],
    image: "/categories/casualwear.png",
    link: "/catalog?category=casual-lifestyle-wear",
  },
  {
    id: "jackets-outerwear",
    name: "JACKETS & OUTERWEAR",
    number: "05",
    badge: "OUTERWEAR",
    subcategories: ["Varsity Jackets", "Leather Jackets", "Technical Softshells", "Windbreakers"],
    image: "/categories/jacket wear.png",
    link: "/catalog?category=jackets-outerwear",
  },
];

// Row 2 (Categories 06 to 09)
const ROW_TWO_CATEGORIES: CategoryCardItem[] = [
  {
    id: "kids-youth-wear",
    name: "KIDS & YOUTH WEAR",
    number: "06",
    badge: "JUNIOR CUT",
    subcategories: ["Youth Team Kits", "Kids’ Activewear", "Junior Hoodies", "Training Tracksuits"],
    image: "/categories/kids wear.png",
    link: "/catalog?category=kids-youth-wear",
  },
  {
    id: "workwear-medical-wear",
    name: "WORKWEAR & MEDICAL",
    number: "07",
    badge: "DUTY GRADE",
    subcategories: ["Medical Scrubs", "Industrial Uniforms", "Utility Work Polos"],
    image: "/categories/work wear.png",
    link: "/catalog?category=workwear-medical-wear",
  },
  {
    id: "sports-accessories",
    name: "SPORTS ACCESSORIES",
    number: "08",
    badge: "FIELD GEAR",
    subcategories: ["Knit Team Socks", "Reversible Bibs", "Caps & Visors", "Wrist & Headbands"],
    image: "/categories/Vibrant Multisport Gear Court Flat Lay.png",
    link: "/catalog?category=sports-accessories",
  },
  {
    id: "gloves",
    name: "PERFORMANCE GLOVES",
    number: "09",
    badge: "PRECISION GRIP",
    subcategories: ["Ice Hockey Gloves", "Goalkeeper Latex", "Boxing & MMA Gloves", "Batting Gloves"],
    image: "/categories/gloves.png",
    link: "/catalog?category=gloves",
  },
];

export const CategoryGridSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrollableState, setIsScrollableState] = useState(false);

  const checkScrollRaf = useRef<number | null>(null);

  // Check scroll position for arrow buttons (RAF throttled)
  const checkScroll = () => {
    if (checkScrollRaf.current) return;
    checkScrollRaf.current = window.requestAnimationFrame(() => {
      checkScrollRaf.current = null;
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const hasOverflow = scrollWidth > clientWidth + 10;
      setIsScrollableState(hasOverflow);
      setCanScrollLeft(hasOverflow && scrollLeft > 15);
      setCanScrollRight(hasOverflow && scrollLeft < scrollWidth - clientWidth - 15);
    });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      if (checkScrollRaf.current) window.cancelAnimationFrame(checkScrollRaf.current);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    if (scrollWidth <= clientWidth + 5) return; // Don't drag if not scrollable

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
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  // Prevent link click when dragging
  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Left/Right Button scroll
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const offset = direction === "left" ? -440 : 440;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="bg-[#0A0A0A] text-white py-20 sm:py-24 overflow-hidden border-b border-[#2A2A28] select-none">
      
      {/* Top Section Header */}
      <div className="max-w-7xl 2xl:max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <SectionHeading
          theme="dark"
          eyebrow="MANUFACTURING ARCHIVE • 08 DIVISIONS"
          eyebrowColor="#D61C24"
          title={
            <>
              CORE APPAREL<br />DISCIPLINES
            </>
          }
          description="Specialized turnkey manufacturing divisions for high-performance athletic wear, luxury equestrian garments, winter alpine gear, and technical motorsport suits."
          action={
            <div className="flex items-center gap-3">
              {/* Drag Hint on Desktop - only shown if content overflows and can be dragged */}
              {isScrollableState && (
                <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 uppercase tracking-wider mr-2">
                  <MoveHorizontal className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>Drag to explore</span>
                </div>
              )}

              {/* Prev / Next Scroll Arrows */}
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full bg-[#161616] hover:bg-[#222222] border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full bg-[#161616] hover:bg-[#222222] border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Explore All Button */}
              <Link
                href="/catalog"
                className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-[#0A0A0A] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-2 shrink-0 ml-1"
              >
                <span>EXPLORE ALL</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          }
        />
      </div>

      {/* ======================================================== */}
      {/* 8 CARDS DRAGGABLE & SCROLLABLE CONTAINER (4 TOP, 4 BOTTOM) */}
      {/* Centered when screen is wide / zoomed out, scrollable when narrow */}
      {/* ======================================================== */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full overflow-x-auto select-none pb-4 pt-1 ${
          isScrollableState ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="w-fit min-w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:gap-6">
            
            {/* ROW 1: 4 Cards (01, 02, 03, 04) */}
            <div className="flex items-center gap-4 sm:gap-6">
              {ROW_ONE_CATEGORIES.map((cat) => (
                <CardItem key={cat.id} cat={cat} onCardClick={handleCardClick} />
              ))}
            </div>

            {/* ROW 2: 4 Cards (05, 06, 07, 08) */}
            <div className="flex items-center gap-4 sm:gap-6">
              {ROW_TWO_CATEGORIES.map((cat) => (
                <CardItem key={cat.id} cat={cat} onCardClick={handleCardClick} />
              ))}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

// Reusable Category Card Component
const CardItem: React.FC<{
  cat: CategoryCardItem;
  onCardClick: (e: React.MouseEvent) => void;
}> = ({ cat, onCardClick }) => (
  <Link
    href={cat.link}
    onClick={onCardClick}
    draggable={false}
    className="relative w-[280px] sm:w-[340px] md:w-[380px] h-[360px] sm:h-[460px] md:h-[490px] shrink-0 rounded-2xl overflow-hidden group bg-[#141414] border border-white/10 transition-all duration-300 hover:border-[#D61C24] hover:shadow-2xl block"
  >
    {/* Card Image */}
    <img
      src={cat.image}
      alt={cat.name}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-95 group-hover:brightness-105 pointer-events-none select-none"
    />

    {/* Gradient Vignette for Text Legibility */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />



    {/* Bottom Card Overlay */}
    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 pointer-events-none">
      <div className="flex items-center justify-between">
        <span className="inline-block bg-black/80 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-[4px] border border-white/15 text-[11px] sm:text-xs font-mono uppercase font-black text-white tracking-wider group-hover:bg-[#D61C24] group-hover:border-[#D61C24] transition-colors">
          {cat.name}
        </span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform scale-100 md:scale-75 md:group-hover:scale-100 shadow-lg">
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>

      <p className="text-[10px] sm:text-[11px] font-mono text-neutral-300 tracking-wider mt-2 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
        {cat.subcategories.join(" · ")}
      </p>
    </div>
  </Link>
);
