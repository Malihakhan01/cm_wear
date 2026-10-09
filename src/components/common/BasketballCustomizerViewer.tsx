"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Layers, Eye, Move, Box, Maximize2 } from "lucide-react";
import {
  CustomLettersState,
  CustomLogoState,
  VARSITY_FONTS,
} from "@/config/varsityCustomizer.config";

export type BasketballDisplayMode = "front" | "back" | "dual";

export interface BasketballPartsState {
  [key: string]: string;
  jersey: string;
  ribs: string;
  shorts: string;
}

// Exact asset paths from /public/basketball/
const ASSET_FRONT_JERSEY = "/basketball/front (3) (1).png";
const ASSET_BACK_JERSEY = "/basketball/back (3) (1).png";
const ASSET_FRONT_RIBS = "/basketball/front ribs (1).png";
const ASSET_BACK_RIBS = "/basketball/ribs (4) (1).png";
const ASSET_FRONT_SHORTS = "/basketball/front shorts (1).png";
const ASSET_BACK_SHORTS = "/basketball/shorts back (1).png";

interface BasketballCustomizerViewerProps {
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

export const BasketballCustomizerViewer: React.FC<BasketballCustomizerViewerProps> = ({
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
  playerNumber = "23",
  playerName = "TAWFIQ",
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
  const letterDragStartRef = useRef({ startX: 0, startY: 0, origX: 50, origY: 34 });

  const onUpdateLettersRef = useRef(onUpdateLetters);
  useEffect(() => {
    onUpdateLettersRef.current = onUpdateLetters;
  }, [onUpdateLetters]);

  // Sync displayMode with parent customizer view (front / back)
  const [displayMode, setDisplayMode] = useState<BasketballDisplayMode>(
    view === "back" ? "back" : "front"
  );

  useEffect(() => {
    if (displayMode === "front" && view === "back") {
      setDisplayMode("back");
    } else if (displayMode === "back" && view === "front") {
      setDisplayMode("front");
    }
  }, [view]);

  // Part colors with sensible basketball defaults
  const jerseyColor = partColors.jersey || partColors.body || "#CA8A04";
  const ribsColor = partColors.ribs || partColors.collar || "#111B2C";
  const shortsColor = partColors.shorts || partColors.pants || "#CA8A04";

  const lettersCount = Math.max(1, (customLetters?.text || "").trim().length);
  const letterFontSize = lettersCount === 1 ? 56 : lettersCount === 2 ? 46 : 34;
  const strokeWidthFelt = lettersCount === 1 ? 12 : lettersCount === 2 ? 10 : 8;
  const feltBorderColor =
    customLetters?.borderColor === "tonal"
      ? (jerseyColor || "#CA8A04")
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
      origX: customLetters.x ?? 50,
      origY: customLetters.y ?? 34,
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
        const newX = Math.max(12, Math.min(88, letterDragStartRef.current.origX + deltaX));
        const newY = Math.max(12, Math.min(88, letterDragStartRef.current.origY + deltaY));
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
      origX: customLogo.x ?? 50,
      origY: customLogo.y ?? 28,
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
        const newX = Math.max(10, Math.min(90, dragStartRef.current.origX + deltaX));
        const newY = Math.max(12, Math.min(88, dragStartRef.current.origY + deltaY));
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

  // Preload all basketball assets immediately
  useEffect(() => {
    const assets = [
      ASSET_FRONT_JERSEY,
      ASSET_BACK_JERSEY,
      ASSET_FRONT_RIBS,
      ASSET_BACK_RIBS,
      ASSET_FRONT_SHORTS,
      ASSET_BACK_SHORTS,
    ];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getLayerBlendStyle = (hex: string, baseOpacity = 0.9) => {
    if (!hex) return { mixBlendMode: "multiply" as const, opacity: baseOpacity };
    const clean = hex.toLowerCase().trim();

    // Optic white
    if (clean === "#ffffff" || clean === "#fafafa" || clean === "#f8fafc") {
      return { mixBlendMode: "screen" as const, opacity: 0.22 };
    }
    // Creams / ivory / bone
    if (clean === "#f4f4ef" || clean === "#f3efe6" || clean === "#eae3d2" || clean === "#e4e4e7") {
      return { mixBlendMode: "multiply" as const, opacity: 0.5 };
    }
    // Very dark / black
    if (clean === "#0a0a0a" || clean === "#111111" || clean === "#1c1c1e") {
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
      {/* GARMENT LAYERS: FRONT VIEW CONTAINER (PERSISTENT IN DOM) */}
      {/* ================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          displayMode === "front"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        {/* LAYER 1: GAME SHORTS (front shorts (1).png) */}
        <div
          onClick={() => onSelectPart?.("shorts")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "shorts" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
        >
          <img
            src={ASSET_FRONT_SHORTS}
            alt="Basketball Game Shorts Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: shortsColor,
              ...getMaskStyle(ASSET_FRONT_SHORTS),
              ...getLayerBlendStyle(shortsColor, 0.9),
            }}
          />
        </div>

        {/* LAYER 2: JERSEY TORSO (front (3) (1).png) */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" || activeGarmentPart === "body"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
        >
          <img
            src={ASSET_FRONT_JERSEY}
            alt="Basketball Jersey Torso Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jerseyColor,
              ...getMaskStyle(ASSET_FRONT_JERSEY),
              ...getLayerBlendStyle(jerseyColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 3: NECK & ARMHOLE RIBS (front ribs (1).png) */}
        <div
          onClick={() => onSelectPart?.("ribs")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "ribs" || activeGarmentPart === "collar"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
        >
          <img
            src={ASSET_FRONT_RIBS}
            alt="Basketball Rib Trim Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: ribsColor,
              ...getMaskStyle(ASSET_FRONT_RIBS),
              ...getLayerBlendStyle(ribsColor, 0.92),
            }}
          />
        </div>

        {/* Subtle Highlight Sheen */}
        <img
          src={ASSET_FRONT_JERSEY}
          alt="Mesh Highlight Sheen"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ mixBlendMode: "screen", opacity: 0.1 }}
        />
      </div>

      {/* ================================================================= */}
      {/* GARMENT LAYERS: BACK VIEW CONTAINER (PERSISTENT IN DOM) */}
      {/* ================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          displayMode === "back"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        {/* LAYER 1: BACK GAME SHORTS (shorts back (1).png) */}
        <div
          onClick={() => onSelectPart?.("shorts")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "shorts" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
        >
          <img
            src={ASSET_BACK_SHORTS}
            alt="Basketball Game Shorts Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: shortsColor,
              ...getMaskStyle(ASSET_BACK_SHORTS),
              ...getLayerBlendStyle(shortsColor, 0.9),
            }}
          />
        </div>

        {/* LAYER 2: BACK JERSEY TORSO (back (3) (1).png) */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" || activeGarmentPart === "body"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
        >
          <img
            src={ASSET_BACK_JERSEY}
            alt="Basketball Jersey Torso Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jerseyColor,
              ...getMaskStyle(ASSET_BACK_JERSEY),
              ...getLayerBlendStyle(jerseyColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 3: BACK NECK & ARMHOLE RIBS (ribs (4) (1).png) */}
        <div
          onClick={() => onSelectPart?.("ribs")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "ribs" || activeGarmentPart === "collar"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
        >
          <img
            src={ASSET_BACK_RIBS}
            alt="Basketball Rib Trim Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: ribsColor,
              ...getMaskStyle(ASSET_BACK_RIBS),
              ...getLayerBlendStyle(ribsColor, 0.92),
            }}
          />
        </div>

        {/* Subtle Highlight Sheen */}
        <img
          src={ASSET_BACK_JERSEY}
          alt="Mesh Highlight Sheen Back"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ mixBlendMode: "screen", opacity: 0.1 }}
        />
      </div>

      {/* ================================================================= */}
      {/* VIEWPORT CONTROLS / OVERLAYS: MONOGRAM & LOGO PLACEMENT */}
      {/* ================================================================= */}
      {/* 1. Custom Monogram / Player Number Overlay */}
      {customLetters?.enabled && customLetters.text.trim() && displayMode === (customLetters.view || "front") && (
        <div
          onMouseDown={handleLetterMouseDown}
          onTouchStart={handleLetterMouseDown}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart?.("letters");
          }}
          className={`absolute select-none transition-shadow ${
            isDraggingLetters ? "cursor-grabbing" : "cursor-grab"
          } ${
            activeGarmentPart === "letters"
              ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent shadow-lg"
              : "hover:ring-1 hover:ring-[#D10115]/50"
          }`}
          style={{
            zIndex: 40,
            left: `${customLetters.x ?? 50}%`,
            top: `${customLetters.y ?? 34}%`,
            width: "22%",
            height: "16%",
            transform: "translate(-50%, -50%)",
            transition: isDraggingLetters ? "none" : "box-shadow 0.2s",
            touchAction: "none",
            backgroundColor: "rgba(0,0,0,0.001)",
          }}
          title={`Click & drag to reposition monogram / number: "${customLetters.text}"`}
        >
          <svg
            viewBox="0 0 120 80"
            className="w-full h-full overflow-visible drop-shadow-[0_5px_8px_rgba(0,0,0,0.45)] pointer-events-none"
          >
            <defs>
              <filter id="basketballTackleTwill" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* Outer Felt Outline / Tackle Twill backing */}
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

            {/* Inner Core Monogram */}
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
              filter="url(#basketballTackleTwill)"
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

      {/* 2. Custom Uploaded / Preset Logo Overlay */}
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
            left: `${customLogo.x ?? 50}%`,
            top: `${customLogo.y ?? 24}%`,
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
  );
};
