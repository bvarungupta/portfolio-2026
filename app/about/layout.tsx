import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Varun Gupta | Product Designer, Hyderabad",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
