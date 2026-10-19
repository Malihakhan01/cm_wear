"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Layers, Eye, Move, Box, Maximize2 } from "lucide-react";
import {
  CustomLettersState,
  CustomLogoState,
  VARSITY_FONTS,
} from "@/config/varsityCustomizer.config";

export type IceHockeyDisplayMode = "front" | "back";

export interface IceHockeyPartsState {
  [key: string]: string;
  jersey: string;
  sleeves: string;
  pants: string;
  socks: string;
}

// Transparent parts extracted from /public/icehockey-uniform/
const ASSET_FRONT_BASE = "/icehockey-uniform/front_base.png";
const ASSET_FRONT_JERSEY = "/icehockey-uniform/front_jersey.png";
const ASSET_FRONT_SLEEVES = "/icehockey-uniform/front_sleeves.png";
const ASSET_FRONT_PANTS = "/icehockey-uniform/front_pants.png";
const ASSET_FRONT_SOCKS = "/icehockey-uniform/front_socks.png";

const ASSET_BACK_BASE = "/icehockey-uniform/back_base.png";
const ASSET_BACK_JERSEY = "/icehockey-uniform/back_jersey.png";
const ASSET_BACK_SLEEVES = "/icehockey-uniform/back_sleeves.png";
const ASSET_BACK_PANTS = "/icehockey-uniform/back_pants.png";
const ASSET_BACK_SOCKS = "/icehockey-uniform/back_socks.png";

interface IceHockeyCustomizerViewerProps {
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
  playerNumber?: string;
  playerName?: string;
  children?: React.ReactNode;
}

export const IceHockeyCustomizerViewer: React.FC<IceHockeyCustomizerViewerProps> = ({
  partColors,
  activeGarmentPart = "jersey",
  onSelectPart,
  onColorChange,
  className = "w-full",
  view = "front",
  customLetters,
  onUpdateLetters,
  customLogo,
  onUpdateLogo,
  onRemoveLogo,
  playerNumber = "99",
  playerName = "CM WARRIORS",
  children,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging state for custom PNG logo
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isResizingLogo, setIsResizingLogo] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, origX: 50, origY: 28 });
  const resizeStartRef = useRef({ startX: 0, startY: 0, origScale: 1 });

  // Dragging state for letters / numbers
  const [isDraggingLetters, setIsDraggingLetters] = useState(false);
  const letterDragStartRef = useRef({ startX: 0, startY: 0, origX: 50, origY: 30 });

  const onUpdateLettersRef = useRef(onUpdateLetters);
  useEffect(() => {
    onUpdateLettersRef.current = onUpdateLetters;
  }, [onUpdateLetters]);

  // Sync displayMode with parent customizer view (front / back)
  const [displayMode, setDisplayMode] = useState<IceHockeyDisplayMode>(
    view === "back" ? "back" : "front"
  );

  useEffect(() => {
    if (displayMode === "front" && view === "back") {
      setDisplayMode("back");
    } else if (displayMode === "back" && view === "front") {
      setDisplayMode("front");
    }
  }, [view]);

  // Part colors with hockey defaults
  const jerseyColor = partColors.jersey || partColors.body || "#DC2626";
  const sleevesColor = partColors.sleeves || partColors.body || "#0A0A0A";
  const pantsColor = partColors.pants || partColors.shorts || "#0A0A0A";
  const socksColor = partColors.socks || partColors.jersey || "#DC2626";

  const lettersCount = Math.max(1, (customLetters?.text || "").trim().length);
  const letterFontSize = lettersCount === 1 ? 58 : lettersCount === 2 ? 48 : 34;
  const strokeWidthFelt = lettersCount === 1 ? 12 : lettersCount === 2 ? 10 : 8;
  const feltBorderColor =
    customLetters?.borderColor === "tonal"
      ? (jerseyColor || "#FFFFFF")
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
      origX: customLetters.x ?? 50,
      origY: customLetters.y ?? 30,
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
        Math.max(14, Math.min(50, letterDragStartRef.current.origY + deltaYPercent))
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
      origX: customLogo.x ?? 50,
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
      ASSET_FRONT_JERSEY,
      ASSET_FRONT_SLEEVES,
      ASSET_FRONT_PANTS,
      ASSET_FRONT_SOCKS,
      ASSET_BACK_BASE,
      ASSET_BACK_JERSEY,
      ASSET_BACK_SLEEVES,
      ASSET_BACK_PANTS,
      ASSET_BACK_SOCKS,
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
        {/* Photorealistic Shaded Base Texture */}
        <img
          src={ASSET_FRONT_BASE}
          alt="Ice Hockey Uniform Base Front"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
          draggable={false}
        />

        {/* LAYER 1: SOCKS */}
        <div
          onClick={() => onSelectPart?.("socks")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "socks" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Socks"
        >
          <img
            src={ASSET_FRONT_SOCKS}
            alt="Ice Hockey Socks Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: socksColor,
              ...getMaskStyle(ASSET_FRONT_SOCKS),
              ...getLayerBlendStyle(socksColor, 0.9),
            }}
          />
        </div>

        {/* LAYER 2: PANTS */}
        <div
          onClick={() => onSelectPart?.("pants")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "pants" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Pants (Breezers)"
        >
          <img
            src={ASSET_FRONT_PANTS}
            alt="Ice Hockey Breezers Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: pantsColor,
              ...getMaskStyle(ASSET_FRONT_PANTS),
              ...getLayerBlendStyle(pantsColor, 0.92),
            }}
          />
        </div>

        {/* LAYER 3: SLEEVES */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Sleeves & Yoke"
        >
          <img
            src={ASSET_FRONT_SLEEVES}
            alt="Ice Hockey Sleeves Front"
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

        {/* LAYER 4: JERSEY BODY */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Jersey Body"
        >
          <img
            src={ASSET_FRONT_JERSEY}
            alt="Ice Hockey Jersey Body Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jerseyColor,
              ...getMaskStyle(ASSET_FRONT_JERSEY),
              ...getLayerBlendStyle(jerseyColor, 0.9),
            }}
          />
        </div>

        {/* FRONT CUSTOM EMBROIDERY / CREST */}
        {customLetters?.enabled && customLetters.text.trim() && (
          <div
            onMouseDown={handleLetterMouseDown}
            onTouchStart={handleLetterMouseDown}
            style={{
              left: `${customLetters.x ?? 50}%`,
              top: `${customLetters.y ?? 30}%`,
              transform: "translate(-50%, -50%)",
            }}
            className={`absolute z-30 cursor-move group select-none transition-shadow ${
              activeGarmentPart === "letters"
                ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent rounded-[2px]"
                : "hover:ring-1 hover:ring-black/40"
            }`}
            title="Drag to reposition front team letters"
          >
            <div className="relative flex items-center justify-center">
              <svg
                width={lettersCount * letterFontSize * 0.95 + 40}
                height={letterFontSize * 1.5 + 20}
                viewBox={`0 0 ${lettersCount * letterFontSize * 0.95 + 40} ${letterFontSize * 1.5 + 20}`}
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
                  fill={customLetters.color || "#FFFFFF"}
                >
                  {customLetters.text}
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* FRONT CUSTOM PNG CREST / LOGO */}
        {customLogo?.enabled && customLogo.url && (
          <div
            onMouseDown={handleLogoMouseDown}
            onTouchStart={handleLogoMouseDown}
            style={{
              left: `${customLogo.x ?? 50}%`,
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
            title="Drag to reposition team crest logo"
          >
            <img
              src={customLogo.url}
              alt="Team Crest"
              className="w-24 h-24 object-contain pointer-events-none drop-shadow-lg"
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
          alt="Ice Hockey Uniform Base Back"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
          draggable={false}
        />

        {/* SOCKS BACK */}
        <div
          onClick={() => onSelectPart?.("socks")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "socks" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Socks"
        >
          <img
            src={ASSET_BACK_SOCKS}
            alt="Ice Hockey Socks Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: socksColor,
              ...getMaskStyle(ASSET_BACK_SOCKS),
              ...getLayerBlendStyle(socksColor, 0.9),
            }}
          />
        </div>

        {/* PANTS BACK */}
        <div
          onClick={() => onSelectPart?.("pants")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "pants" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Pants"
        >
          <img
            src={ASSET_BACK_PANTS}
            alt="Ice Hockey Pants Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: pantsColor,
              ...getMaskStyle(ASSET_BACK_PANTS),
              ...getLayerBlendStyle(pantsColor, 0.92),
            }}
          />
        </div>

        {/* SLEEVES BACK */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Sleeves"
        >
          <img
            src={ASSET_BACK_SLEEVES}
            alt="Ice Hockey Sleeves Back"
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

        {/* JERSEY BACK */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Hockey Jersey Back"
        >
          <img
            src={ASSET_BACK_JERSEY}
            alt="Ice Hockey Jersey Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jerseyColor,
              ...getMaskStyle(ASSET_BACK_JERSEY),
              ...getLayerBlendStyle(jerseyColor, 0.9),
            }}
          />
        </div>

        {/* REAR PRO HOCKEY PLAYER NAME & NUMBER */}
        <div
          className="absolute z-20 pointer-events-none flex flex-col items-center justify-center"
          style={{
            left: "50%",
            top: "27%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            className="text-[13px] font-black tracking-widest uppercase drop-shadow-md"
            style={{
              fontFamily: activeFont.family,
              color: feltBorderColor,
              letterSpacing: "0.2em",
            }}
          >
            {playerName}
          </span>
          <span
            className="text-[64px] font-black leading-none tracking-tight drop-shadow-lg"
            style={{
              fontFamily: activeFont.family,
              color: customLetters?.color || "#FFFFFF",
              textShadow: `0 0 4px ${feltBorderColor}, 0 0 10px ${feltBorderColor}`,
            }}
          >
            {playerNumber}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};
