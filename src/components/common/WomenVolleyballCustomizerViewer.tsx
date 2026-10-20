"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Layers, Eye, Move, Box, Maximize2 } from "lucide-react";
import {
  CustomLettersState,
  CustomLogoState,
  VARSITY_FONTS,
} from "@/config/varsityCustomizer.config";

export type WomenVolleyballDisplayMode = "front" | "back";

export interface WomenVolleyballPartsState {
  [key: string]: string;
  jersey: string;
  sleeves: string;
  shorts: string;
}

const ASSET_FRONT_BASE = "/women-volleyball-uniform/front_base.png";
const ASSET_FRONT_JERSEY = "/women-volleyball-uniform/front_jersey.png";
const ASSET_FRONT_SLEEVES = "/women-volleyball-uniform/front_sleeves.png";
const ASSET_FRONT_SHORTS = "/women-volleyball-uniform/front_shorts.png";

const ASSET_BACK_BASE = "/women-volleyball-uniform/back_base.png";
const ASSET_BACK_JERSEY = "/women-volleyball-uniform/back_jersey.png";
const ASSET_BACK_SLEEVES = "/women-volleyball-uniform/back_sleeves.png";
const ASSET_BACK_SHORTS = "/women-volleyball-uniform/back_shorts.png";

interface WomenVolleyballCustomizerViewerProps {
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

export const WomenVolleyballCustomizerViewer: React.FC<WomenVolleyballCustomizerViewerProps> = ({
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
  playerNumber = "04",
  playerName = "CM SPIKERS",
  children,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isResizingLogo, setIsResizingLogo] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, origX: 50, origY: 28 });
  const resizeStartRef = useRef({ startX: 0, startY: 0, origScale: 1 });

  const [isDraggingLetters, setIsDraggingLetters] = useState(false);
  const letterDragStartRef = useRef({ startX: 0, startY: 0, origX: 50, origY: 30 });

  const onUpdateLettersRef = useRef(onUpdateLetters);
  useEffect(() => {
    onUpdateLettersRef.current = onUpdateLetters;
  }, [onUpdateLetters]);

  const [displayMode, setDisplayMode] = useState<WomenVolleyballDisplayMode>(
    view === "back" ? "back" : "front"
  );

  useEffect(() => {
    if (displayMode === "front" && view === "back") {
      setDisplayMode("back");
    } else if (displayMode === "back" && view === "front") {
      setDisplayMode("front");
    }
  }, [view]);

  const jerseyColor = partColors.jersey || partColors.body || "#D97706";
  const sleevesColor = partColors.sleeves || partColors.body || "#FFFFFF";
  const shortsColor = partColors.shorts || partColors.pants || "#18181B";

  const lettersCount = Math.max(1, (customLetters?.text || "").trim().length);
  const letterFontSize = lettersCount === 1 ? 56 : lettersCount === 2 ? 46 : 34;
  const strokeWidthFelt = lettersCount === 1 ? 12 : lettersCount === 2 ? 10 : 8;
  const feltBorderColor =
    customLetters?.borderColor === "tonal"
      ? (jerseyColor || "#D97706")
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

  useEffect(() => {
    const assets = [
      ASSET_FRONT_BASE,
      ASSET_FRONT_JERSEY,
      ASSET_FRONT_SLEEVES,
      ASSET_FRONT_SHORTS,
      ASSET_BACK_BASE,
      ASSET_BACK_JERSEY,
      ASSET_BACK_SLEEVES,
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

    if (clean === "#ffffff" || clean === "#fafafa" || clean === "#f8fafc") {
      return { mixBlendMode: "screen" as const, opacity: 0.22 };
    }
    if (clean === "#f4f4ef" || clean === "#f3efe6" || clean === "#eae3d2" || clean === "#e4e4e7") {
      return { mixBlendMode: "multiply" as const, opacity: 0.5 };
    }
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
      <div className="absolute bottom-3 w-[78%] h-8 bg-black/15 blur-xl rounded-full pointer-events-none" />

      {/* FRONT VIEW */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          displayMode === "front"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        {/* LAYER 1: SPANDEX SHORTS */}
        <div
          onClick={() => onSelectPart?.("shorts")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "shorts" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Spandex Shorts"
        >
          <img
            src={ASSET_FRONT_SHORTS}
            alt="Volleyball Shorts Front"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: shortsColor,
              ...getMaskStyle(ASSET_FRONT_SHORTS),
              ...getLayerBlendStyle(shortsColor, 0.92),
            }}
          />
        </div>

        {/* LAYER 2: CAP SLEEVES */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Cap Sleeves"
        >
          <img
            src={ASSET_FRONT_SLEEVES}
            alt="Volleyball Sleeves Front"
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

        {/* LAYER 3: JERSEY BODY */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Volleyball Jersey Body"
        >
          <img
            src={ASSET_FRONT_JERSEY}
            alt="Volleyball Jersey Front"
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

        {/* FRONT EMBROIDERY */}
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

        {/* FRONT LOGO */}
        {customLogo?.enabled && customLogo.url && (
          <div
            onMouseDown={handleLogoMouseDown}
            onTouchStart={handleLogoMouseDown}
            style={{
              left: `${customLogo.x ?? 50}%`,
              top: `${customLogo.y ?? 28}%`,
              transform: `translate(-50%, -50%) rotate(${customLogo.rotation ?? 0}deg)`,
              width: `${(customLogo.scale ?? 1) * 74}px`,
              height: `${(customLogo.scale ?? 1) * 74}px`,
            }}
            className={`absolute z-30 cursor-move group select-none ${
              activeGarmentPart === "logo"
                ? "ring-2 ring-[#D10115] ring-offset-2 ring-offset-transparent rounded-[2px]"
                : "hover:ring-1 hover:ring-black/40"
            }`}
            title="Drag to move, corner to resize"
          >
            <img
              src={customLogo.url}
              alt="Custom Volleyball Logo"
              className="w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            {activeGarmentPart === "logo" && (
              <div
                onMouseDown={handleResizeCornerMouseDown}
                onTouchStart={handleResizeCornerMouseDown}
                className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#D10115] text-white rounded-full flex items-center justify-center cursor-nwse-resize shadow-md hover:scale-110 active:scale-95 transition-transform"
                title="Resize Logo"
              >
                <Maximize2 className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* BACK VIEW */}
      <div
        className={`absolute inset-0 transition-opacity duration-150 ${
          displayMode === "back"
            ? "opacity-100 z-10 pointer-events-auto"
            : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        {/* BACK LAYER 1: SHORTS */}
        <div
          onClick={() => onSelectPart?.("shorts")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "shorts" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Volleyball Shorts Back"
        >
          <img
            src={ASSET_BACK_SHORTS}
            alt="Volleyball Shorts Back"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: shortsColor,
              ...getMaskStyle(ASSET_BACK_SHORTS),
              ...getLayerBlendStyle(shortsColor, 0.92),
            }}
          />
        </div>

        {/* BACK LAYER 2: SLEEVES */}
        <div
          onClick={() => onSelectPart?.("sleeves")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "sleeves" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Volleyball Sleeves Back"
        >
          <img
            src={ASSET_BACK_SLEEVES}
            alt="Volleyball Sleeves Back"
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

        {/* BACK LAYER 3: JERSEY */}
        <div
          onClick={() => onSelectPart?.("jersey")}
          className={`absolute inset-0 cursor-pointer transition-all duration-200 ${
            activeGarmentPart === "jersey" ? "filter drop-shadow-[0_0_12px_rgba(214,28,36,0.35)]" : ""
          }`}
          title="Click to customize Volleyball Jersey Back"
        >
          <img
            src={ASSET_BACK_JERSEY}
            alt="Volleyball Jersey Back"
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

        {/* BACK PLAYER NUMBER & NAME */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-20 pb-24">
          {playerName && (
            <span
              className="font-extrabold tracking-widest text-[15px] sm:text-[17px] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              style={{
                color: customLetters?.color || "#FFFFFF",
                fontFamily: activeFont.family,
              }}
            >
              {playerName}
            </span>
          )}
          {playerNumber && (
            <span
              className="font-black text-[56px] sm:text-[68px] leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] mt-0.5"
              style={{
                color: customLetters?.color || "#FFFFFF",
                fontFamily: activeFont.family,
                WebkitTextStroke: `3px ${feltBorderColor}`,
              }}
            >
              {playerNumber}
            </span>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};
