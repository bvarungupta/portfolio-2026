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
    copy: "I turn what I’ve learned into a clear direction. Through stakeholder conversations, surveys, workshops, and product discovery, I define the goals, priorities, and experience principles so everyone is aligned before execution begins.",
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
  const headerRef = useRef<HTMLDivElement>(null)
  const designEl = useRef<HTMLHeadingElement>(null)
  const processEl = useRef<HTMLHeadingElement>(null)
  const lineEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const design = designEl.current
    const process = processEl.current
    const line = lineEl.current
    if (!header || !design || !process || !line) return

    let tl: gsap.core.Timeline

    const setup = () => {
      const cRect = header.getBoundingClientRect()
      const dRect = design.getBoundingClientRect()
      const pRect = process.getBoundingClientRect()

      const paddingX = parseFloat(window.getComputedStyle(header).paddingLeft)
      const contentLeft = cRect.left + paddingX
      const contentRight = cRect.right - paddingX

      const designFinalX = contentLeft - dRect.left
      const processFinalX = contentRight - pRect.width - pRect.left

      gsap.set(line, { scaleX: 0, transformOrigin: "center center", opacity: 0 })

      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: "power3.inOut" },
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.to(design, { x: designFinalX }, 0)
        .to(line, { scaleX: 1, opacity: 1, ease: "power2.inOut" }, 0)
        .to(process, { x: processFinalX }, 0)
    }

    document.fonts.ready.then(() => requestAnimationFrame(setup))

    return () => {
      tl?.kill()
    }
  }, [])

  return (
    <div className="mt-20 md:mt-28">
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

      {/* ── 4 Cards 2x2 Grid Layout (Tighter Layout, Reduced Gaps & Restored Illustration Scale) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mx-0 md:max-w-5xl md:mx-auto px-0 mt-6">
        {processSteps.map((item) => {
          const Illustration = item.Illustration

          return (
            <div
              key={item.step}
              className="group relative bg-white border border-gray-300 rounded-none flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-gray-500 hover:shadow-md"
            >
              {/* Top Header Bar with Dot Indicator */}
              <div className="px-4 md:px-5 py-2 border-b border-gray-300 bg-white flex items-center gap-1.5 min-h-[30px]">
                {Array.from({ length: item.dots }).map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
                ))}
              </div>

              {/* Card Main Body Content (Tight Padding & Reduced Negative Space) */}
              <div className="px-4 pt-4 pb-0 md:px-5 md:pt-4.5 md:pb-0 flex flex-col justify-between flex-1">
                {/* Text Information Stack */}
                <div className="w-full">
                  {/* Step Number in Geist Mono (Regular Weight) */}
                  <div className={`${geistMono.className} text-base md:text-lg text-gray-800 font-normal mb-1 tracking-tight`}>
                    {item.step}
                  </div>

                  {/* Heading in Funnel Display */}
                  <h3
                    className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-1 md:mb-1.5"
                    style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                  >
                    {item.title}
                  </h3>

                  {/* Body Copy in Funnel Display (unconstrained full width) */}
                  <p
                    className="text-sm md:text-base text-gray-500 font-light leading-relaxed w-full max-w-none"
                    style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
                  >
                    {item.copy}
                  </p>
                </div>

                {/* Hairline Illustration tight to content & flush against bottom edge */}
                <div className="w-full flex justify-center items-end pt-0 pb-0 mt-1 md:mt-2 -mb-1 md:-mb-2 shrink-0">
                  <Illustration className="w-full max-w-[240px] sm:max-w-[260px] md:max-w-[290px] aspect-[4/3]" theme="light" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
