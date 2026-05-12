import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Nike Premium Store | Air Max Collection",
  description: "Découvrez la nouvelle collection Nike Air Max. Design premium, confort légendaire.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} antialiased`}>
      <body className="bg-white text-black font-sans">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
