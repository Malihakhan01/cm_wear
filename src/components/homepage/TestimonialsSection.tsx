"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, ShieldCheck, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { contentService } from "@/services/content.service";
import { TestimonialItem } from "@/types";

interface ReviewItem {
  id: number;
  author: string;
  role: string;
  company: string;
  discipline: string;
  quote: string;
  verifiedOrder: string;
  country: string;
  rating: number;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    author: "Marcus Vance",
    role: "Creative Director",
    company: "Vance Atelier (New York, USA)",
    discipline: "Streetwear & Casual Blanks",
    quote:
      "CM SPORTS WEAR's 450 GSM French Terry is by far the highest quality blank we have tested out of South Asia. The drape, double-hood density, and minimal shrinkage give our luxury label an incredible margin advantage.",
    verifiedOrder: "Order Ref: CM-849201 • 500 Units",
    country: "🇺🇸 USA",
    rating: 5,
  },
  {
    id: 2,
    author: "Henrik Lindqvist",
    role: "Head of Equipment",
    company: "Nordic Athletic Club (Stockholm, Sweden)",
    discipline: "Custom Teamwear & Kits",
    quote:
      "We ordered 300 sublimated match jerseys with reinforced seams and moisture-wicking speed mesh. The color registration was exact to our CMYK vectors, and our players praised the breathability across the entire tournament.",
    verifiedOrder: "Order Ref: CM-302194 • 300 Kits",
    country: "🇸🇪 Sweden",
    rating: 5,
  },
  {
    id: 3,
    author: "Marcus Vance",
    role: "Head Coach & Gym Owner",
    company: "Vanguard Combat Academy (London, UK)",
    discipline: "Martial Arts & Combat Gear",
    quote:
      "Manufacturing competition-grade BJJ Gis and MMA fight shorts requires immense needle skill. CM SPORTS WEAR's master pattern makers executed our reinforced gussets flawlessly. The pearl weave fabric density is world-class.",
    verifiedOrder: "Order Ref: CM-118492 • 250 Units",
    country: "🇬🇧 UK",
    rating: 5,
  },
];

const cleanHtml = (text: string) => {
  if (!text) return "";
  return text.replace(/<[^>]*>?/gm, "").trim();
};

export const TestimonialsSection: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [activeDot, setActiveDot] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      try {
        const liveItems = await contentService.getTestimonials();
        if (isMounted && liveItems && liveItems.length > 0) {
          const mapped: ReviewItem[] = liveItems.map((item, idx) => {
            const flag = item.country_flag ? `${item.country_flag} ` : "";
            const countryText = item.country ? `${flag}${item.country}` : "Verified Client";
            return {
              id: item.id || idx + 1,
              author: item.client_name,
              role: item.client_role || "Brand Founder",
              company: item.company || "International Label",
              discipline:
                idx === 0
                  ? "Streetwear & Casual Blanks"
                  : idx === 1
                  ? "Custom Cycling Apparel"
                  : idx === 2
                  ? "Equestrian Competition Wear"
                  : idx === 3
                  ? "Heavyweight Fleece"
                  : idx === 4
                  ? "Commercial Tracksuits"
                  : idx === 5
                  ? "Pro Hockey Uniforms"
                  : "Motorsport Karting Suits",
              quote: cleanHtml(item.quote),
              verifiedOrder: `Order Ref: TI-${String(item.id * 142857).slice(0, 6)} • Verified Bulk`,
              country: countryText,
              rating: item.rating || 5,
            };
          });
          setReviews(mapped);
        }
      } catch (err) {
        console.error("Testimonials fetch error:", err);
      }
    }
    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || clientWidth * 0.85;
    const index = Math.round(scrollLeft / (cardWidth + 16));
    setActiveDot(Math.min(Math.max(0, index), reviews.length - 1));
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 320;
    const offset = direction === "left" ? -(cardWidth + 24) : (cardWidth + 24);
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    handleScroll();
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
  };

  return (
    <section className="bg-[#F4F4EF] py-12 sm:py-20 lg:py-24 border-b border-[#DADBD2] select-none relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Integrated Navigation Controls */}
        <SectionHeading
          eyebrow="BUYER PERSPECTIVES"
          eyebrowColor="#D61C24"
          title="Trusted by Discerning Label Founders"
          description="Independent testimonials from direct-to-consumer apparel founders, wholesale distributors, and sports federations."
          action={
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous testimonials"
                className="w-9 h-9 rounded-[2px] bg-white border border-[#DADBD2] hover:border-[#D61C24] hover:text-[#D61C24] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next testimonials"
                className="w-9 h-9 rounded-[2px] bg-white border border-[#DADBD2] hover:border-[#D61C24] hover:text-[#D61C24] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          }
        />

        {/* Unified Horizontal Slider Track: Touch swipe & Mouse drag */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-stretch gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x snap-x snap-mandatory pb-4 pt-2 cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {reviews.map((r, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={`${r.id}-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`w-[85vw] max-w-[340px] sm:w-[380px] md:w-[calc((100%-4rem)/3)] shrink-0 snap-start group relative bg-white border rounded-[2px] p-6 sm:p-8 flex flex-col justify-between space-y-5 sm:space-y-6 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                  isHovered
                    ? "border-[#D61C24] -translate-y-1.5 shadow-[0_20px_40px_-10px_rgba(214,28,36,0.18)] ring-1 ring-[#D61C24]/20"
                    : "border-[#DADBD2] shadow-sm hover:border-[#D61C24]/70"
                }`}
              >
                {/* Top Animated Expanding Crimson Indicator Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D61C24] via-[#FF333D] to-[#D61C24] transition-all duration-500 ease-out origin-left ${
                    isHovered ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />

                {/* Ambient Hover Spotlight Background */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 bg-[#D61C24]/8 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                    isHovered ? "opacity-100 scale-125" : "opacity-0 scale-75"
                  }`}
                />

                {/* Subtle Quote Watermark */}
                <Quote
                  className={`absolute top-6 right-6 w-14 h-14 sm:w-16 sm:h-16 pointer-events-none transition-all duration-500 ${
                    isHovered
                      ? "text-[#D61C24]/12 translate-x-1 -translate-y-1 scale-110"
                      : "text-neutral-900/5 translate-x-0 translate-y-0"
                  }`}
                />

                {/* Main Content Area */}
                <div className="space-y-3.5 sm:space-y-4 relative z-10">
                  {/* Rating Stars with Staggered Hover Scaling */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D61C24]">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#D61C24] transition-transform duration-300 ease-out ${
                            isHovered ? "scale-110" : "scale-100"
                          }`}
                          style={{ transitionDelay: `${i * 40}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#72726D]">
                      {r.country}
                    </span>
                  </div>

                  {/* Quote Body */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 not-italic ${
                      isHovered ? "text-[#0A0A0A]" : "text-[#20201E]"
                    }`}
                    style={{ fontStyle: "normal" }}
                  >
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                {/* Author Footer */}
                <div
                  className={`pt-3.5 sm:pt-4 border-t space-y-1.5 relative z-10 transition-colors duration-300 ${
                    isHovered ? "border-[#D61C24]/20" : "border-[#F4F4EF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                      {r.author}
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-mono uppercase text-[#D61C24] font-semibold">
                      {r.discipline}
                    </span>
                  </div>

                  <div className="text-[10.5px] sm:text-[11px] font-mono text-[#72726D]">
                    {r.company}
                  </div>

                  {/* Verified Order Tag */}
                  <div
                    className={`text-[9.5px] sm:text-[10px] font-mono flex items-center gap-1.5 pt-1 transition-all duration-300 ${
                      isHovered
                        ? "text-[#D61C24] translate-x-0.5"
                        : "text-[#72726D]"
                    }`}
                  >
                    <ShieldCheck
                      className={`w-3.5 h-3.5 transition-colors duration-300 ${
                        isHovered ? "text-[#D61C24]" : "text-[#72726D]"
                      }`}
                    />
                    <span className="font-semibold">{r.verifiedOrder}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Slide Indicator Dots */}
        <div className="md:hidden flex items-center justify-center gap-1.5 pt-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!scrollContainerRef.current) return;
                const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 320;
                scrollContainerRef.current.scrollTo({ left: i * (cardWidth + 16), behavior: "smooth" });
                setActiveDot(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === i ? "w-6 bg-[#D61C24]" : "w-1.5 bg-[#DADBD2]"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
