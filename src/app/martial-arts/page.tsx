import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Martial Arts Uniforms & Gis Manufacturing | Tawfiq Industries",
  description: "Wholesale Brazilian Jiu-Jitsu gis, Karate uniforms, Taekwondo doboks, and combat apparel for private label fight brands. Low 50 pc MOQ from Sialkot.",
};

export default async function MartialArtsPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "martial-arts");
  if (!category) return notFound();
  const products = await productsService.getByCategory("martial-arts");

  return <CategoryPageTemplate category={category} products={products} />;
}
