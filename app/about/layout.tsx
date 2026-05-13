import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Varun Gupta | Product Designer, Hyderabad",
  description: "Learn about Varun Gupta — a product designer based in Hyderabad who works with early-stage startups on brand identity, product design, and design systems.",
  keywords: ["Varun Gupta", "About Varun Gupta", "Product Designer Hyderabad", "UX Designer India"],
  openGraph: {
    title: "About Varun Gupta | Product Designer, Hyderabad",
    description: "Learn about Varun Gupta — a product designer based in Hyderabad who works with early-stage startups on brand identity, product design, and design systems.",
    url: "https://varungupta-eta.vercel.app/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Varun Gupta | Product Designer, Hyderabad",
    description: "Learn about Varun Gupta — a product designer based in Hyderabad who works with early-stage startups.",
  },
  alternates: {
    canonical: "https://varungupta-eta.vercel.app/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
