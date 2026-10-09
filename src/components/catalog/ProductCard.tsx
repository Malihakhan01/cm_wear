"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { Heart, Sparkles, Box, Check, ShoppingBag, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { mode } = useStoreModeStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      image: product.images[0],
      mode,
      unitPrice: mode === "wholesale" ? product.wholesalePrice : product.retailPrice,
      quantity: mode === "wholesale" ? product.MOQ : 1,
      color: product.colors[0],
      size: product.sizes[0],
      sizeBreakdown: mode === "wholesale" ? { S: 10, M: 20, L: 20 } : undefined,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1500);
  };

  const currentDisplayPrice = mode === "wholesale" ? product.wholesalePrice : product.retailPrice;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white border border-[#DADBD2] rounded-[2px] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#D61C24] hover:shadow-md relative"
    >
      {/* Top Badges Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1">
          {product.customizable && (
            <span className="bg-[#0A0A0A] text-white text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-[1px] flex items-center gap-1 font-bold">
              <Sparkles className="w-2.5 h-2.5 text-[#FF333D]" />
              CUSTOMIZABLE
            </span>
          )}
          {product.sampleAvailable && (
            <span className="bg-[#F4F4EF] text-[#0A0A0A] border border-[#DADBD2] text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-[1px]">
              SAMPLE READY
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(product);
          }}
          className={`pointer-events-auto p-1.5 rounded-full transition-colors ${
            inWishlist
              ? "bg-[#D61C24] text-white"
              : "bg-white/80 hover:bg-white text-[#0A0A0A] border border-[#DADBD2]"
          }`}
          title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Main Image Area (Dominates Card) */}
      <div className="relative aspect-square bg-[#F4F4EF] overflow-hidden p-6">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-auto">
          {product.customizable ? (
            <Link
              href={`/customize/${product.customizerId || "custom-hoodie"}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] text-center flex items-center justify-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-[#FF333D]" />
              <span>Customize</span>
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] flex items-center justify-center gap-1 transition-colors"
            >
              {addedToast ? (
                <>
                  <Check className="w-3 h-3 text-[#FF333D]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span>{mode === "wholesale" ? "Add MOQ" : "Quick Add"}</span>
                </>
              )}
            </button>
          )}

          <Link
            href={`/products/${product.slug}`}
            className="px-2.5 py-2 bg-white hover:bg-[#DADBD2] text-[#0A0A0A] border border-[#DADBD2] rounded-[2px] text-[10px] font-mono uppercase font-bold"
            title="View Product Details"
          >
            Specs
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Subcategory & SKU */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#72726D] mb-1">
            <span className="uppercase">{product.subcategory}</span>
            <span>{product.sku}</span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-bold uppercase tracking-tight text-[#0A0A0A] group-hover:text-[#D61C24] transition-colors line-clamp-1 mb-2"
          >
            {product.name}
          </Link>
        </div>

        {/* Color Dots & Pricing Row */}
        <div className="pt-3 border-t border-[#F4F4EF] flex items-end justify-between">
          {/* Swatch Previews */}
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[9px] font-mono text-[#72726D]">
                +{product.colors.length - 4}
              </span>
            )}
          </div>

          {/* Pricing based on store mode */}
          <div className="text-right">
            {mode === "wholesale" ? (
              <div>
                <div className="text-xs font-bold text-[#0A0A0A] font-mono">
                  From ${product.wholesalePrice.toFixed(2)}/pc
                </div>
                <div className="text-[10px] font-mono text-[#D61C24] font-semibold">
                  MOQ {product.MOQ} PCS
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-[#0A0A0A] font-mono">
                  ${product.retailPrice.toFixed(2)}
                </div>
                <div className="text-[10px] font-mono text-[#72726D]">
                  Single Piece
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
