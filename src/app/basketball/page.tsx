import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Basketball Jerseys & Court Shorts Manufacturer",
  description: "200 GSM diamond air-mesh basketball uniforms, reversible double-layer kits, and heavyweight streetwear court shorts with zipped pockets.",
};

export default async function BasketballPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "basketball");
  if (!category) return notFound();
  const products = await productsService.getByCategory("basketball");

  return <CategoryPageTemplate category={category} products={products} />;
}

