"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { Heart, Sparkles, Box, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { getProductDemoImage } from "@/services/products.service";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { mode } = useStoreModeStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const demoImage = getProductDemoImage(product.category, product.name, product.subcategory);
  const primaryImage = product.images?.[0] && product.images[0] !== "/placeholder.jpg" ? product.images[0] : demoImage;
  const hoverImage = product.images?.[1] && product.images[1] !== "/placeholder.jpg" ? product.images[1] : primaryImage;
  const displayImage = isHovered ? hoverImage : primaryImage;

  const inWishlist = mounted && isInWishlist(product.id);

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
          {product.threeDModel && (
            <span className="bg-[#D61C24] text-white text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-[1px] font-bold">
              CAD SPEC
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

      {/* Main Image Area (Dominates Card, clean unblocked view) */}
      <div className="relative aspect-square bg-[#F4F4EF] overflow-hidden p-2.5 sm:p-5 lg:p-6">
        <Link href={`/products/${product.slug}/`} prefetch={false} className="block w-full h-full">
          <img
            src={displayImage}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== demoImage && !target.src.endsWith(demoImage)) {
                target.src = demoImage;
              }
            }}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Subcategory & SKU */}
          <div className="flex items-center justify-between text-[8.5px] sm:text-[10px] font-mono text-[#72726D] mb-1">
            <span className="uppercase truncate pr-1">{product.subcategory}</span>
            <span className="shrink-0">{product.sku}</span>
          </div>

          {/* Title - Max 2 lines with ellipses effect and consistent fixed height */}
          <Link
            href={`/products/${product.slug}/`}
            prefetch={false}
            className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] group-hover:text-[#DC2626] transition-colors line-clamp-2 h-[2.5em] sm:h-[2.6em] mb-1.5 sm:mb-2 leading-tight sm:leading-snug"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </Link>
        </div>

        <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-[#F4F4EF]">
          {/* Color Dots & Pricing Row */}
          <div className="flex items-end justify-between gap-1">
            {/* Swatch Previews */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[8px] sm:text-[9px] font-mono text-[#72726D]">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>

            {/* Pricing based on store mode */}
            <div className="text-right shrink-0">
              {mode === "wholesale" ? (
                <div>
                  <div className="text-[10.5px] sm:text-xs font-bold text-[#0A0A0A] font-mono leading-tight">
                    From ${product.wholesalePrice.toFixed(2)}/pc
                  </div>
                  <div className="text-[8px] sm:text-[9.5px] font-mono text-[#D61C24] font-semibold">
                    MOQ {product.MOQ} PCS
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10.5px] sm:text-xs font-bold text-[#0A0A0A] font-mono leading-tight">
                    ${product.retailPrice.toFixed(2)}
                  </div>
                  <div className="text-[8px] sm:text-[9.5px] font-mono text-[#72726D]">
                    Single Piece
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Row (Placed directly below product details) */}
          <div className="pt-2 border-t border-[#F4F4EF] flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleQuickAdd}
              className="flex-1 py-1.5 sm:py-2 px-1.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[8.5px] sm:text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shadow-xs min-w-0"
            >
              {addedToast ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF333D] shrink-0" />
                  <span className="truncate">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">
                    <span className="sm:hidden">{mode === "wholesale" ? "MOQ" : "Add"}</span>
                    <span className="hidden sm:inline">{mode === "wholesale" ? "Add MOQ" : "Quick Add"}</span>
                  </span>
                </>
              )}
            </button>

            <Link
              href={`/products/${product.slug}/`}
              prefetch={false}
              className="px-2 sm:px-3.5 py-1.5 sm:py-2 bg-white hover:bg-[#F4F4EF] text-[#0A0A0A] border border-[#DADBD2] hover:border-[#0A0A0A] rounded-[2px] text-[8.5px] sm:text-[10px] font-mono uppercase font-bold text-center transition-colors shrink-0 cursor-pointer"
              title="View Product Details"
            >
              <span className="hidden sm:inline">View </span>Specs
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
