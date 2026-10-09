"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Box, Sparkles, ArrowRight, Palette } from "lucide-react";
import { TAWFIQ_PALETTE } from "@/config/customizerProducts.config";

// Dynamic import with ssr: false as instructed in Section 27 to keep primary global bundle lean
const Product3DViewer = dynamic(
  () => import("@/components/three/Product3DViewer").then((mod) => mod.Product3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] bg-[#F4F4EF] rounded-[2px] flex items-center justify-center border border-[#DADBD2]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 mx-auto border-2 border-[#D61C24] border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-mono uppercase text-[#72726D]">
            Loading Virtual Studio...
          </div>
        </div>
      </div>
    ),
  }
);

export const ThreeDShowcaseSection: React.FC = () => {
  const [bodyColor, setBodyColor] = useState("#0A0A0A");
  const [sleeveColor, setSleeveColor] = useState("#20201E");
  const [accentColor, setAccentColor] = useState("#D61C24");

  return (
    <section className="bg-white py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#DADBD2] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">
                VIRTUAL SAMPLING CAD SUITE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Interactive Specimen Inspection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#72726D] max-w-md font-sans">
            Inspect fabric drape, rotation angles, seam transitions, and real-time color palettes in full 360° space prior to physical sampling.
          </p>
        </div>

        {/* Specimen Viewer & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Interactive Canvas (8 cols) */}
          <div className="lg:col-span-8 h-[440px] sm:h-[480px]">
            <Product3DViewer
              modelType="hoodie"
              bodyColorHex={bodyColor}
              sleeveColorHex={sleeveColor}
              accentColorHex={accentColor}
            />
          </div>

          {/* Configuration Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-6 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-[#0A0A0A] text-white px-2 py-0.5 rounded-[1px] font-bold">
                REAL-TIME SHADER
              </span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                Garment Material Colorway
              </h3>
              <p className="text-xs text-[#72726D]">
                Select colorways below to update garment materials instantly.
              </p>
            </div>

            {/* Body Color Picker */}
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2 flex items-center justify-between">
                <span>Body Shell:</span>
                <span className="text-[#D61C24]">{bodyColor}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {TAWFIQ_PALETTE.slice(0, 5).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setBodyColor(s.hex)}
                    className={`aspect-square rounded-[2px] border ${
                      bodyColor === s.hex ? "ring-2 ring-[#D61C24]" : "border-[#DADBD2]"
                    }`}
                    style={{ backgroundColor: s.hex }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            {/* Sleeve Color Picker */}
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2 flex items-center justify-between">
                <span>Sleeves & Collar:</span>
                <span className="text-[#D61C24]">{sleeveColor}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {TAWFIQ_PALETTE.slice(5, 10).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSleeveColor(s.hex)}
                    className={`aspect-square rounded-[2px] border ${
                      sleeveColor === s.hex ? "ring-2 ring-[#D61C24]" : "border-[#DADBD2]"
                    }`}
                    style={{ backgroundColor: s.hex }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            {/* Pocket Accent */}
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2 flex items-center justify-between">
                <span>Accent / Pocket:</span>
                <span className="text-[#D61C24]">{accentColor}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {TAWFIQ_PALETTE.slice(2, 7).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setAccentColor(s.hex)}
                    className={`aspect-square rounded-[2px] border ${
                      accentColor === s.hex ? "ring-2 ring-[#D61C24]" : "border-[#DADBD2]"
                    }`}
                    style={{ backgroundColor: s.hex }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/customize"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#FF333D]" />
                <span>Launch Full Configurator</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
