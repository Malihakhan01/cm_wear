"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function QualityControlPage() {
  const qcSteps = [
    {
      num: "01",
      name: "Raw Material & Yarn Inspection",
      desc: "Spectrophotometer Delta-E < 0.5 color check, GSM scale weight verification, and 4-point fabric roll inspection before cutting.",
    },
    {
      num: "02",
      name: "CNC Cutting Inspection",
      desc: "Checking multi-ply alignment, notch placements, and pattern grainline stability against master DXF CAD files.",
    },
    {
      num: "03",
      name: "Decoration & Embellishment Audit",
      desc: "Wash cure rub tests on screen print plastisols, embroidery stitch density counts, and sublimation color transfer fastness.",
    },
    {
      num: "04",
      name: "In-Line Stitching & Seam Verification",
      desc: "Checking stitches per inch (SPI 10-12), flatlock tensile burst limits, and bar-tack anchors under active load.",
    },
    {
      num: "05",
      name: "Measurement & Tolerance Verification",
      desc: "Comprehensive 12-point measurement across XS through 3XL against client tech pack tolerance sheets (+/- 0.5cm).",
    },
    {
      num: "06",
      name: "Performance & Hydrostatic Testing",
      desc: "Hydrostatic 3-bar pressure tests on waterproof ski shells and tear burst testing on rugby interlock fabrics.",
    },
    {
      num: "07",
      name: "Final Inspection (AQL 2.5 Major / 4.0 Minor)",
      desc: "Randomized statistical batch sampling according to ISO 2859-1 standards before clearance to packing line.",
    },
    {
      num: "08",
      name: "100% Conveyor Needle & Metal Detection Scan",
      desc: "Every single finished garment passes through automated conveyor electromagnetic needle detectors to ensure safety.",
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow-label text-[#FF333D]">AQL 2.5 PROTOCOL • ISO 9001:2015</span>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              8-Stage Quality Assurance System
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              We eliminate manufacturing defects before garments leave our facility. Every batch undergoes rigorous multi-checkpoint physical and chemical inspection.
            </p>
          </div>
        </div>
      </section>

      {/* 8-Stage QC Grid */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qcSteps.map((st) => (
              <div
                key={st.num}
                className="bg-white border border-[#DADBD2] rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="editorial-number text-3xl font-bold text-[#DADBD2] group-hover:text-[#D61C24] font-display">
                      {st.num}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#D61C24]" />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                    {st.name}
                  </h3>
                  <p className="text-xs text-[#72726D] leading-relaxed font-sans">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F4EF] text-[10px] font-mono text-[#D61C24] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Checkpoint</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0A0A0A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold uppercase tracking-tight text-white font-display">
              Request a Quality Certificate or Sample Run
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Review our third-party ISO and OEKO-TEX laboratory test reports.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
          >
            Request QC Protocol Sheet
          </Link>
        </div>
      </section>

    </div>
  );
}
