import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casual Wear & Streetwear Blanks Manufacturing",
  description: "Custom French terry hoodies, heavyweight 280 GSM t-shirts, tactical cargo pants, and tracksuits for private label brands. Low 50 pc MOQ from Sialkot.",
};

export default function CasualWearPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "casual-wear");
  if (!category) return notFound();
  const products = PRODUCTS_DATA.filter((p) => p.category === "casual-wear");

  return <CategoryPageTemplate category={category} products={products} />;
}
