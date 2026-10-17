import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, Award, FileCheck, Download, ExternalLink, ArrowRight, CheckCircle2, Globe, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Factory Certifications & Legal Accreditations | CM SPORTS WEAR",
  description: "Official trade accreditations, Sialkot Chamber of Commerce & Industry membership, Pakistan Hosiery Manufacturers Association compliance certificates for CM SPORTS WEAR.",
};

interface CertificateItem {
  id: string;
  title: string;
  authority: string;
  regNo: string;
  year: string;
  description: string;
  pdfUrl: string;
  badge: string;
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: "scci",
    title: "Sialkot Chamber of Commerce & Industry (SCCI)",
    authority: "Sialkot Chamber of Commerce & Industry",
    regNo: "Corporate Class Exporter",
    year: "Valid Thru 2026/2027",
    description: "Official legal chamber accreditation certifying CM SPORTS WEAR / Care Master as a certified manufacturer and authorized direct exporter of technical athletic garments and sports goods.",
    pdfUrl: "/certificates/chember certificate care master 26.pdf",
    badge: "Official Chamber Member",
  },
  {
    id: "phma",
    title: "Pakistan Hosiery Manufacturers & Exporters Association (PHMA)",
    authority: "PHMA National Executive Council",
    regNo: "Textile & Knitwear Division",
    year: "Valid Thru 2026/2027",
    description: "National industry body accreditation validating knitwear standards, ethical labor compliance, export yarn testing, and modern automated knitting plant standards.",
    pdfUrl: "/certificates/pak hosiery manufacturer certificate 26.pdf",
    badge: "Export Apparel Council",
  },
  {
    id: "surgical-assoc",
    title: "Surgical Instruments & Equipment Manufacturers Association",
    authority: "SIMAP Association of Pakistan",
    regNo: "Precision Equipment Division",
    year: "Valid Thru 2026/2027",
    description: "Accreditation verifying advanced sterile cutting, medical workwear fabrication compliance, and precision needle crafting standards in Sialkot industrial campus.",
    pdfUrl: "/certificates/surgical association certificate 26.pdf",
    badge: "Quality Accreditation",
  },
];

export default function CertificationsPage() {
  return (
    <div className="w-full bg-[#FAFAF8] text-[#0A0A0A] min-h-screen">
      
      {/* Header */}
      <section className="bg-[#0A0A0A] text-white py-16 sm:py-24 border-b border-[#2A2A28] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF333D] font-bold">
                LEGAL COMPLIANCE &amp; ACCREDITATIONS
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Verified Factory Certifications
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl">
              CM SPORTS WEAR operates in strict adherence to international trade laws, ethical labor benchmarks, and environmental regulations. Direct verified certificates available for international customs clearance and retail compliance audits.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero Child Labor Policy
              </span>
              <span>&bull;</span>
              <span>ISO 9001 Compliant QMS</span>
              <span>&bull;</span>
              <span>AQL 2.5 Audit Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="eyebrow-label text-[#D61C24]">GOVERNMENT &amp; TRADE SEALS</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A] font-display">
              Export Accreditations &amp; Memberships
            </h2>
            <p className="text-xs sm:text-sm text-[#72726D]">
              Direct original document scans available for institutional brand vendor onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-[#DADBD2] rounded-[2px] p-7 flex flex-col justify-between hover:border-[#D61C24] transition-all shadow-2xs group"
              >
                <div className="space-y-5">
                  
                  {/* Top Seal */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-[2px] bg-[#0A0A0A] text-[#D61C24] flex items-center justify-center border border-[#20201E] group-hover:scale-105 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-[1px] bg-[#F4F4EF] text-[#D61C24] border border-[#DADBD2]">
                      {cert.badge}
                    </span>
                  </div>

                  {/* Live Certificate PDF Document Preview Box */}
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full aspect-[4/3] bg-neutral-900 rounded-[2px] overflow-hidden border border-[#E5E5E0] group-hover:border-[#D61C24] transition-colors cursor-pointer group/preview"
                  >
                    <object
                      data={`${cert.pdfUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      className="w-full h-full pointer-events-none select-none bg-neutral-950"
                      title={`${cert.title} Preview`}
                    >
                      <iframe
                        src={`${cert.pdfUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-0 pointer-events-none select-none bg-neutral-950"
                        title={`${cert.title} Preview`}
                        loading="lazy"
                      />
                    </object>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3 pointer-events-none transition-opacity group-hover/preview:opacity-90">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-black/70 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                        <FileCheck className="w-3 h-3 text-emerald-400" />
                        Legal Scan
                      </span>
                      <span className="text-[10px] font-mono text-white/90 bg-[#D61C24] px-2 py-0.5 rounded font-bold">
                        Click to Open
                      </span>
                    </div>
                  </a>

                  {/* Body */}
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight font-display text-black group-hover:text-[#D61C24] transition-colors leading-snug">
                      {cert.title}
                    </h3>
                    <div className="text-xs font-mono text-[#D61C24] font-semibold mt-1">
                      {cert.authority}
                    </div>
                    <p className="text-xs text-[#72726D] mt-3 leading-relaxed font-sans">
                      {cert.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="bg-[#F4F4EF] p-3 rounded-[2px] border border-[#DADBD2] text-[11px] font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Classification:</span>
                      <span className="font-bold text-black">{cert.regNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Status:</span>
                      <span className="font-bold text-emerald-600">{cert.year}</span>
                    </div>
                  </div>

                </div>

                {/* PDF Actions */}
                <div className="pt-6 mt-6 border-t border-[#F4F4EF] grid grid-cols-2 gap-2">
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </a>
                  <a
                    href={cert.pdfUrl}
                    download
                    className="px-3 py-2.5 bg-[#F4F4EF] hover:bg-[#EAEAE2] text-[#0A0A0A] border border-[#DADBD2] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D61C24]" />
                    <span>Download</span>
                  </a>
                </div>

              </div>
            ))}
          </div>

          {/* Social Compliance & Factory Standards Checklist */}
          <div className="mt-16 bg-white border border-[#DADBD2] rounded-[2px] p-8">
            <h3 className="text-xl font-bold uppercase font-display text-black mb-6">
              Production Standards &amp; Ethical Guarantees
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-sans">
              <div className="space-y-2 p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2]">
                <div className="font-mono font-bold uppercase text-[#D61C24]">01. Fair Labor Code</div>
                <p className="text-[#72726D] leading-relaxed">
                  Strict 100% adherence to ILO international labor conventions. Living wages, medical coverage, ventilation, and fire safety systems installed.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2]">
                <div className="font-mono font-bold uppercase text-[#D61C24]">02. OEKO-TEX Standard</div>
                <p className="text-[#72726D] leading-relaxed">
                  All inks, reactive dyes, and sublimation vectors are skin-safe, hypoallergenic, and certified free of heavy metals and formaldehyde.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2]">
                <div className="font-mono font-bold uppercase text-[#D61C24]">03. AQL 2.5 Inspection</div>
                <p className="text-[#72726D] leading-relaxed">
                  Multi-stage optical quality audits: raw yarn tensile check, post-embroidery inspection, 100% metal needle detector sweep before polybag sealing.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-[#F4F4EF] rounded-[2px] border border-[#DADBD2]">
                <div className="font-mono font-bold uppercase text-[#D61C24]">04. Turnkey Export Port</div>
                <p className="text-[#72726D] leading-relaxed">
                  Complete documentation for direct air courier (Sialkot International Airport - SKT) and sea freight (Karachi Port) with DDP, FOB, or CIF terms.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#DADBD2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#72726D]">
                🏢 Facility: Taj Palace, Khadim Ali Road, Sialkot 51310, Pakistan
              </div>
              <Link
                href="/request-quote"
                className="px-6 py-3 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
              >
                <span>Request Vendor Audit Pack</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
