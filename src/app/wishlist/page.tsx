"use client";

import React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  return (
    <div className="w-full bg-[#FAFAF8] py-16 select-none min-h-[calc(100vh-72px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#DADBD2] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-[#D61C24] fill-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">CLIENT FAVORITES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Saved Garment Wishlist
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-mono uppercase text-[#72726D] hover:text-black underline"
            >
              Clear All Saved Items
            </button>
          )}
        </div>

        {/* Grid or Empty State */}
        {items.length === 0 ? (
          <div className="bg-white border border-[#DADBD2] rounded-[2px] p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-[#F4F4EF] rounded-full flex items-center justify-center mx-auto text-[#72726D]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold uppercase text-[#0A0A0A]">
              Your wishlist is currently empty
            </h3>
            <p className="text-xs text-[#72726D] max-w-sm mx-auto">
              Save products while browsing our 8 specialized manufacturing disciplines to review with your procurement team later.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="px-6 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] inline-flex items-center gap-2 transition-colors"
              >
                <span>Browse Product Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
