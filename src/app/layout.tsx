import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/common/CustomCursor";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: {
    default: "TAWFIQ INDUSTRY | Engineered Apparel Manufacturing & Private Label Exporter",
    template: "%s | TAWFIQ INDUSTRY",
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [
      { url: "/favicon.png" },
    ],
  },
  keywords: [
    "apparel manufacturer",
    "Sialkot exporter",
    "private label clothing",
    "custom sportswear",
    "ice hockey jerseys manufacturer",
    "cycling apparel manufacturer",
    "equestrian clothing manufacturer",
    "racing suits exporter",
    "ski jacket manufacturer",
    "wholesale apparel manufacturer",
    "custom hoodie blanks",
  ],
  authors: [{ name: "TAWFIQ INDUSTRY Apparel Manufacturing" }],
  creator: "TAWFIQ INDUSTRY",
  publisher: "TAWFIQ INDUSTRY",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "TAWFIQ INDUSTRY | Engineered Apparel Manufacturing & Export",
    description: siteConfig.description,
    siteName: "TAWFIQ INDUSTRY",
  },
  twitter: {
    card: "summary_large_image",
    title: "TAWFIQ INDUSTRY | Engineered Apparel Manufacturing",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0A0A0A] antialiased selection:bg-[#D61C24] selection:text-white">
        <CustomCursor />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
