"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { contentService } from "@/services/content.service";

interface DisplayFaq {
  q: string;
  a: string;
}

const DEFAULT_FAQS: DisplayFaq[] = [
  {
    q: "What is your minimum order quantity (MOQ) for custom manufacturing?",
    a: "Our standard wholesale production MOQ starts at 50 pieces per style/colorway for streetwear blanks and team jerseys, and 20–30 pieces for complex technical outerwear (such as 3-layer ski jackets and Cordura karting suits). You can blend multiple sizes (e.g. S to 2XL) within this MOQ.",
  },
  {
    q: "Can I order a physical pre-production sample before committing to bulk?",
    a: "Yes. We strongly encourage pre-production sampling. We cut and sew a prototype from your exact tech pack or customizer specification in 3–5 business days and courier it via DHL Express for fit approval and tactile inspection.",
  },
  {
    q: "What is your standard production turnaround time?",
    a: "Our standard bulk manufacturing lead time is 14 to 18 business days from final sample sign-off and lab-dip approval. Reorders of existing tech packs can ship in as fast as 10 to 12 business days.",
  },
  {
    q: "What artwork vector files do you require for printing and embroidery?",
    a: "For digital sublimation, screen printing, and Tajima embroidery digitizing, we prefer vector formats: AI (Adobe Illustrator), EPS, SVG, or high-resolution 300 DPI transparent PNGs. Our internal CAD artists can also assist in vectorizing hand sketches.",
  },
  {
    q: "Do you supply complete private label branding (neck labels, hangtags, polybags)?",
    a: "Yes. We offer turnkey private label packages including custom woven damask neck labels, heat-seal care instructions, FSC-certified branded hangtags, barcoded SKU stickers, and frosted biodegradable ziplock polybags.",
  },
  {
    q: "What payment methods and terms are supported for international export orders?",
    a: "For commercial export production, we support Bank Wire Transfer (T/T), Wise Business, and commercial letters of credit for large container contracts. Standard production terms are 50% deposit upon sample approval and 50% balance upon final quality inspection certificate prior to airport/port dispatch.",
  },
  {
    q: "How does live order tracking work throughout production?",
    a: "Once your commercial invoice is issued, you receive a unique Order ID (e.g. TI-849201). You can track each of the 10 production milestones (from yarn lab-dip and CNC cutting to needle scanning and DHL flight dispatch) 24/7 on our /track-order portal.",
  },
];

const cleanHtml = (text: string) => {
  if (!text) return "";
  return text.replace(/<[^>]*>?/gm, "").trim();
};

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<DisplayFaq[]>(DEFAULT_FAQS);

  useEffect(() => {
    let isMounted = true;
    async function loadApiFaqs() {
      try {
        const liveFaqs = await contentService.getFaqs();
        if (isMounted && liveFaqs && liveFaqs.length > 0) {
          // Take the top 7 FAQs for the homepage
          setFaqs(
            liveFaqs.slice(0, 7).map((item) => ({
              q: item.question,
              a: cleanHtml(item.answer),
            }))
          );
        }
      } catch (err) {
        console.error("FaqSection API error:", err);
      }
    }
    loadApiFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-12 sm:py-20 border-b border-[#DADBD2] select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeading
          align="center"
          eyebrow="EXPORT SPECIFICATIONS &amp; PROTOCOLS"
          eyebrowColor="#D61C24"
          title="Frequently Answered Questions"
          description="Everything you need to know about working with our Sialkot manufacturing facility, minimums, sampling, and export logistics."
        />

        {/* Accordion List */}
        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#DADBD2] rounded-[2px] overflow-hidden transition-all hover:border-[#D61C24]/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={`w-full text-left p-4 sm:p-5 flex items-center justify-between transition-colors ${
                    isOpen ? "bg-[#F4F4EF] text-[#0A0A0A]" : "bg-white text-[#0A0A0A] hover:bg-[#F4F4EF]"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-tight font-sans not-italic text-[#0A0A0A] pr-3 sm:pr-4 leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-[#D61C24]" : "text-[#72726D]"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white border-t border-[#DADBD2] text-[11.5px] sm:text-xs text-[#72726D] leading-relaxed font-sans whitespace-pre-line">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions: View All FAQs & Ask Lead Technician */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F4F4EF] text-xs font-mono">
          <Link
            href="/resources/faq"
            className="inline-flex items-center gap-1.5 text-[#0A0A0A] hover:text-[#D61C24] font-bold uppercase tracking-wider transition-colors"
          >
            <span>Browse Full FAQ Knowledge Base ({faqs.length}+ Questions)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D61C24]" />
          </Link>

          <div className="text-[#72726D]">
            Have a custom spec question?{" "}
            <Link href="/request-quote" className="text-[#D61C24] hover:underline font-bold">
              Ask our lead engineer →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
