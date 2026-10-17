"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site.config";

export const FloatingWhatsApp: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show a subtle greeting tooltip after 3.5 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const message = encodeURIComponent(
    `Hello ${siteConfig.name}, I would like to inquire about apparel manufacturing and bulk custom production.`
  );
  const whatsAppUrl = `https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${message}`;

  return (
    <aside aria-label="WhatsApp Direct Support" className="fixed bottom-6 right-6 z-[9990] flex items-center gap-3">
      {/* Floating Interactive Tooltip / Prompt */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Message"
        className={`hidden sm:flex items-center gap-2.5 bg-[#0A0A0A]/95 text-white backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-full shadow-xl transition-all duration-300 hover:border-[#25D366]/40 cursor-pointer ${
          showPrompt ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto"
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
        </span>
        <span className="text-xs font-sans font-semibold tracking-wide">
          WhatsApp: {siteConfig.whatsAppNumber}
        </span>
      </a>

      {/* Main WhatsApp Floating Action Button */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with CM SPORTS WEAR"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* White WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.12 7.42L2 30l6.76-2.1C10.84 29.18 13.34 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.62c-2.38 0-4.6-.68-6.48-1.84l-.46-.28-4.46 1.38 1.4-4.32-.3-.48C4.46 20.14 3.78 18.14 3.78 16 3.78 9.26 9.26 3.78 16 3.78c6.74 0 12.22 5.48 12.22 12.22 0 6.74-5.48 12.22-12.22 12.22zm6.72-9.14c-.36-.18-2.16-1.06-2.5-1.18-.34-.12-.58-.18-.82.18-.24.36-.94 1.18-1.16 1.42-.22.24-.44.26-.8.08-.36-.18-1.52-.56-2.9-1.8-1.08-.96-1.8-2.16-2.02-2.52-.22-.36-.02-.56.16-.74.16-.16.36-.42.54-.62.18-.2.24-.36.36-.58.12-.24.06-.44-.04-.62-.1-.18-.82-2-1.14-2.74-.3-.72-.62-.62-.84-.64-.22-.02-.46-.02-.7-.02-.24 0-.64.08-.98.44-.34.36-1.3 1.28-1.3 3.12s1.34 3.62 1.52 3.86c.18.24 2.62 4.02 6.36 5.64.88.38 1.58.62 2.12.8.9.28 1.72.24 2.36.14.72-.1 2.16-.88 2.46-1.74.3-.86.3-1.6.22-1.74-.1-.14-.34-.22-.7-.4z" />
        </svg>

        {/* Online Status Green Dot with White Border (matches user screenshot) */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] border-2 border-white shadow-xs"></span>
        </span>
      </a>
    </aside>
  );
};
