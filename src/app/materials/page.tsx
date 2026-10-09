"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Activity, Wind, Droplets, ShieldCheck, Check } from "lucide-react";

export default function MaterialsLibraryPage() {
  const materialsList = [
    {
      name: "3-End Combed Cotton Loopback",
      gsm: "450 GSM / 13.3 oz",
      composition: "100% Combed Ring-Spun Cotton",
      stretch: "Natural Mechanical Stretch",
      breathability: "High Vapor Permeability",
      water: "Absorbent Untreated",
      bestFor: "Luxury Streetwear Drop-Shoulder Hoodies, Heavyweight Sweatpants",
      finish: "Pre-Shrunk Enzyme Silicone Softening",
    },
    {
      name: "Single Jersey Compact Cotton",
      gsm: "280 GSM / 8.25 oz",
      composition: "100% Long-Staple Combed Cotton",
      stretch: "Mechanical 2-Way",
      breathability: "High",
      water: "Absorbent",
      bestFor: "Oversized Streetwear T-Shirts, Heavy Blank Tees",
      finish: "Pigment Dye, Mineral Stone Wash",
    },
    {
      name: "Italian 4-Way Bonded Softshell",
      gsm: "320 GSM",
      composition: "78% Polyamide / 22% Elastane",
      stretch: "4-Way High Recovery (25% Expansion)",
      breathability: "12,000 g/m²/24h",
      water: "DWR Water-Repellent Outer",
      bestFor: "Equestrian Show Jackets, Technical Pit-Crew Outerwear",
      finish: "Nano Fluorocarbon Water & Dirt Barrier",
    },
    {
      name: "500D High-Tensile Cordura®",
      gsm: "380 GSM",
      composition: "100% Polyamide 6.6 Invista Filament",
      stretch: "None (High Tensile)",
      breathability: "Moderate Ventilation",
      water: "PU Coated Water-Resistant",
      bestFor: "Go-Kart Racing Suits, Motorcycle Reinforcements",
      finish: "Abrasion-Resistant Friction Barrier",
    },
    {
      name: "3-Layer Alpine Storm Shell",
      gsm: "210 GSM",
      composition: "70D Nylon Ripstop + PTFE Membrane",
      stretch: "2-Way Mechanical",
      breathability: "15,000 g/m²/24h",
      water: "20,000mm Extreme Hydrostatic Head",
      bestFor: "Alpine Ski Jackets, Waterproof Mountaineering Bibs",
      finish: "100% Heat-Bonded Waterproof Seam Tape Compatible",
    },
    {
      name: "Pro-Velocity Warp-Knit Lycra",
      gsm: "135 GSM",
      composition: "86% Polyester / 14% Elastane",
      stretch: "4-Way Maximum Recovery",
      breathability: "Ultra-Fast Vaporization",
      water: "Hydrophobic Rapid Dry",
      bestFor: "Pro Cycling Jerseys, Speed Skating, Triathlon Kits",
      finish: "UPF 50+ Sun Guard & Anti-Bacterial Silver Ion",
    },
    {
      name: "Puncture-Resistant K1 Birds-Eye",
      gsm: "250 GSM",
      composition: "100% High-Tenacity Polyester",
      stretch: "2-Way High Tensile",
      breathability: "High Open Eyelet Flow",
      water: "Fast Dry",
      bestFor: "Pro Ice Hockey Game Sweaters, Goalie Jerseys",
      finish: "Blade-Snag Defense Treatment",
    },
    {
      name: "Diamond Air-Mesh Eyelet",
      gsm: "200 GSM",
      composition: "100% Micro-Eyelet Polyester",
      stretch: "2-Way Loose Flow",
      breathability: "Maximum Court Airflow",
      water: "Fast Moisture-Wicking",
      bestFor: "Basketball Jerseys, Streetwear Court Shorts",
      finish: "Anti-Cling Aeration Finish",
    },
    {
      name: "Heavy Rugby Interlock",
      gsm: "300 GSM",
      composition: "95% Polyester / 5% Elastane",
      stretch: "4-Way Controlled Tensile Stretch",
      breathability: "Moderate High",
      water: "Hydrophobic",
      bestFor: "Rugby Match Jerseys, Scrum Training Smocks",
      finish: "600N Burst Resistance Tested",
    },
    {
      name: "PrimaLoft® Gold Microfiber Fill",
      gsm: "120 GSM",
      composition: "100% Recycled Synthetic Microfibers",
      stretch: "Thermal Loft",
      breathability: "High Insulation Flow",
      water: "Maintains Warmth When Wet",
      bestFor: "Insulated Ski Jackets, Thermal Stable Vests",
      finish: "Thermal Equivalent to 550 Fill Power Down",
    },
    {
      name: "Heavy 2x2 Cotton Rib Knit",
      gsm: "500 GSM",
      composition: "95% Combed Cotton / 5% Spandex",
      stretch: "High Elastic Recovery (Non-Baconing)",
      breathability: "Moderate",
      water: "Absorbent",
      bestFor: "Hoodie Cuffs, Waistbands, Collar Bindings",
      finish: "Pre-Shrunk High-Tension Knit",
    },
    {
      name: "Recycled Microfiber Ripstop",
      gsm: "140 GSM",
      composition: "100% Recycled Polyester",
      stretch: "Cross-Hatch Mechanical",
      breathability: "Moderate High",
      water: "DWR Wind & Water Resisting",
      bestFor: "Tracksuit Jackets, Training Shorts, Lining Panels",
      finish: "Anti-Static Peach Skin Touch",
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow-label text-[#FF333D]">TEXTILE ENGINEERING ARCHIVE</span>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Fabric & Performance Library
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              All textiles are knitted, tested, and certified in-house for tensile burst resistance, colorfastness across 50 wash cycles, and strict ISO/OEKO-TEX standards.
            </p>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materialsList.map((m, i) => (
              <div
                key={i}
                className="bg-white border border-[#DADBD2] rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#D61C24] bg-[#F4F4EF] px-2 py-0.5 rounded-[1px]">
                      {m.gsm}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#72726D]">
                      MILL CERTIFIED
                    </span>
                  </div>

                  <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display mb-1">
                    {m.name}
                  </h3>
                  <div className="text-xs font-mono text-[#72726D] mb-4">
                    {m.composition}
                  </div>

                  {/* Specs Box */}
                  <div className="bg-[#F4F4EF] p-3 rounded-[2px] space-y-1.5 text-[11px] font-mono mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Stretch:</span>
                      <span className="text-black font-semibold">{m.stretch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Breathability:</span>
                      <span className="text-black font-semibold">{m.breathability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Weather Barrier:</span>
                      <span className="text-black font-semibold">{m.water}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4F4EF] space-y-1 text-[11px] font-mono">
                  <div>
                    <span className="text-[#72726D]">Recommended: </span>
                    <span className="text-black">{m.bestFor}</span>
                  </div>
                  <div className="text-[10px] text-[#D61C24] font-bold">
                    Finish: {m.finish}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swatch Book Request CTA */}
      <section className="bg-[#0A0A0A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold uppercase tracking-tight text-white font-display">
              Request a Physical Fabric Swatch Book
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              We courier physical fabric ring swatches with GSM tags and Pantone lab-dips directly to your brand studio.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
          >
            Request Swatch Box
          </Link>
        </div>
      </section>

    </div>
  );
}
