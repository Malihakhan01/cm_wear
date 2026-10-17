"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Factory, Cpu, Flame, Scissors, PackageCheck, Layers } from "lucide-react";

export default function ManufacturingPage() {
  const facilitySections = [
    {
      number: "01",
      title: "Design & CAD Product Development",
      desc: "Our master pattern makers digitize tech packs into computerized CAD systems, grading complex athletic garments across 8 size ranges with sub-millimeter seam allowances.",
      icon: Cpu,
    },
    {
      number: "02",
      title: "Raw Yarn & Material Sourcing",
      desc: "We knit combed ring-spun organic cotton, technical warp-knit lycra, and abrasion-resistant Cordura. In-house spectrophotometer lab-dips ensure exact Pantone color matching.",
      icon: Layers,
    },
    {
      number: "03",
      title: "Automated CNC Fabric Cutting",
      desc: "Multi-ply computerized vacuum cutting systems deliver precision zero-distortion pattern pieces, eliminating frayed edges and ensuring 100% garment consistency.",
      icon: Scissors,
    },
    {
      number: "04",
      title: "Printing & Molecular Sublimation",
      desc: "High-density screen printing lines, Monti Antonio Italian sublimation heat presses, and eco-certified OEKO-TEX water-based ink formulation.",
      icon: Flame,
    },
    {
      number: "05",
      title: "Tajima Multi-Head Embroidery",
      desc: "Bank of 15-needle Japanese Tajima embroidery heads delivering high-density puff foam, collegiate chenille looping, and direct crest embroidery.",
      icon: Factory,
    },
    {
      number: "06",
      title: "Precision Stitching & Assembly",
      desc: "Specialized machine lines including 6-thread heavy flatlock for compression wear, feed-off-the-arm for denim and twill, and ultrasonic seam bonding.",
      icon: Factory,
    },
    {
      number: "07",
      title: "11-Point Quality Control & Needle Scan",
      desc: "AQL 2.5 standard inspection: seam tensile burst testing, colorfastness wash tests, dimensional tolerance measurement, and conveyored metal-needle safety scan.",
      icon: ShieldCheck,
    },
    {
      number: "08",
      title: "Custom Packaging & Global Dispatch",
      desc: "Woven neck labels, barcode hangtags, biodegradable ziplock polybags, and palletized export cartons dispatched via air priority or ocean container corridors.",
      icon: PackageCheck,
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* Editorial Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#20201E] border border-[#3A3A36] px-3 py-1 rounded-[2px]">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#FF333D]">
                SIALKOT MANUFACTURING CAMPUS • 65,000 SQ FT
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Vertical Garment Engineering & Production
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              From raw yarn milling to finished private label garments, our Sialkot campus combines artisanal craftsmanship with cutting-edge German and Japanese computerized apparel technology.
            </p>
          </div>
        </div>
      </section>

      {/* 8-Stage Storytelling Grid */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-2 max-w-2xl mx-auto">
            <span className="eyebrow-label text-[#D61C24]">FACTORY FLOOR PROGRESSION</span>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              The 8 In-House Production Stages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilitySections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.number}
                  className="bg-white border border-[#DADBD2] rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="editorial-number text-3xl font-bold text-[#DADBD2] group-hover:text-[#D61C24] transition-colors font-display">
                        {sec.number}
                      </span>
                      <div className="p-2 bg-[#F4F4EF] rounded-[2px] text-[#D61C24]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-[#72726D] leading-relaxed font-sans">
                      {sec.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F4F4EF] text-[10px] font-mono text-[#D61C24] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In-House Facility Station</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0A0A0A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold uppercase tracking-tight font-display text-white">
              Schedule a Virtual Factory Tour or Sample Run
            </h3>
            <p className="text-xs text-neutral-400">
              Speak with our senior production director or submit your tech pack for feasibility analysis.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
          >
            <span>Request Factory Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
