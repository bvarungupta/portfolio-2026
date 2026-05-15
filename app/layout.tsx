import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import NavbarClient from "./components/layout/NavbarClient"
import SmoothScroll from "./components/layout/SmoothScroll"
import ScrollReset from "./components/layout/ScrollReset"
import Footer from "./components/layout/footer"

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
        url: "/card.png",
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
    images: ["/card.png"],
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
  icons: {
    icon: '/images/common/vg-white.svg?v=2',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
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
        <main>
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  )
}
