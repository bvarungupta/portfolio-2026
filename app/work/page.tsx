import type { Metadata } from "next"
import WorkGallery from "../components/home/workGallery"

export const metadata: Metadata = {
  title: "Work | Case Studies by Varun Gupta",
  description: "Explore product design case studies by Varun Gupta — brand identity, SaaS product design, and design systems for early-stage startups.",
  keywords: ["Varun Gupta work", "Product Design Case Studies", "UX Portfolio", "Startup Design Portfolio"],
  openGraph: {
    title: "Work | Case Studies by Varun Gupta",
    description: "Explore product design case studies by Varun Gupta — brand identity, SaaS product design, and design systems for early-stage startups.",
    url: "https://varungupta-eta.vercel.app/work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work | Case Studies by Varun Gupta",
    description: "Explore product design case studies by Varun Gupta.",
  },
  alternates: {
    canonical: "https://varungupta-eta.vercel.app/work",
  },
}

export default function WorkPage() {
  return (
    <div className="bg-white min-h-screen px-6 md:px-10 pt-32 md:pt-40 pb-16 max-w-5xl mx-auto overflow-hidden">
      <WorkGallery />
    </div>
  )
}
