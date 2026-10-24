import { Product, ProductColor } from "@/types";

export const COLOR_STEALTH: ProductColor = { id: "c-black", name: "Stealth Black", hex: "#0A0A0A", pantone: "Black 6 C" };
export const COLOR_OLIVE: ProductColor = { id: "c-olive", name: "Stark Olive", hex: "#D61C24", pantone: "Pantone 417 C" };
export const COLOR_CHARCOAL: ProductColor = { id: "c-charcoal", name: "Charcoal Slate", hex: "#20201E", pantone: "Cool Gray 11 C" };
export const COLOR_BONE: ProductColor = { id: "c-bone", name: "Bone Ecru", hex: "#F4F4EF", pantone: "Pantone 7527 C" };
export const COLOR_NAVY: ProductColor = { id: "c-navy", name: "Midnight Navy", hex: "#111B2C", pantone: "Pantone 533 C" };
export const COLOR_CRIMSON: ProductColor = { id: "c-crimson", name: "Racing Crimson", hex: "#8B0000", pantone: "Pantone 187 C" };
export const COLOR_WHITE: ProductColor = { id: "c-white", name: "Optic White", hex: "#FFFFFF", pantone: "Bright White" };

/**
 * PRODUCTION CATALOG PRODUCTS
 * Static base products merging with live API catalog
 */
export const PRODUCTS_DATA: Product[] = [];

