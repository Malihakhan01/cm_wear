"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS_DATA } from "@/data/products.data";
import { productsService, getProductDemoImage } from "@/services/products.service";
import { useStoreModeStore } from "@/stores/useStoreModeStore";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { MOQConfigurator } from "@/components/wholesale/MOQConfigurator";
import { WhatsAppInquiryButton } from "@/components/common/WhatsAppInquiryButton";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Product, CustomizerState } from "@/types";
import {
  ShoppingBag,
  FileText,
  Heart,
  Sparkles,
  Box,
  Truck,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Check,
  ArrowRight,
  Download,
} from "lucide-react";

interface ProductDetailClientProps {
  initialSlug?: string;
}

export default function ProductDetailPage({ initialSlug }: ProductDetailClientProps = {}) {
  const params = useParams();
  const rawParamSlug = (params?.slug as string) || initialSlug || "";

  const getEffectiveSlug = () => {
    if (initialSlug && initialSlug !== "overview") {
      return decodeURIComponent(initialSlug);
    }
    if (rawParamSlug && rawParamSlug !== "overview") {
      return decodeURIComponent(rawParamSlug);
    }
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== "products" && last !== "overview") {
        return decodeURIComponent(last);
      }
    }
    return rawParamSlug || initialSlug || "";
  };

  const [slug, setSlug] = useState<string>(getEffectiveSlug);
  const [product, setProduct] = useState<Product | null>(
    () => PRODUCTS_DATA.find((p) => p.slug === slug) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentSlug = getEffectiveSlug();
    setSlug(currentSlug);

    if (currentSlug && currentSlug !== "overview") {
      setLoading(true);
      productsService.getBySlug(currentSlug).then((p) => {
        if (p) setProduct(p);
        setLoading(false);
      });
    } else {
      productsService.getAll().then((all) => {
        if (all && all.length > 0) {
          setProduct(all[0]);
        }
        setLoading(false);
      });
    }
  }, [rawParamSlug, initialSlug]);

  const { mode, toggleMode } = useStoreModeStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<any>(product?.colors?.[0] || { id: "c-black", name: "Black", hex: "#0A0A0A" });
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "L");
  const [retailQuantity, setRetailQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      if (product.colors?.[0]) setSelectedColor(product.colors[0]);
      if (product.sizes?.[0]) setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Accordion state for technical specifications
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    fabric: true,
    customization: false,
    moq: false,
    shipping: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="w-10 h-10 border-2 border-[#D61C24] border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-xs uppercase font-bold tracking-wider text-[#0A0A0A]">
          Loading Garment Spec...
        </div>
        <div className="text-[10px] text-[#72726D] mt-1">
          Export Tech Pack &amp; Silhouette Dimensions
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#F4F4EF] border border-[#DADBD2] flex items-center justify-center mb-4">
          <Box className="w-8 h-8 text-[#D61C24]" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#D61C24] font-bold mb-1">
          Apparel Archive
        </span>
        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-2 font-display">
          Product Silhouette Unavailable
        </h2>
        <p className="text-xs text-[#72726D] max-w-md mb-6 font-mono leading-relaxed">
          The requested garment specification or style identifier is currently being updated in our export catalog.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/catalog/"
            className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
          >
            Browse Apparel Catalog
          </Link>
          <Link
            href="/request-quote"
            className="px-5 py-2.5 bg-[#F4F4EF] hover:bg-[#DADBD2] border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
          >
            Custom Tech Pack Quote
          </Link>
        </div>
      </div>
    );
  }

  const demoImage = getProductDemoImage(product.category, product.name, product.subcategory);
  const mainDisplayImage = product.images?.[activeImageIndex] || product.images?.[0] || demoImage;

  const handleRetailAddToCart = () => {
    addItem({
      id: `${product.id}_retail_${Date.now()}`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      image: product.images[0],
      mode: "retail",
      unitPrice: product.retailPrice,
      quantity: retailQuantity,
      color: selectedColor,
      size: selectedSize,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1500);
  };

  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const techPackState: CustomizerState = {
    productId: product.id,
    view: "front",
    activeGarmentPart: "body",
    partColors: {
      body: selectedColor.hex,
      sleeves: "#FFFFFF",
      trim: "#D61C24",
      hood: selectedColor.hex,
      pocket: selectedColor.hex,
      cuffs: "#0A0A0A",
      waistband: "#0A0A0A",
      collar: "#0A0A0A",
      jerseyBody: selectedColor.hex,
      sidePanels: "#FFFFFF",
      shortsBody: selectedColor.hex,
      shortsSidePanels: "#FFFFFF",
      shortsWaistband: "#0A0A0A",
      jacketBody: selectedColor.hex,
      lapels: "#0A0A0A",
      pocketFlaps: "#0A0A0A",
      buttons: "#D4AF37",
    },
    fabricId: product.fabric || "premium-cotton",
    gsm: product.GSM || 420,
    decorationMethodId: product.decorationMethods[0] || "screen-print",
    trims: {
      labels: "Custom Damask Woven",
      zipper: "YKK Antique Brass",
    },
    artworkLayers: [],
    textLayers: [],
    quantity: product.MOQ || 50,
    sizeBreakdown: { S: 10, M: 20, L: 15, XL: 5 },
  };

  return (
    <div className="w-full bg-white select-none">

      {/* Breadcrumbs Toolbar */}
      <div className="border-b border-[#DADBD2] bg-[#F4F4EF] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#72726D]">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href={`/${product.category}`} className="hover:text-black">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-black font-bold truncate max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={toggleMode}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DADBD2] text-[11px] font-mono uppercase font-bold rounded-[2px] cursor-pointer"
          >
            <span className="text-[#72726D]">MODE:</span>
            <span className={mode === "wholesale" ? "text-[#D61C24]" : "text-black"}>
              {mode.toUpperCase()}
            </span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Gallery & Model (7 cols) */}
          <div className="lg:col-span-7 space-y-4">

            {/* Main Stage Image */}
            <div className="relative aspect-square bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-8 flex items-center justify-center overflow-hidden group">
              <img
                src={mainDisplayImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== demoImage && !target.src.endsWith(demoImage)) {
                    target.src = demoImage;
                  }
                }}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                {product.customizable && (
                  <span className="bg-[#0A0A0A] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded-[1px] flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3 text-[#FF333D]" />
                    CUSTOMIZABLE
                  </span>
                )}
                {product.threeDModel && (
                  <span className="bg-[#D61C24] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded-[1px] flex items-center gap-1 font-bold">
                    <Box className="w-3 h-3" />
                    CAD SPECIMEN
                  </span>
                )}
              </div>

              {/* Customizer Launch Floating Button */}
              {product.customizable && (
                <div className="absolute bottom-4 right-4">
                  <Link
                    href={`/customize/${product.customizerId || "custom-hoodie"}`}
                    className="px-3.5 py-2 bg-[#0A0A0A]/90 hover:bg-[#D61C24] backdrop-blur-xs text-white text-xs font-mono uppercase font-bold rounded-[2px] shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF333D]" />
                    <span>Open Customizer Studio</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel / Grid */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-20 h-20 bg-[#F4F4EF] rounded-[2px] border p-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${activeImageIndex === i
                      ? "border-[#0A0A0A] ring-2 ring-[#D61C24]/30"
                      : "border-[#DADBD2] hover:border-black"
                      }`}
                  >
                    <img
                      src={img || demoImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== demoImage && !target.src.endsWith(demoImage)) {
                          target.src = demoImage;
                        }
                      }}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}


            {/* Expandable Specifications Sections directly below Product Image */}
            <div className="pt-6 space-y-3">

              {/* Product Overview & Description */}
              <div className="border border-[#DADBD2] rounded-[2px] overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleSection("overview")}
                  className="w-full p-4 bg-[#F4F4EF] hover:bg-[#EAEAE5] transition-colors flex items-center justify-between text-xs font-mono uppercase font-bold text-[#0A0A0A] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D61C24]" />
                    Product Overview & Description
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.overview ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openSections.overview && (
                  <div className="p-5 bg-white text-xs text-[#555555] leading-relaxed space-y-4 font-sans border-t border-[#DADBD2]">
                    <p className="text-sm text-[#0A0A0A] leading-relaxed">{product.description}</p>
                    <div className="pt-2">
                      <div className="font-bold text-[#0A0A0A] uppercase font-mono text-[11px] mb-2 tracking-wider">
                        TECHNICAL FEATURES:
                      </div>
                      <ul className="list-disc pl-5 space-y-1.5 font-sans">
                        {product.technicalFeatures.map((tf, i) => (
                          <li key={i}>{tf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Fabric & Material Specifications */}
              <div className="border border-[#DADBD2] rounded-[2px] overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleSection("fabric")}
                  className="w-full p-4 bg-[#F4F4EF] hover:bg-[#EAEAE5] transition-colors flex items-center justify-between text-xs font-mono uppercase font-bold text-[#0A0A0A] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-[#D61C24]" />
                    Fabric, Material & GSM
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.fabric ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openSections.fabric && (
                  <div className="p-5 bg-white text-xs text-[#555555] space-y-2.5 font-mono border-t border-[#DADBD2]">
                    <div className="flex justify-between border-b border-[#F4F4EF] pb-2">
                      <span className="text-[#0A0A0A] font-semibold">Fabric Composition:</span>
                      <span className="text-right">{product.fabric}</span>
                    </div>
                    {product.GSM && (
                      <div className="flex justify-between border-b border-[#F4F4EF] pb-2">
                        <span className="text-[#0A0A0A] font-semibold">Fabric Weight:</span>
                        <span>{product.GSM} GSM</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-[#F4F4EF] pb-2">
                      <span className="text-[#0A0A0A] font-semibold">Silhouette Fit:</span>
                      <span>{product.fit}</span>
                    </div>
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between border-b border-[#F4F4EF] pb-2">
                        <span className="text-[#0A0A0A] font-semibold">{spec.label}:</span>
                        <span className="text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customization & Printing */}
              <div className="border border-[#DADBD2] rounded-[2px] overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleSection("customization")}
                  className="w-full p-4 bg-[#F4F4EF] hover:bg-[#EAEAE5] transition-colors flex items-center justify-between text-xs font-mono uppercase font-bold text-[#0A0A0A] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D61C24]" />
                    Customization, Printing & Labels
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.customization ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openSections.customization && (
                  <div className="p-5 bg-white text-xs text-[#555555] space-y-3 font-sans border-t border-[#DADBD2]">
                    <p>
                      Supported Decoration Methods:{" "}
                      <strong className="text-black font-mono font-bold">
                        {product.decorationMethods.join(", ")}
                      </strong>
                    </p>
                    <p className="leading-relaxed">
                      Private label branding options: Custom woven damask neck labels, laser heat-seal size prints, FSC certified hangtags, and custom barcoded packaging.
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping & Commercial Incoterms */}
              <div className="border border-[#DADBD2] rounded-[2px] overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleSection("shipping")}
                  className="w-full p-4 bg-[#F4F4EF] hover:bg-[#EAEAE5] transition-colors flex items-center justify-between text-xs font-mono uppercase font-bold text-[#0A0A0A] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#D61C24]" />
                    Shipping, Lead Times & Export Terms
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${openSections.shipping ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openSections.shipping && (
                  <div className="p-5 bg-white text-xs text-[#555555] space-y-2 font-mono border-t border-[#DADBD2]">
                    <div>• Bulk Production Lead Time: <span className="font-bold text-[#0A0A0A]">{product.leadTime}</span></div>
                    <div>• Sample Development: <span className="font-bold text-[#0A0A0A]">{product.sampleLeadTime || "3–5 Days"}</span></div>
                    <div>• Export Incoterms: EXW, FOB, CIF, DDP to your warehouse door</div>
                    <div>• Freight: Air Express (DHL/FedEx, 3–5d) or Ocean Cargo (18–25d)</div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Specification & Ordering (5 cols, sticky) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit">

            {/* Header Information */}
            <div className="space-y-2 border-b border-[#DADBD2] pb-6">
              <div className="flex items-center justify-between text-xs font-mono text-[#72726D]">
                <span className="uppercase text-[#D61C24] font-bold">
                  {product.category} • {product.subcategory}
                </span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#72726D] leading-relaxed font-sans">
                {product.shortDescription}
              </p>

              {/* Pricing Display depending on Store Mode */}
              <div className="pt-3 flex items-baseline justify-between">
                {mode === "wholesale" ? (
                  <div>
                    <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                      From ${product.wholesalePrice.toFixed(2)}{" "}
                      <span className="text-xs font-normal text-[#72726D]">/ piece</span>
                    </div>
                    <div className="text-xs font-mono text-[#D61C24] font-semibold mt-0.5">
                      Minimum Order Quantity: {product.MOQ} PCS
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                      ${product.retailPrice.toFixed(2)}
                    </div>
                    <div className="text-xs font-mono text-[#72726D] mt-0.5">
                      Sample / Single Piece Unit Price
                    </div>
                  </div>
                )}

                <button
                  onClick={() => toggleItem(product)}
                  className={`p-2 rounded-full border transition-colors cursor-pointer ${mounted && isInWishlist(product.id)
                    ? "bg-[#D61C24] text-white border-[#D61C24]"
                    : "bg-white text-[#72726D] border-[#DADBD2] hover:text-black"
                    }`}
                  title={mounted && isInWishlist(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${mounted && isInWishlist(product.id) ? "fill-white" : ""}`} />
                </button>
              </div>
            </div>

            {/* Ordering Mode Switch Container */}
            {mode === "wholesale" ? (
              /* Wholesale Matrix Configurator */
              <MOQConfigurator product={product} />
            ) : (
              /* Retail Single-Piece Purchasing */
              <div className="space-y-6 bg-[#F4F4EF] p-6 border border-[#DADBD2] rounded-[2px]">
                {/* Color Selection */}
                <div>
                  <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2 flex items-center justify-between">
                    <span>Color:</span>
                    <span className="text-[#D61C24]">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-transform cursor-pointer ${selectedColor.id === c.id
                          ? "ring-2 ring-[#D61C24] scale-110"
                          : "border-black/20 hover:scale-105"
                          }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2 flex items-center justify-between">
                    <span>Select Size:</span>
                    <span className="text-[#72726D]">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] border transition-colors cursor-pointer ${selectedSize === s
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                          : "bg-white text-[#0A0A0A] border-[#DADBD2] hover:border-black"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2">
                    Quantity:
                  </div>
                  <div className="flex items-center w-32 border border-[#DADBD2] bg-white rounded-[2px]">
                    <button
                      onClick={() => setRetailQuantity(Math.max(1, retailQuantity - 1))}
                      className="px-3 py-1.5 text-xs font-mono text-[#72726D] hover:text-black cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-xs font-mono font-bold text-[#0A0A0A]">
                      {retailQuantity}
                    </span>
                    <button
                      onClick={() => setRetailQuantity(retailQuantity + 1)}
                      className="px-3 py-1.5 text-xs font-mono text-[#72726D] hover:text-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Retail Add to Cart Button */}
                <button
                  onClick={handleRetailAddToCart}
                  className="w-full py-3.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {addedToast ? (
                    <>
                      <Check className="w-4 h-4 text-[#FF333D]" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Add to Bag • ${(product.retailPrice * retailQuantity).toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Direct Action Buttons (Section 14: Add to Cart, Request Quote, WhatsApp) */}
            <div className="space-y-2 pt-2 border-t border-[#DADBD2]">
              <Link
                href={`/request-quote?product=${encodeURIComponent(product.name)}&category=${product.category}&sku=${encodeURIComponent(product.sku)}&moq=${product.MOQ}&fabric=${encodeURIComponent(product.fabric)}`}
                className="w-full py-3 bg-[#F4F4EF] hover:bg-[#DADBD2] border border-[#DADBD2] text-[#0A0A0A] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#D61C24]" />
                <span>Request Custom Bulk Quotation</span>
              </Link>

              <WhatsAppInquiryButton
                product={product}
                selectedColor={selectedColor.name}
                className="w-full"
              />
            </div>

          </div>

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#DADBD2]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="eyebrow-label text-[#D61C24]">CATEGORY SPECIMENS</span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                  Related {product.category} Silhouettes
                </h3>
              </div>
              <Link
                href={`/${product.category}`}
                className="text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24] flex items-center gap-1"
              >
                View Category <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
