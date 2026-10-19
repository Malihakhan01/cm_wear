"use client";

import React, { useState } from "react";
import { X, Ruler, Printer } from "lucide-react";

export interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel: "hoodie" | "varsity" | "equestrian" | "basketball" | "baseball" | "icehockey" | "martialarts";
  templates?: any[];
}

const FALLBACK_POM: Record<string, { title: string; grading: Record<string, Record<string, number>> }> = {
  hoodie: {
    title: "Heavyweight Streetwear Hoodie (380-450 GSM)",
    grading: {
      XS: { chest_width: 54, body_length: 68, shoulder_drop: 50, sleeve_length: 63 },
      S: { chest_width: 57, body_length: 70, shoulder_drop: 52, sleeve_length: 64 },
      M: { chest_width: 60, body_length: 72, shoulder_drop: 54, sleeve_length: 65 },
      L: { chest_width: 63, body_length: 74, shoulder_drop: 56, sleeve_length: 66 },
      XL: { chest_width: 66, body_length: 76, shoulder_drop: 58, sleeve_length: 67 },
      "2XL": { chest_width: 69, body_length: 78, shoulder_drop: 60, sleeve_length: 68 },
      "3XL": { chest_width: 72, body_length: 80, shoulder_drop: 62, sleeve_length: 69 },
    },
  },
  varsity: {
    title: "Heritage Melton Wool & Leather Varsity Jacket",
    grading: {
      S: { chest_width: 58, body_length: 67, shoulder_drop: 49, sleeve_length: 65 },
      M: { chest_width: 61, body_length: 69, shoulder_drop: 51, sleeve_length: 66 },
      L: { chest_width: 64, body_length: 71, shoulder_drop: 53, sleeve_length: 67 },
      XL: { chest_width: 67, body_length: 73, shoulder_drop: 55, sleeve_length: 68 },
      "2XL": { chest_width: 70, body_length: 75, shoulder_drop: 57, sleeve_length: 69 },
    },
  },
  basketball: {
    title: "Pro League Diamond Mesh Basketball Uniform Set",
    grading: {
      S: { jersey_chest: 52, jersey_length: 74, shorts_waist: 38, shorts_inseam: 21 },
      M: { jersey_chest: 55, jersey_length: 76, shorts_waist: 41, shorts_inseam: 22 },
      L: { jersey_chest: 58, jersey_length: 78, shorts_waist: 44, shorts_inseam: 23 },
      XL: { jersey_chest: 61, jersey_length: 80, shorts_waist: 47, shorts_inseam: 24 },
    },
  },
  baseball: {
    title: "Custom Pro Baseball Uniform Set (Jersey & Pants)",
    grading: {
      S: { chest_width: 53, jersey_length: 75, pants_waist: 38, pants_inseam: 72 },
      M: { chest_width: 56, jersey_length: 77, pants_waist: 41, pants_inseam: 74 },
      L: { chest_width: 59, jersey_length: 79, pants_waist: 44, pants_inseam: 76 },
      XL: { chest_width: 62, jersey_length: 81, pants_waist: 47, pants_inseam: 78 },
      "2XL": { chest_width: 65, jersey_length: 83, pants_waist: 50, pants_inseam: 80 },
    },
  },
  icehockey: {
    title: "Pro Ice Hockey Uniform Set (Jersey, Breezers & Socks)",
    grading: {
      S: { chest_width: 62, jersey_length: 79, sleeve_length: 77, pants_waist: 40 },
      M: { chest_width: 65, jersey_length: 81, sleeve_length: 79, pants_waist: 43 },
      L: { chest_width: 68, jersey_length: 83, sleeve_length: 81, pants_waist: 46 },
      XL: { chest_width: 71, jersey_length: 85, sleeve_length: 83, pants_waist: 49 },
      "2XL": { chest_width: 74, jersey_length: 87, sleeve_length: 85, pants_waist: 52 },
    },
  },
  martialarts: {
    title: "Authentic Martial Arts BJJ / Karate Gi Uniform Set",
    grading: {
      A1: { chest_width: 58, jacket_length: 74, sleeve_wingspan: 156, pants_length: 93 },
      A2: { chest_width: 61, jacket_length: 77, sleeve_wingspan: 162, pants_length: 97 },
      A3: { chest_width: 64, jacket_length: 80, sleeve_wingspan: 168, pants_length: 101 },
      A4: { chest_width: 67, jacket_length: 83, sleeve_wingspan: 174, pants_length: 105 },
      A5: { chest_width: 70, jacket_length: 86, sleeve_wingspan: 180, pants_length: 109 },
    },
  },
  equestrian: {
    title: "Italian Softshell Performance Equestrian Jacket",
    grading: {
      XS: { chest: 46, waist: 40, back_length: 64, sleeve: 61 },
      S: { chest: 49, waist: 43, back_length: 66, sleeve: 62.5 },
      M: { chest: 52, waist: 46, back_length: 68, sleeve: 64 },
      L: { chest: 55, waist: 49, back_length: 70, sleeve: 65.5 },
      XL: { chest: 58, waist: 52, back_length: 72, sleeve: 67 },
    },
  },
};

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  activeModel,
  templates = [],
}) => {
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (!isOpen) return null;

  // Resolve template from backend or fallback
  const matchedTemplate = templates.find((t: any) => {
    if (activeModel === "varsity") return t.model_type === "varsity" || t.slug?.includes("varsity");
    if (activeModel === "basketball") return t.model_type === "basketball" || t.slug?.includes("basketball");
    if (activeModel === "equestrian") return t.model_type === "equestrian" || t.slug?.includes("riding") || t.slug?.includes("equestrian");
    return t.model_type === "hoodie" || t.slug?.includes("hoodie");
  });

  const fallbackData = FALLBACK_POM[activeModel] || FALLBACK_POM.hoodie;
  const title = matchedTemplate?.name || fallbackData.title;
  const gradingData: Record<string, Record<string, number>> =
    matchedTemplate?.pom_grading && Object.keys(matchedTemplate.pom_grading).length > 0
      ? matchedTemplate.pom_grading
      : fallbackData.grading;

  const sizes = Object.keys(gradingData);
  const dimensions = sizes.length > 0 ? Object.keys(gradingData[sizes[0]]) : [];

  const formatValue = (val: number) => {
    if (unit === "in") {
      return (val / 2.54).toFixed(1);
    }
    return val;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-[#FAFAF8] dark:bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#D10115]/10 border border-[#D10115]/20 flex items-center justify-center">
              <Ruler className="w-4 h-4 text-[#D10115]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-black dark:text-white font-mono">
                Factory Point of Measure (POM) Size Chart
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                {title} &bull; Sialkot Pattern Grading Protocol (AQL 2.5)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Unit Toggle: CM vs IN */}
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-[2px] p-0.5 bg-white dark:bg-neutral-900 text-[10px] font-mono font-bold">
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`px-2 py-1 rounded-[2px] transition-colors cursor-pointer ${
                  unit === "cm"
                    ? "bg-[#0B0B0B] text-white"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={`px-2 py-1 rounded-[2px] transition-colors cursor-pointer ${
                  unit === "in"
                    ? "bg-[#0B0B0B] text-white"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
              >
                IN
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-[2px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close size chart modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Table */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-[2px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#FAFAF8] dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-2.5 px-3">Size</th>
                    {dimensions.map((dim) => (
                      <th key={dim} className="py-2.5 px-3 text-center whitespace-nowrap">
                        {dim.replace(/_/g, " ")} ({unit})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {sizes.map((sz) => (
                    <tr key={sz} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#D10115]">{sz}</td>
                      {dimensions.map((dim) => (
                        <td key={dim} className="py-2.5 px-3 text-center text-neutral-700 dark:text-neutral-300 font-semibold">
                          {formatValue(Number(gradingData[sz][dim] || 0))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tolerance & Production Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-neutral-500 font-mono bg-[#FAFAF8] dark:bg-neutral-950 p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-[2px]">
            <div>
              <strong className="text-black dark:text-white block font-bold mb-0.5">Manufacturing Tolerance:</strong>
              <span>&plusmn; 0.5 cm (&plusmn; 0.2 in) across all flat-lay points of measure per ISO 9001 specs.</span>
            </div>
            <div>
              <strong className="text-black dark:text-white block font-bold mb-0.5">Pre-Shrunk Guarantee:</strong>
              <span>Pre-washed &amp; tumble-relaxed under AQL 2.5 international export standard.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-[#FAFAF8] dark:bg-neutral-950 text-xs font-mono">
          <span className="text-[11px] text-neutral-400">
            Dynamically synchronized with factory CAD pattern grading.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-[2px] font-bold text-[11px] flex items-center gap-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Matrix</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#0B0B0B] hover:bg-neutral-900 text-white rounded-[2px] font-bold text-[11px] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
