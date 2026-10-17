"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { PRODUCTS_DATA } from "@/data/products.data";
import { quotesService } from "@/services/quotes.service";
import { Product } from "@/types";
import {
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  ShieldCheck,
  FileText,
  Sparkles,
  MessageCircle,
  Box,
  Check,
  Layers,
} from "lucide-react";

function RequestQuoteContent() {
  const searchParams = useSearchParams();
  const queryProduct = searchParams?.get("product") || "";
  const queryCategory = searchParams?.get("category") || "";
  const querySku = searchParams?.get("sku") || "";
  const queryMoq = searchParams?.get("moq") || "";
  const queryFabric = searchParams?.get("fabric") || "";

  const [category, setCategory] = useState(queryCategory || "casual-wear");
  const [productName, setProductName] = useState(queryProduct || "Custom French Terry Hoodies (450 GSM)");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [quantity, setQuantity] = useState(queryMoq ? parseInt(queryMoq) : 100);
  const [sizes, setSizes] = useState({ S: 20, M: 35, L: 35, XL: 10 });
  const [colors, setColors] = useState("Stealth Black & Stark Olive");
  const [fabric, setFabric] = useState(queryFabric || "100% Combed Loopback French Terry (450 GSM)");
  const [customizationMethods, setCustomizationMethods] = useState<string[]>([
    "Screen Print",
    "Custom Labels",
  ]);
  const [privateLabel, setPrivateLabel] = useState({
    neckLabels: true,
    careLabels: true,
    hangTags: true,
    customPackaging: true,
  });
  const [deliveryCountry, setDeliveryCountry] = useState("United States");
  const [deadline, setDeadline] = useState("Within 4 weeks");
  const [notes, setNotes] = useState(querySku ? `Product SKU: ${querySku}` : "");
  const [techPackFile, setTechPackFile] = useState<{ name: string; size: string } | null>(null);

  // Sync with searchParams & find product in catalog
  useEffect(() => {
    let matched: Product | undefined;
    if (querySku) {
      matched = PRODUCTS_DATA.find((p) => p.sku.toLowerCase() === querySku.toLowerCase());
    }
    if (!matched && queryProduct) {
      matched = PRODUCTS_DATA.find(
        (p) =>
          p.name.toLowerCase() === queryProduct.toLowerCase() ||
          queryProduct.toLowerCase().includes(p.name.toLowerCase())
      );
    }

    if (matched) {
      setSelectedProducts([matched]);
      setCategory(matched.category);
      setProductName(matched.name);
      setFabric(matched.fabric);
      if (queryMoq) {
        setQuantity(parseInt(queryMoq));
      } else {
        setQuantity(matched.MOQ);
      }
    } else {
      if (queryProduct) setProductName(queryProduct);
      if (queryCategory) setCategory(queryCategory);
      if (queryMoq) setQuantity(parseInt(queryMoq));
      if (queryFabric) setFabric(queryFabric);
    }

    if (querySku) setNotes((prev) => (prev ? `${prev} • SKU: ${querySku}` : `Product SKU: ${querySku}`));
  }, [queryProduct, queryCategory, queryMoq, queryFabric, querySku]);

  // Handle category change without clearing other category products if user wants cross-category quote
  const handleCategorySelect = (catId: string) => {
    setCategory(catId);
  };

  // Toggle multiple product selection
  const handleToggleProduct = (p: Product) => {
    const isAlreadySelected = selectedProducts.some((item) => item.id === p.id);
    let updated: Product[];

    if (isAlreadySelected) {
      updated = selectedProducts.filter((item) => item.id !== p.id);
    } else {
      updated = [...selectedProducts, p];
    }

    setSelectedProducts(updated);

    if (updated.length > 0) {
      setProductName(updated.map((item) => item.name).join(" + "));
      const combinedFabrics = Array.from(new Set(updated.map((item) => item.fabric))).join(" / ");
      setFabric(combinedFabrics);
      const totalMoq = updated.reduce((acc, item) => acc + item.MOQ, 0);
      setQuantity(totalMoq);
      const allSkus = updated.map((item) => item.sku).join(", ");
      setNotes(`Selected SKUs: ${allSkus}`);
    }
  };

  const handleRemoveSelectedProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = selectedProducts.filter((item) => item.id !== productId);
    setSelectedProducts(updated);

    if (updated.length > 0) {
      setProductName(updated.map((item) => item.name).join(" + "));
      const combinedFabrics = Array.from(new Set(updated.map((item) => item.fabric))).join(" / ");
      setFabric(combinedFabrics);
      const totalMoq = updated.reduce((acc, item) => acc + item.MOQ, 0);
      setQuantity(totalMoq);
      const allSkus = updated.map((item) => item.sku).join(", ");
      setNotes(`Selected SKUs: ${allSkus}`);
    }
  };

  const handleSelectAllCategoryProducts = () => {
    const categoryProducts = PRODUCTS_DATA.filter((p) => p.category === category);
    const existingOtherCategory = selectedProducts.filter((p) => p.category !== category);
    const combined = [...existingOtherCategory, ...categoryProducts];
    setSelectedProducts(combined);
    setProductName(combined.map((item) => item.name).join(" + "));
    const combinedFabrics = Array.from(new Set(combined.map((item) => item.fabric))).join(" / ");
    setFabric(combinedFabrics);
    setQuantity(combined.reduce((acc, item) => acc + item.MOQ, 0));
    setNotes(`Selected SKUs: ${combined.map((item) => item.sku).join(", ")}`);
  };

  const handleClearAllProducts = () => {
    setSelectedProducts([]);
    setProductName("");
    setNotes("");
  };

  // Filter products for currently selected category
  const availableProducts = PRODUCTS_DATA.filter((p) => p.category === category);

  // Contact info
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [website, setWebsite] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;
      setTechPackFile({ name: file.name, size: formattedSize });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productsSummary =
      selectedProducts.length > 0
        ? `[${selectedProducts.length} Styles: ${selectedProducts.map((p) => `${p.name} (SKU: ${p.sku})`).join("; ")}]`
        : productName;

    const res = await quotesService.submitQuote({
      customer: {
        fullName,
        companyName,
        email,
        phone,
        whatsApp,
        website,
        country: deliveryCountry,
      },
      category,
      productName: productsSummary,
      quantity,
      sizes,
      colors: [colors],
      fabric,
      customizationMethods,
      privateLabel,
      packaging: "Frosted Biodegradable Ziplock Polybag",
      deliveryCountry,
      deadline,
      notes: techPackFile ? `${notes} [Tech Pack Attached: ${techPackFile.name} (${techPackFile.size})]` : notes,
    });

    setIsSubmitting(false);
    setSubmittedQuote(res);
  };

  const toggleCustomization = (m: string) => {
    setCustomizationMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  return (
    <div className="w-full bg-[#FAFAF8] py-16 select-none min-h-[calc(100vh-72px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white border border-[#DADBD2] px-3 py-1 rounded-[2px]">
            <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
            <span className="eyebrow-label text-[#D61C24]">
              MULTI-DISCIPLINE RFQ PROTOCOL
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
            Request an Official Factory Quotation
          </h1>
          <p className="text-xs sm:text-sm text-[#72726D] max-w-lg mx-auto">
            Select one or multiple garment silhouettes for your private label collection. Our Sialkot engineering team will return an itemized pricing sheet and sampling schedule within 24 hours.
          </p>
        </div>

        {submittedQuote ? (
          /* Success Response State (Section 39) */
          <div className="bg-white border border-[#DADBD2] rounded-[2px] p-8 sm:p-12 text-center space-y-6 shadow-md animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-[#F4F4EF] rounded-full flex items-center justify-center mx-auto text-[#D61C24]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#D61C24] bg-[#F4F4EF] border border-[#DADBD2] px-3 py-1 rounded-[2px]">
                REFERENCE: {submittedQuote.referenceNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase text-[#0A0A0A] font-display">
                Specification Successfully Transmitted
              </h2>
              <p className="text-xs sm:text-sm text-[#72726D] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-black">{fullName || "Client"}</strong>. Your multi-product RFQ has been routed directly to our lead pattern engineer. A formal itemized PDF quotation has been queued for{" "}
                <strong className="text-black">{email || "your work email"}</strong>.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] max-w-md mx-auto text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-[#72726D]">Discipline:</span>
                <span className="font-bold text-black uppercase">{submittedQuote.category}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[#72726D] shrink-0">Selected Styles:</span>
                <span className="font-bold text-black text-right">{submittedQuote.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72726D]">Total Batch Volume:</span>
                <span className="font-bold text-[#D61C24]">{submittedQuote.quantity} Pieces</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72726D]">Destination:</span>
                <span className="font-bold text-black">{submittedQuote.deliveryCountry}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#DADBD2]">
                <span className="text-[#72726D]">Status:</span>
                <span className="text-[#D61C24] font-bold">Under Technical Evaluation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/catalog"
                className="px-6 py-3 bg-[#0A0A0A] text-white text-xs font-mono uppercase font-bold rounded-[2px] hover:bg-[#D61C24] transition-colors"
              >
                Return to Product Catalog
              </Link>
              <Link
                href="/track-order"
                className="px-6 py-3 bg-[#F4F4EF] border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold rounded-[2px] hover:bg-[#DADBD2] transition-colors"
              >
                Track Production Status
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Wizard Form */
          <form onSubmit={handleSubmit} className="bg-white border border-[#DADBD2] rounded-[2px] p-6 sm:p-10 shadow-sm space-y-8">
            
            {/* Step 1: Select Category */}
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Select Apparel Discipline:</span>
                </div>
                <span className="text-[11px] font-mono text-[#D61C24] font-semibold">
                  {CATEGORIES_DATA.find((cat) => cat.id === category)?.name || "Selected Category"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORIES_DATA.map((c) => {
                  const isSelected = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCategorySelect(c.id)}
                      className={`group relative p-2.5 rounded-[2px] border text-left flex items-center gap-2.5 transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-sm ring-2 ring-[#D61C24]/40"
                          : "bg-[#F4F4EF] text-[#72726D] border-[#DADBD2] hover:border-[#0A0A0A] hover:bg-white"
                      }`}
                    >
                      {/* Category Thumbnail Image */}
                      <div className="w-10 h-10 rounded-[2px] overflow-hidden bg-white/10 shrink-0 border border-black/10 flex items-center justify-center">
                        <img
                          src={c.heroImage}
                          alt={c.name}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-mono text-[#D61C24] font-bold tracking-wider">
                          {c.number}
                        </div>
                        <div
                          className={`text-xs font-mono font-bold truncate ${
                            isSelected ? "text-white" : "text-[#0A0A0A]"
                          }`}
                        >
                          {c.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Multi-Select Product Specimen Gallery */}
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Select Garment Silhouettes (Multiple Select Enabled):</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllCategoryProducts}
                    className="text-[10px] font-mono uppercase text-[#0A0A0A] hover:text-[#D61C24] font-bold underline cursor-pointer"
                  >
                    Select All in Category
                  </button>
                  {selectedProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllProducts}
                      className="text-[10px] font-mono uppercase text-[#72726D] hover:text-[#D61C24] cursor-pointer"
                    >
                      Clear ({selectedProducts.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              {availableProducts.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {availableProducts.map((p) => {
                    const isSelected = selectedProducts.some((item) => item.id === p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleProduct(p)}
                        className={`group relative p-2.5 rounded-[2px] border transition-all cursor-pointer flex flex-col justify-between select-none ${
                          isSelected
                            ? "bg-white border-[#D61C24] ring-2 ring-[#D61C24]/40 shadow-md scale-[1.01]"
                            : "bg-[#F4F4EF] border-[#DADBD2] hover:border-[#0A0A0A] hover:bg-white"
                        }`}
                      >
                        {/* Checkbox / Selected Badge */}
                        <div className="absolute top-2 right-2 z-10">
                          <div
                            className={`w-5 h-5 rounded-[2px] flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#D61C24] text-white shadow-xs"
                                : "bg-white/80 border border-[#DADBD2] group-hover:border-black"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <span className="text-[11px] text-[#72726D] font-mono font-bold">+</span>
                            )}
                          </div>
                        </div>

                        {/* Garment Thumbnail */}
                        <div className="relative aspect-square w-full bg-white rounded-[2px] p-2 flex items-center justify-center overflow-hidden mb-2 border border-[#DADBD2]">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className={`w-full h-full object-contain filter drop-shadow-xs transition-transform duration-300 ${
                              isSelected ? "scale-105" : "group-hover:scale-105"
                            }`}
                          />
                        </div>

                        <div className="space-y-0.5">
                          <div className="text-[9px] font-mono text-[#D61C24] font-bold tracking-wider">
                            SKU: {p.sku}
                          </div>
                          <div className="text-[11px] font-mono font-bold text-[#0A0A0A] line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[10px] font-mono text-[#72726D]">
                            MOQ: {p.MOQ} PCS
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Multi-Selected Product Specimen Ribbon */}
              {selectedProducts.length > 0 && (
                <div className="bg-[#F4F4EF] border-2 border-[#0A0A0A] rounded-[2px] p-4 space-y-3 mb-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DADBD2] pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#D61C24] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded-[1px] font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {selectedProducts.length} STYLES IN COMBINED BATCH
                      </span>
                      <span className="text-[11px] font-mono text-[#72726D]">
                        Combined MOQ: <strong className="text-[#0A0A0A]">{quantity} PCS</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearAllProducts}
                      className="text-[10px] font-mono uppercase text-[#D61C24] hover:underline font-bold cursor-pointer self-end sm:self-auto"
                    >
                      Clear Selection
                    </button>
                  </div>

                  {/* Horizontal Scroll of Selected Garments */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {selectedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-[#DADBD2] rounded-[2px] p-2 flex items-center gap-2.5 shrink-0 shadow-2xs group relative"
                      >
                        <div className="w-10 h-10 bg-[#F4F4EF] rounded-[2px] p-1 shrink-0 flex items-center justify-center">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                        </div>

                        <div className="min-w-0 pr-6">
                          <div className="text-[9px] font-mono text-[#D61C24] font-bold">
                            {p.sku}
                          </div>
                          <div className="text-xs font-mono font-bold text-[#0A0A0A] truncate max-w-[140px]">
                            {p.name}
                          </div>
                          <div className="text-[9px] font-mono text-[#72726D]">
                            MOQ: {p.MOQ} PCS
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleRemoveSelectedProduct(p.id, e)}
                          className="absolute top-1.5 right-1.5 p-0.5 text-[#72726D] hover:text-[#D61C24] rounded-full cursor-pointer"
                          title="Remove from batch"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Garment Style & Batch Quantity Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-1.5">
                    Garment Styles / Description:
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    placeholder="e.g. 450 GSM Loopback Hoodie + Aero Cycling Jersey"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-1.5">
                    Total Estimated Batch Quantity (Pieces):
                  </label>
                  <input
                    type="number"
                    min="20"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Fabric & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-1.5">
                  Desired Fabric / GSM:
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. 100% Combed Cotton 450 GSM or Italian Softshell"
                  className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-1.5">
                  Colorway Requirements:
                </label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="e.g. Pantone 417 C Olive & Jet Black"
                  className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            {/* Step 4: Customization Methods */}
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2">
                Customization & Embellishment Methods:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  "Screen Print",
                  "Sublimation",
                  "Tajima Foam Embroidery",
                  "High-Loft Puff Print",
                  "Laser Tackle Twill",
                  "DTF Transfer",
                  "Custom Labels",
                  "Custom Packaging",
                ].map((m) => {
                  const isChecked = customizationMethods.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleCustomization(m)}
                      className={`p-2 rounded-[2px] border text-left text-xs font-mono transition-colors ${
                        isChecked
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A] font-bold"
                          : "bg-[#F4F4EF] text-[#72726D] border-[#DADBD2] hover:border-black"
                      }`}
                    >
                      {isChecked ? "✓ " : ""}{m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Destination & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-1.5">
                  Delivery Destination Country:
                </label>
                <input
                  type="text"
                  value={deliveryCountry}
                  onChange={(e) => setDeliveryCountry(e.target.value)}
                  required
                  placeholder="e.g. United States, United Kingdom, Germany"
                  className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-1.5">
                  Target Production Deadline:
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. Delivery needed by Nov 15th"
                  className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            {/* Step 6: Contact Information */}
            <div className="border-t border-[#DADBD2] pt-6 space-y-4">
              <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A]">
                Brand Contact & Procurement Details:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Marcus Vance"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Brand / Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Vance Atelier LLC"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="procurement@brand.com"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full bg-[#F4F4EF] border border-[#DADBD2] px-3 py-2 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Step 7: Attach Tech Pack / Artwork PDF */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1 flex items-center justify-between">
                <span>Upload Factory Tech Pack, Vector Art, or Spec Sheet (Optional)</span>
                <span className="text-[10px] text-[#72726D]">PDF, AI, EPS, SVG, PNG, JPG (Max 50MB)</span>
              </label>

              {techPackFile ? (
                <div className="bg-white border-2 border-[#D61C24] rounded-[2px] p-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-[#D61C24]/10 rounded-[2px] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#D61C24]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-bold text-[#0A0A0A] truncate">
                        {techPackFile.name}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-semibold">
                        ✓ Tech Spec Attached • {techPackFile.size}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTechPackFile(null)}
                    className="px-2.5 py-1 text-[11px] font-mono uppercase text-[#D61C24] hover:bg-[#D61C24]/10 rounded-[2px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#DADBD2] hover:border-[#D61C24] bg-[#F4F4EF] rounded-[2px] p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <UploadCloud className="w-6 h-6 text-[#D61C24] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A]">
                    Click or Drag & Drop to Attach Tech Pack / Spec PDF
                  </div>
                  <div className="text-[10px] text-[#72726D] font-mono mt-0.5">
                    Engineering will review your artwork and vector cut lines directly.
                  </div>
                </label>
              )}
            </div>

            {/* Step 8: Notes */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#72726D] mb-1">
                Additional Technical Specifications or Sourcing Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include garment tolerances, pantone numbers, target unit price, or custom label packaging details..."
                className="w-full bg-[#F4F4EF] border border-[#DADBD2] p-3 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#DADBD2]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Transmitting Technical Spec...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-[#FF333D]" />
                    <span>Submit Specification for Official Factory Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] py-20 text-center font-mono text-xs">Loading RFQ Form...</div>}>
      <RequestQuoteContent />
    </Suspense>
  );
}
