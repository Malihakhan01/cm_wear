"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import {
  ShieldCheck,
  Factory,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Scissors,
  PackageCheck,
  MessageCircle,
  FileText,
} from "lucide-react";

export default function AboutPage() {
  const manufacturingSteps = [
    {
      step: "01",
      title: "Design & Material Selection",
      subtitle: "Material Science & Technical CAD Pattern Development",
      description:
        "Every production run begins with curated fabric selection and CAD pattern engineering. We source and knit premium heavyweight cottons (350–500 GSM French Terry), technical Italian lycra, bonded equestrian softshell, and Cordura® abrasion-resistant textiles, perfectly tuned for your brand specs.",
      image: "/images/about us/design and material_selection .jpeg",
      highlights: [
        "Digital grading & laser CAD pattern nesting",
        "OEKO-TEX Standard 100 certified yarn selection",
        "Lab-dip Pantone PMS precision color matching",
        "Shrinkage, GSM & elasticity pre-knitting tests",
      ],
    },
    {
      step: "02",
      title: "Precision Manufacturing & Stitching",
      subtitle: "Computerized Sewing & Advanced Embellishment",
      description:
        "Operating on a strict vertical model inside our 65,000 sq ft campus, cutting-edge Japanese Tajima multi-head embroidery, high-density screen printing, and specialized 4-needle flatlock stitchers work in tandem with master pattern tailors.",
      image: "/images/about us/manufacturing_process.jpeg",
      highlights: [
        "15-needle Japanese Tajima embroidery heads",
        "Heavy-duty flatlock & reinforced activewear stitching",
        "High-density silicone, puff print & sublimation",
        "Laser-cut edge sealing & waterproof seam taping",
      ],
    },
    {
      step: "03",
      title: "Quality Assurance & Technical Inspection",
      subtitle: "AQL 2.5 Protocol & Multi-Point Quality Gateways",
      description:
        "Quality is monitored at every single workstation. From mid-production dimensional audits to 100% finished garment needle detector screening, our QA team ensures zero defects before garments move to packaging.",
      image: "/images/about us/qa.jpeg",
      highlights: [
        "AQL 2.5 industrial batch inspection standards",
        "Optical & digital conveyor needle detector scan",
        "Tensile seam strength & burst pressure testing",
        "Colorfastness wash & rub durability testing",
      ],
    },
    {
      step: "04",
      title: "Finishing & Export Packaging",
      subtitle: "Private Label Presentation & Worldwide Logistics",
      description:
        "Garments receive final steam pressing, custom woven labels, branded hangtags, silica gel insertion, and individual polybagging before being packed in heavy-duty export master cartons ready for global dispatch.",
      image: "/images/about us/packing.jpeg",
      highlights: [
        "Custom branded woven labels, care tags & hangtags",
        "Barcode / SKU sticker labeling & retail packaging",
        "Reinforced 7-ply corrugated export cartons",
        "Door-to-door DDP, CIF, and FOB air/sea freight logistics",
      ],
    },
  ];

  const facilitySpecs = [
    { value: "65,000 SQ FT", label: "Facility Footprint", desc: "Integrated manufacturing campus in Sialkot, Pakistan" },
    { value: "120K / MO", label: "Garment Capacity", desc: "Scalable monthly output across sportswear & outerwear" },
    { value: "ISO 9001:2015", label: "Quality System", desc: "Certified quality management & OEKO-TEX Standard 100" },
    { value: "48 NATIONS", label: "Global Export Corridor", desc: "Direct air & sea logistics to USA, Europe, UK & Australia" },
  ];

  const pillars = [
    {
      icon: <Factory className="w-5 h-5 text-[#D61C24]" />,
      title: "100% Vertical In-House Control",
      desc: "Zero third-party broker subcontracting. Knitting, cutting, embroidery, printing, stitching, and finishing take place under one monitored roof.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#D61C24]" />,
      title: "Ethical & Sustainable Manufacturing",
      desc: "Fair living wages, air-conditioned worker floors, zero child labor, 100% solar auxiliary energy, and eco-friendly dye wastewater management.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#D61C24]" />,
      title: "Rapid Prototyping & Sampling",
      desc: "Fast 7–10 day pre-production sample turnaround with real-time physical swatch approvals and digital CAD tech-pack verification.",
    },
    {
      icon: <Globe className="w-5 h-5 text-[#D61C24]" />,
      title: "Seamless Global Logistics (DDP / FOB)",
      desc: "End-to-end export support including export customs clearance, duty-paid door delivery (DDP), air express, and ocean container freight.",
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* 1. Hero Section */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF333D] animate-pulse" />
              <span className="eyebrow-label text-[#FF333D]">THE TAWFIQ INDUSTRY HERITAGE</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white font-display leading-[0.93]">
              Engineered Apparel Manufacturing &amp; Global Export
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl">
              Founded in Sialkot, Pakistan—the global epicenter of high-performance sportswear and technical athletic apparel—TAWFIQ INDUSTRY bridges artisanal pattern cutting with modern computerized production and worldwide private label export.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/request-quote"
                className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2 shadow-lg"
              >
                <FileText className="w-4 h-4" />
                <span>Request Factory Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent(`Hello ${siteConfig.name}, I would like to inquire about apparel manufacturing.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Direct WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Facility Showcase Section with Factory Image */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Text Info & Specs */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="eyebrow-label text-[#D61C24]">SIALKOT PRODUCTION CAMPUS</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display mt-1.5 leading-[0.95]">
                  Vertical Control. Zero Subcontracting.
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#72726D] leading-relaxed font-sans">
                Traditional garment exporters frequently broker manufacturing across unverified third-party stitchers. <strong className="text-black font-semibold">TAWFIQ INDUSTRY</strong> operates on an uncompromised vertical ecosystem: raw yarn inspection, computerized CAD cutting, screen printing, Tajima embroidery, precision stitching, and optical needle detection all happen inside our state-of-the-art facility.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {facilitySpecs.map((spec, i) => (
                  <div key={i} className="bg-white border border-[#DADBD2] p-4 rounded-[2px] shadow-2xs">
                    <div className="text-base sm:text-lg font-black text-black font-mono">{spec.value}</div>
                    <div className="text-[10px] font-mono uppercase font-bold text-[#D61C24] mt-0.5">{spec.label}</div>
                    <p className="text-[11px] text-[#72726D] mt-1 line-clamp-2">{spec.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-xs font-mono text-[#72726D] pt-1">
                📍 Factory Address: {siteConfig.address.full}
              </div>
            </div>

            {/* Right: Factory Image Frame */}
            <div className="lg:col-span-6">
              <div className="relative bg-white border border-[#DADBD2] p-2 sm:p-3 rounded-[2px] shadow-md group">
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-900 rounded-[2px]">
                  <img
                    src="/images/about us/factory_image.png"
                    alt="TAWFIQ INDUSTRY Manufacturing Campus Facility"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                    <span className="bg-[#D61C24] px-2 py-0.5 rounded-[1px] font-bold uppercase text-[10px] tracking-wider">
                      PRIMARY PRODUCTION PLANT
                    </span>
                    <span className="text-neutral-300 text-[11px]">Sialkot, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Our Manufacturing Process (4 Detailed Steps with Provided Images) */}
      <section className="py-24 bg-white border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Process Header */}
          <div className="max-w-3xl mb-16 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">VERTICAL PRODUCTION PIPELINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Our Manufacturing Process
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D] font-sans leading-relaxed">
              From raw textile science to final barcode-scanned export carton packaging, every production phase follows stringent industrial engineering protocols.
            </p>
          </div>

          {/* Process Steps List */}
          <div className="space-y-16 lg:space-y-24">
            {manufacturingSteps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={step.step}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Image */}
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="relative bg-[#F4F4EF] border border-[#DADBD2] p-2.5 rounded-[2px] shadow-sm group">
                      <div className="relative aspect-4/3 overflow-hidden rounded-[1px] bg-neutral-100">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-[1px]">
                          STAGE {step.step}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step Details */}
                  <div className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-[#D61C24] uppercase tracking-wider">
                        {step.subtitle}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#72726D] leading-relaxed font-sans">
                      {step.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono font-bold uppercase text-[#0A0A0A]">
                        Key Specifications:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#20201E]">
                        {step.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[#F4F4EF] p-2 rounded-[2px] border border-[#DADBD2]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D61C24] shrink-0" />
                            <span className="text-[11px] leading-tight">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Pillars & Why Partner with Us */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="eyebrow-label text-[#D61C24]">THE FACTORY ADVANTAGE</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Why Global Brands Choose TAWFIQ INDUSTRY
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D]">
              Direct factory contracts, transparent wholesale pricing, and uncompromised craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#DADBD2] p-6 rounded-[2px] space-y-3 hover:border-[#D61C24] transition-colors shadow-2xs"
              >
                <div className="p-2.5 bg-[#F4F4EF] w-fit rounded-[2px] border border-[#DADBD2]">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-bold uppercase font-display text-black">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#72726D] leading-relaxed font-sans">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="bg-[#0A0A0A] text-white py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF333D] font-bold">
              START YOUR CUSTOM APPAREL PRODUCTION
            </span>
            <h4 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-display">
              Begin Partnering with TAWFIQ INDUSTRY
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400">
              Submit your tech pack or request a physical pre-production sample to evaluate our stitching, drape, and embellishment quality firsthand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/request-quote"
              className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Tech Pack</span>
            </Link>
            <Link
              href="/catalog"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
