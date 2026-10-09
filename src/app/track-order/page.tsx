"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trackingService } from "@/services/tracking.service";
import { Order } from "@/types";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Plane, ShieldCheck, ArrowRight } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumberInput, setOrderNumberInput] = useState("SF-849201");
  const [emailInput, setEmailInput] = useState("procurement@vanceatelier.com");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto load demo order on mount
  React.useEffect(() => {
    trackingService.trackOrder("SF-849201").then((ord) => {
      setActiveOrder(ord);
      setHasSearched(true);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) return;

    setIsSearching(true);
    const result = await trackingService.trackOrder(orderNumberInput);
    setActiveOrder(result);
    setIsSearching(false);
    setHasSearched(true);
  };

  const progressPercent = activeOrder
    ? Math.round(
        ((activeOrder.currentStageIndex + 1) / (activeOrder.stages.length || 10)) * 100
      )
    : 0;

  return (
    <div className="w-full bg-[#FAFAF8] py-16 select-none min-h-[calc(100vh-72px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="border-b border-[#DADBD2] pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#72726D] mb-2 font-mono">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-black font-bold">Live Production & Shipment Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] uppercase font-display">
            Track Order & Milling Status
          </h1>
          <p className="text-xs sm:text-sm text-[#72726D] mt-2 max-w-xl">
            Real-time milestone reporting from raw yarn milling in Sialkot through CNC cutting, Tajima embroidery, needle scanning, and international courier transit.
          </p>
        </div>

        {/* Search Query Form */}
        <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 mb-8 shadow-xs">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-mono uppercase text-[#72726D] font-bold mb-1">
                Order Tracking ID (e.g. SF-849201):
              </label>
              <input
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="SF-849201"
                className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3.5 py-2.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                required
              />
            </div>

            <div className="md:col-span-5">
              <label className="block text-[11px] font-mono uppercase text-[#72726D] font-bold mb-1">
                Client Procurement Email:
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="buyer@fashionbrand.com"
                className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3.5 py-2.5 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? "Querying..." : "Locate"}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="mt-3 pt-3 border-t border-[#F4F4EF] flex items-center gap-2 text-[11px] font-mono text-[#72726D]">
            <span>Try Demo Order IDs:</span>
            <button
              onClick={() => {
                setOrderNumberInput("SF-849201");
                trackingService.trackOrder("SF-849201").then(setActiveOrder);
              }}
              className="text-[#D61C24] hover:underline font-bold"
            >
              SF-849201 (QC Active)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setOrderNumberInput("SF-302194");
                trackingService.trackOrder("SF-302194").then(setActiveOrder);
              }}
              className="text-[#D61C24] hover:underline font-bold"
            >
              SF-302194 (Yarn Lab-Dip)
            </button>
          </div>
        </div>

        {/* Search Results Display */}
        {hasSearched && !activeOrder ? (
          <div className="bg-white border border-[#DADBD2] rounded-[2px] p-12 text-center space-y-3">
            <Package className="w-8 h-8 text-[#72726D] mx-auto" />
            <h3 className="text-base font-bold uppercase text-[#0A0A0A]">
              No active shipment found for &ldquo;{orderNumberInput}&rdquo;
            </h3>
            <p className="text-xs text-[#72726D] max-w-sm mx-auto">
              Please double check your Order ID from your commercial invoice, or submit a new quotation request.
            </p>
          </div>
        ) : activeOrder ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Order Overview Card */}
            <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DADBD2] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D61C24] animate-pulse" />
                    <span className="text-xs font-mono font-bold text-[#D61C24] uppercase">
                      ACTIVE PRODUCTION BATCH
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold uppercase text-[#0A0A0A] font-display mt-1">
                    Order Ref: {activeOrder.orderNumber}
                  </h2>
                  <div className="text-xs font-mono text-[#72726D] mt-0.5">
                    Client: {activeOrder.customer.name} ({activeOrder.customer.company || "Direct Label"})
                  </div>
                </div>

                <div className="sm:text-right space-y-1">
                  <div className="text-xs font-mono text-[#72726D] uppercase">
                    Status: <strong className="text-[#0A0A0A]">{activeOrder.status}</strong>
                  </div>
                  <div className="text-xs font-mono text-[#D61C24] font-bold">
                    Est. Dispatch: {activeOrder.estimatedDispatch}
                  </div>
                  {activeOrder.trackingNumber && (
                    <div className="text-[11px] font-mono text-[#72726D]">
                      AWB: <span className="font-bold text-black">{activeOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Percentage Bar */}
              <div className="pt-6">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase mb-2">
                  <span className="text-[#0A0A0A]">
                    Stage {activeOrder.currentStageIndex + 1} of {activeOrder.stages.length}
                  </span>
                  <span className="text-[#D61C24]">{progressPercent}% Completed</span>
                </div>
                <div className="w-full h-2 bg-[#F4F4EF] rounded-full overflow-hidden border border-[#DADBD2]">
                  <div
                    className="h-full bg-[#0A0A0A] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 10-Stage Milestone Timeline (Section 48) */}
            <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-mono uppercase font-bold text-[#0A0A0A] mb-6 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D61C24]" />
                <span>Manufacturing Protocol Stages (AQL 2.5)</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DADBD2]">
                {activeOrder.stages.map((st, idx) => {
                  const isCompleted = idx < activeOrder.currentStageIndex;
                  const isCurrent = idx === activeOrder.currentStageIndex;

                  return (
                    <div key={st.id} className="relative flex items-start gap-4">
                      {/* Milestone Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                          isCompleted
                            ? "bg-[#0A0A0A] border-[#0A0A0A] text-white"
                            : isCurrent
                            ? "bg-[#D61C24] border-[#D61C24] text-white animate-pulse"
                            : "bg-white border-[#DADBD2] text-[#72726D]"
                        }`}
                      >
                        {isCompleted ? "✓" : idx + 1}
                      </div>

                      {/* Content */}
                      <div
                        className={`p-4 rounded-[2px] border w-full transition-all ${
                          isCurrent
                            ? "bg-[#F4F4EF] border-[#D61C24] shadow-xs"
                            : "bg-white border-[#DADBD2]"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h4 className="text-xs font-bold uppercase font-display text-[#0A0A0A]">
                            {st.name}
                          </h4>
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-[1px] w-fit ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-800"
                                : isCurrent
                                ? "bg-[#D61C24] text-white"
                                : "bg-[#F4F4EF] text-[#72726D]"
                            }`}
                          >
                            {isCompleted ? "COMPLETED" : isCurrent ? "IN PROGRESS" : "QUEUED"}
                          </span>
                        </div>
                        <p className="text-xs text-[#72726D] font-sans">
                          {st.description}
                        </p>
                        {st.location && (
                          <div className="text-[10px] font-mono text-[#D61C24] mt-2 flex items-center gap-1 font-semibold">
                            <MapPin className="w-3 h-3" />
                            <span>Location: {st.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination & Logistics Details */}
            <div className="bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
              <div>
                <span className="text-[#72726D] uppercase block mb-1">Shipping Method:</span>
                <strong className="text-black">{activeOrder.shippingMethod}</strong>
              </div>
              <div>
                <span className="text-[#72726D] uppercase block mb-1">Delivery Destination:</span>
                <strong className="text-black">
                  {activeOrder.customer.shippingAddress.city}, {activeOrder.customer.shippingAddress.country}
                </strong>
              </div>
              <div>
                <span className="text-[#72726D] uppercase block mb-1">Commercial Term:</span>
                <strong className="text-[#D61C24]">Delivered Duty Paid (DDP) Air Corridor</strong>
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
