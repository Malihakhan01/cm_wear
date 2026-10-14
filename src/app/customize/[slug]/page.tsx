import React, { Suspense } from "react";
import CustomizeClient from "./CustomizeClient";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CATEGORIES_DATA } from "@/data/categories.data";

export function generateStaticParams() {
  const baseSlugs = [
    // Core 3D Atelier models
    "custom-varsity-jacket",
    "custom-hoodie",
    "custom-riding-jacket",
    "custom-basketball-jersey",
    
    // Core garment aliases
    "varsity-jacket",
    "hoodie",
    "t-shirt",
    "t-shirts",
    "tracksuit",
    "tracksuits",
    "jacket",
    "jackets",
    "riding-jacket",
    "riding-jackets",
    "basketball-jersey",
    "basketball",
    "equestrian",
    "sweatpants",
    "cargo-pants",
    "shorts",
    "polo-shirts",
    "competition-shirts",

    // The 8 Core Categories
    "casual-wear",
    "equestrian-clothing",
    "ice-hockey",
    "cycling",
    "rugby",
    "ski-wear",
    "go-karting-racing",
  ];

  const productSlugs = PRODUCTS_DATA.map((p) => p.slug);
  const customizerIds = PRODUCTS_DATA.map((p) => p.customizerId).filter(Boolean) as string[];
  const categorySlugs = CATEGORIES_DATA.map((c) => c.slug);
  const subcategorySlugs = CATEGORIES_DATA.flatMap((c) => c.subcategories.map((s) => s.slug));

  const allUniqueSlugs = Array.from(
    new Set([
      ...baseSlugs,
      ...productSlugs,
      ...customizerIds,
      ...categorySlugs,
      ...subcategorySlugs,
    ])
  );

  return allUniqueSlugs.map((slug) => ({ slug }));
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-mono">Loading 3D Customizer...</div>}>
      <CustomizeClient />
    </Suspense>
  );
}
