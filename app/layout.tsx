import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import "./globals.css"
import NavbarClient from "./components/layout/NavbarClient"
import SmoothScroll from "./components/layout/SmoothScroll"
import ScrollReset from "./components/layout/ScrollReset"
import Footer from "./components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://varungupta-eta.vercel.app'
  ),
  title: "Varun Gupta — Product Designer",
  description: "Varun Gupta is a product designer who designs brand, product, and systems for early-stage startups. From first brief to live product.",
  keywords: ["Varun Gupta", "Product Designer", "UI UX Designer", "Hyderabad", "Startup Designer", "Brand Design", "SaaS Design", "Freelance Designer India"],
  authors: [{ name: "Varun Gupta" }],
  openGraph: {
    title: "Varun Gupta — Product Designer",
    description: "Varun Gupta is a product designer who designs brand, product, and systems for early-stage startups. From first brief to live product.",
    url: "https://varungupta-eta.vercel.app",
    type: "website",
    images: ["/images/common/vg-outline.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun Gupta — Product Designer",
    description: "Varun Gupta is a product designer who designs brand, product, and systems for early-stage startups. From first brief to live product.",
  },
  alternates: {
    canonical: "https://varungupta-eta.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
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
      <body className={inter.className} suppressHydrationWarning>
        <SmoothScroll />
        <ScrollReset />
        <NavbarClient />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Varun Gupta",
              "jobTitle": "Product Designer",
              "url": "https://varungupta-eta.vercel.app",
              "email": "bvarungupta@gmail.com",
              "sameAs": [
                "https://linkedin.com/in/bvarungupta",
                "https://behance.net/bvarungupta",
                "https://dribbble.com/bvarungupta"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Hyderabad",
                "addressCountry": "IN"
              }
            })
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
