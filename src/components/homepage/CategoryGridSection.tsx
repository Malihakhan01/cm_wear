"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/common/SectionHeading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryCardItem {
  id: string;
  name: string;
  number: string;
  badge: string;
  subcategories: string[];
  image: string;
  link: string;
}

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
    name: "EQUESTRIAN",
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
  // Seamless loop item
  {
    id: "casual-wear-loop",
    name: "PRIVATE LABEL",
    number: "01B",
    badge: "CUT & SEW",
    subcategories: ["French Terry Sets", "Heavyweight Fleece", "Acid Washes"],
    image: "/categories/Casual wear (1).png",
    link: "/casual-wear",
  },
];

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
    name: "MOTORSPORT",
    number: "08",
    badge: "RACING SUITS",
    subcategories: ["Karting Suits", "Paddock Jackets", "Mechanic Overalls"],
    image: "/categories/Charles Leclerc Monza 2025.jpg",
    link: "/go-karting-racing",
  },
  // Seamless loop item
  {
    id: "equestrian-loop",
    name: "TOURNAMENT",
    number: "02B",
    badge: "LUXURY FIT",
    subcategories: ["Show Competition Vests", "Custom Team Breeches"],
    image: "/categories/Equestrian wear.png",
    link: "/equestrian-clothing",
  },
];

export const CategoryGridSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Setup GSAP scroll-driven horizontal parallax effect matching Northline reference
  useEffect(() => {
    if (!sectionRef.current || !row1Ref.current || !row2Ref.current) return;

    const ctx = gsap.context(() => {
      // Row 1 scrolls to the left as user scrolls down
      gsap.to(row1Ref.current, {
        x: "-12%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Row 2 scrolls in the opposite direction (starts shifted left, scrolls right)
      gsap.fromTo(
        row2Ref.current,
        { x: "-12%" },
        {
          x: "0%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0A0A0A] text-white py-24 overflow-hidden border-b border-[#2A2A28] select-none"
    >
      {/* Top Editorial Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          theme="dark"
          eyebrow="MANUFACTURING ARCHIVE • 08 DIVISIONS"
          eyebrowColor="#D90429"
          title={
            <>
              CORE APPAREL<br />DISCIPLINES
            </>
          }
          description="Specialized turnkey manufacturing divisions for high-performance athletic wear, luxury equestrian garments, winter alpine gear, and technical motorsport suits."
          action={
            <Link
              href="/catalog"
              className="px-5 py-3 bg-white hover:bg-neutral-200 text-[#0A0A0A] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-2 shrink-0"
            >
              <span>EXPLORE ALL</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          }
        />
      </div>

      {/* ======================================================== */}
      {/* ROW 1: SCROLL EFFECT (Glides left on scroll down)        */}
      {/* ======================================================== */}
      <div className="w-full overflow-hidden mb-5 sm:mb-8">
        <div
          ref={row1Ref}
          className="flex items-center gap-4 sm:gap-6 w-max pl-4 sm:pl-8 will-change-transform"
        >
          {ROW_ONE_CATEGORIES.map((cat, idx) => (
            <Link
              key={`${cat.id}-${idx}`}
              href={cat.link}
              className="relative w-[260px] sm:w-[340px] md:w-[380px] h-[360px] sm:h-[460px] md:h-[500px] shrink-0 rounded-2xl overflow-hidden group bg-[#141414] border border-white/10 transition-all duration-300 hover:border-[#D90429] hover:shadow-2xl block"
            >
              {/* Card Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-105"
              />

              {/* Gradient Vignette for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />

              {/* Top-Right Badge: DIVISION // 01 */}
              <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 bg-black/70 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-[4px] border border-white/10 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-white/80 font-bold">
                <span>DIV // {cat.number}</span>
              </div>

              {/* Bottom Card Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-black/80 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-[4px] border border-white/15 text-[11px] sm:text-xs font-mono uppercase font-black text-white tracking-wider group-hover:bg-[#D90429] group-hover:border-[#D90429] transition-colors">
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
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 2: SCROLL EFFECT (Glides right on scroll down)       */}
      {/* ======================================================== */}
      <div className="w-full overflow-hidden">
        <div
          ref={row2Ref}
          className="flex items-center gap-4 sm:gap-6 w-max pl-4 sm:pl-8 will-change-transform"
        >
          {ROW_TWO_CATEGORIES.map((cat, idx) => (
            <Link
              key={`${cat.id}-${idx}`}
              href={cat.link}
              className="relative w-[260px] sm:w-[340px] md:w-[380px] h-[360px] sm:h-[460px] md:h-[500px] shrink-0 rounded-2xl overflow-hidden group bg-[#141414] border border-white/10 transition-all duration-300 hover:border-[#D90429] hover:shadow-2xl block"
            >
              {/* Card Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-105"
              />

              {/* Gradient Vignette for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />

              {/* Top-Right Badge: DIVISION // 05 */}
              <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 bg-black/70 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-[4px] border border-white/10 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-white/80 font-bold">
                <span>DIV // {cat.number}</span>
              </div>

              {/* Bottom Card Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-black/80 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-[4px] border border-white/15 text-[11px] sm:text-xs font-mono uppercase font-black text-white tracking-wider group-hover:bg-[#D90429] group-hover:border-[#D90429] transition-colors">
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
          ))}
        </div>
      </div>
    </section>
  );
};
