import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Meridian Living — Curated Essentials That Elevate Everyday Living",
  description:
    "NovaNest is a luxury French-Nordic studio for curated home decor, smart accessories, desk essentials, wellness pieces and considered gifts.",
};

export const viewport: Viewport = {
  themeColor: "#0a0c13",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-night text-ivory antialiased" suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
