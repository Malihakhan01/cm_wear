"use client";

import React, { useRef, useState, useEffect } from "react";
import { Move, Maximize2 } from "lucide-react";
import {
  CustomLettersState,
  CustomLogoState,
  VARSITY_FONTS,
  VarsityPartsState,
} from "@/config/varsityCustomizer.config";

export type { VarsityPartsState };

// High-resolution 3000x3000px front view layer assets
const ASSET_ARMS = "/varsity_jacket/FRONT_arms.png";
const ASSET_BODY = "/varsity_jacket/FRONT_BODY.png";
const ASSET_POCKETS = "/varsity_jacket/FRONT_side_pockets.png";
const ASSET_RIBS = "/varsity_jacket/FRONT_ribs.png";
const ASSET_BUTTONS = "/varsity_jacket/FRONT_buttons.png";

// High-resolution 3000x3000px back view layer assets
const ASSET_BACK_BODY = "/varsity_jacket/BACK_JACKET.png";
const ASSET_BACK_SLEEVES = "/varsity_jacket/BACK_sleeves.png";
const ASSET_BACK_RIBS = "/varsity_jacket/BACK_RIBS.png";

interface VarsityJacketCanvasProps {
  partColors: VarsityPartsState;
  activePart: string;
  onSelectPart?: (partId: string) => void;
  sleeveStyle?: "striped" | "plain";
  pocketStyle?: "striped" | "plain";
  showPatch?: boolean;
  activeView?: "front" | "back";
  onSwitchToFront?: () => void;
  washFinish?: string;
  customLetters?: CustomLettersState;
  onUpdateLetters?: (updates: Partial<CustomLettersState>) => void;
  customLogo?: CustomLogoState;
  onUpdateLogo?: (updates: Partial<CustomLogoState>) => void;
  onRemoveLogo?: () => void;
  buttonFinishHex?: string;
  distressLevel?: "clean" | "subtle" | "heavy";
  className?: string;
  children?: React.ReactNode;
}

export const VarsityJacketCanvas: React.FC<VarsityJacketCanvasProps> = ({
  partColors,
  activePart,
  onSelectPart,
  sleeveStyle = "striped",
  pocketStyle = "striped",
  showPatch = false,
  activeView = "front",
  onSwitchToFront,
  washFinish,
  customLetters = {
    enabled: false,
    text: "",
    fontId: "varsity-slab",
    color: "#FBBF24",
    borderColor: "#FFFFFF",
    craftStyle: "chenille",
    x: 30,
    y: 30,
  },
  onUpdateLetters,
  customLogo,
  onUpdateLogo,
  onRemoveLogo,
  buttonFinishHex,
  distressLevel = "clean",
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging state for custom PNG logo
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isResizingLogo, setIsResizingLogo] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, origX: 34, origY: 34 });
  const resizeStartRef = useRef({ startX: 0, startY: 0, origScale: 1 });

  // Dragging state for monogram letters
  const [isDraggingLetters, setIsDraggingLetters] = useState(false);
  const letterDragStartRef = useRef({ startX: 0, startY: 0, origX: 30, origY: 30 });

  // Intelligent color blend mapping for 3D shaded grayscale layers
  const getLayerBlendStyle = (hex: string, baseOpacity = 0.88) => {
    if (!hex) return { mixBlendMode: "multiply" as const, opacity: baseOpacity };
    const clean = hex.toLowerCase().trim();

    // Optic white / near white: keep pristine original 3D render highlight
    if (clean === "#ffffff" || clean === "#fafafa" || clean === "#f8fafc") {
      return { mixBlendMode: "screen" as const, opacity: 0.15 };
    }
    // Cream / Ivory / Light Grey: subtle multiply to prevent muddying
    if (clean === "#f3efe6" || clean === "#eae3d2" || clean === "#e4e4e7" || clean === "#d4d4d8") {
      return { mixBlendMode: "multiply" as const, opacity: 0.45 };
    }
    // Deep black / stealth tones
    if (clean === "#0b0b0b" || clean === "#000000" || clean === "#18181b") {
      return { mixBlendMode: "multiply" as const, opacity: 0.94 };
    }
    // Vibrant colors (Crimson, Gold, Forest Green, Royal Navy)
    return { mixBlendMode: "multiply" as const, opacity: baseOpacity };
  };

  const activeFont =
    VARSITY_FONTS.find((f) => f.id === customLetters?.fontId) || VARSITY_FONTS[0];

  const feltBorderColor =
    customLetters.borderColor === "tonal"
      ? partColors.body
      : customLetters.borderColor || "#FFFFFF";

  // Font sizing based on letter count (1, 2, or 3)
  const lettersCount = Math.max(1, customLetters.text.trim().length);
  const letterFontSize = lettersCount === 1 ? 58 : lettersCount === 2 ? 46 : 35;
  const strokeWidthFelt = lettersCount === 1 ? 14 : lettersCount === 2 ? 11 : 9;

  // -----------------------------------------------------------------
  // INTERACTIVE DRAG LOGIC FOR MONOGRAM LETTERS
  // -----------------------------------------------------------------
  const onUpdateLettersRef = useRef(onUpdateLetters);
  useEffect(() => {
    onUpdateLettersRef.current = onUpdateLetters;
  }, [onUpdateLetters]);

  const handleLetterMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!customLetters?.enabled || !customLetters.text.trim()) return;
    if ("button" in e && e.button !== 0) return;
    e.stopPropagation();
    if ("clientX" in e) {
      e.preventDefault();
    }
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

  // -----------------------------------------------------------------
  // INTERACTIVE DRAG & RESIZE LOGIC FOR PNG LOGO
  // -----------------------------------------------------------------
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
        // Clamp to stay within the garment torso
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

  // Preload all front & back garment assets immediately so view switching has 0ms latency
  useEffect(() => {
    const assets = [
      ASSET_ARMS,
      ASSET_BODY,
      ASSET_POCKETS,
      ASSET_RIBS,
      ASSET_BUTTONS,
      ASSET_BACK_BODY,
      ASSET_BACK_SLEEVES,
      ASSET_BACK_RIBS,
    ];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const finalButtonColor = buttonFinishHex || partColors.buttons;
  const pocketsColor = partColors.pockets || partColors.sleeves || "#F3EFE6";
  const cuffsColor = partColors.cuffs || partColors.collar;

  return (
    <div
      ref={canvasRef}
      className={`relative w-full max-w-[420px] sm:max-w-[460px] aspect-square flex items-center justify-center select-none transition-all duration-300 ${className}`}
    >
      {/* Studio Pedestal Ambient Shadow */}
      <div className="absolute bottom-4 w-[74%] h-8 bg-black/15 blur-xl rounded-full pointer-events-none" />

      {/* ================================================================= */}
      {/* GARMENT LAYERS: FRONT VIEW CONTAINER (PERSISTENT IN DOM) */}
      {/* ================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          activeView === "front"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        {/* LAYER 1: SLEEVES (FRONT_arms.png) - Genuine Full-Grain Arms */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-200">
            <img
              src={ASSET_ARMS}
              alt="Varsity Leather Sleeves"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.sleeves,
                WebkitMaskImage: `url('${ASSET_ARMS}')`,
                maskImage: `url('${ASSET_ARMS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.sleeves, 0.88),
              }}
            />
          </div>

          {/* LAYER 2: TORSO BODY (FRONT_BODY.png) - 500 GSM Wool Melton Torso */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-200">
            <img
              src={ASSET_BODY}
              alt="Varsity Melton Wool Torso"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.body,
                WebkitMaskImage: `url('${ASSET_BODY}')`,
                maskImage: `url('${ASSET_BODY}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.body, 0.88),
              }}
            />
          </div>

          {/* LAYER 3: SIDE POCKET WELTS (FRONT_side_pockets.png) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "pockets" ? "drop-shadow-[0_0_10px_rgba(209,1,21,0.5)]" : ""
            }`}
          >
            <img
              src={ASSET_POCKETS}
              alt="Pocket Welts"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-xs select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: pocketsColor,
                WebkitMaskImage: `url('${ASSET_POCKETS}')`,
                maskImage: `url('${ASSET_POCKETS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(pocketsColor, 0.88),
              }}
            />
          </div>

          {/* LAYER 4A: RIBBED COLLAR (FRONT_ribs.png - Top Region) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "collar" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 30%, 0% 30%)",
            }}
          >
            <img
              src={ASSET_RIBS}
              alt="Varsity Ribbed Collar"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.collar,
                WebkitMaskImage: `url('${ASSET_RIBS}')`,
                maskImage: `url('${ASSET_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.collar, 0.88),
              }}
            />
          </div>

          {/* LAYER 4B: RIBBED WAISTBAND (FRONT_ribs.png - Bottom Center Region) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "waistband" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath: "polygon(22% 70%, 78% 70%, 78% 100%, 22% 100%)",
            }}
          >
            <img
              src={ASSET_RIBS}
              alt="Varsity Ribbed Waistband"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.waistband,
                WebkitMaskImage: `url('${ASSET_RIBS}')`,
                maskImage: `url('${ASSET_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.waistband, 0.88),
              }}
            />
          </div>

          {/* LAYER 4C: RIBBED WRIST CUFFS (FRONT_ribs.png - Bottom Left & Right) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath:
                "polygon(0% 70%, 22% 70%, 22% 100%, 0% 100%, 0% 0%, 0% 0%)",
            }}
          >
            <img
              src={ASSET_RIBS}
              alt="Varsity Ribbed Left Cuff"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: cuffsColor,
                WebkitMaskImage: `url('${ASSET_RIBS}')`,
                maskImage: `url('${ASSET_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(cuffsColor, 0.88),
              }}
            />
          </div>

          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath: "polygon(78% 70%, 100% 70%, 100% 100%, 78% 100%)",
            }}
          >
            <img
              src={ASSET_RIBS}
              alt="Varsity Ribbed Right Cuff"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: cuffsColor,
                WebkitMaskImage: `url('${ASSET_RIBS}')`,
                maskImage: `url('${ASSET_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(cuffsColor, 0.88),
              }}
            />
          </div>

          {/* LAYER 5: SNAP BUTTONS (FRONT_buttons.png) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 z-10 ${
              activePart === "buttons" ? "drop-shadow-[0_0_10px_rgba(209,1,21,0.6)]" : ""
            }`}
          >
            <img
              src={ASSET_BUTTONS}
              alt="Snap Fasteners"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: finalButtonColor,
                WebkitMaskImage: `url('${ASSET_BUTTONS}')`,
                maskImage: `url('${ASSET_BUTTONS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                mixBlendMode: "multiply",
                opacity: 0.92,
              }}
            />
          </div>
      </div>

      {/* ================================================================= */}
      {/* AUTHENTIC 3D RENDERED BACK VIEW LAYERS (PERSISTENT IN DOM) */}
      {/* ================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          activeView === "back"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
          {/* BACK LAYER 1: SLEEVES (BACK_sleeves.png) */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-200">
            <img
              src={ASSET_BACK_SLEEVES}
              alt="Varsity Back Leather Sleeves"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.sleeves,
                WebkitMaskImage: `url('${ASSET_BACK_SLEEVES}')`,
                maskImage: `url('${ASSET_BACK_SLEEVES}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.sleeves, 0.88),
              }}
            />
          </div>

          {/* BACK LAYER 2: TORSO BODY (BACK_JACKET.png) */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-200">
            <img
              src={ASSET_BACK_BODY}
              alt="Varsity Back Melton Wool Torso"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.body,
                WebkitMaskImage: `url('${ASSET_BACK_BODY}')`,
                maskImage: `url('${ASSET_BACK_BODY}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.body, 0.88),
              }}
            />
          </div>

          {/* BACK LAYER 3A: RIBBED COLLAR (BACK_RIBS.png - Top Region) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "collar" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 25%, 0% 25%)",
            }}
          >
            <img
              src={ASSET_BACK_RIBS}
              alt="Varsity Back Ribbed Collar"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.collar,
                WebkitMaskImage: `url('${ASSET_BACK_RIBS}')`,
                maskImage: `url('${ASSET_BACK_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.collar, 0.88),
              }}
            />
          </div>

          {/* BACK LAYER 3B: RIBBED WAISTBAND (BACK_RIBS.png - Bottom Center Region) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "waistband" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath: "polygon(20% 75%, 80% 75%, 80% 100%, 20% 100%)",
            }}
          >
            <img
              src={ASSET_BACK_RIBS}
              alt="Varsity Back Ribbed Waistband"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: partColors.waistband,
                WebkitMaskImage: `url('${ASSET_BACK_RIBS}')`,
                maskImage: `url('${ASSET_BACK_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(partColors.waistband, 0.88),
              }}
            />
          </div>

          {/* BACK LAYER 3C: RIBBED WRIST CUFFS (BACK_RIBS.png - Bottom Left & Right) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath: "polygon(0% 75%, 20% 75%, 20% 100%, 0% 100%)",
            }}
          >
            <img
              src={ASSET_BACK_RIBS}
              alt="Varsity Back Ribbed Left Cuff"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: cuffsColor,
                WebkitMaskImage: `url('${ASSET_BACK_RIBS}')`,
                maskImage: `url('${ASSET_BACK_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(cuffsColor, 0.88),
              }}
            />
          </div>

          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
              activePart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
            }`}
            style={{
              clipPath: "polygon(80% 75%, 100% 75%, 100% 100%, 80% 100%)",
            }}
          >
            <img
              src={ASSET_BACK_RIBS}
              alt="Varsity Back Ribbed Right Cuff"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                backgroundColor: cuffsColor,
                WebkitMaskImage: `url('${ASSET_BACK_RIBS}')`,
                maskImage: `url('${ASSET_BACK_RIBS}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...getLayerBlendStyle(cuffsColor, 0.88),
              }}
            />
          </div>
      </div>

      {/* ================================================================= */}
      {/* LAYER 6: DRAGGABLE CUSTOM MONOGRAM LETTERS */}
      {/* ================================================================= */}
      {customLetters?.enabled && customLetters.text.trim() && activeView === "front" && (
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
            activePart === "letters"
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
              <filter id="chenilleFibers" x="-20%" y="-20%" width="140%" height="140%">
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
              filter="url(#chenilleFibers)"
            >
              {customLetters.text.toUpperCase()}
            </text>

            {/* Subtle 3D Stitch Texture Highlight */}
            {customLetters.craftStyle === "puff" && (
              <text
                x="59.5"
                y="51.5"
                textAnchor="middle"
                className="font-black uppercase select-none pointer-events-none"
                style={{
                  fontFamily: activeFont.family,
                  fontSize: `${letterFontSize}px`,
                  letterSpacing: lettersCount === 1 ? "0px" : "2px",
                }}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
              >
                {customLetters.text.toUpperCase()}
              </text>
            )}
          </svg>

          {/* Active selection helper tooltip */}
          {activePart === "letters" && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0B0B0B] text-white text-[8px] font-mono px-1.5 py-0.5 rounded-[2px] whitespace-nowrap shadow-sm pointer-events-none flex items-center gap-1 z-30">
              <Move className="w-2.5 h-2.5 text-[#D10115]" />
              <span>Drag to Reposition</span>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* LAYER 7: UPLOADED BRAND PNG LOGO (Draggable & Resizable) */}
      {/* ================================================================= */}
      {customLogo?.enabled && customLogo.url && activeView === (customLogo.view || "front") && (
        <div
          onMouseDown={handleLogoMouseDown}
          onTouchStart={handleLogoMouseDown}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart?.("logo");
          }}
          className={`absolute z-25 group select-none transition-shadow ${
            isDraggingLogo ? "cursor-grabbing" : "cursor-grab"
          } ${
            activePart === "logo"
              ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent shadow-lg"
              : "hover:ring-1 hover:ring-black/50"
          }`}
          style={{
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

          {/* Active selection controls */}
          {activePart === "logo" && (
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

      {/* ================================================================= */}
      {/* INTERACTIVE CLICK HOTSPOTS OVERLAY (For direct garment click selection) */}
      {/* ================================================================= */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ pointerEvents: "none", zIndex: 15 }}
      >
        {/* Collar Hotspot */}
        <polygon
          points="36,4 64,4 62,20 38,20"
          className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
          onClick={() => onSelectPart?.("collar")}
        >
          <title>Ribbed Collar (Click to customize)</title>
        </polygon>

        {/* Sleeves Hotspot (Left & Right) */}
        <polygon
          points="4,20 25,17 23,83 2,83"
          className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
          onClick={() => onSelectPart?.("sleeves")}
        >
          <title>Left Leather Sleeve (Click to customize)</title>
        </polygon>
        <polygon
          points="75,17 96,20 98,83 77,83"
          className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
          onClick={() => onSelectPart?.("sleeves")}
        >
          <title>Right Leather Sleeve (Click to customize)</title>
        </polygon>

        {/* Torso Body Hotspot */}
        <polygon
          points="25,18 75,18 73,81 27,81"
          className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
          onClick={() => onSelectPart?.("body")}
        >
          <title>Wool Melton Torso (Click to customize)</title>
        </polygon>

        {/* Side Pocket Welts Hotspots (Front Only) */}
        {activeView === "front" && (
          <>
            <polygon
              points="24,53 34,53 30,77 22,77"
              className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPart?.("pockets");
              }}
            >
              <title>Left Pocket Welt (Click to customize)</title>
            </polygon>
            <polygon
              points="66,53 76,53 78,77 70,77"
              className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPart?.("pockets");
              }}
            >
              <title>Right Pocket Welt (Click to customize)</title>
            </polygon>
          </>
        )}

        {/* Waistband Hotspot */}
        <polygon
          points="23,82 77,82 77,93 23,93"
          className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
          onClick={() => onSelectPart?.("waistband")}
        >
          <title>Waistband Ribbing (Click to customize)</title>
        </polygon>

        {/* Cuffs Hotspots */}
        <polygon
          points="3,84 19,84 19,97 3,97"
          className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
          onClick={() => onSelectPart?.("cuffs")}
        >
          <title>Left Wrist Cuff (Click to customize)</title>
        </polygon>
        <polygon
          points="81,84 97,84 97,97 81,97"
          className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
          onClick={() => onSelectPart?.("cuffs")}
        >
          <title>Right Wrist Cuff (Click to customize)</title>
        </polygon>

        {/* Buttons Column Hotspot (Front Only) */}
        {activeView === "front" && (
          <polygon
            points="46,18 54,18 54,94 46,94"
            className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart?.("buttons");
            }}
          >
            <title>Snap Buttons (Click to customize)</title>
          </polygon>
        )}
      </svg>

      {/* Wash & Patina Filters */}
      {washFinish === "Vintage Mineral Acid Wash" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      )}
      {washFinish === "Heavy Stone Wash" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-soft-light"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      )}
      {washFinish === "Sun-Faded Solar Distress" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-color-dodge"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 20%, rgba(255,245,210,0.5) 0%, rgba(0,0,0,0) 80%)",
          }}
        />
      )}

      {/* Distress Patina Filter Overlay */}
      {distressLevel === "subtle" && (
        <div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay bg-noise" />
      )}
      {distressLevel === "heavy" && (
        <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-hard-light bg-noise" />
      )}

      {/* Children Layer: Draggable and Resizable Artwork & Text Overlays */}
      {children && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
          {children}
        </div>
      )}
    </div>
  );
};
