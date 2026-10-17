"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageSquare, ArrowRight, ShieldCheck, Clock, FileText } from "lucide-react";
import { contentService } from "@/services/content.service";
import { FaqItem } from "@/types";
import { siteConfig } from "@/config/site.config";

// Fallback items in case API is offline
const INITIAL_FAQS: FaqItem[] = [
  {
    id: 1,
    topic: "MOQ & Bulk Pricing",
    question: "What is your factory Minimum Order Quantity (MOQ) for custom apparel manufacturing?",
    answer: "Our standard wholesale production MOQ starts at 50 units per style and colorway for casual blanks, hoodies, t-shirts, and team kits. For technical performance garments (such as 3-layer waterproof ski jackets and Cordura karting suits), we accommodate lower initial runs of 25–30 units. You can split sizes (XS to 3XL) within this batch.",
    sort_order: 1,
  },
  {
    id: 2,
    topic: "MOQ & Bulk Pricing",
    question: "How does volume-tiered pricing work for bulk production runs?",
    answer: "Our pricing structure is graduated based on factory production efficiency: Tier 1 (50–199 units), Tier 2 (200–499 units), Tier 3 (500–1,999 units), and Tier 4 (2,000+ units). Large volume runs achieve up to 35% cost reductions due to automated CNC cutting marker optimization and dedicated dye bath batching.",
    sort_order: 2,
  },
  {
    id: 3,
    topic: "Sampling & Prototypes",
    question: "Can I order physical pre-production samples before committing to full bulk production?",
    answer: "Yes, physical pre-production sampling is standard protocol. We develop a complete prototype according to your exact tech pack specifications within 5–7 business days, followed by priority DHL Express delivery (3–4 days worldwide) for tactile review and fit approval.",
    sort_order: 3,
  },
  {
    id: 4,
    topic: "Sampling & Prototypes",
    question: "What is the cost and turnaround time for a custom sample?",
    answer: "Sample fees typically range from $40 to $80 depending on garment complexity, fabric GSM, and custom hardware. Importantly, sample fees are 100% credited back toward your commercial bulk invoice once the main production order is placed.",
    sort_order: 4,
  },
  {
    id: 5,
    topic: "Technical Materials & GSM",
    question: "What fabric weights (GSM) and blends do you knit for streetwear blanks?",
    answer: "We knit custom cotton and blended textiles ranging from 220 GSM single jersey up to 500 GSM diagonal loopback French Terry and 460 GSM brushed fleece. All premium fleece is combed, ring-spun, and pre-shrunk with anti-pilling finishing.",
    sort_order: 5,
  },
  {
    id: 6,
    topic: "Customizer & Factory Tools",
    question: "How does the online Customizer export into factory production files?",
    answer: "Our customizer compiles your canvas selections, Pantone hex codes, placement coordinates, custom badges, and size grade breakdowns directly into an industry-standard PDF tech pack and vector cutting file for our production floor.",
    sort_order: 6,
  },
  {
    id: 7,
    topic: "Private Label & Branding",
    question: "What custom private label packaging and trims do you provide?",
    answer: "We offer comprehensive end-to-end private label packages: custom woven damask neck labels, soft satin care tags, FSC-certified cardboard hangtags, metal eyelets and branded drawstrings, barcoded SKU stickers, and frosted biodegradable ziplock polybags.",
    sort_order: 7,
  },
  {
    id: 8,
    topic: "Worldwide Shipping & Duties",
    question: "Which international Incoterms and shipping methods do you support?",
    answer: "We support EXW, FOB (Karachi Port / Sialkot Air Cargo), CIF, and turnkey DDP (Delivered Duty Paid) via air freight (DHL, FedEx, UPS) and commercial sea freight containers. For DDP orders, all customs clearance, port tariffs, and local courier delivery to your doorstep are handled seamlessly.",
    sort_order: 8,
  },
];

const cleanHtml = (text: string) => {
  if (!text) return "";
  return text.replace(/<[^>]*>?/gm, "").trim();
};

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [selectedTopic, setSelectedTopic] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<number[]>([1]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFaqs() {
      try {
        const data = await contentService.getFaqs();
        if (isMounted && data && data.length > 0) {
          setFaqs(data);
          setOpenIds([data[0].id]);
        }
      } catch (e) {
        console.error("Failed to load FAQs:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const topics = useMemo(() => {
    const list = Array.from(new Set(faqs.map((f) => f.topic))).filter(Boolean);
    return ["ALL", ...list];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesTopic = selectedTopic === "ALL" || faq.topic === selectedTopic;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTopic;
      const matchesSearch =
        faq.question.toLowerCase().includes(q) ||
        cleanHtml(faq.answer).toLowerCase().includes(q) ||
        faq.topic.toLowerCase().includes(q);
      return matchesTopic && matchesSearch;
    });
  }, [faqs, selectedTopic, searchQuery]);

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen text-[#0A0A0A]">
      {/* Dark Industrial Hero */}
      <section className="bg-[#0A0A0A] text-white border-b border-[#2A2A28] py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D61C24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[#FF333D] font-bold">Manufacturing FAQs</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#D61C24]/10 border border-[#D61C24]/30 text-[#FF333D] text-[11px] font-mono uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sialkot Export Manufacturing Protocols
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white font-display leading-[1.05]">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              Authoritative guidance on MOQs, rapid prototyping, fabric GSM specs, factory tech packs, private label packaging, and worldwide commercial export terms.
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#2A2A28]">
            <div className="bg-[#141414] border border-[#2A2A28] p-4 rounded-[2px]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Standard MOQ</div>
              <div className="text-xl font-bold font-display text-white mt-1">50 Units / Style</div>
            </div>
            <div className="bg-[#141414] border border-[#2A2A28] p-4 rounded-[2px]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Prototype Lead Time</div>
              <div className="text-xl font-bold font-display text-white mt-1">5–7 Business Days</div>
            </div>
            <div className="bg-[#141414] border border-[#2A2A28] p-4 rounded-[2px]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Bulk Turnaround</div>
              <div className="text-xl font-bold font-display text-white mt-1">14–18 Days</div>
            </div>
            <div className="bg-[#141414] border border-[#2A2A28] p-4 rounded-[2px]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Shipping Modes</div>
              <div className="text-xl font-bold font-display text-[#FF333D] mt-1">DDP Air & Ocean</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* Left Column: Search & Topic Filter (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Search Box */}
            <div className="bg-white border border-[#DADBD2] p-4 rounded-[2px] shadow-sm">
              <label htmlFor="faq-search" className="block text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-2">
                Search Questions & Specs
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#72726D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="faq-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. GSM, sample, DDP, MOQ..."
                  className="w-full bg-[#F4F4EF] border border-[#DADBD2] pl-9 pr-3 py-2 text-xs text-[#0A0A0A] rounded-[2px] focus:outline-none focus:border-[#D61C24] transition-colors"
                />
              </div>
              {searchQuery && (
                <div className="mt-2 text-[11px] font-mono text-[#72726D] flex justify-between items-center">
                  <span>Found {filteredFaqs.length} results</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#D61C24] hover:underline font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Topic Filter Tabs */}
            <div className="bg-white border border-[#DADBD2] p-4 rounded-[2px] shadow-sm space-y-2">
              <div className="text-xs font-mono uppercase font-bold text-[#0A0A0A] mb-3 flex items-center justify-between">
                <span>Filter By Topic</span>
                <span className="text-[10px] text-[#72726D]">{faqs.length} Total</span>
              </div>
              <div className="flex flex-col space-y-1">
                {topics.map((t) => {
                  const isActive = selectedTopic === t;
                  const count =
                    t === "ALL"
                      ? faqs.length
                      : faqs.filter((f) => f.topic === t).length;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`w-full text-left px-3 py-2 rounded-[2px] text-xs font-sans transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-[#D61C24] text-white font-bold shadow-sm"
                          : "text-[#20201E] hover:bg-[#F4F4EF]"
                      }`}
                    >
                      <span className="truncate">{t === "ALL" ? "All Manufacturing Topics" : t}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[1px] ${
                          isActive ? "bg-white/20 text-white" : "bg-[#F4F4EF] text-[#72726D]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Inquiry Sidebar Banner */}
            <div className="bg-[#0A0A0A] text-white p-5 rounded-[2px] border border-[#2A2A28] space-y-3">
              <div className="text-xs font-mono uppercase text-[#FF333D] font-bold tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Custom Spec Inquiry
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Have a proprietary silhouette, custom GSM requirement, or technical fabric question? Our master pattern engineers answer within 4 hours.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/request-quote"
                  className="w-full text-center py-2.5 px-4 bg-[#D61C24] hover:bg-[#b0141b] text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors rounded-[2px] flex items-center justify-center gap-1.5"
                >
                  <span>Submit Tech Pack / RFQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2 px-4 bg-transparent border border-[#2A2A28] hover:border-white text-neutral-300 hover:text-white text-xs font-mono transition-colors rounded-[2px]"
                >
                  WhatsApp: {siteConfig.whatsAppNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Questions List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DADBD2]">
              <span className="text-xs font-mono uppercase font-bold text-[#72726D]">
                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "Question" : "Questions"}
              </span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <button
                  onClick={() => setOpenIds(filteredFaqs.map((f) => f.id))}
                  className="text-[#72726D] hover:text-[#0A0A0A] underline"
                >
                  Expand All
                </button>
                <span className="text-[#DADBD2]">|</span>
                <button
                  onClick={() => setOpenIds([])}
                  className="text-[#72726D] hover:text-[#0A0A0A] underline"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="bg-white border border-[#DADBD2] p-12 text-center rounded-[2px] space-y-4">
                <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
                <div className="text-base font-bold uppercase tracking-tight text-[#0A0A0A]">
                  No matching questions found
                </div>
                <p className="text-xs text-[#72726D] max-w-md mx-auto">
                  We couldn&apos;t find an answer matching &ldquo;{searchQuery}&rdquo;. Try another keyword or connect directly with our engineering department.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTopic("ALL");
                  }}
                  className="px-4 py-2 bg-[#D61C24] text-white text-xs font-mono font-bold uppercase rounded-[2px]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openIds.includes(faq.id);
                  const cleanAnswer = cleanHtml(faq.answer);

                  return (
                    <div
                      key={faq.id}
                      className="bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden transition-all duration-200 hover:border-[#D61C24]/50 shadow-sm"
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        className={`w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 transition-colors ${
                          isOpen ? "bg-[#FBFBFA]" : "bg-white hover:bg-[#F9F9F7]"
                        }`}
                        aria-expanded={isOpen}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] bg-[#F4F4EF] px-2 py-0.5 rounded-[1px]">
                              {faq.topic}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-[#0A0A0A] leading-snug font-sans">
                            {faq.question}
                          </h3>
                        </div>

                        <div className={`p-1.5 rounded-[2px] border transition-transform shrink-0 mt-1 ${
                          isOpen
                            ? "bg-[#D61C24] text-white border-[#D61C24] rotate-180"
                            : "bg-[#F4F4EF] text-[#72726D] border-[#DADBD2]"
                        }`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-6 pt-3 bg-white border-t border-[#F4F4EF] text-xs sm:text-sm text-[#40403C] leading-relaxed font-sans">
                          <p className="whitespace-pre-line">{cleanAnswer}</p>
                          
                          <div className="mt-4 pt-3 border-t border-[#F4F4EF] flex items-center justify-between text-[11px] font-mono text-[#72726D]">
                            <span>Factory Verified Protocol</span>
                            <Link
                              href="/request-quote"
                              className="text-[#D61C24] hover:underline font-bold flex items-center gap-1"
                            >
                              <span>Apply to your order</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom FAQ Banner */}
            <div className="mt-8 bg-[#F4F4EF] border border-[#DADBD2] p-6 rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                  Looking for Fabric Weight or Tech Pack Downloads?
                </h4>
                <p className="text-xs text-[#72726D] mt-1">
                  Explore our comprehensive GSM directory, AQL 2.5 inspection protocols, and commercial terms.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/materials"
                  className="px-4 py-2 bg-white border border-[#DADBD2] hover:border-[#0A0A0A] text-xs font-mono uppercase font-bold text-[#0A0A0A] transition-colors rounded-[2px]"
                >
                  Fabric Library
                </Link>
                <Link
                  href="/quality-control"
                  className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-xs font-mono uppercase font-bold text-white transition-colors rounded-[2px]"
                >
                  Quality Control
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
