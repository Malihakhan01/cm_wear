import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/common/CustomCursor";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: {
    default: "CM SPORTS WEAR | High-Performance Teamwear & Technical Apparel Exporter",
    template: "%s | CM SPORTS WEAR",
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/cm_logo/Red and White Wear Emblem.png" },
      { url: "/cm_logo/Red and White Wear Emblem.png", type: "image/png" },
    ],
    shortcut: "/cm_logo/Red and White Wear Emblem.png",
    apple: [
      { url: "/cm_logo/Red and White Wear Emblem.png" },
    ],
  },
  keywords: [
    "CM SPORTS WEAR",
    "Care Master Sports Wear",
    "apparel manufacturer Sialkot",
    "team sports wear manufacturer",
    "ice hockey jerseys supplier",
    "martial arts combat wear",
    "bjj gis manufacturer",
    "activewear fitness exporter",
    "custom varsity jackets manufacturer",
    "wholesale apparel exporter",
    "workwear medical scrubs exporter",
    "sports gloves manufacturer",
  ],
  authors: [{ name: "CM SPORTS WEAR Manufacturing" }],
  creator: "CM SPORTS WEAR",
  publisher: "CM SPORTS WEAR",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "CM SPORTS WEAR | High-Performance Apparel Manufacturing & Export",
    description: siteConfig.description,
    siteName: "CM SPORTS WEAR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CM SPORTS WEAR | High-Performance Apparel Manufacturing",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/cm_logo/Red and White Wear Emblem.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/cm_logo/Red and White Wear Emblem.png" type="image/png" />
        <link rel="apple-touch-icon" href="/cm_logo/Red and White Wear Emblem.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0A0A0A] antialiased selection:bg-[#D61C24] selection:text-white">
        <CustomCursor />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
