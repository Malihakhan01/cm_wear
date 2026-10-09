"use client";

import React from "react";
import { Product } from "@/types";
import { siteConfig } from "@/config/site.config";
import { MessageCircle } from "lucide-react";

interface WhatsAppInquiryButtonProps {
  product: Product;
  quantity?: number;
  selectedColor?: string;
  customization?: string;
  className?: string;
}

export const WhatsAppInquiryButton: React.FC<WhatsAppInquiryButtonProps> = ({
  product,
  quantity,
  selectedColor,
  customization,
  className = "",
}) => {
  const units = quantity || product.MOQ || 50;
  const colorName = selectedColor || product.colors[0]?.name || "Standard";
  const customSummary = customization || product.decorationMethods[0] || "Custom Branding";

  const messageText = `Hello ${siteConfig.name},

I am interested in apparel manufacturing:
• Product: ${product.name}
• SKU: ${product.sku}
• Category: ${product.category}
• Target Quantity: ${units} PCS
• Desired Color: ${colorName}
• Customization: ${customSummary}

Please advise on unit pricing, lab-dip schedule, and pre-production sampling.`;

  const whatsAppUrl = `https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent(
    messageText
  )}`;

  return (
    <a
      href={whatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors shadow-xs ${className}`}
      title="Direct chat with Sialkot factory production engineer"
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      <span>Inquire on WhatsApp</span>
    </a>
  );
};
