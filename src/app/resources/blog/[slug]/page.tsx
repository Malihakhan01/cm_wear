import React, { Suspense } from "react";
import BlogPostDetailPage from "../../../blog/[slug]/BlogDetailClient";

export function generateStaticParams() {
  return [
    { slug: "a-guide-for-brands-clubs" },
    { slug: "custom-cycling-kit-engineering" },
    { slug: "fleece-hoodie-gsm-guide" },
    { slug: "incoterms-apparel-importers-fob-cif-ddp" },
    { slug: "private-label-streetwear-blueprint" },
    { slug: "tournament-ice-hockey-jerseys-tackle-twill-sublimation" },
    { slug: "waterproof-outerwear-standards-membranes-seam-sealing" },
  ];
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-mono">Loading Article...</div>}>
      <BlogPostDetailPage />
    </Suspense>
  );
}
