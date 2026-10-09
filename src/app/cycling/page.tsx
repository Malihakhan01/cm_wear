import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Cycling Apparel & Race Jersey Manufacturer",
  description: "Aerodynamic race jerseys, Italian-padded 8-hour gel chamois bib shorts, and ultra-packable wind vests for cycling clubs and commercial teams.",
};

export default function CyclingPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "cycling");
  if (!category) return notFound();
  const products = PRODUCTS_DATA.filter((p) => p.category === "cycling");

  return <CategoryPageTemplate category={category} products={products} />;
}
