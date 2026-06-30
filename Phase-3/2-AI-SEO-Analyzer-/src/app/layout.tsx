import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seo.gabrielnathanael.site"),
  title: {
    default: "AI-SEO Analyzer - Check Your Website's Performance",
    template: "%s | AI-SEO Analyzer",
  },
  description:
    "Analyze your website's SEO performance with AI-powered insights. Get competitor comparison, actionable recommendations, and improve your ranking.",
  keywords: [
    "SEO Analyzer",
    "AI SEO Tool",
    "Website Grader",
    "SEO Audit",
    "Competitor Analysis",
  ],
  authors: [{ name: "Sheikh Muhammad Aizaz" }],
  creator: "Sheikh Muhammad Aizaz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seo.gabrielnathanael.site",
    title: "AI-SEO Analyzer - Free Website Performance Tool",
    description:
      "Get AI-powered SEO analysis with competitor comparison and actionable insights.",
    siteName: "AI-SEO Analyzer",
    images: [
      {
        url: "/seo.webp",
        width: 1200,
        height: 630,
        alt: "AI-SEO Analyzer Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-SEO Analyzer - Free Website Performance Tool",
    description:
      "Analyze and improve your website's SEO performance with AI-powered insights.",
    images: ["/seo.webp"],
    creator: "@aizazsaad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}