"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CM_PALETTE } from "@/config/customizerProducts.config";
import { Sparkles, ArrowRight, RotateCcw, Palette, Layers } from "lucide-react";

export const ConfiguratorTeaserSection: React.FC = () => {
  const [activePart, setActivePart] = useState<"body" | "hood" | "sleeves" | "pocket">("body");
  const [view, setView] = useState<"front" | "back">("front");
  const [colors, setColors] = useState({
    body: "#0A0A0A",
    hood: "#0A0A0A",
    sleeves: "#20201E",
    pocket: "#D61C24",
  });

  const handleColorPick = (hex: string) => {
    setColors((prev) => ({ ...prev, [activePart]: hex }));
  };

  const resetColors = () => {
    setColors({
      body: "#0A0A0A",
      hood: "#0A0A0A",
      sleeves: "#20201E",
      pocket: "#D61C24",
    });
  };

  return (
    <section className="bg-white py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#DADBD2] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">
                PROPRIETARY PRODUCT CONFIGURATOR ENGINE
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-[#0A0A0A] font-display leading-[0.92]">
              LIVE PRODUCT<br />CUSTOMIZATION STUDIO
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#72726D] max-w-md font-sans">
            Independent garment-part recoloring, multi-zone artwork positioning, felt monogram embroidery, and wholesale tech-pack generation.
          </p>
        </div>

        {/* Live Interactive Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-6 sm:p-10">
          
          {/* Garment Preview Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            
            {/* View Toggle Bar (Top Left) */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-white border border-[#DADBD2] p-1 rounded-[2px]">
                <button
                  onClick={() => setView("front")}
                  className={`px-3 py-1 text-xs font-mono uppercase font-bold rounded-[2px] transition-colors ${
                    view === "front" ? "bg-[#0A0A0A] text-white" : "text-[#72726D] hover:text-black"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setView("back")}
                  className={`px-3 py-1 text-xs font-mono uppercase font-bold rounded-[2px] transition-colors ${
                    view === "back" ? "bg-[#0A0A0A] text-white" : "text-[#72726D] hover:text-black"
                  }`}
                >
                  Back
                </button>
              </div>

              <button
                onClick={resetColors}
                className="flex items-center gap-1 text-[11px] font-mono text-[#72726D] hover:text-black"
                title="Reset color scheme"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Colors</span>
              </button>
            </div>

            {/* Interactive Visual Garment Stack */}
            <div
              className="relative w-full max-w-[380px] aspect-square flex items-center justify-center group"
            >
              {/* Shadow Base */}
              <div className="absolute bottom-4 w-3/4 h-6 bg-black/15 blur-lg rounded-full pointer-events-none" />

              {/* Base Image */}
              <img
                src={view === "front" ? "/hoodie/hoodie_front.png" : "/hoodie/hoodie_back.png"}
                alt="Customizable Garment Preview"
                className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
              />

              {/* Color Layer 1: Body */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: colors.body,
                  mixBlendMode: "multiply",
                  opacity: 0.88,
                  WebkitMaskImage: `url('${view === "front" ? "/hoodie/front.png" : "/hoodie/back_body.png"}')`,
                  maskImage: `url('${view === "front" ? "/hoodie/front.png" : "/hoodie/back_body.png"}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />

              {/* Color Layer 2: Hood */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: colors.hood,
                  mixBlendMode: "multiply",
                  opacity: 0.88,
                  WebkitMaskImage: `url('${view === "front" ? "/hoodie/front_hood.png" : "/hoodie/back_hood.png"}')`,
                  maskImage: `url('${view === "front" ? "/hoodie/front_hood.png" : "/hoodie/back_hood.png"}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />

              {/* Color Layer 3: Sleeves */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: colors.sleeves,
                  mixBlendMode: "multiply",
                  opacity: 0.88,
                  WebkitMaskImage: `url('${view === "front" ? "/hoodie/front_sleeves.png" : "/hoodie/back_sleeves.png"}')`,
                  maskImage: `url('${view === "front" ? "/hoodie/front_sleeves.png" : "/hoodie/back_sleeves.png"}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />

              {/* Color Layer 4: Pocket (Front view only) */}
              {view === "front" && (
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{
                    backgroundColor: colors.pocket,
                    mixBlendMode: "multiply",
                    opacity: 0.88,
                    WebkitMaskImage: "url('/hoodie/front_pocket.png')",
                    maskImage: "url('/hoodie/front_pocket.png')",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                />
              )}

              {/* Real-time Watermark / Stamp */}
              <div className="absolute top-8 text-center pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-black/40">
                  CM SPORTS WEAR LAB
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] font-mono text-[#72726D] mt-3">
              Click parts below to recolor in real-time • Instant 60 FPS GPU Blending
            </div>
          </div>

          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#DADBD2] rounded-[2px] p-6 space-y-6">
            
            {/* Step 1: Select Part */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-[#D61C24]" />
                <span className="text-xs font-mono uppercase font-bold text-[#0A0A0A]">
                  1. Select Garment Part
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "body", label: "Torso / Body" },
                    { id: "hood", label: "Hood" },
                    { id: "sleeves", label: "Sleeves" },
                    { id: "pocket", label: "Pocket" },
                  ] as const
                ).map((part) => {
                  const isSelected = activePart === part.id;
                  return (
                    <button
                      key={part.id}
                      onClick={() => setActivePart(part.id)}
                      className={`py-2 px-3 text-xs font-mono uppercase font-bold rounded-[2px] border transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                          : "bg-[#F4F4EF] text-[#72726D] border-[#DADBD2] hover:border-black"
                      }`}
                    >
                      <span>{part.label}</span>
                      <span
                        className="w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: colors[part.id] }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Swatch */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#D61C24]" />
                  <span className="text-xs font-mono uppercase font-bold text-[#0A0A0A]">
                    2. Select Color Swatch
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#D61C24] uppercase font-bold">
                  Editing: {activePart}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {CM_PALETTE.slice(0, 10).map((swatch) => {
                  const isSelected = colors[activePart] === swatch.hex;
                  return (
                    <button
                      key={swatch.id}
                      onClick={() => handleColorPick(swatch.hex)}
                      className={`relative aspect-square rounded-[2px] border transition-transform hover:scale-105 flex items-center justify-center ${
                        isSelected ? "ring-2 ring-[#D61C24] ring-offset-2 scale-105" : "border-[#DADBD2]"
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Studio CTA */}
            <div className="pt-4 border-t border-[#DADBD2] space-y-2">
              <Link
                href="/customize/custom-hoodie"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#FF333D]" />
                <span>Launch Full Customizer Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-[10px] font-mono text-[#72726D]">
                Add custom logos • Monogram felt text • Select from 10 customizable apparel styles
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
