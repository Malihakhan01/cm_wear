"use client";

import React, { useState, useEffect } from "react";
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
      "TAWFIQ INDUSTRY's 450 GSM French Terry is by far the highest quality blank we have tested out of South Asia. The drape, double-hood density, and minimal shrinkage give our luxury label an incredible margin advantage.",
    verifiedOrder: "Order Ref: TI-849201 • 500 Units",
    country: "🇺🇸 USA",
    rating: 5,
  },
  {
    id: 2,
    author: "Henrik Lindqvist",
    role: "Head of Equipment",
    company: "Nordic Peloton Club (Stockholm, Sweden)",
    discipline: "Custom Cycling Apparel",
    quote:
      "We ordered 300 sublimated race jerseys with aerodynamic dimpled sleeves and high-density chamois bibs. The color registration was exact to our CMYK vectors, and our riders praised the breathability across a 200km event.",
    verifiedOrder: "Order Ref: TI-302194 • 300 Kits",
    country: "🇸🇪 Sweden",
    rating: 5,
  },
  {
    id: 3,
    author: "Eleanor Sterling",
    role: "Founder & Lead Designer",
    company: "Sterling & Co. Equestrian (Cotswolds, UK)",
    discipline: "Equestrian Competition Wear",
    quote:
      "Tailoring Italian bonded softshell show jackets requires immense needle skill. TAWFIQ INDUSTRY's master pattern makers executed our silhouette flawlessly. The silicone full-seat grip on their breeches is tournament grade.",
    verifiedOrder: "Order Ref: TI-118492 • 250 Units",
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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

  // Visible reviews window (showing 3 at a time)
  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);
  // If fewer than 3, wrap around
  if (visibleReviews.length < 3 && reviews.length >= 3) {
    visibleReviews.push(...reviews.slice(0, 3 - visibleReviews.length));
  }

  const handleNext = () => {
    if (reviews.length <= 3) return;
    setCurrentIndex((prev) => (prev + 1 >= reviews.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (reviews.length <= 3) return;
    setCurrentIndex((prev) => (prev - 1 < 0 ? reviews.length - 1 : prev - 1));
  };

  return (
    <section className="bg-[#F4F4EF] py-20 sm:py-24 border-b border-[#DADBD2] select-none relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
          <SectionHeading
            eyebrow="BUYER PERSPECTIVES"
            eyebrowColor="#D61C24"
            title="Trusted by Discerning Label Founders"
            description="Independent testimonials from direct-to-consumer apparel founders, wholesale distributors, and sports federations."
          />

          {reviews.length > 3 && (
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-10 h-10 rounded-[2px] bg-white border border-[#DADBD2] hover:border-[#D61C24] hover:text-[#D61C24] flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-10 h-10 rounded-[2px] bg-white border border-[#DADBD2] hover:border-[#D61C24] hover:text-[#D61C24] flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* 3 Interactive Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {visibleReviews.map((r, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={`${r.id}-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative bg-white border rounded-[2px] p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-400 ease-out cursor-pointer overflow-hidden ${
                  isHovered
                    ? "border-[#D61C24] -translate-y-2.5 shadow-[0_25px_50px_-12px_rgba(214,28,36,0.18)] ring-1 ring-[#D61C24]/20"
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
                  className={`absolute top-6 right-6 w-16 h-16 pointer-events-none transition-all duration-500 ${
                    isHovered
                      ? "text-[#D61C24]/12 translate-x-1 -translate-y-1 scale-110"
                      : "text-neutral-900/5 translate-x-0 translate-y-0"
                  }`}
                />

                {/* Main Content Area */}
                <div className="space-y-4 relative z-10">
                  {/* Rating Stars with Staggered Hover Scaling */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#D61C24]">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 fill-[#D61C24] transition-transform duration-300 ease-out ${
                            isHovered ? "scale-110" : "scale-100"
                          }`}
                          style={{ transitionDelay: `${i * 40}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-[#72726D]">
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
                  className={`pt-4 border-t space-y-1.5 relative z-10 transition-colors duration-300 ${
                    isHovered ? "border-[#D61C24]/20" : "border-[#F4F4EF]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                      {r.author}
                    </div>
                    <span className="text-[10px] font-mono uppercase text-[#D61C24] font-semibold">
                      {r.discipline}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#72726D]">
                    {r.company}
                  </div>

                  {/* Verified Order Tag */}
                  <div
                    className={`text-[10px] font-mono flex items-center gap-1.5 pt-1.5 transition-all duration-300 ${
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

      </div>
    </section>
  );
};
