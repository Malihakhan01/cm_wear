"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { X, Trash2, ArrowRight, ShoppingBag, FileText, Sparkles } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotalPieces } =
    useCartStore();
  const { mode } = useStoreModeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling while cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const subtotal = getSubtotal();
  const totalPieces = getTotalPieces();

  const drawerContent = (
    <div 
      onClick={closeCart}
      className="fixed inset-0 z-[99999] bg-[#0A0A0A]/75 backdrop-blur-xs flex justify-end transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md sm:max-w-lg bg-white h-screen max-h-screen flex flex-col justify-between shadow-2xl border-l border-[#DADBD2] animate-in slide-in-from-right duration-300 z-[100000]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#DADBD2] flex items-center justify-between bg-[#F4F4EF] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0A0A0A]" />
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight text-[#0A0A0A]">
                {mode === "wholesale" ? "Wholesale Quote Cart" : "Retail Shopping Bag"}
              </h2>
            </div>
            <div className="text-[11px] font-mono text-[#72726D] mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} • {totalPieces} total pieces
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 hover:bg-[#DADBD2] rounded-[2px] text-[#0A0A0A] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-[#F4F4EF] rounded-full flex items-center justify-center mx-auto text-[#72726D]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold uppercase text-[#0A0A0A]">
                  Your cart is currently empty
                </div>
                <p className="text-xs text-[#72726D] max-w-xs mx-auto">
                  Explore our manufacturing categories or configure a custom garment.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/catalog"
                  onClick={closeCart}
                  className="px-4 py-2.5 bg-[#0A0A0A] text-white text-xs font-mono uppercase font-semibold rounded-[2px] hover:bg-[#D61C24] transition-colors"
                >
                  Browse Catalog
                </Link>
                <Link
                  href="/customize"
                  onClick={closeCart}
                  className="px-4 py-2 bg-[#F4F4EF] border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-semibold rounded-[2px] hover:bg-[#DADBD2] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D61C24]" /> Launch Configurator
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] flex gap-3.5 relative group hover:border-[#0A0A0A]/30 transition-colors"
              >
                {/* Image */}
                <Link
                  href={item.productSlug ? `/products/${item.productSlug}` : "#"}
                  onClick={closeCart}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-[#DADBD2] rounded-[2px] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#0A0A0A] transition-colors"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-[#72726D]" />
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={item.productSlug ? `/products/${item.productSlug}` : "#"}
                        onClick={closeCart}
                        className="text-xs sm:text-sm font-bold uppercase text-[#0A0A0A] hover:text-[#D61C24] transition-colors leading-snug line-clamp-2"
                        title={item.productName}
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#72726D] hover:text-[#D61C24] p-1 transition-colors cursor-pointer shrink-0"
                        title="Remove product"
                        aria-label="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-[#72726D] mt-1.5 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span>SKU: <strong className="text-[#0A0A0A] font-semibold">{item.sku}</strong></span>
                        {item.fabric && (
                          <span>Fabric: <strong className="text-[#0A0A0A] font-semibold">{item.fabric}</strong></span>
                        )}
                        {item.gsm && (
                          <span>GSM: <strong className="text-[#0A0A0A] font-semibold">{item.gsm}</strong></span>
                        )}
                      </div>

                      {item.color && (
                        <div className="flex items-center gap-1.5 text-[#0A0A0A]">
                          <span className="text-[#72726D]">Color:</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 inline-block"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span className="font-semibold">{item.color.name}</span>
                        </div>
                      )}

                      {item.size && (
                        <div>
                          <span className="text-[#72726D]">Size: </span>
                          <strong className="text-[#0A0A0A] font-semibold">{item.size}</strong>
                        </div>
                      )}

                      {item.sizeBreakdown && Object.keys(item.sizeBreakdown).length > 0 && (
                        <div className="mt-1">
                          <div className="text-[10px] text-[#72726D] uppercase tracking-wider mb-1 font-semibold">
                            Size Breakdown ({item.quantity} pcs):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(item.sizeBreakdown).map(([s, q]) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 bg-white border border-[#DADBD2] text-[10px] rounded-[2px] font-bold text-[#0A0A0A]"
                              >
                                {s}: <span className="text-[#D61C24]">{q}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.isCustomized && (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#D61C24]/10 text-[#D61C24] text-[10px] font-bold rounded-[2px] mt-1">
                          <Sparkles className="w-3 h-3" /> Custom Artwork Applied
                        </div>
                      )}

                      {item.notes && (
                        <div className="text-[10px] text-[#72726D] italic mt-1 bg-white/70 p-1.5 rounded-[2px] border border-[#DADBD2]/50">
                          &quot;{item.notes}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity and price row */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#DADBD2]">
                    <div className="flex items-center border border-[#DADBD2] bg-white rounded-[2px]">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - (item.sizeBreakdown ? 10 : 1))
                          )
                        }
                        className="px-2.5 py-1 text-xs text-[#72726D] hover:text-black hover:bg-[#F4F4EF] font-mono cursor-pointer transition-colors"
                        title={item.sizeBreakdown ? "Decrease by 10" : "Decrease by 1"}
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-mono font-bold text-[#0A0A0A] min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + (item.sizeBreakdown ? 10 : 1)
                          )
                        }
                        className="px-2.5 py-1 text-xs text-[#72726D] hover:text-black hover:bg-[#F4F4EF] font-mono cursor-pointer transition-colors"
                        title={item.sizeBreakdown ? "Increase by 10" : "Increase by 1"}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-bold text-[#0A0A0A] font-mono">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[#72726D] font-mono">
                        @ ${item.unitPrice.toFixed(2)}/pc
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout / RFQ Buttons */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#DADBD2] bg-[#F4F4EF] space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#72726D]">
                Estimated Subtotal
              </span>
              <span className="text-base sm:text-lg font-bold font-mono text-[#0A0A0A]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#72726D]">
              * Shipping, export tariffs, and bulk volume discounts finalized upon quotation confirmation.
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href="/request-quote"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Request Official Factory Quotation
              </Link>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-[#DADBD2] border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                Proceed to Demo Checkout
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(drawerContent, document.body) : null;
};
