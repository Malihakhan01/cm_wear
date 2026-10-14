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
// Row 1 (Top 4 cards: 01 to 04)
const ROW_ONE_CATEGORIES: CategoryCardItem[] = [
  {
    id: "casual-wear",
    name: "CASUAL WEAR",
    number: "01",
    badge: "STREETWEAR",
    subcategories: ["Hoodies & Sweatshirts", "T-Shirts", "Sweatpants", "Cargo Pants"],
    image: "/categories/Casual wear (1).png",
    link: "/casual-wear",
  },
  {
    id: "equestrian-clothing",
    name: "EQUESTRIAN CLOTHING",
    number: "02",
    badge: "EQUESTRIAN",
    subcategories: ["Riding Jackets", "Silicone Breeches", "Show Shirts", "Polo Tops"],
    image: "/categories/Equestrian wear.png",
    link: "/equestrian-clothing",
  },
  {
    id: "ice-hockey",
    name: "ICE HOCKEY",
    number: "03",
    badge: "TEAM SPORTS",
    subcategories: ["Pro Match Jerseys", "Hockey Pants", "Padded Shorts", "Team Kits"],
    image: "/categories/Teamsport Wear.png",
    link: "/ice-hockey",
  },
  {
    id: "cycling",
    name: "CYCLING",
    number: "04",
    badge: "AERO SPEED",
    subcategories: ["Speed Jerseys", "Bib Shorts", "Windproof Gilets", "Thermal Layers"],
    image: "/categories/Cyclist Conquering the Mountain Pass.png",
    link: "/cycling",
  },
];

// Row 2 (Bottom 4 cards: 05 to 08)
const ROW_TWO_CATEGORIES: CategoryCardItem[] = [
  {
    id: "rugby",
    name: "RUGBY",
    number: "05",
    badge: "HIGH IMPACT",
    subcategories: ["Tear-Resistant Jerseys", "Rugby Shorts", "Training Smocks"],
    image: "/categories/Confident Soccer Portrait with Ball.png",
    link: "/rugby",
  },
  {
    id: "basketball",
    name: "BASKETBALL",
    number: "06",
    badge: "PRO MESH",
    subcategories: ["Sublimated Uniforms", "Reversible Shorts", "Warmup Sets"],
    image: "/categories/Skyward Saintfour Basketball Portrait.png",
    link: "/basketball",
  },
  {
    id: "ski-wear",
    name: "SKI WEAR",
    number: "07",
    badge: "ALPINE 20K",
    subcategories: ["3-Layer Shells", "Waterproof Pants", "Thermal Down Bibs"],
    image: "/categories/Outdoor.png",
    link: "/ski-wear",
  },
  {
    id: "go-karting-racing",
    name: "GO-KARTING & RACING",
    number: "08",
    badge: "RACING SUITS",
    subcategories: ["Karting Suits", "Paddock Jackets", "Mechanic Overalls"],
    image: "/categories/Charles Leclerc Monza 2025.jpg",
    link: "/go-karting-racing",
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

  // Check scroll position for arrow buttons
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const hasOverflow = scrollWidth > clientWidth + 10;
    setIsScrollableState(hasOverflow);
    setCanScrollLeft(hasOverflow && scrollLeft > 15);
    setCanScrollRight(hasOverflow && scrollLeft < scrollWidth - clientWidth - 15);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
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
      draggable={false}
      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-105 pointer-events-none select-none"
    />

    {/* Gradient Vignette for Text Legibility */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />

    {/* Top-Right Badge: DIV // 01 */}
    <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 bg-black/70 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-[4px] border border-white/10 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-white/80 font-bold pointer-events-none">
      <span>DIV // {cat.number}</span>
    </div>

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
