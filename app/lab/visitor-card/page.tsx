import React from "react";
import Link from "next/link";
import VisitorCard from "../../components/lab/VisitorCard";

export const metadata = {
  title: "Visitor Card | Lab",
  description: "Create and download your custom visitor card.",
};

export default function VisitorCardPage() {
  return (
    <div className="min-h-screen bg-white text-black px-6 py-24 md:py-32 font-sans selection:bg-black/10">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div>
          <Link
            href="/lab"
            className="inline-flex items-center text-gray-500 hover:text-black transition-colors text-sm font-mono uppercase tracking-widest mb-6"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Lab
          </Link>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
            Visitor Card
          </h1>
          <p className="text-gray-500 max-w-xl text-lg leading-relaxed">
            Design your personalized visitor card. Choose a theme, sign your name, and download it as a souvenir.
          </p>
        </div>

        <div className="w-full h-px bg-black/5" />

        {/* Interactive Component */}
        <VisitorCard />
      </div>
    </div>
  );
}
