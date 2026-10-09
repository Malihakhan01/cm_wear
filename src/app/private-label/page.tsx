import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Tag, Box, Sparkles } from "lucide-react";

export const metadata = {
  title: "Private Label & OEM Apparel Manufacturing Services",
  description: "Complete turnkey OEM apparel production from custom knit fabric to woven damask neck labels, laser heat-seals, and branded biodegradable packaging.",
};

export default function PrivateLabelPage() {
  const brandingPillars = [
    {
      title: "Woven Damask Neck Labels",
      desc: "High-density 50-denier woven damask labels with heat-sealed ultrasonic soft edges that prevent neck scratchiness.",
    },
    {
      title: "Heat-Seal Tagless Size Prints",
      desc: "Zero-hand silicone or polyurethane heat transfers directly printed into the inner collar with wash instructions and brand logo.",
    },
    {
      title: "Custom FSC Hangtags",
      desc: "Heavy 450–700 GSM recycled cotton cardstock with foil stamping, embossed lettering, and wax-cord safety pin attachments.",
    },
    {
      title: "Custom Frosted Polybags",
      desc: "Biodegradable EVA or d2w oxo-biodegradable ziplock bags with custom printed brand logo, air vent holes, and SKU barcodes.",
    },
    {
      title: "Branded Metal Hardware",
      desc: "Custom engraved YKK zipper pullers, snap buttons, drawcord metal aglets, and embossed leather patches.",
    },
    {
      title: "Master Carton Export Staging",
      desc: "Heavy double-wall corrugated shipping boxes packed with desiccants, strapped, and barcoded for seamless 3PL warehouse intake.",
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#20201E] border border-[#3A3A36] px-3 py-1 rounded-[2px]">
              <span className="w-2 h-2 rounded-full bg-[#D61C24]" />
              <span className="eyebrow-label text-[#FF333D]">
                TURNKEY PRIVATE LABEL ECOSYSTEM
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              White-Glove Private Label & OEM Manufacturing
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Launch or scale your apparel brand with full custom specifications. We transform your designs into store-ready garments complete with custom labels, custom trims, and retail-ready packaging.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/request-quote"
                className="px-6 py-3.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                Start Your Project →
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3.5 bg-[#20201E] hover:bg-white hover:text-black border border-[#3A3A36] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
              >
                Browse Blank Silhouettes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Branding Pillars */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-2 max-w-2xl mx-auto">
            <span className="eyebrow-label text-[#D61C24]">RETAIL FINISHING CAPABILITIES</span>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Complete Trim, Tag & Packaging Program
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandingPillars.map((b, i) => (
              <div
                key={i}
                className="bg-white border border-[#DADBD2] rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="editorial-number text-2xl font-bold text-[#DADBD2] group-hover:text-[#D61C24]">
                      0{i + 1}
                    </span>
                    <Tag className="w-4 h-4 text-[#D61C24]" />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[#72726D] leading-relaxed font-sans">
                    {b.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F4EF] text-[10px] font-mono text-[#D61C24] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Available Across All 8 Disciplines</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
