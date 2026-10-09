"use client";

import React, { useEffect, useRef, useState } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowColor?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: string;
  align?: "left" | "center" | "split";
  theme?: "light" | "dark";
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowColor = "#D61C24",
  title,
  description,
  badge,
  align = "split",
  theme = "light",
  action,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  if (align === "center") {
    return (
      <div
        ref={containerRef}
        className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 select-none ${className}`}
      >
        {/* Eyebrow / Tag */}
        {eyebrow && (
          <div
            className={`inline-flex items-center gap-2 mb-3 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ backgroundColor: eyebrowColor }}
            />
            <span
              className="eyebrow-label text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: eyebrowColor }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        {/* Title with Masked Reveal & Glowing Border */}
        <div className="overflow-hidden">
          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-display transition-all duration-800 delay-100 ${
              isDark ? "text-white" : "text-[#0A0A0A]"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {title}
          </h2>
        </div>

        {/* Animated Expanding Accent Underline */}
        <div className="flex justify-center my-4">
          <div
            className={`h-0.5 rounded-full transition-all duration-900 delay-200 ${
              isVisible ? "w-20 opacity-100" : "w-0 opacity-0"
            }`}
            style={{ backgroundColor: eyebrowColor }}
          />
        </div>

        {/* Subtitle / Description */}
        {description && (
          <p
            className={`text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
              isDark ? "text-neutral-300" : "text-[#72726D]"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {description}
          </p>
        )}
      </div>
    );
  }

  if (align === "left") {
    return (
      <div
        ref={containerRef}
        className={`max-w-3xl mb-12 sm:mb-16 select-none ${className}`}
      >
        {eyebrow && (
          <div
            className={`flex items-center gap-2 mb-3 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ backgroundColor: eyebrowColor }}
            />
            <span
              className="eyebrow-label text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: eyebrowColor }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        <div className="overflow-hidden">
          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-display leading-[0.95] transition-all duration-800 delay-100 ${
              isDark ? "text-white" : "text-[#0A0A0A]"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {title}
          </h2>
        </div>

        <div
          className={`h-0.5 my-3.5 rounded-full transition-all duration-900 delay-200 ${
            isVisible ? "w-16 opacity-100" : "w-0 opacity-0"
          }`}
          style={{ backgroundColor: eyebrowColor }}
        />

        {description && (
          <p
            className={`text-xs sm:text-sm font-sans leading-relaxed transition-all duration-700 delay-300 ${
              isDark ? "text-neutral-300" : "text-[#72726D]"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {description}
          </p>
        )}
      </div>
    );
  }

  // Default "split" alignment (Eyebrow + Giant Title on Left, Description / Action on Right)
  return (
    <div
      ref={containerRef}
      className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-6 select-none border-b ${
        isDark ? "border-white/10" : "border-[#DADBD2]"
      } ${className}`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <div
            className={`flex items-center gap-2 mb-2.5 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ backgroundColor: eyebrowColor }}
            />
            <span
              className="eyebrow-label text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: eyebrowColor }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        <div className="overflow-hidden">
          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-display leading-[0.93] transition-all duration-800 delay-100 ${
              isDark ? "text-white" : "text-[#0A0A0A]"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {title}
          </h2>
        </div>

        {/* Dynamic Expanding Underline */}
        <div
          className={`h-0.5 mt-3.5 rounded-full transition-all duration-900 delay-200 ${
            isVisible ? "w-24 opacity-100" : "w-0 opacity-0"
          }`}
          style={{ backgroundColor: eyebrowColor }}
        />
      </div>

      <div className="max-w-md flex flex-col items-start md:items-end gap-3">
        {description && (
          <p
            className={`text-xs sm:text-sm font-sans leading-relaxed md:text-right transition-all duration-700 delay-300 ${
              isDark ? "text-neutral-300" : "text-[#72726D]"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {description}
          </p>
        )}
        {action && (
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
