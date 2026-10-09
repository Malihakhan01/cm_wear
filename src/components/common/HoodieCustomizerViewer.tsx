"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Layers, Eye, Move, Box, Maximize2 } from "lucide-react";
import {
  CustomLettersState,
  CustomLogoState,
  VARSITY_FONTS,
} from "@/config/varsityCustomizer.config";

export type HoodieDisplayMode = "front" | "back" | "dual" | "parts-separated" | "raw-original";
export type BlendModeOption = "multiply" | "color" | "overlay" | "soft-light";

interface HoodieCustomizerViewerProps {
  partColors: Record<string, string>;
  activeGarmentPart?: string;
  onSelectPart?: (partId: string) => void;
  onColorChange?: (colorHex: string) => void;
  className?: string;
  view?: "front" | "back" | "left" | "right" | "detail" | "threeD";
  customLetters?: CustomLettersState;
  onUpdateLetters?: (updates: Partial<CustomLettersState>) => void;
  customLogo?: CustomLogoState;
  onUpdateLogo?: (updates: Partial<CustomLogoState>) => void;
  onRemoveLogo?: () => void;
  children?: React.ReactNode;
}

export const HoodieCustomizerViewer: React.FC<HoodieCustomizerViewerProps> = ({
  partColors,
  activeGarmentPart = "body",
  onSelectPart,
  onColorChange,
  className = "w-full",
  view = "front",
  customLetters,
  onUpdateLetters,
  customLogo,
  onUpdateLogo,
  onRemoveLogo,
  children,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging state for custom PNG logo
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isResizingLogo, setIsResizingLogo] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, origX: 32, origY: 34 });
  const resizeStartRef = useRef({ startX: 0, startY: 0, origScale: 1 });

  // Dragging state for monogram letters
  const [isDraggingLetters, setIsDraggingLetters] = useState(false);
  const letterDragStartRef = useRef({ startX: 0, startY: 0, origX: 30, origY: 30 });

  const onUpdateLettersRef = useRef(onUpdateLetters);
  useEffect(() => {
    onUpdateLettersRef.current = onUpdateLetters;
  }, [onUpdateLetters]);

  // Sync displayMode with parent customizer view (front / back)
  const [displayMode, setDisplayMode] = useState<HoodieDisplayMode>(
    view === "back" ? "back" : "front"
  );

  useEffect(() => {
    if (displayMode === "front" && view === "back") {
      setDisplayMode("back");
    } else if (displayMode === "back" && view === "front") {
      setDisplayMode("front");
    }
  }, [view]);

  // Part colors with sensible defaults
  const bodyColor = partColors.body || "#222224";
  const hoodColor = partColors.hood || partColors.body || "#222224";
  const pocketColor = partColors.pocket || partColors.body || "#222224";
  const sleevesColor = partColors.sleeves || partColors.body || "#222224";
  const cuffsColor = partColors.cuffs || partColors.waistband || partColors.body || "#222224";
  const waistbandColor = partColors.waistband || partColors.cuffs || partColors.body || "#222224";
  const drawstringsColor = partColors.drawstrings || "#FFFFFF";
  const lettersCount = Math.max(1, (customLetters?.text || "").trim().length);
  const letterFontSize = lettersCount === 1 ? 58 : lettersCount === 2 ? 46 : 35;
  const strokeWidthFelt = lettersCount === 1 ? 14 : lettersCount === 2 ? 11 : 9;
  const feltBorderColor =
    customLetters?.borderColor === "tonal"
      ? (bodyColor || "#222224")
      : customLetters?.borderColor || "#FFFFFF";
  const activeFont =
    VARSITY_FONTS.find((f) => f.id === customLetters?.fontId) || VARSITY_FONTS[0];

  const handleLetterMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!customLetters?.enabled || !customLetters.text.trim()) return;
    e.stopPropagation();
    onSelectPart?.("letters");

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsDraggingLetters(true);
    letterDragStartRef.current = {
      startX: clientX,
      startY: clientY,
      origX: customLetters.x ?? 30,
      origY: customLetters.y ?? 30,
    };
  };

  useEffect(() => {
    if (!isDraggingLetters) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      if ("cancelable" in e && e.cancelable) {
        e.preventDefault();
      }

      if (onUpdateLettersRef.current) {
        const deltaX = ((clientX - letterDragStartRef.current.startX) / rect.width) * 100;
        const deltaY = ((clientY - letterDragStartRef.current.startY) / rect.height) * 100;
        const newX = Math.max(14, Math.min(84, letterDragStartRef.current.origX + deltaX));
        const newY = Math.max(14, Math.min(84, letterDragStartRef.current.origY + deltaY));
        onUpdateLettersRef.current({ x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 });
      }
    };

    const handlePointerUp = () => setIsDraggingLetters(false);

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDraggingLetters]);

  // Logo handlers
  const handleLogoMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!customLogo?.enabled || !customLogo.url) return;
    e.stopPropagation();
    onSelectPart?.("logo");

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsDraggingLogo(true);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      origX: customLogo.x ?? 32,
      origY: customLogo.y ?? 34,
    };
  };

  const handleResizeCornerMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!customLogo?.enabled || !customLogo.url) return;
    e.stopPropagation();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsResizingLogo(true);
    resizeStartRef.current = {
      startX: clientX,
      startY: clientY,
      origScale: customLogo.scale ?? 1,
    };
  };

  useEffect(() => {
    if (!isDraggingLogo && !isResizingLogo) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();

      if (isDraggingLogo && onUpdateLogo) {
        const deltaX = ((clientX - dragStartRef.current.startX) / rect.width) * 100;
        const deltaY = ((clientY - dragStartRef.current.startY) / rect.height) * 100;
        const newX = Math.max(16, Math.min(84, dragStartRef.current.origX + deltaX));
        const newY = Math.max(18, Math.min(78, dragStartRef.current.origY + deltaY));
        onUpdateLogo({ x: Math.round(newX), y: Math.round(newY) });
      } else if (isResizingLogo && onUpdateLogo) {
        const delta = clientX - resizeStartRef.current.startX + (clientY - resizeStartRef.current.startY);
        const scaleDelta = delta / (rect.width * 0.35);
        const newScale = Math.max(
          0.35,
          Math.min(2.5, Number((resizeStartRef.current.origScale + scaleDelta).toFixed(2)))
        );
        onUpdateLogo({ scale: newScale });
      }
    };

    const handlePointerUp = () => {
      setIsDraggingLogo(false);
      setIsResizingLogo(false);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDraggingLogo, isResizingLogo, onUpdateLogo]);

  // Preload all hoodie front & back image assets into browser cache for 0ms view flipping
  useEffect(() => {
    const hoodieAssets = [
      "/hoodie/hoodie_front.png",
      "/hoodie/front.png",
      "/hoodie/front_hood.png",
      "/hoodie/front_pocket.png",
      "/hoodie/front_sleeves.png",
      "/hoodie/front_cuffs.png",
      "/hoodie/front_waistband.png",
      "/hoodie/front_drawstrings.png",
      "/hoodie/hoodie_back.png",
      "/hoodie/back_body.png?v=2",
      "/hoodie/back_hood.png?v=2",
      "/hoodie/back_sleeves.png?v=2",
      "/hoodie/back_cuffs.png?v=2",
      "/hoodie/back_waistband.png?v=2",
    ];
    hoodieAssets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const blendMode: BlendModeOption = "multiply";
  const intensity = 90;
  const brightness = 115;
  const contrast = 105;
  const activeWash: string = "clean";

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* =========================================================================
          MAIN GARMENT CANVAS (420x420 Square Coordinate System)
          Children (logos, text monograms, safe print guide) render directly inside!
         ========================================================================= */}
      <div
        ref={canvasRef}
        className="relative w-full max-w-[420px] aspect-square flex items-center justify-center"
      >
        {/* =======================================================================
            VIEW 1: FRONT VIEW (PERSISTENT GPU-CACHED CONTAINER)
           ======================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-opacity duration-150 ${
            displayMode === "front"
              ? "opacity-100 z-10 pointer-events-auto"
              : "opacity-0 z-0 pointer-events-none"
          }`}
          style={{ isolation: "isolate" }}
        >
            {/* Grayscale Base Image */}
            <img
              src="/hoodie/hoodie_front.png"
              alt="Heavyweight Hoodie Front"
              className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            />

            {/* 1. Body Color Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: bodyColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/front.png)",
                maskImage: "url(/hoodie/front.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 2. Hood Color Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: hoodColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/front_hood.png)",
                maskImage: "url(/hoodie/front_hood.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 3. Kangaroo Pocket Color Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: pocketColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/front_pocket.png)",
                maskImage: "url(/hoodie/front_pocket.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 4. Sleeves Color Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: sleevesColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/front_sleeves.png)",
                maskImage: "url(/hoodie/front_sleeves.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 5. Ribbed Cuffs Color Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: cuffsColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/front_cuffs.png)",
                maskImage: "url(/hoodie/front_cuffs.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 6. Ribbed Waistband Color Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: waistbandColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/front_waistband.png)",
                maskImage: "url(/hoodie/front_waistband.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 7. Drawstrings Layer (Can be independent color or white) */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: drawstringsColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/front_drawstrings.png)",
                maskImage: "url(/hoodie/front_drawstrings.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* Screen Highlight Layer to preserve authentic cotton fleece luster */}
            <img
              src="/hoodie/hoodie_front.png"
              alt="Highlights"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{
                mixBlendMode: "screen",
                opacity: 0.12,
              }}
            />

            {/* Optional Wash Textures */}
            {activeWash === "mineral" && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(0,0,0,0.4) 100%)",
                }}
              />
            )}
            {activeWash === "stone" && (
              <div
                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-soft-light"
                style={{
                  backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.5) 100%)",
                }}
              />
            )}
        </div>

        {/* =======================================================================
            VIEW 2: BACK VIEW (PERSISTENT GPU-CACHED CONTAINER)
           ======================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-opacity duration-150 ${
            displayMode === "back"
              ? "opacity-100 z-10 pointer-events-auto"
              : "opacity-0 z-0 pointer-events-none"
          }`}
          style={{ isolation: "isolate" }}
        >
            {/* Grayscale Base Image */}
            <img
              src="/hoodie/hoodie_back.png"
              alt="Heavyweight Hoodie Back"
              className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            />

            {/* 1. Back Body Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: bodyColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/back_body.png?v=2)",
                maskImage: "url(/hoodie/back_body.png?v=2)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 2. Back Hood Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: hoodColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/back_hood.png?v=2)",
                maskImage: "url(/hoodie/back_hood.png?v=2)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 3. Back Sleeves Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: sleevesColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/back_sleeves.png?v=2)",
                maskImage: "url(/hoodie/back_sleeves.png?v=2)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 4. Back Cuffs Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: cuffsColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/back_cuffs.png?v=2)",
                maskImage: "url(/hoodie/back_cuffs.png?v=2)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* 5. Back Waistband Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: waistbandColor,
                mixBlendMode: blendMode,
                opacity: intensity / 100,
                WebkitMaskImage: "url(/hoodie/back_waistband.png?v=2)",
                maskImage: "url(/hoodie/back_waistband.png?v=2)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* Screen Highlight Layer */}
            <img
              src="/hoodie/hoodie_back.png"
              alt="Highlights"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{
                mixBlendMode: "screen",
                opacity: 0.12,
              }}
            />
        </div>

        {/* =======================================================================
            VIEW 3: DUAL CUTOUT VIEW (Side-by-side)
           ======================================================================= */}
        {displayMode === "dual" && (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            style={{ isolation: "isolate" }}
          >
            <div className="grid grid-cols-2 w-full h-full gap-2">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/hoodie/hoodie_front.png"
                  alt="Hoodie Front"
                  className="w-full h-full object-contain"
                  style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: bodyColor,
                    mixBlendMode: blendMode,
                    opacity: intensity / 100,
                    WebkitMaskImage: "url(/hoodie/hoodie_front.png)",
                    maskImage: "url(/hoodie/hoodie_front.png)",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                />
                <span className="absolute bottom-2 left-2 text-[9px] font-mono uppercase bg-black text-white px-1.5 py-0.5 rounded-[2px]">
                  Front
                </span>
              </div>
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/hoodie/hoodie_back.png"
                  alt="Hoodie Back"
                  className="w-full h-full object-contain"
                  style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: bodyColor,
                    mixBlendMode: blendMode,
                    opacity: intensity / 100,
                    WebkitMaskImage: "url(/hoodie/hoodie_back.png)",
                    maskImage: "url(/hoodie/hoodie_back.png)",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                />
                <span className="absolute bottom-2 right-2 text-[9px] font-mono uppercase bg-black text-white px-1.5 py-0.5 rounded-[2px]">
                  Back
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            VIEW 4: EXPLODED / SEPARATED PARTS VIEW
           ======================================================================= */}
        {displayMode === "parts-separated" && (
          <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-2 pointer-events-auto bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] overflow-y-auto">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-500 pb-1 border-b border-[#E6E6E2]">
              <span className="font-bold text-black">Divided Hoodie Components</span>
              <span className="text-[#D10115]">Click Part to Color</span>
            </div>
            <div className="grid grid-cols-3 gap-2 my-2">
              {[
                { id: "body", name: "Front Body", img: "/hoodie/front.png", color: bodyColor },
                { id: "hood", name: "Hood", img: "/hoodie/front_hood.png", color: hoodColor },
                { id: "pocket", name: "Kangaroo Pocket", img: "/hoodie/front_pocket.png", color: pocketColor },
                { id: "sleeves", name: "Sleeves", img: "/hoodie/front_sleeves.png", color: sleevesColor },
                { id: "ribs", name: "Ribs (Hem & Cuffs)", img: "/hoodie/front_ribs.png", color: cuffsColor },
              ].map((part) => (
                <div
                  key={part.id}
                  onClick={() => onSelectPart?.(part.id)}
                  className={`p-2 border rounded-[2px] flex flex-col items-center justify-between cursor-pointer transition-all ${
                    activeGarmentPart === part.id
                      ? "border-[#D10115] bg-red-50/50 shadow-xs"
                      : "border-[#E6E6E2] bg-white hover:border-neutral-400"
                  }`}
                >
                  <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
                    <img src={part.img} alt={part.name} className="w-full h-full object-contain" />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor: part.color,
                        mixBlendMode: blendMode,
                        opacity: 0.85,
                        WebkitMaskImage: `url(${part.img})`,
                        maskImage: `url(${part.img})`,
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                      }}
                    />
                  </div>
                  <div className="w-full flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-[#E6E6E2]">
                    <span className="font-bold truncate">{part.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: part.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDisplayMode("front")}
              className="btn-primary text-[10px] py-1.5 w-full flex items-center justify-center gap-1.5"
            >
              <span>Back to Full Customizer Studio</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* LAYER 6: DRAGGABLE CUSTOM MONOGRAM LETTERS ON HOODIE */}
        {/* ================================================================= */}
        {customLetters?.enabled && customLetters.text.trim() && displayMode === "front" && (
          <div
            onMouseDown={handleLetterMouseDown}
            onTouchStart={handleLetterMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart?.("letters");
            }}
            className={`absolute select-none flex items-center justify-center pointer-events-auto transition-shadow ${
              isDraggingLetters
                ? "cursor-grabbing scale-105"
                : "cursor-grab"
            } ${
              activeGarmentPart === "letters"
                ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent shadow-lg"
                : "hover:ring-1 hover:ring-[#D10115]/50"
            }`}
            style={{
              zIndex: 40,
              left: `${customLetters.x ?? 30}%`,
              top: `${customLetters.y ?? 30}%`,
              width: "20%",
              height: "16%",
              transform: "translate(-50%, -50%)",
              transition: isDraggingLetters ? "none" : "box-shadow 0.2s",
              touchAction: "none",
              backgroundColor: "rgba(0,0,0,0.001)",
            }}
            title={`Click & drag to reposition monogram: "${customLetters.text}"`}
          >
            <svg
              viewBox="0 0 120 80"
              className="w-full h-full overflow-visible drop-shadow-[0_5px_8px_rgba(0,0,0,0.45)] pointer-events-none"
            >
              <defs>
                <filter id="hoodieChenilleFibers" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Outer Felt Backing Layer */}
              <text
                x="60"
                y="52"
                textAnchor="middle"
                className="font-black uppercase select-none pointer-events-none"
                style={{
                  fontFamily: activeFont.family,
                  fontSize: `${letterFontSize}px`,
                  letterSpacing: lettersCount === 1 ? "0px" : "2px",
                }}
                fill={feltBorderColor}
                stroke={feltBorderColor}
                strokeWidth={strokeWidthFelt}
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {customLetters.text.toUpperCase()}
              </text>

              {/* Inner Chenille Yarn / Embroidered Fill in Selected Color Shade */}
              <text
                x="60"
                y="52"
                textAnchor="middle"
                className="font-black uppercase select-none pointer-events-none"
                style={{
                  fontFamily: activeFont.family,
                  fontSize: `${letterFontSize}px`,
                  letterSpacing: lettersCount === 1 ? "0px" : "2px",
                }}
                fill={customLetters.color}
                stroke="rgba(0,0,0,0.22)"
                strokeWidth={customLetters.craftStyle === "puff" ? 2.5 : 1.2}
                strokeLinejoin="round"
                filter="url(#hoodieChenilleFibers)"
              >
                {customLetters.text.toUpperCase()}
              </text>
            </svg>

            {activeGarmentPart === "letters" && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0B0B0B] text-white text-[8px] font-mono px-1.5 py-0.5 rounded-[2px] whitespace-nowrap shadow-sm pointer-events-none flex items-center gap-1 z-30">
                <Move className="w-2.5 h-2.5 text-[#D10115]" />
                <span>Drag to Reposition</span>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* LAYER 7: UPLOADED BRAND PNG LOGO ON HOODIE */}
        {/* ================================================================= */}
        {customLogo?.enabled && customLogo.url && displayMode === (customLogo.view || "front") && (
          <div
            onMouseDown={handleLogoMouseDown}
            onTouchStart={handleLogoMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart?.("logo");
            }}
            className={`absolute select-none transition-shadow ${
              isDraggingLogo ? "cursor-grabbing" : "cursor-grab"
            } ${
              activeGarmentPart === "logo"
                ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent shadow-lg"
                : "hover:ring-1 hover:ring-black/50"
            }`}
            style={{
              zIndex: 40,
              left: `${customLogo.x}%`,
              top: `${customLogo.y}%`,
              width: `${Math.round(80 * (customLogo.scale || 1))}px`,
              height: `${Math.round(80 * (customLogo.scale || 1))}px`,
              transform: `translate(-50%, -50%) rotate(${customLogo.rotation || 0}deg) ${
                customLogo.flippedH ? "scaleX(-1)" : ""
              }`,
            }}
            title="Drag anywhere to move logo • Pull corner handle to resize"
          >
            <img
              src={customLogo.url}
              alt={customLogo.name || "Custom Logo"}
              className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
              draggable={false}
            />

            {activeGarmentPart === "logo" && (
              <>
                <div className="absolute -inset-1 border border-dashed border-[#D10115] rounded-[2px] pointer-events-none" />

                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0B0B0B] text-white text-[8px] font-mono px-1.5 py-0.5 rounded-[2px] whitespace-nowrap shadow-sm pointer-events-none flex items-center gap-1 z-30">
                  <Move className="w-2.5 h-2.5 text-[#D10115]" />
                  <span>Drag to Move • Pull Corner</span>
                </div>

                <div
                  onMouseDown={handleResizeCornerMouseDown}
                  onTouchStart={handleResizeCornerMouseDown}
                  className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#D10115] rounded-full shadow-md cursor-nwse-resize flex items-center justify-center hover:scale-125 transition-transform z-30"
                  title="Click and drag outward/inward to resize logo"
                >
                  <Maximize2 className="w-2.5 h-2.5 text-[#D10115]" />
                </div>

                {onRemoveLogo && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLogo();
                    }}
                    className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md flex items-center justify-center text-[10px] font-bold z-30 transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                    title="Remove Logo"
                  >
                    &times;
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Children Render Layer: Drag-and-drop artwork & text monograms */}
        <div className="absolute inset-0 pointer-events-auto">{children}</div>
      </div>
    </div>
  );
};
