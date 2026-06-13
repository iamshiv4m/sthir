import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sthir.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sthir — Personalized Strength Programs for India",
  description:
    "Coach-reviewed strength & powerlifting programs delivered in 12 hours. Meet prep, powerbuilding, and general strength — built for Indian athletes.",
  keywords: [
    "strength program India",
    "powerlifting program India",
    "powerbuilding program India",
    "strength sports India",
  ],
  openGraph: {
    title: "Sthir — Strength. Focus. Progress.",
    description:
      "Coach-reviewed training blocks delivered in 12 hours. Powerlifting, strength & powerbuilding for Indian athletes.",
    type: "website",
    url: siteUrl,
    siteName: "Sthir",
    images: [
      {
        url: `${siteUrl}/brand/sthir-og.png`,
        width: 1200,
        height: 1200,
        alt: "Sthir — Strength. Focus. Progress.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sthir — Strength. Focus. Progress.",
    description: "Coach-reviewed strength programs for India.",
    images: [`${siteUrl}/brand/sthir-og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("dark h-full antialiased", geist.variable)}>
      <body className="gym-surface flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
