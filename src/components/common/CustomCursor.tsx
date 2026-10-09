"use client";

import React, { useEffect, useState, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOverImage, setIsOverImage] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Smooth lerp physics refs
  const mousePos = useRef({ x: -200, y: -200 });
  const targetPos = useRef({ x: -200, y: -200 });
  const rafId = useRef<number | null>(null);

  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Touch device and reduced motion detection
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouchDevice || prefersReducedMotion) {
      setIsTouch(true);
      return;
    }

    // Precise helper to identify if hovered element is an actual image or media element
    const checkIsImageElement = (el: HTMLElement | null): boolean => {
      let current: HTMLElement | null = el;
      let depth = 0;

      while (current && depth < 6 && current !== document.body) {
        const tagName = current.tagName.toLowerCase();

        // 1. Direct media elements
        if (tagName === "img" || tagName === "picture" || tagName === "video" || tagName === "canvas") {
          return true;
        }

        // 2. SVG customizer garment viewers
        if (
          tagName === "svg" &&
          (current.classList.contains("garment-svg") ||
            current.classList.contains("customizer-svg") ||
            current.closest(".customizer-viewer-container") ||
            current.closest("#viewer-front-container") ||
            current.closest("#viewer-back-container"))
        ) {
          return true;
        }

        // 3. Explicit image cursor markers
        const dataCursor = current.getAttribute("data-cursor");
        if (dataCursor === "image" || dataCursor === "zoom" || dataCursor === "expand") {
          return true;
        }

        // 4. Background image inline style
        if (
          current.style &&
          current.style.backgroundImage &&
          current.style.backgroundImage.includes("url(")
        ) {
          return true;
        }

        // 5. Specific image preview container classes
        const classStr = current.className && typeof current.className === "string" ? current.className : "";
        if (
          classStr.includes("product-image-wrap") ||
          classStr.includes("fabric-preview-img") ||
          classStr.includes("hero-image-bg")
        ) {
          return true;
        }

        current = current.parentElement;
        depth++;
      }

      return false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible) {
        setIsVisible(true);
        mousePos.current = { x: e.clientX, y: e.clientY };
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isImage = checkIsImageElement(target);
      setIsOverImage(isImage);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsOverImage(false);
    };
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // High refresh rate 60-120fps lerp loop for the inverted cursor
    const render = () => {
      const lerpFactor = 0.22;
      mousePos.current.x += (targetPos.current.x - mousePos.current.x) * lerpFactor;
      mousePos.current.y += (targetPos.current.y - mousePos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!mounted || isTouch) return null;

  return (
    <div
      ref={ringRef}
      className={`fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-200 ease-out`}
      style={{
        mixBlendMode: "difference",
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOverImage
            ? "w-20 h-20 shadow-2xl"
            : "w-2.5 h-2.5 shadow-sm"
        } ${isPressed ? "scale-75" : "scale-100"}`}
      />
    </div>
  );
};

