"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { useCartStore } from "@/stores/useCartStore";
import { getProductDemoImage } from "@/services/products.service";
import { siteConfig } from "@/config/site.config";
import { Product } from "@/types";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight,
  FileText,
  Boxes,
  Share2,
  RefreshCw,
} from "lucide-react";

export default function WishlistPage() {
  const { items, clearWishlist, removeItem } = useWishlistStore();
  const { mode } = useStoreModeStore();
  const { addItem, toggleCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [addedAllToast, setAddedAllToast] = useState(false);
  const [addedSingleId, setAddedSingleId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quick Add single item to cart
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      image: product.images?.[0] || getProductDemoImage(product.category, product.name, product.subcategory),
      mode,
      unitPrice: mode === "wholesale" ? product.wholesalePrice : product.retailPrice,
      quantity: mode === "wholesale" ? product.MOQ : 1,
      color: product.colors?.[0] || { id: "c-black", name: "Black", hex: "#0A0A0A" },
      size: product.sizes?.[0] || "L",
      sizeBreakdown: mode === "wholesale" ? { S: 10, M: 20, L: 20 } : undefined,
    });

    setAddedSingleId(product.id);
    setTimeout(() => setAddedSingleId(null), 1500);
  };

  // Add all items in wishlist to cart
  const handleAddAllToCart = () => {
    if (items.length === 0) return;

    items.forEach((product, idx) => {
      addItem({
        id: `${product.id}_${Date.now()}_${idx}`,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        sku: product.sku,
        image: product.images?.[0] || getProductDemoImage(product.category, product.name, product.subcategory),
        mode,
        unitPrice: mode === "wholesale" ? product.wholesalePrice : product.retailPrice,
        quantity: mode === "wholesale" ? product.MOQ : 1,
        color: product.colors?.[0] || { id: "c-black", name: "Black", hex: "#0A0A0A" },
        size: product.sizes?.[0] || "L",
        sizeBreakdown: mode === "wholesale" ? { S: 10, M: 20, L: 20 } : undefined,
      });
    });

    setAddedAllToast(true);
    setTimeout(() => {
      setAddedAllToast(false);
      toggleCart();
    }, 1200);
  };

  // Share Wishlist URL
  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  // Quote URL with list of saved items
  const quoteUrl = items.length > 0
    ? `/request-quote?items=${encodeURIComponent(items.map((i) => `${i.name} (SKU: ${i.sku})`).join(", "))}`
    : "/request-quote";

  return (
    <div className="w-full bg-[#FAFAF8] min-h-[calc(100vh-72px)] select-none pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#72726D] mb-6">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#A8A8A2]" />
          <Link href="/catalog" className="hover:text-black transition-colors">Catalog</Link>
          <ChevronRight className="w-3 h-3 text-[#A8A8A2]" />
          <span className="text-[#0A0A0A] font-bold">Wishlist</span>
        </nav>

        {/* Page Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-8 border-b border-[#DADBD2] gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#D61C24] rounded-full animate-pulse" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#D61C24]">
                CLIENT PROCUREMENT ARCHIVE
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Product Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#72726D] max-w-2xl font-mono">
              Curated technical sportswear silhouettes and teamwear specimens saved for custom OEM sampling, bulk production runs, or team procurement review.
            </p>
          </div>

          {/* Action Bar (Only when mounted and items > 0) */}
          {mounted && items.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Share Wishlist */}
              <button
                onClick={handleShareWishlist}
                className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Copy Wishlist Link"
              >
                {shareToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#72726D]" />
                    <span>Share</span>
                  </>
                )}
              </button>

              {/* Request Bulk Quote */}
              <Link
                href={quoteUrl}
                className="px-4 py-2.5 bg-white hover:bg-[#0A0A0A] hover:text-white border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#D61C24]" />
                <span>Quote Saved Items</span>
              </Link>

              {/* Add All to Cart */}
              <button
                onClick={handleAddAllToCart}
                className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {addedAllToast ? (
                  <>
                    <Check className="w-4 h-4 text-[#FF333D]" />
                    <span>Added All to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add All ({items.length}) • {mode === "wholesale" ? "MOQ" : "Retail"}
                    </span>
                  </>
                )}
              </button>

              {/* Clear All */}
              <button
                onClick={clearWishlist}
                className="p-2.5 text-[#72726D] hover:text-[#D61C24] hover:bg-[#D61C24]/10 rounded-[2px] transition-colors cursor-pointer border border-transparent hover:border-[#D61C24]/20"
                title="Clear all saved garments"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content State Handling */}
        {!mounted ? (
          /* Loading Skeletons for SSR hydration safety */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-[#DADBD2] rounded-[2px] p-2.5 sm:p-4 space-y-3 sm:space-y-4 animate-pulse">
                <div className="aspect-square bg-[#F4F4EF] rounded-[2px]" />
                <div className="h-3 sm:h-4 bg-[#F4F4EF] rounded w-3/4" />
                <div className="h-2.5 sm:h-3 bg-[#F4F4EF] rounded w-1/2" />
                <div className="h-7 sm:h-9 bg-[#F4F4EF] rounded w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="space-y-12">
            <div className="bg-white border border-[#DADBD2] rounded-[2px] p-12 sm:p-20 text-center max-w-3xl mx-auto shadow-xs">
              <div className="w-20 h-20 bg-[#F4F4EF] border border-[#DADBD2] rounded-full flex items-center justify-center mx-auto mb-6 text-[#72726D]">
                <Heart className="w-10 h-10 text-[#D61C24]" />
              </div>
              
              <div className="space-y-3 max-w-lg mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                  Your Garment Wishlist is Empty
                </h2>
                <p className="text-xs sm:text-sm text-[#72726D] font-mono leading-relaxed">
                  Bookmark high-performance silhouettes while exploring our 8 specialized manufacturing disciplines or live customizer. Your saved items will be archived here for instant quotation and sample procurement.
                </p>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/catalog"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Boxes className="w-4 h-4" />
                  <span>Browse Product Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/customize"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-neutral-100 border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold rounded-[2px] inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#D61C24]" />
                  <span>Launch Customizer</span>
                </Link>
              </div>
            </div>

            {/* Quick Category Jump Pills */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase text-[#72726D] tracking-wider font-semibold">
                  Or explore directly by manufacturing discipline:
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
                {siteConfig.mainCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog?category=${cat.id}`}
                    className="px-3.5 py-2 bg-white hover:bg-[#0A0A0A] hover:text-white border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#D61C24] font-bold text-[10px]">{cat.number}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Grid of Saved Items */
          <div>
            {/* Top Stats Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-[#72726D] mb-4">
              <div>
                SHOWING <span className="font-bold text-[#0A0A0A]">{items.length}</span> {items.length === 1 ? "SAVED SPECIMEN" : "SAVED SPECIMENS"}
              </div>
              <div className="flex items-center gap-2">
                <span>PRICING VIEW:</span>
                <span className="px-2 py-0.5 bg-[#0A0A0A] text-white font-bold rounded-[2px] uppercase text-[10px]">
                  {mode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {items.map((product) => {
                const demoImage = getProductDemoImage(product.category, product.name, product.subcategory);
                const displayImage = product.images?.[0] && product.images[0] !== "/placeholder.jpg" ? product.images[0] : demoImage;
                const isAdded = addedSingleId === product.id;

                return (
                  <div
                    key={product.id}
                    className="group bg-white border border-[#DADBD2] rounded-[2px] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#D61C24] hover:shadow-md relative"
                  >
                    {/* Top Action Bar */}
                    <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between z-20 pointer-events-none">
                      <span className="bg-[#0A0A0A]/85 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-mono uppercase px-1.5 sm:px-2 py-0.5 rounded-[1px] font-bold truncate max-w-[70%]">
                        {product.subcategory || product.category}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeItem(product.id);
                        }}
                        className="pointer-events-auto p-1 sm:p-1.5 rounded-full bg-white/90 hover:bg-[#D61C24] text-[#72726D] hover:text-white border border-[#DADBD2] hover:border-[#D61C24] transition-colors cursor-pointer shadow-xs"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-square bg-[#F4F4EF] overflow-hidden p-2.5 sm:p-5 lg:p-6">
                      <Link href={`/products/${product.slug}`} className="block w-full h-full">
                        <img
                          src={displayImage}
                          alt={product.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== demoImage && !target.src.endsWith(demoImage)) {
                              target.src = demoImage;
                            }
                          }}
                          className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    </div>

                    {/* Details Area */}
                    <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1">
                      <div>
                        {/* Category & SKU */}
                        <div className="flex items-center justify-between text-[8.5px] sm:text-[10px] font-mono text-[#72726D] mb-1">
                          <span className="uppercase text-[#D61C24] font-semibold truncate pr-1">{product.category}</span>
                          <span className="shrink-0">{product.sku}</span>
                        </div>

                        {/* Title */}
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-tight text-[#0A0A0A] group-hover:text-[#D61C24] transition-colors line-clamp-2 h-[2.5em] sm:h-[2.6em] mb-1.5 sm:mb-2 leading-tight sm:leading-snug"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.name}
                        </Link>

                        {/* Fabric Snippet */}
                        {product.fabric && (
                          <div className="text-[8.5px] sm:text-[10px] font-mono text-[#72726D] line-clamp-1 mb-2 sm:mb-3">
                            Fabric: <span className="text-[#0A0A0A] font-medium">{product.fabric}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-[#F4F4EF]">
                        {/* Swatches & Price */}
                        <div className="flex items-end justify-between gap-1">
                          <div className="flex items-center gap-1">
                            {product.colors?.slice(0, 4).map((c) => (
                              <span
                                key={c.id}
                                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                            {(product.colors?.length || 0) > 4 && (
                              <span className="text-[8px] sm:text-[9px] font-mono text-[#72726D]">
                                +{(product.colors?.length || 0) - 4}
                              </span>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            {mode === "wholesale" ? (
                              <div>
                                <div className="text-[10.5px] sm:text-xs font-bold text-[#0A0A0A] font-mono">
                                  From ${product.wholesalePrice.toFixed(2)}/pc
                                </div>
                                <div className="text-[8px] sm:text-[9.5px] font-mono text-[#D61C24] font-semibold">
                                  MOQ {product.MOQ} PCS
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-[10.5px] sm:text-xs font-bold text-[#0A0A0A] font-mono">
                                  ${product.retailPrice.toFixed(2)}
                                </div>
                                <div className="text-[8px] sm:text-[9.5px] font-mono text-[#72726D]">
                                  Single Sample
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-[#F4F4EF] flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="flex-1 py-1.5 sm:py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[8.5px] sm:text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] flex items-center justify-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#FF333D]" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                <span>
                                  <span className="sm:hidden">{mode === "wholesale" ? "MOQ" : "Add"}</span>
                                  <span className="hidden sm:inline">{mode === "wholesale" ? "Add MOQ" : "Add to Bag"}</span>
                                </span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/products/${product.slug}`}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white hover:bg-[#F4F4EF] text-[#0A0A0A] border border-[#DADBD2] hover:border-[#0A0A0A] rounded-[2px] text-[8.5px] sm:text-[10px] font-mono uppercase font-bold text-center transition-colors shrink-0 cursor-pointer"
                            title="Inspect Technical Specifications"
                          >
                            <span className="hidden sm:inline">View </span>Specs
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
