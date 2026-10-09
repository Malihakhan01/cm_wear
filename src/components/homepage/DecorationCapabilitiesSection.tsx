"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const DecorationCapabilitiesSection: React.FC = () => {
  const methods = [
    {
      id: "screen-print",
      name: "High-Density Screen Printing",
      tag: "Plastisol & Water-Based",
      desc: "Sharply registered multi-color screens with high wash durability on heavy cotton tees and loopback French terry.",
      bestFor: "Streetwear graphics, bold logos, high-volume runs (>100 pcs)",
      garments: "T-Shirts, Hoodies, Sweatpants",
    },
    {
      id: "puff-print",
      name: "3D High-Loft Puff Print",
      tag: "Dimensional Textured Foam",
      desc: "Expansive high-loft foaming ink expanding under heat curing to create tactile 3D relief on oversized blanks.",
      bestFor: "Streetwear typography, chest arches, sleeve branding",
      garments: "French Terry Hoodies, Crewnecks, Sweatpants",
    },
    {
      id: "sublimation",
      name: "Full Digital Italian Sublimation",
      tag: "Zero-Hand Molecular Dye",
      desc: "High-temperature molecular vapor bonding with zero hand feel and infinite Pantone color transitions.",
      bestFor: "Full tournament kits, team jerseys, complex gradient vector art",
      garments: "Cycling Jerseys, Hockey Kits, Rugby Uniforms",
    },
    {
      id: "embroidery",
      name: "Tajima 3D Foam Embroidery",
      tag: "15-Needle Japanese Precision",
      desc: "Satin stitch density over 3mm high-density EVA foam creating crisp structural crests and collegiate lettering.",
      bestFor: "Team crests, breast badges, varsity caps, sleeve emblems",
      garments: "Varsity Jackets, Riding Jackets, Caps, Hoodies",
    },
    {
      id: "tackle-twill",
      name: "Laser Tackle Twill Appliqué",
      tag: "Pro League Zigzag Lock",
      desc: "Laser-cut multi-layer polyester twill sewn onto jerseys with heavy zigzag satin border lock.",
      bestFor: "Tournament player names & numbers, varsity jacket crests",
      garments: "Ice Hockey, Basketball, Varsity Jackets",
    },
    {
      id: "dtf",
      name: "Direct-to-Film (DTF) Transfers",
      tag: "Ultra-Fine Photorealistic Resolution",
      desc: "High-resolution digital transfers with stretchable adhesive backing reproducing intricate shading and gradients.",
      bestFor: "Detailed artwork, small batch testing, multi-color logos",
      garments: "Polo Shirts, Technical Base Layers, Tracksuits",
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-white py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#DADBD2] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">
                EMBELLISHMENT & SURFACE FINISHES
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Decoration & Branding Capabilities
            </h2>
          </div>
          <Link
            href="/customization"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24]"
          >
            <span>View All 12 Customization Methods</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((m, idx) => (
            <div
              key={m.id}
              className="bg-[#F4F4EF] border border-[#DADBD2] rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] bg-white border border-[#DADBD2] px-2 py-0.5 rounded-[2px]">
                    {m.tag}
                  </span>
                  <span className="editorial-number text-xl font-bold text-[#DADBD2] group-hover:text-[#D61C24]">
                    0{idx + 1}
                  </span>
                </div>

                <h3
                  className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display not-italic mb-2"
                  style={{ fontStyle: "normal" }}
                >
                  {m.name}
                </h3>
                <p className="text-xs text-[#72726D] leading-relaxed mb-4">
                  {m.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DADBD2] space-y-1.5 text-[11px] font-mono">
                <div className="text-[#0A0A0A]">
                  <strong className="text-[#72726D]">Best For:</strong> {m.bestFor}
                </div>
                <div className="text-[#D61C24] font-bold">
                  <strong>Compatible:</strong> {m.garments}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Private Label Branding Bar */}
        <div className="mt-8 bg-[#0A0A0A] text-white p-6 rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold uppercase font-display text-white">
              Full Private Label Package: Neck Labels, Care Tags & Branded Polybags
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Woven damask labels, heat-seal size prints, FSC recycled hangtags, and frosted ziplock polybags included in bulk orders.
            </div>
          </div>
          <Link
            href="/private-label"
            className="px-4 py-2 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold rounded-[2px] shrink-0 transition-colors"
          >
            Private Label Specs
          </Link>
        </div>

      </div>
    </section>
  );
};
