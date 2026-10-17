"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("OEM Production Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setIsSubmitting(true);
      try {
        const { apiClient } = await import("@/services/api.client");
        await apiClient.post("/inquiries/contact", {
          name,
          email,
          company,
          subject,
          message,
        });
      } catch (err) {
        console.warn("Backend contact dispatch fallback:", err);
      } finally {
        setIsSubmitting(false);
        setSubmitted(true);
      }
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF333D] mb-3">
            <span className="w-1.5 h-1.5 bg-[#FF333D] rounded-full animate-pulse" />
            <span>GLOBAL PROCUREMENT & CLIENT DESK</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight font-display text-white mb-4">
            CONTACT US
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl font-sans">
            Connect directly with our engineering and procurement team for custom manufacturing, sample development, technical tech packs, and factory volume contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Direct Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick WhatsApp Action Card */}
            <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
                    Direct WhatsApp Support
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Instant response for brand founders & tech leads
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${siteConfig.whatsAppFormattedNumber}?text=${encodeURIComponent("Hello CM SPORTS WEAR, I would like to inquire about apparel manufacturing.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Chat On WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Factory & Procurement Details */}
            <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl space-y-6">
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#FF333D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-mono uppercase text-neutral-400">
                    Procurement & Inquiries
                  </div>
                  <a
                    href={`mailto:${siteConfig.inquiryEmail}`}
                    className="text-sm font-mono text-white hover:text-[#FF333D] transition-colors"
                  >
                    {siteConfig.inquiryEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#FF333D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-mono uppercase text-neutral-400">
                    Phone / International Desk
                  </div>
                  <a
                    href={`tel:${siteConfig.whatsAppNumber}`}
                    className="text-sm font-mono text-white hover:text-[#FF333D] transition-colors"
                  >
                    {siteConfig.whatsAppNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#FF333D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-mono uppercase text-neutral-400">
                    Manufacturing Campus
                  </div>
                  <p className="text-sm text-neutral-300 font-sans">
                    {siteConfig.address.campus}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono mt-1">
                    Coordinates: {siteConfig.address.coordinates}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#FF333D] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-mono uppercase text-neutral-400">
                    Factory Production Hours
                  </div>
                  <p className="text-sm text-neutral-300 font-sans">
                    Monday – Saturday: 08:00 – 18:00 PKT (GMT+5)
                  </p>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    SLA Response: Under 24 hours for official quote submissions
                  </p>
                </div>
              </div>

            </div>

            {/* Quality & Production Badges */}
            <div className="p-4 bg-[#141414]/50 border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF333D]" />
                ISO 9001:2015 Certified
              </span>
              <span>OEKO-TEX 100</span>
            </div>

          </div>

          {/* Right: Direct Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-[#141414] border border-white/10 rounded-2xl">
              
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-14 h-14 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase font-display text-white">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{name}</strong>. Our technical production team will review your requirements and respond to <strong className="text-white">{email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-white text-black text-xs font-mono uppercase font-bold rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
                      Send Direct Message
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Fill out the form below or request a complete quotation matrix via our quote builder.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#1C1C1C] border border-white/10 focus:border-[#FF333D] px-4 py-3 text-sm text-white placeholder-neutral-600 rounded-xl focus:outline-hidden font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
                        Brand / Company Name
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Atelier Brand Studio"
                        className="w-full bg-[#1C1C1C] border border-white/10 focus:border-[#FF333D] px-4 py-3 text-sm text-white placeholder-neutral-600 rounded-xl focus:outline-hidden font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="buyer@brand.com"
                        className="w-full bg-[#1C1C1C] border border-white/10 focus:border-[#FF333D] px-4 py-3 text-sm text-white placeholder-neutral-600 rounded-xl focus:outline-hidden font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
                        Subject / Inquiry Type
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-white/10 focus:border-[#FF333D] px-4 py-3 text-sm text-white rounded-xl focus:outline-hidden font-sans"
                      >
                        <option value="OEM Production Inquiry">OEM Production Inquiry</option>
                        <option value="Custom Sample Development">Custom Sample Development</option>
                        <option value="Wholesale Volume Order">Wholesale Volume Order</option>
                        <option value="Factory Visit / Audit">Factory Visit / Audit</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
                      Project Specifications & Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Include product category, target quantity, fabric specifications (e.g. 450 GSM French Terry), delivery timeline, etc."
                      className="w-full bg-[#1C1C1C] border border-white/10 focus:border-[#FF333D] p-4 text-sm text-white placeholder-neutral-600 rounded-xl focus:outline-hidden font-sans resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#FF333D] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xl"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Direct Inquiry</span>
                    </button>

                    <Link
                      href="/request-quote"
                      className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>Need detailed pricing? Open Quote Builder</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
