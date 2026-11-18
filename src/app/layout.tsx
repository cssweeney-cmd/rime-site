import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Archivo, Geist_Mono } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const title = `${site.brand.name} | ${site.product.name}, ${site.product.price}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.brand.url),
  title,
  description: site.brand.description,
  openGraph: {
    title,
    description: site.brand.description,
    siteName: site.brand.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: site.theme.colors.ink,
  colorScheme: "dark",
};

const c = site.theme.colors;
const themeVars = {
  "--c-ink": c.ink,
  "--c-ink-2": c.ink2,
  "--c-ink-3": c.ink3,
  "--c-frost": c.frost,
  "--c-mute": c.mute,
  "--c-line": c.line,
  "--c-accent": c.accent,
  "--c-accent-ink": c.accentInk,
} as CSSProperties;

/**
 * Runs before first paint. Adds `js` always, and `motion` unless the visitor
 * prefers reduced motion. All animation CSS and JS is gated on `motion`, so
 * without it the page is a plain, fully readable document.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("motion")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistMono.variable} antialiased`}
      style={themeVars}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
