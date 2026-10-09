"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

interface VarsityJacketGrayscaleViewerProps {
  partColors: Record<string, string>;
  activeGarmentPart?: string;
  onSelectPart?: (partId: string) => void;
  onColorChange?: (colorHex: string) => void;
  className?: string;
  view?: "front" | "back" | "left" | "right" | "detail" | "threeD";
  onSwitchToFront?: () => void;
  children?: React.ReactNode;
}

const ASSET_ARMS = "/varsity_jacket/FRONT_arms.png";
const ASSET_BODY = "/varsity_jacket/FRONT_BODY.png";
const ASSET_POCKETS = "/varsity_jacket/FRONT_side_pockets.png";
const ASSET_RIBS = "/varsity_jacket/FRONT_ribs.png";
const ASSET_BUTTONS = "/varsity_jacket/FRONT_buttons.png";

// High-resolution 3000x3000px back view layer assets
const ASSET_BACK_BODY = "/varsity_jacket/BACK_JACKET.png";
const ASSET_BACK_SLEEVES = "/varsity_jacket/BACK_sleeves.png";
const ASSET_BACK_RIBS = "/varsity_jacket/BACK_RIBS.png";

export const VarsityJacketGrayscaleViewer: React.FC<VarsityJacketGrayscaleViewerProps> = ({
  partColors,
  activeGarmentPart = "body",
  onSelectPart,
  onColorChange,
  className = "w-full",
  view = "front",
  onSwitchToFront,
  children,
}) => {
  // Intelligent color blend mapping for 3D shaded grayscale layers
  const getLayerBlendStyle = (hex: string | undefined, baseOpacity = 0.88) => {
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
    if (clean === "#0b0b0b" || clean === "#000000" || clean === "#18181b" || clean === "#111111") {
      return { mixBlendMode: "multiply" as const, opacity: 0.94 };
    }
    // Vibrant colors (Crimson, Gold, Forest Green, Royal Navy)
    return { mixBlendMode: "multiply" as const, opacity: baseOpacity };
  };

  const bodyColor = partColors.body || "#0B0B0B";
  const sleevesColor = partColors.sleeves || "#F3EFE6";
  const pocketsColor = partColors.pockets || partColors.sleeves || "#F3EFE6";
  const collarColor = partColors.collar || partColors.body || "#0B0B0B";
  const cuffsColor = partColors.cuffs || partColors.collar || partColors.body || "#0B0B0B";
  const waistbandColor = partColors.waistband || partColors.body || "#0B0B0B";
  const buttonsColor = partColors.buttons || partColors.snaps || "#D4D4CE";

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* =========================================================================
          MAIN GARMENT CANVAS (420x420 Square Coordinate System)
         ========================================================================= */}
      <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
        {/* Ambient Studio Shadow */}
        <div className="absolute bottom-4 w-[74%] h-8 bg-black/15 blur-xl rounded-full pointer-events-none" />

        {/* GARMENT VIEW: FRONT OR BACK */}
        {view === "back" ? (
          /* BACK VIEW: 5 Photorealistic Layers */
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            {/* BACK LAYER 1: SLEEVES (BACK_sleeves.png) */}
            <div className="absolute inset-0 transition-all duration-200">
              <img
                src={ASSET_BACK_SLEEVES}
                alt="Varsity Back Leather Sleeves"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: sleevesColor,
                  WebkitMaskImage: `url('${ASSET_BACK_SLEEVES}')`,
                  maskImage: `url('${ASSET_BACK_SLEEVES}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(sleevesColor, 0.88),
                }}
              />
            </div>

            {/* BACK LAYER 2: TORSO BODY (BACK_JACKET.png) */}
            <div className="absolute inset-0 transition-all duration-200">
              <img
                src={ASSET_BACK_BODY}
                alt="Varsity Back Melton Wool Torso"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: bodyColor,
                  WebkitMaskImage: `url('${ASSET_BACK_BODY}')`,
                  maskImage: `url('${ASSET_BACK_BODY}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(bodyColor, 0.88),
                }}
              />
            </div>

            {/* BACK LAYER 3A: RIBBED COLLAR (BACK_RIBS.png - Top Region) */}
            <div
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "collar" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
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
                  backgroundColor: collarColor,
                  WebkitMaskImage: `url('${ASSET_BACK_RIBS}')`,
                  maskImage: `url('${ASSET_BACK_RIBS}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(collarColor, 0.88),
                }}
              />
            </div>

            {/* BACK LAYER 3B: RIBBED WAISTBAND (BACK_RIBS.png - Bottom Center Region) */}
            <div
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "waistband" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
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
                  backgroundColor: waistbandColor,
                  WebkitMaskImage: `url('${ASSET_BACK_RIBS}')`,
                  maskImage: `url('${ASSET_BACK_RIBS}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(waistbandColor, 0.88),
                }}
              />
            </div>

            {/* BACK LAYER 3C: RIBBED WRIST CUFFS (BACK_RIBS.png - Bottom Left & Right) */}
            <div
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
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
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
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
        ) : (
          /* FRONT VIEW: 5 Photorealistic Layers */
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            {/* LAYER 1: SLEEVES (FRONT_arms.png) */}
            <div className="absolute inset-0 transition-all duration-200">
              <img
                src={ASSET_ARMS}
                alt="Varsity Leather Sleeves"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: sleevesColor,
                  WebkitMaskImage: `url('${ASSET_ARMS}')`,
                  maskImage: `url('${ASSET_ARMS}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(sleevesColor, 0.88),
                }}
              />
            </div>

            {/* LAYER 2: TORSO BODY (FRONT_BODY.png) */}
            <div className="absolute inset-0 transition-all duration-200">
              <img
                src={ASSET_BODY}
                alt="Varsity Melton Wool Torso"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: bodyColor,
                  WebkitMaskImage: `url('${ASSET_BODY}')`,
                  maskImage: `url('${ASSET_BODY}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(bodyColor, 0.88),
                }}
              />
            </div>

            {/* LAYER 3: SIDE POCKET WELTS (FRONT_side_pockets.png) */}
            <div
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "pockets" ? "drop-shadow-[0_0_10px_rgba(209,1,21,0.5)]" : ""
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

            {/* LAYER 4A: RIBBED COLLAR (Top Region of FRONT_ribs.png) */}
            <div
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "collar" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
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
                  backgroundColor: collarColor,
                  WebkitMaskImage: `url('${ASSET_RIBS}')`,
                  maskImage: `url('${ASSET_RIBS}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(collarColor, 0.88),
                }}
              />
            </div>

            {/* LAYER 4B: RIBBED WAISTBAND (Bottom Center Region of FRONT_ribs.png) */}
            <div
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "waistband" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
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
                  backgroundColor: waistbandColor,
                  WebkitMaskImage: `url('${ASSET_RIBS}')`,
                  maskImage: `url('${ASSET_RIBS}')`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  ...getLayerBlendStyle(waistbandColor, 0.88),
                }}
              />
            </div>

            {/* LAYER 4C: RIBBED CUFFS (Left & Right Wrist Cuffs of FRONT_ribs.png) */}
            <div
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
              }`}
              style={{
                clipPath: "polygon(0% 70%, 22% 70%, 22% 100%, 0% 100%, 0% 0%, 0% 0%)",
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
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "cuffs" ? "drop-shadow-[0_0_12px_rgba(209,1,21,0.5)]" : ""
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
              className={`absolute inset-0 transition-all duration-200 ${
                activeGarmentPart === "buttons" || activeGarmentPart === "snaps"
                  ? "drop-shadow-[0_0_10px_rgba(209,1,21,0.6)]"
                  : ""
              }`}
            >
              <img
                src={ASSET_BUTTONS}
                alt="Varsity Snap Buttons"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: buttonsColor,
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
        )}

        {/* CLICK HOTSPOTS OVERLAY (For direct garment click selection) */}
        {onSelectPart && (
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-auto z-10"
            style={{ pointerEvents: "none" }}
          >
            {/* Collar Hotspot */}
            <polygon
              points="36,4 64,4 62,20 38,20"
              className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
              onClick={() => onSelectPart("collar")}
            >
              <title>Ribbed Collar</title>
            </polygon>

            {/* Sleeves Hotspots */}
            <polygon
              points="4,20 25,17 23,83 2,83"
              className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
              onClick={() => onSelectPart("sleeves")}
            >
              <title>Left Sleeve</title>
            </polygon>
            <polygon
              points="75,17 96,20 98,83 77,83"
              className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
              onClick={() => onSelectPart("sleeves")}
            >
              <title>Right Sleeve</title>
            </polygon>

            {/* Torso Body Hotspot */}
            <polygon
              points="25,18 75,18 73,81 27,81"
              className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
              onClick={() => onSelectPart("body")}
            >
              <title>Torso Body</title>
            </polygon>

            {/* Pockets Hotspots (Front Only) */}
            {view !== "back" && (
              <>
                <polygon
                  points="24,53 34,53 30,77 22,77"
                  className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart("pockets");
                  }}
                >
                  <title>Left Pocket Welt</title>
                </polygon>
                <polygon
                  points="66,53 76,53 78,77 70,77"
                  className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart("pockets");
                  }}
                >
                  <title>Right Pocket Welt</title>
                </polygon>
              </>
            )}

            {/* Waistband Hotspot */}
            <polygon
              points="24,81 76,81 74,96 26,96"
              className="cursor-pointer fill-transparent hover:fill-black/5 pointer-events-auto transition-colors"
              onClick={() => onSelectPart("waistband")}
            >
              <title>Ribbed Waistband</title>
            </polygon>

            {/* Buttons Hotspot (Front Only) */}
            {view !== "back" && (
              <polygon
                points="46,18 54,18 54,94 46,94"
                className="cursor-pointer fill-transparent hover:fill-black/10 pointer-events-auto transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPart("buttons");
                }}
              >
                <title>Snap Buttons</title>
              </polygon>
            )}
          </svg>
        )}

        {/* Children (Safe print guide, uploaded artwork/logos, text monograms) */}
        {children && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
