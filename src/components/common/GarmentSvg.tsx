import React from "react";

export interface GarmentSvgProps {
  type?: "hoodie" | "tshirt" | "jacket" | "varsity" | "blazer" | "dress" | "trousers" | "tote" | "cap" | "corset" | "shorts";
  category?: string;
  subType?: string;
  color?: string;
  partColors?: Record<string, string>;
  view?: "front" | "back" | "left" | "right" | "detail" | "threeD";
  className?: string;
}

export const GarmentSvg: React.FC<GarmentSvgProps> = ({
  type,
  category,
  subType,
  color,
  partColors = {},
  view = "front",
  className = "w-full h-full",
}) => {
  // Resolve effective garment type from type, subType, or category
  const targetStr = (type || subType || category || "hoodie").toLowerCase();
  let resolvedType: GarmentSvgProps["type"] = "hoodie";

  if (targetStr.includes("varsity")) resolvedType = "varsity";
  else if (targetStr.includes("hoodie")) resolvedType = "hoodie";
  else if (targetStr.includes("t-shirt") || targetStr.includes("tee") || targetStr.includes("shirt") || targetStr.includes("top")) resolvedType = "tshirt";
  else if (targetStr.includes("blazer")) resolvedType = "blazer";
  else if (targetStr.includes("jacket") || targetStr.includes("bomber")) resolvedType = "jacket";
  else if (targetStr.includes("dress")) resolvedType = "dress";
  else if (targetStr.includes("corset")) resolvedType = "corset";
  else if (targetStr.includes("pant") || targetStr.includes("trouser") || targetStr.includes("jogger")) resolvedType = "trousers";
  else if (targetStr.includes("short")) resolvedType = "shorts";
  else if (targetStr.includes("tote") || targetStr.includes("bag")) resolvedType = "tote";
  else if (targetStr.includes("cap") || targetStr.includes("beanie") || targetStr.includes("hat")) resolvedType = "cap";
  else if (targetStr.includes("casual")) resolvedType = "tshirt";
  else if (targetStr.includes("fashion")) resolvedType = "dress";

  const effectiveBaseColor = color || partColors.body || partColors.front || partColors.upper || "#222224";
  const bodyColor = effectiveBaseColor;
  const sleeveColor = partColors.sleeves || "#F3EFE6";
  const hoodColor = partColors.hood || bodyColor;
  const cuffColor = partColors.cuffs || partColors.collar || partColors.ribbing || bodyColor;
  const waistbandColor = partColors.waistband || cuffColor;
  const pocketColor = partColors.pockets || partColors.pocket || sleeveColor;
  const collarColor = partColors.collar || partColors.lapels || bodyColor;
  const skirtColor = partColors.skirt || partColors.legs || bodyColor;
  const buttonsColor = partColors.buttons || partColors.snaps || "#FBBF24";

  if (resolvedType === "varsity") {
    return (
      <svg
        viewBox="0 0 500 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Sleeves (Raglan Cut: Supple Cowhide Leather) */}
        <path
          d="M 160 115 L 50 360 C 44 372 58 382 72 376 L 115 340 L 160 210 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.35"
        />
        <path
          d="M 340 115 L 450 360 C 456 372 442 382 428 376 L 385 340 L 340 210 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.35"
        />

        {/* Ribbed Striped Cuffs */}
        <polygon points="50,360 72,376 92,352 70,336" fill={cuffColor} stroke="#000000" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="56" y1="364" x2="76" y2="344" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.8" />

        <polygon points="450,360 428,376 408,352 430,336" fill={cuffColor} stroke="#000000" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="444" y1="364" x2="424" y2="344" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.8" />

        {/* Main Body (Melton Wool Torso) */}
        <path
          d="M 160 115 L 340 115 L 368 460 L 132 460 Z"
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.35"
        />

        {/* Ribbed Striped Waistband */}
        <rect x="130" y="460" width="240" height="34" rx="2" fill={waistbandColor} stroke="#000000" strokeWidth="2" strokeOpacity="0.35" />
        <line x1="132" y1="471" x2="368" y2="471" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.85" />
        <line x1="132" y1="481" x2="368" y2="481" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.85" />

        {/* Striped Ribbed Collar */}
        <path
          d="M 175 115 C 175 70 325 70 325 115 C 295 138 205 138 175 115 Z"
          fill={collarColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.35"
        />
        <path
          d="M 188 108 C 220 86 280 86 312 108"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeOpacity="0.85"
        />

        {/* FRONT VIEW ONLY DETAILS */}
        {view !== "back" && (
          <>
            {/* Center Front Snap Placket */}
            <line x1="250" y1="130" x2="250" y2="460" stroke="#000000" strokeWidth="2" strokeOpacity="0.25" />

            {/* Snap Fasteners */}
            {[160, 215, 270, 325, 380, 435].map((y) => (
              <g key={y}>
                <circle cx="250" cy={y} r="5.5" fill={buttonsColor} stroke="#000000" strokeWidth="1.2" strokeOpacity="0.4" />
                <circle cx="250" cy={y} r="2.8" fill="#ffffff" fillOpacity="0.4" />
              </g>
            ))}

            {/* Left Pocket Welt (Leather Trim) */}
            <g transform="rotate(-28 175 365)">
              <rect x="150" y="358" width="50" height="12" rx="3" fill={pocketColor} stroke="#000000" strokeWidth="1.5" strokeOpacity="0.4" />
            </g>

            {/* Right Pocket Welt (Leather Trim) */}
            <g transform="rotate(28 325 365)">
              <rect x="300" y="358" width="50" height="12" rx="3" fill={pocketColor} stroke="#000000" strokeWidth="1.5" strokeOpacity="0.4" />
            </g>
          </>
        )}

        {/* Raglan Stitch Lines */}
        <line x1="175" y1="115" x2="160" y2="210" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.25" />
        <line x1="325" y1="115" x2="340" y2="210" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.25" />
      </svg>
    );
  }

  if (resolvedType === "hoodie") {
    return (
      <svg
        viewBox="0 0 500 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <radialGradient id="hoodShade" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </radialGradient>
          <linearGradient id="foldGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Sleeves (Left & Right) */}
        <path
          d="M 140 140 L 40 320 C 35 330 45 340 55 338 L 105 285 L 140 220 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />
        <path
          d="M 360 140 L 460 320 C 465 330 455 340 445 338 L 395 285 L 360 220 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />

        {/* Sleeve Cuffs */}
        <polygon
          points="40,320 55,338 75,322 60,305"
          fill={cuffColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <polygon
          points="460,320 445,338 425,322 440,305"
          fill={cuffColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Main Body */}
        <path
          d="M 140 140 L 360 140 L 375 460 L 125 460 Z"
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />

        {/* Rib Waistband */}
        <rect
          x="123"
          y="460"
          width="254"
          height="32"
          rx="2"
          fill={waistbandColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Kangaroo Pocket (Front View Only) */}
        {view !== "back" && (
          <path
            d="M 180 340 L 320 340 L 340 440 L 160 440 Z"
            fill={pocketColor}
            stroke="#000000"
            strokeWidth="2"
            strokeOpacity="0.35"
          />
        )}

        {/* Double-Layer Hood */}
        <path
          d="M 160 140 C 160 30 340 30 340 140 C 310 170 190 170 160 140 Z"
          fill={hoodColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.4"
        />

        {/* Hood Inner Shadow / Cavity */}
        <path
          d="M 195 130 C 195 65 305 65 305 130 C 280 155 220 155 195 130 Z"
          fill="url(#hoodShade)"
        />

        {/* Drawstrings (Front View Only) */}
        {view !== "back" && (
          <g stroke="#ffffff" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round">
            <path d="M 230 155 Q 225 210 215 250" />
            <path d="M 270 155 Q 275 210 285 250" />
            <circle cx="215" cy="252" r="3" fill="#ffffff" />
            <circle cx="285" cy="252" r="3" fill="#ffffff" />
          </g>
        )}

        {/* Fabric Folds & Subtle Drop Shadows */}
        <path d="M 140 140 L 125 460" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />
        <path d="M 360 140 L 375 460" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />
      </svg>
    );
  }

  if (resolvedType === "tshirt") {
    return (
      <svg
        viewBox="0 0 500 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Sleeves */}
        <path
          d="M 145 120 L 50 220 C 45 226 50 234 58 232 L 115 215 L 145 180 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.25"
        />
        <path
          d="M 355 120 L 450 220 C 455 226 450 234 442 232 L 385 215 L 355 180 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.25"
        />

        {/* Main Body */}
        <path
          d="M 145 120 L 355 120 L 365 470 L 135 470 Z"
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.25"
        />

        {/* Bound Neck Rib */}
        <path
          d="M 195 120 C 195 155 305 155 305 120 C 290 105 210 105 195 120 Z"
          fill={collarColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Hem line */}
        <line x1="135" y1="465" x2="365" y2="465" stroke="#000000" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (resolvedType === "blazer" || resolvedType === "jacket") {
    return (
      <svg
        viewBox="0 0 500 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Sleeves with sculpted shoulders */}
        <path
          d="M 130 115 L 60 410 L 105 415 L 140 220 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />
        <path
          d="M 370 115 L 440 410 L 395 415 L 360 220 Z"
          fill={sleeveColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />

        {/* Torso */}
        <path
          d="M 130 115 L 370 115 L 380 480 L 120 480 Z"
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />

        {/* Lapels */}
        <polygon
          points="250,280 180,115 220,115 250,220"
          fill={collarColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <polygon
          points="250,280 320,115 280,115 250,220"
          fill={collarColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.4"
        />

        {/* Double Breasted Buttons */}
        <circle cx="230" cy="310" r="5" fill="#d4d4ce" stroke="#222" strokeWidth="1" />
        <circle cx="270" cy="310" r="5" fill="#d4d4ce" stroke="#222" strokeWidth="1" />
        <circle cx="230" cy="360" r="5" fill="#d4d4ce" stroke="#222" strokeWidth="1" />
        <circle cx="270" cy="360" r="5" fill="#d4d4ce" stroke="#222" strokeWidth="1" />

        {/* Pockets */}
        <rect x="150" y="380" width="60" height="6" fill="#000000" fillOpacity="0.3" rx="1" />
        <rect x="290" y="380" width="60" height="6" fill="#000000" fillOpacity="0.3" rx="1" />
      </svg>
    );
  }

  if (resolvedType === "dress") {
    return (
      <svg
        viewBox="0 0 500 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Straps */}
        <rect x="195" y="80" width="10" height="60" fill={bodyColor} />
        <rect x="295" y="80" width="10" height="60" fill={bodyColor} />

        {/* Bodice */}
        <path
          d="M 180 140 C 210 160 290 160 320 140 L 310 260 L 190 260 Z"
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Boning Lines on Bodice */}
        <line x1="220" y1="150" x2="215" y2="260" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
        <line x1="250" y1="155" x2="250" y2="260" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
        <line x1="280" y1="150" x2="285" y2="260" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />

        {/* Column Skirt */}
        <path
          d="M 190 260 L 310 260 L 340 540 L 160 540 Z"
          fill={skirtColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Side Slit Accent */}
        <line x1="295" y1="360" x2="315" y2="540" stroke="#000000" strokeWidth="2" strokeOpacity="0.4" />
      </svg>
    );
  }

  if (resolvedType === "corset") {
    return (
      <svg
        viewBox="0 0 500 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M 160 160 C 200 130 220 180 250 160 C 280 180 300 130 340 160 L 325 340 L 250 375 L 175 340 Z"
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />
        {/* Boning Channels */}
        <path d="M 210 165 L 210 350" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
        <path d="M 230 165 L 232 360" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
        <path d="M 250 160 L 250 375" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
        <path d="M 270 165 L 268 360" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
        <path d="M 290 165 L 290 350" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
      </svg>
    );
  }

  if (resolvedType === "trousers" || resolvedType === "shorts") {
    const isShorts = resolvedType === "shorts";
    const bottomY = isShorts ? 360 : 520;
    return (
      <svg
        viewBox="0 0 500 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Waistband */}
        <rect
          x="150"
          y="100"
          width="200"
          height="30"
          rx="2"
          fill={waistbandColor}
          stroke="#000000"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Legs */}
        <path
          d={`M 150 130 L 140 ${bottomY} L 230 ${bottomY} L 250 250 L 270 ${bottomY} L 360 ${bottomY} L 350 130 Z`}
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />

        {/* Front Fly and Pleats */}
        <line x1="250" y1="130" x2="250" y2="210" stroke="#000000" strokeWidth="2" strokeOpacity="0.3" />
        <line x1="200" y1="130" x2="195" y2="280" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />
        <line x1="300" y1="130" x2="305" y2="280" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />
      </svg>
    );
  }

  if (resolvedType === "tote") {
    return (
      <svg
        viewBox="0 0 500 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Handles */}
        <path
          d="M 190 200 L 190 70 C 190 50 310 50 310 70 L 310 200"
          fill="none"
          stroke={sleeveColor}
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Tote Canvas Body */}
        <polygon
          points="130,190 370,190 350,470 150,470"
          fill={bodyColor}
          stroke="#000000"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />
        {/* Reinforced Box-X Stitches */}
        <rect x="182" y="195" width="16" height="24" fill="none" stroke="#222" strokeWidth="1.5" />
        <line x1="182" y1="195" x2="198" y2="219" stroke="#222" strokeWidth="1" />
        <line x1="198" y1="195" x2="182" y2="219" stroke="#222" strokeWidth="1" />

        <rect x="302" y="195" width="16" height="24" fill="none" stroke="#222" strokeWidth="1.5" />
        <line x1="302" y1="195" x2="318" y2="219" stroke="#222" strokeWidth="1" />
        <line x1="318" y1="195" x2="302" y2="219" stroke="#222" strokeWidth="1" />
      </svg>
    );
  }

  // Default / Cap
  return (
    <svg
      viewBox="0 0 500 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cap Crown */}
      <path
        d="M 140 250 C 140 120 360 120 360 250 Z"
        fill={bodyColor}
        stroke="#000000"
        strokeWidth="2.5"
        strokeOpacity="0.3"
      />
      {/* 6-Panel Seams */}
      <path d="M 250 125 L 250 250" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M 250 125 C 200 160 170 210 160 250" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />
      <path d="M 250 125 C 300 160 330 210 340 250" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.2" />
      {/* Top Button */}
      <circle cx="250" cy="125" r="7" fill={bodyColor} stroke="#222" strokeWidth="1.5" />
      {/* Visor Brim */}
      <path
        d="M 140 250 C 160 240 340 240 360 250 C 370 270 340 310 250 310 C 160 310 130 270 140 250 Z"
        fill={cuffColor}
        stroke="#000000"
        strokeWidth="2.5"
        strokeOpacity="0.3"
      />
    </svg>
  );
};

export default GarmentSvg;
