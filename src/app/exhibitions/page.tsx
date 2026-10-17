import React from "react";
import type { Metadata } from "next";
import ExhibitionsClient from "./ExhibitionsClient";
import { EXHIBITIONS_DATA } from "@/data/exhibitions.data";

export const metadata: Metadata = {
  title: "International Trade Exhibitions & Global Stands | CM SPORTS WEAR",
  description:
    "Over two decades of international trade exhibitions. Explore CM SPORTS WEAR's official pavilions, stands, and technical apparel showcases at ISPO Munich, The Super Show USA, MAGIC Las Vegas, and Expo Karachi.",
  keywords: [
    "CM Sports Wear Exhibitions",
    "ISPO Munich CM Sports Wear",
    "MAGIC Las Vegas Sourcing",
    "Super Show USA Sialkot",
    "Sports Apparel Trade Fairs",
    "Pakistan Pavilion ISPO",
    "Sialkot Athletic Exporters",
  ],
  openGraph: {
    title: "International Trade Exhibitions | CM SPORTS WEAR",
    description:
      "Explore official stand photos and technical athletic wear showcases from ISPO Munich, The Super Show USA, MAGIC Las Vegas, and Expo Karachi.",
    images: ["/exhibitions/ISPO Munich 2013.jpg"],
  },
};

export default function ExhibitionsPage() {
  return <ExhibitionsClient exhibitions={EXHIBITIONS_DATA} />;
}
