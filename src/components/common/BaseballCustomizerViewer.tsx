"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Layers, Eye, Move, Box, Maximize2 } from "lucide-react";
import {
  CustomLettersState,
  CustomLogoState,
  VARSITY_FONTS,
} from "@/config/varsityCustomizer.config";

export type BaseballDisplayMode = "front" | "back";

export interface BaseballPartsState {
  [key: string]: string;
  jersey: string;
  sleeves: string;
  trim: string;
  pants: string;
  belt: string;
}

// Transparent parts extracted from /public/baseball-uniform/
const ASSET_FRONT_BASE = "/baseball-uniform/front_base.png";
const ASSET_FRONT_JERSEY = "/baseball-uniform/front_jersey.png";
const ASSET_FRONT_SLEEVES = "/baseball-uniform/front_sleeves.png";
const ASSET_FRONT_TRIM = "/baseball-uniform/front_trim.png";
const ASSET_FRONT_PANTS = "/baseball-uniform/front_pants.png";
const ASSET_FRONT_BELT = "/baseball-uniform/front_belt.png";

const ASSET_BACK_BASE = "/baseball-uniform/back_base.png";
const ASSET_BACK_JERSEY = "/baseball-uniform/back_jersey.png";
const ASSET_BACK_SLEEVES = "/baseball-uniform/back_sleeves.png";
const ASSET_BACK_TRIM = "/baseball-uniform/back_trim.png";
const ASSET_BACK_PANTS = "/baseball-uniform/back_pants.png";
const ASSET_BACK_BELT = "/baseball-uniform/back_belt.png";

interface BaseballCustomizerViewerProps {
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

export const BaseballCustomizerViewer: React.FC<BaseballCustomizerViewerProps> = ({
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
  playerNumber = "42",
  playerName = "CM SPORTS",
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
  const [displayMode, setDisplayMode] = useState<BaseballDisplayMode>(
    view === "back" ? "back" : "front"
  );

  useEffect(() => {
    if (displayMode === "front" && view === "back") {
      setDisplayMode("back");
    } else if (displayMode === "back" && view === "front") {
      setDisplayMode("front");
    }
  }, [view]);

  // Part colors with classic baseball defaults
  const jerseyColor = partColors.jersey || partColors.body || "#FFFFFF";
  const sleevesColor = partColors.sleeves || partColors.body || "#FFFFFF";
  const trimColor = partColors.trim || partColors.ribs || partColors.collar || "#0B0B0B";
  const pantsColor = partColors.pants || partColors.shorts || "#FFFFFF";
  const beltColor = partColors.belt || partColors.snaps || "#0B0B0B";

  const lettersCount = Math.max(1, (customLetters?.text || "").trim().length);
  const letterFontSize = lettersCount === 1 ? 56 : lettersCount === 2 ? 46 : 34;
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

  // Preload all baseball assets immediately
  useEffect(() => {
    const assets = [
      ASSET_FRONT_BASE,
      ASSET_FRONT_JERSEY,
      ASSET_FRONT_SLEEVES,
      ASSET_FRONT_TRIM,
      ASSET_FRONT_PANTS,
      ASSET_FRONT_BELT,
      ASSET_BACK_BASE,
      ASSET_BACK_JERSEY,
      ASSET_BACK_SLEEVES,
      ASSET_BACK_TRIM,
      ASSET_BACK_PANTS,
      ASSET_BACK_BELT,
    ];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getLayerBlendStyle = (hex: string, baseOpacity = 0.9) => {
    if (!hex) return { mixBlendMode: "multiply" as const, opacity: baseOpacity };
    const clean = hex.toLowerCase().trim();

    // Optic white / near white
    if (clean === "#ffffff" || clean === "#fafafa" || clean === "#f8fafc") {
      return { mixBlendMode: "screen" as const, opacity: 0.18 };
    }
    // Creams / ivory / bone
    if (clean === "#f4f4ef" || clean === "#f3efe6" || clean === "#eae3d2" || clean === "#e4e4e7") {
      return { mixBlendMode: "multiply" as const, opacity: 0.5 };
    }
    // Very dark / black
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
      {/* GARMENT LAYERS: FRONT VIEW CONTAINER (PERSISTENT IN DOM) */}
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
          alt="Baseball Uniform Base Front"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
          draggable={false}
        />

        {/* LAYER 1: BASEBALL PANTS */}
        <div
          onClick={() => onSelectPart?.("pants")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "pants" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Baseball Pants"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: pantsColor,
              ...getMaskStyle(ASSET_FRONT_PANTS),
              ...getLayerBlendStyle(pantsColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 2: WAISTBAND & BELT */}
        <div
          onClick={() => onSelectPart?.("belt")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "belt" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Belt & Loops"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: beltColor,
              ...getMaskStyle(ASSET_FRONT_BELT),
              ...getLayerBlendStyle(beltColor, 0.95),
            }}
          />
        </div>

        {/* LAYER 3: SLEEVES */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Sleeves"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: sleevesColor,
              ...getMaskStyle(ASSET_FRONT_SLEEVES),
              ...getLayerBlendStyle(sleevesColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 4: JERSEY TORSO */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" || activeGarmentPart === "body"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
          title="Click to customize Jersey Torso"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jerseyColor,
              ...getMaskStyle(ASSET_FRONT_JERSEY),
              ...getLayerBlendStyle(jerseyColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 5: PIPING & COLLAR TRIM */}
        <div
          onClick={() => onSelectPart?.("trim")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "trim" || activeGarmentPart === "ribs" || activeGarmentPart === "collar"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
          title="Click to customize Collar & Placket Piping"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: trimColor,
              ...getMaskStyle(ASSET_FRONT_TRIM),
              ...getLayerBlendStyle(trimColor, 0.94),
            }}
          />
        </div>

        {/* Subtle Highlight Sheen */}
        <img
          src={ASSET_FRONT_BASE}
          alt="Baseball Fabric Highlight Sheen"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ mixBlendMode: "screen", opacity: 0.12 }}
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
        {/* Photorealistic Shaded Base Texture Back */}
        <img
          src={ASSET_BACK_BASE}
          alt="Baseball Uniform Base Back"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
          draggable={false}
        />

        {/* LAYER 1: BACK PANTS */}
        <div
          onClick={() => onSelectPart?.("pants")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "pants" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Back Pants"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: pantsColor,
              ...getMaskStyle(ASSET_BACK_PANTS),
              ...getLayerBlendStyle(pantsColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 2: BACK BELT */}
        <div
          onClick={() => onSelectPart?.("belt")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "belt" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Back Belt"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: beltColor,
              ...getMaskStyle(ASSET_BACK_BELT),
              ...getLayerBlendStyle(beltColor, 0.95),
            }}
          />
        </div>

        {/* LAYER 3: BACK SLEEVES */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Back Sleeves"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: sleevesColor,
              ...getMaskStyle(ASSET_BACK_SLEEVES),
              ...getLayerBlendStyle(sleevesColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 4: BACK JERSEY TORSO */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" || activeGarmentPart === "body"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
          title="Click to customize Back Jersey"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: jerseyColor,
              ...getMaskStyle(ASSET_BACK_JERSEY),
              ...getLayerBlendStyle(jerseyColor, 0.88),
            }}
          />
        </div>

        {/* LAYER 5: BACK COLLAR & CUFF TRIM */}
        <div
          onClick={() => onSelectPart?.("trim")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "trim" || activeGarmentPart === "ribs" || activeGarmentPart === "collar"
              ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]"
              : ""
          }`}
          title="Click to customize Back Trim"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: trimColor,
              ...getMaskStyle(ASSET_BACK_TRIM),
              ...getLayerBlendStyle(trimColor, 0.94),
            }}
          />
        </div>

        {/* Subtle Highlight Sheen */}
        <img
          src={ASSET_BACK_BASE}
          alt="Baseball Fabric Highlight Sheen Back"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ mixBlendMode: "screen", opacity: 0.12 }}
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
            left: `${customLetters.x ?? 50}%`,
            top: `${customLetters.y ?? 34}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 35,
          }}
        >
          <div className="relative flex items-center justify-center p-2 group">
            <svg
              className="overflow-visible"
              style={{
                width: `${lettersCount * (letterFontSize * 0.72) + 24}px`,
                height: `${letterFontSize + 24}px`,
              }}
            >
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="central"
                fill={feltBorderColor}
                stroke={feltBorderColor}
                strokeWidth={strokeWidthFelt}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  fontFamily: activeFont.family,
                  fontSize: `${letterFontSize}px`,
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                {customLetters.text.toUpperCase()}
              </text>
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="central"
                fill={customLetters.color || "#0B0B0B"}
                style={{
                  fontFamily: activeFont.family,
                  fontSize: `${letterFontSize}px`,
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}
              >
                {customLetters.text.toUpperCase()}
              </text>
            </svg>
            <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white p-1 rounded-full pointer-events-none">
              <Move className="w-3 h-3 text-[#D10115]" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Uploaded Team Crest / Logo Overlay */}
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
              : "hover:ring-1 hover:ring-[#D10115]/50"
          }`}
          style={{
            left: `${customLogo.x ?? 50}%`,
            top: `${customLogo.y ?? 28}%`,
            transform: `translate(-50%, -50%) scale(${customLogo.scale ?? 1})`,
            zIndex: 36,
          }}
        >
          <div className="relative group p-1">
            <img
              src={customLogo.url}
              alt="Custom Team Crest"
              className="max-w-[70px] sm:max-w-[90px] max-h-[70px] sm:max-h-[90px] object-contain drop-shadow-md pointer-events-none"
              draggable={false}
            />
            {activeGarmentPart === "logo" && (
              <div
                onMouseDown={handleResizeCornerMouseDown}
                onTouchStart={handleResizeCornerMouseDown}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#D10115] text-white rounded-full flex items-center justify-center cursor-nwse-resize shadow-md"
                title="Drag to resize logo"
              >
                <Maximize2 className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Switcher Capsule (Front / Back) */}
      <div className="absolute top-2 left-2 z-40 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-[#E6E6E2] p-0.5 rounded-[2px] shadow-xs">
        <button
          type="button"
          onClick={() => setDisplayMode("front")}
          className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-[2px] transition-colors flex items-center gap-1 ${
            displayMode === "front"
              ? "bg-[#0B0B0B] text-white shadow-xs"
              : "text-neutral-600 hover:text-black"
          }`}
        >
          <Eye className="w-2.5 h-2.5" />
          <span>Front</span>
        </button>
        <button
          type="button"
          onClick={() => setDisplayMode("back")}
          className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-[2px] transition-colors flex items-center gap-1 ${
            displayMode === "back"
              ? "bg-[#0B0B0B] text-white shadow-xs"
              : "text-neutral-600 hover:text-black"
          }`}
        >
          <Eye className="w-2.5 h-2.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Children slots */}
      {children}
    </div>
  );
};
