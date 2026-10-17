"use client";

import React, { useEffect, useState, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      if (!isVisible) {
        setIsVisible(true);
        mousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    // High refresh rate 60-120fps lerp loop for cursor
    const render = () => {
      const lerpFactor = 0.25;
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
  }, []);

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
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-200 ease-out w-2.5 h-2.5 shadow-sm ${
          isPressed ? "scale-75" : "scale-100"
        }`}
      />
    </div>
  );
};

