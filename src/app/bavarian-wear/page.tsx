import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bavarian Wear & Trachten Apparel Manufacturing | CM SPORTS WEAR",
  description: "Wholesale Bavarian Wear, embroidered Trachten bodices, and traditional Alpine folk apparel for private label brands. Low 50 pc MOQ from Sialkot.",
};

export default async function BavarianWearPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "bavarian-wear");
  if (!category) return notFound();
  const products = await productsService.getByCategory("bavarian-wear");

  return <CategoryPageTemplate category={category} products={products} />;
}
