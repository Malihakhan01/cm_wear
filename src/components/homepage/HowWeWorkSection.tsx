"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const HowWeWorkSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "IDEA & CONCEPT",
      desc: "Client shares tech pack, CAD sketch, sample reference, or customizer configuration.",
    },
    {
      step: "02",
      title: "SPECIFICATION & LAB-DIP",
      desc: "Fabric weight GSM locked, Pantone formulation lab-dips created, and BOM costing approved.",
    },
    {
      step: "03",
      title: "PRE-PRODUCTION SAMPLE",
      desc: "Physical prototype cut and stitched in our sampling facility in 3–5 business days.",
    },
    {
      step: "04",
      title: "FITTING & CLIENT APPROVAL",
      desc: "Sample couriered to your studio via DHL Express for fit testing and final sign-off.",
    },
    {
      step: "05",
      title: "BULK PRODUCTION",
      desc: "CNC automated fabric cutting, sublimation printing, Tajima embroidery, and assembly line stitching.",
    },
    {
      step: "06",
      title: "QUALITY CONTROL (AQL 2.5)",
      desc: "11-point dimensional inspection, burst strength tests, and conveyored metal-needle scan.",
    },
    {
      step: "07",
      title: "CUSTOM PACKAGING",
      desc: "Branded neck labels, care labels, hangtags, barcodes, and master carton export packing.",
    },
    {
      step: "08",
      title: "GLOBAL DELIVERY",
      desc: "Dispatched via Air Priority or Sea Freight under EXW, FOB, CIF, or DDP terms to your door.",
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-[#0A0A0A] text-white py-24 border-b border-[#2A2A28] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#2A2A28] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#FF333D]">
                EDITORIAL MANUFACTURING TIMELINE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
              From Concept to Container Export
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-sans">
            An 8-stage transparent production corridor keeping international brand founders and sourcing teams informed at every milestone.
          </p>
        </div>

        {/* 8-Step Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => {
            const isCurrent = idx === activeStep;
            return (
              <div
                key={s.step}
                onMouseEnter={() => setActiveStep(idx)}
                className={`p-6 rounded-[2px] border transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? "bg-[#20201E] border-[#D61C24] shadow-lg"
                    : "bg-[#0A0A0A] border-[#2A2A28] hover:border-[#3A3A36]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`editorial-number text-3xl font-bold font-display ${
                      isCurrent ? "text-[#FF333D]" : "text-neutral-700"
                    }`}
                  >
                    {s.step}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isCurrent ? "bg-[#D61C24]" : "bg-neutral-800"
                    }`}
                  />
                </div>

                <h3
                  className="text-sm font-bold uppercase tracking-tight text-white font-display not-italic mb-2"
                  style={{ fontStyle: "normal" }}
                >
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center pt-8 border-t border-[#2A2A28] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400 font-mono">
            Average production timeline: <strong className="text-white">14 to 18 business days</strong> for 100–1,000 piece batches.
          </div>
          <Link
            href="/request-quote"
            className="px-6 py-3 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
          >
            <span>Initiate Stage 01 (Submit Project)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
