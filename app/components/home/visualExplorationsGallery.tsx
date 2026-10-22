"use client"

import StackSpread, { type StackSpreadCard } from "@/components/effects/stack-spread"

const SCALE: Partial<Record<number, number>> = {
  1: 0.9,
  2: 0.8,
  3: 0.9,
  4: 0.8,
  5: 0.8,
  6: 0.9,
  7: 0.9,
  8: 0.7,
}
const s = (i: number) => SCALE[i] ?? 1

const explorationCards: StackSpreadCard[] = [
  {
    item: {
      src: "/images/visual-explorations/streer-poster.webp",
      alt: "Street Culture Poster",
    },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -18,
    target: { x: -22, y: -30, rotate: -2, scale: s(8), w: 18, h: 25 },
    targetSm: { x: -22, y: -40 },
    z: 2,
  },
  {
    item: {
      src: "/images/visual-explorations/Heydu.webp",
      alt: "Heydu Branding Concept",
    },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 20,
    target: { x: 30, y: -28, rotate: 3, scale: s(7), w: 20, h: 26 },
    targetSm: { x: 22, y: -40 },
    z: 3,
  },
  {
    item: {
      src: "/images/visual-explorations/card.webp",
      alt: "Visual Branding",
    },
    stackOffset: { x: -16, y: 0 },
    stackRotate: -4,
    target: { x: -34, y: -2, rotate: -1, scale: s(6), w: 18, h: 26 },
    targetSm: { x: -22, y: -19 },
    z: 4,
  },
  {
    item: {
      src: "/images/visual-explorations/MIT-Hero.webp",
      alt: "MIT Concept Presentation",
    },
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: 6, y: -32, rotate: 1, scale: s(5), w: 25, h: 28 },
    targetSm: { x: 22, y: -19 },
    z: 5,
  },
  {
    item: {
      src: "/images/visual-explorations/MacBook_13.webp",
      alt: "MacBook Pro UI Mockup",
    },
    stackOffset: { x: 18, y: 1 },
    stackRotate: 6,
    target: { x: 34, y: 4, rotate: 2, scale: s(4), w: 20, h: 26 },
    targetSm: { x: -22, y: 20 },
    z: 6,
  },
  {
    item: {
      src: "/images/visual-explorations/card-business.webp",
      alt: "Tactile Corporate Identity",
    },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 6,
    target: { x: -24, y: 32, rotate: -2, scale: s(3), w: 20, h: 24 },
    targetSm: { x: 22, y: 20 },
    z: 7,
  },
  {
    item: {
      src: "/images/visual-explorations/about-2.webp",
      alt: "Character Illustration",
    },
    stackOffset: { x: 8, y: 7 },
    stackRotate: 3,
    target: { x: 2, y: 34, rotate: 1, scale: s(2), w: 20, h: 25 },
    targetSm: { x: -22, y: 40 },
    z: 8,
  },
  {
    item: {
      src: "/images/visual-explorations/Ai-healthcare-hero.webp",
      alt: "AI Healthcare Dashboard",
    },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -7,
    target: { x: 28, y: 32, rotate: -1, scale: s(1), w: 20, h: 24 },
    targetSm: { x: 22, y: 40 },
    z: 9,
  },
]

export default function VisualExplorationsGallery() {
  return (
    <div
      id="visual-explorations"
      data-section="visual-explorations"
      className="mt-20 md:mt-28"
    >
      {/* ── Section header ──────────────────────────────────────── */}
      <div className="px-6 md:px-10 pb-8 md:pb-12 overflow-hidden">
        <div className="relative">
          <div
            className="absolute inset-x-0 border-t border-gray-300 hidden md:block"
            style={{ top: "50%" }}
          />
          <div className="relative flex items-baseline justify-center gap-2">
            <h2 className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span
                style={{
                  fontFamily: "VarunCapsSans, sans-serif",
                  fontSize: "1.5em",
                }}
              >
                V
              </span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>
                isual
              </span>
            </h2>
            <h2 className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span
                style={{
                  fontFamily: "VarunCapsSans, sans-serif",
                  fontSize: "1.5em",
                }}
              >
                E
              </span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>
                xplorations
              </span>
            </h2>
          </div>
        </div>
        <p
          className="w-full max-w-none text-center text-sm md:text-base text-gray-600 font-light leading-relaxed mt-3 md:mt-4 px-0"
          style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
        >
          Where I think out loud. Experiments, directions, and things I made
          just to see what would happen.
        </p>
      </div>

      {/* ── Full-viewport Stack Spread Stage ───────────────────── */}
      <div
        className="relative select-none"
        style={{
          width: "100vw",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <StackSpread
          cards={explorationCards}
          bgColor="#ffffff"
          textColor="#111111"
          scrollLength={320}
          cardRadius={10}
          stackScale={0.85}
          headlineMain="Thinking"
          headlineSub="Out"
          headlineEnd="Loud."
          description="A loose collection of tactile experiments, brand systems, prototypes, and artifacts built along the way."
        />
      </div>
    </div>
  )
}
