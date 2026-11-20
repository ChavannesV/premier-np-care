import localFont from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

const nunitoSans = localFont({
  src: "../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2",
  weight: "200 900",
  fallback: ["Arial", "sans-serif"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const cormorantGaramond = localFont({
  src: "../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2",
  weight: "300 700",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${cormorantGaramond.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
