"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface RevealHeadingProps {
  /** Top eyebrow tag/label (e.g. 'FACTORY CATEGORIES • 01-08') */
  eyebrow?: React.ReactNode;
  /** Primary headline line 1 */
  line1?: React.ReactNode;
  /** Secondary headline line 2 */
  line2?: React.ReactNode;
  /** Tertiary headline line 3 */
  line3?: React.ReactNode;
  /** Multiple lines passed as array */
  lines?: React.ReactNode[];
  /** Arbitrary children if custom structure is required */
  children?: React.ReactNode;
  /** Heading semantic element tag */
  as?: "h1" | "h2" | "h3" | "h4" | "div";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Additional classes applied to heading */
  className?: string;
  /** Additional classes applied to eyebrow */
  eyebrowClassName?: string;
  /** Custom base transition delay in ms */
  delay?: number;
  /** Stagger delay between lines in ms */
  stagger?: number;
  /** Intersection threshold */
  threshold?: number;
  /** Whether to replay animation when scrolling back into view */
  replay?: boolean;
}

export function RevealHeading({
  eyebrow,
  line1,
  line2,
  line3,
  lines,
  children,
  as: Component = "h2",
  align = "left",
  className,
  eyebrowClassName,
  delay = 0,
  stagger = 130,
  threshold = 0.1,
  replay = true,
}: RevealHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Respect reduced motion accessibility
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsRevealed(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    // Use IntersectionObserver to trigger animation dynamically when scrolled into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (!replay) {
            observer.disconnect();
          }
        } else if (replay && entry.boundingClientRect.top > 0) {
          // When scrolled back up above the element, reset it so it animates again smoothly on scroll down
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, replay]);

  // Determine line items
  let resolvedLines: React.ReactNode[] = [];
  if (lines && lines.length > 0) {
    resolvedLines = lines;
  } else if (line1 !== undefined || line2 !== undefined || line3 !== undefined) {
    if (line1 !== undefined) resolvedLines.push(line1);
    if (line2 !== undefined) resolvedLines.push(line2);
    if (line3 !== undefined) resolvedLines.push(line3);
  }

  const alignmentClass =
    align === "center"
      ? "text-center items-center justify-center mx-auto"
      : align === "right"
      ? "text-right items-end justify-end ml-auto"
      : "text-left items-start justify-start";

  return (
    <div
      ref={containerRef}
      className={cn("reveal-heading-container flex flex-col", alignmentClass)}
    >
      {eyebrow && (
        <div
          className={cn(
            "overflow-hidden pb-1 -mb-1",
            align === "center" && "flex justify-center"
          )}
        >
          <span
            className={cn(
              "inline-block text-[11px] font-mono font-bold tracking-[0.2em] text-[#D10115] uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
              isRevealed
                ? "opacity-100 translate-y-0 tracking-[0.2em]"
                : "opacity-0 translate-y-3 tracking-[0.28em]",
              eyebrowClassName
            )}
            style={{ transitionDelay: `${delay}ms` }}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <Component
        className={cn(
          "font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight",
          className || "text-[#0B0B0B]"
        )}
      >
        {resolvedLines.length > 0 ? (
          resolvedLines.map((line, idx) => (
            <span
              key={idx}
              className={cn(
                "block overflow-hidden py-1.5 -my-1.5",
                align === "center" && "flex justify-center"
              )}
            >
              <span
                className={cn(
                  "block transform transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                  isRevealed
                    ? "translate-y-0 opacity-100 rotate-0"
                    : "translate-y-[115%] opacity-0 rotate-[1.5deg]"
                )}
                style={{
                  transitionDelay: `${delay + 40 + idx * stagger}ms`,
                }}
              >
                {line}
              </span>
            </span>
          ))
        ) : (
          <span className="block overflow-hidden py-1.5 -my-1.5">
            <span
              className={cn(
                "block transform transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                isRevealed
                  ? "translate-y-0 opacity-100 rotate-0"
                  : "translate-y-[115%] opacity-0 rotate-[1.5deg]"
              )}
              style={{ transitionDelay: `${delay + 40}ms` }}
            >
              {children}
            </span>
          </span>
        )}
      </Component>
    </div>
  );
}
