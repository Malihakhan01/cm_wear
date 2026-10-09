import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ice Hockey Jerseys & Team Kit Manufacturer",
  description: "Pro-weight 250 GSM K1 birds-eye mesh ice hockey jerseys with authentic laser tackle-twill embroidery and commercial fight straps.",
};

export default function IceHockeyPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "ice-hockey");
  if (!category) return notFound();
  const products = PRODUCTS_DATA.filter((p) => p.category === "ice-hockey");

  return <CategoryPageTemplate category={category} products={products} />;
}
