"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackingService } from "@/services/tracking.service";
import { Order } from "@/types";
import { Search, Package, ChevronDown, ChevronUp, MapPin, Truck, Check } from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const queryOrder = searchParams.get("order") || searchParams.get("orderNumber");

  const [orderNumberInput, setOrderNumberInput] = useState(queryOrder || "PP-20261012-F245");
  const [emailInput, setEmailInput] = useState("");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);

  const loadOrder = async (targetRef: string) => {
    if (!targetRef.trim()) return;
    setIsSearching(true);
    const result = await trackingService.trackOrder(targetRef);
    setActiveOrder(result);
    setIsSearching(false);
    setHasSearched(true);
  };

  useEffect(() => {
    let initialTarget = queryOrder;

    if (!initialTarget && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cm-wear-last-order");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.orderNumber) {
            initialTarget = parsed.orderNumber;
          }
        } catch (e) {
          console.warn("Stored order parse error:", e);
        }
      }
    }

    const finalTarget = initialTarget || "PP-20261012-F245";
    setOrderNumberInput(finalTarget);
    if (finalTarget === "PP-20261012-F245") {
      setEmailInput("email@gmail.com");
    }
    loadOrder(finalTarget);
  }, [queryOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrder(orderNumberInput);
  };

  // Determine current active step (1 to 4)
  const getActiveStep = (order: Order | null): number => {
    if (!order) return 1;
    const status = (order.status || "").toLowerCase();

    if (status.includes("deliver") || status.includes("dispatch") || status.includes("complet") || status.includes("quot")) {
      return 4;
    }
    if (status.includes("production") || status.includes("repli") || status.includes("stitch") || order.currentStageIndex >= 2) {
      return 3;
    }
    if (status.includes("review") || status.includes("process") || order.currentStageIndex >= 1) {
      return 2;
    }
    return 1;
  };

  const currentActiveStep = getActiveStep(activeOrder);

  // 4 Less Stages matching Screen 1
  const isQuoteInquiry =
    activeOrder?.orderNumber.startsWith("PP-") ||
    activeOrder?.orderNumber.startsWith("RFQ-");

  const fourStages = [
    { step: 1, label: "RECEIVED" },
    { step: 2, label: "IN REVIEW" },
    { step: 3, label: isQuoteInquiry ? "REPLIED" : "IN PRODUCTION" },
    { step: 4, label: isQuoteInquiry ? "QUOTED" : "DISPATCHED" },
  ];

  return (
    <div className="w-full bg-[#FAFAF8] py-14 select-none min-h-[calc(100vh-72px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#72726D] mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Track Order & Inquiry Status</span>
        </div>

        {/* Search Bar Card - Matching Screen 1 */}
        <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 mb-8 shadow-xs">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Reference Number Input */}
            <div className="md:col-span-5">
              <label className="block text-[11px] font-mono uppercase text-[#72726D] font-bold mb-1.5 tracking-wider">
                Reference Number
              </label>
              <input
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="PP-20261012-F245"
                className="w-full bg-white border border-[#DADBD2] px-3.5 py-2.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                required
              />
            </div>

            {/* Email Used in Inquiry Input */}
            <div className="md:col-span-5">
              <label className="block text-[11px] font-mono uppercase text-[#72726D] font-bold mb-1.5 tracking-wider">
                Email Used in Inquiry
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="email@gmail.com"
                className="w-full bg-[#EBF2FC] border border-[#CBDCF7] px-3.5 py-2.5 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Red Track Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-2.5 bg-[#E52B28] hover:bg-[#cf2421] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? "Searching..." : "Track"}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#72726D]">
            <span>Try Demo References:</span>
            <button
              type="button"
              onClick={() => {
                setOrderNumberInput("PP-20261012-F245");
                setEmailInput("email@gmail.com");
                loadOrder("PP-20261012-F245");
              }}
              className="text-[#E52B28] hover:underline font-bold"
            >
              PP-20261012-F245 (Screen 1 Inquiry)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setOrderNumberInput("TI-849201");
                setEmailInput("procurement@vanceatelier.com");
                loadOrder("TI-849201");
              }}
              className="text-[#E52B28] hover:underline font-bold"
            >
              TI-849201 (Commercial Order)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setOrderNumberInput("TI-563657");
                loadOrder("TI-563657");
              }}
              className="text-[#E52B28] hover:underline font-bold"
            >
              TI-563657 (Live DB Order)
            </button>
          </div>
        </div>

        {/* Results Card - Matching Screen 1 */}
        {hasSearched && !activeOrder ? (
          <div className="bg-white border border-[#DADBD2] rounded-[2px] p-12 text-center space-y-3 shadow-xs">
            <Package className="w-8 h-8 text-[#72726D] mx-auto" />
            <h3 className="text-base font-bold uppercase text-[#0A0A0A]">
              No active inquiry or order found for &ldquo;{orderNumberInput}&rdquo;
            </h3>
            <p className="text-xs text-[#72726D] max-w-sm mx-auto font-mono">
              Please verify your reference ID from your commercial confirmation email or submit a new inquiry.
            </p>
          </div>
        ) : activeOrder ? (
          <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            
            {/* Header: Reference ID and Submitted Date */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-5">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#72726D] block mb-1">
                  {isQuoteInquiry ? "INQUIRY" : "COMMERCIAL ORDER"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-mono tracking-tight text-[#0A0A0A]">
                  {activeOrder.orderNumber}
                </h2>
              </div>
              <div className="text-xs font-mono text-[#72726D]">
                Submitted {activeOrder.createdAt || "10/12/2026"}
              </div>
            </div>

            {/* 4 Clean Stages Horizontal Stepper (Screen 1 Design) */}
            <div className="py-6 sm:py-8">
              <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4 sm:px-8">
                
                {/* Horizontal Background Track Line */}
                <div className="absolute left-8 right-8 top-3.5 h-[1px] bg-slate-200 -z-0" />

                {fourStages.map((stage) => {
                  const isCurrent = currentActiveStep === stage.step;
                  const isCompleted = currentActiveStep > stage.step;
                  const isReached = isCurrent || isCompleted;

                  return (
                    <div key={stage.step} className="relative z-10 flex flex-col items-center">
                      {/* Square Badge with Number */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-mono font-bold rounded-[2px] transition-colors ${
                          isReached
                            ? "bg-[#E52B28] text-white shadow-xs"
                            : "bg-white border border-slate-300 text-slate-400"
                        }`}
                      >
                        {stage.step}
                      </div>

                      {/* Stage Label Below */}
                      <span
                        className={`mt-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-center ${
                          isReached ? "font-bold text-[#0A0A0A]" : "text-slate-400 font-medium"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ITEMS Section - Matching Screen 1 */}
            <div className="pt-4 border-t border-slate-200">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#72726D] font-bold mb-3">
                ITEMS
              </div>

              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {activeOrder.items && activeOrder.items.length > 0 ? (
                  activeOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 text-xs sm:text-sm font-mono text-[#0A0A0A] hover:bg-slate-50/50 transition-colors"
                    >
                      {item.productName}
                      {" — "}
                      <span className="font-bold">Qty {item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-3 text-xs sm:text-sm font-mono text-[#0A0A0A]">
                    Commercial Custom Apparel Production Batch — <span className="font-bold">Qty {activeOrder.subtotal ? Math.round(activeOrder.subtotal / 25) : 100}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Collapsible Logistics & Commercial Metadata */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowLogistics(!showLogistics)}
                className="text-xs font-mono uppercase text-[#72726D] hover:text-black flex items-center gap-1.5 cursor-pointer py-1"
              >
                <span>{showLogistics ? "Hide" : "View"} Commercial & Transit Metadata</span>
                {showLogistics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showLogistics && (
                <div className="mt-3 p-4 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono animate-in fade-in duration-100">
                  <div>
                    <span className="text-[#72726D] uppercase block mb-1">Procurement Client:</span>
                    <strong className="text-black">{activeOrder.customer.name}</strong>
                    <div className="text-[11px] text-[#72726D]">{activeOrder.customer.company || "Direct Label"}</div>
                  </div>
                  <div>
                    <span className="text-[#72726D] uppercase block mb-1">Dispatch Logistics:</span>
                    <strong className="text-black">{activeOrder.shippingMethod || "DDP Air Cargo"}</strong>
                    {activeOrder.trackingNumber && (
                      <div className="text-[11px] text-[#D61C24] font-bold">{activeOrder.trackingNumber}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-[#72726D] uppercase block mb-1">Destination:</span>
                    <strong className="text-black">
                      {activeOrder.customer?.shippingAddress?.city || "Austin"},{" "}
                      {activeOrder.customer?.shippingAddress?.country || "United States"}
                    </strong>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono">Loading order tracking portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
