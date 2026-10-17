import React, { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { PRODUCTS_DATA } from "@/data/products.data";

export async function generateStaticParams() {
  const slugs = PRODUCTS_DATA.map((p) => ({ slug: p.slug }));
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://darkcyan-bear-847672.hostingersite.com/api/v1";
    const res = await fetch(`${apiUrl}/products?per_page=500`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      const list = Array.isArray(json) ? json : json?.data || [];
      const apiSlugs = list.map((item: any) => ({ slug: item.slug }));
      return [...slugs, ...apiSlugs, { slug: "overview" }];
    }
  } catch (e) {
    console.warn("Could not fetch remote slugs during build", e);
  }
  return slugs.length > 0 ? slugs : [{ slug: "overview" }];
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-mono">Loading Apparel Specs...</div>}>
      <ProductDetailClient />
    </Suspense>
  );
}
