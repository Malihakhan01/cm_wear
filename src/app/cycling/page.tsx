import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Cycling Apparel & Race Jersey Manufacturer",
  description: "Aerodynamic race jerseys, Italian-padded 8-hour gel chamois bib shorts, and ultra-packable wind vests for cycling clubs and commercial teams.",
};

export default async function CyclingPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "cycling");
  if (!category) return notFound();
  const products = await productsService.getByCategory("cycling");

  return <CategoryPageTemplate category={category} products={products} />;
}

