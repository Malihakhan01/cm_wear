"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { ShieldCheck, ArrowRight, CheckCircle2, TrendingDown, DollarSign } from "lucide-react";

export default function WholesalePage() {
  const tiers = [
    {
      tier: "Tier 01: Low-MOQ Launch",
      volume: "50 – 199 PCS",
      discount: "Base Wholesale Pricing",
      desc: "Perfect for emerging labels, startup capsule releases, and test market drops.",
      perks: ["Custom neck labels", "Blended size breakdown (XS to 2XL)", "Standard 14–18 day lead time"],
    },
    {
      tier: "Tier 02: Core Production",
      volume: "200 – 499 PCS",
      discount: "12% Volume Discount",
      desc: "Engineered for established D2C brands and seasonal club collections.",
      perks: ["Dedicated pattern technician", "Free lab-dip strike-offs", "Custom branded polybags included"],
    },
    {
      tier: "Tier 03: High-Volume Contract",
      volume: "500 – 2,500+ PCS",
      discount: "22% Volume Discount",
      desc: "Contract manufacturing for international retailers, sports federations, and corporate fleets.",
      perks: ["Ocean freight consolidation (FCL/LCL)", "Priority production scheduling", "Custom engraved hardware"],
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow-label text-[#FF333D]">DIRECT SIALKOT FACTORY CONTRACTS</span>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Wholesale Apparel Volume Tiers
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Cut out importer middlemen and agent commissions. Contract directly with our certified export facility to maximize your gross profit margins while maintaining luxury European craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Tier Cards */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-2 max-w-2xl mx-auto">
            <span className="eyebrow-label text-[#D61C24]">MARGIN OPTIMIZATION</span>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Production Volume Scale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#DADBD2] rounded-[2px] p-8 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
              >
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase font-bold text-[#D61C24]">
                    {t.tier}
                  </div>
                  <div className="text-3xl font-bold uppercase font-display text-black">
                    {t.volume}
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-[1px] w-fit">
                    {t.discount}
                  </div>
                  <p className="text-xs text-[#72726D] leading-relaxed">
                    {t.desc}
                  </p>
                  <ul className="space-y-2 pt-2 border-t border-[#F4F4EF] text-xs font-mono text-black">
                    {t.perks.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D61C24] shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#F4F4EF] mt-6">
                  <Link
                    href={`/request-quote?volume=${encodeURIComponent(t.volume)}`}
                    className="w-full block text-center py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
                  >
                    Lock Volume Tier
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
