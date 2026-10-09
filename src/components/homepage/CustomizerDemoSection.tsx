"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { RevealHeading } from "@/components/common/RevealHeading";
import { PRESET_SWATCHES } from "@/services/customizer.service";
import {
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
  Type,
  Palette,
  Image as ImageIcon,
  UploadCloud,
  Move,
  Maximize2,
  Trash2,
  Layers,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
} from "lucide-react";
import { VarsityJacketCanvas, VarsityPartsState } from "./VarsityJacketCanvas";
import { HoodieCustomizerViewer } from "@/components/common/HoodieCustomizerViewer";
import { EquestrianCustomizerViewer } from "@/components/common/EquestrianCustomizerViewer";
import { BasketballCustomizerViewer } from "@/components/common/BasketballCustomizerViewer";
import { TechPackModal } from "@/components/common/TechPackModal";
import { PRODUCTS_DATA } from "@/services/products.service";
import {
  VARSITY_FONTS,
  LETTER_SHADE_FAMILIES,
  FELT_BORDER_SHADES,
  BUTTON_FINISHES,
  LINING_OPTIONS,
  CRAFT_TECHNIQUES,
  QUICK_MONOGRAM_PRESETS,
  SAMPLE_LOGOS,
  CustomLettersState,
  CustomLogoState,
  COLOR_PRESETS,
  HOODIE_COLOR_PRESETS,
  EQUESTRIAN_COLOR_PRESETS,
  BASKETBALL_COLOR_PRESETS,
} from "@/config/varsityCustomizer.config";

// Default Varsity Colorway: Ivy League
const INITIAL_VARSITY_COLORS: VarsityPartsState = {
  body: "#1B3B2B",
  sleeves: "#EAE3D2",
  pockets: "#D97706",
  collar: "#12241A",
  cuffs: "#12241A",
  waistband: "#12241A",
  buttons: "#FBBF24",
  patch: "#CA8A04",
};

// Default Hoodie Colorway: Burgundy & Bone
const INITIAL_HOODIE_COLORS: Record<string, string> = {
  body: "#60121D",
  pocket: "#F5EFE6",
  hood: "#400C13",
  sleeves: "#8C2433",
  cuffs: "#400C13",
  waistband: "#400C13",
};

// Default Equestrian Colorway: Tournament Royal Navy
const INITIAL_EQUESTRIAN_COLORS: Record<string, string> = {
  body: "#111B2C",
  sleeves: "#0A0A0A",
  ribs: "#D61C24",
  leggings: "#20201E",
};

// Default Basketball Colorway: Showtime Gold & Royal
const INITIAL_BASKETBALL_COLORS: Record<string, string> = {
  jersey: "#CA8A04",
  ribs: "#111B2C",
  shorts: "#CA8A04",
};


export const CustomizerDemoSection: React.FC = () => {
  // Navigation tabs for the customizer controls: 1st Panels, 2nd Logo, 3rd Letters
  const [controlTab, setControlTab] = useState<"letters" | "logo" | "colors">("colors");

  // Mobile drawer state: on mobile, customizing options are closed by default until user taps a button
  const [isMobileOptionsOpen, setIsMobileOptionsOpen] = useState<boolean>(false);

  // Tech Pack specification sheet modal state
  const [isTechPackOpen, setIsTechPackOpen] = useState<boolean>(false);

  // Collapsible accordion state for the Letters tab
  const [openLetterSections, setOpenLetterSections] = useState<{
    font: boolean;
    color: boolean;
    craft: boolean;
  }>({
    font: false,
    color: false,
    craft: false,
  });

  const toggleLetterSection = (sec: "font" | "color" | "craft") => {
    setOpenLetterSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleTabClick = (tab: "letters" | "logo" | "colors") => {
    if (controlTab === tab) {
      // Toggle options drawer open/closed if clicking the same tab on mobile
      setIsMobileOptionsOpen((prev) => !prev);
    } else {
      // Switch tab and open the options drawer
      setControlTab(tab);
      setIsMobileOptionsOpen(true);
    }
  };

  const getTabButtonClass = (tab: "letters" | "logo" | "colors") => {
    const isCurrent = controlTab === tab;
    // On mobile: active only if options drawer is open AND this tab is selected
    if (isCurrent && isMobileOptionsOpen) {
      return "bg-[#0B0B0B] text-white border-black shadow-xs";
    }
    // On mobile (<lg): looks like a neutral button when closed
    // On desktop (lg): always looks active because options are always open
    if (isCurrent && !isMobileOptionsOpen) {
      return "bg-[#FAFAF8] text-neutral-700 hover:text-black border-[#E6E6E2] lg:bg-[#0B0B0B] lg:text-white lg:border-black lg:shadow-xs";
    }
    return "bg-[#FAFAF8] text-neutral-600 hover:text-black hover:bg-neutral-100 border-[#E6E6E2]";
  };

  // Studio model switcher: hoodie vs varsity vs equestrian vs basketball
  const [activeStudioModel, setActiveStudioModel] = useState<"hoodie" | "varsity" | "equestrian" | "basketball">("varsity");

  // Garment parts state
  const [activePart, setActivePart] = useState<string>("body");
  const [partColors, setPartColors] = useState<VarsityPartsState>(INITIAL_VARSITY_COLORS);
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  // Hoodie-specific part colors
  const [hoodiePartColors, setHoodiePartColors] = useState<Record<string, string>>(INITIAL_HOODIE_COLORS);
  // Equestrian-specific part colors
  const [equestrianPartColors, setEquestrianPartColors] = useState<Record<string, string>>(INITIAL_EQUESTRIAN_COLORS);
  // Basketball-specific part colors
  const [basketballPartColors, setBasketballPartColors] = useState<Record<string, string>>(INITIAL_BASKETBALL_COLORS);
  const [activeWash, setActiveWash] = useState("Clean Raw Mill Finish");
  const [distressLevel, setDistressLevel] = useState<"clean" | "subtle" | "heavy">("clean");

  // Modular varsity construction
  const [sleeveStyle, setSleeveStyle] = useState<"striped" | "plain">("striped");
  const [pocketStyle, setPocketStyle] = useState<"striped" | "plain">("striped");
  const [selectedButtonFinish, setSelectedButtonFinish] = useState("silver");
  const [selectedLining, setSelectedLining] = useState("satin-black");

  // Varsity Custom Monogram Letters State (Max 3 Uppercase Letters) - disabled by default
  const [varsityLetters, setVarsityLetters] = useState<CustomLettersState>({
    enabled: false,
    text: "",
    fontId: "varsity-slab",
    color: "#FBBF24", // Athletic Varsity Gold
    borderColor: "#FFFFFF", // Optic White Felt
    craftStyle: "chenille",
    x: 30,
    y: 30,
  });

  // Hoodie Custom Monogram Letters State (Max 3 Uppercase Letters) - disabled by default
  const [hoodieLetters, setHoodieLetters] = useState<CustomLettersState>({
    enabled: false,
    text: "",
    fontId: "varsity-slab",
    color: "#FBBF24",
    borderColor: "#FFFFFF",
    craftStyle: "chenille",
    x: 65,
    y: 32,
  });

  // Equestrian Custom Monogram Letters State
  const [equestrianLetters, setEquestrianLetters] = useState<CustomLettersState>({
    enabled: false,
    text: "",
    fontId: "varsity-slab",
    color: "#FBBF24",
    borderColor: "#FFFFFF",
    craftStyle: "chenille",
    x: 32,
    y: 28,
  });

  // Basketball Custom Monogram Letters / Number State
  const [basketballLetters, setBasketballLetters] = useState<CustomLettersState>({
    enabled: false,
    text: "",
    fontId: "varsity-slab",
    color: "#FFFFFF",
    borderColor: "#111B2C",
    craftStyle: "chenille",
    x: 50,
    y: 26,
  });

  // Varsity Custom PNG Logo State (Draggable & Resizable) - disabled by default
  const [varsityLogo, setVarsityLogo] = useState<CustomLogoState>({
    enabled: false,
    url: null,
    name: "Brand Logo",
    x: 32, // Right chest position (viewer's left)
    y: 34,
    scale: 0.85,
    rotation: 0,
    flippedH: false,
  });

  // Hoodie Custom PNG Logo State (Draggable & Resizable) - disabled by default
  const [hoodieLogo, setHoodieLogo] = useState<CustomLogoState>({
    enabled: false,
    url: null,
    name: "Brand Logo",
    x: 32,
    y: 34,
    scale: 0.85,
    rotation: 0,
    flippedH: false,
  });

  // Equestrian Custom PNG Logo State
  const [equestrianLogo, setEquestrianLogo] = useState<CustomLogoState>({
    enabled: false,
    url: null,
    name: "Brand Logo",
    x: 30,
    y: 28,
    scale: 0.85,
    rotation: 0,
    flippedH: false,
  });

  // Basketball Custom PNG Logo State
  const [basketballLogo, setBasketballLogo] = useState<CustomLogoState>({
    enabled: false,
    url: null,
    name: "Team Crest",
    x: 50,
    y: 20,
    scale: 0.85,
    rotation: 0,
    flippedH: false,
  });

  // Active Letters & Logo bound to the current active studio model
  const customLetters =
    activeStudioModel === "hoodie"
      ? hoodieLetters
      : activeStudioModel === "equestrian"
      ? equestrianLetters
      : activeStudioModel === "basketball"
      ? basketballLetters
      : varsityLetters;

  const customLogo =
    activeStudioModel === "hoodie"
      ? hoodieLogo
      : activeStudioModel === "equestrian"
      ? equestrianLogo
      : activeStudioModel === "basketball"
      ? basketballLogo
      : varsityLogo;

  const setCustomLetters = useCallback(
    (action: React.SetStateAction<CustomLettersState>) => {
      if (activeStudioModel === "hoodie") {
        setHoodieLetters(action);
      } else if (activeStudioModel === "equestrian") {
        setEquestrianLetters(action);
      } else if (activeStudioModel === "basketball") {
        setBasketballLetters(action);
      } else {
        setVarsityLetters(action);
      }
    },
    [activeStudioModel]
  );

  const setCustomLogo = useCallback(
    (action: React.SetStateAction<CustomLogoState>) => {
      if (activeStudioModel === "hoodie") {
        setHoodieLogo(action);
      } else if (activeStudioModel === "equestrian") {
        setEquestrianLogo(action);
      } else if (activeStudioModel === "basketball") {
        setBasketballLogo(action);
      } else {
        setVarsityLogo(action);
      }
    },
    [activeStudioModel]
  );

  const handleUpdateLetters = useCallback(
    (updates: Partial<CustomLettersState>) => {
      if (activeStudioModel === "hoodie") {
        setHoodieLetters((prev) => ({ ...prev, ...updates }));
      } else if (activeStudioModel === "equestrian") {
        setEquestrianLetters((prev) => ({ ...prev, ...updates }));
      } else if (activeStudioModel === "basketball") {
        setBasketballLetters((prev) => ({ ...prev, ...updates }));
      } else {
        setVarsityLetters((prev) => ({ ...prev, ...updates }));
      }
    },
    [activeStudioModel]
  );


  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Tone filter for letter shades
  const [shadeToneFilter, setShadeToneFilter] = useState<"all" | "light" | "vibrant" | "deep" | "dark">("all");

  const varsityParts = [
    { id: "body", label: "Main Body", desc: "Wool Melton Torso" },
    { id: "sleeves", label: "Sleeves", desc: "Full-Grain Leather Arms" },
    { id: "pockets", label: "Pocket Welts", desc: "Slash Pocket Trim" },
    { id: "collar", label: "Ribbed Collar", desc: "Striped Neck Rib" },
    { id: "cuffs", label: "Sleeve Cuffs", desc: "Striped Wrist Ribs" },
    { id: "waistband", label: "Waistband", desc: "Elastic Hem Rib" },
    { id: "buttons", label: "Snap Buttons", desc: "Hardware Snaps" },
  ];

  const hoodieParts = [
    { id: "body", label: "Main Body", desc: "380 GSM French Terry" },
    { id: "hood", label: "Cap / Hood", desc: "Tunnel Hood & Cap" },
    { id: "pocket", label: "Pocket", desc: "Kangaroo Pouch" },
    { id: "sleeves", label: "Sleeves", desc: "Drop-Shoulder Arms" },
    { id: "cuffs", label: "Cuffs", desc: "Ribbed Wrist Band" },
    { id: "waistband", label: "Waistband", desc: "Elastic Hem Rib" },
  ];

  const equestrianParts = [
    { id: "body", label: "Main Shell", desc: "Italian Bonded Softshell" },
    { id: "sleeves", label: "Sleeves", desc: "Articulated Riding Arms" },
    { id: "ribs", label: "Collar & Trims", desc: "Placket & Collar Trims" },
    { id: "leggings", label: "Leggings / Breeches", desc: "Silicone Hex-Grip Full-Seat" },
  ];

  const basketballParts = [
    { id: "jersey", label: "Jersey Torso", desc: "Diamond Air-Mesh 200 GSM" },
    { id: "ribs", label: "Collar & Arm Ribs", desc: "Striped Rib Binding" },
    { id: "shorts", label: "Game Shorts", desc: "Pro-Cut Mesh Shorts" },
  ];

  const parts =
    activeStudioModel === "hoodie"
      ? hoodieParts
      : activeStudioModel === "equestrian"
      ? equestrianParts
      : activeStudioModel === "basketball"
      ? basketballParts
      : varsityParts;

  const handleColorSelect = (hex: string) => {
    if (activePart === "letters") {
      setCustomLetters((prev) => ({ ...prev, color: hex }));
    } else if (activeStudioModel === "hoodie") {
      setHoodiePartColors((prev) => ({ ...prev, [activePart]: hex }));
    } else if (activeStudioModel === "equestrian") {
      setEquestrianPartColors((prev) => ({ ...prev, [activePart]: hex }));
    } else if (activeStudioModel === "basketball") {
      setBasketballPartColors((prev) => ({ ...prev, [activePart]: hex }));
    } else {
      setPartColors((prev) => ({ ...prev, [activePart]: hex }));
    }
  };

  const handleApplyToAll = (hex: string) => {
    if (activeStudioModel === "hoodie") {
      setHoodiePartColors({
        body: hex, hood: hex, pocket: hex,
        sleeves: hex, cuffs: hex, waistband: hex,
      });
    } else if (activeStudioModel === "equestrian") {
      setEquestrianPartColors({
        body: hex, sleeves: hex, ribs: hex, leggings: hex,
      });
    } else if (activeStudioModel === "basketball") {
      setBasketballPartColors({
        jersey: hex, ribs: hex, shorts: hex,
      });
    } else {
      setPartColors({
        body: hex, sleeves: hex, pockets: hex, collar: hex,
        cuffs: hex, waistband: hex, buttons: hex, patch: hex,
      });
    }
  };

  const handleApplyPreset = (presetColors: VarsityPartsState) => {
    setPartColors(presetColors);
  };

  // Enforce strictly max 3 uppercase letters
  const handleLetterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    const sanitized = rawVal.replace(/[^A-Z0-9.\-]/g, "").slice(0, 3);
    setCustomLetters((prev) => ({
      ...prev,
      text: sanitized,
      enabled: sanitized.trim().length > 0,
    }));
  };

  // Handle Uploading Custom PNG Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const defX = activeStudioModel === "basketball" ? 50 : activeStudioModel === "equestrian" ? 30 : 32;
      const defY = activeStudioModel === "basketball" ? 22 : activeStudioModel === "equestrian" ? 28 : 34;
      setCustomLogo({
        enabled: true,
        url: dataUrl,
        name: file.name,
        x: defX,
        y: defY,
        scale: 0.9,
        rotation: 0,
        flippedH: false,
      });
      setControlTab("logo");
      setActivePart("logo");
    };
    reader.readAsDataURL(file);
  };

  const handleButtonFinishSelect = (finishId: string) => {
    setSelectedButtonFinish(finishId);
    const found = BUTTON_FINISHES.find((b) => b.id === finishId);
    if (found) {
      setPartColors((prev) => ({ ...prev, buttons: found.hex }));
    }
  };

  const handleReset = () => {
    setPartColors(INITIAL_VARSITY_COLORS);
    setHoodiePartColors(INITIAL_HOODIE_COLORS);
    setEquestrianPartColors(INITIAL_EQUESTRIAN_COLORS);
    setBasketballPartColors(INITIAL_BASKETBALL_COLORS);
    setSleeveStyle("striped");
    setPocketStyle("striped");
    setSelectedButtonFinish("silver");
    setSelectedLining("satin-black");
    setActiveWash("Clean Raw Mill Finish");
    setDistressLevel("clean");
    setVarsityLetters({
      enabled: false,
      text: "",
      fontId: "varsity-slab",
      color: "#FBBF24",
      borderColor: "#FFFFFF",
      craftStyle: "chenille",
      x: 30,
      y: 30,
    });
    setHoodieLetters({
      enabled: false,
      text: "",
      fontId: "varsity-slab",
      color: "#FBBF24",
      borderColor: "#FFFFFF",
      craftStyle: "chenille",
      x: 65,
      y: 32,
    });
    setEquestrianLetters({
      enabled: false,
      text: "",
      fontId: "varsity-slab",
      color: "#FBBF24",
      borderColor: "#FFFFFF",
      craftStyle: "chenille",
      x: 32,
      y: 28,
    });
    setBasketballLetters({
      enabled: false,
      text: "",
      fontId: "varsity-slab",
      color: "#FFFFFF",
      borderColor: "#111B2C",
      craftStyle: "chenille",
      x: 50,
      y: 26,
    });
    setVarsityLogo({
      enabled: false,
      url: null,
      name: "Brand Logo",
      x: 32,
      y: 34,
      scale: 0.85,
      rotation: 0,
      flippedH: false,
    });
    setHoodieLogo({
      enabled: false,
      url: null,
      name: "Brand Logo",
      x: 32,
      y: 34,
      scale: 0.85,
      rotation: 0,
      flippedH: false,
    });
    setEquestrianLogo({
      enabled: false,
      url: null,
      name: "Brand Logo",
      x: 30,
      y: 28,
      scale: 0.85,
      rotation: 0,
      flippedH: false,
    });
    setBasketballLogo({
      enabled: false,
      url: null,
      name: "Team Crest",
      x: 50,
      y: 20,
      scale: 0.85,
      rotation: 0,
      flippedH: false,
    });
  };

  const activeFontObj =
    VARSITY_FONTS.find((f) => f.id === customLetters.fontId) || VARSITY_FONTS[0];

  return (
    <section className="w-full bg-white py-20 border-b border-[#E6E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <RevealHeading
            eyebrow={<>CUSTOMIZER LAB &bull; VARSITY ATELIER &bull; MULTI-PANEL DYE</>}
            line1="BUILD IT."
            line2={<span className="text-[#D10115]">YOUR WAY.</span>}
          />
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm leading-relaxed">
            Upload custom PNG logos with drag-and-drop placement, resize interactively, configure 3-letter collegiate monograms, typography, and hardware trims in real time.
          </p>
        </div>

        {/* Studio Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E6E6E2] rounded-[2px] overflow-hidden bg-[#FAFAF8] shadow-sm">
          {/* Left Canvas Preview Area (Col 1 to 7) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between items-center relative border-b lg:border-b-0 lg:border-r border-[#E6E6E2] bg-radial from-white via-[#FAFAF8] to-[#F0F0EC]">
            {/* Top Toolbar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs mb-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Front / Back view toggle */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-[2px] border border-[#E6E6E2] shadow-xs shrink-0">
                  <button
                    onClick={() => setActiveView("front")}
                    className={`px-2.5 sm:px-3 py-1 font-semibold uppercase text-[10px] rounded-[2px] transition-colors cursor-pointer ${
                      activeView === "front"
                        ? "bg-[#0B0B0B] text-white"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setActiveView("back")}
                    className={`px-2.5 sm:px-3 py-1 font-semibold uppercase text-[10px] rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer ${
                      activeView === "back"
                        ? "bg-[#0B0B0B] text-white"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Back view"
                  >
                    <span>Back</span>
                  </button>
                </div>

                {/* Studio Model Switcher: Hoodie vs Varsity vs Equestrian vs Basketball */}
                <div className="flex items-center gap-0.5 bg-[#F5F5F3] border border-[#E6E6E2] p-0.5 rounded-[2px] overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => { setActiveStudioModel("hoodie"); setActivePart("body"); setControlTab("colors"); }}
                    className={`px-2 sm:px-2.5 py-1 font-bold uppercase text-[9.5px] sm:text-[10px] rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeStudioModel === "hoodie"
                        ? "bg-[#0B0B0B] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Hoodie Studio"
                  >
                    <span>👕 Hoodie</span>
                  </button>
                  <button
                    onClick={() => { setActiveStudioModel("varsity"); setActivePart("body"); setControlTab("colors"); setActiveView("front"); }}
                    className={`px-2 sm:px-2.5 py-1 font-bold uppercase text-[9.5px] sm:text-[10px] rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeStudioModel === "varsity"
                        ? "bg-[#0B0B0B] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Varsity Studio"
                  >
                    <span>🧥 Varsity</span>
                  </button>
                  <button
                    onClick={() => { setActiveStudioModel("equestrian"); setActivePart("body"); setControlTab("colors"); setActiveView("front"); }}
                    className={`px-2 sm:px-2.5 py-1 font-bold uppercase text-[9.5px] sm:text-[10px] rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeStudioModel === "equestrian"
                        ? "bg-[#0B0B0B] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Equestrian Studio"
                  >
                    <span>🏇 Equestrian</span>
                  </button>
                  <button
                    onClick={() => { setActiveStudioModel("basketball"); setActivePart("jersey"); setControlTab("colors"); setActiveView("front"); }}
                    className={`px-2 sm:px-2.5 py-1 font-bold uppercase text-[9.5px] sm:text-[10px] rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                      activeStudioModel === "basketball"
                        ? "bg-[#0B0B0B] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                    title="Basketball Studio"
                  >
                    <span>🏀 Basketball</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
                  {activeStudioModel === "basketball"
                    ? "200 GSM Diamond Air-Mesh"
                    : activeStudioModel === "equestrian"
                    ? "320 GSM Italian Softshell"
                    : activeStudioModel === "varsity"
                    ? "500 GSM Melton & Leather"
                    : "380 GSM French Terry"}
                </span>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-neutral-500 hover:text-black bg-white border border-[#E6E6E2] rounded-[2px] transition-colors cursor-pointer"
                  title="Reset to Default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Garment Silhouette Interactive Canvas */}
            <div className="w-full flex items-center justify-center my-4">
              {activeStudioModel === "hoodie" ? (
                <HoodieCustomizerViewer
                  partColors={hoodiePartColors}
                  activeGarmentPart={activePart}
                  onSelectPart={(p) => {
                    setActivePart(p);
                    if (p === "letters") setControlTab("letters");
                    else if (p === "logo") setControlTab("logo");
                    else setControlTab("colors");
                    setIsMobileOptionsOpen(true);
                  }}
                  onColorChange={(hex) =>
                    setHoodiePartColors((prev) => ({ ...prev, [activePart]: hex }))
                  }
                  view={activeView}
                  customLetters={hoodieLetters}
                  onUpdateLetters={(updates) => setHoodieLetters((prev) => ({ ...prev, ...updates }))}
                  customLogo={hoodieLogo}
                  onUpdateLogo={(updates) => setHoodieLogo((prev) => ({ ...prev, ...updates }))}
                  onRemoveLogo={() => setHoodieLogo((prev) => ({ ...prev, enabled: false, url: null }))}
                  className="w-full"
                />
              ) : activeStudioModel === "equestrian" ? (
                <EquestrianCustomizerViewer
                  partColors={equestrianPartColors}
                  activeGarmentPart={activePart}
                  onSelectPart={(p) => {
                    setActivePart(p);
                    if (p === "letters") setControlTab("letters");
                    else if (p === "logo") setControlTab("logo");
                    else setControlTab("colors");
                    setIsMobileOptionsOpen(true);
                  }}
                  onColorChange={(hex) =>
                    setEquestrianPartColors((prev) => ({ ...prev, [activePart]: hex }))
                  }
                  view={activeView}
                  customLetters={equestrianLetters}
                  onUpdateLetters={(updates) => setEquestrianLetters((prev) => ({ ...prev, ...updates }))}
                  customLogo={equestrianLogo}
                  onUpdateLogo={(updates) => setEquestrianLogo((prev) => ({ ...prev, ...updates }))}
                  onRemoveLogo={() => setEquestrianLogo((prev) => ({ ...prev, enabled: false, url: null }))}
                  className="w-full"
                />
              ) : activeStudioModel === "basketball" ? (
                <BasketballCustomizerViewer
                  partColors={basketballPartColors}
                  activeGarmentPart={activePart}
                  onSelectPart={(p) => {
                    setActivePart(p);
                    if (p === "letters") setControlTab("letters");
                    else if (p === "logo") setControlTab("logo");
                    else setControlTab("colors");
                    setIsMobileOptionsOpen(true);
                  }}
                  onColorChange={(hex) =>
                    setBasketballPartColors((prev) => ({ ...prev, [activePart]: hex }))
                  }
                  view={activeView}
                  customLetters={basketballLetters}
                  onUpdateLetters={(updates) => setBasketballLetters((prev) => ({ ...prev, ...updates }))}
                  customLogo={basketballLogo}
                  onUpdateLogo={(updates) => setBasketballLogo((prev) => ({ ...prev, ...updates }))}
                  onRemoveLogo={() => setBasketballLogo((prev) => ({ ...prev, enabled: false, url: null }))}
                  className="w-full"
                />
              ) : (
                <VarsityJacketCanvas
                  partColors={partColors}
                  activePart={activePart}
                  onSelectPart={(p) => {
                    setActivePart(p);
                    if (p === "letters") setControlTab("letters");
                    else if (p === "logo") setControlTab("logo");
                    else setControlTab("colors");
                    setIsMobileOptionsOpen(true);
                  }}
                  sleeveStyle={sleeveStyle}
                  pocketStyle={pocketStyle}
                  activeView={activeView}
                  onSwitchToFront={() => setActiveView("front")}
                  washFinish={activeWash}
                  customLetters={varsityLetters}
                  onUpdateLetters={(updates) => setVarsityLetters((prev) => ({ ...prev, ...updates }))}
                  customLogo={varsityLogo}
                  onUpdateLogo={(updates) => setVarsityLogo((prev) => ({ ...prev, ...updates }))}
                  onRemoveLogo={() => setVarsityLogo((prev) => ({ ...prev, enabled: false, url: null }))}
                  buttonFinishHex={partColors.buttons}
                  distressLevel={distressLevel}
                  className="w-full"
                />
              )}
            </div>

            {/* Bottom active wash tag & quick status */}
            <div className="w-full flex flex-wrap items-center justify-between pt-4 border-t border-[#E6E6E2] text-xs text-neutral-500 gap-2">
              <div className="flex items-center gap-3">
                <span>
                  Finish: <strong className="text-black font-medium">{activeWash}</strong>
                </span>
                {customLogo?.enabled && customLogo.url && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/5 text-black rounded-[2px] text-[10px] font-mono font-semibold">
                    <Move className="w-3 h-3 text-[#D10115]" />
                    <span>Logo: {Math.round((customLogo.scale || 1) * 100)}% Scale</span>
                  </span>
                )}
                {customLetters.enabled && customLetters.text && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/5 text-black rounded-[2px] text-[10px] font-mono font-semibold">
                    Monogram: &ldquo;{customLetters.text}&rdquo;
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-[#D10115]">Interactive Atelier Studio</span>
            </div>
          </div>

          {/* Right Configuration Controls (Col 8 to 12) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white max-h-[850px] relative overflow-hidden">
            {/* Studio Navigation Tabs (Fixed at top of drawer, zero extra spacing, never scrolls) */}
            <div className="p-4 sm:p-5 border-b border-[#E6E6E2] bg-white shrink-0 z-20 flex gap-1.5 overflow-x-auto scrollbar-none">
              {/* 1st: Panels */}
              <button
                onClick={() => handleTabClick("colors")}
                className={`flex items-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-[2px] transition-all shrink-0 border cursor-pointer ${getTabButtonClass("colors")}`}
              >
                <Palette className="w-3.5 h-3.5 text-neutral-400" />
                <span>Panels</span>
                {controlTab === "colors" && isMobileOptionsOpen ? (
                  <ChevronUp className="w-3 h-3 text-white lg:hidden ml-0.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-neutral-400 lg:hidden ml-0.5" />
                )}
              </button>

              {/* 2nd: Logo (PNG) */}
              <button
                onClick={() => handleTabClick("logo")}
                className={`flex items-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-[2px] transition-all shrink-0 border cursor-pointer ${getTabButtonClass("logo")}`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Logo (PNG)</span>
                {controlTab === "logo" && isMobileOptionsOpen ? (
                  <ChevronUp className="w-3 h-3 text-white lg:hidden ml-0.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-neutral-400 lg:hidden ml-0.5" />
                )}
              </button>

              {/* 3rd: Letters */}
              <button
                onClick={() => handleTabClick("letters")}
                className={`flex items-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-[2px] transition-all shrink-0 border cursor-pointer ${getTabButtonClass("letters")}`}
              >
                <Type className="w-3.5 h-3.5 text-[#D10115]" />
                <span>Letters</span>
                {controlTab === "letters" && isMobileOptionsOpen ? (
                  <ChevronUp className="w-3 h-3 text-white lg:hidden ml-0.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-neutral-400 lg:hidden ml-0.5" />
                )}
              </button>
            </div>

            {/* Customizer Options Content Drawer (Scrollable body ONLY) */}
            <div
              id="customizer-options-panel"
              className={`${isMobileOptionsOpen ? "block" : "hidden lg:block"} flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 animate-fadeIn`}
            >
                {/* Mobile Drawer Top Header with Active Tab Name and Close Button */}
                <div className="lg:hidden flex items-center justify-between pb-3 border-b border-[#E6E6E2]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D10115] animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                      {controlTab === "letters" && "Custom Letters & Monogram"}
                      {controlTab === "logo" && "Upload Logo (PNG)"}
                      {controlTab === "colors" && "Panel Colors & Fabric"}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileOptionsOpen(false)}
                    className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-[2px] border border-neutral-300 transition-colors cursor-pointer"
                    aria-label="Close customizing options"
                  >
                    <span>Close</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

              {/* ============================================================== */}
              {/* TAB 1: UPLOAD LOGO IN PNG & INTERACTIVE DRAG/RESIZE */}
              {/* ============================================================== */}
              {controlTab === "logo" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* File Upload Hidden Input */}
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/png, image/svg+xml, image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  {/* Upload Field Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-black">
                        Upload Brand PNG Logo:
                      </label>
                      <span className="text-[9px] font-mono text-purple-600 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-[2px] font-semibold">
                        PNG TRANSPARENCY SUPPORTED
                      </span>
                    </div>

                    <button
                      onClick={() => logoFileInputRef.current?.click()}
                      className="w-full p-5 border-2 border-dashed border-neutral-300 hover:border-black rounded-[2px] bg-[#FAFAF8] hover:bg-neutral-50 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-white border border-[#E6E6E2] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                        <UploadCloud className="w-5 h-5 text-neutral-700" />
                      </div>
                      <span className="text-xs font-bold text-black uppercase tracking-wide">
                        Click to Choose PNG File
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Accepts PNG, SVG, WebP &bull; Drag &amp; resize directly on canvas
                      </span>
                    </button>
                  </div>

                  {/* Active Logo Details Card */}
                  {customLogo?.enabled && customLogo.url ? (
                    <div className="p-3.5 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-[2px] bg-white border border-[#E6E6E2] p-1 flex items-center justify-center shadow-xs">
                            <img
                              src={customLogo.url}
                              alt="Active Logo"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-black block truncate max-w-[170px]">
                              {customLogo.name}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active on Garment
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setCustomLogo((prev) => ({ ...prev, enabled: false, url: null }))}
                          className="text-red-600 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-[2px] transition-colors flex items-center gap-1 text-[11px] font-semibold"
                          title="Remove Logo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Interactive Drag & Resize Guide */}
                      <div className="p-2.5 bg-white border border-[#E6E6E2] rounded-[2px] text-[11px] text-neutral-600 flex items-start gap-2 leading-relaxed">
                        <Move className="w-4 h-4 text-[#D10115] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-black block">Interactive Canvas Drag &amp; Resize:</strong>
                          Click and drag the logo anywhere directly on the jacket. Pull the corner handle to resize live.
                        </div>
                      </div>

                      {/* Scale / Size Slider */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                          <span className="font-bold text-neutral-700 uppercase flex items-center gap-1">
                            <Maximize2 className="w-3 h-3 text-[#D10115]" />
                            Logo Scale:
                          </span>
                          <span className="font-bold text-black">
                            {Math.round((customLogo.scale || 1) * 100)}% ({customLogo.scale?.toFixed(2)}x)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setCustomLogo((prev) => ({
                                ...prev,
                                scale: Math.max(0.35, Number(((prev.scale || 1) - 0.1).toFixed(2))),
                              }))
                            }
                            className="p-1.5 bg-white border border-[#E6E6E2] hover:bg-neutral-100 rounded-[2px] text-neutral-700"
                            title="Decrease Size"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="range"
                            min="0.35"
                            max="2.5"
                            step="0.05"
                            value={customLogo.scale || 1}
                            onChange={(e) =>
                              setCustomLogo((prev) => ({
                                ...prev,
                                scale: Number(e.target.value),
                              }))
                            }
                            className="flex-1 accent-[#D10115] cursor-pointer"
                          />
                          <button
                            onClick={() =>
                              setCustomLogo((prev) => ({
                                ...prev,
                                scale: Math.min(2.5, Number(((prev.scale || 1) + 0.1).toFixed(2))),
                              }))
                            }
                            className="p-1.5 bg-white border border-[#E6E6E2] hover:bg-neutral-100 rounded-[2px] text-neutral-700"
                            title="Increase Size"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Rotation Slider */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                          <span className="font-bold text-neutral-700 uppercase flex items-center gap-1">
                            <RotateCcw className="w-3 h-3 text-neutral-500" />
                            Rotation:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black">{customLogo.rotation || 0}&deg;</span>
                            {customLogo.rotation !== 0 && (
                              <button
                                onClick={() => setCustomLogo((prev) => ({ ...prev, rotation: 0 }))}
                                className="text-[10px] text-[#D10115] hover:underline"
                              >
                                Reset 0&deg;
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="5"
                          value={customLogo.rotation || 0}
                          onChange={(e) =>
                            setCustomLogo((prev) => ({
                              ...prev,
                              rotation: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-black cursor-pointer"
                        />
                      </div>

                      {/* Quick Alignment Snapping Presets */}
                      <div>
                        <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5">
                          Snap to Garment Position:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {(activeStudioModel === "basketball"
                            ? [
                                { label: "Chest Center", x: 50, y: 22 },
                                { label: "Left Chest", x: 35, y: 22 },
                                { label: "Jersey Number", x: 50, y: 36 },
                                { label: "Shorts Leg", x: 35, y: 65 },
                              ]
                            : activeStudioModel === "equestrian"
                            ? [
                                { label: "Right Chest", x: 30, y: 28 },
                                { label: "Center Placket", x: 50, y: 32 },
                                { label: "Left Chest", x: 70, y: 28 },
                                { label: "Riding Breeches", x: 32, y: 68 },
                              ]
                            : [
                                { label: "Right Chest", x: 32, y: 34 },
                                { label: "Center Torso", x: 50, y: 35 },
                                { label: "Left Chest", x: 68, y: 34 },
                                { label: "Lower Pocket", x: 32, y: 56 },
                              ]
                          ).map((pos) => (
                            <button
                              key={pos.label}
                              onClick={() => {
                                setCustomLogo((prev) => ({
                                  ...prev,
                                  x: pos.x,
                                  y: pos.y,
                                }));
                                setActivePart("logo");
                              }}
                              className="py-1 px-1.5 text-[10px] font-semibold bg-white border border-[#E6E6E2] hover:border-black rounded-[2px] text-center transition-colors truncate cursor-pointer"
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Sample Ready-to-Use Brand Logos */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                      Sample Brand Logos &amp; Emblems:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_LOGOS.map((sample) => (
                        <button
                          key={sample.id}
                          onClick={() => {
                            const defX = activeStudioModel === "basketball" ? 50 : activeStudioModel === "equestrian" ? 30 : 32;
                            const defY = activeStudioModel === "basketball" ? 22 : activeStudioModel === "equestrian" ? 28 : 34;
                            setCustomLogo({
                              enabled: true,
                              url: sample.url,
                              name: sample.name,
                              x: defX,
                              y: defY,
                              scale: 0.9,
                              rotation: 0,
                              flippedH: false,
                            });
                            setActivePart("logo");
                          }}
                          className={`p-2.5 bg-white border rounded-[2px] flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                            customLogo.url === sample.url
                              ? "border-black ring-2 ring-black shadow-xs"
                              : "border-[#E6E6E2] hover:border-neutral-400"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-[2px] bg-[#FAFAF8] border border-[#E6E6E2] p-1 flex items-center justify-center shrink-0">
                            <img
                              src={sample.url}
                              alt={sample.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-semibold block truncate">
                              {sample.name}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400 uppercase">
                              {sample.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: CUSTOM LETTERS & MONOGRAM (Collapsible Architecture) */}
              {/* ============================================================== */}
              {controlTab === "letters" && (
                <div className="space-y-3.5 animate-fadeIn">
                  {/* Primary Monogram Input Card (Always Visible) */}
                  <div className="p-4 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-black">
                          Custom Monogram Text:
                        </label>
                        <span className="text-[9px] font-mono bg-black text-white px-1.5 py-0.5 rounded-[2px]">
                          MAX 3 LETTERS &bull; UPPERCASE
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setCustomLetters((prev) => {
                            const nextEnabled = !prev.enabled;
                            return {
                              ...prev,
                              enabled: nextEnabled,
                              text: nextEnabled && !prev.text.trim() ? "TI" : prev.text,
                            };
                          })
                        }
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] border ${
                          customLetters.enabled && customLetters.text.trim()
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-neutral-100 text-neutral-500 border-neutral-300"
                        }`}
                      >
                        {customLetters.enabled && customLetters.text.trim() ? "Active" : "Disabled"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customLetters.text}
                          onChange={handleLetterTextChange}
                          maxLength={3}
                          placeholder="TI"
                          className="w-full px-4 py-2.5 bg-white border-2 border-neutral-300 focus:border-black rounded-[2px] text-lg font-bold tracking-widest uppercase text-center outline-hidden transition-colors"
                          style={{ fontFamily: activeFontObj.family }}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-neutral-400">
                          {customLetters.text.length} / 3
                        </span>
                      </div>
                      <button
                        onClick={() => setCustomLetters((prev) => ({ ...prev, text: "", enabled: false }))}
                        className="py-2.5 px-3 text-xs font-semibold bg-white border border-[#E6E6E2] hover:bg-neutral-100 rounded-[2px] text-neutral-600 transition-colors"
                        title="Clear Text"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Quick Preset Initials */}
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase shrink-0">
                        Quick Presets:
                      </span>
                      {QUICK_MONOGRAM_PRESETS.map((pst) => (
                        <button
                          key={pst}
                          onClick={() => setCustomLetters((prev) => ({ ...prev, text: pst, enabled: true }))}
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-[2px] border transition-all ${
                            customLetters.text === pst
                              ? "bg-black text-white border-black"
                              : "bg-white text-neutral-700 border-[#E6E6E2] hover:border-black"
                          }`}
                        >
                          {pst}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* COLLAPSIBLE SECTION 1: LETTER FONT STYLE */}
                  {/* ============================================================== */}
                  <div className="border border-[#E6E6E2] rounded-[2px] bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleLetterSection("font")}
                      className="w-full flex items-center justify-between p-3 bg-[#FAFAF8] hover:bg-neutral-100 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Type className="w-3.5 h-3.5 text-[#D10115]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                          Letter Font Style
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase text-neutral-600">
                          {activeFontObj.name}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                            openLetterSections.font ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {openLetterSections.font && (
                      <div className="p-3 border-t border-[#E6E6E2] bg-white animate-fadeIn">
                        <div className="grid grid-cols-2 gap-2">
                          {VARSITY_FONTS.map((font) => {
                            const isSelected = customLetters.fontId === font.id;
                            return (
                              <button
                                key={font.id}
                                onClick={() =>
                                  setCustomLetters((prev) => ({ ...prev, fontId: font.id }))
                                }
                                className={`p-2.5 rounded-[2px] border text-left transition-all ${
                                  isSelected
                                    ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                                    : "bg-white text-neutral-800 border-[#E6E6E2] hover:border-black/40"
                                }`}
                              >
                                <div className="flex items-baseline justify-between mb-1">
                                  <span
                                    className="text-xl font-bold tracking-wider"
                                    style={{ fontFamily: font.family }}
                                  >
                                    {customLetters.text.trim() || font.preview}
                                  </span>
                                  <span className="text-[9px] uppercase font-mono text-neutral-400">
                                    {font.category}
                                  </span>
                                </div>
                                <span
                                  className={`text-[10px] block truncate font-medium ${
                                    isSelected ? "text-neutral-300" : "text-neutral-500"
                                  }`}
                                >
                                  {font.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ============================================================== */}
                  {/* COLLAPSIBLE SECTION 2: LETTER COLOUR (CURATED SHADES) */}
                  {/* ============================================================== */}
                  <div className="border border-[#E6E6E2] rounded-[2px] bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleLetterSection("color")}
                      className="w-full flex items-center justify-between p-3 bg-[#FAFAF8] hover:bg-neutral-100 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-[#D10115]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                          Letter Colour
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: customLetters.color }}
                        />
                        <span className="text-[10px] font-mono font-bold text-black uppercase">
                          {customLetters.color}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                            openLetterSections.color ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {openLetterSections.color && (
                      <div className="p-3 border-t border-[#E6E6E2] bg-white space-y-3 animate-fadeIn">
                        {/* Shade Tone Filter Pills */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-1">
                          {[
                            { id: "all", label: "All Shades" },
                            { id: "light", label: "Light / Chalk" },
                            { id: "vibrant", label: "Vibrant / Mid" },
                            { id: "deep", label: "Deep Saturated" },
                            { id: "dark", label: "Dark Tones" },
                          ].map((tf) => (
                            <button
                              key={tf.id}
                              onClick={() => setShadeToneFilter(tf.id as any)}
                              className={`px-2 py-1 text-[10px] font-semibold uppercase rounded-[2px] border transition-colors shrink-0 ${
                                shadeToneFilter === tf.id
                                  ? "bg-black text-white border-black"
                                  : "bg-[#FAFAF8] text-neutral-600 border-[#E6E6E2] hover:bg-neutral-100"
                              }`}
                            >
                              {tf.label}
                            </button>
                          ))}
                        </div>

                        {/* Swatches Grouped by Color Family with Shades */}
                        <div className="p-2.5 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] space-y-2.5 max-h-52 overflow-y-auto">
                          {LETTER_SHADE_FAMILIES.map((family) => {
                            const filteredShades = family.shades.filter((s) =>
                              shadeToneFilter === "all" ? true : s.tone === shadeToneFilter
                            );
                            if (filteredShades.length === 0) return null;

                            return (
                              <div key={family.familyCode} className="space-y-1">
                                <span className="text-[9.5px] font-mono uppercase text-neutral-500 block">
                                  {family.familyName}
                                </span>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                                  {filteredShades.map((shade) => {
                                    const isSelected =
                                      customLetters.color.toLowerCase() === shade.hex.toLowerCase();
                                    return (
                                      <button
                                        key={shade.id}
                                        onClick={() =>
                                          setCustomLetters((prev) => ({ ...prev, color: shade.hex }))
                                        }
                                        className={`flex items-center gap-1.5 p-1 rounded-[2px] border transition-all text-left group ${
                                          isSelected
                                            ? "bg-white border-black ring-2 ring-black shadow-xs"
                                            : "bg-white border-[#E6E6E2] hover:border-black/40"
                                        }`}
                                        title={`${shade.name} (${shade.hex})`}
                                      >
                                        <span
                                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                                          style={{ backgroundColor: shade.hex }}
                                        />
                                        <span className="text-[8.5px] font-medium text-neutral-700 truncate group-hover:text-black">
                                          {shade.name}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Custom Hex Picker */}
                        <div className="flex items-center gap-2 pt-1 border-t border-[#E6E6E2]">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">
                            Custom Shade:
                          </span>
                          <input
                            type="color"
                            value={customLetters.color}
                            onChange={(e) =>
                              setCustomLetters((prev) => ({ ...prev, color: e.target.value }))
                            }
                            className="w-6 h-6 p-0 border border-[#E6E6E2] rounded-[2px] cursor-pointer"
                            title="Pick custom letter shade"
                          />
                          <input
                            type="text"
                            value={customLetters.color}
                            onChange={(e) =>
                              setCustomLetters((prev) => ({ ...prev, color: e.target.value }))
                            }
                            className="w-24 px-2 py-0.5 text-xs font-mono border border-[#E6E6E2] rounded-[2px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ============================================================== */}
                  {/* COLLAPSIBLE SECTION 3: FELT BACKING & EMBROIDERY CRAFT */}
                  {/* ============================================================== */}
                  <div className="border border-[#E6E6E2] rounded-[2px] bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleLetterSection("craft")}
                      className="w-full flex items-center justify-between p-3 bg-[#FAFAF8] hover:bg-neutral-100 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#D10115]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                          Felt Backing &amp; Embroidery
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase text-neutral-600">
                          {CRAFT_TECHNIQUES.find((c) => c.id === customLetters.craftStyle)?.name || customLetters.craftStyle}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                            openLetterSections.craft ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {openLetterSections.craft && (
                      <div className="p-3 border-t border-[#E6E6E2] bg-white space-y-3 animate-fadeIn">
                        {/* Felt Border Shade */}
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                            Felt Backing Shade:
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {FELT_BORDER_SHADES.slice(0, 6).map((fb) => (
                              <button
                                key={fb.id}
                                onClick={() =>
                                  setCustomLetters((prev) => ({ ...prev, borderColor: fb.hex }))
                                }
                                className={`p-1.5 text-[10px] font-semibold rounded-[2px] border text-center transition-colors truncate ${
                                  customLetters.borderColor === fb.hex
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-neutral-700 border-[#E6E6E2] hover:bg-neutral-50"
                                }`}
                              >
                                {fb.name.replace(" Felt", "")}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Patch Craft Technique */}
                        <div className="pt-2 border-t border-[#E6E6E2]">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
                            Embroidery Style:
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {CRAFT_TECHNIQUES.map((craft) => (
                              <button
                                key={craft.id}
                                onClick={() =>
                                  setCustomLetters((prev) => ({
                                    ...prev,
                                    craftStyle: craft.id as any,
                                  }))
                                }
                                className={`p-1.5 text-[10px] font-semibold rounded-[2px] border text-center transition-colors truncate ${
                                  customLetters.craftStyle === craft.id
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-neutral-700 border-[#E6E6E2] hover:bg-neutral-50"
                                }`}
                                title={craft.description}
                              >
                                {craft.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>



                  {/* ============================================================== */}
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: GARMENT PANELS & DYE */}
              {/* ============================================================== */}
              {controlTab === "colors" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Part Selector Tabs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Select Garment Component:
                      </label>
                      <span className="text-[10px] text-neutral-400 font-mono uppercase">
                        {parts.find((p) => p.id === activePart)?.desc}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {parts.map((part) => (
                        <button
                          key={part.id}
                          onClick={() => setActivePart(part.id)}
                          className={`py-2 px-2 text-xs font-semibold rounded-[2px] border text-center transition-all ${
                            activePart === part.id
                              ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                              : "bg-[#FAFAF8] hover:bg-neutral-100 text-neutral-700 border-[#E6E6E2]"
                          }`}
                        >
                          {part.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Swatches Palette */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Component Colorway:
                      </label>
                      <span className="text-[11px] font-mono font-medium text-black">
                        {activeStudioModel === "hoodie"
                          ? (hoodiePartColors[activePart] || "#222224")
                          : activeStudioModel === "equestrian"
                          ? (equestrianPartColors[activePart] || "#111B2C")
                          : activeStudioModel === "basketball"
                          ? (basketballPartColors[activePart] || "#CA8A04")
                          : (partColors[activePart as keyof VarsityPartsState] || "#0B0B0B")}
                      </span>
                    </div>
                    <div className="grid grid-cols-7 sm:grid-cols-8 gap-2 p-3 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px]">
                      {PRESET_SWATCHES.slice(0, 16).map((swatch) => {
                        const currentColor = (
                          activeStudioModel === "hoodie"
                            ? hoodiePartColors[activePart]
                            : activeStudioModel === "equestrian"
                            ? equestrianPartColors[activePart]
                            : activeStudioModel === "basketball"
                            ? basketballPartColors[activePart]
                            : partColors[activePart as keyof VarsityPartsState]
                        )?.toLowerCase() || "";
                        const isSelected = currentColor === swatch.hex.toLowerCase();
                        return (
                          <button
                            key={swatch.id}
                            onClick={() => handleColorSelect(swatch.hex)}
                            className={`w-7 h-7 rounded-full border transition-all relative ${
                              isSelected
                                ? "ring-2 ring-black ring-offset-2 scale-110 shadow-xs"
                                : "border-black/20 hover:scale-105"
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                            title={`${swatch.name} (${swatch.pantone})`}
                            aria-label={swatch.name}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px]">
                      <button
                        onClick={() =>
                          handleApplyToAll(
                            activeStudioModel === "hoodie"
                              ? (hoodiePartColors[activePart] || "#222224")
                              : activeStudioModel === "equestrian"
                              ? (equestrianPartColors[activePart] || "#111B2C")
                              : activeStudioModel === "basketball"
                              ? (basketballPartColors[activePart] || "#CA8A04")
                              : (partColors[activePart as keyof VarsityPartsState] || "#0B0B0B")
                          )
                        }
                        className="text-[#D10115] hover:underline font-semibold"
                      >
                        Apply this color to entire garment &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Heritage Colorway Presets */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                      Heritage Colorway Presets:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeStudioModel === "hoodie" ? (
                        // Hoodie presets with distinct shades for Body, Pocket, Cap, Sleeves
                        HOODIE_COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setHoodiePartColors(preset.colors)}
                            className="flex items-center gap-2.5 p-2 rounded-[2px] border border-[#E6E6E2] hover:border-black/60 text-left transition-all bg-white group hover:shadow-xs cursor-pointer"
                          >
                            {/* 4-Part Segmented Swatch: Body • Pocket • Cap (Hood) • Sleeves */}
                            <div className="flex gap-0.5 shrink-0" title="Body • Pocket • Cap • Sleeves">
                              <span
                                className="w-2.5 h-6 rounded-l-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.body }}
                                title={`Body: ${preset.colors.body}`}
                              />
                              <span
                                className="w-2.5 h-6 border-y border-black/15"
                                style={{ backgroundColor: preset.colors.pocket }}
                                title={`Pocket: ${preset.colors.pocket}`}
                              />
                              <span
                                className="w-2.5 h-6 border-y border-black/15"
                                style={{ backgroundColor: preset.colors.hood }}
                                title={`Cap / Hood: ${preset.colors.hood}`}
                              />
                              <span
                                className="w-2.5 h-6 rounded-r-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.sleeves }}
                                title={`Sleeves: ${preset.colors.sleeves}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-bold text-black block truncate group-hover:text-[#D10115] transition-colors">
                                {preset.name}
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wide block truncate">
                                {preset.tag}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : activeStudioModel === "equestrian" ? (
                        // Equestrian presets with distinct shades for Body, Sleeves, Ribs, Leggings
                        EQUESTRIAN_COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setEquestrianPartColors(preset.colors)}
                            className="flex items-center gap-2.5 p-2 rounded-[2px] border border-[#E6E6E2] hover:border-black/60 text-left transition-all bg-white group hover:shadow-xs cursor-pointer"
                          >
                            {/* 4-Part Segmented Swatch: Body • Sleeves • Ribs • Leggings */}
                            <div className="flex gap-0.5 shrink-0" title="Body • Sleeves • Ribs • Leggings">
                              <span
                                className="w-2.5 h-6 rounded-l-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.body }}
                                title={`Body: ${preset.colors.body}`}
                              />
                              <span
                                className="w-2.5 h-6 border-y border-black/15"
                                style={{ backgroundColor: preset.colors.sleeves }}
                                title={`Sleeves: ${preset.colors.sleeves}`}
                              />
                              <span
                                className="w-2.5 h-6 border-y border-black/15"
                                style={{ backgroundColor: preset.colors.ribs }}
                                title={`Ribs: ${preset.colors.ribs}`}
                              />
                              <span
                                className="w-2.5 h-6 rounded-r-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.leggings }}
                                title={`Leggings: ${preset.colors.leggings}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-bold text-black block truncate group-hover:text-[#D10115] transition-colors">
                                {preset.name}
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wide block truncate">
                                {preset.tag}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : activeStudioModel === "basketball" ? (
                        // Basketball presets with distinct shades for Jersey, Ribs, Shorts
                        BASKETBALL_COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setBasketballPartColors(preset.colors)}
                            className="flex items-center gap-2.5 p-2 rounded-[2px] border border-[#E6E6E2] hover:border-black/60 text-left transition-all bg-white group hover:shadow-xs cursor-pointer"
                          >
                            {/* 3-Part Segmented Swatch: Jersey • Ribs • Shorts */}
                            <div className="flex gap-0.5 shrink-0" title="Jersey • Ribs • Shorts">
                              <span
                                className="w-3.5 h-6 rounded-l-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.jersey }}
                                title={`Jersey: ${preset.colors.jersey}`}
                              />
                              <span
                                className="w-3.5 h-6 border-y border-black/15"
                                style={{ backgroundColor: preset.colors.ribs }}
                                title={`Ribs: ${preset.colors.ribs}`}
                              />
                              <span
                                className="w-3.5 h-6 rounded-r-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.shorts }}
                                title={`Shorts: ${preset.colors.shorts}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-bold text-black block truncate group-hover:text-[#D10115] transition-colors">
                                {preset.name}
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wide block truncate">
                                {preset.tag}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        // Varsity presets with distinct shades for Body, Sleeves, Ribs, Pocket
                        COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => handleApplyPreset(preset.colors)}
                            className="flex items-center gap-2.5 p-2 rounded-[2px] border border-[#E6E6E2] hover:border-black/60 text-left transition-all bg-white group hover:shadow-xs cursor-pointer"
                          >
                            {/* 4-Part Segmented Swatch: Body • Sleeves • Ribs • Pocket */}
                            <div className="flex gap-0.5 shrink-0" title="Body • Sleeves • Ribs • Pocket">
                              <span
                                className="w-2.5 h-6 rounded-l-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.body }}
                                title={`Body: ${preset.colors.body}`}
                              />
                              <span
                                className="w-2.5 h-6 border-y border-black/15"
                                style={{ backgroundColor: preset.colors.sleeves }}
                                title={`Sleeves: ${preset.colors.sleeves}`}
                              />
                              <span
                                className="w-2.5 h-6 border-y border-black/15"
                                style={{ backgroundColor: preset.colors.collar }}
                                title={`Ribs: ${preset.colors.collar}`}
                              />
                              <span
                                className="w-2.5 h-6 rounded-r-[2px] border border-black/15"
                                style={{ backgroundColor: preset.colors.pockets }}
                                title={`Pocket: ${preset.colors.pockets}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-bold text-black block truncate group-hover:text-[#D10115] transition-colors">
                                {preset.name}
                              </span>
                              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wide block truncate">
                                {preset.tag}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Drawer Bottom Close Button */}
              <div className="lg:hidden pt-3 border-t border-[#E6E6E2]">
                <button
                  onClick={() => setIsMobileOptionsOpen(false)}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-mono font-bold rounded-[2px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Done / Hide Options</span>
                </button>
              </div>
            </div>

            {/* Launch Full Studio CTA (Docked at bottom of right column) */}
            <div className="p-4 sm:p-5 border-t border-[#E6E6E2] bg-white shrink-0 space-y-2">
              {/* Instant Factory Tech Pack Button */}
              <button
                type="button"
                onClick={() => setIsTechPackOpen(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-black border-2 border-black font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-[#D10115] group-hover:scale-110 transition-transform" />
                <span>Generate Factory Tech Pack</span>
              </button>

              <Link
                href={
                  activeStudioModel === "hoodie"
                    ? "/customize/custom-hoodie"
                    : activeStudioModel === "equestrian"
                    ? "/customize/custom-riding-jacket"
                    : activeStudioModel === "basketball"
                    ? "/customize/custom-basketball-jersey"
                    : "/customize/custom-varsity-jacket"
                }
                className="w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Full Customizer</span>
                <Sliders className="w-4 h-4 text-[#D10115]" />
              </Link>
              <p className="text-[10px] text-neutral-400 text-center">
                Supports artwork drag &amp; drop, text tools, safe print guidelines, and instant tech pack generation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Pack Specification Modal */}
      {isTechPackOpen && (
        <TechPackModal
          product={
            activeStudioModel === "varsity"
              ? (PRODUCTS_DATA.find((p) => p.slug.includes("varsity") || p.subcategory === "varsity-jackets") || PRODUCTS_DATA[0])
              : activeStudioModel === "basketball"
              ? (PRODUCTS_DATA.find((p) => p.slug.includes("basketball") || p.subcategory.includes("basketball")) || PRODUCTS_DATA[0])
              : activeStudioModel === "equestrian"
              ? (PRODUCTS_DATA.find((p) => p.slug.includes("riding") || p.subcategory.includes("riding") || p.subcategory.includes("equestrian")) || PRODUCTS_DATA[0])
              : (PRODUCTS_DATA.find((p) => p.slug.includes("hoodie")) || PRODUCTS_DATA[0])
          }
          state={{
            productId:
              activeStudioModel === "varsity"
                ? "varsity-bomber-jacket"
                : activeStudioModel === "basketball"
                ? "custom-basketball-jersey"
                : activeStudioModel === "equestrian"
                ? "custom-riding-jacket"
                : "heavyweight-hoodie",
            view: activeView,
            activeGarmentPart: activePart,
            partColors:
              activeStudioModel === "varsity"
                ? partColors
                : activeStudioModel === "basketball"
                ? basketballPartColors
                : activeStudioModel === "equestrian"
                ? equestrianPartColors
                : hoodiePartColors,
            fabricId:
              activeStudioModel === "varsity"
                ? "500-gsm-melton"
                : activeStudioModel === "basketball"
                ? "200-gsm-diamond-mesh"
                : activeStudioModel === "equestrian"
                ? "320-gsm-italian-softshell"
                : "450-gsm-loopback",
            gsm:
              activeStudioModel === "varsity"
                ? 500
                : activeStudioModel === "basketball"
                ? 200
                : activeStudioModel === "equestrian"
                ? 320
                : 450,
            washId: activeWash,
            decorationMethodId:
              customLetters.text && customLetters.text.trim()
                ? "chenille-embroidery"
                : customLogo.enabled && customLogo.url
                ? "screen-printing"
                : "direct-to-garment",
            trims: {
              buttonFinish: selectedButtonFinish,
              lining: selectedLining,
              sleeveStyle,
              pocketStyle,
            },
            construction: {
              silhouette:
                activeStudioModel === "varsity"
                  ? "Boxy Vintage Drop-Shoulder"
                  : activeStudioModel === "equestrian"
                  ? "Sartorial Show-Ring Tailored Arc"
                  : "Oversized Drop-Shoulder",
              lining: selectedLining,
            },
            artworkLayers:
              customLogo.enabled && customLogo.url
                ? [
                    {
                      id: "art_logo",
                      name: customLogo.name || "Brand Logo",
                      url: customLogo.url,
                      x: Math.round(((customLogo.x ?? 32) / 100) * 420),
                      y: Math.round(((customLogo.y ?? 34) / 100) * 420),
                      width: 120,
                      height: 120,
                      scale: customLogo.scale,
                      rotation: customLogo.rotation,
                      opacity: 1,
                      zIndex: 1,
                      view: customLogo.view || "front",
                      isLocked: false,
                      isVisible: true,
                    },
                  ]
                : [],
            textLayers:
              customLetters.text && customLetters.text.trim()
                ? [
                    {
                      id: "txt_monogram",
                      name: "Monogram",
                      text: customLetters.text.trim().toUpperCase(),
                      font: customLetters.fontId,
                      fontSize: 48,
                      fontWeight: "bold",
                      color: customLetters.color,
                      outlineColor: customLetters.borderColor || "#FFFFFF",
                      letterSpacing: 2,
                      lineHeight: 1,
                      rotation: 0,
                      x: Math.round(((customLetters.x ?? 30) / 100) * 420),
                      y: Math.round(((customLetters.y ?? 30) / 100) * 420),
                      zIndex: 2,
                      view: customLetters.view || "front",
                      alignment: "center",
                      isLocked: false,
                      isVisible: true,
                    },
                  ]
                : [],
            quantity: 50,
            sizeBreakdown: { S: 10, M: 20, L: 15, XL: 5 },
          }}
          onClose={() => setIsTechPackOpen(false)}
        />
      )}
    </section>
  );
};
