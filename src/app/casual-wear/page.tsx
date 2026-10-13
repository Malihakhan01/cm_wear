import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casual Wear & Streetwear Blanks Manufacturing",
  description: "Custom French terry hoodies, heavyweight 280 GSM t-shirts, tactical cargo pants, and tracksuits for private label brands. Low 50 pc MOQ from Sialkot.",
};

export default async function CasualWearPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "casual-wear");
  if (!category) return notFound();
  const products = await productsService.getByCategory("casual-wear");

  return <CategoryPageTemplate category={category} products={products} />;
}

