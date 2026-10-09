"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, MessageCircle, FileText } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { SectionHeading } from "@/components/common/SectionHeading";

export const FinalQuoteCtaSection: React.FC = () => {
  return (
    <section className="bg-[#0A0A0A] text-white py-24 sm:py-32 select-none relative overflow-hidden border-t border-white/10">
      {/* Background Image directly from /images/background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/background/Low-Angle Streetwear Crew Editorial (1).png"
          alt="Streetwear Crew Background"
          className="w-full h-full object-cover object-center brightness-75 contrast-105"
        />
        {/* Cinematic dark overlay to ensure text readability while highlighting the photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Giant Headline with Animation */}
        <SectionHeading
          theme="dark"
          align="center"
          eyebrow="GLOBAL CONTRACT ATELIER"
          eyebrowColor="#FF333D"
          title="Ready to Engineer Your Next Collection?"
          description="Upload your tech pack or build your garment live in our garment customizer. Receive an itemized factory price matrix, fabric yield report, and sampling timeline within 24 hours."
          className="max-w-4xl mx-auto mb-10"
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-2xl sm:max-w-none mx-auto">
          <Link
            href="/request-quote"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FF333D] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-2xl"
          >
            <FileText className="w-4 h-4 text-white shrink-0" />
            <span>Request Official Factory Quote</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <Link
            href="/customize"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-[#FF333D] shrink-0" />
            <span>Launch Live Configurator Studio</span>
          </Link>

          <a
            href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent(`Hello ${siteConfig.name}, I would like to schedule a manufacturing consultation.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Direct WhatsApp Tech Lead</span>
          </a>
        </div>

        {/* Sialkot Campus Coordinates */}
        <div className="mt-12 sm:mt-14 pt-6 sm:pt-8 border-t border-white/15 text-[10px] sm:text-[11px] font-mono text-neutral-300 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <span>FACILITY: {siteConfig.address.campus}</span>
          <span className="hidden sm:inline">•</span>
          <span>LOCATION: {siteConfig.address.coordinates}</span>
          <span className="hidden sm:inline">•</span>
          <span>ACCREDITATION: ISO 9001:2015 &amp; OEKO-TEX STANDARD 100</span>
        </div>

      </div>
    </section>
  );
};
