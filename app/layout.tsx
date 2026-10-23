import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import NavbarClient from "./components/layout/NavbarClient"
import SmoothScroll from "./components/layout/SmoothScroll"
import ScrollReset from "./components/layout/ScrollReset"
import Footer from "./components/layout/footer"
import { WorkSharedTransitionProvider } from "./components/layout/WorkSharedTransition"
import { ColumnBlindsProvider } from "./components/layout/ColumnBlindsTransition"
import Preloader from "./components/layout/Preloader"
import CustomCursor from "./components/layout/CustomCursor"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import PageBranches from "./components/home/PageBranches"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://bvarungupta.vercel.app'
  ),
  title: {
    default: "Varun Gupta — Product Designer",
    template: "%s | Varun Gupta",
  },
  description: "Varun Gupta is a product designer who designs brand, product, and systems for early-stage startups. From first brief to live product.",
  keywords: [
    "Varun Gupta",
    "Varun Gupta designer",
    "Varun Gupta portfolio",
    "Product Designer",
    "UI UX Designer",
    "UX Designer Hyderabad",
    "Startup Designer India",
    "Brand Design",
    "SaaS Design",
    "Freelance Designer India",
    "Product Design Portfolio",
    "bvarungupta",
  ],
  authors: [{ name: "Varun Gupta", url: "https://bvarungupta.vercel.app" }],
  creator: "Varun Gupta",
  openGraph: {
    title: "Varun Gupta — Product Designer",
    description: "Varun Gupta is a product designer who designs brand, product, and systems for early-stage startups. From first brief to live product.",
    url: "https://bvarungupta.vercel.app",
    siteName: "Varun Gupta Portfolio",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/card.jpg",
        width: 1200,
        height: 630,
        alt: "Varun Gupta — Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun Gupta — Product Designer",
    description: "Varun Gupta is a product designer who designs brand, product, and systems for early-stage startups. From first brief to live product.",
    creator: "@bvarungupta",
    images: ["/card.jpg"],
  },
  alternates: {
    canonical: "https://bvarungupta.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      {
        url: '/images/common/vg-white.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/images/common/vg-white.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/images/common/vg26.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preload" href="/fonts/satish-font/Satish-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/satish-font/satish-caps-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FunnelDisplay/FunnelDisplay-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/images/common/vg26.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/images/common/vg-outline.svg" as="image" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning>
        <ColumnBlindsProvider>
          <WorkSharedTransitionProvider>
            <CustomCursor />
            <Preloader />
            <SmoothScroll />
            <ScrollReset />
            <NavbarClient />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "ProfilePage",
                    "mainEntity": {
                      "@type": "Person",
                      "@id": "https://bvarungupta.vercel.app/#varungupta",
                      "name": "Varun Gupta",
                      "alternateName": "bvarungupta",
                      "jobTitle": "Product Designer",
                      "description": "Product designer specialising in brand, product, and design systems for early-stage startups.",
                      "url": "https://bvarungupta.vercel.app",
                      "email": "bvarungupta@gmail.com",
                      "knowsAbout": ["Product Design", "UI/UX Design", "Brand Identity", "Design Systems", "SaaS"],
                      "sameAs": [
                        "https://linkedin.com/in/bvarungupta",
                        "https://behance.net/bvarungupta",
                        "https://dribbble.com/bvarungupta"
                      ],
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Hyderabad",
                        "addressRegion": "Telangana",
                        "addressCountry": "IN"
                      }
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "url": "https://bvarungupta.vercel.app",
                    "name": "Varun Gupta Portfolio",
                    "description": "Portfolio of Varun Gupta, Product Designer based in India.",
                    "author": {
                      "@type": "Person",
                      "name": "Varun Gupta"
                    }
                  }
                ])
              }}
            />
            <main className="relative">
              {children}
              <PageBranches />
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </WorkSharedTransitionProvider>
        </ColumnBlindsProvider>
      </body>
    </html>
  )
}
