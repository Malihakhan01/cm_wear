import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Sportswear, Cheerleading & Teamwear Manufacturer | CM SPORTS WEAR",
  description: "High-performance sportswear manufacturing in Sialkot. Custom cheerleading uniforms, athletic jerseys, training kits, compression wear, and private label teamwear.",
};

export default async function SportswearPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "sportswear");
  if (!category) return notFound();
  const products = await productsService.getByCategory("sportswear");

  return <CategoryPageTemplate category={category} products={products} />;
}
