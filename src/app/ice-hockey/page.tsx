import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ice Hockey Jerseys & Team Kit Manufacturer",
  description: "Pro-weight 250 GSM K1 birds-eye mesh ice hockey jerseys with authentic laser tackle-twill embroidery and commercial fight straps.",
};

export default async function IceHockeyPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "ice-hockey");
  if (!category) return notFound();
  const products = await productsService.getByCategory("ice-hockey");

  return <CategoryPageTemplate category={category} products={products} />;
}

