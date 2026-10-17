import React from "react";
import { HeroSection } from "@/components/homepage/HeroSection";
import { CategoryGridSection } from "@/components/homepage/CategoryGridSection";
import { CustomizerDemoSection } from "@/components/homepage/CustomizerDemoSection";
import { FeaturedProductsSection } from "@/components/homepage/FeaturedProductsSection";
import { ManufacturingStorySection } from "@/components/homepage/ManufacturingStorySection";
import { FabricLibrarySection } from "@/components/homepage/FabricLibrarySection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { LatestBlogSection } from "@/components/homepage/LatestBlogSection";
import { FaqSection } from "@/components/homepage/FaqSection";
import { FinalQuoteCtaSection } from "@/components/homepage/FinalQuoteCtaSection";
import { WelcomeCustomizerModal } from "@/components/homepage/WelcomeCustomizerModal";
import { ProductionTourSection } from "@/components/homepage/ProductionTourSection";
import { ExhibitionsSection } from "@/components/homepage/ExhibitionsSection";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Interactive Customizer & Blank Inquiry Welcome Popup */}
      <WelcomeCustomizerModal />

      {/* 01. Editorial Hero */}
      <HeroSection />

      {/* 02. Interactive Customization Studio (Directly after Hero - CM SPORTS WEAR Customizer Studio) */}
      <CustomizerDemoSection />

      {/* 03. Category Introduction & Editorial Grid (Off-White) */}
      <CategoryGridSection />

      {/* 04. Featured Products Catalog with Wholesale/Retail Pricing (White) */}
      <FeaturedProductsSection />

      {/* 05. Inside Sialkot Campus - Advanced Vertical Manufacturing & Videos */}
      <ProductionTourSection />

      {/* 06. Every Finish Made To Order (Interactive Finish Showcase) */}
      <ManufacturingStorySection />

      {/* 07. Sketch to Shipment (Pinned Horizontal Process Track) */}
      <FabricLibrarySection />

      {/* 08. Global Trade Exhibitions & International Stand History */}
      <ExhibitionsSection />

      {/* 09. Buyer Perspectives & Testimonials (Off-White) */}
      <TestimonialsSection />

      {/* 08. Manufacturing Blog & Technical Whitepapers (White) */}
      <LatestBlogSection />

      {/* 09. Technical Sourcing FAQs (White) */}
      <FaqSection />

      {/* 10. Final Quote & Tech Pack CTA (Olive / Dark Transition) */}
      <FinalQuoteCtaSection />
    </div>
  );
}
