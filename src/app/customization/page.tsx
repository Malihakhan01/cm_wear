"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function CustomizationServicesPage() {
  const services = [
    {
      name: "High-Density Screen Printing",
      tagline: "Plastisol, Water-Based & Discharge",
      desc: "Ultra-sharp screen registration with premium tactile finish, high opacity on dark garments, and maximum wash longevity.",
      bestUses: "Streetwear graphics, bold brand typography, high-volume apparel runs (>100 units).",
      garments: "T-Shirts, Hoodies, Sweatpants, Casual Shorts",
      durability: "100+ Wash Cycles",
      moq: 50,
    },
    {
      name: "High-Loft Puff Print",
      tagline: "Dimensional Foaming Ink",
      desc: "Specialty foaming agent expanding under heat curing to form architectural relief on heavyweight cotton blanks.",
      bestUses: "Streetwear chest arches, vintage collegiate branding, sleeve lettering.",
      garments: "Heavyweight French Terry Hoodies, Crewnecks",
      durability: "80+ Wash Cycles",
      moq: 50,
    },
    {
      name: "Digital Italian Sublimation",
      tagline: "Molecular Fiber Infusion",
      desc: "Vapor-infusion printing penetrating polyester fibers with zero surface hand feel, infinite gradients, and zero fading.",
      bestUses: "Full-bleed tournament kits, complex team color schemes, aero speed suits.",
      garments: "Cycling Jerseys, Ice Hockey Sweaters, Rugby Match Kits",
      durability: "Permanent Lifetime Color",
      moq: 30,
    },
    {
      name: "Tajima Foam Embroidery",
      tagline: "15-Needle Structural Crests",
      desc: "High-density satin stitching embroidered over 3mm high-density EVA foam for raised dimension and sharp perimeter contour.",
      bestUses: "Chest crests, cap badges, tournament emblems, varsity typography.",
      garments: "Varsity Jackets, Riding Jackets, Caps, Outerwear",
      durability: "Indestructible Filament",
      moq: 30,
    },
    {
      name: "Laser-Cut Tackle Twill",
      tagline: "Pro League Zigzag Lock",
      desc: "Laser-cut multi-layer athletic twill fabric sewn with heavy zigzag border stitching for professional league tournament aesthetics.",
      bestUses: "Player names & large numbers, front chest arches on pro jerseys.",
      garments: "Ice Hockey, Basketball Sets, Collegiate Jackets",
      durability: "Pro League Tested",
      moq: 25,
    },
    {
      name: "Direct-to-Film (DTF) Transfers",
      tagline: "Ultra-Fine Vector & Gradient",
      desc: "Digital transfers with flexible polyurethane powder adhesive reproducing multi-color fine art gradients with stretch resistance.",
      bestUses: "Intricate photorealistic artwork, small-batch testing, multi-color badges.",
      garments: "Polo Shirts, Base Layers, Performance Outerwear",
      durability: "60+ Wash Cycles",
      moq: 30,
    },
    {
      name: "Collegiate Chenille Patches",
      tagline: "Looped Wool Yarn Pile",
      desc: "Traditional looped pile chenille embroidered onto double-layer wool felt backing for heritage collegiate jackets.",
      bestUses: "Varsity jacket letters, athletic championship numbers.",
      garments: "Varsity Jackets, Heirloom Outerwear",
      durability: "Heritage Grade",
      moq: 30,
    },
    {
      name: "Silicone & Rubberized Badges",
      tagline: "High-Friction Grip & Micro-Relief",
      desc: "Liquid silicone injected into micro-molds, producing matte dimensional rubber badges with tactile luxury hand.",
      bestUses: "Modern technical streetwear, sports federation badges, sleeve accents.",
      garments: "Rugby Jerseys, Tactical Tracksuits, Outerwear",
      durability: "100+ Wash Cycles",
      moq: 50,
    },
    {
      name: "3M Scotchlite™ Reflective",
      tagline: "Luminescent High-Visibility",
      desc: "Micro-glass bead reflective heat transfers ensuring 360° visibility under low-light vehicle headlamps.",
      bestUses: "Night cycling jerseys, running gear, motorsport pit-crew uniforms.",
      garments: "Cycling Apparel, Racing Suits, Ski Outerwear",
      durability: "EN ISO 20471 Certified",
      moq: 30,
    },
    {
      name: "Laser-Etched Metal Hardware",
      tagline: "Custom Brand Hardware",
      desc: "Custom brass, nickel, or matte black electroplated metal pullers, snaps, and eyelets with precision laser logo engraving.",
      bestUses: "Outerwear front zips, pocket snaps, drawcord tips.",
      garments: "Riding Jackets, Ski Jackets, Heavy Hoodies",
      durability: "Anti-Corrosion PVD",
      moq: 50,
    },
    {
      name: "Woven Damask Neck Labels",
      tagline: "Ultra-Soft Micro-Weave",
      desc: "50-denier woven damask labels with ultrasonic heat-cut edges for luxury feel and zero neck irritation.",
      bestUses: "Inner collar private label branding, hem tags.",
      garments: "All 8 Apparel Disciplines",
      durability: "Permanent",
      moq: 50,
    },
    {
      name: "Custom Frosted Ziplock Packaging",
      tagline: "Retail-Ready Polybags",
      desc: "Frosted biodegradable EVA ziplock bags printed with your logo, ventilation holes, and SKU barcodes.",
      bestUses: "Direct-to-consumer e-commerce fulfillment, retail store stock.",
      garments: "All 8 Apparel Disciplines",
      durability: "Reusable Biodegradable",
      moq: 50,
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow-label text-[#FF333D]">12 INDUSTRIAL TECHNIQUES</span>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Decoration & Customization Capabilities
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              State-of-the-art embellishment lines operating directly inside our Sialkot campus. From high-density screen printing to Japanese Tajima embroidery and Italian sublimation.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="bg-white border border-[#DADBD2] rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] bg-[#F4F4EF] px-2 py-0.5 rounded-[1px]">
                      {s.tagline}
                    </span>
                    <span className="editorial-number text-xl font-bold text-[#DADBD2] group-hover:text-[#D61C24]">
                      {i < 9 ? `0${i + 1}` : i + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                    {s.name}
                  </h3>

                  <p className="text-xs text-[#72726D] leading-relaxed font-sans">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F4EF] space-y-2 text-[11px] font-mono">
                  <div>
                    <span className="text-[#72726D]">Best Uses: </span>
                    <span className="text-black">{s.bestUses}</span>
                  </div>
                  <div>
                    <span className="text-[#72726D]">Compatible: </span>
                    <span className="text-[#D61C24] font-semibold">{s.garments}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F4F4EF] text-[10px]">
                    <span className="text-neutral-500">Durability: {s.durability}</span>
                    <span className="font-bold text-black">MOQ: {s.moq} PCS</span>
                  </div>
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
              Test Embellishments on a Physical Sample
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              We cut, print, and stitch finished pre-production samples in 3–5 business days.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
          >
            Order Development Sample
          </Link>
        </div>
      </section>

    </div>
  );
}
