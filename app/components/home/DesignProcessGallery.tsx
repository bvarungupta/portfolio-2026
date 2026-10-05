"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Riffle, Laptop, Terminal } from "@lucasmarkes/hairline/react"
import { Geist_Mono } from "next/font/google"

const geistMono = Geist_Mono({ subsets: ["latin"] })

gsap.registerPlugin(ScrollTrigger)

const processSteps = [
  {
    step: "01",
    dots: 1,
    title: "Research",
    copy: "I start by understanding the problem before designing the solution. I spend 1–2 weeks on desktop research, user interviews, surveys, and competitive analysis to understand the people, context, and constraints behind the problem.",
    Illustration: Riffle,
  },
  {
    step: "02",
    dots: 2,
    title: "Design",
    copy: "With the direction clear, I move into design. I explore concepts, structure the experience, and refine the visual system across typography, color, components, and interaction, taking everything through high-fidelity design, prototyping, and developer handoff.",
    Illustration: Laptop,
  },
  {
    step: "03",
    dots: 3,
    title: "Build",
    copy: "I take the final designs into production, working closely with developers through implementation, QA, and launch. I handle the handoff, resolve edge cases, and make sure the finished product stays true to the design while working as it should.",
    Illustration: Terminal,
  },
]

// Gap between cards in px — keep in sync with the gap-5 (20px) class below
const CARD_GAP = 20

export default function DesignProcessGallery() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const headerRef     = useRef<HTMLDivElement>(null)
  const designEl      = useRef<HTMLHeadingElement>(null)
  const processEl     = useRef<HTMLHeadingElement>(null)
  const lineEl        = useRef<HTMLDivElement>(null)
  const viewportRef   = useRef<HTMLDivElement>(null)   // clipping window
  const trackRef      = useRef<HTMLDivElement>(null)   // scrolling flex row

  useEffect(() => {
    const section   = sectionRef.current
    const header    = headerRef.current
    const design    = designEl.current
    const process   = processEl.current
    const line      = lineEl.current
    const viewport  = viewportRef.current
    const track     = trackRef.current
    if (!section || !header || !design || !process || !line || !viewport || !track) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      gsap.set(line, { scaleX: 1, opacity: 1 })
      return
    }

    let headerTl  : gsap.core.Timeline
    let carouselST: ScrollTrigger

    const setup = () => {
      // ── 1. Header split animation (fires before pin takes over) ──────────
      const cRect    = header.getBoundingClientRect()
      const dRect    = design.getBoundingClientRect()
      const pRect    = process.getBoundingClientRect()
      const padX     = parseFloat(window.getComputedStyle(header).paddingLeft)
      const cLeft    = cRect.left + padX
      const cRight   = cRect.right - padX

      gsap.set(line, { scaleX: 0, transformOrigin: "center center", opacity: 0 })

      headerTl = gsap.timeline({
        defaults: { duration: 1.1, ease: "power3.inOut" },
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      headerTl
        .to(design,  { x: cLeft  - dRect.left }, 0)
        .to(line,    { scaleX: 1, opacity: 1, ease: "power2.inOut" }, 0)
        .to(process, { x: cRight - pRect.width - pRect.left }, 0)

      // ── 2. Horizontal carousel — pin + scrub ─────────────────────────────
      //
      // Each card is exactly half the viewport wide (minus half the gap),
      // so 2 cards sit side-by-side inside the clipping viewport.
      //
      // Total track shift:  (numCards − 2) × (cardW + gap)
      //   = 1 × (cardW + gap)          ← Research exits left, Build enters right
      //
      // We want Build to be *completely* in view at 100% scroll progress,
      // which the GSAP scrub handles automatically.

      const vw      = viewport.offsetWidth
      const cardW   = (vw - CARD_GAP) / 2       // exactly 2 cards fit in viewport
      const shift   = (processSteps.length - 2) * (cardW + CARD_GAP)
      // 3 cards − 2 visible = 1 card-width shift total

      // Reset track position
      gsap.set(track, { x: 0 })

      // The animation: track slides left by `shift` pixels
      const carouselTl = gsap.timeline()
      carouselTl.to(track, {
        x: -shift,
        ease: "none",   // linear — scroll progress IS the easing
        duration: 1,
      })

      // Pin section; drive carouselTl with scroll
      carouselST = ScrollTrigger.create({
        trigger     : section,
        start       : "top top",
        // Give 1× viewport-height of scroll distance to traverse the full shift.
        // Feels deliberate without being tedious.
        end         : `+=${vw}`,
        pin         : true,
        pinSpacing  : true,
        scrub       : 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation   : carouselTl,
      })
    }

    document.fonts.ready.then(() => requestAnimationFrame(setup))

    return () => {
      headerTl?.kill()
      carouselST?.kill()
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="mt-20 md:mt-28 bg-white overflow-hidden"
    >
      {/* ── Section Header ── */}
      <div ref={headerRef} className="px-6 md:px-10 pb-8 md:pb-12 overflow-hidden">
        <div className="relative">
          <div
            ref={lineEl}
            className="absolute inset-x-0 border-t border-gray-300"
            style={{ top: "50%" }}
          />
          <div className="relative flex items-baseline justify-center gap-2">
            <h2
              ref={designEl}
              className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap"
            >
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>D</span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>esign</span>
            </h2>
            <h2
              ref={processEl}
              className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap"
            >
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>P</span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>rocess</span>
            </h2>
          </div>
        </div>
        <p
          className="w-full max-w-none text-center text-sm md:text-base text-gray-600 font-light leading-relaxed mt-3 md:mt-4 px-0"
          style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
        >
          How I approach problem solving — from understanding the problem to defining the strategy and building the solution.
        </p>
      </div>

      {/* ── Carousel Viewport: clips overflow so only 2 cards show at a time ── */}
      <div
        ref={viewportRef}
        className="w-full overflow-hidden"
      >
        {/* ── Card Track: all 3 cards in one horizontal flex row ── */}
        <div
          ref={trackRef}
          className="flex flex-row will-change-transform"
          style={{ gap: `${CARD_GAP}px` }}
        >
          {processSteps.map((item) => {
            const Illustration = item.Illustration

            return (
              <div
                key={item.step}
                className={[
                  // Each card is exactly 50% of the viewport width minus half the gap,
                  // so 2 cards sit flush inside the clipping viewport at any time.
                  "w-[calc(50vw-10px)]",
                  "shrink-0",
                  "group relative bg-white border border-gray-300 rounded-none",
                  "flex flex-col justify-between overflow-hidden",
                  "transition-colors duration-300 hover:border-gray-500 hover:shadow-md",
                ].join(" ")}
              >
                {/* Top Header Bar with Dot Indicator */}
                <div className="px-3 md:px-5 py-2 border-b border-gray-300 bg-white flex items-center gap-1.5 min-h-[32px] shrink-0">
                  {Array.from({ length: item.dots }).map((_, i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
                  ))}
                </div>

                {/* Card Body */}
                <div className="px-3 py-5 md:px-5 md:py-6 flex flex-col justify-between flex-1">
                  <div className="w-full">
                    {/* Step number */}
                    <div className={`${geistMono.className} text-base md:text-lg text-gray-500 font-normal mb-2 tracking-tight`}>
                      {item.step}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-2 md:mb-2.5"
                      style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                    >
                      {item.title}
                    </h3>

                    {/* Body copy */}
                    <p
                      className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-1.5 w-full max-w-none"
                      style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
                    >
                      {item.copy}
                    </p>
                  </div>

                  {/* Hairline Illustration — native pointer interaction preserved */}
                  <div className="w-full flex justify-center items-center pt-0 pb-0 mt-1">
                    <Illustration
                      className="w-full max-w-[280px] md:max-w-[320px] aspect-[4/3]"
                      theme="light"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
