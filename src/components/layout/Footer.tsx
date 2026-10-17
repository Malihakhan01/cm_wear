"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      try {
        await fetch(`${siteConfig.apiUrl}/inquiries/newsletter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch (err) {
        console.warn("Newsletter backend sync fallback:", err);
      }
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
              Products (9 Categories)
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/catalog/?category=team-sports-wear" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">01</span>
                  Team Sports Wear
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=martial-arts-combat-wear" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">02</span>
                  Martial Arts & Combat Wear
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=activewear-fitness" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">03</span>
                  Activewear & Fitness
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=casual-lifestyle-wear" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">04</span>
                  Casual & Lifestyle Wear
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=jackets-outerwear" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">05</span>
                  Jackets & Outerwear
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=kids-youth-wear" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">06</span>
                  Kids & Youth Wear
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=workwear-medical-wear" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">07</span>
                  Workwear & Medical Wear
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=sports-accessories" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">08</span>
                  Sports Accessories
                </Link>
              </li>
              <li>
                <Link href="/catalog/?category=gloves" className="hover:text-white transition-colors">
                  <span className="text-[#FF333D] font-mono mr-1.5">09</span>
                  Gloves
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Manufacturing & Services */}
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-widest mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#D61C24] rounded-full" />
              Manufacturing & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/manufacturing" className="hover:text-white transition-colors">
                  Apparel Manufacturing Facility
                </Link>
              </li>
              <li>
                <Link href="/catalogs" className="hover:text-white transition-colors text-white font-semibold">
                  Official PDF Product Catalogs
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-white transition-colors text-white font-semibold">
                  Chamber & Industry Certificates
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="hover:text-white transition-colors text-white font-semibold flex items-center gap-1">
                  <span>Global Trade Exhibitions</span>
                  <span className="text-[9px] font-mono bg-[#D61C24] text-white px-1.5 py-0.2 rounded-[1px]">NEW</span>
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
                <Link href="/customization" className="hover:text-white transition-colors">
                  Decoration & Printing
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
                <Link href="/about" className="hover:text-white transition-colors font-semibold text-white">
                  About CM SPORTS WEAR
                </Link>
              </li>
              <li className="flex items-start gap-1.5 text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-[#D61C24] shrink-0 mt-0.5" />
                <span className="leading-snug">{siteConfig.address.full}</span>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>{siteConfig.supportEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.whatsAppFormattedNumber}`}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>{siteConfig.whatsAppNumber}</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+92523558586"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D61C24]" />
                  <span>+92-52-3558586</span>
                </a>
              </li>
              <li>
                <Link href="/catalogs" className="hover:text-white transition-colors">
                  Download Catalogues
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-white transition-colors">
                  Export Accreditations
                </Link>
              </li>
              <li className="pt-2 border-t border-[#2A2A28]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                  Official Social Channels
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={siteConfig.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#181816] hover:bg-[#1877F2]/20 hover:text-[#1877F2] text-neutral-300 border border-[#2A2A28] hover:border-[#1877F2]/40 rounded-[2px] text-xs font-mono transition-colors"
                    title="Follow CM SPORTS WEAR on Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                  <a
                    href={siteConfig.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#181816] hover:bg-[#E4405F]/20 hover:text-[#E4405F] text-neutral-300 border border-[#2A2A28] hover:border-[#E4405F]/40 rounded-[2px] text-xs font-mono transition-colors"
                    title="Follow CM SPORTS WEAR on Instagram"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </div>
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
                <Link href="/contact" className="hover:text-white transition-colors">
                  Factory Logistics & Visit
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & All Rights Reserved Line */}
        <div className="pt-10 pb-4 border-t border-[#2A2A28] flex flex-col sm:flex-row items-center justify-between text-neutral-400 text-xs font-mono gap-3">
          <div>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
            <Link href="/catalogs" className="hover:text-white transition-colors text-neutral-400">Catalogs</Link>
            <span>&bull;</span>
            <Link href="/certifications" className="hover:text-white transition-colors text-neutral-400">Certifications</Link>
            <span>&bull;</span>
            <Link href="/resources/faq" className="hover:text-white transition-colors text-neutral-400">FAQs</Link>
            <span>&bull;</span>
            <Link href="/resources" className="hover:text-white transition-colors">Terms of Manufacturing</Link>
            <span>&bull;</span>
            <Link href="/resources" className="hover:text-white transition-colors">AQL Standards</Link>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#1877F2] text-neutral-400 hover:text-white flex items-center justify-center transition-all border border-white/10"
              aria-label="Facebook"
              title="CM SPORTS WEAR on Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E4405F] text-neutral-400 hover:text-white flex items-center justify-center transition-all border border-white/10"
              aria-label="Instagram"
              title="CM SPORTS WEAR on Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        {/* Site Name in Bottom: Modern Architectural Bold Typography */}
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
                fontSize: "76px",
                fontWeight: 900,
                fontStyle: "normal",
                fontFamily: "'Archivo', 'Space Grotesk', system-ui, -apple-system, sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              CM SPORTS WEAR
            </text>
          </svg>
        </div>

      </div>
    </footer>
  );
};
