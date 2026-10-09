"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { Search, X, ArrowRight, Tag, Box, Sparkles } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedProducts = q
    ? PRODUCTS_DATA.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const matchedCategories = q
    ? CATEGORIES_DATA.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subcategories.some((s) => s.name.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-[#0A0A0A]/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white border border-[#DADBD2] rounded-[2px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-[#DADBD2] h-14 bg-[#F4F4EF]">
          <Search className="w-5 h-5 text-[#72726D] mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, SKU, category (e.g. Hoodie, Racing, Cycling)..."
            className="w-full bg-transparent text-sm text-[#0A0A0A] placeholder-[#72726D] focus:outline-hidden font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#72726D] hover:text-[#0A0A0A] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[11px] font-mono uppercase bg-[#DADBD2] hover:bg-[#72726D] hover:text-white px-2 py-1 rounded-[2px] text-[#0A0A0A] transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-8 text-center space-y-2">
              <div className="text-xs font-mono uppercase text-[#72726D]">
                Quick Product Searches
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["French Terry Hoodie", "Racing Suit", "Cycling Jersey", "Equestrian Jacket", "Rugby Jersey", "Varsity Jacket"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 bg-[#F4F4EF] hover:bg-[#0A0A0A] hover:text-white text-xs text-[#0A0A0A] rounded-[2px] border border-[#DADBD2] transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : matchedProducts.length === 0 && matchedCategories.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#72726D]">
              No products found matching &ldquo;<strong className="text-black">{query}</strong>&rdquo;. Try searching for &ldquo;Hoodie&rdquo;, &ldquo;Jacket&rdquo;, or &ldquo;Jersey&rdquo;.
            </div>
          ) : (
            <>
              {/* Matched Categories */}
              {matchedCategories.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-[#72726D] mb-2">
                    Categories
                  </div>
                  <div className="space-y-1">
                    {matchedCategories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/catalog?category=${c.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2 hover:bg-[#F4F4EF] rounded-[2px] text-xs font-semibold text-[#0A0A0A] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-[#D61C24]" />
                          <span className="font-mono text-[#D61C24]">{c.number}</span>
                          {c.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#72726D]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-[#72726D] mb-2">
                    Products ({matchedProducts.length})
                  </div>
                  <div className="space-y-2">
                    {matchedProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2 hover:bg-[#F4F4EF] rounded-[2px] transition-colors border border-transparent hover:border-[#DADBD2]"
                      >
                        <div className="w-12 h-12 bg-[#F4F4EF] rounded-[2px] flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#0A0A0A] truncate uppercase">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-[#72726D] font-mono flex items-center gap-2">
                            <span>SKU: {p.sku}</span>
                            <span>•</span>
                            <span className="text-[#D61C24] font-semibold">
                              MOQ: {p.MOQ} PCS
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-[#0A0A0A]">
                            ${p.retailPrice.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-[#72726D] font-mono">
                            From ${p.wholesalePrice.toFixed(2)}/pc
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F4F4EF] border-t border-[#DADBD2] flex items-center justify-between text-[11px] font-mono text-[#72726D]">
          <span>Type & press Enter to view all results</span>
          <Link
            href="/customize"
            onClick={onClose}
            className="text-[#D61C24] hover:text-[#A31017] font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Or launch customizer
          </Link>
        </div>
      </div>
    </div>
  );
};
