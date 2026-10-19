"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CustomizerStudioEngine } from "@/components/common/CustomizerStudioEngine";

export default function CustomizeClient() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const handleModelChange = (model: "hoodie" | "varsity" | "equestrian" | "basketball" | "baseball" | "icehockey" | "martialarts") => {
    const slugMap: Record<string, string> = {
      varsity: "custom-varsity-jacket",
      hoodie: "custom-hoodie",
      basketball: "custom-basketball-jersey",
      baseball: "custom-baseball-uniform",
      icehockey: "custom-ice-hockey-uniform",
      martialarts: "custom-martial-arts-gi",
      equestrian: "custom-riding-jacket",
    };
    const newSlug = slugMap[model] || "custom-varsity-jacket";
    router.replace(`/customize/${newSlug}`);
  };

  return (
    <CustomizerStudioEngine
      mode="studio"
      initialSlug={slug}
      onModelChange={handleModelChange}
    />
  );
}
