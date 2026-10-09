import { create } from "zustand";
import { ArtworkLayer, CustomizerState, GarmentView, Product, TextLayer } from "@/types";

interface CustomizerStoreState {
  product: Product | null;
  view: GarmentView;
  activeGarmentPart: string;
  partColors: Record<string, string>;
  fabricId: string;
  gsm: number;
  washId: string;
  decorationMethodId: string;
  trims: {
    zipperStyle?: string;
    drawcordColor?: string;
    labelType?: string;
    packagingType?: string;
  };
  construction: {
    silhouette?: string;
    neckline?: string;
    sleeve?: string;
    length?: string;
    closure?: string;
    lining?: string;
  };
  artworkLayers: ArtworkLayer[];
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  quantity: number;
  sizeBreakdown: Record<string, number>;

  // History management
  history: CustomizerState[];
  historyIndex: number;

  // Actions
  initCustomizer: (product: Product) => void;
  setView: (view: GarmentView) => void;
  setActiveGarmentPart: (part: string) => void;
  setPartColor: (part: string, hexColor: string) => void;
  setAllPartColors: (colors: string | Record<string, string>) => void;
  setFabric: (fabricId: string, gsm: number) => void;
  setGsm: (gsm: number) => void;
  setWash: (washId: string) => void;
  setDecorationMethod: (methodId: string) => void;
  setTrimOption: (key: string, value: string) => void;
  setConstructionOption: (key: string, value: string) => void;
  setSelectedLayerId: (id: string | null) => void;

  // Artwork & Text Layers
  addArtworkLayer: (artwork: Omit<ArtworkLayer, "id" | "zIndex">) => void;
  updateArtworkLayer: (id: string, updates: Partial<ArtworkLayer>) => void;
  removeArtworkLayer: (id: string) => void;
  addTextLayer: (text: Omit<TextLayer, "id" | "zIndex">) => void;
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  removeTextLayer: (id: string) => void;
  deleteSelectedLayer: () => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // Quantities & Sizes
  setQuantity: (qty: number) => void;
  setSizeBreakdown: (breakdown: Record<string, number>) => void;

  // History actions
  pushHistoryState: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  resetToDefaults: () => void;
}

const getSnapshot = (state: CustomizerStoreState): CustomizerState => ({
  productId: state.product?.id || "",
  view: state.view,
  activeGarmentPart: state.activeGarmentPart,
  partColors: { ...state.partColors },
  fabricId: state.fabricId,
  gsm: state.gsm,
  washId: state.washId,
  decorationMethodId: state.decorationMethodId,
  trims: { ...state.trims },
  construction: { ...state.construction },
  artworkLayers: [...state.artworkLayers],
  textLayers: [...state.textLayers],
  quantity: state.quantity,
  sizeBreakdown: { ...state.sizeBreakdown },
});

export const useCustomizerStore = create<CustomizerStoreState>((set, get) => ({
  product: null,
  view: "front",
  activeGarmentPart: "body",
  partColors: {},
  fabricId: "cotton-fleece-450",
  gsm: 450,
  washId: "vintage-wash",
  decorationMethodId: "screen-print",
  trims: {
    zipperStyle: "YKK Antique Silver Metal #5",
    drawcordColor: "#111111",
    labelType: "High-Density Damask Woven Label",
    packagingType: "100% Biodegradable Zip Bag",
  },
  construction: {
    silhouette: "Oversized / Drop-Shoulder",
    neckline: "Double-Layer Hood",
    sleeve: "Relaxed Wide Armhole",
    length: "Standard Crop-Boxy",
    closure: "None / Pullover",
    lining: "Self-Fabric Brushed Fleece",
  },
  artworkLayers: [],
  textLayers: [],
  selectedLayerId: null,
  quantity: 100,
  sizeBreakdown: { S: 20, M: 35, L: 35, XL: 10 },
  history: [],
  historyIndex: -1,

  initCustomizer: (product) => {
    const initialPartColors: Record<string, string> = {};
    if (product.garmentParts && product.garmentParts.length > 0) {
      product.garmentParts.forEach((part) => {
        initialPartColors[part.id] = part.defaultColor || product.colors[0]?.hex || "#1c1c1c";
      });
    } else {
      initialPartColors["body"] = product.colors[0]?.hex || "#1c1c1c";
      initialPartColors["sleeves"] = product.colors[0]?.hex || "#1c1c1c";
      initialPartColors["cuffs"] = product.colors[0]?.hex || "#1c1c1c";
      initialPartColors["collar"] = product.colors[0]?.hex || "#1c1c1c";
    }

    const initialBreakdown: Record<string, number> = {};
    product.sizes.forEach((s, idx) => {
      initialBreakdown[s] = idx === 1 || idx === 2 ? 35 : 15;
    });

    const newState = {
      product,
      view: "front" as GarmentView,
      activeGarmentPart: product.garmentParts?.[0]?.id || "body",
      partColors: initialPartColors,
      fabricId: "cotton-fleece-450",
      gsm: product.GSM || 450,
      washId: product.washOptions?.[0] || "vintage-wash",
      decorationMethodId: product.decorationMethods?.[0] || "screen-print",
      artworkLayers: [],
      textLayers: [],
      selectedLayerId: null,
      quantity: Math.max(product.MOQ || 50, 100),
      sizeBreakdown: initialBreakdown,
    };

    set({
      ...newState,
      history: [
        {
          productId: product.id,
          view: "front",
          activeGarmentPart: "body",
          partColors: initialPartColors,
          fabricId: "cotton-fleece-450",
          gsm: product.GSM || 450,
          washId: product.washOptions?.[0] || "vintage-wash",
          decorationMethodId: product.decorationMethods?.[0] || "screen-print",
          trims: get().trims,
          construction: get().construction,
          artworkLayers: [],
          textLayers: [],
          quantity: Math.max(product.MOQ || 50, 100),
          sizeBreakdown: initialBreakdown,
        },
      ],
      historyIndex: 0,
    });
  },

  setView: (view) => set({ view }),
  setActiveGarmentPart: (activeGarmentPart) => set({ activeGarmentPart }),

  setPartColor: (part, hexColor) => {
    set((state) => ({
      partColors: {
        ...state.partColors,
        [part]: hexColor,
      },
    }));
    get().pushHistoryState();
  },

  setAllPartColors: (colors) => {
    set((state) => {
      if (typeof colors === "object" && colors !== null) {
        const merged: Record<string, string> = { ...state.partColors };
        Object.entries(colors).forEach(([k, v]) => {
          if (typeof v === "string") {
            merged[k] = v;
          }
        });
        return { partColors: merged };
      }
      const hexColor = colors;
      const updated: Record<string, string> = { ...state.partColors };
      Object.keys(state.partColors).forEach((k) => {
        updated[k] = hexColor;
      });
      // also ensure core garment parts are populated
      ["body", "sleeves", "cuffs", "waistband", "hood", "pocket", "pockets", "collar", "buttons", "patch"].forEach((k) => {
        updated[k] = hexColor;
      });
      return { partColors: updated };
    });
    get().pushHistoryState();
  },

  setFabric: (fabricId, gsm) => {
    set({ fabricId, gsm });
    get().pushHistoryState();
  },

  setGsm: (gsm) => {
    set({ gsm });
    get().pushHistoryState();
  },

  setWash: (washId) => {
    set({ washId });
    get().pushHistoryState();
  },

  setDecorationMethod: (decorationMethodId) => {
    set({ decorationMethodId });
    get().pushHistoryState();
  },

  setTrimOption: (key, value) => {
    set((state) => ({
      trims: { ...state.trims, [key]: value },
    }));
    get().pushHistoryState();
  },

  setConstructionOption: (key, value) => {
    set((state) => ({
      construction: { ...state.construction, [key]: value },
    }));
    get().pushHistoryState();
  },

  setSelectedLayerId: (selectedLayerId) => set({ selectedLayerId }),

  addArtworkLayer: (artwork) => {
    const id = `art_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newLayer: ArtworkLayer = {
      ...artwork,
      id,
      zIndex: get().artworkLayers.length + get().textLayers.length + 1,
    };
    set((state) => ({
      artworkLayers: [...state.artworkLayers, newLayer],
      selectedLayerId: id,
    }));
    get().pushHistoryState();
  },

  updateArtworkLayer: (id, updates) => {
    set((state) => ({
      artworkLayers: state.artworkLayers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  removeArtworkLayer: (id) => {
    set((state) => ({
      artworkLayers: state.artworkLayers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    }));
    get().pushHistoryState();
  },

  addTextLayer: (textConfig) => {
    const id = `txt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newLayer: TextLayer = {
      ...textConfig,
      id,
      zIndex: get().artworkLayers.length + get().textLayers.length + 1,
    };
    set((state) => ({
      textLayers: [...state.textLayers, newLayer],
      selectedLayerId: id,
    }));
    get().pushHistoryState();
  },

  updateTextLayer: (id, updates) => {
    set((state) => ({
      textLayers: state.textLayers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  removeTextLayer: (id) => {
    set((state) => ({
      textLayers: state.textLayers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    }));
    get().pushHistoryState();
  },

  deleteSelectedLayer: () => {
    const id = get().selectedLayerId;
    if (!id) return;
    if (get().artworkLayers.some((a) => a.id === id)) {
      get().removeArtworkLayer(id);
    } else {
      get().removeTextLayer(id);
    }
  },

  bringForward: (id) => {
    set((state) => {
      const art = state.artworkLayers.map((l) => (l.id === id ? { ...l, zIndex: l.zIndex + 2 } : l));
      const txt = state.textLayers.map((l) => (l.id === id ? { ...l, zIndex: l.zIndex + 2 } : l));
      return { artworkLayers: art, textLayers: txt };
    });
  },

  sendBackward: (id) => {
    set((state) => {
      const art = state.artworkLayers.map((l) =>
        l.id === id ? { ...l, zIndex: Math.max(1, l.zIndex - 2) } : l
      );
      const txt = state.textLayers.map((l) =>
        l.id === id ? { ...l, zIndex: Math.max(1, l.zIndex - 2) } : l
      );
      return { artworkLayers: art, textLayers: txt };
    });
  },

  setQuantity: (quantity) => set({ quantity }),
  setSizeBreakdown: (sizeBreakdown) => set({ sizeBreakdown }),

  pushHistoryState: () => {
    const state = get();
    const snapshot = getSnapshot(state);
    const updatedHistory = state.history.slice(0, state.historyIndex + 1);
    updatedHistory.push(snapshot);
    // Keep up to 20 history states
    if (updatedHistory.length > 20) {
      updatedHistory.shift();
    }
    set({
      history: updatedHistory,
      historyIndex: updatedHistory.length - 1,
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetSnapshot = history[targetIndex];
      set({
        ...targetSnapshot,
        historyIndex: targetIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetSnapshot = history[targetIndex];
      set({
        ...targetSnapshot,
        historyIndex: targetIndex,
      });
    }
  },

  resetToDefaults: () => {
    const { product } = get();
    if (product) {
      get().initCustomizer(product);
    }
  },
}));
