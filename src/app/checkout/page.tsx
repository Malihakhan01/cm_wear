"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { PaymentMethod } from "@/types";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  DollarSign,
  FileText,
  Lock,
  ArrowRight,
  Info,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { mode } = useStoreModeStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");

  // Contact & shipping state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [phone, setPhone] = useState("");
  const [whatsAppUpdates, setWhatsAppUpdates] = useState(true);

  // Sync client details from customizer only if explicitly entered earlier in popup or save form
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const popupSubmitted = sessionStorage.getItem("user_popup_submitted") === "true";
      if (popupSubmitted) {
        const savedEmail = sessionStorage.getItem("user_popup_submitted_email");
        const savedName = sessionStorage.getItem("user_popup_submitted_name");
        const savedCompany = sessionStorage.getItem("user_popup_submitted_company");
        const savedPhone = sessionStorage.getItem("user_popup_submitted_phone");

        if (savedEmail) setEmail(savedEmail);
        if (savedName) {
          const parts = savedName.trim().split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
        }
        if (savedCompany) setCompany(savedCompany);
        if (savedPhone) setPhone(savedPhone);
      }
    }
  }, []);

  // Simulated card inputs
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const shippingCost = items.length > 0 ? (mode === "wholesale" ? 180 : 25) : 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Save contact to localStorage for two-way customizer persistence
    if (typeof window !== "undefined") {
      if (email) localStorage.setItem("tawfiq_customizer_client_email", email);
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) localStorage.setItem("tawfiq_customizer_client_name", fullName);
      if (company) localStorage.setItem("tawfiq_customizer_client_company", company);
      if (phone) localStorage.setItem("tawfiq_customizer_client_phone", phone);
    }

    const initialOrderRef = `TI-${Math.floor(100000 + Math.random() * 900000)}`;
    let confirmedOrderRef = initialOrderRef;

    // Forward order to Laravel backend
    try {
      const { apiClient } = await import("@/services/api.client");
      const res = await apiClient.post<{
        success: boolean;
        data?: { order_number: string };
      }>("/orders", {
        order_number: initialOrderRef,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        email,
        company,
        phone,
        street,
        city,
        state,
        postal_code: postalCode,
        country,
        order_type: mode === "wholesale" ? "bulk_commercial" : "retail",
        incoterm: mode === "wholesale" ? "FOB" : "DDP",
        payment_method: paymentMethod,
        subtotal,
        shipping_cost: shippingCost,
        total_amount: total,
        notes: `Direct web order #${initialOrderRef} with ${items.length} product lines`,
        items: items.map((i) => ({
          name: i.productName,
          sku: i.sku,
          quantity: i.quantity,
          price: i.unitPrice,
          color: i.color.name,
          sizeBreakdown: i.sizeBreakdown,
          isCustomized: i.isCustomized,
          customSummary: i.customSummary,
          fabric: i.fabric,
          gsm: i.gsm,
          customDesignId: i.customDesignId,
          tech_pack_code: i.techPackCode,
        })),
      });

      if (res?.success && res.data?.order_number) {
        confirmedOrderRef = res.data.order_number;
      }
    } catch (err) {
      console.warn("Backend order sync fallback:", err);
    }

    const orderSummary = {
      orderNumber: confirmedOrderRef,
      amount: total,
      itemsCount: items.length,
      customerName: `${firstName} ${lastName}`.trim() || "Valued Client",
      email,
      phone,
      country,
      paymentMethod,
      date: new Date().toLocaleDateString(),
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("tawfiq-industry-last-order", JSON.stringify(orderSummary));
    }

    clearCart();
    setIsProcessing(false);
    router.push(`/order-confirmation?order=${confirmedOrderRef}`);
  };

  return (
    <div className="w-full bg-[#FAFAF8] py-16 select-none min-h-[calc(100vh-72px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#72726D] mb-6">
          <Link href="/cart" className="hover:text-black">Shopping Bag</Link>
          <span>/</span>
          <span className="text-black font-bold">Secure Demo Checkout</span>
        </div>

        {/* Demo Notice Banner (Section 44) */}
        <div className="mb-8 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-[2px] text-xs font-mono flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-700" />
          <span>
            <strong>PROTOTYPE CHECKOUT NOTICE:</strong> This is a frontend demonstration connected to mock payment adapters. No real transactions or card charges will occur.
          </span>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Information & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Contact Information */}
            <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase font-bold text-[#0A0A0A] flex items-center justify-between">
                <span>1. Customer & Notification Details</span>
                <span className="text-[10px] text-[#D61C24]">Step 01/03</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Procurement Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. buyer@fashionbrand.com"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="e.g. +1 212 555 0192"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Company / Label Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Vance Atelier Corp (optional)"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="waUpdates"
                    checked={whatsAppUpdates}
                    onChange={(e) => setWhatsAppUpdates(e.target.checked)}
                    className="rounded-[2px] border-[#DADBD2]"
                  />
                  <label htmlFor="waUpdates" className="text-xs font-mono text-[#72726D] cursor-pointer">
                    Receive milestone production alerts on WhatsApp (Lab-dip, QC, DHL Flight Dispatch)
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase font-bold text-[#0A0A0A] flex items-center justify-between">
                <span>2. Commercial Shipping Address</span>
                <span className="text-[10px] text-[#D61C24]">Step 02/03</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="e.g. Marcus"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="e.g. Vance"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Street Address & Suite / Unit *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    placeholder="e.g. 482 Broadway, Suite 400"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. New York"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                      State / Prov *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      placeholder="e.g. NY"
                      className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      placeholder="e.g. 10013"
                      className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="e.g. United States"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Architecture (Section 45) */}
            <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 space-y-4">
              <h2 className="text-sm font-mono uppercase font-bold text-[#0A0A0A] flex items-center justify-between">
                <span>3. Payment Method Architecture</span>
                <span className="text-[10px] text-[#D61C24]">Step 03/03</span>
              </h2>

              {/* Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "credit_card" as PaymentMethod, label: "Credit Card", icon: CreditCard },
                  { id: "bank_transfer" as PaymentMethod, label: "Bank Wire (T/T)", icon: Building2 },
                  { id: "wise" as PaymentMethod, label: "Wise Business", icon: DollarSign },
                  { id: "manual_invoice" as PaymentMethod, label: "Proforma Invoice", icon: FileText },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 rounded-[2px] border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                          : "bg-[#F4F4EF] text-[#72726D] border-[#DADBD2] hover:border-black"
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-2 text-[#D61C24]" />
                      <span className="text-[11px] font-mono uppercase font-bold">
                        {pm.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Method Card Subforms */}
              <div className="pt-4 border-t border-[#F4F4EF]">
                {paymentMethod === "credit_card" && (
                  <div className="space-y-3 p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#72726D]">
                      <span>Card Details (Mock Processor)</span>
                      <Lock className="w-3.5 h-3.5 text-[#D61C24]" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-white border border-[#DADBD2] px-3 py-2 text-xs font-mono rounded-[2px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full bg-white border border-[#DADBD2] px-3 py-2 text-xs font-mono rounded-[2px]"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full bg-white border border-[#DADBD2] px-3 py-2 text-xs font-mono rounded-[2px]"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className="p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2] text-xs font-mono space-y-1.5">
                    <div className="font-bold uppercase text-black">Commercial Bank Wire Details (Sialkot Facility):</div>
                    <div className="text-[#72726D]">Beneficiary: TAWFIQ INDUSTRY Apparel Manufacturing Ltd.</div>
                    <div className="text-[#72726D]">Bank: Standard Chartered Bank (Pakistan)</div>
                    <div className="text-[#72726D]">IBAN: PK36SCBL0000001284920194</div>
                    <div className="text-[#72726D]">SWIFT / BIC: SCBLPKKHIXXX</div>
                    <div className="text-[10px] text-[#D61C24] pt-1">Proforma invoice with full instructions generated upon submission.</div>
                  </div>
                )}

                {paymentMethod === "wise" && (
                  <div className="p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2] text-xs font-mono space-y-1.5">
                    <div className="font-bold uppercase text-black">Wise Business Multi-Currency Transfer:</div>
                    <div className="text-[#72726D]">Supported currencies: USD, EUR, GBP, AUD, CAD</div>
                    <div className="text-[#72726D]">Zero international markup on foreign exchange rates.</div>
                  </div>
                )}

                {paymentMethod === "manual_invoice" && (
                  <div className="p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2] text-xs font-mono space-y-1.5">
                    <div className="font-bold uppercase text-black">Official Commercial Proforma Invoice:</div>
                    <div className="text-[#72726D]">An itemized PDF invoice will be issued for corporate accounting approval prior to payment release.</div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#DADBD2] rounded-[2px] p-6 space-y-6 sticky top-24 shadow-xs">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#DADBD2]">
                <h3 className="text-sm font-mono uppercase font-bold text-[#0A0A0A]">
                  Order Summary ({items.length} Line Items)
                </h3>
                <span className="text-xs font-mono uppercase text-[#D61C24] font-bold">
                  {mode.toUpperCase()}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-[#72726D]">
                    No items in bag.{" "}
                    <Link href="/catalog" className="text-black underline font-bold">
                      Add products first
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs font-mono">
                      <div className="w-12 h-12 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#0A0A0A] truncate uppercase">
                          {item.productName}
                        </div>
                        <div className="text-[10px] text-[#72726D]">
                          Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ""}
                        </div>
                        {item.sizeBreakdown && (
                          <div className="text-[9px] text-[#D61C24]">
                            Breakdown: {Object.entries(item.sizeBreakdown).map(([s, q]) => `${s}:${q}`).join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0 font-bold">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Price Calculation Matrix */}
              <div className="pt-4 border-t border-[#DADBD2] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#72726D]">
                  <span>Subtotal:</span>
                  <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#72726D]">
                  <span>Estimated Air Cargo Freight:</span>
                  <span className="font-bold text-black">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#72726D]">
                  <span>Export Tariffs & Documentation:</span>
                  <span className="text-emerald-700 font-bold">Included (DDP)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DADBD2] text-sm font-bold text-black">
                  <span>Total Payable:</span>
                  <span className="text-base font-mono text-[#0A0A0A]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Action */}
              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full py-4 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-[#DADBD2] disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span>Authorizing Simulated Order...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#FF333D]" />
                    <span>Complete Demo Order (${total.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[10px] font-mono text-[#72726D] text-center">
                Encrypted 256-Bit SSL Mock Gateway • ISO 9001 Sialkot Facility
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
