import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { FileText, Download, ExternalLink, ArrowRight, ShieldCheck, Sparkles, BookOpen, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Official Product Catalogs & PDF Spec Sheets | CM SPORTS WEAR",
  description: "Browse and download official CM SPORTS WEAR manufacturing catalogues, technical spec sheets, ice hockey profiles, varsity jacket catalogs, and combat sports lookbooks.",
};

interface CatalogItem {
  id: string;
  title: string;
  category: string;
  size: string;
  pages: string;
  description: string;
  fileUrl: string;
  featured?: boolean;
}

const CATALOGS: CatalogItem[] = [
  {
    id: "cm-master",
    title: "CM SPORTS Master Production Catalogue",
    category: "Master Lookbook",
    size: "24.3 MB",
    pages: "Full Range",
    description: "Complete flagship catalogue encompassing high-performance teamwear, technical athletic gear, outerwear, and sublimation sports uniforms.",
    fileUrl: "/catalogs/CM SPORTS CATALOGUE .pdf",
    featured: true,
  },
  {
    id: "ice-hockey",
    title: "Ice Hockey Equipment & Team Uniform Profile",
    category: "Team Sports",
    size: "2.2 MB",
    pages: "Specialized",
    description: "Factory technical specifications for pro arena ice hockey jerseys, fight straps, tackle twill cresting, and protective athletic gear.",
    fileUrl: "/catalogs/CARE MASTER ICE HOCKEY PROFILE.pdf",
    featured: true,
  },
  {
    id: "varsity-jackets",
    title: "Mens Varsity & Letterman Jacket Catalogue",
    category: "Jackets & Outerwear",
    size: "3.7 MB",
    pages: "Signature",
    description: "Heavyweight 24 oz Melton wool, full-grain cowhide leather sleeves, chenille embroidery, and custom rib-knit varsity jacket collections.",
    fileUrl: "/catalogs/Mens Varisty Jacket Care Master Catalogue_compressed.pdf",
    featured: true,
  },
  {
    id: "martial-arts",
    title: "Martial Arts Uniforms & Gis Catalogue",
    category: "Combat Sports",
    size: "4.9 MB",
    pages: "Comprehensive",
    description: "Brazilian Jiu-Jitsu Pearl Weave gis, Karate traditional uniforms, Taekwondo doboks, and tear-resistant combat training apparel.",
    fileUrl: "/catalogs/Martial Arts catalouge.pdf",
  },
  {
    id: "fitness-wear",
    title: "Fitness & Activewear Manufacturing Catalogue",
    category: "Activewear",
    size: "6.6 MB",
    pages: "Technical",
    description: "Seamless leggings, gym shorts, performance stringers, moisture-wicking compression tees, and athleisure essentials.",
    fileUrl: "/catalogs/Catalouge fitness wear.pdf",
  },
  {
    id: "compression-wear",
    title: "Technical Compression Wear Spec Sheet",
    category: "Activewear",
    size: "2.8 MB",
    pages: "Technical",
    description: "Multi-panel anatomical compression tops, rashguards, gradient pressure recovery tights, and flatlock athletic gear.",
    fileUrl: "/catalogs/Compression wear catalouge.pdf",
  },
  {
    id: "boxing-gear",
    title: "Boxing & Combat Gear Catalogue",
    category: "Combat Sports",
    size: "10.2 MB",
    pages: "Heavy Equipment",
    description: "Pro sparring gloves, Thai punch mitts, headgear, training shorts, and hand wraps handcrafted in genuine leather.",
    fileUrl: "/catalogs/Boxing Catalogue (2).pdf",
  },
  {
    id: "tactical-uniforms",
    title: "Workwear & Tactical Uniforms Catalogue",
    category: "Workwear & Medical",
    size: "10.4 MB",
    pages: "Utility & Defense",
    description: "Ripstop tactical pants, high-visibility safety jackets, reinforced duty shirts, and heavy-duty institutional workwear.",
    fileUrl: "/catalogs/CARE MASTER police-catalogue (1).pdf.pdf",
  },
];

export default function CatalogsPage() {
  return (
    <div className="w-full bg-[#FAFAF8] text-[#0A0A0A] min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-[#0A0A0A] text-white py-16 sm:py-24 border-b border-[#2A2A28] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF333D] font-bold">
                FACTORY TECHNICAL DOCUMENTATION
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.95]">
              Product Catalogs &amp; Spec Books
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-2xl">
              Download our comprehensive manufacturing catalogues covering technical fabrications, sizing specifications, embellishment blueprints, and OEM/ODM private label programs.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D61C24]" />
                Direct Sialkot Manufacturer
              </span>
              <span>&bull;</span>
              <span>Updated for 2026 Season</span>
              <span>&bull;</span>
              <span>Instant High-Res PDF Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#DADBD2]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D61C24] font-bold">
                ARCHIVE DOWNLOADS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display text-black">
                {CATALOGS.length} Technical Publications
              </h2>
            </div>
            <p className="text-xs text-[#72726D] font-mono max-w-sm">
              All files are provided in universal PDF format. For printed physical swatch binders, contact our international sales desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATALOGS.map((item) => (
              <div
                key={item.id}
                className={`bg-white border ${
                  item.featured ? "border-[#D61C24] shadow-md ring-1 ring-[#D61C24]/10" : "border-[#DADBD2] shadow-2xs"
                } rounded-[2px] p-6 flex flex-col justify-between hover:border-[#D61C24] transition-all group`}
              >
                <div className="space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-[1px] bg-[#F4F4EF] text-[#0A0A0A] border border-[#DADBD2]">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#72726D]">
                      <FileText className="w-3.5 h-3.5 text-[#D61C24]" />
                      <span>{item.size}</span>
                    </div>
                  </div>

                  {/* Live PDF Document Preview Box */}
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full aspect-[4/3] bg-neutral-900 rounded-[2px] overflow-hidden border border-[#E5E5E0] group-hover:border-[#D61C24] transition-colors cursor-pointer group/preview"
                  >
                    <object
                      data={`${item.fileUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      className="w-full h-full pointer-events-none select-none bg-neutral-950"
                      title={`${item.title} Preview`}
                    >
                      <iframe
                        src={`${item.fileUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-0 pointer-events-none select-none bg-neutral-950"
                        title={`${item.title} Preview`}
                        loading="lazy"
                      />
                    </object>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3 pointer-events-none transition-opacity group-hover/preview:opacity-90">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-black/70 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                        <FileText className="w-3 h-3 text-[#D61C24]" />
                        PDF Preview
                      </span>
                      <span className="text-[10px] font-mono text-white/90 bg-[#D61C24] px-2 py-0.5 rounded font-bold">
                        Click to Open
                      </span>
                    </div>
                  </a>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight font-display text-black group-hover:text-[#D61C24] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#72726D] mt-2 leading-relaxed font-sans line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-6 border-t border-[#F4F4EF] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </a>
                    <a
                      href={item.fileUrl}
                      download
                      className="px-3 py-2.5 bg-[#F4F4EF] hover:bg-[#EAEAE2] text-[#0A0A0A] border border-[#DADBD2] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D61C24]" />
                      <span>Download</span>
                    </a>
                  </div>

                  <Link
                    href={`/request-quote?catalog=${encodeURIComponent(item.title)}`}
                    className="block text-center text-[11px] font-mono text-[#72726D] hover:text-[#D61C24] transition-colors py-1"
                  >
                    Request Bulk Pricing for this Catalog &rarr;
                  </Link>
                </div>

              </div>
            ))}
          </div>

          {/* Factory Direct Business Card / Inquiry Banner */}
          <div className="mt-14 bg-white border border-[#DADBD2] rounded-[2px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[2px] bg-[#0A0A0A] flex items-center justify-center shrink-0 border border-[#20201E]">
                <BookOpen className="w-7 h-7 text-[#D61C24]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold uppercase font-display text-black">
                  Need a Custom Physical Swatch Kit or Custom Presentation?
                </h4>
                <p className="text-xs text-[#72726D] font-sans max-w-xl">
                  We courier physical GSM fabric rings, Pantone color ring swatches, and physical pre-production sample specimens globally via DHL Express.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/request-quote"
                className="px-6 py-3 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
              >
                <span>Request Swatches</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-[#F4F4EF] hover:bg-[#EAEAE2] text-black border border-[#DADBD2] text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
