"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { CustomizerState, Product } from "@/types";
import { VarsityJacketGrayscaleViewer } from "./VarsityJacketGrayscaleViewer";
import { GarmentSvg } from "./GarmentSvg";
import { X, Printer, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { VARSITY_FONTS } from "@/config/varsityCustomizer.config";
import { customizerService } from "@/services/customizer.service";

interface TechPackModalProps {
  product: Product;
  state: CustomizerState;
  onClose: () => void;
}

const COLOR_NAMES_MAP: Record<string, string> = {
  // Ivy League & Forest Palette
  "#1B3B2B": "Ivy Pine Green",
  "#EAE3D2": "Vintage Oat Leather",
  "#12241A": "Deep Forest Rib",
  "#D97706": "Varsity Amber Gold",
  "#14241B": "Deep Pine Rib",
  "#2E4738": "Sage Olive Fleece",
  "#1E3326": "Deep Ivy Pine",
  "#15803D": "Hunter Varsity Green",
  "#4E533B": "Military Olive Drab",
  "#86EFAC": "Chalk Mint Sage",

  // Harvard Crimson & Burgundy Palette
  "#8B0000": "Harvard Crimson Wool",
  "#800020": "Harvard Crimson",
  "#5A121A": "Wine Burgundy Wool",
  "#380C11": "Dark Wine Rib",
  "#DC2626": "Harvard Racing Red",
  "#991B1B": "Vintage Burgundy",
  "#D10115": "Atelier Crimson",
  "#7F1D1D": "Heritage Tartan Crimson",
  "#4A1521": "Oxblood Merlot",
  "#FCA5A5": "Blush Coral",

  // Stealth Noir & Charcoal Palette
  "#0B0B0B": "Stealth Jet Black",
  "#141414": "Stealth Noir Wool",
  "#18181B": "Matte Noir Leather",
  "#1C1C1E": "Noir Charcoal",
  "#1E1E1E": "Matte Noir Snap",
  "#2B2B2D": "Charcoal Slate Cowhide",
  "#2C2C2E": "Charcoal Ribbed Knit",
  "#374151": "Charcoal Graphite",
  "#3A3A3C": "Slate Fleece",
  "#333333": "Charcoal Grey",
  "#222224": "Washed Graphite",
  "#111111": "Onyx Jet Black",
  "#171717": "Noir Satin",

  // Bone, Ecru & Whites
  "#FFFFFF": "Optic Snow White",
  "#FAFAFA": "Pure White",
  "#F5EBE1": "Vintage Cream Leather",
  "#F4E8C1": "Raw Ecru / Bone",
  "#F3EFE6": "Raw Ecru Leather",
  "#F4F3ED": "Raw Chalk Ecru",
  "#EDE6D6": "Bone Ecru Leather",
  "#E2E0D6": "Ecru Sand",
  "#E5E5E5": "Heather Silver",
  "#E4E4E7": "Brushed Silver",
  "#D4D4CE": "Brushed Nickel",
  "#9CA3AF": "Athletic Heather Grey",
  "#7E7E7E": "Heather Grey Felt",

  // Collegiate Blue & Navy
  "#111B2C": "Archive Midnight Navy",
  "#1E3A8A": "Deep Collegiate Indigo",
  "#1C4ED8": "Cobalt Royal Blue",
  "#7DA6C6": "Dusty Sky Blue",

  // Athletic Gold & Earth Leather
  "#FBBF24": "Athletic Varsity Gold",
  "#CA8A04": "Vintage Mustard",
  "#D4AF37": "Athletic Gold",
  "#FEF08A": "Chalk Butter",
  "#C27803": "Ochre Athletic Gold",
  "#EAB308": "Varsity 18K Gold",
  "#B45309": "Antique Burnished Brass",
  "#854D0E": "Burnished Bronze",
  "#A67B4F": "Warm Saddle Camel",
  "#C7B89F": "Dune Sand",
  "#C2410C": "Terracotta Rust",
  "#3D2E24": "Espresso Dark Roast",
  "#1E1B18": "Dark Espresso Leather",
  "#EA580C": "Safety Neon Orange",
  "#E8C5BE": "Dusty Rose Blush",
  "#A799B7": "Archive Lavender",
  "#84CC16": "Acid Cyber Lime",
};

const resolveColorName = (hex?: string): string => {
  if (!hex) return "Studio Custom";
  const upper = hex.toUpperCase().trim();
  return COLOR_NAMES_MAP[upper] || "Studio Custom";
};

const CANVAS_REF = 420;

// Basketball & Equestrian High-Resolution Tech Pack Asset Layers
const ASSET_BB_FRONT_JERSEY = "/basketball/front (3) (1).png";
const ASSET_BB_BACK_JERSEY = "/basketball/back (3) (1).png";
const ASSET_BB_FRONT_RIBS = "/basketball/front ribs (1).png";
const ASSET_BB_BACK_RIBS = "/basketball/ribs (4) (1).png";
const ASSET_BB_FRONT_SHORTS = "/basketball/front shorts (1).png";
const ASSET_BB_BACK_SHORTS = "/basketball/shorts back (1).png";

const ASSET_EQ_FRONT_BODY = "/equastarian/front (2) (1).png";
const ASSET_EQ_BACK_BODY = "/equastarian/back (2) (1).png";
const ASSET_EQ_FRONT_SLEEVES = "/equastarian/front sleeves (1).png";
const ASSET_EQ_BACK_SLEEVES = "/equastarian/sleeves (2) (1).png";
const ASSET_EQ_FRONT_RIBS = "/equastarian/fronts ribs (1).png";
const ASSET_EQ_BACK_RIBS = "/equastarian/ribs (3) (1).png";
const ASSET_EQ_FRONT_LEGGINGS = "/equastarian/front legngs] (1).png";
const ASSET_EQ_BACK_LEGGINGS = "/equastarian/leggings back (1).png";

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

export const TechPackModal: React.FC<TechPackModalProps> = ({ product, state, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelZoom, setModelZoom] = useState(100);
  const [elevationViewMode, setElevationViewMode] = useState<"dual" | "front" | "back">("dual");
  const [modelBgColor, setModelBgColor] = useState<string>("#141414");
  const hasSyncedRef = useRef(false);

  // Determine Accurate Garment Category & Silhouette
  const isVarsity = Boolean(
    state.productId?.includes("varsity") ||
    product.slug?.includes("varsity") ||
    product.subcategory === "varsity-jackets"
  );

  const isBasketball = Boolean(
    state.productId?.includes("basketball") ||
    state.productId?.includes("court") ||
    product.slug?.includes("basketball") ||
    product.category?.toLowerCase().includes("basketball") ||
    product.subcategory?.toLowerCase().includes("basketball")
  );

  const isEquestrian = Boolean(
    state.productId?.includes("equestrian") ||
    state.productId?.includes("riding") ||
    product.slug?.includes("equestrian") ||
    product.slug?.includes("riding") ||
    product.category?.toLowerCase().includes("equestrian") ||
    product.subcategory?.toLowerCase().includes("riding")
  );

  const isHoodie =
    !isVarsity &&
    !isBasketball &&
    !isEquestrian &&
    Boolean(
      state.productId?.includes("hoodie") ||
      product.slug?.includes("hoodie") ||
      product.subcategory?.toLowerCase().includes("hoodie") ||
      product.subcategory?.toLowerCase().includes("sweatshirt") ||
      product.category?.toLowerCase().includes("hoodie")
    );

  const frontPreviewAsset = isBasketball
    ? "/basketball/front (3) (1).png"
    : isVarsity
    ? "/varsity_jacket/front/body.png"
    : isEquestrian
    ? "/equastarian/front (2) (1).png"
    : "/hoodie/hoodie_front.png";

  const backPreviewAsset = isBasketball
    ? "/basketball/back (3) (1).png"
    : isVarsity
    ? "/varsity_jacket/back/body.png"
    : isEquestrian
    ? "/equastarian/back (2) (1).png"
    : "/hoodie/back_body.png";

  useEffect(() => {
    setMounted(true);

    // Prevent duplicate synchronization calls in React Strict Mode
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    // Synchronize Factory Tech Pack with Laravel Backend API
    customizerService
      .generateAndSaveTechPack({
        productId: Number(product.id) || 1,
        styleName: `${product.name} Factory Spec Sheet`,
        partsColors: state.partColors || {},
        artworkLayers: state.artworkLayers || [],
        monogramState: state.textLayers || [],
        fabricSpec: `${state.gsm || 450} GSM ${product.fabric || "Combed Cotton Fleece"} (${state.washId || "Clean Raw Mill"})`,
        targetGsm: state.gsm || 450,
        sizeBreakdown: state.sizeBreakdown,
        decorationMethod: state.decorationMethodId || "3D Puff Embroidery / Screen Print",
        washType: state.washId || "Clean Raw Mill Finish",
        trimsConfig: state.trims,
        stitchingNotes: "Double-needle flatlock topstitching. 100% pre-shrunk wash test under AQL 2.5 protocol.",
        previewFront: frontPreviewAsset,
        previewBack: backPreviewAsset,
      })
      .catch((err) => console.warn("TechPackModal auto-sync error:", err));
  }, []);

  const handlePrint = useCallback(() => {
    setIsPreparingPrint(true);
    // Allow React to re-render the button into loading state and prepare print portal
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPreparingPrint(false);
      }, 1000);
    }, 120);
  }, []);

  const isTee =
    !isVarsity &&
    !isBasketball &&
    !isEquestrian &&
    !isHoodie &&
    Boolean(
      state.productId?.includes("tee") ||
      state.productId?.includes("t-shirt") ||
      product.slug?.includes("tee") ||
      product.slug?.includes("t-shirt") ||
      product.subcategory?.toLowerCase().includes("t-shirt") ||
      product.subcategory?.toLowerCase().includes("t-shirts") ||
      product.subcategory?.toLowerCase().includes("polo")
    );

  const isPants =
    !isVarsity &&
    !isBasketball &&
    !isEquestrian &&
    !isHoodie &&
    !isTee &&
    Boolean(
      state.productId?.includes("pant") ||
      state.productId?.includes("trouser") ||
      state.productId?.includes("jogger") ||
      product.slug?.includes("pant") ||
      product.slug?.includes("trouser") ||
      product.slug?.includes("jogger") ||
      product.subcategory?.toLowerCase().includes("pant") ||
      product.subcategory?.toLowerCase().includes("jogger")
    );

  const isGeneralJacket =
    !isVarsity &&
    !isBasketball &&
    !isEquestrian &&
    !isHoodie &&
    !isTee &&
    !isPants &&
    Boolean(
      product.slug?.includes("jacket") ||
      product.subcategory?.toLowerCase().includes("jacket") ||
      product.category?.toLowerCase().includes("jacket")
    );

  const isJacket = isVarsity;

  const garmentSvgType = isVarsity
    ? "varsity"
    : isHoodie
    ? "hoodie"
    : isTee
    ? "tshirt"
    : isPants
    ? "trousers"
    : isGeneralJacket
    ? "jacket"
    : product.slug.includes("dress")
    ? "dress"
    : product.slug.includes("blazer")
    ? "blazer"
    : product.slug.includes("short")
    ? "shorts"
    : product.slug.includes("cap")
    ? "cap"
    : product.slug.includes("tote")
    ? "tote"
    : "hoodie";

  // Determine Lettering details
  const firstTextLayer = state.textLayers && state.textLayers.length > 0 ? state.textLayers[0] : null;
  const letterText = firstTextLayer?.text?.trim() || "";
  const matchedFont = VARSITY_FONTS.find(
    (f) => f.id === firstTextLayer?.font || f.family === firstTextLayer?.font || f.name === firstTextLayer?.font
  );
  const letterFontName = matchedFont?.name || firstTextLayer?.font || "Varsity Heavy";
  const resolvedLetterFontFamily = matchedFont?.family || firstTextLayer?.font || "'Alfa Slab One', 'Arial Black', sans-serif";
  const letterCraft = state.decorationMethodId?.includes("chenille")
    ? "CHENILLE"
    : state.decorationMethodId?.toUpperCase() || (isVarsity ? "CHENILLE" : isBasketball ? "FULL-BLEED SUBLIMATION / TWILL" : isEquestrian ? "3D METALLIC EMBROIDERY" : "SCREEN PRINT");
  const letterColor = firstTextLayer?.color || (isBasketball ? "#FFFFFF" : isEquestrian ? "#FBBF24" : "#FBBF24");
  const letterBaseFelt = firstTextLayer?.outlineColor || (isBasketball ? (state.partColors.ribs || "#111B2C") : state.partColors.body === "#FFFFFF" ? "#0B0B0B" : "#FFFFFF");
  const letterCount = Math.max(1, letterText.length);
  const letterFontSize = letterCount === 1 ? 58 : letterCount === 2 ? 46 : 35;
  const strokeWidthFelt = letterCount === 1 ? 14 : letterCount === 2 ? 11 : 9;

  // Filter Artwork layers by view for accurate front/back tech pack specs
  const frontArtworks = (state.artworkLayers || []).filter((a) => a.isVisible && a.view !== "back");
  const backArtworks = (state.artworkLayers || []).filter((a) => a.isVisible && a.view === "back");

  // Dynamic Bill of Materials (BOM) strictly matching the relevant product
  const bomItems = isVarsity
    ? [
        {
          zone: "BODY (MELTON WOOL)",
          fabric: product.materials?.[0] || "500 GSM Heavy Melton Wool",
          hex: (state.partColors.body || "#0B0B0B").toUpperCase(),
          name: resolveColorName(state.partColors.body || "#0B0B0B"),
        },
        {
          zone: "SLEEVES (LEATHER)",
          fabric: product.materials?.[1] || "Top-Grain Supple Cowhide Leather",
          hex: (state.partColors.sleeves || "#F3EFE6").toUpperCase(),
          name: resolveColorName(state.partColors.sleeves || "#F3EFE6"),
        },
        {
          zone: "STRIPED RIBS (COLLAR & CUFFS)",
          fabric: "2x2 Heavy Poly-Cotton Ribbed Knit",
          hex: (state.partColors.collar || state.partColors.cuffs || state.partColors.body || "#0B0B0B").toUpperCase(),
          name: resolveColorName(state.partColors.collar || state.partColors.cuffs || state.partColors.body || "#0B0B0B"),
        },
        {
          zone: "POCKET WELTS",
          fabric: "Matching Leather Welt Trim",
          hex: (state.partColors.pockets || state.partColors.sleeves || "#F3EFE6").toUpperCase(),
          name: resolveColorName(state.partColors.pockets || state.partColors.sleeves || "#F3EFE6"),
        },
        {
          zone: "SNAP BUTTONS",
          fabric: "Powder-Coated Enamel Snaps",
          hex: (state.partColors.buttons || "#E4E4E7").toUpperCase(),
          name: resolveColorName(state.partColors.buttons || "#E4E4E7"),
        },
      ]
    : isBasketball
    ? [
        {
          zone: "PRO JERSEY (DIAMOND MESH)",
          fabric: `${state.gsm || 200} GSM 100% Diamond Mesh Polyester`,
          hex: (state.partColors.jersey || state.partColors.body || "#CA8A04").toUpperCase(),
          name: resolveColorName(state.partColors.jersey || state.partColors.body || "#CA8A04"),
        },
        {
          zone: "NECK & ARMHOLE RIBS",
          fabric: "1x1 & 2x2 Yarn-Dyed Heavy Elastic Rib Knits",
          hex: (state.partColors.ribs || state.partColors.collar || "#111B2C").toUpperCase(),
          name: resolveColorName(state.partColors.ribs || state.partColors.collar || "#111B2C"),
        },
        {
          zone: "PRO GAME SHORTS",
          fabric: "220 GSM Heavy-Duty Poly Interlock with Air-Mesh",
          hex: (state.partColors.shorts || state.partColors.pants || state.partColors.jersey || "#CA8A04").toUpperCase(),
          name: resolveColorName(state.partColors.shorts || state.partColors.pants || state.partColors.jersey || "#CA8A04"),
        },
        {
          zone: "SUBLIMATION INKS",
          fabric: "Zero-Fading Italian Eco Sublimation Inks",
          hex: "#D61C24",
          name: "Italian Atelier Inks",
        },
        {
          zone: "SEAM BAR-TACKING",
          fabric: "Twin-Needle Reinforced High-Stress Seams",
          hex: (state.partColors.ribs || "#111B2C").toUpperCase(),
          name: resolveColorName(state.partColors.ribs || "#111B2C"),
        },
      ]
    : isEquestrian
    ? [
        {
          zone: "TORSO & MAIN SHELL",
          fabric: `${state.gsm || 320} GSM 4-Way Stretch Italian Softshell`,
          hex: (state.partColors.body || "#111B2C").toUpperCase(),
          name: resolveColorName(state.partColors.body || "#111B2C"),
        },
        {
          zone: "ARTICULATED SLEEVES",
          fabric: "320 GSM Bi-Stretch Articulated Sleeve Shell",
          hex: (state.partColors.sleeves || "#0A0A0A").toUpperCase(),
          name: resolveColorName(state.partColors.sleeves || "#0A0A0A"),
        },
        {
          zone: "COLLAR & PLACKET RIBS",
          fabric: "Micro-Suede Contrast Collar & Zip Placket",
          hex: (state.partColors.ribs || state.partColors.collar || "#D61C24").toUpperCase(),
          name: resolveColorName(state.partColors.ribs || state.partColors.collar || "#D61C24"),
        },
        {
          zone: "SILICONE GRIP BREECHES",
          fabric: "82% Nylon / 18% Spandex Hex-Grip Compression",
          hex: (state.partColors.leggings || state.partColors.pants || "#20201E").toUpperCase(),
          name: resolveColorName(state.partColors.leggings || state.partColors.pants || "#20201E"),
        },
        {
          zone: "CREST HARDWARE",
          fabric: "Antique Silver Engraved Crest Buttons",
          hex: (state.partColors.buttons || "#E4E4E7").toUpperCase(),
          name: resolveColorName(state.partColors.buttons || "#E4E4E7"),
        },
      ]
    : isHoodie
    ? [
        {
          zone: "BODY (FRENCH TERRY)",
          fabric: `${state.gsm || product.GSM || 450} GSM Heavy Combed Cotton Fleece`,
          hex: (state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.body || "#222224"),
        },
        {
          zone: "TUNNEL HOOD",
          fabric: "Double-Layer Self-Fabric Ergonomic Hood",
          hex: (state.partColors.hood || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.hood || state.partColors.body || "#222224"),
        },
        {
          zone: "KANGAROO POCKET",
          fabric: "Reinforced Bartack French Terry Pouch",
          hex: (state.partColors.pocket || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.pocket || state.partColors.body || "#222224"),
        },
        {
          zone: "SLEEVES & ARMS",
          fabric: "Drop-Shoulder Cut & Sew Fleece",
          hex: (state.partColors.sleeves || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.sleeves || state.partColors.body || "#222224"),
        },
        {
          zone: "RIBBED CUFFS",
          fabric: "2x2 Heavy Spandex-Cotton Ribbed Knit",
          hex: (state.partColors.cuffs || state.partColors.waistband || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.cuffs || state.partColors.waistband || state.partColors.body || "#222224"),
        },
        {
          zone: "RIBBED WAISTBAND",
          fabric: "2x2 Heavy Spandex-Cotton Ribbed Knit",
          hex: (state.partColors.waistband || state.partColors.cuffs || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.waistband || state.partColors.cuffs || state.partColors.body || "#222224"),
        },
      ]
    : isTee
    ? [
        {
          zone: "MAIN BODY (TORSO)",
          fabric: `${state.gsm || product.GSM || 280} GSM 16-Singles Combed Cotton Jersey`,
          hex: (state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.body || "#222224"),
        },
        {
          zone: "COLLAR / NECKBAND",
          fabric: "1.25\" Bound 1x1 Heavy Lycra Rib Binding (Anti-Sag)",
          hex: (state.partColors.collar || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.collar || state.partColors.body || "#222224"),
        },
        {
          zone: "SLEEVES (LEFT & RIGHT)",
          fabric: "Wide Boxy Drop-Shoulder Sleeves",
          hex: (state.partColors.sleeves || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.sleeves || state.partColors.body || "#222224"),
        },
        {
          zone: "HEM & STITCHING",
          fabric: "Twin-Needle Chainstitch Cover Hem",
          hex: (state.partColors.waistband || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.waistband || state.partColors.body || "#222224"),
        },
        {
          zone: "STUDIO LABELS",
          fabric: "Woven High-Definition Damask Label",
          hex: "#FFFFFF",
          name: "Optic White",
        },
      ]
    : isPants
    ? [
        {
          zone: "PRIMARY LEGS / BODY",
          fabric: product.materials?.[0] || `${product.GSM || 420} GSM Heavy Loopback Cotton`,
          hex: (state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.body || "#222224"),
        },
        {
          zone: "ELASTICATED WAISTBAND",
          fabric: "2\" Multi-Needle Encased Elastic Tunnel",
          hex: (state.partColors.waistband || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.waistband || state.partColors.body || "#222224"),
        },
        {
          zone: "DRAWCORDS & HARDWARE",
          fabric: "Heavy Braided Flat Cord with Metal Aglets",
          hex: (state.partColors.buttons || "#FFFFFF").toUpperCase(),
          name: resolveColorName(state.partColors.buttons || "#FFFFFF"),
        },
        {
          zone: "SIDE POCKETS",
          fabric: "Bartack-Reinforced Deep Inseam Pocket Facing",
          hex: (state.partColors.pockets || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.pockets || state.partColors.body || "#222224"),
        },
        {
          zone: "ANKLE CUFFS / HEM",
          fabric: "2x2 Heavy Cotton Rib or Adjustable Bungee Hem",
          hex: (state.partColors.cuffs || state.partColors.waistband || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.cuffs || state.partColors.waistband || state.partColors.body || "#222224"),
        },
      ]
    : isGeneralJacket
    ? [
        {
          zone: "OUTER SHELL",
          fabric: product.materials?.[0] || "Water-Resistant DWR Ripstop Nylon",
          hex: (state.partColors.body || product.colors?.[0]?.hex || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.body || product.colors?.[0]?.hex || "#222224"),
        },
        {
          zone: "LINING & INSULATION",
          fabric: product.materials?.[1] || "Thermal Diamond-Quilted Bemberg",
          hex: (state.partColors.sleeves || "#111111").toUpperCase(),
          name: resolveColorName(state.partColors.sleeves || "#111111"),
        },
        {
          zone: "HARDWARE & FASTENERS",
          fabric: "Heavy Duty Two-Way Metal YKK Zipper",
          hex: (state.partColors.buttons || "#D4D4CE").toUpperCase(),
          name: resolveColorName(state.partColors.buttons || "#D4D4CE"),
        },
        {
          zone: "POCKET WELTS & FLAPS",
          fabric: "Reinforced Storm Pockets with Fleece Lining",
          hex: (state.partColors.pockets || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.pockets || state.partColors.body || "#222224"),
        },
        {
          zone: "STORM CUFFS & HEM",
          fabric: "Internal Ribbed Storm Cuffs with Elastic Drawcord",
          hex: (state.partColors.cuffs || state.partColors.collar || "#111111").toUpperCase(),
          name: resolveColorName(state.partColors.cuffs || state.partColors.collar || "#111111"),
        },
      ]
    : [
        {
          zone: "PRIMARY BODY",
          fabric: product.materials?.[0] || "Custom Atelier Fabric",
          hex: (state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.body || "#222224"),
        },
        {
          zone: "SECONDARY PANELS",
          fabric: product.materials?.[1] || "Contrast Trim Fabric",
          hex: (state.partColors.sleeves || state.partColors.hood || state.partColors.body || "#222224").toUpperCase(),
          name: resolveColorName(state.partColors.sleeves || state.partColors.hood || state.partColors.body || "#222224"),
        },
        {
          zone: "TRIMS & FINISHES",
          fabric: "Reinforced Structural Rib / Binding",
          hex: (state.partColors.cuffs || state.partColors.collar || "#333333").toUpperCase(),
          name: resolveColorName(state.partColors.cuffs || state.partColors.collar || "#333333"),
        },
        {
          zone: "HARDWARE / ATTACHMENTS",
          fabric: "Studio Grade Fasteners",
          hex: (state.partColors.buttons || "#E4E4E7").toUpperCase(),
          name: resolveColorName(state.partColors.buttons || "#E4E4E7"),
        },
      ];

  const totalUnits = state.sizeBreakdown
    ? Object.values(state.sizeBreakdown).reduce((sum, q) => sum + Number(q || 0), 0)
    : (Number(state.quantity) || 0);

  const hasVolumeEntered = totalUnits > 0;

  const sizeBreakdownList = state.sizeBreakdown
    ? Object.entries(state.sizeBreakdown)
        .filter(([_, qty]) => Number(qty) > 0)
        .map(([sz, qty]) => `${sz}: ${qty}`)
    : [];

  const garmentSize = hasVolumeEntered
    ? (sizeBreakdownList.length > 1 ? sizeBreakdownList.join(" • ") : sizeBreakdownList[0] || `${totalUnits} pcs`)
    : "Pending Batch Allocation";

  const orderVolume = totalUnits;
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const basePrice = product.wholesalePrice || (product.retailPrice ? product.retailPrice * 0.45 : 35.0);
  const customUnitQuote = Number((basePrice * 1.15).toFixed(2));
  const totalOrderQuote = hasVolumeEntered ? (customUnitQuote * orderVolume).toFixed(2) : null;

  // Resolve Trims & Construction Labels
  const liningLabel =
    state.trims?.lining === "quilted-diamond" || state.trims?.lining?.includes("quilted")
      ? "Insulated Diamond-Quilted Bemberg"
      : state.trims?.lining === "satin-black"
      ? "Thermal Silk-Satin Noir Lining"
      : state.trims?.lining === "satin-burgundy"
      ? "Crimson Quilted Bemberg Lining"
      : state.trims?.lining === "flannel-cotton"
      ? "Brushed Heavy Cotton Flannel"
      : isVarsity
      ? "Insulated Diamond-Quilted Satin"
      : isHoodie
      ? "Seamless Self-Fabric Double Layer"
      : "Unlined Clean Atelier Finish";

  const buttonFinishLabel = state.partColors?.buttons
    ? `${resolveColorName(state.partColors.buttons)} Snap Fasteners`
    : state.trims?.buttonFinish === "black"
    ? "Matte Noir Powder-Coated Fasteners"
    : state.trims?.buttonFinish === "gold"
    ? "Athletic Gold Heavy Brass Snaps"
    : "Polished Chrome / Enamel Snaps";

  const sleeveStyleLabel = isVarsity
    ? `${resolveColorName(state.partColors.sleeves || "#F3EFE6")} Cowhide Leather Sleeves`
    : isHoodie
    ? "Drop-Shoulder French Terry Sleeves"
    : isTee
    ? "Wide Elbow-Length Drop-Shoulder Sleeves"
    : "Cut & Sew Precision Panels";

  const pocketStyleLabel = isVarsity
    ? `${resolveColorName(state.partColors.pockets || state.partColors.sleeves || "#F3EFE6")} Reinforced Leather Trim`
    : isHoodie
    ? "Bartack Kangaroo Pouch"
    : "Reinforced Dual Slash Pockets";

  const washLabel =
    state.washId === "vintage-wash" || state.washId === "mineral"
      ? "Vintage Mineral Acid Wash"
      : state.washId === "stone-wash" || state.washId === "stone"
      ? "Heavy Industrial Stone Wash"
      : state.washId === "sun-faded"
      ? "Sun-Faded Solar Distress Wash"
      : "Clean Raw Mill Finish (Anti-Pill & Preshrunk)";

  const silhouetteLabel =
    state.construction?.silhouette ||
    (isVarsity
      ? "Boxy Vintage Drop-Shoulder Atelier Cut"
      : isHoodie
      ? "380 GSM Heavyweight Oversized Drop-Shoulder"
      : isTee
      ? "Boxy Streetwear Drop-Shoulder Silhouette"
      : isPants
      ? "Relaxed Tapered Leg Silhouette"
      : "Relaxed Atelier Silhouette");

  const section3Title = isVarsity
    ? "VARSITY CONSTRUCTION, TRIMS & HARDWARE SPEC"
    : isHoodie
    ? "HOODIE CONSTRUCTION, TRIMS & HARDWARE SPEC"
    : isTee
    ? "T-SHIRT CONSTRUCTION, TRIMS & HARDWARE SPEC"
    : isPants
    ? "TROUSER / JOGGER CONSTRUCTION & TRIMS SPEC"
    : isGeneralJacket
    ? "OUTERWEAR JACKET CONSTRUCTION & TRIMS SPEC"
    : "GARMENT CONSTRUCTION, TRIMS & HARDWARE SPEC";

  const renderTrimsList = (isDark = true) => {
    const textColor = isDark ? "text-white" : "text-neutral-900";
    const labelColor = isDark ? "text-neutral-400" : "text-neutral-500 font-medium";
    const highlightColor = "text-[#D10115] font-bold";
    const borderClass = isDark ? "border-b border-white/5 py-0.5" : "border-b border-neutral-200 py-0.5";

    if (isBasketball) {
      return (
        <>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Jersey Fabric:</span>
            <strong className={`${textColor} text-right truncate`}>200 GSM Diamond Air-Mesh Poly</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Game Shorts:</span>
            <strong className={`${textColor} text-right truncate`}>220 GSM Interlock Mesh &bull; 8.5" Inseam</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Rib Trim Spec:</span>
            <strong className={`${textColor} text-right truncate`}>2x2 Yarn-Dyed Elastic Neck &amp; Arm Ribs</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Seam Strength:</span>
            <strong className={`${textColor} text-right truncate`}>Bar-Tacked High-Stress Gusset Seams</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Print Quality:</span>
            <strong className={`${textColor} text-right truncate`}>Zero-Fading Italian Sublimation Inks</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Garment Finish:</span>
            <strong className={`${highlightColor} text-right truncate`}>Hydrophilic Moisture-Wicking Finish</strong>
          </div>
        </>
      );
    }

    if (isEquestrian) {
      return (
        <>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Jacket Shell:</span>
            <strong className={`${textColor} text-right truncate`}>320 GSM 4-Way Stretch Italian Softshell</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Riding Breeches:</span>
            <strong className={`${textColor} text-right truncate`}>Silicone Hex-Grip Full-Seat Microfiber</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Sleeve Articulation:</span>
            <strong className={`${textColor} text-right truncate`}>Ergonomic Dynamic Rider Sleeve Arc</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Weather Barrier:</span>
            <strong className={`${textColor} text-right truncate`}>8,000mm DWR Waterproof &amp; Breathable</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Hardware / Buttons:</span>
            <strong className={`${textColor} text-right truncate`}>Antique Engraved Metal Crest Buttons</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Garment Finish:</span>
            <strong className={`${highlightColor} text-right truncate`}>Show-Ring Sartorial Tailored Finish</strong>
          </div>
        </>
      );
    }

    if (isVarsity) {
      return (
        <>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Lining Fabric:</span>
            <strong className={`${textColor} text-right truncate`}>{liningLabel}</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Hardware Finish:</span>
            <strong className={`${textColor} text-right truncate`}>{buttonFinishLabel}</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Sleeve Spec:</span>
            <strong className={`${textColor} text-right truncate`}>{sleeveStyleLabel}</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Pocket Welts:</span>
            <strong className={`${textColor} text-right truncate`}>{pocketStyleLabel}</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Garment Wash:</span>
            <strong className={`${highlightColor} text-right truncate`}>{washLabel}</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Silhouette Cut:</span>
            <strong className={`${textColor} text-right truncate`}>{silhouetteLabel}</strong>
          </div>
        </>
      );
    }

    if (isHoodie) {
      return (
        <>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Hood Build:</span>
            <strong className={`${textColor} text-right truncate`}>Seamless Double-Layer Hood</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Drawstrings &amp; Tips:</span>
            <strong className={`${textColor} text-right truncate`}>Tubular Braided Cord &bull; Metal Aglets</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Kangaroo Pocket:</span>
            <strong className={`${textColor} text-right truncate`}>Bartack Reinforced &bull; Twin Needle</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Ribbing Spec:</span>
            <strong className={`${textColor} text-right truncate`}>2x2 Heavy Spandex-Cotton Rib</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Seam Construction:</span>
            <strong className={`${textColor} text-right truncate`}>4-Needle 6-Thread Flatlock Anti-Chafe</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Garment Finish:</span>
            <strong className={`${highlightColor} text-right truncate`}>{washLabel}</strong>
          </div>
        </>
      );
    }

    if (isTee) {
      return (
        <>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Neckline Build:</span>
            <strong className={`${textColor} text-right truncate`}>1.25" Bound 1x1 Heavy Lycra Rib</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Neck Tape:</span>
            <strong className={`${textColor} text-right truncate`}>Shoulder-to-Shoulder Herringbone Tape</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Sleeve Cut:</span>
            <strong className={`${textColor} text-right truncate`}>Wide Elbow-Length Drop Shoulder</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Hem Construction:</span>
            <strong className={`${textColor} text-right truncate`}>Twin-Needle Chainstitch Cover Hem</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Shrinkage Standard:</span>
            <strong className={`${textColor} text-right truncate`}>Pre-Shrunk &bull; &lt; 1.5% Residual Rate</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Garment Finish:</span>
            <strong className={`${highlightColor} text-right truncate`}>{washLabel}</strong>
          </div>
        </>
      );
    }

    if (isPants) {
      return (
        <>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Waistband Build:</span>
            <strong className={`${textColor} text-right truncate`}>2" Encased Multi-Needle Elastic</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Drawstring &amp; Tips:</span>
            <strong className={`${textColor} text-right truncate`}>Heavy Braided Cord &bull; Metal Aglets</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Pocket Construction:</span>
            <strong className={`${textColor} text-right truncate`}>Bartack Reinforced Deep Inseam Pockets</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Inseam Stitching:</span>
            <strong className={`${textColor} text-right truncate`}>Triple-Needle Felled Crotch Gusset</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Ankle Finish:</span>
            <strong className={`${textColor} text-right truncate`}>2x2 Heavy Ribbed Ankle Cuffs</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Garment Finish:</span>
            <strong className={`${highlightColor} text-right truncate`}>{washLabel}</strong>
          </div>
        </>
      );
    }

    if (isGeneralJacket) {
      return (
        <>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Outer Shell:</span>
            <strong className={`${textColor} text-right truncate`}>DWR Water-Repellent Shell</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Main Fastener:</span>
            <strong className={`${textColor} text-right truncate`}>YKK #8 Heavy Two-Way Metal Zipper</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Pockets:</span>
            <strong className={`${textColor} text-right truncate`}>Fleece-Lined Slash + Internal Chest Pocket</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Storm Protection:</span>
            <strong className={`${textColor} text-right truncate`}>Internal Storm Flap &bull; Windproof Placket</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Cuffs &amp; Hem:</span>
            <strong className={`${textColor} text-right truncate`}>Internal Ribbed Cuffs &bull; Shock-Cord Hem</strong>
          </div>
          <div className={`flex items-center justify-between ${borderClass}`}>
            <span className={`${labelColor} shrink-0 mr-2`}>Garment Finish:</span>
            <strong className={`${highlightColor} text-right truncate`}>{washLabel}</strong>
          </div>
        </>
      );
    }

    return (
      <>
        <div className={`flex items-center justify-between ${borderClass}`}>
          <span className={`${labelColor} shrink-0 mr-2`}>Primary Fabric:</span>
          <strong className={`${textColor} text-right truncate`}>{product.materials?.[0] || "Custom Atelier Textile"}</strong>
        </div>
        <div className={`flex items-center justify-between ${borderClass}`}>
          <span className={`${labelColor} shrink-0 mr-2`}>Silhouette / Fit:</span>
          <strong className={`${textColor} text-right truncate`}>{product.fit || "Relaxed Atelier Silhouette"}</strong>
        </div>
        <div className={`flex items-center justify-between ${borderClass}`}>
          <span className={`${labelColor} shrink-0 mr-2`}>Construction Seams:</span>
          <strong className={`${textColor} text-right truncate`}>Industrial Reinforced Lockstitch</strong>
        </div>
        <div className={`flex items-center justify-between ${borderClass}`}>
          <span className={`${labelColor} shrink-0 mr-2`}>Trims / Hardware:</span>
          <strong className={`${textColor} text-right truncate`}>Studio Grade Fasteners &amp; Hardware</strong>
        </div>
        <div className={`flex items-center justify-between ${borderClass}`}>
          <span className={`${labelColor} shrink-0 mr-2`}>Labels:</span>
          <strong className={`${textColor} text-right truncate`}>High-Definition Damask Woven Label</strong>
        </div>
        <div className={`flex items-center justify-between ${borderClass}`}>
          <span className={`${labelColor} shrink-0 mr-2`}>Garment Finish:</span>
          <strong className={`${highlightColor} text-right truncate`}>{washLabel}</strong>
        </div>
      </>
    );
  };

  // Helper renderer for Front View
  const renderFrontView = (isForPrint = false) => {
    const frontTextLayer =
      state.textLayers?.find((t) => t.view !== "back") ||
      (firstTextLayer && firstTextLayer.view !== "back" ? firstTextLayer : null);
    const hasFrontText = Boolean(frontTextLayer && frontTextLayer.text?.trim());
    const filterId = isForPrint ? "tpChenilleFrontPrint" : "tpChenilleFrontModal";

    const frontLetterText = frontTextLayer?.text?.trim() || "";
    const frontMatchedFont = VARSITY_FONTS.find(
      (f) => f.id === frontTextLayer?.font || f.family === frontTextLayer?.font || f.name === frontTextLayer?.font
    );
    const frontResolvedFontFamily =
      frontMatchedFont?.family || frontTextLayer?.font || resolvedLetterFontFamily;
    const frontLetterColor = frontTextLayer?.color || (isBasketball ? "#FFFFFF" : isEquestrian ? "#FBBF24" : letterColor);
    const frontLetterBaseFelt =
      frontTextLayer?.outlineColor ||
      (isBasketball
        ? (state.partColors.ribs || "#111B2C")
        : state.partColors.body === "#FFFFFF"
        ? "#0B0B0B"
        : "#FFFFFF");
    const frontLetterCount = Math.max(1, frontLetterText.length);
    const frontLetterFontSize = frontLetterCount === 1 ? 58 : frontLetterCount === 2 ? 46 : 35;
    const frontStrokeWidthFelt = frontLetterCount === 1 ? 14 : frontLetterCount === 2 ? 11 : 9;

    // 1. Basketball Front Elevation
    if (isBasketball) {
      const jerseyColor = state.partColors.jersey || state.partColors.body || "#CA8A04";
      const ribsColor = state.partColors.ribs || state.partColors.collar || "#111B2C";
      const shortsColor = state.partColors.shorts || state.partColors.pants || "#CA8A04";

      return (
        <div className="w-full h-full relative flex items-center justify-center p-1">
          <div className="w-full h-full relative flex items-center justify-center max-w-[280px] aspect-square" style={{ isolation: "isolate" }}>
            {/* 1. Shorts */}
            <img
              src={ASSET_BB_FRONT_SHORTS}
              alt="Basketball Shorts Front"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: shortsColor,
                ...getMaskStyle(ASSET_BB_FRONT_SHORTS),
                ...getLayerBlendStyle(shortsColor, 0.9),
              }}
            />

            {/* 2. Torso */}
            <img
              src={ASSET_BB_FRONT_JERSEY}
              alt="Basketball Jersey Torso Front"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: jerseyColor,
                ...getMaskStyle(ASSET_BB_FRONT_JERSEY),
                ...getLayerBlendStyle(jerseyColor, 0.88),
              }}
            />

            {/* 3. Ribs */}
            <img
              src={ASSET_BB_FRONT_RIBS}
              alt="Basketball Rib Trim Front"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: ribsColor,
                ...getMaskStyle(ASSET_BB_FRONT_RIBS),
                ...getLayerBlendStyle(ribsColor, 0.92),
              }}
            />

            {/* Subtle Sheen */}
            <img
              src={ASSET_BB_FRONT_JERSEY}
              alt="Mesh Highlight Sheen"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ mixBlendMode: "screen", opacity: 0.1 }}
            />

            {/* Monogram / Number Overlay */}
            {hasFrontText && frontTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((frontTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
                  top: `${((frontTextLayer.y ?? 140) / CANVAS_REF) * 100}%`,
                  width: "22%",
                  height: "16%",
                  transform: `translate(-50%, -50%) rotate(${frontTextLayer.rotation ?? 0}deg)`,
                  pointerEvents: "none",
                }}
              >
                <svg viewBox="0 0 120 80" className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterBaseFelt}
                    stroke={frontLetterBaseFelt}
                    strokeWidth={frontStrokeWidthFelt}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {frontLetterText.toUpperCase()}
                  </text>
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterColor}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                  >
                    {frontLetterText.toUpperCase()}
                  </text>
                </svg>
              </div>
            )}

            {/* Front Artworks */}
            {frontArtworks.map((art) => {
              const artSize = isForPrint ? 26 : Math.max(22, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.26));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 100) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain drop-shadow" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. Equestrian Front Elevation
    if (isEquestrian) {
      const bodyColor = state.partColors.body || "#111B2C";
      const sleevesColor = state.partColors.sleeves || "#0A0A0A";
      const ribsColor = state.partColors.ribs || state.partColors.collar || "#D61C24";
      const leggingsColor = state.partColors.leggings || state.partColors.pants || "#20201E";

      return (
        <div className="w-full h-full relative flex items-center justify-center p-1">
          <div className="w-full h-full relative flex items-center justify-center max-w-[280px] aspect-square" style={{ isolation: "isolate" }}>
            {/* 1. Riding Leggings */}
            <img
              src={ASSET_EQ_FRONT_LEGGINGS}
              alt="Equestrian Breeches Front"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: leggingsColor,
                ...getMaskStyle(ASSET_EQ_FRONT_LEGGINGS),
                ...getLayerBlendStyle(leggingsColor, 0.9),
              }}
            />

            {/* 2. Sleeves */}
            <img
              src={ASSET_EQ_FRONT_SLEEVES}
              alt="Equestrian Sleeves Front"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: sleevesColor,
                ...getMaskStyle(ASSET_EQ_FRONT_SLEEVES),
                ...getLayerBlendStyle(sleevesColor, 0.9),
              }}
            />

            {/* 3. Main Torso Body */}
            <img
              src={ASSET_EQ_FRONT_BODY}
              alt="Equestrian Jacket Body Front"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: bodyColor,
                ...getMaskStyle(ASSET_EQ_FRONT_BODY),
                ...getLayerBlendStyle(bodyColor, 0.88),
              }}
            />

            {/* 4. Collar & Ribs */}
            <img
              src={ASSET_EQ_FRONT_RIBS}
              alt="Equestrian Ribs Front"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: ribsColor,
                ...getMaskStyle(ASSET_EQ_FRONT_RIBS),
                ...getLayerBlendStyle(ribsColor, 0.92),
              }}
            />

            {/* Subtle Sheen */}
            <img
              src={ASSET_EQ_FRONT_BODY}
              alt="Highlight Sheen"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ mixBlendMode: "screen", opacity: 0.1 }}
            />

            {/* Front Monogram */}
            {hasFrontText && frontTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((frontTextLayer.x ?? 135) / CANVAS_REF) * 100}%`,
                  top: `${((frontTextLayer.y ?? 120) / CANVAS_REF) * 100}%`,
                  width: "22%",
                  height: "16%",
                  transform: `translate(-50%, -50%) rotate(${frontTextLayer.rotation ?? 0}deg)`,
                  pointerEvents: "none",
                }}
              >
                <svg viewBox="0 0 120 80" className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterBaseFelt}
                    stroke={frontLetterBaseFelt}
                    strokeWidth={frontStrokeWidthFelt}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {frontLetterText.toUpperCase()}
                  </text>
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterColor}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                  >
                    {frontLetterText.toUpperCase()}
                  </text>
                </svg>
              </div>
            )}

            {/* Front Artworks */}
            {frontArtworks.map((art) => {
              const artSize = isForPrint ? 26 : Math.max(22, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.26));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 135) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 120) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain drop-shadow" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 3. Varsity Jacket Front Elevation
    if (isJacket) {
      return (
        <div className="w-full h-full relative flex items-center justify-center scale-[1.05]">
          <VarsityJacketGrayscaleViewer
            partColors={state.partColors}
            view="front"
            activeGarmentPart="none"
            className="w-full h-full"
          >
            {hasFrontText && frontTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((frontTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
                  top: `${((frontTextLayer.y ?? 200) / CANVAS_REF) * 100}%`,
                  width: "20%",
                  height: "16%",
                  transform: `translate(-50%, -50%) rotate(${frontTextLayer.rotation ?? 0}deg)`,
                  pointerEvents: "none",
                }}
              >
                <svg
                  viewBox="0 0 120 80"
                  className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                >
                  <defs>
                    <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* Outer Felt Backing Layer */}
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterBaseFelt}
                    stroke={frontLetterBaseFelt}
                    strokeWidth={frontStrokeWidthFelt}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {frontLetterText.toUpperCase()}
                  </text>

                  {/* Inner Chenille Yarn / Embroidered Fill in Selected Color Shade */}
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterColor}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                    filter={`url(#${filterId})`}
                  >
                    {frontLetterText.toUpperCase()}
                  </text>
                </svg>
              </div>
            )}
            {frontArtworks.map((art) => {
              const artSize = isForPrint ? 28 : Math.max(24, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.28));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 200) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain" />
                </div>
              );
            })}
          </VarsityJacketGrayscaleViewer>
        </div>
      );
    }

    // 4. Heavyweight Hoodie Front Elevation
    if (isHoodie) {
      const bodyColor = state.partColors.body || "#222224";
      const hoodColor = state.partColors.hood || state.partColors.body || "#222224";
      const pocketColor = state.partColors.pocket || state.partColors.body || "#222224";
      const sleevesColor = state.partColors.sleeves || state.partColors.body || "#222224";
      const cuffsColor = state.partColors.cuffs || state.partColors.waistband || state.partColors.body || "#222224";
      const waistbandColor = state.partColors.waistband || state.partColors.cuffs || state.partColors.body || "#222224";

      return (
        <div className="w-full h-full relative flex items-center justify-center p-1">
          <div className="w-full h-full relative flex items-center justify-center max-w-[280px] aspect-square" style={{ isolation: "isolate" }}>
            {/* Grayscale Base Image */}
            <img
              src="/hoodie/hoodie_front.png"
              alt="Heavyweight Hoodie Front Elevation"
              className="w-full h-full object-contain pointer-events-none drop-shadow-md"
              style={{ filter: "brightness(90%) contrast(100%)" }}
            />

            {/* 1. Body Color Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: bodyColor,
                mixBlendMode: "multiply",
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

            {/* 2. Hood Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: hoodColor,
                mixBlendMode: "multiply",
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

            {/* 3. Kangaroo Pocket Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: pocketColor,
                mixBlendMode: "multiply",
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

            {/* 4. Sleeves Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: sleevesColor,
                mixBlendMode: "multiply",
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

            {/* 5. Cuffs Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: cuffsColor,
                mixBlendMode: "multiply",
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

            {/* 6. Waistband Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: waistbandColor,
                mixBlendMode: "multiply",
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

            {/* Highlight Luster */}
            <img
              src="/hoodie/hoodie_front.png"
              alt="Highlights"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ mixBlendMode: "screen", opacity: 0.12 }}
            />

            {/* Chenille Lettering Patch on Hoodie */}
            {hasFrontText && frontTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((frontTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
                  top: `${((frontTextLayer.y ?? 200) / CANVAS_REF) * 100}%`,
                  width: "20%",
                  height: "16%",
                  transform: `translate(-50%, -50%) rotate(${frontTextLayer.rotation ?? 0}deg)`,
                  pointerEvents: "none",
                }}
              >
                <svg
                  viewBox="0 0 120 80"
                  className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                >
                  <defs>
                    <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* Outer Felt Backing */}
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterBaseFelt}
                    stroke={frontLetterBaseFelt}
                    strokeWidth={frontStrokeWidthFelt}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {frontLetterText.toUpperCase()}
                  </text>

                  {/* Inner Chenille Yarn / Embroidered Fill */}
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: frontResolvedFontFamily,
                      fontSize: `${frontLetterFontSize}px`,
                      letterSpacing: frontLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={frontLetterColor}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                    filter={`url(#${filterId})`}
                  >
                    {frontLetterText.toUpperCase()}
                  </text>
                </svg>
              </div>
            )}

            {/* Front Artwork (Brand Logo) on Hoodie */}
            {frontArtworks.map((art) => {
              const artSize = isForPrint ? 28 : Math.max(24, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.28));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 200) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain drop-shadow" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 5. Fallback SVG Garment Elevation (T-shirts, Pants, Shorts, etc.)
    return (
      <div className="w-full h-full relative flex items-center justify-center p-2">
        <GarmentSvg
          type={garmentSvgType}
          category={product.category}
          partColors={state.partColors}
          view="front"
          className="w-full h-full max-h-[180px] object-contain"
        />
        {hasFrontText && frontTextLayer && (
          <div
            style={{
              position: "absolute",
              left: `${((frontTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
              top: `${((frontTextLayer.y ?? 200) / CANVAS_REF) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${frontTextLayer.rotation ?? 0}deg)`,
              color: frontLetterColor,
              fontFamily: frontResolvedFontFamily,
              fontSize: isForPrint ? "9px" : `${Math.max(8, Math.round((frontTextLayer.fontSize ?? 22) * 0.45))}px`,
              fontWeight: frontTextLayer.fontWeight || "bold",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            {frontLetterText}
          </div>
        )}
        {frontArtworks.map((art) => {
          const artSize = isForPrint ? 28 : Math.max(24, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.28));
          return (
            <div
              key={art.id}
              style={{
                position: "absolute",
                left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                top: `${((art.y ?? 200) / CANVAS_REF) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                width: `${artSize}px`,
                height: `${artSize}px`,
                opacity: art.opacity ?? 1,
              }}
            >
              <img src={art.url} alt={art.name} className="w-full h-full object-contain" />
            </div>
          );
        })}
      </div>
    );
  };

  // Helper renderer for Back View
  const renderBackView = (isForPrint = false) => {
    const backTextLayer =
      state.textLayers?.find((t) => t.view === "back") ||
      (firstTextLayer && firstTextLayer.view === "back" ? firstTextLayer : null);
    const hasBackText = Boolean(backTextLayer && backTextLayer.text?.trim());
    const filterId = isForPrint ? "tpChenilleBackPrint" : "tpChenilleBackModal";

    const backLetterText = backTextLayer?.text?.trim() || "";
    const backMatchedFont = VARSITY_FONTS.find(
      (f) => f.id === backTextLayer?.font || f.family === backTextLayer?.font || f.name === backTextLayer?.font
    );
    const backResolvedFontFamily =
      backMatchedFont?.family || backTextLayer?.font || resolvedLetterFontFamily;
    const backLetterColor = backTextLayer?.color || (isBasketball ? "#FFFFFF" : isEquestrian ? "#FBBF24" : letterColor);
    const backLetterBaseFelt =
      backTextLayer?.outlineColor ||
      (isBasketball
        ? (state.partColors.ribs || "#111B2C")
        : state.partColors.body === "#FFFFFF"
        ? "#0B0B0B"
        : "#FFFFFF");
    const backLetterCount = Math.max(1, backLetterText.length);
    const backLetterFontSize = backLetterCount === 1 ? 58 : backLetterCount === 2 ? 46 : 35;
    const backStrokeWidthFelt = backLetterCount === 1 ? 14 : backLetterCount === 2 ? 11 : 9;

    // 1. Basketball Back Elevation
    if (isBasketball) {
      const jerseyColor = state.partColors.jersey || state.partColors.body || "#CA8A04";
      const ribsColor = state.partColors.ribs || state.partColors.collar || "#111B2C";
      const shortsColor = state.partColors.shorts || state.partColors.pants || "#CA8A04";

      return (
        <div className="w-full h-full relative flex items-center justify-center p-1">
          <div className="w-full h-full relative flex items-center justify-center max-w-[280px] aspect-square" style={{ isolation: "isolate" }}>
            {/* 1. Back Shorts */}
            <img
              src={ASSET_BB_BACK_SHORTS}
              alt="Basketball Shorts Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: shortsColor,
                ...getMaskStyle(ASSET_BB_BACK_SHORTS),
                ...getLayerBlendStyle(shortsColor, 0.9),
              }}
            />

            {/* 2. Back Jersey Torso */}
            <img
              src={ASSET_BB_BACK_JERSEY}
              alt="Basketball Jersey Torso Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: jerseyColor,
                ...getMaskStyle(ASSET_BB_BACK_JERSEY),
                ...getLayerBlendStyle(jerseyColor, 0.88),
              }}
            />

            {/* 3. Back Rib Trim */}
            <img
              src={ASSET_BB_BACK_RIBS}
              alt="Basketball Rib Trim Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: ribsColor,
                ...getMaskStyle(ASSET_BB_BACK_RIBS),
                ...getLayerBlendStyle(ribsColor, 0.92),
              }}
            />

            {/* Sheen */}
            <img
              src={ASSET_BB_BACK_JERSEY}
              alt="Highlight Sheen Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ mixBlendMode: "screen", opacity: 0.1 }}
            />

            {/* Back Text Overlay */}
            {hasBackText && backTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((backTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
                  top: `${((backTextLayer.y ?? 140) / CANVAS_REF) * 100}%`,
                  width: "22%",
                  height: "16%",
                  transform: `translate(-50%, -50%) rotate(${backTextLayer.rotation ?? 0}deg)`,
                  pointerEvents: "none",
                }}
              >
                <svg viewBox="0 0 120 80" className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: backResolvedFontFamily,
                      fontSize: `${backLetterFontSize}px`,
                      letterSpacing: backLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={backLetterBaseFelt}
                    stroke={backLetterBaseFelt}
                    strokeWidth={backStrokeWidthFelt}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {backLetterText.toUpperCase()}
                  </text>
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: backResolvedFontFamily,
                      fontSize: `${backLetterFontSize}px`,
                      letterSpacing: backLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={backLetterColor}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                  >
                    {backLetterText.toUpperCase()}
                  </text>
                </svg>
              </div>
            )}

            {/* Back Artworks */}
            {backArtworks.map((art) => {
              const artSize = isForPrint ? 26 : Math.max(22, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.22));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 120) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. Equestrian Back Elevation
    if (isEquestrian) {
      const bodyColor = state.partColors.body || "#111B2C";
      const sleevesColor = state.partColors.sleeves || "#0A0A0A";
      const ribsColor = state.partColors.ribs || state.partColors.collar || "#D61C24";
      const leggingsColor = state.partColors.leggings || state.partColors.pants || "#20201E";

      return (
        <div className="w-full h-full relative flex items-center justify-center p-1">
          <div className="w-full h-full relative flex items-center justify-center max-w-[280px] aspect-square" style={{ isolation: "isolate" }}>
            {/* 1. Back Breeches */}
            <img
              src={ASSET_EQ_BACK_LEGGINGS}
              alt="Equestrian Breeches Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: leggingsColor,
                ...getMaskStyle(ASSET_EQ_BACK_LEGGINGS),
                ...getLayerBlendStyle(leggingsColor, 0.9),
              }}
            />

            {/* 2. Back Sleeves */}
            <img
              src={ASSET_EQ_BACK_SLEEVES}
              alt="Equestrian Sleeves Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: sleevesColor,
                ...getMaskStyle(ASSET_EQ_BACK_SLEEVES),
                ...getLayerBlendStyle(sleevesColor, 0.9),
              }}
            />

            {/* 3. Back Body */}
            <img
              src={ASSET_EQ_BACK_BODY}
              alt="Equestrian Jacket Body Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: bodyColor,
                ...getMaskStyle(ASSET_EQ_BACK_BODY),
                ...getLayerBlendStyle(bodyColor, 0.88),
              }}
            />

            {/* 4. Back Ribs */}
            <img
              src={ASSET_EQ_BACK_RIBS}
              alt="Equestrian Ribs Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: ribsColor,
                ...getMaskStyle(ASSET_EQ_BACK_RIBS),
                ...getLayerBlendStyle(ribsColor, 0.92),
              }}
            />

            {/* Subtle Sheen */}
            <img
              src={ASSET_EQ_BACK_BODY}
              alt="Highlight Sheen Back"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ mixBlendMode: "screen", opacity: 0.1 }}
            />

            {/* Back Text Overlay */}
            {hasBackText && backTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((backTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
                  top: `${((backTextLayer.y ?? 120) / CANVAS_REF) * 100}%`,
                  width: "22%",
                  height: "16%",
                  transform: `translate(-50%, -50%) rotate(${backTextLayer.rotation ?? 0}deg)`,
                  pointerEvents: "none",
                }}
              >
                <svg viewBox="0 0 120 80" className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: backResolvedFontFamily,
                      fontSize: `${backLetterFontSize}px`,
                      letterSpacing: backLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={backLetterBaseFelt}
                    stroke={backLetterBaseFelt}
                    strokeWidth={backStrokeWidthFelt}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {backLetterText.toUpperCase()}
                  </text>
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none"
                    style={{
                      fontFamily: backResolvedFontFamily,
                      fontSize: `${backLetterFontSize}px`,
                      letterSpacing: backLetterCount === 1 ? "0px" : "2px",
                    }}
                    fill={backLetterColor}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                  >
                    {backLetterText.toUpperCase()}
                  </text>
                </svg>
              </div>
            )}

            {/* Back Artworks */}
            {backArtworks.map((art) => {
              const artSize = isForPrint ? 26 : Math.max(20, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.22));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 120) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (isJacket) {
      return (
        <div className="w-full h-full relative flex items-center justify-center scale-[1.05]">
          <VarsityJacketGrayscaleViewer
            partColors={state.partColors}
            view="back"
            activeGarmentPart="none"
            className="w-full h-full"
          >
            {hasBackText && backTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((backTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
                  top: `${((backTextLayer.y ?? 200) / CANVAS_REF) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${backTextLayer.rotation ?? 0}deg)`,
                  color: backTextLayer.color || letterColor,
                  fontFamily: backTextLayer.font || "'Alfa Slab One', 'Arial Black', sans-serif",
                  fontSize: `${Math.max(9, Math.round((backTextLayer.fontSize ?? 26) * 0.48))}px`,
                  fontWeight: backTextLayer.fontWeight || "bold",
                  letterSpacing: "0.5px",
                  textShadow: `1px 1px 0px ${letterBaseFelt}, -1px -1px 0px ${letterBaseFelt}, 1px -1px 0px ${letterBaseFelt}, -1px 1px 0px ${letterBaseFelt}`,
                  whiteSpace: "nowrap",
                }}
              >
                {backTextLayer.text}
              </div>
            )}
            {backArtworks.map((art) => {
              const artSize = Math.max(24, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.28));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 200) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain" />
                </div>
              );
            })}
          </VarsityJacketGrayscaleViewer>
        </div>
      );
    }

    if (isHoodie) {
      const bodyColor = state.partColors.body || "#222224";
      const hoodColor = state.partColors.hood || state.partColors.body || "#222224";
      const sleevesColor = state.partColors.sleeves || state.partColors.body || "#222224";
      const cuffsColor = state.partColors.cuffs || state.partColors.waistband || state.partColors.body || "#222224";
      const waistbandColor = state.partColors.waistband || state.partColors.cuffs || state.partColors.body || "#222224";

      return (
        <div className="w-full h-full relative flex items-center justify-center p-1">
          <div className="w-full h-full relative flex items-center justify-center max-w-[280px] aspect-square" style={{ isolation: "isolate" }}>
            {/* Grayscale Base Image */}
            <img
              src="/hoodie/hoodie_back.png"
              alt="Heavyweight Hoodie Back Elevation"
              className="w-full h-full object-contain pointer-events-none drop-shadow-md"
              style={{ filter: "brightness(90%) contrast(100%)" }}
            />

            {/* 1. Back Body Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: bodyColor,
                mixBlendMode: "multiply",
                WebkitMaskImage: "url(/hoodie/back_body.png)",
                maskImage: "url(/hoodie/back_body.png)",
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
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: hoodColor,
                mixBlendMode: "multiply",
                WebkitMaskImage: "url(/hoodie/back_hood.png)",
                maskImage: "url(/hoodie/back_hood.png)",
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
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: sleevesColor,
                mixBlendMode: "multiply",
                WebkitMaskImage: "url(/hoodie/back_sleeves.png)",
                maskImage: "url(/hoodie/back_sleeves.png)",
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
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: cuffsColor,
                mixBlendMode: "multiply",
                WebkitMaskImage: "url(/hoodie/back_cuffs.png)",
                maskImage: "url(/hoodie/back_cuffs.png)",
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
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: waistbandColor,
                mixBlendMode: "multiply",
                WebkitMaskImage: "url(/hoodie/back_waistband.png)",
                maskImage: "url(/hoodie/back_waistband.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />

            {/* Back Text Overlay */}
            {hasBackText && backTextLayer && (
              <div
                style={{
                  position: "absolute",
                  left: `${((backTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
                  top: `${((backTextLayer.y ?? 200) / CANVAS_REF) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${backTextLayer.rotation ?? 0}deg)`,
                  color: backTextLayer.color || letterColor,
                  fontFamily: backTextLayer.font || "'Alfa Slab One', 'Arial Black', sans-serif",
                  fontSize: `${Math.max(9, Math.round((backTextLayer.fontSize ?? 26) * 0.48))}px`,
                  fontWeight: backTextLayer.fontWeight || "bold",
                  letterSpacing: "0.5px",
                  textShadow: `1px 1px 0px ${letterBaseFelt}, -1px -1px 0px ${letterBaseFelt}, 1px -1px 0px ${letterBaseFelt}, -1px 1px 0px ${letterBaseFelt}`,
                  whiteSpace: "nowrap",
                }}
              >
                {backTextLayer.text}
              </div>
            )}

            {/* Back Artwork Overlay */}
            {backArtworks.map((art) => {
              const artSize = Math.max(24, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.28));
              return (
                <div
                  key={art.id}
                  style={{
                    position: "absolute",
                    left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                    top: `${((art.y ?? 200) / CANVAS_REF) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                    width: `${artSize}px`,
                    height: `${artSize}px`,
                    opacity: art.opacity ?? 1,
                  }}
                >
                  <img src={art.url} alt={art.name} className="w-full h-full object-contain drop-shadow" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative flex items-center justify-center p-2">
        <GarmentSvg
          type={garmentSvgType}
          category={product.category}
          partColors={state.partColors}
          view="back"
          className="w-full h-full max-h-[180px] object-contain"
        />
        {hasBackText && backTextLayer && (
          <div
            style={{
              position: "absolute",
              left: `${((backTextLayer.x ?? 210) / CANVAS_REF) * 100}%`,
              top: `${((backTextLayer.y ?? 200) / CANVAS_REF) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${backTextLayer.rotation ?? 0}deg)`,
              color: backTextLayer.color || letterColor,
              fontFamily: backTextLayer.font || "'Alfa Slab One', 'Arial Black', sans-serif",
              fontSize: `${Math.max(8, Math.round((backTextLayer.fontSize ?? 22) * 0.45))}px`,
              fontWeight: backTextLayer.fontWeight || "bold",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            {backTextLayer.text}
          </div>
        )}
        {backArtworks.map((art) => {
          const artSize = Math.max(24, Math.round((art.width ?? 120) * (art.scale ?? 1) * 0.28));
          return (
            <div
              key={art.id}
              style={{
                position: "absolute",
                left: `${((art.x ?? 210) / CANVAS_REF) * 100}%`,
                top: `${((art.y ?? 200) / CANVAS_REF) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${art.rotation ?? 0}deg)`,
                width: `${artSize}px`,
                height: `${artSize}px`,
                opacity: art.opacity ?? 1,
              }}
            >
              <img src={art.url} alt={art.name} className="w-full h-full object-contain" />
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ON-SCREEN DARK THEME MODAL (ALIGNED TO ATELIER THEME)                  */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 tech-pack-modal-backdrop no-print">
        <div className={`bg-[#0E0E0E] text-white ${isFullscreen ? "w-full max-w-none h-full max-h-none rounded-none sm:rounded-lg" : "w-full max-w-5xl max-h-[92vh] rounded-[4px]"} border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden transition-all duration-200`}>
          {/* Top Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between bg-[#0E0E0E]">
            <div>
              <span className="inline-block bg-[#D10115] text-white text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-[2px] uppercase tracking-wider mb-2">
                FACTORY TECH-PACK
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight font-display">
                Garment Manufacturing Specification Sheet
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-[3px] border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-semibold"
                title={isFullscreen ? "Restore standard size" : "Expand to fullscreen"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Standard</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Expand</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white p-1 rounded-[2px] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Elevation Controls & Spec Cards */}
              <div className="lg:col-span-5 space-y-3">
                {/* Elevation Controls Toolbar */}
                <div className="bg-[#141414] border border-white/15 rounded-[4px] p-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* View Selector */}
                  <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-white/10">
                    {(["dual", "front", "back"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setElevationViewMode(mode)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors cursor-pointer ${
                          elevationViewMode === mode
                            ? "bg-[#D10115] text-white font-bold"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {mode === "dual" ? "◫ Dual" : mode}
                      </button>
                    ))}
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded border border-white/10 font-mono text-[10px]">
                    <span className="text-neutral-400 text-[9px]">Zoom:</span>
                    <button
                      type="button"
                      onClick={() => setModelZoom((z) => Math.max(60, z - 15))}
                      className="w-4 h-4 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="text-white font-bold min-w-[28px] text-center text-[10px]">
                      {modelZoom}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setModelZoom((z) => Math.min(180, z + 15))}
                      className="w-4 h-4 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer"
                      title="Zoom In"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelZoom(100)}
                      className="text-[9px] text-neutral-400 hover:text-white underline ml-0.5 cursor-pointer"
                      title="Reset 100%"
                    >
                      ↺
                    </button>
                  </div>

                  {/* BG Color Selector */}
                  <div className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                    <span className="text-neutral-400 text-[9px] font-mono">BG:</span>
                    <div className="flex items-center gap-1">
                      {["#0E0F12", "#141414", "#1E293B", "#3A3E47", "#F8FAFC", "#000000"].map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setModelBgColor(bg)}
                          className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer shrink-0 ${
                            modelBgColor === bg ? "ring-2 ring-[#D10115] border-white scale-110" : "border-white/30 hover:scale-105"
                          }`}
                          style={{ backgroundColor: bg }}
                          title={`Set background to ${bg}`}
                        />
                      ))}
                      <input
                        type="color"
                        value={modelBgColor}
                        onChange={(e) => setModelBgColor(e.target.value)}
                        className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0 ml-0.5 bg-transparent"
                        title="Custom Background Color"
                      />
                    </div>
                  </div>
                </div>

                {/* Spec Cards Grid */}
                <div className={`grid ${elevationViewMode === "dual" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                  {/* Front Spec Card */}
                  {(elevationViewMode === "dual" || elevationViewMode === "front") && (
                    <div className="bg-[#141414] border border-white/15 rounded-[6px] flex flex-col items-center justify-between relative shadow-lg group">
                      <div
                        className={`w-full ${elevationViewMode === "front" ? "aspect-4/3 min-h-[280px]" : "aspect-square"} relative flex items-center justify-center p-1.5 overflow-hidden rounded-t-[5px] transition-colors`}
                        style={{ backgroundColor: modelBgColor }}
                      >
                        <div
                          className="w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
                          style={{ transform: `scale(${modelZoom / 100})` }}
                        >
                          {renderFrontView(false)}
                        </div>
                      </div>
                      <div className="w-full py-2 px-2 border-t border-white/10 bg-black/60 rounded-b-[5px] flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-200 uppercase select-none block">
                          FRONT SPEC
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold whitespace-nowrap">
                          2D / 3D
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Back Spec Card */}
                  {(elevationViewMode === "dual" || elevationViewMode === "back") && (
                    <div className="bg-[#141414] border border-white/15 rounded-[6px] flex flex-col items-center justify-between relative shadow-lg group">
                      <div
                        className={`w-full ${elevationViewMode === "back" ? "aspect-4/3 min-h-[280px]" : "aspect-square"} relative flex items-center justify-center p-1.5 overflow-hidden rounded-t-[5px] transition-colors`}
                        style={{ backgroundColor: modelBgColor }}
                      >
                        <div
                          className="w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
                          style={{ transform: `scale(${modelZoom / 100})` }}
                        >
                          {renderBackView()}
                        </div>
                      </div>
                      <div className="w-full py-2 px-2 border-t border-white/10 bg-black/60 rounded-b-[5px] flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-200 uppercase select-none block">
                          BACK SPEC
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold whitespace-nowrap">
                          Rear Spec
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: BOM & Customization Specifications */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. BOM SPECIFICATIONS */}
                <div className="bg-[#141414] border border-white/10 rounded-[4px] p-3.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                    <div>
                      <h3 className="text-white font-black text-xs sm:text-sm tracking-wide uppercase font-display">
                        {product.name.toUpperCase()} &mdash; BOM SPECIFICATIONS
                      </h3>
                      <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                        Category: {product.category.toUpperCase()} &bull; SKU: {product.sku || product.id.toUpperCase()}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-white/10 text-neutral-200 px-2 py-0.5 rounded-[2px] uppercase">
                      {bomItems.length}-Point Color Mapping
                    </span>
                  </div>

                  {/* List of Material & Color Swatches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {bomItems.map((item) => (
                      <div
                        key={item.zone}
                        className="flex items-center justify-between py-1 border-b border-white/5 text-[11px]"
                      >
                        <span className="text-neutral-300 font-bold uppercase truncate max-w-[170px]">
                          {item.zone}:
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="w-3.5 h-3.5 rounded-[2px] border border-white/20 shrink-0"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="text-white font-mono font-semibold text-[10px]">
                            {item.hex}
                          </span>
                          <span className="text-neutral-400 text-[10px] truncate max-w-[115px]">
                            ({item.name})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. CUSTOM LETTERING & EMBROIDERY CRAFT SPEC */}
                <div className="bg-[#141414] border border-white/10 rounded-[4px] p-3.5 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <span className="w-2 h-2 rounded-full bg-[#D10115]" />
                      LETTERING &amp; EMBROIDERY CRAFT SPEC
                    </span>
                    <span className="text-[9px] font-mono bg-[#D10115]/20 text-[#D10115] border border-[#D10115]/40 px-2 py-0.5 rounded-[2px] font-bold uppercase">
                      {letterCraft}
                    </span>
                  </div>

                  {letterText ? (
                    <div className="space-y-2 text-[10.5px] font-mono">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="bg-black/40 border border-white/5 p-2 rounded-[2px]">
                          <span className="text-neutral-400 text-[9px] uppercase block">Lettering Text</span>
                          <strong className="text-white text-base tracking-widest font-black">&ldquo;{letterText}&rdquo;</strong>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-2 rounded-[2px]">
                          <span className="text-neutral-400 text-[9px] uppercase block">Typography</span>
                          <strong className="text-white font-bold">{letterFontName}</strong>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-2 rounded-[2px] col-span-2 sm:col-span-1">
                          <span className="text-neutral-400 text-[9px] uppercase block">Embellishment</span>
                          <strong className="text-[#D10115] font-bold uppercase">{letterCraft}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Felt & Yarn Swatches */}
                        <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-2 rounded-[2px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-400 text-[9px] uppercase">Base Felt:</span>
                            <span
                              className="w-3.5 h-3.5 rounded-[2px] border border-white/30 shrink-0"
                              style={{ backgroundColor: letterBaseFelt }}
                            />
                            <span className="font-mono text-white text-[10px] font-bold">{letterBaseFelt}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-400 text-[9px] uppercase">Top Yarn:</span>
                            <span
                              className="w-3.5 h-3.5 rounded-[2px] border border-white/30 shrink-0"
                              style={{ backgroundColor: letterColor }}
                            />
                            <span className="font-mono text-white text-[10px] font-bold">{letterColor}</span>
                          </div>
                        </div>

                        {/* Chest Coordinates Mapped directly from Dragging */}
                        <div className="bg-black/40 border border-white/5 p-2 rounded-[2px] flex items-center justify-between">
                          <div>
                            <span className="text-neutral-400 text-[9px] uppercase block">Chest Coordinates</span>
                            <strong className="text-white text-[10px] font-bold">
                              X: {firstTextLayer ? Math.round(((firstTextLayer.x ?? 210) / CANVAS_REF) * 100) : 30}% &bull; Y: {firstTextLayer ? Math.round(((firstTextLayer.y ?? 200) / CANVAS_REF) * 100) : 30}%
                            </strong>
                          </div>
                          <span className="text-[9px] font-mono text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded-[2px]">
                            {firstTextLayer ? (((firstTextLayer.x ?? 210) / CANVAS_REF) * 42).toFixed(1) : "12.6"}cm &times; {firstTextLayer ? (((firstTextLayer.y ?? 200) / CANVAS_REF) * 42).toFixed(1) : "12.6"}cm
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-neutral-400 py-1 flex items-center justify-between">
                      <span>Standard clean chest finish.</span>
                      <span className="text-neutral-500">Method: {letterCraft}</span>
                    </div>
                  )}
                </div>

                {/* 3. MODULAR TRIMS, CONSTRUCTION & ARTISANAL WASH */}
                <div className="bg-[#141414] border border-white/10 rounded-[4px] p-3.5 text-[10.5px] font-mono space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-white font-black text-[11px] uppercase tracking-wider font-display">
                      {section3Title}
                    </span>
                    <span className="text-[9px] text-neutral-400 uppercase">Factory Assembly Notes</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-neutral-300">
                    {renderTrimsList(true)}
                  </div>
                </div>

                {/* 4. UPLOADED ARTWORK & CREST SPEC */}
                {state.artworkLayers && state.artworkLayers.length > 0 && (
                  <div className="bg-[#141414] border border-white/10 rounded-[4px] p-3.5 text-[10.5px] font-mono space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span className="text-white font-black text-[11px] uppercase tracking-wider font-display">
                        UPLOADED ARTWORK &amp; CREST SPEC
                      </span>
                      <span className="text-[9px] text-[#D10115] uppercase font-bold">
                        {state.artworkLayers.length} Custom Placement{state.artworkLayers.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {state.artworkLayers.map((art) => (
                        <div key={art.id} className="flex items-center justify-between py-1 border-b border-white/5 text-[10px]">
                          <div>
                            <strong className="text-white uppercase block">{art.name}</strong>
                            <span className="text-neutral-400">Position: {art.view.toUpperCase()} Chest &bull; Scale {art.scale}x &bull; Rot {art.rotation}&deg;</span>
                          </div>
                          <span className="font-mono text-neutral-300 bg-white/5 px-2 py-0.5 rounded-[2px]">
                            X: {Math.round(((art.x ?? 160) / CANVAS_REF) * 100)}% &bull; Y: {Math.round(((art.y ?? 180) / CANVAS_REF) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. PRODUCTION & COMMERCIAL ORDER QUOTE */}
                <div className="bg-[#141414] border border-white/10 rounded-[4px] p-3.5 text-xs text-neutral-300 font-mono flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase block">Production Volume</span>
                    {hasVolumeEntered ? (
                      <strong className="text-white">{garmentSize} &bull; {orderVolume} pcs</strong>
                    ) : (
                      <strong className="text-amber-400 text-[11px]">Pending Allocation &bull; 0 pcs entered</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase block">Fabric Specification</span>
                    <strong className="text-white">
                      {isVarsity
                        ? "500 GSM Melton Wool / Cowhide Leather"
                        : isHoodie
                        ? `${state.gsm || product.GSM || 450} GSM Combed Loopback French Terry`
                        : isTee
                        ? `${state.gsm || product.GSM || 280} GSM 16-Singles Cotton Jersey`
                        : isPants
                        ? `${product.GSM || 420} GSM Heavy French Terry Fleece`
                        : isGeneralJacket
                        ? `${product.materials?.[0] || "Water-Resistant Outerwear Nylon"}`
                        : (product.materials?.[0] || "Studio Grade Textile")}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-400 text-[10px] uppercase block">Unit / Total Order</span>
                    <span className="text-white font-bold text-sm">${customUnitQuote.toFixed(2)}</span>
                    <span className="text-neutral-500 mx-1">/</span>
                    {totalOrderQuote ? (
                      <strong className="text-[#D10115] font-black text-sm">${totalOrderQuote}</strong>
                    ) : (
                      <strong className="text-neutral-400 text-xs font-semibold">Enter batch units</strong>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-3 sm:p-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 bg-[#0E0E0E]">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[2px] border border-white/20 bg-transparent text-neutral-300 hover:text-white hover:border-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              CLOSE
            </button>
            <button
              onClick={handlePrint}
              disabled={isPreparingPrint}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[2px] bg-[#D10115] hover:bg-[#A80010] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-center"
            >
              {isPreparingPrint ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>COMPILING TECH PACK PDF...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>PRINT / EXPORT PDF TECH PACK</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRINT / EXPORT PDF SPEC SHEET (MOUNTED TO BODY VIA CREATEPORTAL)        */}
      {/* ========================================================================= */}
      {mounted &&
        createPortal(
          <div className="tech-pack-print-portal print-only">
            {/* Printable Document Sheet (1 Page Optimized) */}
            <div className="w-full bg-white text-black font-sans text-[11px] leading-tight p-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-3">
                <div>
                  <h1 className="text-base font-black tracking-tight text-neutral-900 uppercase">
                    TAWFIQ ATELIER &bull; FACTORY MANUFACTURING BLUEPRINT
                  </h1>
                  <p className="text-[10px] font-bold text-[#D10115] uppercase tracking-wide">
                    TECH-PACK SPEC &mdash; {product.name.toUpperCase()} (SKU: {product.sku || product.id.toUpperCase()})
                  </p>
                </div>
                <div className="text-right text-[9.5px]">
                  <div>
                    <span className="text-neutral-500 font-medium">Spec Date: </span>
                    <span className="font-mono font-bold text-neutral-900">{currentDate}</span>
                  </div>
                  <div className="mt-0.5">
                    {hasVolumeEntered ? (
                      <>
                        <span className="text-neutral-500 font-medium">Garment Size: </span>
                        <strong className="text-neutral-900 font-bold">{garmentSize}</strong>
                        <span className="text-neutral-400 mx-1">|</span>
                        <span className="text-neutral-500 font-medium">Order Volume: </span>
                        <strong className="text-[#D10115] font-bold">{orderVolume} pcs</strong>
                      </>
                    ) : (
                      <>
                        <span className="text-neutral-500 font-medium">Production Volume: </span>
                        <strong className="text-neutral-700 font-bold">Sample Spec (Pending Batch Allocation)</strong>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Two-Column Grid: Left Preview & Quote, Right BOM & Specs */}
              <div className="grid grid-cols-12 gap-4 items-start">
                {/* Left Column (4 of 12 cols): Garment Visuals + Quote */}
                <div className="col-span-4 space-y-3">
                  {/* Front & Back Elevation Views */}
                  <div className="grid grid-cols-2 gap-1.5 border border-neutral-300 p-1.5 rounded-[2px] bg-neutral-50">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square relative flex items-center justify-center overflow-hidden">
                        {renderFrontView(true)}
                      </div>
                      <span className="text-[8px] font-mono font-bold uppercase text-neutral-600 mt-1">
                        FRONT VIEW
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square relative flex items-center justify-center overflow-hidden">
                        {renderBackView(true)}
                      </div>
                      <span className="text-[8px] font-mono font-bold uppercase text-neutral-600 mt-1">
                        BACK VIEW
                      </span>
                    </div>
                  </div>

                  {/* COST & QUOTE SUMMARY */}
                  <div className="border border-neutral-300 p-2 rounded-[2px] bg-white text-[9.5px] space-y-1">
                    <h4 className="font-black text-[9px] uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1">
                      COST &amp; QUOTE SUMMARY
                    </h4>
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Base Garment:</span>
                      <span className="font-mono font-medium">${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-[#D10115]">
                      <span>Unit Quote:</span>
                      <span className="font-mono">${customUnitQuote.toFixed(2)}</span>
                    </div>
                    {totalOrderQuote ? (
                      <div className="flex items-center justify-between font-bold text-neutral-900 border-t border-neutral-200 pt-1">
                        <span>Total Order:</span>
                        <span className="font-mono">${totalOrderQuote}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between font-medium text-neutral-500 border-t border-neutral-200 pt-1">
                        <span>Total Order:</span>
                        <span className="font-mono text-xs">Pending Allocation</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (8 of 12 cols): Tables & Quality Checklist */}
                <div className="col-span-8 space-y-2.5">
                  {/* 1. BILL OF MATERIALS (BOM) & COLOR SPECIFICATIONS */}
                  <div>
                    <h3 className="font-black text-[9.5px] uppercase tracking-wide text-neutral-900 mb-1">
                      1. BILL OF MATERIALS (BOM) &amp; COLOR SPECIFICATIONS
                    </h3>
                    <div className="border border-neutral-300 rounded-[2px] overflow-hidden">
                      <table className="w-full text-left text-[8.5px] border-collapse font-sans">
                        <thead className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 font-bold uppercase">
                          <tr>
                            <th className="p-1.5 border-r border-neutral-300 w-[30%]">Zone</th>
                            <th className="p-1.5 border-r border-neutral-300 w-[40%]">Fabric / Trim</th>
                            <th className="p-1.5 w-[30%]">Pantone / Hex Code</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 font-medium">
                          {bomItems.map((item) => (
                            <tr key={item.zone} className="hover:bg-neutral-50">
                              <td className="p-1.5 font-bold text-neutral-900 border-r border-neutral-200">
                                {item.zone}
                              </td>
                              <td className="p-1.5 text-neutral-700 border-r border-neutral-200">
                                {item.fabric}
                              </td>
                              <td className="p-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-3 h-3 rounded-[1px] border border-black/30 shrink-0 inline-block"
                                    style={{ backgroundColor: item.hex }}
                                  />
                                  <span className="font-mono font-bold text-neutral-900">
                                    {item.hex}
                                  </span>
                                  <span className="text-neutral-500 text-[8px]">
                                    ({item.name})
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. LETTERING & EMBROIDERY CRAFT SPEC */}
                  <div>
                    <h3 className="font-black text-[9.5px] uppercase tracking-wide text-neutral-900 mb-1">
                      2. LETTERING &amp; EMBROIDERY CRAFT SPEC
                    </h3>
                    <div className="border border-neutral-300 rounded-[2px] p-2 bg-neutral-50/50 text-[8.5px] space-y-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-neutral-500 font-medium">Lettering Text: </span>
                          <strong className="text-neutral-900">
                            {letterText ? `"${letterText}"` : "None"}
                          </strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-medium">Typography: </span>
                          <strong className="text-neutral-900">{letterFontName}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-medium">Craft: </span>
                          <strong className="text-[#D10115] uppercase">{letterCraft}</strong>
                        </div>
                      </div>
                      {letterText && firstTextLayer && (
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-200 text-[8px] font-mono">
                          <span className="text-neutral-500">Garment Chest Coordinates:</span>
                          <strong className="text-neutral-900 bg-neutral-200/60 px-1.5 py-0.5 rounded-[2px]">
                            {Math.round(((firstTextLayer.x ?? 210) / CANVAS_REF) * 100)}% X &bull; {Math.round(((firstTextLayer.y ?? 200) / CANVAS_REF) * 100)}% Y &bull; {(((firstTextLayer.x ?? 210) / CANVAS_REF) * 42).toFixed(1)}cm &times; {(((firstTextLayer.y ?? 200) / CANVAS_REF) * 42).toFixed(1)}cm
                          </strong>
                        </div>
                      )}
                      {letterText && (
                        <div className="flex items-center gap-4 pt-0.5 border-t border-neutral-200">
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 font-medium">Base Felt:</span>
                            <span
                              className="w-2.5 h-2.5 rounded-[1px] border border-black/30 shrink-0"
                              style={{ backgroundColor: letterBaseFelt }}
                            />
                            <span className="font-mono font-bold text-neutral-900">{letterBaseFelt}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-500 font-medium">Top Felt / Yarn:</span>
                            <span
                              className="w-2.5 h-2.5 rounded-[1px] border border-black/30 shrink-0"
                              style={{ backgroundColor: letterColor }}
                            />
                            <span className="font-mono font-bold text-neutral-900">{letterColor}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. MODULAR TRIMS, CONSTRUCTION & GARMENT WASH SPEC */}
                  <div>
                    <h3 className="font-black text-[9.5px] uppercase tracking-wide text-neutral-900 mb-1">
                      3. {section3Title}
                    </h3>
                    <div className="border border-neutral-300 rounded-[2px] p-2 bg-neutral-50/50 text-[8.5px] grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                      {renderTrimsList(false)}
                    </div>
                  </div>

                  {/* 4. UPLOADED ARTWORK & CREST PLACEMENTS */}
                  <div>
                    <h3 className="font-black text-[9.5px] uppercase tracking-wide text-neutral-900 mb-1">
                      4. UPLOADED ARTWORK &amp; CREST PLACEMENTS
                    </h3>
                    <div className="border border-neutral-300 rounded-[2px] overflow-hidden">
                      <table className="w-full text-left text-[8.5px] border-collapse font-sans">
                        <thead className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 font-bold uppercase">
                          <tr>
                            <th className="p-1 border-r border-neutral-300 w-[25%]">Placement</th>
                            <th className="p-1 border-r border-neutral-300 w-[35%]">Transform Specs</th>
                            <th className="p-1 w-[40%]">Source Asset</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.artworkLayers && state.artworkLayers.length > 0 ? (
                            state.artworkLayers.map((art) => (
                              <tr key={art.id} className="border-b border-neutral-200">
                                <td className="p-1 text-neutral-900 font-bold border-r border-neutral-200">
                                  {art.view.toUpperCase()} CHEST
                                </td>
                                <td className="p-1 text-neutral-700 border-r border-neutral-200 font-mono">
                                  Scale {art.scale}x | Rot {art.rotation}&deg;
                                </td>
                                <td className="p-1 text-neutral-700 truncate font-mono">
                                  {art.name}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="p-2 text-center text-neutral-400 italic font-mono text-[8px]">
                                No uploaded artwork attachments
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 5. FACTORY QUALITY CONTROL (QC) SIGN-OFF */}
                  <div>
                    <h3 className="font-black text-[9.5px] uppercase tracking-wide text-neutral-900 mb-1">
                      5. FACTORY QUALITY CONTROL (QC) SIGN-OFF
                    </h3>
                    <div className="border border-neutral-300 rounded-[2px] p-2 bg-white text-[8px] font-mono grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <span className="w-2.5 h-2.5 border border-neutral-400 rounded-[1px] inline-block" />
                        <span>Fabric Lab Match</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <span className="w-2.5 h-2.5 border border-neutral-400 rounded-[1px] inline-block" />
                        <span>Garment Construction Pass</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <span className="w-2.5 h-2.5 border border-neutral-400 rounded-[1px] inline-block" />
                        <span>Lettering Height &amp; Alignment</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <span className="w-2.5 h-2.5 border border-neutral-400 rounded-[1px] inline-block" />
                        <span>Trims &amp; Ribs Secured</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <span className="w-2.5 h-2.5 border border-neutral-400 rounded-[1px] inline-block" />
                        <span>Seam Tension Checked</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <span className="w-2.5 h-2.5 border border-neutral-400 rounded-[1px] inline-block" />
                        <span>Final QC Steam Pass</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Global Print Stylesheet for exact 1-sheet PDF generation */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 6mm 10mm;
          }
          html,
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          body > *:not(.tech-pack-print-portal) {
            display: none !important;
          }
          .tech-pack-modal-backdrop,
          .no-print {
            display: none !important;
          }
          .tech-pack-print-portal {
            position: static !important;
            display: block !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            z-index: 99999999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        @media screen {
          .tech-pack-print-portal {
            position: fixed !important;
            top: -99999px !important;
            left: -99999px !important;
            width: 8.5in !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -9999 !important;
          }
        }
      `}</style>
    </>
  );
};

