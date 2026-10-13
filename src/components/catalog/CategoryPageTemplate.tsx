"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Category, Product } from "@/types";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { ArrowRight, Sparkles, ShieldCheck, FileText, Filter, CheckCircle2 } from "lucide-react";

interface CategoryPageTemplateProps {
  category: Category;
  products: Product[];
}

export const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({
  category,
  products,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "moq-asc">("featured");

  const { mode, toggleMode } = useStoreModeStore();

  const filteredProducts = products
    .filter((p) => {
      if (selectedSubcategory !== "all" && p.subcategory !== selectedSubcategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.retailPrice - b.retailPrice;
      if (sortBy === "price-desc") return b.retailPrice - a.retailPrice;
      if (sortBy === "moq-asc") return a.MOQ - b.MOQ;
      return 0;
    });

  return (
    <div className="w-full bg-[#FFFFFF]">
      
      {/* Editorial Category Hero Banner */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-16 sm:py-24 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#FF333D] mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-white transition-colors">
              Catalog
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{category.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="editorial-number text-5xl sm:text-7xl font-bold text-[#D61C24] font-display">
                  {category.number}
                </span>
                <span className="eyebrow-label text-[#FF333D] bg-[#20201E] px-3 py-1 rounded-[2px] border border-[#3A3A36]">
                  EXPORT SPECIFICATION LINE
                </span>
              </div>

              {/* Strict SEO Single H1 */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
                {category.name} Manufacturing
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed font-sans">
                {category.description}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href={`/request-quote?category=${category.id}`}
                className="w-full py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] text-center transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Request {category.name} Quote</span>
              </Link>

              <Link
                href="/customize"
                className="w-full py-3.5 bg-[#20201E] hover:bg-white hover:text-black border border-[#3A3A36] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] text-center transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FF333D]" />
                <span>Launch Customizer</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Filter & Subcategory Toolbar */}
      <section className="bg-[#F4F4EF] border-b border-[#DADBD2] py-4 sticky top-[72px] z-30 select-none backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Subcategories Horizontal Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedSubcategory("all")}
                className={`px-3 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition-all shrink-0 ${
                  selectedSubcategory === "all"
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2]"
                }`}
              >
                All Subcategories ({products.length})
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.name)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase font-semibold rounded-[2px] transition-all shrink-0 ${
                    selectedSubcategory === sub.name
                      ? "bg-[#0A0A0A] text-white"
                      : "bg-white text-[#72726D] hover:text-black border border-[#DADBD2]"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {/* Quick Filter & Sort Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#DADBD2] px-2.5 py-1.5 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="moq-asc">MOQ: Lowest</option>
              </select>

              <button
                onClick={toggleMode}
                className="px-2.5 py-1.5 bg-[#0A0A0A] text-white text-xs font-mono uppercase font-bold rounded-[2px] hidden sm:block"
              >
                <span className="text-[#FF333D]">{mode.toUpperCase()}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Product Grid */}
      <section className="py-16 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DADBD2]">
            <div className="text-xs font-mono text-[#72726D] uppercase">
              Showing <strong className="text-black">{filteredProducts.length}</strong> styles in{" "}
              <strong className="text-black">{category.name}</strong>
            </div>
            <div className="text-xs font-mono text-[#D61C24] font-bold">
              Factory Direct Sialkot Export
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-sm text-[#72726D]">
                No styles match this subcategory filter.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory("all");
                }}
                className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-mono uppercase rounded-[2px]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Category Technical Capabilities & Highlights (Off-White) */}
      <section className="bg-[#F4F4EF] py-16 border-t border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Technical Highlights */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                {category.name} Engineering Specifications
              </h3>
              <ul className="space-y-2.5 text-xs font-mono text-[#72726D]">
                {category.technicalHighlights.map((th, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D61C24] shrink-0" />
                    <span className="text-[#0A0A0A]">{th}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Sourcing Capabilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                Private Label & OEM Services
              </h3>
              <ul className="space-y-2.5 text-xs font-mono text-[#72726D]">
                {category.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D61C24] shrink-0" />
                    <span className="text-[#0A0A0A]">{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Category FAQs if available */}
      {category.faqs && category.faqs.length > 0 && (
        <section className="py-16 border-t border-[#DADBD2] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display mb-6 text-center">
            {category.name} Manufacturing FAQs
          </h3>
          <div className="space-y-3">
            {category.faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] space-y-1">
                <div className="text-xs font-bold uppercase text-[#0A0A0A] font-mono">
                  {faq.question}
                </div>
                <div className="text-xs text-[#72726D] font-sans leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Custom RFQ Strip */}
      <section className="bg-[#0A0A0A] text-white py-12 border-t border-[#2A2A28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold uppercase tracking-tight font-display text-white">
              Need Custom Silhouettes in {category.name}?
            </h4>
            <p className="text-xs text-neutral-400">
              We engineer custom pattern grading, CAD grading, and private label trims starting from 30–50 pieces.
            </p>
          </div>
          <Link
            href={`/request-quote?category=${category.id}`}
            className="px-6 py-3 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] shrink-0 transition-colors flex items-center gap-2"
          >
            <span>Request Specification Sheet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
