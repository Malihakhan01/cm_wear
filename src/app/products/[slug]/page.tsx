import React, { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { PRODUCTS_DATA } from "@/data/products.data";

export function generateStaticParams() {
  const slugs = PRODUCTS_DATA.map((p) => ({ slug: p.slug }));
  return slugs.length > 0 ? slugs : [{ slug: "overview" }];
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-mono">Loading Apparel Specs...</div>}>
      <ProductDetailClient />
    </Suspense>
  );
}
