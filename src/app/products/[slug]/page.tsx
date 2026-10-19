import React, { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { PRODUCTS_DATA } from "@/data/products.data";

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [{ slug: "overview" }];
  PRODUCTS_DATA.forEach((p) => {
    if (p.slug) slugs.push({ slug: p.slug });
  });

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cmsportswear.pk/api/v1";
    const [res1, res2] = await Promise.all([
      fetch(`${apiUrl}/products?per_page=500&page=1`, { cache: "no-store" }),
      fetch(`${apiUrl}/products?per_page=500&page=2`, { cache: "no-store" }),
    ]);

    if (res1.ok) {
      const json1 = await res1.json();
      const list1 = Array.isArray(json1) ? json1 : json1?.data || [];
      list1.forEach((item: any) => {
        if (item.slug && !slugs.some((s) => s.slug === item.slug)) {
          slugs.push({ slug: item.slug });
        }
      });
    }

    if (res2.ok) {
      const json2 = await res2.json();
      const list2 = Array.isArray(json2) ? json2 : json2?.data || [];
      list2.forEach((item: any) => {
        if (item.slug && !slugs.some((s) => s.slug === item.slug)) {
          slugs.push({ slug: item.slug });
        }
      });
    }
  } catch (e) {
    console.warn("Could not fetch remote product slugs during build:", e);
  }

  return slugs;
}

export default async function Page({ params }: { params?: Promise<{ slug: string }> | { slug: string } }) {
  let resolvedSlug = "";
  if (params) {
    const p = await params;
    resolvedSlug = p?.slug || "";
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs">
          Loading Garment Spec...
        </div>
      }
    >
      <ProductDetailClient initialSlug={resolvedSlug} />
    </Suspense>
  );
}
