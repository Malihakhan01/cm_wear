import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Wishlist | CM SPORTS WEAR",
  description: "Review and manage your saved technical sportswear specimens, request bulk OEM quotes, and configure custom teamwear production.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
