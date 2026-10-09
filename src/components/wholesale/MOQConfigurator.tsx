"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/stores/useCartStore";
import { UploadCloud, Check, FileText, ShoppingBag, Sparkles } from "lucide-react";

interface MOQConfiguratorProps {
  product: Product;
  onSuccess?: () => void;
}

export const MOQConfigurator: React.FC<MOQConfiguratorProps> = ({ product, onSuccess }) => {
  const { addItem } = useCartStore();

  const [sizeBreakdown, setSizeBreakdown] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    const defaultSizes = product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL", "2XL"];
    defaultSizes.forEach((s, idx) => {
      initial[s] = idx === 1 || idx === 2 ? 20 : 10;
    });
    return initial;
  });

  const [selectedColorHex, setSelectedColorHex] = useState(
    product.colors[0]?.hex || "#0A0A0A"
  );
  const [customColorInput, setCustomColorInput] = useState("");
  const [isCustomColorActive, setIsCustomColorActive] = useState(false);

  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([
    "Custom Labels",
  ]);

  const [artworkFile, setArtworkFile] = useState<{ name: string; size: string; url: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [addedToast, setAddedToast] = useState(false);

  const totalQuantity = Object.values(sizeBreakdown).reduce((a, b) => a + b, 0);
  const isMoqMet = totalQuantity >= product.MOQ;

  const handleSizeChange = (size: string, val: number) => {
    const num = Math.max(0, val || 0);
    setSizeBreakdown((prev) => ({ ...prev, [size]: num }));
  };

  const handleToggleCustomization = (method: string) => {
    setSelectedCustomizations((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;
      const url = URL.createObjectURL(file);
      setArtworkFile({ name: file.name, size: formattedSize, url });
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (artworkFile?.url) {
      URL.revokeObjectURL(artworkFile.url);
    }
    setArtworkFile(null);
  };

  const handleAddWholesaleToCart = () => {
    if (!isMoqMet) return;

    const matchedColor =
      product.colors.find((c) => c.hex === selectedColorHex) || {
        id: "custom-color",
        name: isCustomColorActive ? customColorInput || "Custom Tone" : "Selected Tone",
        hex: isCustomColorActive ? customColorInput || "#0A0A0A" : selectedColorHex,
      };

    addItem({
      id: `${product.id}_wholesale_${Date.now()}`,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      image: product.images[0],
      mode: "wholesale",
      unitPrice: product.wholesalePrice,
      quantity: totalQuantity,
      color: matchedColor,
      sizeBreakdown,
      decorationMethods: selectedCustomizations,
      artworkFileName: artworkFile?.name,
      artworkFileUrl: artworkFile?.url,
      notes,
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onSuccess?.();
    }, 1500);
  };

  const customizationOptions = [
    "Screen Print",
    "Sublimation",
    "Tajima Embroidery",
    "3D Puff Print",
    "DTF Transfer",
    "Custom Labels",
    "Custom Packaging",
  ];

  return (
    <div className="bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-6 space-y-6 select-none">
      
      {/* Top MOQ Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DADBD2]">
        <div>
          <span className="eyebrow-label text-[#D61C24]">WHOLESALE SPECIFICATION MATRIX</span>
          <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
            Configure Batch Run
          </h3>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-[#0A0A0A]">
            MOQ: <span className="text-[#D61C24]">{product.MOQ} PCS</span>
          </div>
          <div className="text-[10px] font-mono text-[#72726D]">
            Starting @ ${product.wholesalePrice.toFixed(2)}/pc
          </div>
        </div>
      </div>

      {/* 1. Size Breakdown Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase font-bold text-[#0A0A0A]">
          <span>1. Size Breakdown by Units</span>
          <span className={isMoqMet ? "text-emerald-700" : "text-amber-700"}>
            Total: {totalQuantity} / {product.MOQ} PCS {isMoqMet ? "✓ MOQ Met" : "(Below MOQ)"}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {Object.entries(sizeBreakdown).map(([size, qty]) => (
            <div key={size} className="bg-white border border-[#DADBD2] rounded-[2px] p-2 text-center">
              <label className="block text-[11px] font-mono uppercase font-bold text-[#72726D] mb-1">
                {size}
              </label>
              <input
                type="number"
                min="0"
                value={qty}
                onChange={(e) => handleSizeChange(size, parseInt(e.target.value) || 0)}
                className="w-full text-center text-xs font-mono font-bold bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] py-1 text-[#0A0A0A] focus:outline-hidden focus:border-black"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Color Selection */}
      <div>
        <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-3">
          2. Select Garment Dye Tone
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {product.colors.map((c) => {
            const isSelected = !isCustomColorActive && selectedColorHex === c.hex;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedColorHex(c.hex);
                  setIsCustomColorActive(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-xs font-mono border transition-all ${
                  isSelected
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-white text-[#0A0A0A] border-[#DADBD2] hover:border-black"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            );
          })}

          {/* Custom Color Option */}
          <button
            onClick={() => setIsCustomColorActive(true)}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-mono border transition-all ${
              isCustomColorActive
                ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                : "bg-white text-[#72726D] border-[#DADBD2] hover:border-black"
            }`}
          >
            Custom Pantone / HEX
          </button>
        </div>

        {isCustomColorActive && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={customColorInput}
              onChange={(e) => setCustomColorInput(e.target.value)}
              placeholder="Enter HEX (e.g. #3D422E) or Pantone TCX code..."
              className="flex-1 bg-white border border-[#DADBD2] px-3 py-1.5 text-xs font-mono text-[#0A0A0A] rounded-[2px] focus:outline-hidden focus:border-black"
            />
            {customColorInput.startsWith("#") && (
              <div
                className="w-8 h-8 rounded-[2px] border border-[#DADBD2]"
                style={{ backgroundColor: customColorInput }}
              />
            )}
          </div>
        )}
      </div>

      {/* 3. Drag & Drop Artwork Upload */}
      <div>
        <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2 flex items-center justify-between">
          <span>3. Upload Brand Artwork or Tech Pack</span>
          <span className="text-[10px] text-[#72726D] font-normal">PDF, AI, EPS, SVG, PNG, JPG</span>
        </div>

        {artworkFile ? (
          <div className="bg-white border-2 border-[#D61C24] rounded-[2px] p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#D61C24]/10 rounded-[2px] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#D61C24]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-mono font-bold text-[#0A0A0A] truncate">
                  {artworkFile.name}
                </div>
                <div className="text-[10px] font-mono text-[#72726D] flex items-center gap-2">
                  <span className="text-emerald-700 font-semibold">✓ Ready for factory ingestion</span>
                  <span>•</span>
                  <span>{artworkFile.size}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="px-2.5 py-1 text-[11px] font-mono uppercase text-[#D61C24] hover:bg-[#D61C24]/10 rounded-[2px] transition-colors shrink-0 ml-2 font-bold cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-[#DADBD2] hover:border-[#D61C24] bg-white rounded-[2px] p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
              onChange={handleFileUpload}
              className="hidden"
            />
            <UploadCloud className="w-7 h-7 text-[#D61C24] mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A]">
              Drag & Drop or Click to Attach Tech Spec / PDF
            </div>
            <div className="text-[10px] text-[#72726D] font-mono mt-1">
              Supports vector AI, EPS, SVG, or high-res PDF (Max: 50MB)
            </div>
          </label>
        )}
      </div>

      {/* 4. Customization Checkboxes */}
      <div>
        <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-3">
          4. Embellishment & Branding Elements
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {customizationOptions.map((opt) => {
            const isChecked = selectedCustomizations.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleToggleCustomization(opt)}
                className={`p-2 rounded-[2px] border text-left flex items-center gap-2 text-xs font-mono transition-colors ${
                  isChecked
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : "bg-white text-[#72726D] border-[#DADBD2] hover:border-black"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-[1px] border flex items-center justify-center shrink-0 ${
                    isChecked ? "bg-[#D61C24] border-[#D61C24] text-white" : "border-[#DADBD2]"
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Additional Notes */}
      <div>
        <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2">
          5. Technical Notes & Stitching Instructions
        </div>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Specify sleeve print placements, neck tape branding, custom tolerances, or packaging requirements..."
          className="w-full bg-white border border-[#DADBD2] rounded-[2px] p-2.5 text-xs text-[#0A0A0A] placeholder-[#72726D] font-mono focus:outline-hidden focus:border-black"
        />
      </div>

      {/* Submit To Wholesale Cart */}
      <div className="pt-2 border-t border-[#DADBD2] space-y-2">
        <button
          onClick={handleAddWholesaleToCart}
          disabled={!isMoqMet}
          className={`w-full py-3.5 rounded-[2px] text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2 ${
            isMoqMet
              ? "bg-[#0A0A0A] hover:bg-[#D61C24] text-white cursor-pointer shadow-md"
              : "bg-[#DADBD2] text-[#72726D] cursor-not-allowed"
          }`}
        >
          {addedToast ? (
            <>
              <Check className="w-4 h-4 text-[#FF333D]" />
              <span>Configured Batch Added to Quote Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>
                Add {totalQuantity} Units to Quote Cart • ${(totalQuantity * product.wholesalePrice).toFixed(2)}
              </span>
            </>
          )}
        </button>

        {!isMoqMet && (
          <div className="text-center text-[11px] font-mono text-amber-700">
            Please increase your size matrix by {product.MOQ - totalQuantity} units to satisfy the {product.MOQ} PCS minimum.
          </div>
        )}
      </div>

    </div>
  );
};
