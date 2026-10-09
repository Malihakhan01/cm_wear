"use client";

import React from "react";

export const OrderFactsSection: React.FC = () => {
  const facts = [
    {
      value: "03",
      label: "PRODUCT LINES",
    },
    {
      value: "[NEEDS INPUT]",
      label: "MINIMUM PER STYLE",
    },
    {
      value: "[NEEDS INPUT]",
      label: "DAYS TO SAMPLE",
    },
    {
      value: "15",
      label: "DECORATION METHODS",
    },
  ];

  return (
    <section
      id="scope"
      aria-label="Order facts"
      className="bg-[#0A0A0A] text-white py-16 sm:py-20 border-b border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered White Dot */}
        <div className="w-2 h-2 rounded-full bg-white mx-auto mb-10 sm:mb-14" />

        {/* 4 Stat Columns matching Reference SS */}
        <div className="border-t border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {facts.map((fact, idx) => (
            <div
              key={idx}
              className="py-10 sm:py-14 px-6 sm:px-8 flex flex-col justify-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight mb-2 sm:mb-3">
                {fact.value}
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono uppercase text-neutral-400 tracking-widest font-semibold">
                {fact.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
