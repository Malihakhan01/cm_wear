import React, { Suspense } from "react";
import CustomizeClient from "./CustomizeClient";

export function generateStaticParams() {
  return [
    { slug: "varsity-jacket" },
    { slug: "hoodie" },
    { slug: "t-shirt" },
    { slug: "tracksuit" },
    { slug: "jacket" },
    { slug: "bavarian-wear" },
    { slug: "martial-arts" },
  ];
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-mono">Loading 3D Customizer...</div>}>
      <CustomizeClient />
    </Suspense>
  );
}
