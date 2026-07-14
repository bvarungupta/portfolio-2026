"use client"

import React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Import ReactThreeSkull dynamically to bypass SSR
const ReactThreeSkull = dynamic(() => import("../../components/lab/three-skull/ReactThreeSkull"), {
  ssr: false,
})

export default function SpecimenLabPage() {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      {/* Back Button Overlay */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/lab"
          className="px-4 py-2 border border-zinc-800 bg-black/80 text-zinc-500 hover:text-white transition-all text-xs tracking-wider font-mono rounded-sm"
        >
          ← BACK TO LAB
        </Link>
      </div>

      {/* Specimen Canvas Viewport */}
      <div className="w-full h-full">
        <ReactThreeSkull />
      </div>
    </div>
  )
}
