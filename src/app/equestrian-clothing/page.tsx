import React from "react";
import { CATEGORIES_DATA } from "@/data/categories.data";
import { productsService } from "@/services/products.service";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equestrian Clothing & Competition Riding Jackets Manufacturer",
  description: "Luxury equestrian competition show jackets, German silicone full-seat grip breeches, and UPF 50+ sun shirts for dressage and jumping brands.",
};

export default async function EquestrianClothingPage() {
  const category = CATEGORIES_DATA.find((c) => c.id === "equestrian-clothing");
  if (!category) return notFound();
  const products = await productsService.getByCategory("equestrian-clothing");

  return <CategoryPageTemplate category={category} products={products} />;
}

