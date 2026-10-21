"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, MessageCircle, FileText } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { SectionHeading } from "@/components/common/SectionHeading";

export const FinalQuoteCtaSection: React.FC = () => {
  return (
    <section className="bg-[#0A0A0A] text-white py-12 sm:py-20 lg:py-28 select-none relative overflow-hidden border-t border-white/10">
      {/* Background Image directly from /images/background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/background/Low-Angle Streetwear Crew Editorial (1).png"
          alt="Streetwear Crew Background"
          className="w-full h-full object-cover object-center brightness-75 contrast-105"
        />
        {/* Cinematic dark overlay to ensure text readability while highlighting the photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/85 via-[#0A0A0A]/70 to-[#0A0A0A]/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Giant Headline with Animation */}
        <SectionHeading
          theme="dark"
          align="center"
          eyebrow="GLOBAL CONTRACT ATELIER"
          eyebrowColor="#FF333D"
          title={<span className="text-2xl sm:text-4xl lg:text-5xl block leading-tight">Ready to Engineer Your Next Collection?</span>}
          description="Upload your tech pack or build your garment live in our garment customizer. Receive an itemized factory price matrix, fabric yield report, and sampling timeline within 24 hours."
          className="max-w-4xl mx-auto mb-6 sm:mb-10"
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xl sm:max-w-none mx-auto">
          <Link
            href="/request-quote"
            className="w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 bg-[#FF333D] hover:bg-[#D61C24] text-white text-[10px] sm:text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-2xl active:scale-[0.99]"
          >
            <FileText className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Request Official Factory Quote</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>

          <Link
            href="/customize"
            className="w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-xl active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF333D] shrink-0" />
            <span>Launch Live Configurator Studio</span>
          </Link>

          <a
            href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent(`Hello ${siteConfig.name}, I would like to schedule a manufacturing consultation.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[10px] sm:text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-xl active:scale-[0.99]"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Direct WhatsApp Tech Lead</span>
          </a>
        </div>

        {/* Sialkot Campus Coordinates */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-white/15 text-[9px] sm:text-[10.5px] font-mono text-neutral-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-center leading-normal">
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
