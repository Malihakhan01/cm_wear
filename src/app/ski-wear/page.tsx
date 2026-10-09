import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "3-Layer 20K Waterproof Ski Wear & Alpine Jacket Manufacturer",
  description: "Extreme 20,000mm waterproof / 15,000g breathability alpine ski jackets, fully heat-taped seams, PrimaLoft insulation, and Cordura reinforced snow bibs.",
};

export default function SkiWearPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "ski-wear");
  if (!category) return notFound();
  const products = PRODUCTS_DATA.filter((p) => p.category === "ski-wear");

  return <CategoryPageTemplate category={category} products={products} />;
}
