"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-[#2A2A28] pt-16 pb-0 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
        
        {/* Top Newsletter & Sourcing Brief Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#2A2A28] items-center">
          <div className="lg:col-span-7 space-y-2">
            <span className="eyebrow-label text-[#FF333D]">
              Manufacturing Intelligence & Fabric Drops
            </span>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-display">
              Join 1,200+ International Apparel Brands & Team Directors
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Receive quarterly technical fabric reports, yarn pricing updates, and private label production slot announcements.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#20201E] border border-[#D61C24] text-[#FF333D] text-xs font-mono rounded-[2px]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you. You are enrolled in the quarterly sourcing dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter procurement or brand email..."
                  required
                  className="flex-1 bg-[#20201E] border border-[#3A3A36] focus:border-[#D61C24] px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 rounded-[2px] focus:outline-hidden font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#2A2A28]">
          
          {/* Column 1: Products */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#D61C24] rounded-full" />
              Products (8 Categories)
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {siteConfig.mainCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/catalog?category=${c.id}`}
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="text-[10px] font-mono text-[#D61C24]">{c.number}</span>
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#D61C24] rounded-full" />
              Manufacturing &amp; Services
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/manufacturing" className="hover:text-white transition-colors">
                  Apparel Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/private-label" className="hover:text-white transition-colors">
                  OEM / Private Label Solutions
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-white transition-colors">
                  Wholesale Volume Tiers
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Technical Resources &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/customization" className="hover:text-white transition-colors">
                  Decoration &amp; Printing
                </Link>
              </li>
              <li>
                <Link href="/customize" className="hover:text-white transition-colors">
                  Interactive Product Customizer
                </Link>
              </li>
              <li>
                <Link href="/quality-control" className="hover:text-white transition-colors">
                  AQL 2.5 Quality Assurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#D61C24] rounded-full" />
              Company & Facility
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About TAWFIQ INDUSTRIES
                </Link>
              </li>
              <li className="flex items-start gap-1.5 text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-[#D61C24] shrink-0 mt-0.5" />
                <span className="leading-snug">PO SAME 51310, ADDHA, Daska Rd, Beerh, Sialkot, 51310</span>
              </li>
              <li>
                <a
                  href="mailto:info@tawfiqindustry.com"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>info@tawfiqindustry.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:03484552164"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>03484552164</span>
                </a>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Technical Apparel Guides
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-white transition-colors">
                  Fabric & GSM Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Support */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#D61C24] rounded-full" />
              Support & Logistics
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Live Production
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="hover:text-white transition-colors">
                  Submit Specification (RFQ)
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Commercial Incoterms (DDP/FOB)
                </Link>
              </li>
              <li>
                <Link href="/saved-designs" className="hover:text-white transition-colors">
                  Client Saved Designs
                </Link>
              </li>
              <li>
                <Link href="/resources/faq" className="hover:text-white transition-colors">
                  Manufacturing FAQs
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & All Rights Reserved Line - Directly Above Site Name as in Screenshot 2 */}
        <div className="pt-10 pb-4 border-t border-[#2A2A28] flex flex-col sm:flex-row items-center justify-between text-neutral-400 text-xs font-mono gap-3">
          <div>
            &copy; {new Date().getFullYear()} Tawfiq Industries. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
            <Link href="/resources" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/resources" className="hover:text-white transition-colors">Terms of Manufacturing</Link>
            <span>&bull;</span>
            <Link href="/resources" className="hover:text-white transition-colors">AQL Standards</Link>
          </div>
        </div>

        {/* Site Name in Bottom: Modern, non-italic bold architectural typography */}
        <div className="w-full select-none pointer-events-none overflow-hidden pt-4 pb-0 -mb-1">
          <svg
            viewBox="0 0 1200 95"
            className="w-full h-auto block select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x="50%"
              y="78"
              textAnchor="middle"
              fill="#FFFFFF"
              className="uppercase select-none"
              style={{
                fontSize: "82px",
                fontWeight: 900,
                fontStyle: "normal",
                fontFamily: "'Archivo', 'Space Grotesk', system-ui, -apple-system, sans-serif",
                letterSpacing: "0.06em",
              }}
            >
              TAWFIQ INDUSTRIES
            </text>
          </svg>
        </div>

      </div>
    </footer>
  );
};
