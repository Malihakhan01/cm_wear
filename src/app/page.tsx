import React from "react";
import { HeroSection } from "@/components/homepage/HeroSection";
import { CategoryGridSection } from "@/components/homepage/CategoryGridSection";
import { CustomizerDemoSection } from "@/components/homepage/CustomizerDemoSection";
import { FeaturedProductsSection } from "@/components/homepage/FeaturedProductsSection";
import { ManufacturingStorySection } from "@/components/homepage/ManufacturingStorySection";
import { FabricLibrarySection } from "@/components/homepage/FabricLibrarySection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { FaqSection } from "@/components/homepage/FaqSection";
import { FinalQuoteCtaSection } from "@/components/homepage/FinalQuoteCtaSection";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 01. Editorial Hero */}
      <HeroSection />

      {/* 02. Interactive Customization Studio (Directly after Hero - HDS_WEAR Customizer) */}
      <CustomizerDemoSection />

      {/* 03. Category Introduction & Editorial Grid (Off-White) */}
      <CategoryGridSection />

      {/* 04. Featured Products Catalog with Wholesale/Retail Pricing (White) */}
      <FeaturedProductsSection />

      {/* 05. Every Finish Made To Order (Interactive Finish Showcase) */}
      <ManufacturingStorySection />

      {/* 06. Sketch to Shipment (Pinned Horizontal Process Track) */}
      <FabricLibrarySection />

      {/* 07. Buyer Perspectives & Testimonials (Off-White) */}
      <TestimonialsSection />

      {/* 12. Technical Sourcing FAQs (White) */}
      <FaqSection />

      {/* 13. Final Quote & Tech Pack CTA (Olive / Dark Transition) */}
      <FinalQuoteCtaSection />
    </div>
  );
}
