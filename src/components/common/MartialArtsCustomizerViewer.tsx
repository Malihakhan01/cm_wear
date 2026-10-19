"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Layers, Eye, Move, Box, Maximize2 } from "lucide-react";
import {
  CustomLettersState,
  CustomLogoState,
  VARSITY_FONTS,
} from "@/config/varsityCustomizer.config";

export type MartialArtsDisplayMode = "front" | "back";

export interface MartialArtsPartsState {
  [key: string]: string;
  jacket: string;
  sleeves: string;
  belt: string;
  pants: string;
}

// Transparent parts extracted from /public/martial-arts/
const ASSET_FRONT_BASE = "/martial-arts/front_base.png";
const ASSET_FRONT_JACKET = "/martial-arts/front_jacket.png";
const ASSET_FRONT_SLEEVES = "/martial-arts/front_sleeves.png";
const ASSET_FRONT_BELT = "/martial-arts/front_belt.png";
const ASSET_FRONT_PANTS = "/martial-arts/front_pants.png";

const ASSET_BACK_BASE = "/martial-arts/back_base.png";
const ASSET_BACK_JACKET = "/martial-arts/back_jacket.png";
const ASSET_BACK_SLEEVES = "/martial-arts/back_sleeves.png";
const ASSET_BACK_BELT = "/martial-arts/back_belt.png";
const ASSET_BACK_PANTS = "/martial-arts/back_pants.png";

interface MartialArtsCustomizerViewerProps {
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
  academyName?: string;
  rankTitle?: string;
  children?: React.ReactNode;
}

export const MartialArtsCustomizerViewer: React.FC<MartialArtsCustomizerViewerProps> = ({
  partColors,
  activeGarmentPart = "jacket",
  onSelectPart,
  onColorChange,
  className = "w-full",
  view = "front",
  customLetters,
  onUpdateLetters,
  customLogo,
  onUpdateLogo,
  onRemoveLogo,
  academyName = "CM JIU-JITSU",
  rankTitle = "BLACK BELT",
  children,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging state for custom PNG logo
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isResizingLogo, setIsResizingLogo] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, origX: 38, origY: 26 });
  const resizeStartRef = useRef({ startX: 0, startY: 0, origScale: 1 });

  // Dragging state for letters
  const [isDraggingLetters, setIsDraggingLetters] = useState(false);
  const letterDragStartRef = useRef({ startX: 0, startY: 0, origX: 38, origY: 34 });

  const onUpdateLettersRef = useRef(onUpdateLetters);
  useEffect(() => {
    onUpdateLettersRef.current = onUpdateLetters;
  }, [onUpdateLetters]);

  // Sync displayMode with parent customizer view (front / back)
  const [displayMode, setDisplayMode] = useState<MartialArtsDisplayMode>(
    view === "back" ? "back" : "front"
  );

  useEffect(() => {
    if (displayMode === "front" && view === "back") {
      setDisplayMode("back");
    } else if (displayMode === "back" && view === "front") {
      setDisplayMode("front");
    }
  }, [view]);

  // Part colors with traditional martial arts defaults
  const jacketColor = partColors.jacket || partColors.body || "#F8FAFC";
  const sleevesColor = partColors.sleeves || partColors.jacket || "#F8FAFC";
  const beltColor = partColors.belt || "#0B0B0B";
  const pantsColor = partColors.pants || partColors.jacket || "#F8FAFC";

  const lettersCount = Math.max(1, (customLetters?.text || "").trim().length);
  const letterFontSize = lettersCount === 1 ? 52 : lettersCount === 2 ? 42 : 30;
  const strokeWidthFelt = lettersCount === 1 ? 10 : lettersCount === 2 ? 8 : 6;
  const feltBorderColor =
    customLetters?.borderColor === "tonal"
      ? (jacketColor || "#F8FAFC")
      : customLetters?.borderColor || "#0B0B0B";
  const activeFont =
    VARSITY_FONTS.find((f) => f.id === customLetters?.fontId) || VARSITY_FONTS[0];

  const handleLetterMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!customLetters?.enabled || !customLetters.text.trim()) return;
    e.stopPropagation();
    onSelectPart?.("letters");
    setIsDraggingLetters(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    letterDragStartRef.current = {
      startX: clientX,
      startY: clientY,
      origX: customLetters.x ?? 38,
      origY: customLetters.y ?? 34,
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingLetters || !canvasRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaXPercent = ((clientX - letterDragStartRef.current.startX) / rect.width) * 100;
      const deltaYPercent = ((clientY - letterDragStartRef.current.startY) / rect.height) * 100;

      const newX = Math.round(
        Math.max(20, Math.min(80, letterDragStartRef.current.origX + deltaXPercent))
      );
      const newY = Math.round(
        Math.max(15, Math.min(50, letterDragStartRef.current.origY + deltaYPercent))
      );

      onUpdateLettersRef.current?.({ x: newX, y: newY });
    };

    const handleUp = () => setIsDraggingLetters(false);

    if (isDraggingLetters) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDraggingLetters]);

  // Handle Logo Dragging
  const handleLogoMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!customLogo?.enabled || !customLogo.url) return;
    e.stopPropagation();
    onSelectPart?.("logo");
    setIsDraggingLogo(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      origX: customLogo.x ?? 38,
      origY: customLogo.y ?? 26,
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingLogo || !canvasRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaXPercent = ((clientX - dragStartRef.current.startX) / rect.width) * 100;
      const deltaYPercent = ((clientY - dragStartRef.current.startY) / rect.height) * 100;

      const newX = Math.round(
        Math.max(20, Math.min(80, dragStartRef.current.origX + deltaXPercent))
      );
      const newY = Math.round(
        Math.max(12, Math.min(48, dragStartRef.current.origY + deltaYPercent))
      );

      onUpdateLogo?.({ x: newX, y: newY });
    };

    const handleUp = () => setIsDraggingLogo(false);

    if (isDraggingLogo) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDraggingLogo, onUpdateLogo]);

  // Preload all assets
  useEffect(() => {
    const assets = [
      ASSET_FRONT_BASE,
      ASSET_FRONT_JACKET,
      ASSET_FRONT_SLEEVES,
      ASSET_FRONT_BELT,
      ASSET_FRONT_PANTS,
      ASSET_BACK_BASE,
      ASSET_BACK_JACKET,
      ASSET_BACK_SLEEVES,
      ASSET_BACK_BELT,
      ASSET_BACK_PANTS,
    ];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getLayerBlendStyle = (hex: string, baseOpacity = 0.9) => {
    if (!hex) return { mixBlendMode: "multiply" as const, opacity: baseOpacity };
    const clean = hex.toLowerCase().trim();

    if (clean === "#ffffff" || clean === "#fafafa" || clean === "#f8fafc") {
      return { mixBlendMode: "screen" as const, opacity: 0.18 };
    }
    if (clean === "#f4f4ef" || clean === "#f3efe6" || clean === "#eae3d2" || clean === "#e4e4e7") {
      return { mixBlendMode: "multiply" as const, opacity: 0.5 };
    }
    if (clean === "#0a0a0a" || clean === "#111111" || clean === "#1c1c1e" || clean === "#0b0b0b") {
      return { mixBlendMode: "multiply" as const, opacity: 0.95 };
    }
    return { mixBlendMode: "multiply" as const, opacity: baseOpacity };
  };

  const getMaskStyle = (assetPath: string) => {
    const encoded = encodeURI(assetPath);
    return {
      WebkitMaskImage: `url('${encoded}')`,
      maskImage: `url('${encoded}')`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    };
  };

  return (
    <div
      ref={canvasRef}
      className={`relative w-full max-w-[440px] sm:max-w-[480px] aspect-square flex items-center justify-center select-none transition-all duration-300 ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* Studio Ambient Shadow */}
      <div className="absolute bottom-3 w-[78%] h-8 bg-black/15 blur-xl rounded-full pointer-events-none" />

      {/* ================================================================= */}
      {/* GARMENT LAYERS: FRONT VIEW CONTAINER */}
      {/* ================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          displayMode === "front"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        <img
          src={ASSET_FRONT_BASE}
          alt="Martial Arts Uniform Base Front"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
          draggable={false}
        />

        {/* LAYER 1: PANTS (ZUBON) */}
        <div
          onClick={() => onSelectPart?.("pants")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "pants" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Martial Arts Pants"
        >
          <img
            src={ASSET_FRONT_PANTS}
            alt="Martial Arts Pants Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: pantsColor,
              ...getMaskStyle(ASSET_FRONT_PANTS),
              ...getLayerBlendStyle(pantsColor, 0.9),
            }}
          />
        </div>

        {/* LAYER 2: SLEEVES */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Kimono Sleeves"
        >
          <img
            src={ASSET_FRONT_SLEEVES}
            alt="Kimono Sleeves Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: sleevesColor,
              ...getMaskStyle(ASSET_FRONT_SLEEVES),
              ...getLayerBlendStyle(sleevesColor, 0.9),
            }}
          />
        </div>

        {/* LAYER 3: JACKET BODY (UWAGI) */}
        <div
          onClick={() => onSelectPart?.("jacket")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jacket" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Kimono Jacket Body"
        >
          <img
            src={ASSET_FRONT_JACKET}
            alt="Kimono Jacket Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jacketColor,
              ...getMaskStyle(ASSET_FRONT_JACKET),
              ...getLayerBlendStyle(jacketColor, 0.9),
            }}
          />
        </div>

        {/* LAYER 4: RANK BELT (OBI) */}
        <div
          onClick={() => onSelectPart?.("belt")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "belt" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Rank Belt (Obi)"
        >
          <img
            src={ASSET_FRONT_BELT}
            alt="Martial Arts Rank Belt Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: beltColor,
              ...getMaskStyle(ASSET_FRONT_BELT),
              ...getLayerBlendStyle(beltColor, 0.95),
            }}
          />
        </div>

        {/* CHEST EMBROIDERY / ACADEMY INITIALS */}
        {customLetters?.enabled && customLetters.text.trim() && (
          <div
            onMouseDown={handleLetterMouseDown}
            onTouchStart={handleLetterMouseDown}
            style={{
              left: `${customLetters.x ?? 38}%`,
              top: `${customLetters.y ?? 34}%`,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute z-30 cursor-move group select-none transition-shadow ${
              activeGarmentPart === "letters"
                ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent rounded-[2px]"
                : "hover:ring-1 hover:ring-black/40"
            }`}
            title="Drag to reposition chest embroidery"
          >
            <div className="relative flex items-center justify-center">
              <svg
                width={lettersCount * letterFontSize * 0.95 + 30}
                height={letterFontSize * 1.5 + 20}
                viewBox={`0 0 ${lettersCount * letterFontSize * 0.95 + 30} ${letterFontSize * 1.5 + 20}`}
                className="overflow-visible drop-shadow-md"
              >
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontFamily={activeFont.family}
                  fontSize={letterFontSize}
                  fontWeight="900"
                  fill="none"
                  stroke={feltBorderColor}
                  strokeWidth={strokeWidthFelt}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  {customLetters.text}
                </text>
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontFamily={activeFont.family}
                  fontSize={letterFontSize}
                  fontWeight="900"
                  fill={customLetters.color || "#0B0B0B"}
                >
                  {customLetters.text}
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* CHEST ACADEMY LOGO */}
        {customLogo?.enabled && customLogo.url && (
          <div
            onMouseDown={handleLogoMouseDown}
            onTouchStart={handleLogoMouseDown}
            style={{
              left: `${customLogo.x ?? 38}%`,
              top: `${customLogo.y ?? 26}%`,
              transform: `translate(-50%, -50%) scale(${customLogo.scale ?? 1}) rotate(${
                customLogo.rotation ?? 0
              }deg) ${customLogo.flippedH ? "scaleX(-1)" : ""}`,
            }}
            className={`absolute z-30 cursor-move group select-none ${
              activeGarmentPart === "logo"
                ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent rounded-[2px]"
                : "hover:ring-1 hover:ring-black/40"
            }`}
            title="Drag to reposition academy logo"
          >
            <img
              src={customLogo.url}
              alt="Academy Patch"
              className="w-20 h-20 object-contain pointer-events-none drop-shadow-lg"
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* GARMENT LAYERS: BACK VIEW CONTAINER */}
      {/* ================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          displayMode === "back"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        <img
          src={ASSET_BACK_BASE}
          alt="Martial Arts Uniform Base Back"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
          draggable={false}
        />

        {/* PANTS BACK */}
        <div
          onClick={() => onSelectPart?.("pants")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "pants" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Martial Arts Pants"
        >
          <img
            src={ASSET_BACK_PANTS}
            alt="Martial Arts Pants Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: pantsColor,
              ...getMaskStyle(ASSET_BACK_PANTS),
              ...getLayerBlendStyle(pantsColor, 0.9),
            }}
          />
        </div>

        {/* SLEEVES BACK */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Kimono Sleeves"
        >
          <img
            src={ASSET_BACK_SLEEVES}
            alt="Kimono Sleeves Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: sleevesColor,
              ...getMaskStyle(ASSET_BACK_SLEEVES),
              ...getLayerBlendStyle(sleevesColor, 0.9),
            }}
          />
        </div>

        {/* JACKET BACK */}
        <div
          onClick={() => onSelectPart?.("jacket")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jacket" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Kimono Jacket Back"
        >
          <img
            src={ASSET_BACK_JACKET}
            alt="Kimono Jacket Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jacketColor,
              ...getMaskStyle(ASSET_BACK_JACKET),
              ...getLayerBlendStyle(jacketColor, 0.9),
            }}
          />
        </div>

        {/* BELT BACK */}
        <div
          onClick={() => onSelectPart?.("belt")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "belt" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Rank Belt (Obi)"
        >
          <img
            src={ASSET_BACK_BELT}
            alt="Martial Arts Rank Belt Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: beltColor,
              ...getMaskStyle(ASSET_BACK_BELT),
              ...getLayerBlendStyle(beltColor, 0.95),
            }}
          />
        </div>

        {/* LARGE REAR ACADEMY PATCH / EMBROIDERY */}
        <div
          className="absolute z-20 pointer-events-none flex flex-col items-center justify-center text-center px-4"
          style={{
            left: "50%",
            top: "28%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-28 h-28 rounded-full border-2 border-black/20 flex flex-col items-center justify-center p-2 bg-black/5 backdrop-blur-[1px]">
            <span
              className="text-[11px] font-black tracking-widest uppercase"
              style={{
                fontFamily: activeFont.family,
                color: feltBorderColor,
              }}
            >
              {academyName}
            </span>
            <div className="w-10 h-[1.5px] bg-[#D10115] my-1" />
            <span
              className="text-[8.5px] font-mono font-bold tracking-wider uppercase text-neutral-600"
            >
              {rankTitle}
            </span>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};
