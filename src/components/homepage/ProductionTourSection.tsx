"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Pause, ShieldCheck, Factory, Cpu, ArrowRight, Layers, Sparkles, CheckCircle2 } from "lucide-react";

interface VideoClip {
  id: string;
  title: string;
  stage: string;
  duration: string;
  url: string;
}

const PRODUCTION_VIDEOS: VideoClip[] = [
  {
    id: "v1",
    title: "Heavy Industrial Stitching & Assembly",
    stage: "Assembly Hall",
    duration: "0:25",
    url: "/videos/VID-20200925-WA0003.mp4",
  },
  {
    id: "v2",
    title: "Tajima Multi-Head Embroidery Operations",
    stage: "Embellishment",
    duration: "0:21",
    url: "/videos/VID-20211001-WA0017.mp4",
  },
  {
    id: "v3",
    title: "Optical Needle Detection & Quality Inspection",
    stage: "AQL 2.5 Audit",
    duration: "0:15",
    url: "/videos/VID-20220127-WA0062.mp4",
  },
  {
    id: "v4",
    title: "Finished Garment Steaming & Retail Packing",
    stage: "Export Dispatch",
    duration: "0:12",
    url: "/videos/VID-20220127-WA0065.mp4",
  },
];

const PRODUCTION_PHOTOS = [
  {
    src: "/production/1.jpg",
    title: "CAD Grading & Precision Cutting",
    desc: "Computerized knife cutting tables ensuring 0.5mm pattern tolerance.",
  },
  {
    src: "/production/2.jpg",
    title: "Tajima Industrial Embroidery Array",
    desc: "20-needle high-speed heads rendering dimensional crests and metallic threading.",
  },
  {
    src: "/production/3.jpg",
    title: "Heavy-Gauge Flatlock Stitching",
    desc: "4-needle 6-thread flatlock stitching for zero friction athletic stretch.",
  },
  {
    src: "/production/8.jpg",
    title: "Sublimation Heat Transfer Line",
    desc: "210°C pneumatic rotary presses infusing vibrant vectors into warp-knit poly.",
  },
  {
    src: "/production/14.jpg",
    title: "Technical Outerwear Seam Sealing",
    desc: "Hot-air polyurethane waterproofing tape application over needle holes.",
  },
  {
    src: "/production/20.jpg",
    title: "Cleanroom Final Packaging",
    desc: "Barcoded 80-micron frosted ziplock polybags ready for global air courier.",
  },
];

export const ProductionTourSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState(PRODUCTION_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 sm:py-28 bg-[#0A0A0A] text-white border-b border-[#2A2A28] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#20201E]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-pulse" />
              <span className="eyebrow-label text-[#FF333D]">INSIDE THE SIALKOT CAMPUS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white font-display leading-[0.93]">
              Advanced Vertical Manufacturing
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              From raw textile knitting and digital pattern engineering to computerized embroidery, precision sewing, and optical needle detection—100% produced in-house with zero subcontracting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <div className="px-4 py-2 rounded-[2px] bg-[#141414] border border-[#2A2A28]">
              <span className="text-[#FF333D] font-bold">50,000+</span> Monthly Output
            </div>
            <div className="px-4 py-2 rounded-[2px] bg-[#141414] border border-[#2A2A28]">
              <span className="text-emerald-400 font-bold">AQL 2.5</span> Inspection Rate
            </div>
          </div>
        </div>

        {/* Video Player + Clip Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Main Video Screen */}
          <div className="lg:col-span-8 bg-[#141414] border border-[#2A2A28] rounded-[2px] overflow-hidden p-2 sm:p-3 shadow-2xl">
            <div className="relative aspect-16/9 bg-black rounded-[2px] overflow-hidden">
              <video
                key={activeVideo.url}
                src={activeVideo.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-[1px] border border-white/10 text-xs font-mono text-white flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-ping" />
                <span className="font-bold uppercase tracking-wider">{activeVideo.stage}</span>
                <span className="text-neutral-400">| {activeVideo.title}</span>
              </div>
            </div>
          </div>

          {/* Playlist / Steps */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-neutral-400 px-1 mb-2">
              Select Factory Station Footage:
            </div>

            {PRODUCTION_VIDEOS.map((clip, index) => {
              const isCurrent = activeVideo.id === clip.id;
              return (
                <button
                  key={clip.id}
                  onClick={() => setActiveVideo(clip)}
                  className={`w-full text-left p-4 rounded-[2px] border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? "bg-[#D61C24]/10 border-[#D61C24] text-white"
                      : "bg-[#141414] border-[#2A2A28] text-neutral-300 hover:border-neutral-500 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-[1px] flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isCurrent ? "bg-[#D61C24] text-white" : "bg-[#20201E] text-neutral-400"
                      }`}
                    >
                      0{index + 1}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase text-[#FF333D] font-bold">
                        {clip.stage}
                      </div>
                      <div className="text-xs font-bold font-sans text-white line-clamp-1">
                        {clip.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 shrink-0">
                    {clip.duration}
                  </div>
                </button>
              );
            })}

            <div className="p-4 bg-[#141414] rounded-[2px] border border-[#2A2A28] text-xs font-sans text-neutral-400 space-y-2 mt-4">
              <div className="text-white font-mono uppercase font-bold text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live Video Facility Audits Available
              </div>
              <p className="text-[11px] leading-relaxed">
                International brand partners are welcome to schedule live video walkthroughs via Zoom or WhatsApp with our head production engineer during your bulk production run.
              </p>
            </div>
          </div>

        </div>

        {/* Factory Floor Photo Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold uppercase font-display text-white">
              Sialkot Campus Machinery &amp; Departments
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              Verified Production Floor Photos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTION_PHOTOS.map((photo, i) => (
              <div
                key={i}
                className="bg-[#141414] border border-[#2A2A28] rounded-[2px] overflow-hidden group hover:border-[#D61C24] transition-all shadow-md"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 bg-[#0A0A0A]/90 px-2.5 py-1 rounded-[1px] text-[10px] font-mono uppercase text-[#FF333D] font-bold border border-white/10">
                    Station 0{i + 1}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="text-sm font-bold uppercase font-display text-white group-hover:text-[#FF333D] transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mt-14 pt-8 border-t border-[#20201E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-neutral-400">
            📍 Sialkot Campus: Taj Palace, Khadim Ali Road, Sialkot 51310, Pakistan
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors"
            >
              Factory Specs
            </Link>
            <Link
              href="/request-quote"
              className="px-5 py-2.5 bg-[#D61C24] hover:bg-[#A31017] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors flex items-center gap-2"
            >
              <span>Submit Tech Pack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
