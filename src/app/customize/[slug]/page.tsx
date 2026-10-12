"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS_DATA } from "@/services/products.service";
import { PRESET_SWATCHES, FONT_COLLECTIONS, customizerService } from "@/services/customizer.service";
import {
  VARSITY_FONTS,
  LETTER_SHADE_FAMILIES,
  QUICK_MONOGRAM_PRESETS,
  COLOR_PRESETS,
  HOODIE_COLOR_PRESETS,
  EQUESTRIAN_COLOR_PRESETS,
  BASKETBALL_COLOR_PRESETS,
  SAMPLE_LOGOS,
  BUTTON_FINISHES,
  LINING_OPTIONS,
  FELT_BORDER_SHADES,
  CRAFT_TECHNIQUES,
} from "@/config/varsityCustomizer.config";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { useSavedDesignStore } from "@/store/useSavedDesignStore";
import { useCartStore } from "@/store/useCartStore";
import { useStoreModeStore } from "@/store/useStoreModeStore";
import { GarmentSvg } from "@/components/common/GarmentSvg";
import { VarsityJacketGrayscaleViewer } from "@/components/common/VarsityJacketGrayscaleViewer";
import { VarsityJacketCanvas } from "@/components/homepage/VarsityJacketCanvas";
import { HoodieCustomizerViewer } from "@/components/common/HoodieCustomizerViewer";
import { EquestrianCustomizerViewer } from "@/components/common/EquestrianCustomizerViewer";
import { BasketballCustomizerViewer } from "@/components/common/BasketballCustomizerViewer";
import { TechPackModal } from "@/components/common/TechPackModal";
import {
  Undo2,
  Redo2,
  RotateCcw,
  Save,
  Download,
  FileText,
  Share2,
  Eye,
  EyeOff,
  Trash2,
  Type,
  Image as ImageIcon,
  Layers,
  Sliders,
  Box,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Move,
  Maximize2,
  Palette,
  UploadCloud,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function ProductCustomizerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    product,
    view,
    activeGarmentPart,
    partColors,
    fabricId,
    gsm,
    washId,
    decorationMethodId,
    artworkLayers,
    textLayers,
    selectedLayerId,
    quantity,
    sizeBreakdown,
    initCustomizer,
    setView,
    setActiveGarmentPart,
    setPartColor,
    setAllPartColors,
    setFabric,
    setWash,
    setDecorationMethod,
    setSelectedLayerId,
    addArtworkLayer,
    updateArtworkLayer,
    removeArtworkLayer,
    addTextLayer,
    updateTextLayer,
    removeTextLayer,
    bringForward,
    sendBackward,
    deleteSelectedLayer,
    setQuantity,
    setSizeBreakdown,
    undo,
    redo,
    canUndo,
    canRedo,
    resetToDefaults,
  } = useCustomizerStore();

  const { saveDesign, getDesign } = useSavedDesignStore();
  const { addItem } = useCartStore();
  const { mode } = useStoreModeStore();

  // Local UI state
  type TabType = "colors" | "specs" | "artwork" | "text" | "layers" | "sizing";
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [isTechPackOpen, setIsTechPackOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [customHex, setCustomHex] = useState("#222224");
  const [newTextInput, setNewTextInput] = useState("STUDIO ARCHIVE");
  const [selectedFont, setSelectedFont] = useState(FONT_COLLECTIONS[0].id);

  // 3-Letter Monogram Customization State
  const [textToolMode, setTextToolMode] = useState<"monogram" | "standard">("monogram");
  const [monogramText, setMonogramText] = useState("");
  const [monogramFont, setMonogramFont] = useState(VARSITY_FONTS[0].id);
  const [monogramColor, setMonogramColor] = useState("#FBBF24");
  const [monogramShadeFilter, setMonogramShadeFilter] = useState<"all" | "light" | "vibrant" | "deep" | "dark">("all");
  const [monogramFeltColor, setMonogramFeltColor] = useState("#FFFFFF");
  const [monogramCraftStyle, setMonogramCraftStyle] = useState("chenille");

  // Modular Trims & Artisanal Finishes
  const [sleeveStyle, setSleeveStyle] = useState<"striped" | "plain">("striped");
  const [pocketStyle, setPocketStyle] = useState<"striped" | "plain">("striped");
  const [selectedButtonFinish, setSelectedButtonFinish] = useState("silver");
  const [selectedLining, setSelectedLining] = useState("satin-black");
  const [distressLevel, setDistressLevel] = useState<"clean" | "subtle" | "heavy">("clean");

  // Garment Studio Model Selection: Hoodie vs Varsity vs Equestrian vs Basketball vs SVG
  const [activeModelType, setActiveModelType] = useState<"hoodie" | "varsity" | "equestrian" | "basketball" | "svg">(() => {
    const s = slug?.toLowerCase() || "";
    if (s.includes("basketball") || s.includes("court")) return "basketball";
    if (s.includes("equestrian") || s.includes("riding") || s.includes("breeches")) return "equestrian";
    if (s.includes("varsity") || s.includes("jacket")) return "varsity";
    if (s.includes("hoodie") || s.includes("sweatshirt")) return "hoodie";
    return "svg";
  });

  useEffect(() => {
    const s = slug?.toLowerCase() || "";
    if (s.includes("basketball") || s.includes("court")) {
      setActiveModelType("basketball");
    } else if (s.includes("equestrian") || s.includes("riding") || s.includes("breeches")) {
      setActiveModelType("equestrian");
    } else if (s.includes("varsity") || s.includes("jacket")) {
      setActiveModelType("varsity");
    } else if (s.includes("hoodie") || s.includes("sweatshirt")) {
      setActiveModelType("hoodie");
    } else {
      setActiveModelType("svg");
    }
  }, [slug]);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasWorkspaceRef = useRef<HTMLDivElement>(null);

  // Canvas interactive drag & resize state for artwork & text layers
  const [activeDraggingArtId, setActiveDraggingArtId] = useState<string | null>(null);
  const [activeResizingArtId, setActiveResizingArtId] = useState<string | null>(null);
  const [activeDraggingTextId, setActiveDraggingTextId] = useState<string | null>(null);
  const draggingArtIdRef = useRef<string | null>(null);
  const resizingArtIdRef = useRef<string | null>(null);
  const draggingTextIdRef = useRef<string | null>(null);
  const canvasDragStartRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, origScale: 1 });
  const textDragStartRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0 });

  // Window listeners for smooth mouse & touch dragging and corner resizing
  useEffect(() => {
    if (!activeDraggingArtId && !activeResizingArtId && !activeDraggingTextId) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const currArtDragId = draggingArtIdRef.current || activeDraggingArtId;
      const currArtResizeId = resizingArtIdRef.current || activeResizingArtId;
      const currTextDragId = draggingTextIdRef.current || activeDraggingTextId;

      if (currArtDragId) {
        if ("cancelable" in e && e.cancelable) e.preventDefault();
        const dx = clientX - canvasDragStartRef.current.startX;
        const dy = clientY - canvasDragStartRef.current.startY;
        const newX = Math.round(canvasDragStartRef.current.origX + dx);
        const newY = Math.round(canvasDragStartRef.current.origY + dy);
        updateArtworkLayer(currArtDragId, { x: newX, y: newY });
      } else if (currArtResizeId) {
        if ("cancelable" in e && e.cancelable) e.preventDefault();
        const delta = (clientX - canvasDragStartRef.current.startX) + (clientY - canvasDragStartRef.current.startY);
        const scaleFactor = delta / 150;
        const newScale = Math.max(0.3, Math.min(2.5, Number((canvasDragStartRef.current.origScale + scaleFactor).toFixed(2))));
        updateArtworkLayer(currArtResizeId, { scale: newScale });
      } else if (currTextDragId) {
        if ("cancelable" in e && e.cancelable) e.preventDefault();
        const dx = clientX - textDragStartRef.current.startX;
        const dy = clientY - textDragStartRef.current.startY;
        const newX = Math.round(textDragStartRef.current.origX + dx);
        const newY = Math.round(textDragStartRef.current.origY + dy);
        updateTextLayer(currTextDragId, { x: newX, y: newY });
      }
    };

    const handlePointerUp = () => {
      draggingArtIdRef.current = null;
      resizingArtIdRef.current = null;
      draggingTextIdRef.current = null;
      setActiveDraggingArtId(null);
      setActiveResizingArtId(null);
      setActiveDraggingTextId(null);
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
  }, [activeDraggingArtId, activeResizingArtId, activeDraggingTextId, updateArtworkLayer, updateTextLayer]);

  // Handle Dragging Artwork Layer on Canvas
  const handleArtMouseDown = (e: React.MouseEvent | React.TouchEvent, art: any) => {
    e.stopPropagation();
    setSelectedLayerId(art.id);
    setActiveTab("artwork");
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    draggingArtIdRef.current = art.id;
    setActiveDraggingArtId(art.id);
    canvasDragStartRef.current = {
      startX: clientX,
      startY: clientY,
      origX: art.x,
      origY: art.y,
      origScale: art.scale,
    };
  };

  // Handle Corner Resizing Artwork Layer on Canvas
  const handleArtResizeMouseDown = (e: React.MouseEvent | React.TouchEvent, art: any) => {
    e.stopPropagation();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    resizingArtIdRef.current = art.id;
    setActiveResizingArtId(art.id);
    canvasDragStartRef.current = {
      startX: clientX,
      startY: clientY,
      origX: art.x,
      origY: art.y,
      origScale: art.scale,
    };
  };

  // Handle Dragging Text Layer on Canvas
  const handleTextMouseDown = (e: React.MouseEvent | React.TouchEvent, txt: any) => {
    e.stopPropagation();
    setSelectedLayerId(txt.id);
    setActiveTab("text");
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    draggingTextIdRef.current = txt.id;
    setActiveDraggingTextId(txt.id);
    textDragStartRef.current = {
      startX: clientX,
      startY: clientY,
      origX: txt.x,
      origY: txt.y,
    };
  };

  // Keyboard shortcut to delete active layer (Delete / Backspace key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedLayerId) {
          deleteSelectedLayer();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLayerId, deleteSelectedLayer]);

  // Initialize Product
  useEffect(() => {
    const found =
      PRODUCTS_DATA.find((p) => p.slug === slug || p.id === slug) ||
      (slug === "custom-hoodie" || slug?.toLowerCase().includes("hoodie")
        ? PRODUCTS_DATA.find((p) => p.slug.includes("hoodie"))
        : null) ||
      (slug === "custom-varsity-jacket" || slug?.toLowerCase().includes("varsity")
        ? PRODUCTS_DATA.find((p) => p.slug.includes("varsity") || (p.category === "streetwear" && p.subcategory === "varsity-jackets"))
        : null) ||
      PRODUCTS_DATA[0];
    if (found) {
      initCustomizer(found);

      // Check if loading saved design
      const savedDesignId = searchParams?.get("designId");
      if (savedDesignId) {
        const saved = getDesign(savedDesignId);
        if (saved) {
          // restored state handled by saved store
        }
      }
    }
  }, [slug, searchParams]);

  // Handle Save Design
  const handleSaveDesign = () => {
    if (!product) return;
    saveDesign({
      id: `des_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      thumbnail: "/images/products/streetwear-hoodie.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      partColors,
      fabricName: fabricId,
      gsm,
      washName: washId,
      decorationMethod: decorationMethodId,
      artworkLayersCount: artworkLayers.length,
      textLayersCount: textLayers.length,
      customizerState: {
        productId: product.id,
        view,
        activeGarmentPart,
        partColors,
        fabricId,
        gsm,
        washId,
        decorationMethodId:
          textLayers.length > 0
            ? "chenille-embroidery"
            : decorationMethodId,
        trims: {
          lining: selectedLining,
          buttonFinish: selectedButtonFinish,
          sleeveStyle,
          pocketStyle,
        },
        construction: {
          silhouette: activeModelType === "varsity" ? "Boxy Vintage Drop-Shoulder" : "Oversized Drop-Shoulder",
          lining: selectedLining,
        },
        artworkLayers,
        textLayers,
        quantity,
        sizeBreakdown,
      },
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Handle Image Upload (Local Object URL simulation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const objectUrl = URL.createObjectURL(file);

    addArtworkLayer({
      name: file.name.slice(0, 16),
      url: objectUrl,
      x: 200,
      y: 220,
      width: 120,
      height: 120,
      scale: 1,
      rotation: 0,
      opacity: 1,
      view: view === "threeD" ? "front" : view,
      isLocked: false,
      isVisible: true,
    });
  };

  const selectedArtwork = artworkLayers.find((a) => a.id === selectedLayerId);
  const selectedText = textLayers.find((t) => t.id === selectedLayerId);
  // Target text layer for real-time styling updates (either explicit selected text or latest text layer)
  const targetTextLayer = selectedText || (textLayers.length > 0 ? textLayers[textLayers.length - 1] : null);

  const activeMonogramColor = targetTextLayer?.color || monogramColor;
  const activeMonogramFont = targetTextLayer
    ? (VARSITY_FONTS.find((f) => f.family === targetTextLayer.font)?.id || monogramFont)
    : monogramFont;
  const activeMonogramText = targetTextLayer ? targetTextLayer.text : monogramText;

  // Handle Monogram Text Change (realtime sync to canvas layer)
  const handleMonogramTextChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9.\-]/g, "").slice(0, 3);
    setMonogramText(clean);
    if (clean.length > 0) {
      if (targetTextLayer) {
        updateTextLayer(targetTextLayer.id, {
          text: clean,
          name: `Monogram: ${clean}`,
        });
        if (selectedLayerId !== targetTextLayer.id) {
          setSelectedLayerId(targetTextLayer.id);
        }
      } else {
        const chosenFont = VARSITY_FONTS.find((f) => f.id === monogramFont) || VARSITY_FONTS[0];
        addTextLayer({
          name: `Monogram: ${clean}`,
          text: clean,
          font: chosenFont.family,
          fontSize: 36,
          fontWeight: "900",
          color: activeMonogramColor,
          letterSpacing: 3,
          lineHeight: 1.1,
          rotation: 0,
          x: 160,
          y: 190,
          view: view === "threeD" ? "front" : view,
          alignment: "center",
          isLocked: false,
          isVisible: true,
          outlineColor: monogramFeltColor,
          shadowColor: "rgba(0,0,0,0.4)",
        });
      }
    } else if (targetTextLayer && targetTextLayer.name?.startsWith("Monogram")) {
      removeTextLayer(targetTextLayer.id);
      setSelectedLayerId(null);
    }
  };

  // Handle Monogram Font Change (realtime sync to canvas layer)
  const handleMonogramFontChange = (fontId: string) => {
    setMonogramFont(fontId);
    const chosenFont = VARSITY_FONTS.find((f) => f.id === fontId);
    if (chosenFont && targetTextLayer) {
      updateTextLayer(targetTextLayer.id, { font: chosenFont.family });
      if (selectedLayerId !== targetTextLayer.id) {
        setSelectedLayerId(targetTextLayer.id);
      }
    }
  };

  // Handle Monogram Color Change (realtime sync to canvas layer)
  const handleMonogramColorChange = (hex: string) => {
    setMonogramColor(hex);
    if (targetTextLayer) {
      updateTextLayer(targetTextLayer.id, { color: hex });
      if (selectedLayerId !== targetTextLayer.id) {
        setSelectedLayerId(targetTextLayer.id);
      }
    }
  };

  // Keep local monogram controls in sync when a text layer is selected
  useEffect(() => {
    if (selectedText) {
      if (selectedText.color) {
        setMonogramColor(selectedText.color);
      }
      if (selectedText.font) {
        const found = VARSITY_FONTS.find((f) => f.family === selectedText.font);
        if (found) {
          setMonogramFont(found.id);
        }
      }
      if (selectedText.text && selectedText.text.length <= 3) {
        setMonogramText(selectedText.text);
      }
    }
  }, [selectedText?.id]);

  // Handle Adding Text Layer
  const handleAddText = () => {
    if (!newTextInput.trim()) return;
    addTextLayer({
      name: `Text: ${newTextInput.slice(0, 10)}`,
      text: newTextInput,
      font: FONT_COLLECTIONS.find((f) => f.id === selectedFont)?.family || "sans-serif",
      fontSize: 22,
      fontWeight: "700",
      color: activeMonogramColor,
      letterSpacing: 2,
      lineHeight: 1.2,
      rotation: 0,
      x: 210,
      y: 200,
      view: view === "threeD" ? "front" : view,
      alignment: "center",
      isLocked: false,
      isVisible: true,
    });
    setNewTextInput("");
  };

  // Handle Adding 3-Letter Monogram Patch Layer
  const handleAddMonogram = () => {
    const textToAdd = (activeMonogramText || "").trim();
    if (!textToAdd) return;
    const chosenFont = VARSITY_FONTS.find((f) => f.id === monogramFont) || VARSITY_FONTS[0];

    // Default to left chest — user can drag freely on canvas after adding
    addTextLayer({
      name: `Monogram: ${textToAdd}`,
      text: textToAdd.toUpperCase().slice(0, 3),
      font: chosenFont.family,
      fontSize: 36,
      fontWeight: "900",
      color: activeMonogramColor,
      letterSpacing: 3,
      lineHeight: 1.1,
      rotation: 0,
      x: 160,
      y: 190,
      view: view === "threeD" ? "front" : view,
      alignment: "center",
      isLocked: false,
      isVisible: true,
      outlineColor: monogramFeltColor,
      shadowColor: "rgba(0,0,0,0.4)",
    });
  };

  // Download Mockup Screenshot simulation
  const handleDownloadMockup = () => {
    alert("High-Resolution PNG Mockup exported successfully! (Saved to downloads)");
  };

  // Add customized item to production bag
  const handleAddCustomToCart = () => {
    if (!product) return;

    const effectiveProduct =
      activeModelType === "varsity" && !product.slug.includes("varsity")
        ? (PRODUCTS_DATA.find((p) => p.slug.includes("varsity") || p.subcategory === "varsity-jackets") || product)
        : activeModelType === "hoodie" && !product.slug.includes("hoodie")
          ? (PRODUCTS_DATA.find((p) => p.slug.includes("hoodie")) || product)
          : product;

    const totalBatchUnits = Object.values(sizeBreakdown).reduce((a, b) => a + b, 0);
    const isBatch = totalBatchUnits > 1 || mode === "wholesale";
    const finalQuantity = isBatch ? (totalBatchUnits > 0 ? totalBatchUnits : quantity) : 1;

    // Calculate unit price according to volume tier pricing or sample pricing
    let finalUnitPrice: number;
    if (activeModelType === "varsity") {
      if (isBatch) {
        if (finalQuantity >= 500) finalUnitPrice = 49.5;
        else if (finalQuantity >= 250) finalUnitPrice = 56.0;
        else if (finalQuantity >= 100) finalUnitPrice = 62.5;
        else finalUnitPrice = 68.0;
      } else {
        finalUnitPrice = effectiveProduct.retailPrice || 210.0;
      }
    } else {
      // Hoodie or other
      if (isBatch) {
        if (finalQuantity >= 500) finalUnitPrice = 16.5;
        else if (finalQuantity >= 250) finalUnitPrice = 19.2;
        else if (finalQuantity >= 100) finalUnitPrice = 21.8;
        else finalUnitPrice = 24.5;
      } else {
        finalUnitPrice = effectiveProduct.retailPrice || 75.0;
      }
    }

    const garmentThumbnail =
      activeModelType === "varsity"
        ? "/varsity_jacket/front/body.png"
        : effectiveProduct.images[0] || "/hoodie/front/body.png";

    addItem({
      id: `custom_cart_${Date.now()}`,
      productId: effectiveProduct.id,
      productSlug: effectiveProduct.slug,
      productName: `${effectiveProduct.name} (Custom Factory Spec)`,
      sku: `${effectiveProduct.sku || "SPEC"}-CUST`,
      image: garmentThumbnail,
      mode: isBatch ? "wholesale" : mode,
      unitPrice: finalUnitPrice,
      quantity: finalQuantity,
      color: {
        id: "cust",
        name: partColors["body"] ? "Customized Palette" : "Atelier Colorway",
        hex: partColors["body"] || "#0A0A0A",
      },
      sizeBreakdown: isBatch && totalBatchUnits > 0 ? sizeBreakdown : undefined,
      size: !isBatch ? "M" : undefined,
      isCustomized: true,
      customDesignId: `cust_spec_${Date.now()}`,
      customSummary: `${activeModelType.toUpperCase()} • ${gsm} GSM • ${washId ? washId.replace(/-/g, " ") : "Raw"} • ${artworkLayers.length} Art / ${textLayers.length} Text`,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D10115] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Canvas Overlays Fragment: Draggable & Resizable Artwork and Text Monograms
  const renderCanvasOverlays = () => (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      {/* Artwork Layers on Canvas (Draggable & Resizable) */}
      {artworkLayers
        .filter((a) => a.isVisible && a.view === view)
        .map((art) => {
          const isSelected = selectedLayerId === art.id;
          const isDraggingThis = activeDraggingArtId === art.id;
          return (
            <div
              key={art.id}
              onMouseDown={(e) => handleArtMouseDown(e, art)}
              onTouchStart={(e) => handleArtMouseDown(e, art)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLayerId(art.id);
                setActiveTab("artwork");
              }}
              style={{
                position: "absolute",
                left: `${art.x}px`,
                top: `${art.y}px`,
                width: `${art.width * art.scale}px`,
                height: `${art.height * art.scale}px`,
                transform: `translate(-50%, -50%) rotate(${art.rotation}deg) ${art.flippedH ? "scaleX(-1)" : ""
                  }`,
                opacity: art.opacity,
                zIndex: 35 + (art.zIndex || 1),
              }}
              className={`transition-shadow select-none pointer-events-auto ${isDraggingThis ? "cursor-grabbing" : "cursor-grab"
                } ${isSelected ? "ring-2 ring-[#D10115] ring-offset-2" : "hover:ring-1 hover:ring-black/40"
                }`}
              title="Click and drag to move artwork • Drag bottom-right corner to resize"
            >
              <img
                src={art.url}
                alt={art.name}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
              {isSelected && (
                <>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0B0B0B] text-white text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] whitespace-nowrap shadow-xs pointer-events-none flex items-center gap-1 z-50">
                    <span>Drag &bull; Pull Corner</span>
                  </div>

                  {/* Corner Resize Grip */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleArtResizeMouseDown(e, art);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleArtResizeMouseDown(e, art);
                    }}
                    className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-[#D10115] rounded-full shadow-md cursor-nwse-resize flex items-center justify-center hover:scale-125 transition-transform z-50 pointer-events-auto"
                    title="Drag outward/inward to resize artwork"
                  >
                    <div className="w-1.5 h-1.5 bg-[#D10115] rounded-full pointer-events-none" />
                  </div>

                  {/* Quick Remove / Delete Button directly on Canvas */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeArtworkLayer(art.id);
                      if (selectedLayerId === art.id) {
                        setSelectedLayerId(null);
                      }
                    }}
                    className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-[#D10115] hover:bg-black text-white rounded-full shadow-md flex items-center justify-center text-xs font-bold z-50 transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                    title="Remove / Delete Logo"
                  >
                    &times;
                  </button>
                </>
              )}
            </div>
          );
        })}

      {/* Text Layers on Canvas */}
      {textLayers
        .filter((t) => t.isVisible && t.view === view)
        .map((txt) => {
          const isSelected = selectedLayerId === txt.id;
          const isDraggingThis = activeDraggingTextId === txt.id;
          return (
            <div
              key={txt.id}
              onMouseDown={(e) => handleTextMouseDown(e, txt)}
              onTouchStart={(e) => handleTextMouseDown(e, txt)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLayerId(txt.id);
                setActiveTab("text");
              }}
              style={{
                position: "absolute",
                left: `${txt.x}px`,
                top: `${txt.y}px`,
                transform: `translate(-50%, -50%) rotate(${txt.rotation}deg)`,
                fontFamily: txt.font,
                fontSize: `${txt.fontSize}px`,
                fontWeight: txt.fontWeight,
                color: txt.color,
                letterSpacing: `${txt.letterSpacing}px`,
                lineHeight: txt.lineHeight,
                textAlign: txt.alignment as any,
                zIndex: 35 + (txt.zIndex || 1),
                opacity: (txt as any).opacity ?? 1,
                touchAction: "none",
                backgroundColor: "rgba(0,0,0,0.001)",
                textShadow:
                  txt.outlineColor && !txt.name?.startsWith("Monogram")
                    ? `1px 1px 0px ${txt.outlineColor}, -1px -1px 0px ${txt.outlineColor}, 1px -1px 0px ${txt.outlineColor}, -1px 1px 0px ${txt.outlineColor}`
                    : undefined,
              }}
              className={`select-none p-1 transition-shadow whitespace-nowrap pointer-events-auto ${isDraggingThis ? "cursor-grabbing" : "cursor-grab"
                } ${isSelected ? "ring-2 ring-[#D10115] ring-offset-2" : "hover:ring-1 hover:ring-black/40"
                }`}
              title="Click and drag to move text"
            >
              {txt.name?.startsWith("Monogram") || (txt.outlineColor && txt.text.length <= 3) ? (
                <svg
                  viewBox="0 0 120 80"
                  className="w-24 h-16 overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] pointer-events-none"
                >
                  <defs>
                    <filter id={`canvasFibers_${txt.id}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.4" />
                    </filter>
                  </defs>
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none pointer-events-none"
                    style={{
                      fontFamily: txt.font,
                      fontSize: `${txt.fontSize ? Math.round(txt.fontSize * 1.1) : 42}px`,
                      letterSpacing: txt.text.length === 1 ? "0px" : "2px",
                    }}
                    fill={txt.outlineColor || "#FFFFFF"}
                    stroke={txt.outlineColor || "#FFFFFF"}
                    strokeWidth={txt.text.length === 1 ? 14 : txt.text.length === 2 ? 11 : 9}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {txt.text.toUpperCase()}
                  </text>
                  <text
                    x="60"
                    y="52"
                    textAnchor="middle"
                    className="font-black uppercase select-none pointer-events-none"
                    style={{
                      fontFamily: txt.font,
                      fontSize: `${txt.fontSize ? Math.round(txt.fontSize * 1.1) : 42}px`,
                      letterSpacing: txt.text.length === 1 ? "0px" : "2px",
                    }}
                    fill={txt.color}
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth={1.2}
                    strokeLinejoin="round"
                    filter={`url(#canvasFibers_${txt.id})`}
                  >
                    {txt.text.toUpperCase()}
                  </text>
                </svg>
              ) : (
                <span>{txt.text}</span>
              )}
              {isSelected && (
                <>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0B0B0B] text-white text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] whitespace-nowrap shadow-xs pointer-events-none flex items-center gap-1 z-50">
                    <span>Drag to move</span>
                  </div>

                  {/* Quick Remove / Delete Button directly on Canvas */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTextLayer(txt.id);
                      if (selectedLayerId === txt.id) {
                        setSelectedLayerId(null);
                      }
                    }}
                    className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-[#D10115] hover:bg-black text-white rounded-full shadow-md flex items-center justify-center text-xs font-bold z-50 transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                    title="Remove / Delete Text"
                  >
                    &times;
                  </button>
                </>
              )}
            </div>
          );
        })}
    </div>
  );

  return (
    <div className="w-full min-h-[calc(100vh-108px)] flex flex-col bg-[#F5F5F2]">
      {/* Top Application Ribbon */}
      <div className="h-12 sm:h-14 bg-white border-b border-[#DADBD2] px-3 sm:px-6 flex items-center justify-between z-20 gap-1.5 sm:gap-2">
        {/* Left: Product Title & Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            href="/catalog"
            className="text-neutral-500 hover:text-black text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-0.5 sm:gap-1 cursor-pointer transition-colors shrink-0"
          >
            <span className="hidden sm:inline">&lt; EXIT STUDIO</span>
            <span className="sm:hidden">&lt; EXIT</span>
          </Link>
          <span className="text-neutral-300">|</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D61C24] shrink-0" />
            <h1 className="text-[11px] sm:text-sm font-bold text-[#0A0A0A] uppercase tracking-tight font-display truncate max-w-[110px] xs:max-w-[180px] sm:max-w-md">
              {activeModelType === "hoodie"
                ? "CUSTOM HEAVYWEIGHT 450 GSM HOODIE"
                : activeModelType === "varsity"
                  ? "CUSTOM HERITAGE WOOL & LEATHER VARSITY JACKET"
                  : activeModelType === "equestrian"
                    ? "CUSTOM EQUESTRIAN PERFORMANCE JACKET"
                    : activeModelType === "basketball"
                      ? "CUSTOM BASKETBALL UNIFORM SET"
                      : product.name.toUpperCase()}
            </h1>
          </div>
          <span className="hidden md:inline-block text-[10px] font-mono bg-[#FAFAF8] border border-[#DADBD2] px-2 py-0.5 rounded-[2px] font-semibold text-neutral-600 shrink-0">
            {gsm} GSM
          </span>
        </div>

        {/* Center: Undo / Redo / Reset History Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-[#FAFAF8] p-0.5 sm:p-1 rounded-[2px] border border-[#DADBD2] shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-1 sm:p-1.5 rounded-[2px] text-neutral-600 disabled:opacity-30 hover:text-black transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-1 sm:p-1.5 rounded-[2px] text-neutral-600 disabled:opacity-30 hover:text-black transition-colors cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <span className="w-px h-3.5 sm:h-4 bg-neutral-300 mx-0.5 sm:mx-1" />
          <button
            onClick={() => {
              if (confirm("Reset garment configuration back to factory default?")) {
                resetToDefaults();
              }
            }}
            className="p-1 sm:p-1.5 rounded-[2px] text-neutral-600 hover:text-[#D61C24] transition-colors cursor-pointer"
            title="Reset All Changes"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Right: Actions (Save Design, Tech Pack, Add Batch to Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleSaveDesign}
            className="p-1.5 sm:py-1.5 sm:px-3 border border-[#D61C24] hover:bg-[#D61C24]/10 text-[#0A0A0A] font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Save Design"
          >
            <Save className="w-3.5 h-3.5 text-[#D61C24]" />
            <span className="hidden md:inline">SAVE DESIGN</span>
          </button>

          <button
            onClick={() => setIsTechPackOpen(true)}
            className="py-1.5 px-3 bg-white hover:bg-neutral-50 border border-[#DADBD2] text-[#0A0A0A] font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] hidden lg:flex items-center gap-1.5 transition-all cursor-pointer"
            title="Generate Factory Spec Sheet / Tech Pack"
          >
            <FileText className="w-3.5 h-3.5 text-[#D61C24]" />
            <span>TECH PACK</span>
          </button>

          <button
            onClick={handleAddCustomToCart}
            className="py-1.5 px-2.5 sm:px-4 bg-[#0A0A0A] hover:bg-[#D61C24] text-white font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1 sm:gap-2 transition-colors cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="hidden sm:inline">ADD BATCH TO CART</span>
            <span className="sm:hidden">ADD TO CART</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: 65% Visual Canvas (Left) + 35% Settings Panel (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* =========================================================================
            LEFT VISUAL CANVAS (Col 1 to 8)
           ========================================================================= */}
        <div
          ref={canvasWorkspaceRef}
          className="lg:col-span-8 flex flex-col justify-between items-center p-3 sm:p-6 relative canvas-grid-pattern bg-[#FAFAF8] overflow-y-auto select-none border-b lg:border-b-0 lg:border-r border-[#E6E6E2]"
        >
          {/* Top View Selector Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs z-10 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white p-0.5 sm:p-1 rounded-[2px] border border-[#DADBD2] shadow-2xs">
                {(["front", "back"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-2.5 sm:px-3 py-1 font-mono font-bold uppercase text-[10px] sm:text-[11px] rounded-[2px] transition-colors cursor-pointer ${view === v ? "bg-[#0A0A0A] text-white" : "text-neutral-600 hover:text-black"
                      }`}
                  >
                    {v === "front" ? "FRONT" : "BACK"}
                  </button>
                ))}
                <button
                  onClick={() => setView(view === "threeD" ? "front" : "threeD")}
                  className={`px-2 sm:px-3 py-1 font-mono font-bold uppercase text-[10px] sm:text-[11px] rounded-[2px] transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer ${view === "threeD" ? "bg-[#0A0A0A] text-white" : "text-neutral-600 hover:text-black"
                    }`}
                  title="Interactive 3D View"
                >
                  <Box className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span>INTERACTIVE</span>
                </button>
              </div>

              {/* Studio Model Switcher: Product / Hoodie / Varsity / Equestrian */}
              <div className="hidden sm:flex items-center gap-1 bg-[#FAFAF8] border border-[#DADBD2] p-1 rounded-[2px]">
                <button
                  onClick={() => {
                    setActiveModelType("hoodie");
                    if (view === "threeD") setView("front");
                    if (!["body", "sleeves", "hood", "pocket", "cuffs", "waistband"].includes(activeGarmentPart)) {
                      setActiveGarmentPart("body");
                    }
                    router.replace("/customize/custom-hoodie");
                  }}
                  className={`px-2.5 py-0.5 font-mono font-bold uppercase text-[10px] rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${activeModelType === "hoodie" && view !== "threeD"
                      ? "bg-[#0A0A0A] text-white shadow-2xs"
                      : "text-neutral-600 hover:text-black"
                    }`}
                  title="Heavyweight Hoodie Studio"
                >
                  <span>Hoodie</span>
                </button>
                <button
                  onClick={() => {
                    setActiveModelType("varsity");
                    if (view === "threeD") setView("front");
                    if (!["body", "sleeves", "pockets", "collar", "cuffs", "waistband", "buttons"].includes(activeGarmentPart)) {
                      setActiveGarmentPart("body");
                    }
                    router.replace("/customize/custom-varsity-jacket");
                  }}
                  className={`px-2.5 py-0.5 font-mono font-bold uppercase text-[10px] rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${activeModelType === "varsity" && view !== "threeD"
                      ? "bg-[#0A0A0A] text-white shadow-2xs"
                      : "text-neutral-600 hover:text-black"
                    }`}
                  title="Varsity Jacket Studio"
                >
                  <span>Varsity</span>
                </button>
                <button
                  onClick={() => {
                    setActiveModelType("equestrian");
                    if (view === "threeD") setView("front");
                    if (!["body", "sleeves", "ribs", "leggings"].includes(activeGarmentPart)) {
                      setActiveGarmentPart("body");
                    }
                    router.replace("/customize/custom-riding-jacket");
                  }}
                  className={`px-2.5 py-0.5 font-mono font-bold uppercase text-[10px] rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${activeModelType === "equestrian" && view !== "threeD"
                      ? "bg-[#0A0A0A] text-white shadow-2xs"
                      : "text-neutral-600 hover:text-black"
                    }`}
                  title="Equestrian Performance Set Studio"
                >
                  <span>Equestrian</span>
                </button>
                <button
                  onClick={() => {
                    setActiveModelType("basketball");
                    if (view === "threeD") setView("front");
                    if (!["jersey", "ribs", "shorts", "body"].includes(activeGarmentPart)) {
                      setActiveGarmentPart("jersey");
                    }
                    router.replace("/customize/custom-basketball-jersey");
                  }}
                  className={`px-2.5 py-0.5 font-mono font-bold uppercase text-[10px] rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 ${activeModelType === "basketball" && view !== "threeD"
                      ? "bg-[#0A0A0A] text-white shadow-2xs"
                      : "text-neutral-600 hover:text-black"
                    }`}
                  title="Basketball Uniform Set Studio"
                >
                  <span>Basketball</span>
                </button>
              </div>
            </div>

            {/* Wholesale Pricing & MOQ Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-[#DADBD2] px-2 sm:px-3 py-1 sm:py-1.5 rounded-[2px] font-mono text-[10.5px] sm:text-xs shadow-2xs shrink-0">
                <span className="text-neutral-400 font-semibold tracking-wider uppercase text-[9px] sm:text-[10px]">
                  WHOLESALE:
                </span>
                <span className="font-bold text-[#0A0A0A]">
                  ${(activeModelType === "basketball" ? 18.5 : activeModelType === "equestrian" ? 72.0 : activeModelType === "varsity" ? 68.0 : activeModelType === "hoodie" ? 24.5 : product.wholesalePrice || 24.5).toFixed(2)}/pc
                </span>
                <span className="font-bold text-[#D61C24] text-[9.5px] sm:text-[10px]">
                  MOQ {activeModelType === "basketball" ? 30 : activeModelType === "equestrian" ? 30 : activeModelType === "varsity" ? 30 : product.MOQ || 50}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsTechPackOpen(true)}
                className="hidden lg:flex px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black bg-white border border-[#DADBD2] hover:border-black rounded-[2px] transition-all items-center gap-1.5 shadow-2xs cursor-pointer hover:bg-neutral-50"
                title="Generate Factory Specification Sheet / Tech Pack"
              >
                <FileText className="w-3.5 h-3.5 text-[#D61C24]" />
                <span>Tech Pack</span>
              </button>
            </div>
          </div>

          {/* Interactive Workspace Area */}
          <div className="w-full flex-1 flex items-center justify-center relative my-4 sm:my-6">
            {activeModelType === "hoodie" ? (
              <HoodieCustomizerViewer
                partColors={partColors}
                activeGarmentPart={activeGarmentPart}
                onSelectPart={setActiveGarmentPart}
                onColorChange={(hex) => {
                  setPartColor(activeGarmentPart || "body", hex);
                }}
                view={view}
                className="w-full"
              >
                {renderCanvasOverlays()}
              </HoodieCustomizerViewer>
            ) : activeModelType === "equestrian" ? (
              <EquestrianCustomizerViewer
                partColors={partColors}
                activeGarmentPart={activeGarmentPart}
                onSelectPart={setActiveGarmentPart}
                onColorChange={(hex) => {
                  setPartColor(activeGarmentPart || "body", hex);
                }}
                view={view}
                className="w-full"
              >
                {renderCanvasOverlays()}
              </EquestrianCustomizerViewer>
            ) : activeModelType === "basketball" ? (
              <BasketballCustomizerViewer
                partColors={partColors}
                activeGarmentPart={activeGarmentPart}
                onSelectPart={setActiveGarmentPart}
                onColorChange={(hex) => {
                  setPartColor(activeGarmentPart || "jersey", hex);
                }}
                view={view}
                className="w-full"
              >
                {renderCanvasOverlays()}
              </BasketballCustomizerViewer>
            ) : activeModelType === "varsity" ? (
              <VarsityJacketCanvas
                partColors={partColors as any}
                activePart={activeGarmentPart}
                onSelectPart={(p) => {
                  setActiveGarmentPart(p);
                  if (p === "letters") setActiveTab("text");
                  else if (p === "logo") setActiveTab("artwork");
                  else setActiveTab("colors");
                }}
                sleeveStyle={sleeveStyle}
                pocketStyle={pocketStyle}
                activeView={view === "back" ? "back" : "front"}
                onSwitchToFront={() => setView("front")}
                washFinish={
                  washId === "vintage-wash"
                    ? "Vintage Mineral Acid Wash"
                    : washId === "stone-wash"
                      ? "Heavy Stone Wash"
                      : washId === "sun-faded"
                        ? "Sun-Faded Solar Distress"
                        : "Clean Raw Mill Finish"
                }
                customLetters={{
                  enabled: false,
                  text: "",
                  fontId: activeMonogramFont,
                  color: activeMonogramColor,
                  borderColor: monogramFeltColor === "tonal" ? (partColors.body || "#0B0B0B") : monogramFeltColor,
                  craftStyle: monogramCraftStyle as any,
                  x: 30,
                  y: 30,
                }}
                buttonFinishHex={partColors.buttons}
                distressLevel={distressLevel}
                className="w-full"
              >
                {renderCanvasOverlays()}
              </VarsityJacketCanvas>
            ) : (
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                <GarmentSvg
                  type={product.slug.includes("hoodie") ? "hoodie" : product.slug.includes("dress") ? "dress" : product.slug.includes("blazer") ? "blazer" : "tshirt"}
                  partColors={partColors}
                  view={view}
                  className="w-full h-full drop-shadow-2xl"
                />
                {renderCanvasOverlays()}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT CONFIGURATION PANEL (Col 9 to 12)
           ========================================================================= */}
        <div className="lg:col-span-4 bg-white flex flex-col justify-between h-full border-t lg:border-t-0 border-[#E6E6E2] overflow-y-auto">
          {/* Tabs Navigation (01 COLORS, 02 ARTWORK, 03 TEXT, 04 SIZING) */}
          <div>
            <div className="flex items-center border-b border-[#DADBD2] overflow-x-auto scrollbar-none bg-[#FAFAF8]">
              {[
                { id: "colors" as const, label: "01 COLORS", icon: Palette },
                { id: "artwork" as const, label: "02 ARTWORK", icon: ImageIcon },
                { id: "text" as const, label: "03 TEXT", icon: Type },
                { id: "sizing" as const, label: "04 SIZING", icon: ShoppingBag },
              ].map((t) => {
                const Icon = t.icon;
                const isCurrent = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 text-[10.5px] sm:text-[11px] font-mono uppercase font-bold tracking-wider shrink-0 flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${isCurrent
                        ? "border-[#D61C24] bg-white text-[#D61C24]"
                        : "border-transparent text-neutral-500 hover:text-black hover:bg-neutral-100"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents Container */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* TAB 1: GARMENT PART COLORS */}
              {activeTab === "colors" && (
                <div className="space-y-6">
                  {/* Base Silhouette Switcher */}
                  <div className="pb-3 border-b border-[#DADBD2]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]">
                        BASE SILHOUETTE:
                      </label>
                      <span className="text-[10px] font-mono font-bold text-[#D61C24]">
                        {activeModelType === "varsity" ? "Outerwear Tier" : "Heavy Fleece Tier"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setActiveModelType("hoodie");
                          setActiveGarmentPart("body");
                          router.replace("/customize/custom-hoodie");
                        }}
                        className={`p-2.5 text-left rounded-[2px] border font-mono cursor-pointer transition-all ${activeModelType === "hoodie"
                            ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                            : "bg-[#FAFAF8] text-neutral-800 border-[#DADBD2] hover:bg-neutral-100"
                          }`}
                      >
                        <div className="text-[11px] font-bold uppercase truncate">450 GSM HOODIE</div>
                        <div className="text-[9.5px] text-neutral-400 mt-0.5">$24.50/pc &bull; MOQ 50</div>
                      </button>
                      <button
                        onClick={() => {
                          setActiveModelType("varsity");
                          setActiveGarmentPart("body");
                          router.replace("/customize/custom-varsity-jacket");
                        }}
                        className={`p-2.5 text-left rounded-[2px] border font-mono cursor-pointer transition-all ${activeModelType === "varsity"
                            ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                            : "bg-[#FAFAF8] text-neutral-800 border-[#DADBD2] hover:bg-neutral-100"
                          }`}
                      >
                        <div className="text-[11px] font-bold uppercase truncate">VARSITY JACKET</div>
                        <div className="text-[9.5px] text-neutral-400 mt-0.5">$68.00/pc &bull; MOQ 30</div>
                      </button>
                    </div>
                  </div>

                  {/* Garment Parts Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]">
                        SELECT GARMENT PART TO RECOLOR:
                      </label>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {activeModelType === "hoodie"
                          ? "450 GSM French Terry"
                          : activeModelType === "varsity"
                            ? "Wool Melton & Leather"
                            : `${product.GSM || 300} GSM Knit`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(activeModelType === "varsity"
                        ? [
                          { id: "body", label: "WOOL MELTON TORSO", defaultColor: "#0A0A0A" },
                          { id: "sleeves", label: "LEATHER SLEEVES", defaultColor: "#F4F4EF" },
                          { id: "pockets", label: "WELT POCKETS", defaultColor: "#D61C24" },
                          { id: "collar", label: "STRIPED RIB COLLAR", defaultColor: "#20201E" },
                          { id: "cuffs", label: "STRIPED RIB CUFFS", defaultColor: "#20201E" },
                          { id: "waistband", label: "BOTTOM RIB WAISTBAND", defaultColor: "#20201E" },
                          { id: "buttons", label: "SNAP BUTTONS", defaultColor: "#FFFFFF" },
                        ]
                        : activeModelType === "equestrian"
                          ? [
                            { id: "body", label: "TORSO & MAIN SHELL", defaultColor: "#111B2C" },
                            { id: "sleeves", label: "ARTICULATED SLEEVES", defaultColor: "#0A0A0A" },
                            { id: "ribs", label: "COLLAR & RIB TRIMS", defaultColor: "#D61C24" },
                            { id: "leggings", label: "SILICONE GRIP BREECHES", defaultColor: "#20201E" },
                          ]
                          : activeModelType === "basketball"
                            ? [
                              { id: "jersey", label: "PRO AIR-MESH JERSEY", defaultColor: "#CA8A04" },
                              { id: "ribs", label: "NECK & ARMHOLE RIBS", defaultColor: "#111B2C" },
                              { id: "shorts", label: "PRO GAME SHORTS", defaultColor: "#CA8A04" },
                            ]
                            : [
                              { id: "body", label: "TORSO & MAIN BODY", defaultColor: "#0A0A0A" },
                              { id: "hood", label: "DOUBLE-LINED HOOD", defaultColor: "#0A0A0A" },
                              { id: "sleeves", label: "DROP SLEEVES", defaultColor: "#20201E" },
                              { id: "pocket", label: "KANGAROO POCKET", defaultColor: "#D61C24" },
                              { id: "cuffs", label: "HEAVY 2X2 RIB CUFFS", defaultColor: "#0A0A0A" },
                              { id: "waistband", label: "RIBBED WAISTBAND", defaultColor: "#0A0A0A" },
                            ]
                      ).map((part) => (
                        <button
                          key={part.id}
                          onClick={() => setActiveGarmentPart(part.id)}
                          className={`p-2.5 text-xs text-left font-mono font-bold uppercase rounded-[2px] border transition-all flex items-center justify-between cursor-pointer ${activeGarmentPart === part.id
                              ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                              : "bg-[#FAFAF8] text-neutral-800 border-[#DADBD2] hover:bg-neutral-100 hover:border-black"
                            }`}
                        >
                          <span className="truncate pr-1 text-[11px] tracking-wide">{part.label}</span>
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: partColors[part.id] || part.defaultColor }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Swatches Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]">
                        PALETTE SWATCHES:
                      </label>
                      <span className="text-[11px] font-mono font-bold uppercase text-[#D61C24]">
                        {activeGarmentPart === "body"
                          ? "BODY"
                          : activeGarmentPart === "hood"
                            ? "HOOD"
                            : activeGarmentPart === "sleeves"
                              ? "SLEEVES"
                              : activeGarmentPart === "pocket"
                                ? "POCKET"
                                : activeGarmentPart === "cuffs"
                                  ? "CUFFS"
                                  : activeGarmentPart === "waistband"
                                    ? "WAISTBAND"
                                    : activeGarmentPart.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { id: "black", name: "Stealth Black", hex: "#0A0A0A" },
                        { id: "charcoal", name: "Charcoal Slate", hex: "#20201E" },
                        { id: "white", name: "Optic White", hex: "#FFFFFF" },
                        { id: "bone", name: "Bone Ecru", hex: "#F4F4EF" },
                        { id: "crimson", name: "Racing Crimson", hex: "#D61C24" },
                        { id: "burgundy", name: "Deep Burgundy", hex: "#8B0000" },
                        { id: "coral", name: "Neon Coral Red", hex: "#FF333D" },
                        { id: "navy", name: "Midnight Navy", hex: "#111B2C" },
                        { id: "maroon", name: "Maroon Oxblood", hex: "#4A0E17" },
                        { id: "royal", name: "Championship Royal", hex: "#1C4ED8" },
                        { id: "gold", name: "Athletic Gold", hex: "#CA8A04" },
                        { id: "orange", name: "Safety Orange", hex: "#EA580C" },
                        { id: "tan", name: "Sand Dune", hex: "#C7B89F" },
                        { id: "olive", name: "Military Olive", hex: "#3E4E36" },
                        { id: "pine", name: "Forest Pine", hex: "#1E3A2F" },
                      ].map((swatch) => {
                        const isSelected =
                          partColors[activeGarmentPart]?.toLowerCase() === swatch.hex.toLowerCase();
                        return (
                          <button
                            key={swatch.id}
                            onClick={() => setPartColor(activeGarmentPart, swatch.hex)}
                            className={`relative aspect-square rounded-[2px] border transition-transform hover:scale-105 flex items-center justify-center cursor-pointer ${isSelected
                                ? "border-2 border-[#D61C24] ring-2 ring-[#D61C24] scale-105 shadow-xs"
                                : "border-[#DADBD2] hover:border-black"
                              }`}
                            style={{ backgroundColor: swatch.hex }}
                            title={`${swatch.name} (${swatch.hex})`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs">
                      <button
                        onClick={() => setAllPartColors(partColors[activeGarmentPart] || "#0A0A0A")}
                        className="text-[#D61C24] font-semibold hover:underline text-[11px] cursor-pointer"
                      >
                        Apply this color to all garment panels &rarr;
                      </button>
                      <span className="font-mono text-[11px] text-neutral-500">
                        {partColors[activeGarmentPart] || "#0A0A0A"}
                      </span>
                    </div>
                  </div>

                  {/* Custom Hex Picker Input */}
                  <div className="pt-2 border-t border-[#E6E6E2]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                      Custom HEX / Pantone Color Code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={partColors[activeGarmentPart] || "#222224"}
                        onChange={(e) => setPartColor(activeGarmentPart, e.target.value)}
                        className="w-9 h-9 p-0.5 rounded-[2px] border border-[#E6E6E2] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={partColors[activeGarmentPart] || "#222224"}
                        onChange={(e) => setPartColor(activeGarmentPart, e.target.value)}
                        className="w-full px-3 py-1 text-xs font-mono border border-[#E6E6E2] rounded-[2px]"
                      />
                    </div>
                  </div>

                  {/* Snap Button Hardware Finishes (When in Varsity Mode or Buttons selected) */}
                  {(activeModelType === "varsity" || activeGarmentPart === "buttons") && (
                    <div className="pt-2 border-t border-[#E6E6E2]">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                          Snap Button Hardware Finishes:
                        </label>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase">Heavy Metal Plating</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {BUTTON_FINISHES.map((btn) => {
                          const isBtnSelected =
                            (partColors.buttons || "").toLowerCase() === btn.hex.toLowerCase() ||
                            selectedButtonFinish === btn.id;
                          return (
                            <button
                              key={btn.id}
                              onClick={() => {
                                setSelectedButtonFinish(btn.id);
                                setPartColor("buttons", btn.hex);
                              }}
                              className={`p-2 rounded-[2px] border text-left transition-all cursor-pointer flex items-center gap-2 ${isBtnSelected
                                  ? "bg-black text-white border-black shadow-xs"
                                  : "bg-[#FAFAF8] text-neutral-800 border-[#E6E6E2] hover:bg-neutral-100"
                                }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: btn.hex }}
                              />
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold block truncate">{btn.name}</span>
                                <span className={`text-[8.5px] block truncate font-mono ${isBtnSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                                  {btn.description}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Heritage Colorway Presets */}
                  <div className="pt-2 border-t border-[#E6E6E2]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        Heritage Colorway Presets:
                      </label>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">1-Click Atelier Archetypes</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeModelType === "hoodie"
                        ? HOODIE_COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => setAllPartColors(preset.colors)}
                            className="flex items-center gap-2.5 p-2 rounded-[2px] border border-[#E6E6E2] hover:border-black/60 text-left transition-all bg-white group hover:shadow-xs cursor-pointer"
                          >
                            {/* 4-Part Segmented Swatch: Body • Pocket • Cap • Sleeves */}
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
                        : activeModelType === "equestrian"
                          ? EQUESTRIAN_COLOR_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => setAllPartColors(preset.colors)}
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
                                  title={`Ribs & Collar: ${preset.colors.ribs}`}
                                />
                                <span
                                  className="w-2.5 h-6 rounded-r-[2px] border border-black/15"
                                  style={{ backgroundColor: preset.colors.leggings }}
                                  title={`Leggings / Breeches: ${preset.colors.leggings}`}
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
                          : activeModelType === "basketball"
                            ? BASKETBALL_COLOR_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => setAllPartColors(preset.colors)}
                                className="flex items-center gap-2.5 p-2 rounded-[2px] border border-[#E6E6E2] hover:border-black/60 text-left transition-all bg-white group hover:shadow-xs cursor-pointer"
                              >
                                {/* 3-Part Segmented Swatch: Jersey • Ribs • Shorts */}
                                <div className="flex gap-0.5 shrink-0" title="Jersey • Ribs • Shorts">
                                  <span
                                    className="w-3.5 h-6 rounded-l-[2px] border border-black/15"
                                    style={{ backgroundColor: preset.colors.jersey || preset.colors.body }}
                                    title={`Jersey: ${preset.colors.jersey || preset.colors.body}`}
                                  />
                                  <span
                                    className="w-2.5 h-6 border-y border-black/15"
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
                            : COLOR_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => setAllPartColors(preset.colors)}
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
                            ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ARTWORK UPLOAD & CONTROLS */}
              {activeTab === "artwork" && (
                <div className="space-y-6">
                  {/* File Upload Trigger */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed border-[#E6E6E2] hover:border-black rounded-[2px] bg-[#FAFAF8] hover:bg-neutral-50 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-white border border-[#E6E6E2] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                        <UploadCloud className="w-5 h-5 text-neutral-700" />
                      </div>
                      <span className="text-xs font-bold text-black uppercase tracking-wide">
                        Upload Brand Graphic or Logo
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Accepts PNG, SVG, JPG, WebP &bull; Drag &amp; resize live on canvas
                      </span>
                    </button>
                  </div>

                  {/* Ready-to-Use Sample Brand Logos & Emblems */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        Sample Brand Logos &amp; Emblems:
                      </label>
                      <span className="text-[9px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-[2px] font-semibold">
                        1-Click Test
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_LOGOS.map((sample) => (
                        <button
                          key={sample.id}
                          onClick={() => {
                            addArtworkLayer({
                              name: sample.name,
                              url: sample.url,
                              x: 210,
                              y: 200,
                              width: 120,
                              height: 120,
                              scale: 0.85,
                              rotation: 0,
                              opacity: 1,
                              view: view === "threeD" ? "front" : view,
                              isLocked: false,
                              isVisible: true,
                            });
                          }}
                          className="p-2 border border-[#E6E6E2] hover:border-black rounded-[2px] bg-[#FAFAF8] hover:bg-white flex items-center gap-2.5 text-left transition-all cursor-pointer group hover:shadow-xs"
                        >
                          <div className="w-8 h-8 bg-white border border-[#E6E6E2] rounded-[2px] p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                            <img src={sample.url} alt={sample.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-black block truncate group-hover:text-[#D10115] transition-colors">
                              {sample.name}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400 uppercase block">
                              {sample.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* If a layer is selected, show scale, rotation, and opacity */}
                  {selectedArtwork && (
                    <div className="p-4 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] space-y-4">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E6E6E2]">
                        <span className="font-bold uppercase tracking-wide">{selectedArtwork.name}</span>
                        <button
                          onClick={() => removeArtworkLayer(selectedArtwork.id)}
                          className="text-red-600 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      {/* Scale */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-neutral-700 uppercase flex items-center gap-1">
                            <Maximize2 className="w-3 h-3 text-[#D10115]" />
                            Logo Scale:
                          </span>
                          <span className="font-bold text-black">
                            {Math.round(selectedArtwork.scale * 100)}% ({selectedArtwork.scale.toFixed(2)}x)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateArtworkLayer(selectedArtwork.id, {
                                scale: Math.max(0.3, Number((selectedArtwork.scale - 0.1).toFixed(2))),
                              })
                            }
                            className="p-1.5 bg-white border border-[#E6E6E2] hover:bg-neutral-100 rounded-[2px] text-neutral-700 cursor-pointer"
                            title="Decrease Size"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="range"
                            min="0.3"
                            max="2.5"
                            step="0.05"
                            value={selectedArtwork.scale}
                            onChange={(e) =>
                              updateArtworkLayer(selectedArtwork.id, { scale: Number(e.target.value) })
                            }
                            className="flex-1 accent-[#D10115] cursor-pointer"
                          />
                          <button
                            onClick={() =>
                              updateArtworkLayer(selectedArtwork.id, {
                                scale: Math.min(2.5, Number((selectedArtwork.scale + 0.1).toFixed(2))),
                              })
                            }
                            className="p-1.5 bg-white border border-[#E6E6E2] hover:bg-neutral-100 rounded-[2px] text-neutral-700 cursor-pointer"
                            title="Increase Size"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Rotation */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span className="font-bold text-neutral-700 uppercase flex items-center gap-1">
                            <RotateCcw className="w-3 h-3 text-neutral-500" />
                            Rotation:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black">{selectedArtwork.rotation}°</span>
                            {selectedArtwork.rotation !== 0 && (
                              <button
                                onClick={() => updateArtworkLayer(selectedArtwork.id, { rotation: 0 })}
                                className="text-[10px] text-[#D10115] hover:underline cursor-pointer"
                              >
                                Reset 0°
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          step="5"
                          value={selectedArtwork.rotation}
                          onChange={(e) =>
                            updateArtworkLayer(selectedArtwork.id, { rotation: Number(e.target.value) })
                          }
                          className="w-full accent-[#0B0B0B] cursor-pointer"
                        />
                      </div>

                      {/* Position Alignment Buttons */}
                      <div>
                        <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5">
                          Snap to Garment Position:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          <button
                            onClick={() =>
                              updateArtworkLayer(selectedArtwork.id, { x: 160, y: 190 })
                            }
                            className="py-1 px-1.5 text-[10px] uppercase font-bold border border-[#E6E6E2] bg-white hover:border-black rounded-[2px] text-center transition-colors cursor-pointer truncate"
                          >
                            Right Chest
                          </button>
                          <button
                            onClick={() =>
                              updateArtworkLayer(selectedArtwork.id, { x: 210, y: 220 })
                            }
                            className="py-1 px-1.5 text-[10px] uppercase font-bold border border-[#E6E6E2] bg-white hover:border-black rounded-[2px] text-center transition-colors cursor-pointer truncate"
                          >
                            Center Torso
                          </button>
                          <button
                            onClick={() =>
                              updateArtworkLayer(selectedArtwork.id, { x: 260, y: 190 })
                            }
                            className="py-1 px-1.5 text-[10px] uppercase font-bold border border-[#E6E6E2] bg-white hover:border-black rounded-[2px] text-center transition-colors cursor-pointer truncate"
                          >
                            Left Chest
                          </button>
                          <button
                            onClick={() =>
                              updateArtworkLayer(selectedArtwork.id, { x: 160, y: 270 })
                            }
                            className="py-1 px-1.5 text-[10px] uppercase font-bold border border-[#E6E6E2] bg-white hover:border-black rounded-[2px] text-center transition-colors cursor-pointer truncate"
                          >
                            Lower Pocket
                          </button>
                        </div>
                      </div>

                      {/* Prominent Remove / Delete Logo Button */}
                      <button
                        onClick={() => removeArtworkLayer(selectedArtwork.id)}
                        className="w-full mt-2 py-2.5 px-3 bg-red-50 hover:bg-red-100 text-[#D10115] border border-red-200 hover:border-red-300 rounded-[2px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        title="Remove / Delete Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove Logo / Delete Graphic</span>
                      </button>
                    </div>
                  )}

                  {/* AI Background Removal Simulation */}
                  {selectedArtwork && (
                    <button
                      onClick={() => alert("Simulated AI Background Removal applied successfully!")}
                      className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Remove Background with AI</span>
                    </button>
                  )}
                </div>
              )}

              {/* TAB 3: TEXT & MONOGRAM TOOL */}
              {activeTab === "text" && (
                <div className="space-y-6">
                  {/* Mode Selector */}
                  <div className="flex border border-[#E6E6E2] rounded-[2px] p-0.5 bg-[#FAFAF8]">
                    <button
                      onClick={() => setTextToolMode("monogram")}
                      className={`flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-[2px] transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${textToolMode === "monogram"
                          ? "bg-black text-white shadow-xs"
                          : "text-neutral-600 hover:text-black"
                        }`}
                    >
                      <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D10115] shrink-0" />
                      <span className="truncate">
                        <span className="hidden sm:inline">3-Letter </span>Monogram <span className="hidden xs:inline sm:inline">(Max 3)</span>
                      </span>
                    </button>
                    <button
                      onClick={() => setTextToolMode("standard")}
                      className={`flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-[2px] transition-all ${textToolMode === "standard"
                          ? "bg-black text-white shadow-xs"
                          : "text-neutral-600 hover:text-black"
                        }`}
                    >
                      <span className="truncate">
                        <span className="hidden sm:inline">Standard </span>Slogan
                      </span>
                    </button>
                  </div>

                  {/* SUBMODE 1: 3-LETTER MONOGRAM TOOL */}
                  {textToolMode === "monogram" && (
                    <div className="space-y-4 sm:space-y-5 animate-fadeIn">
                      <div className="p-3 sm:p-4 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] space-y-2.5 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            Custom Letterman Monogram:
                          </label>
                          <span className="text-[8.5px] sm:text-[9px] font-mono bg-black text-white px-1.5 py-0.5 rounded-[2px]">
                            MAX 3 LETTERS &bull; UPPERCASE
                          </span>
                        </div>

                        <div className="flex gap-1.5 sm:gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={activeMonogramText}
                              onChange={(e) => handleMonogramTextChange(e.target.value)}
                              maxLength={3}
                              placeholder="e.g. TI"
                              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-neutral-300 focus:border-black rounded-[2px] text-base sm:text-lg font-bold tracking-widest uppercase text-center outline-hidden"
                            />
                            <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-mono font-bold text-neutral-400">
                              {activeMonogramText.length} / 3
                            </span>
                          </div>
                          <button
                            onClick={handleAddMonogram}
                            className="btn-primary text-[10.5px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-5 font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap"
                          >
                            Add Patch
                          </button>
                        </div>

                        {/* Quick Initials */}
                        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase shrink-0">
                            Presets:
                          </span>
                          {QUICK_MONOGRAM_PRESETS.map((pst) => (
                            <button
                              key={pst}
                              onClick={() => handleMonogramTextChange(pst)}
                              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-[2px] border cursor-pointer ${activeMonogramText === pst
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-neutral-700 border-[#E6E6E2] hover:border-black"
                                }`}
                            >
                              {pst}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Monogram Font Style Selection */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                          Letter Font Style:
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          {VARSITY_FONTS.map((font) => {
                            const isFontSelected = activeMonogramFont === font.id;
                            return (
                              <button
                                key={font.id}
                                onClick={() => handleMonogramFontChange(font.id)}
                                className={`p-1.5 sm:p-2.5 rounded-[2px] border text-left transition-all cursor-pointer ${isFontSelected
                                    ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                                    : "bg-[#FAFAF8] text-neutral-800 border-[#E6E6E2] hover:bg-neutral-100"
                                  }`}
                              >
                                <div className="flex items-baseline justify-between mb-0.5 sm:mb-1">
                                  <span
                                    className="text-sm sm:text-lg font-bold"
                                    style={{ fontFamily: font.family }}
                                  >
                                    {activeMonogramText || font.preview}
                                  </span>
                                  <span className="text-[7.5px] sm:text-[9px] opacity-60 uppercase font-mono">
                                    {font.category}
                                  </span>
                                </div>
                                <span className="text-[9px] sm:text-[10px] block truncate opacity-75">
                                  {font.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Monogram Color Shades */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                            Letter Colour (Curated Shades):
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                              style={{ backgroundColor: activeMonogramColor }}
                            />
                            <span className="text-[10px] font-mono font-bold text-black uppercase">
                              {activeMonogramColor}
                            </span>
                          </div>
                        </div>

                        {/* Tone filters */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-1">
                          {[
                            { id: "all", label: "All" },
                            { id: "light", label: "Light" },
                            { id: "vibrant", label: "Vibrant" },
                            { id: "deep", label: "Deep" },
                            { id: "dark", label: "Dark" },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setMonogramShadeFilter(t.id as any)}
                              className={`px-2 py-0.5 text-[9px] font-semibold uppercase rounded-[2px] border cursor-pointer ${monogramShadeFilter === t.id
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-neutral-600 border-[#E6E6E2]"
                                }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        <div className="p-3 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] space-y-2.5 max-h-56 overflow-y-auto">
                          {LETTER_SHADE_FAMILIES.map((family) => {
                            const filtered = family.shades.filter((s) =>
                              monogramShadeFilter === "all" ? true : s.tone === monogramShadeFilter
                            );
                            if (filtered.length === 0) return null;
                            return (
                              <div key={family.familyCode} className="space-y-1">
                                <span className="text-[9px] font-mono uppercase text-neutral-500 block">
                                  {family.familyName}
                                </span>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {filtered.map((shade) => (
                                    <button
                                      key={shade.id}
                                      onClick={() => handleMonogramColorChange(shade.hex)}
                                      className={`flex items-center gap-1.5 p-1 rounded-[2px] border transition-all text-left bg-white cursor-pointer ${activeMonogramColor.toLowerCase() === shade.hex.toLowerCase()
                                          ? "border-black ring-2 ring-black font-semibold shadow-xs"
                                          : "border-[#E6E6E2] hover:border-black/30"
                                        }`}
                                      title={`${shade.name} (${shade.hex})`}
                                    >
                                      <span
                                        className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                                        style={{ backgroundColor: shade.hex }}
                                      />
                                      <span className="text-[8px] font-medium truncate">
                                        {shade.name}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Custom Hex Color Picker */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#E6E6E2]">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">
                            Custom Letter Hex:
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeMonogramColor}
                              onChange={(e) => handleMonogramColorChange(e.target.value)}
                              className="w-7 h-7 rounded-[2px] border border-[#E6E6E2] cursor-pointer"
                              title="Pick custom hex color"
                            />
                            <span className="text-[10px] font-mono font-bold uppercase text-black">
                              {activeMonogramColor}
                            </span>
                          </div>
                        </div>

                        {/* Felt Backing Shade */}
                        <div className="pt-2 border-t border-[#E6E6E2]">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1.5">
                            Felt Backing Shade:
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            {FELT_BORDER_SHADES.map((fb) => {
                              const isFeltSelected = monogramFeltColor === fb.hex;
                              return (
                                <button
                                  key={fb.id}
                                  onClick={() => {
                                    setMonogramFeltColor(fb.hex);
                                    if (targetTextLayer) {
                                      const borderHex = fb.hex === "tonal" ? (partColors.body || "#0B0B0B") : fb.hex;
                                      updateTextLayer(targetTextLayer.id, { outlineColor: borderHex });
                                    }
                                  }}
                                  className={`p-1.5 text-[9px] font-semibold rounded-[2px] border text-center transition-colors truncate cursor-pointer ${isFeltSelected
                                      ? "bg-black text-white border-black font-bold shadow-xs"
                                      : "bg-white text-neutral-700 border-[#E6E6E2] hover:bg-neutral-50"
                                    }`}
                                >
                                  {fb.name.replace(" Felt", "")}
                                </button>
                              );
                            })}
                          </div>
                        </div>



                      </div>
                    </div>
                  )}

                  {/* SUBMODE 2: STANDARD SLOGAN TYPOGRAPHY */}
                  {textToolMode === "standard" && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Add New Text */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                          Add Typography Layer:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTextInput}
                            onChange={(e) => setNewTextInput(e.target.value)}
                            placeholder="Type slogan or brand name..."
                            className="flex-1 px-3 py-2 text-xs border border-[#E6E6E2] rounded-[2px] outline-hidden focus:border-black"
                          />
                          <button onClick={handleAddText} className="btn-primary text-xs py-2 px-4">
                            Add Text
                          </button>
                        </div>
                      </div>

                      {/* Font Family Selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                          Curated Typography Families:
                        </label>
                        <div className="space-y-1">
                          {FONT_COLLECTIONS.map((font) => (
                            <button
                              key={font.id}
                              onClick={() => {
                                setSelectedFont(font.id);
                                if (targetTextLayer) {
                                  updateTextLayer(targetTextLayer.id, { font: font.family });
                                }
                              }}
                              className={`w-full p-2.5 text-left text-xs rounded-[2px] border transition-colors flex items-center justify-between cursor-pointer ${(targetTextLayer ? targetTextLayer.font === font.family : selectedFont === font.id)
                                  ? "bg-[#0B0B0B] text-white border-[#0B0B0B]"
                                  : "bg-[#FAFAF8] text-neutral-800 border-[#E6E6E2] hover:bg-neutral-100"
                                }`}
                            >
                              <span style={{ fontFamily: font.family }}>{font.name}</span>
                              <span className="text-[10px] opacity-60 uppercase">{font.category}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected Text Controls */}
                  {selectedText && (
                    <div className="p-4 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px] space-y-4">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E6E6E2]">
                        <span className="font-bold">Active: &ldquo;{selectedText.text}&rdquo;</span>
                        <button
                          onClick={() => removeTextLayer(selectedText.id)}
                          className="text-red-600 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      {/* Font Size */}
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span>Font Size:</span>
                          <span>{selectedText.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="64"
                          value={selectedText.fontSize}
                          onChange={(e) =>
                            updateTextLayer(selectedText.id, { fontSize: Number(e.target.value) })
                          }
                          className="w-full accent-[#D10115]"
                        />
                      </div>

                      {/* Text Color */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Text Color:</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedText.color}
                            onChange={(e) => handleMonogramColorChange(e.target.value)}
                            className="w-8 h-8 rounded-[2px] border border-[#E6E6E2] cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold uppercase">
                            {selectedText.color}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FABRIC, GSM & WASH SPECS */}
              {activeTab === "specs" && (
                <div className="space-y-6">
                  {/* GSM Selection */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                      Fabric Density (GSM Weight):
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[280, 350, 400, 450, 500].map((weight) => (
                        <button
                          key={weight}
                          onClick={() => setFabric(fabricId, weight)}
                          className={`py-2 text-xs font-mono font-bold rounded-[2px] border cursor-pointer ${gsm === weight
                              ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-xs"
                              : "bg-[#FAFAF8] text-neutral-700 border-[#E6E6E2] hover:bg-neutral-100"
                            }`}
                        >
                          {weight} GSM
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wash Selection */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                      Garment Wash Treatment:
                    </label>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { id: "clean-raw", name: "Clean Raw Mill Finish" },
                        { id: "vintage-wash", name: "Vintage Mineral Acid Wash" },
                        { id: "stone-wash", name: "Heavy Pumice Stone Wash" },
                        { id: "enzyme-bio-wash", name: "Enzyme Bio-Polish" },
                        { id: "sun-faded", name: "Sun-Faded Solar Distress" },
                      ].map((w) => (
                        <button
                          key={w.id}
                          onClick={() => setWash(w.id)}
                          className={`w-full p-2.5 text-left rounded-[2px] border flex items-center justify-between cursor-pointer ${washId === w.id
                              ? "bg-[#0B0B0B] text-white font-semibold shadow-xs"
                              : "bg-[#FAFAF8] text-neutral-700 border-[#E6E6E2] hover:bg-neutral-100"
                            }`}
                        >
                          <span>{w.name}</span>
                          {washId === w.id && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Distress & Abrasion Intensity */}
                  <div className="pt-2 border-t border-[#E6E6E2]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                      Hand-Abrasion &amp; Distress Level:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {[
                        { id: "clean", label: "Pristine Raw (0%)" },
                        { id: "subtle", label: "Seam Fade (15%)" },
                        { id: "heavy", label: "Stone Abrasion (35%)" },
                      ].map((dist) => (
                        <button
                          key={dist.id}
                          onClick={() => setDistressLevel(dist.id as any)}
                          className={`py-2 px-1 text-center rounded-[2px] border text-[11px] font-semibold cursor-pointer transition-colors ${distressLevel === dist.id
                              ? "bg-black text-white border-black font-bold shadow-xs"
                              : "bg-[#FAFAF8] text-neutral-700 border-[#E6E6E2] hover:bg-neutral-100"
                            }`}
                        >
                          {dist.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modular Hardware & Varsity Trims */}
                  <div className="pt-2 border-t border-[#E6E6E2] space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Modular Garment Trims &amp; Hardware:
                    </div>

                    {/* Snap Buttons Hardware Finishes */}
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block mb-1.5 font-mono">
                        Hardware Button Finish
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {BUTTON_FINISHES.map((btn) => {
                          const isBtnSelected =
                            (partColors.buttons || "").toLowerCase() === btn.hex.toLowerCase() ||
                            selectedButtonFinish === btn.id;
                          return (
                            <button
                              key={btn.id}
                              onClick={() => {
                                setSelectedButtonFinish(btn.id);
                                setPartColor("buttons", btn.hex);
                              }}
                              className={`p-2 rounded-[2px] border text-left transition-all cursor-pointer flex items-center gap-2 ${isBtnSelected
                                  ? "bg-black text-white border-black shadow-xs font-bold"
                                  : "bg-[#FAFAF8] text-neutral-800 border-[#E6E6E2] hover:bg-neutral-100"
                                }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: btn.hex }}
                              />
                              <span className="text-[10px] truncate">{btn.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sleeve & Pocket Striping */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block mb-1 font-mono">
                          Sleeve Cuffs Ribbing
                        </span>
                        <div className="flex border border-[#E6E6E2] rounded-[2px] p-0.5 bg-[#FAFAF8]">
                          <button
                            onClick={() => setSleeveStyle("striped")}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-[2px] transition-colors cursor-pointer ${sleeveStyle === "striped"
                                ? "bg-[#0B0B0B] text-white shadow-xs"
                                : "text-neutral-600 hover:text-black"
                              }`}
                          >
                            Striped
                          </button>
                          <button
                            onClick={() => setSleeveStyle("plain")}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-[2px] transition-colors cursor-pointer ${sleeveStyle === "plain"
                                ? "bg-[#0B0B0B] text-white shadow-xs"
                                : "text-neutral-600 hover:text-black"
                              }`}
                          >
                            Solid
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block mb-1 font-mono">
                          Pocket &amp; Hem Welts
                        </span>
                        <div className="flex border border-[#E6E6E2] rounded-[2px] p-0.5 bg-[#FAFAF8]">
                          <button
                            onClick={() => setPocketStyle("striped")}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-[2px] transition-colors cursor-pointer ${pocketStyle === "striped"
                                ? "bg-[#0B0B0B] text-white shadow-xs"
                                : "text-neutral-600 hover:text-black"
                              }`}
                          >
                            Striped
                          </button>
                          <button
                            onClick={() => setPocketStyle("plain")}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-[2px] transition-colors cursor-pointer ${pocketStyle === "plain"
                                ? "bg-[#0B0B0B] text-white shadow-xs"
                                : "text-neutral-600 hover:text-black"
                              }`}
                          >
                            Plain
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interior Quilted Lining */}
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block mb-1.5 font-mono">
                        Interior Thermal Quilted Lining
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {LINING_OPTIONS.map((lining) => (
                          <button
                            key={lining.id}
                            onClick={() => setSelectedLining(lining.id)}
                            className={`p-2 rounded-[2px] border text-left transition-colors flex items-center gap-2 cursor-pointer ${selectedLining === lining.id
                                ? "bg-black text-white border-black shadow-xs font-bold"
                                : "bg-[#FAFAF8] text-neutral-800 border-[#E6E6E2] hover:bg-neutral-100"
                              }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: lining.colorPreview }}
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold block truncate">{lining.name}</span>
                              <span className={`text-[8.5px] block truncate font-mono ${selectedLining === lining.id ? "text-neutral-400" : "text-neutral-500"}`}>
                                {lining.season}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decoration Method Selection */}
                  <div className="pt-2 border-t border-[#E6E6E2]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                      Primary Decoration Technique:
                    </label>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { id: "screen-print", name: "High-Density Screen Print" },
                        { id: "puff-embroidery", name: "3D High-Loft Puff Embroidery" },
                        { id: "chenille-patch", name: "Varsity Wool Chenille Patch" },
                        { id: "rhinestones", name: "Czech Crystal Rhinestones" },
                      ].map((dec) => (
                        <button
                          key={dec.id}
                          onClick={() => setDecorationMethod(dec.id)}
                          className={`w-full p-2.5 text-left rounded-[2px] border flex items-center justify-between cursor-pointer ${decorationMethodId === dec.id
                              ? "bg-[#0B0B0B] text-white font-semibold shadow-xs"
                              : "bg-[#FAFAF8] text-neutral-700 border-[#E6E6E2] hover:bg-neutral-100"
                            }`}
                        >
                          <span>{dec.name}</span>
                          {decorationMethodId === dec.id && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Factory Technical Specifications */}
                  <div className="pt-3 border-t border-[#DADBD2] space-y-1.5 text-xs text-neutral-600 font-mono">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A] block mb-1">
                      FACTORY TECHNICAL SPECIFICATIONS:
                    </label>
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-400">Fabric Composition:</span>
                      <span className="font-semibold text-[#0A0A0A]">
                        {activeModelType === "varsity" ? "80% Melton Wool / 20% Cowhide" : "100% Combed Cotton French Terry"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-400">Standard Density:</span>
                      <span className="font-semibold text-[#0A0A0A]">{gsm} GSM Heavyweight</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-400">Production Turnaround:</span>
                      <span className="font-semibold text-[#0A0A0A]">12-14 Business Days</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-400">Branding Included:</span>
                      <span className="font-semibold text-[#D61C24]">Woven Neck + Care Labels</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LAYERS MANAGER */}
              {activeTab === "layers" && (
                <div className="space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Active Graphic & Text Elements:
                  </div>

                  {artworkLayers.length === 0 && textLayers.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500 bg-[#FAFAF8] border border-[#E6E6E2] rounded-[2px]">
                      No custom artwork or text layers added yet. Upload a logo or add text above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Artwork items */}
                      {artworkLayers.map((art) => {
                        const isSelected = selectedLayerId === art.id;
                        return (
                          <div
                            key={art.id}
                            onClick={() => setSelectedLayerId(art.id)}
                            className={`p-3 rounded-[2px] border flex items-center justify-between text-xs cursor-pointer ${isSelected ? "bg-red-50 border-[#D10115]" : "bg-[#FAFAF8] border-[#E6E6E2]"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-neutral-500" />
                              <span className="font-semibold text-black">{art.name}</span>
                              <span className="text-[9px] uppercase px-1.5 bg-neutral-200 rounded-[2px]">
                                {art.view}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  bringForward(art.id);
                                }}
                                className="p-1 text-neutral-500 hover:text-black"
                                title="Bring Forward"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendBackward(art.id);
                                }}
                                className="p-1 text-neutral-500 hover:text-black"
                                title="Send Backward"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeArtworkLayer(art.id);
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Text items */}
                      {textLayers.map((txt) => {
                        const isSelected = selectedLayerId === txt.id;
                        return (
                          <div
                            key={txt.id}
                            onClick={() => {
                              setSelectedLayerId(txt.id);
                              setActiveTab("text");
                            }}
                            className={`p-3 rounded-[2px] border flex items-center justify-between text-xs cursor-pointer ${isSelected ? "bg-red-50 border-[#D10115]" : "bg-[#FAFAF8] border-[#E6E6E2]"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Type className="w-4 h-4 text-neutral-500" />
                              <span className="font-semibold text-black truncate max-w-[120px]">
                                {txt.text}
                              </span>
                              <span className="text-[9px] uppercase px-1.5 bg-neutral-200 rounded-[2px]">
                                {txt.view}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  bringForward(txt.id);
                                }}
                                className="p-1 text-neutral-500 hover:text-black"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendBackward(txt.id);
                                }}
                                className="p-1 text-neutral-500 hover:text-black"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTextLayer(txt.id);
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SIZING & BATCH ORDER */}
              {activeTab === "sizing" && (
                <div className="space-y-6">
                  {/* Wholesale Pricing Tiers Schedule */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]">
                        VOLUME WHOLESALE TIER PRICING:
                      </label>
                      <span className="text-[10px] font-mono font-bold text-[#D61C24]">
                        {activeModelType === "varsity" ? "Varsity Outerwear" : "Heavyweight Fleece"}
                      </span>
                    </div>
                    <div className="border border-[#DADBD2] rounded-[2px] overflow-hidden text-xs">
                      <div className="grid grid-cols-3 bg-[#FAFAF8] p-2 border-b border-[#DADBD2] font-mono text-[10px] font-bold text-neutral-500 uppercase">
                        <span>Quantity Tier</span>
                        <span>Unit Price</span>
                        <span>Savings</span>
                      </div>
                      {[
                        { tier: "50 - 99 pcs", price: activeModelType === "varsity" ? "$68.00" : "$24.50", save: "Standard MOQ" },
                        { tier: "100 - 249 pcs", price: activeModelType === "varsity" ? "$62.50" : "$21.80", save: "Save 11%" },
                        { tier: "250 - 499 pcs", price: activeModelType === "varsity" ? "$56.00" : "$19.20", save: "Save 22%" },
                        { tier: "500+ pcs", price: activeModelType === "varsity" ? "$49.50" : "$16.50", save: "Save 33%" },
                      ].map((r, i) => {
                        const totalUnits = Object.values(sizeBreakdown).reduce((a, b) => a + b, 0);
                        const isTierActive =
                          i === 3 ? totalUnits >= 500 :
                            i === 2 ? totalUnits >= 250 && totalUnits < 500 :
                              i === 1 ? totalUnits >= 100 && totalUnits < 250 :
                                totalUnits >= 50 && totalUnits < 100;
                        return (
                          <div
                            key={i}
                            className={`grid grid-cols-3 p-2 border-b border-[#DADBD2] last:border-0 font-mono text-[11px] transition-colors ${isTierActive ? "bg-red-50/80 font-bold" : ""
                              }`}
                          >
                            <span className="font-semibold text-neutral-800">{r.tier}</span>
                            <span className="font-bold text-[#D61C24]">{r.price}/pc</span>
                            <span className="text-neutral-500">{r.save}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]">
                        WHOLESALE SIZE MATRIX (UNITS):
                      </label>
                      <span className="text-[10px] font-mono font-bold text-[#D61C24]">
                        Total: {Object.values(sizeBreakdown).reduce((a, b) => a + b, 0)} pcs
                      </span>
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((sz) => {
                        const qty = sizeBreakdown[sz] || 0;
                        return (
                          <div
                            key={sz}
                            className="flex items-center justify-between py-1.5 px-2.5 sm:py-2 sm:px-3 bg-[#FAFAF8] border border-[#DADBD2] rounded-[2px]"
                          >
                            <span className="font-mono font-bold text-[11px] sm:text-xs w-8 sm:w-12 text-[#0A0A0A]">{sz}</span>
                            <div className="flex items-center gap-1.5 sm:gap-3">
                              <button
                                onClick={() => setSizeBreakdown({ ...sizeBreakdown, [sz]: Math.max(0, qty - 5) })}
                                className="w-6 h-6 sm:w-7 sm:h-7 bg-white border border-[#DADBD2] hover:border-black rounded-[2px] font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                              >
                                -
                              </button>
                              <span className="w-7 sm:w-10 text-center font-mono font-bold text-[11px] sm:text-xs text-[#0A0A0A]">
                                {qty}
                              </span>
                              <button
                                onClick={() => setSizeBreakdown({ ...sizeBreakdown, [sz]: qty + 5 })}
                                className="w-6 h-6 sm:w-7 sm:h-7 bg-white border border-[#DADBD2] hover:border-black rounded-[2px] font-mono font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Preset Allocations */}
                  <div className="pt-2 border-t border-[#DADBD2]">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                      QUICK BATCH ALLOCATIONS:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <button
                        onClick={() =>
                          setSizeBreakdown({
                            XS: 5,
                            S: 10,
                            M: 15,
                            L: 15,
                            XL: 5,
                            "2XL": 0,
                            "3XL": 0,
                          })
                        }
                        className="p-2 bg-[#FAFAF8] hover:bg-neutral-100 border border-[#DADBD2] rounded-[2px] text-left cursor-pointer"
                      >
                        <span className="font-bold block text-[#0A0A0A]">50 PCS (MOQ Split)</span>
                        <span className="text-[10px] text-neutral-400">5 / 10 / 15 / 15 / 5</span>
                      </button>
                      <button
                        onClick={() =>
                          setSizeBreakdown({
                            XS: 10,
                            S: 20,
                            M: 30,
                            L: 25,
                            XL: 10,
                            "2XL": 5,
                            "3XL": 0,
                          })
                        }
                        className="p-2 bg-[#FAFAF8] hover:bg-neutral-100 border border-[#DADBD2] rounded-[2px] text-left cursor-pointer"
                      >
                        <span className="font-bold block text-[#0A0A0A]">100 PCS (Retail Curve)</span>
                        <span className="text-[10px] text-neutral-400">10 / 20 / 30 / 25 / 10 / 5</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Summary & Add to Cart */}
                  <div className="p-4 bg-[#0A0A0A] text-white rounded-[2px] space-y-3 font-mono">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Total Batch Units:</span>
                      <span className="font-bold">
                        {Object.values(sizeBreakdown).reduce((a, b) => a + b, 0)} pcs
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Tier Unit Price:</span>
                      <span className="font-bold text-[#FF333D]">
                        ${(activeModelType === "varsity" ? 68.0 : 24.5).toFixed(2)}/pc
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-800">
                      <span>Total Estimated Cost:</span>
                      <span className="text-[#FF333D]">
                        ${(
                          Object.values(sizeBreakdown).reduce((a, b) => a + b, 0) *
                          (activeModelType === "varsity" ? 68.0 : 24.5)
                        ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button
                      onClick={handleAddCustomToCart}
                      className="w-full py-3 bg-[#D61C24] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD BATCH TO CART</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Summary & Ordering Bar */}
          <div className="p-6 border-t border-[#E6E6E2] bg-[#FAFAF8] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Configured Specification:</span>
              <span className="font-bold text-black font-mono">
                {mode === "wholesale" ? `Bulk MOQ ${quantity} PCS` : "1 Piece Sample"}
              </span>
            </div>

            {/* Dedicated High-Impact Tech Pack Button */}
            <button
              type="button"
              onClick={() => setIsTechPackOpen(true)}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-black border-2 border-black font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <FileText className="w-4 h-4 text-[#D10115] group-hover:scale-110 transition-transform" />
              <span>Generate Factory Tech Pack</span>
            </button>

            <button
              onClick={handleAddCustomToCart}
              className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Add Custom Spec to Production Bag</span>
              <ShoppingBag className="w-4 h-4 text-[#D10115]" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-500 pt-1">
              <button
                onClick={() => setIsTechPackOpen(true)}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#D10115]" /> Preview Tech Pack
              </button>
              <span>•</span>
              <Link href="/request-quote" className="hover:underline">
                Request Official Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Pack Modal */}
      {isTechPackOpen && (() => {
        const effectiveProduct =
          activeModelType === "varsity" && !product.slug.includes("varsity")
            ? (PRODUCTS_DATA.find((p) => p.slug.includes("varsity") || p.subcategory === "varsity-jackets") || product)
            : activeModelType === "hoodie" && !product.slug.includes("hoodie")
              ? (PRODUCTS_DATA.find((p) => p.slug.includes("hoodie")) || product)
              : activeModelType === "basketball" && !product.slug.includes("basketball")
                ? (PRODUCTS_DATA.find((p) => p.slug.includes("basketball") || p.subcategory.includes("basketball")) || product)
                : activeModelType === "equestrian" && !product.slug.includes("riding") && !product.slug.includes("equestrian")
                  ? (PRODUCTS_DATA.find((p) => p.slug.includes("riding") || p.subcategory.includes("riding") || p.subcategory.includes("equestrian")) || product)
                  : product;

        return (
          <TechPackModal
            product={effectiveProduct}
            state={{
              productId: effectiveProduct.id,
              view,
              activeGarmentPart,
              partColors,
              fabricId,
              gsm,
              washId:
                washId === "vintage-wash"
                  ? "Vintage Mineral Acid Wash"
                  : washId === "stone-wash"
                    ? "Heavy Stone Wash"
                    : washId === "sun-faded"
                      ? "Sun-Faded Solar Distress"
                      : "Clean Raw Mill Finish",
              decorationMethodId:
                textLayers.length > 0
                  ? "chenille-embroidery"
                  : artworkLayers.length > 0
                    ? "screen-printing"
                    : decorationMethodId || (activeModelType === "varsity" ? "chenille-embroidery" : "direct-to-garment"),
              trims: {
                lining: selectedLining,
                buttonFinish: selectedButtonFinish,
                sleeveStyle,
                pocketStyle,
              },
              construction: {
                silhouette: activeModelType === "varsity" ? "Boxy Vintage Drop-Shoulder" : "Oversized Drop-Shoulder",
                lining: selectedLining,
              },
              artworkLayers,
              textLayers,
              quantity,
              sizeBreakdown,
            }}
            onClose={() => setIsTechPackOpen(false)}
          />
        );
      })()}

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B0B0B] text-white px-4 py-3 rounded-[2px] shadow-2xl flex items-center gap-2 text-xs border border-white/20 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Custom design saved to your local studio profile!</span>
        </div>
      )}
    </div>
  );
}
