"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Riffle, Branches, Laptop } from "@lucasmarkes/hairline/react"

gsap.registerPlugin(ScrollTrigger)

const processSteps = [
  {
    step: "01",
    title: "RESEARCH",
    copy: "I start by understanding the problem before designing the solution. I spend 1–2 weeks on desktop research, user interviews, surveys, and competitive analysis to understand the people, context, and constraints behind the problem.",
    Illustration: Riffle,
  },
  {
    step: "02",
    title: "STRATEGY",
    copy: "I turn what I’ve learned into a clear direction. Through stakeholder conversations, surveys, workshops, and product discovery, I define the goals, priorities, and experience principles so everyone is aligned before execution begins.",
    Illustration: Branches,
  },
  {
    step: "03",
    title: "DESIGN",
    copy: "With the direction clear, I move into design. I explore concepts, structure the experience, and refine the visual system across typography, color, components, and interaction, taking everything through high-fidelity design, prototyping, and developer handoff.",
    Illustration: Laptop,
  },
]

// Corner plus marker matching portfolio aesthetic
const PlusMark = ({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) => {
  const styles: Record<string, React.CSSProperties> = {
    "top-left": { top: 0, left: 0, transform: "translate(-50%, -50%)" },
    "top-right": { top: 0, right: 0, transform: "translate(50%, -50%)" },
    "bottom-left": { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
    "bottom-right": { bottom: 0, right: 0, transform: "translate(50%, 50%)" },
  }

  return (
    <span
      className="absolute select-none pointer-events-none text-[13px] leading-none text-gray-300 group-hover:text-gray-400 transition-colors duration-300 font-mono"
      style={{ ...styles[position], zIndex: 10 }}
    >
      +
    </span>
  )
}

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

      {/* ── 3 Cards Grid Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 -mx-4 md:-mx-12 lg:-mx-16 px-2 md:px-4 mt-4">
        {processSteps.map((item) => {
          const Illustration = item.Illustration

          return (
            <div
              key={item.step}
              className="group relative bg-white border border-gray-200 p-6 md:p-8 rounded-none flex flex-col justify-between transition-all duration-300 hover:border-gray-400 hover:shadow-md"
            >
              <PlusMark position="top-left" />
              <PlusMark position="top-right" />
              <PlusMark position="bottom-left" />
              <PlusMark position="bottom-right" />

              {/* Text Information Stack */}
              <div>
                {/* Step Number */}
                <span className="inline-block text-xs font-mono tracking-widest text-gray-400 font-medium mb-3">
                  {item.step} —
                </span>

                {/* Heading */}
                <h3 className="text-base md:text-lg font-medium tracking-wide text-black mb-3">
                  {item.title}
                </h3>

                {/* Supporting Paragraph */}
                <p
                  className="text-xs md:text-sm text-gray-600 font-light leading-relaxed mb-6 md:mb-8"
                  style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
                >
                  {item.copy}
                </p>
              </div>

              {/* Interactive Hairline Illustration Container (Transparent Background) */}
              <div className="w-full py-4 px-0 bg-transparent border-0 flex justify-center items-center min-h-[200px]">
                <Illustration className="w-full max-w-[250px] aspect-[4/3]" theme="light" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
