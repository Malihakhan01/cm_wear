"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, FileText, CheckCircle2 } from "lucide-react";

export default function ResourcesPage() {
  const guides = [
    {
      title: "The Private Label Streetwear Manufacturing Blueprint",
      category: "Casual Wear & Blanks",
      desc: "Everything you need to know about GSM selection, 3-end loopback vs brushed fleece, shrink-rates, and pigment dyeing.",
      readTime: "8 min read",
    },
    {
      title: "Technical Cycling Kit Sourcing: Aerodynamics & Chamois Density",
      category: "Cycling Engineering",
      desc: "How to choose between warp-knit lycra and dimpled speed mesh, selecting 8-hour gel pads, and sublimation color matching.",
      readTime: "10 min read",
    },
    {
      title: "Equestrian Performance Textiles: 4-Way Bonded Softshell & Silicone Grip",
      category: "Equestrian Clothing",
      desc: "Sartorial show jacket tailoring, saddle friction durability, and applying German silicone full-seat patterns.",
      readTime: "9 min read",
    },
    {
      title: "Pro Tournament Ice Hockey Jerseys: Tackle Twill & K1 Birds-Eye Mesh",
      category: "Ice Hockey Uniforms",
      desc: "Engineering blade-puncture resistant hockey jerseys, multi-layer tackle twill cresting, and fight strap installation.",
      readTime: "7 min read",
    },
    {
      title: "Alpine Waterproof Outerwear: 3-Layer Membranes & Taped Seams",
      category: "Ski & Snowboard",
      desc: "Understanding 20,000mm hydrostatic head testing, breathable MVTR ratings, and seam sealing tape application.",
      readTime: "12 min read",
    },
    {
      title: "Motorsport Suit Construction: 500D Cordura & CIK-FIA Norms",
      category: "Go-Karting & Racing",
      desc: "Slide abrasion resistance, 360-degree floating arm gussets, and moisture-absorbing towel linings.",
      readTime: "9 min read",
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-20 sm:py-28 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow-label text-[#FF333D]">SOURCING KNOWLEDGE BASE</span>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Technical Apparel Manufacturing Guides
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Authoritative industry whitepapers on fabric weights, pattern grading, sublimation color science, and international export logistics.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20 bg-[#F4F4EF] border-b border-[#DADBD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g, i) => (
              <div
                key={i}
                className="bg-white border border-[#DADBD2] rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] bg-[#F4F4EF] px-2 py-0.5 rounded-[1px]">
                      {g.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#72726D]">
                      {g.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                    {g.title}
                  </h3>

                  <p className="text-xs text-[#72726D] leading-relaxed font-sans">
                    {g.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F4EF] flex items-center justify-between">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#0A0A0A] hover:text-[#D61C24] transition-colors"
                  >
                    <span>Read Whitepaper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/request-quote"
                    className="text-[11px] font-mono text-[#72726D] hover:text-[#D61C24] transition-colors"
                  >
                    Quote Spec →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog"
              className="bg-white border border-[#DADBD2] p-8 rounded-[2px] hover:border-[#D61C24] transition-all group flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] tracking-wider">
                  Editorial Whitepapers
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display mt-2 group-hover:text-[#D61C24] transition-colors">
                  Manufacturing Blog & Sourcing Guides →
                </h3>
                <p className="text-xs text-[#72726D] mt-2 leading-relaxed">
                  Deep-dive articles on GSM fabric weights, aerodynamic speed meshes, private label branding, and container logistics.
                </p>
              </div>
              <span className="text-xs font-mono font-bold uppercase text-[#D61C24]">
                Explore All Whitepapers
              </span>
            </Link>

            <Link
              href="/resources/faq"
              className="bg-white border border-[#DADBD2] p-8 rounded-[2px] hover:border-[#D61C24] transition-all group flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] tracking-wider">
                  Client Support & Policies
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display mt-2 group-hover:text-[#D61C24] transition-colors">
                  Frequently Asked Questions (FAQs) →
                </h3>
                <p className="text-xs text-[#72726D] mt-2 leading-relaxed">
                  Clear answers on 50-piece minimums, 5–7 day prototyping, tech pack exports, and DDP shipping terms.
                </p>
              </div>
              <span className="text-xs font-mono font-bold uppercase text-[#D61C24]">
                Browse FAQ Directory
              </span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
