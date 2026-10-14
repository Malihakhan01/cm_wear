"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/data/products.data";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/common/SectionHeading";
import { productsService } from "@/services/products.service";
import { Product } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturedProductsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS_DATA);
  const { mode, toggleMode } = useStoreModeStore();

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    productsService.getAll().then((prods) => {
      setAllProducts(prods || []);
    });

    const handleUpdate = () => {
      productsService.getAll().then((prods) => {
        setAllProducts(prods || []);
      });
    };
    window.addEventListener("tawfiq_products_updated", handleUpdate);
    return () => window.removeEventListener("tawfiq_products_updated", handleUpdate);
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? allProducts.slice(0, 8)
      : allProducts.filter((p) => p.category === selectedCategory).slice(0, 8);

  const categoriesList = [
    { id: "all", label: "All Disciplines" },
    { id: "casual-wear", label: "Casual Wear" },
    { id: "equestrian-clothing", label: "Equestrian" },
    { id: "ice-hockey", label: "Ice Hockey" },
    { id: "cycling", label: "Cycling" },
    { id: "rugby", label: "Rugby" },
    { id: "basketball", label: "Basketball" },
    { id: "ski-wear", label: "Ski Wear" },
    { id: "go-karting-racing", label: "Racing" },
  ];

  // 3D Mouse Parallax Handlers
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 6;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.025,
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const cards = Array.from(
      gridRef.current.querySelectorAll<HTMLElement>(".product-card-entrance-wrapper")
    );
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      const isInitial = isInitialMount.current;
      isInitialMount.current = false;

      const width = window.innerWidth;
      const colsPerRow = width >= 1024 ? 4 : width >= 640 ? 2 : 1;

      // Group cards into rows to trigger per-row 3D elevation on scroll
      const rows: HTMLElement[][] = [];
      for (let i = 0; i < cards.length; i += colsPerRow) {
        rows.push(cards.slice(i, i + colsPerRow));
      }

      if (isInitial) {
        // Initial page load: Setup ScrollTrigger to reveal cards on scroll down
        rows.forEach((rowCards) => {
          if (rowCards.length === 0) return;
          const triggerEl = rowCards[0];

          rowCards.forEach((card, idx) => {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 55,
                scale: 0.93,
                rotateX: 12,
                transformOrigin: "center bottom",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 0.8,
                delay: (idx % colsPerRow) * 0.08,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: triggerEl,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              }
            );
          });
        });
      } else {
        // Category tab switched: Immediately animate newly mounted cards with 3D elevation
        cards.forEach((card, idx) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 45,
              scale: 0.94,
              rotateX: 10,
              transformOrigin: "center bottom",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 0.75,
              delay: (idx % colsPerRow) * 0.06,
              ease: "power3.out",
            }
          );
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [selectedCategory, filteredProducts.length]);

  return (
    <section ref={sectionRef} className="bg-white py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeading
          eyebrow="EXPORT CATALOG SPECIMENS"
          eyebrowColor="#D61C24"
          title="OUR PRODUCTS"
          action={
            <div className="flex items-center gap-3 bg-[#F4F4EF] p-2 border border-[#DADBD2] rounded-[2px]">
              <span className="text-xs font-mono uppercase text-[#72726D] pl-2">
                Viewing as:
              </span>
              <button
                onClick={toggleMode}
                className="px-3 py-1 bg-[#0A0A0A] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
              >
                <span className="text-[#FF333D]">{mode.toUpperCase()}</span>
              </button>
            </div>
          }
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase font-semibold rounded-[2px] border transition-all shrink-0 ${selectedCategory === cat.id
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "bg-[#F4F4EF] text-[#72726D] border-[#DADBD2] hover:border-black"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid (4 cols desktop) with 3D Perspective Elevation */}
        {filteredProducts.length === 0 ? (
          <div className="py-14 text-center border border-dashed border-[#DADBD2] rounded-[2px] bg-white my-4 p-8 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-[#D61C24] font-bold">
              Production Archive
            </p>
            <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Export Styles Updating
            </h3>
            <p className="text-xs sm:text-sm text-[#72726D] max-w-md mx-auto">
              Our export apparel collections are currently being prepared by our Sialkot factory production team.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 pt-2"
            style={{ perspective: "1200px" }}
          >
            {filteredProducts.map((p, idx) => (
              <div
                key={p.id}
                data-card-index={idx}
                className="product-card-entrance-wrapper h-full will-change-transform"
                style={{
                  perspective: "1000px",
                  transformOrigin: "center bottom",
                }}
              >
                <div
                  className="product-card-tilt-inner h-full transition-shadow duration-300 hover:shadow-2xl rounded-[2px]"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <ProductCard product={p} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center pt-8 border-t border-[#DADBD2] flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
          <Link
            href="/catalog"
            className="w-full max-w-[290px] sm:w-auto sm:max-w-none px-3.5 py-2 sm:px-6 sm:py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[10px] sm:text-xs font-mono uppercase font-bold tracking-normal sm:tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 leading-tight"
          >
            <span>Explore Complete Export Catalog (70+ Items)</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </Link>
          <Link
            href="/request-quote"
            className="w-full max-w-[290px] sm:w-auto sm:max-w-none px-3.5 py-2 sm:px-6 sm:py-3 bg-[#F4F4EF] hover:bg-[#DADBD2] border border-[#DADBD2] text-[#0A0A0A] text-[10px] sm:text-xs font-mono uppercase font-bold tracking-normal sm:tracking-wider rounded-[2px] transition-colors flex items-center justify-center text-center leading-tight"
          >
            Request Custom Factory Specification
          </Link>
        </div>

      </div>
    </section>
  );
};
