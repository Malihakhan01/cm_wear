import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { PRODUCTS_DATA } from "@/data/products.data";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tear-Proof Rugby Jerseys & Match Kit Manufacturer",
  description: "300 GSM interlock rugby match jerseys with anti-grab collars and silicone chest grip. 600N tensile burst resistance for pro clubs and unions.",
};

export default function RugbyPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "rugby");
  if (!category) return notFound();
  const products = PRODUCTS_DATA.filter((p) => p.category === "rugby");

  return <CategoryPageTemplate category={category} products={products} />;
}
