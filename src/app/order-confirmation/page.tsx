"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Mail, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "TI-849201";

  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("tawfiq-industry-last-order");
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    }
  }, []);

  return (
    <div className="w-full bg-[#FAFAF8] py-16 select-none min-h-[calc(100vh-72px)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Success Container */}
        <div className="bg-white border border-[#DADBD2] rounded-[2px] p-8 sm:p-12 text-center space-y-8 shadow-sm animate-in fade-in zoom-in-95">
          
          {/* Animated Success Badge */}
          <div className="w-16 h-16 bg-[#F4F4EF] rounded-full flex items-center justify-center mx-auto text-[#D61C24]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#D61C24] bg-[#F4F4EF] border border-[#DADBD2] px-3 py-1 rounded-[2px]">
              ORDER REFERENCE: {orderNumber}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Commercial Order Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-[#72726D] max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-black">{orderData?.customerName || "Client"}</strong>. Your apparel manufacturing order has been scheduled on the Sialkot facility production board.
            </p>
          </div>

          {/* Simulated Notifications Scheduled Alert (Section 46 & 47) */}
          <div className="bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-4 max-w-md mx-auto text-left text-xs font-mono space-y-2">
            <div className="text-[10px] uppercase font-bold text-[#72726D] mb-1">
              Automated Dispatch Notifications Scheduled:
            </div>
            <div className="flex items-center gap-2 text-emerald-800">
              <Mail className="w-3.5 h-3.5" />
              <span>✓ Confirmation & Proforma PDF scheduled to {orderData?.email || "buyer@fashionbrand.com"}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>✓ Milestone alerts active on WhatsApp ({orderData?.phone || "+1 212 555 0192"})</span>
            </div>
          </div>

          {/* Order Details Matrix */}
          <div className="border border-[#DADBD2] rounded-[2px] p-4 max-w-md mx-auto text-left text-xs font-mono space-y-2">
            <div className="flex justify-between border-b border-[#F4F4EF] pb-1.5">
              <span className="text-[#72726D]">Total Amount:</span>
              <span className="font-bold text-black">${orderData?.amount ? orderData.amount.toFixed(2) : "6,605.00"}</span>
            </div>
            <div className="flex justify-between border-b border-[#F4F4EF] pb-1.5">
              <span className="text-[#72726D]">Production Status:</span>
              <span className="text-[#D61C24] font-bold">Stage 01: Spec Approved</span>
            </div>
            <div className="flex justify-between border-b border-[#F4F4EF] pb-1.5">
              <span className="text-[#72726D]">Estimated Dispatch:</span>
              <span className="text-black font-semibold">In 14–18 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#72726D]">Shipping Incoterm:</span>
              <span className="text-black">DDP (Delivered Duty Paid)</span>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track-order`}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2"
            >
              <span>Track Live Production Stages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/catalog"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#F4F4EF] hover:bg-[#DADBD2] border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
            >
              Return to Catalog
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono">Loading confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
