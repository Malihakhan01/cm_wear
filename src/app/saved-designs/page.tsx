"use client";

import React from "react";
import Link from "next/link";
import { useSavedDesignStore } from "@/stores/useSavedDesignStore";
import { Trash2, ExternalLink, Sparkles, ShoppingBag, Bookmark, ArrowRight } from "lucide-react";

export default function SavedDesignsPage() {
  const { designs, removeDesign } = useSavedDesignStore();

  return (
    <div className="w-full bg-[#FAFAF8] py-16 select-none min-h-[calc(100vh-72px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#DADBD2] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="w-4 h-4 text-[#D61C24]" />
              <span className="eyebrow-label text-[#D61C24]">CLIENT SPECIFICATION ARCHIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
              Saved Garment Configurations
            </h1>
          </div>
          <Link
            href="/customize"
            className="px-4 py-2.5 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-[#FF333D]" />
            <span>New Custom Design</span>
          </Link>
        </div>

        {/* Designs Grid */}
        {designs.length === 0 ? (
          <div className="bg-white border border-[#DADBD2] rounded-[2px] p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-[#F4F4EF] rounded-full flex items-center justify-center mx-auto text-[#72726D]">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold uppercase text-[#0A0A0A]">
              No saved garment configurations yet
            </h3>
            <p className="text-xs text-[#72726D] max-w-sm mx-auto">
              Open the customizer studio to recolor garment parts, add brand logos, and save custom configurations to your portfolio.
            </p>
            <div className="pt-2">
              <Link
                href="/customize"
                className="px-6 py-3 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-xs font-mono uppercase font-bold rounded-[2px] inline-flex items-center gap-2 transition-colors"
              >
                <span>Launch Configurator Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white border border-[#DADBD2] rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-[#D61C24] transition-all shadow-xs"
              >
                {/* Thumbnail Stage */}
                <div className="relative aspect-square bg-[#F4F4EF] p-8 flex items-center justify-center border-b border-[#DADBD2]">
                  <img
                    src={design.thumbnail}
                    alt={design.productName}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded-[1px]">
                    ID: {design.id.substring(0, 12)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-[#0A0A0A] font-display">
                      {design.productName}
                    </h3>
                    <div className="text-[11px] font-mono text-[#72726D] mt-1">
                      Saved: {new Date(design.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="p-3 bg-[#F4F4EF] rounded-[2px] space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Fabric Spec:</span>
                      <span className="font-semibold text-black">{design.gsm} GSM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Artwork Layers:</span>
                      <span className="font-semibold text-black">{design.artworkLayersCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#72726D]">Text Monograms:</span>
                      <span className="font-semibold text-black">{design.textLayersCount}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F4F4EF]">
                    <Link
                      href={`/customize/${design.productId}`}
                      className="py-2 bg-[#0A0A0A] hover:bg-[#D61C24] text-white text-[11px] font-mono uppercase font-bold rounded-[2px] text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Re-Open</span>
                    </Link>

                    <button
                      onClick={() => removeDesign(design.id)}
                      className="py-2 bg-white hover:bg-red-50 text-red-700 border border-[#DADBD2] text-[11px] font-mono uppercase font-bold rounded-[2px] transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
