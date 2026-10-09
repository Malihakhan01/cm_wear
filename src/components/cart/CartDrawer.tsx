"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { X, Trash2, ArrowRight, ShoppingBag, FileText, Sparkles } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotalPieces } =
    useCartStore();
  const { mode } = useStoreModeStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const totalPieces = getTotalPieces();

  return (
    <div 
      onClick={closeCart}
      className="fixed inset-0 z-[99999] bg-[#0A0A0A]/75 backdrop-blur-xs flex justify-end transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl border-l border-[#DADBD2] animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#DADBD2] flex items-center justify-between bg-[#F4F4EF]">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0A0A0A]" />
              <h2 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A]">
                {mode === "wholesale" ? "Wholesale Quote Cart" : "Retail Shopping Bag"}
              </h2>
            </div>
            <div className="text-[11px] font-mono text-[#72726D] mt-0.5">
              {items.length} item{items.length === 1 ? "" : "s"} • {totalPieces} total pieces
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 hover:bg-[#DADBD2] rounded-[2px] text-[#0A0A0A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                  Explore our 8 specialized manufacturing categories or configure a custom garment.
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
                className="p-3 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] flex gap-3 relative group"
              >
                {/* Image */}
                <div className="w-16 h-16 bg-white border border-[#DADBD2] rounded-[2px] flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold uppercase text-[#0A0A0A] truncate">
                      {item.productName}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#72726D] hover:text-[#0A0A0A] p-0.5"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[10px] font-mono text-[#72726D] mt-0.5 space-y-0.5">
                    <div>SKU: {item.sku}</div>
                    {item.color && (
                      <div className="flex items-center gap-1">
                        <span>Color:</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: item.color.hex }}
                        />
                        <span>{item.color.name}</span>
                      </div>
                    )}
                    {item.size && <div>Size: {item.size}</div>}
                    {item.sizeBreakdown && (
                      <div className="text-[9px] text-[#D61C24] font-bold">
                        Sizes:{" "}
                        {Object.entries(item.sizeBreakdown)
                          .map(([s, q]) => `${s}:${q}`)
                          .join(", ")}
                      </div>
                    )}
                    {item.isCustomized && (
                      <div className="text-[#D61C24] font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Custom Artwork Applied
                      </div>
                    )}
                  </div>

                  {/* Quantity and price row */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DADBD2]">
                    <div className="flex items-center border border-[#DADBD2] bg-white rounded-[2px]">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - (item.sizeBreakdown ? 10 : 1)))}
                        className="px-2 py-0.5 text-xs text-[#72726D] hover:text-black font-mono"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-[#0A0A0A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + (item.sizeBreakdown ? 10 : 1))}
                        className="px-2 py-0.5 text-xs text-[#72726D] hover:text-black font-mono"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-[#0A0A0A] font-mono">
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
          <div className="p-4 sm:p-6 border-t border-[#DADBD2] bg-[#F4F4EF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#72726D]">
                Estimated Subtotal
              </span>
              <span className="text-lg font-bold font-mono text-[#0A0A0A]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#72726D]">
              * Shipping, export tariffs, and bulk volume discounts finalized upon quotation confirmation.
            </div>

            <div className="space-y-2 pt-2">
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
};
