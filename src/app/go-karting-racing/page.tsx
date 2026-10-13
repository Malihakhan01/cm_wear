import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go-Karting Racing Suits & Motorsport Apparel Manufacturer",
  description: "High-tensile 500D Cordura CIK-FIA style go-karting racing suits with 360° floating shoulders, paddock softshell jackets, and team mechanics overalls.",
};

export default async function GoKartingRacingPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "go-karting-racing");
  if (!category) return notFound();
  const products = await productsService.getByCategory("go-karting-racing");

  return <CategoryPageTemplate category={category} products={products} />;
}

