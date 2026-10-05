"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Riffle, Turntable, Laptop, Terminal } from "@lucasmarkes/hairline/react"
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
    title: "Strategy",
    copy: "I turn what I've learned into a clear direction. Through stakeholder conversations, surveys, workshops, and product discovery, I define the goals, priorities, and experience principles so everyone is aligned before execution begins.",
    Illustration: Turntable,
  },
  {
    step: "03",
    dots: 3,
    title: "Design",
    copy: "With the direction clear, I move into design. I explore concepts, structure the experience, and refine the visual system across typography, color, components, and interaction, taking everything through high-fidelity design, prototyping, and developer handoff.",
    Illustration: Laptop,
  },
  {
    step: "04",
    dots: 4,
    title: "Build",
    copy: "I take the final designs into production, working closely with developers through implementation, QA, and launch. I handle the handoff, resolve edge cases, and make sure the finished product stays true to the design while working as it should.",
    Illustration: Terminal,
  },
]

export default function DesignProcessGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const designEl = useRef<HTMLHeadingElement>(null)
  const processEl = useRef<HTMLHeadingElement>(null)
  const lineEl = useRef<HTMLDivElement>(null)
  // The track that holds all 4 cards in a single horizontal row
  const trackRef = useRef<HTMLDivElement>(null)
  // Viewport / clipping window for the carousel
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const header = headerRef.current
    const design = designEl.current
    const process = processEl.current
    const line = lineEl.current
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!section || !header || !design || !process || !line || !track || !viewport) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      // Show all cards in a normal horizontal scroll layout immediately
      gsap.set(line, { scaleX: 1, opacity: 1 })
      gsap.set(track, { x: 0 })
      return
    }

    let st: ScrollTrigger
    let headerST: ScrollTrigger

    const setup = () => {
      // ── Header split animation ──────────────────────────────────────
      const cRect = header.getBoundingClientRect()
      const dRect = design.getBoundingClientRect()
      const pRect = process.getBoundingClientRect()

      const paddingX = parseFloat(window.getComputedStyle(header).paddingLeft)
      const contentLeft = cRect.left + paddingX
      const contentRight = cRect.right - paddingX

      const designFinalX = contentLeft - dRect.left
      const processFinalX = contentRight - pRect.width - pRect.left

      gsap.set(line, { scaleX: 0, transformOrigin: "center center", opacity: 0 })

      headerST = ScrollTrigger.create({
        trigger: header,
        start: "top 80%",
        onEnter: () => {
          gsap.to(design, { x: designFinalX, duration: 1.1, ease: "power3.inOut" })
          gsap.to(line, { scaleX: 1, opacity: 1, duration: 1.1, ease: "power2.inOut" })
          gsap.to(process, { x: processFinalX, duration: 1.1, ease: "power3.inOut" })
        },
        onLeaveBack: () => {
          gsap.to(design, { x: 0, duration: 1.1, ease: "power3.inOut" })
          gsap.to(line, { scaleX: 0, opacity: 0, duration: 1.1, ease: "power2.inOut" })
          gsap.to(process, { x: 0, duration: 1.1, ease: "power3.inOut" })
        },
        once: false,
      })

      // ── Horizontal carousel ─────────────────────────────────────────
      // Calculate how far left the track must translate so card[3] (Build)
      // aligns with the left edge of the viewport window.
      // We want a 2-card-wide viewport, so the track moves by:
      //   (numCards - 2) × cardWidth + (numCards - 2) × gap
      const viewportW = viewport.offsetWidth
      const cardW = viewportW / 2          // 2 cards visible at once on desktop
      const gap = 20                        // must match CSS gap (gap-5 = 20px)
      // Total translation so last 2 cards are in view:
      //   move = (4 - 2) * (cardW + gap) = 2 * (cardW + gap)
      const totalTranslation = (processSteps.length - 2) * (cardW + gap)

      // Reset track position
      gsap.set(track, { x: 0 })

      // Pin the section and scroll horizontally
      const masterTl = gsap.timeline()
      masterTl.to(track, {
        x: -totalTranslation,
        ease: "none",           // linear — scroll does the easing
        duration: 1,
      })

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${viewportW * 1.5}`,  // pin duration = 1.5 viewports worth of scroll
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: masterTl,
      })
    }

    document.fonts.ready.then(() => requestAnimationFrame(setup))

    return () => {
      st?.kill()
      headerST?.kill()
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="w-full py-12 md:py-16 bg-white overflow-hidden"
    >
      {/* ── Section Header ── */}
      <div ref={headerRef} className="px-6 md:px-10 pb-6 md:pb-10 overflow-hidden">
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

      {/* ── Carousel Viewport (clips the overflowing horizontal track) ── */}
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden"
      >
        {/* ── Card Track (single horizontal row, 4 cards side-by-side) ── */}
        <div
          ref={trackRef}
          className="flex flex-row gap-5 px-6 md:px-10 will-change-transform"
          style={{ width: "max-content" }}
        >
          {processSteps.map((item, index) => {
            const Illustration = item.Illustration
            return (
              <div
                key={item.step}
                className={[
                  "group relative bg-white border border-gray-300 rounded-none flex flex-col justify-between",
                  "overflow-hidden transition-colors duration-300 hover:border-gray-500 hover:shadow-md",
                  // Each card is half the viewport on desktop, ~85vw on mobile
                  "w-[calc(50vw-2.75rem)] md:w-[calc(50vw-3.5rem)]",
                  // Fixed card height so illustrations sit flush
                  "min-h-[480px] md:min-h-[520px]",
                ].join(" ")}
              >
                {/* Top Header Bar with Dot Indicator */}
                <div className="px-4 md:px-5 py-2 border-b border-gray-300 bg-white flex items-center gap-1.5 min-h-[30px] shrink-0">
                  {Array.from({ length: item.dots }).map((_, i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
                  ))}
                </div>

                {/* Card Body */}
                <div className="px-4 pt-4 pb-0 md:px-5 md:pt-4.5 md:pb-0 flex flex-col justify-between flex-1">
                  {/* Text */}
                  <div className="w-full">
                    <div className={`${geistMono.className} text-base md:text-lg text-gray-800 font-normal mb-1 tracking-tight`}>
                      {item.step}
                    </div>

                    <h3
                      className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-1 md:mb-1.5"
                      style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="text-sm md:text-base text-gray-500 font-light leading-relaxed w-full max-w-none"
                      style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
                    >
                      {item.copy}
                    </p>
                  </div>

                  {/* Hairline Illustration — flush to bottom edge */}
                  <div className="w-full flex justify-center items-end pt-0 pb-0 mt-2 -mb-1 md:-mb-2 shrink-0">
                    <Illustration
                      className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] aspect-[4/3]"
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
