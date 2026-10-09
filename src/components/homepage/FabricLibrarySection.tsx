"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeaderStore } from "@/stores/useHeaderStore";
import { SectionHeading } from "@/components/common/SectionHeading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  image: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "DESIGN & TECH PACK",
    desc: "Send a sketch, a reference or a finished tech pack.",
    image: "/images/process/Streetwear Atelier Moodboard Workshop (1).png",
  },
  {
    step: "02",
    title: "SAMPLING",
    desc: "A physical sample to check fit, fabric and finish.",
    image: "/images/process/Garment Workshop with Red Appliqué Hoodies (1).png",
  },
  {
    step: "03",
    title: "CUTTING",
    desc: "Fabric cut to your approved pattern and size list.",
    image: "/images/process/Industrial Fabric Cutting Floor (1).png",
  },
  {
    step: "04",
    title: "STITCHING & FINISHING",
    desc: "Sewn, decorated and checked against your sample.",
    image: "/images/process/South Asian Tailor at Sewing Machine (1) (1).png",
  },
  {
    step: "05",
    title: "PACKING & SHIPPING",
    desc: "Folded, bagged and labelled your way.",
    image: "/images/process/Textile Factory Hoodie Packaging (2) (1).png",
  },
];

export const FabricLibrarySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Pinned Horizontal Scroll with GSAP ScrollTrigger
  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;

      const calculateDistance = () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const distance = trackWidth - viewportWidth + 140;
        return -Math.max(distance, 500);
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${Math.max(Math.abs(calculateDistance()) * 1.3, 1100)}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: calculateDistance,
          ease: "none",
        }),
        onToggle: (self) => {
          // Hide header while horizontal pinned scroll is active
          useHeaderStore.getState().setHeaderVisible(!self.isActive);
        },
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });
    }, sectionRef);

    return () => {
      // Ensure header is restored when unmounting
      useHeaderStore.getState().setHeaderVisible(true);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0A] text-white min-h-[620px] sm:min-h-[680px] h-screen w-full select-none overflow-hidden flex flex-col justify-between border-b border-white/10"
    >
      {/* Inner Container with calibrated padding to guarantee cards & text are 100% visible on all viewports */}
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between pt-6 sm:pt-9 lg:pt-11 pb-5 sm:pb-7 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeading
          theme="dark"
          eyebrow="PRODUCTION TIMELINE"
          eyebrowColor="#D61C24"
          title={
            <>
              SKETCH TO<br />SHIPMENT
            </>
          }
          description="One seamless process for every line. Physical pre-production sample approved before bulk manufacturing begins."
          className="shrink-0 pb-1 sm:pb-2 mb-2 sm:mb-4 border-none"
        />

        {/* Horizontal Scrolling Track */}
        <div className="w-full flex-1 flex items-center py-2 sm:py-3 my-auto min-h-[300px]">
          <div
            ref={trackRef}
            className="flex items-stretch gap-4 sm:gap-7 px-2 sm:px-8 w-max will-change-transform"
          >
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="w-[275px] sm:w-[360px] lg:w-[380px] shrink-0 bg-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300"
              >
                {/* Upper Image with Step Number (wide landscape aspect ratio) */}
                <div
                  className="relative w-full h-[175px] sm:h-[215px] overflow-hidden bg-[#1C1C1C] shrink-0"
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Step number on image matching reference */}
                  <span className="absolute top-3.5 left-4 text-3xl sm:text-5xl font-bold font-display text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] select-none pointer-events-none leading-none">
                    {step.step}
                  </span>
                </div>

                {/* Lower Card Info with EXACT reference DevTools specs: padding 18px 20px 22px */}
                <div
                  className="bg-white flex flex-col justify-start shrink-0 w-full min-h-[105px]"
                  style={{
                    padding: "18px 20px 22px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Heading matching reference DevTools: 15px, #121212, uppercase, Helvetica Neue */}
                  <h3
                    className="text-[15px] font-bold uppercase tracking-tight not-italic"
                    style={{
                      color: "#121212",
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: "15px",
                      lineHeight: "21.33px",
                      fontStyle: "normal",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Paragraph matching reference DevTools: 13.5px, #1212129E, mt 6px, Helvetica Neue */}
                  <p
                    className="text-[13.5px]"
                    style={{
                      color: "#1212129E",
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: "13.5px",
                      lineHeight: "20.25px",
                      marginTop: "6px",
                      marginBottom: 0,
                      padding: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Sleek Progress Line */}
        <div className="w-full relative flex flex-col items-center shrink-0 pt-4 pb-2">
          <div className="w-full h-[2px] bg-white/15 relative overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 bottom-0 bg-white transition-all duration-75"
              style={{ width: "0%" }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
