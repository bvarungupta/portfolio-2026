"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface MotionItem {
  id: string
  video: string
}

const UNIFORM_ASPECT_RATIO = "aspect-[4/3]" // Change to "aspect-video" (16:9) or "aspect-square" (1:1) if preferred

const motionItems: MotionItem[] = [
  {
    id: "glowing-text",
    video: "/motion/glowing_text.mp4",
  },
  {
    id: "motion-cards",
    video: "/motion/motion_cards.mp4",
  },
  {
    id: "card-flip",
    video: "/motion/Card-Flip.mp4",
  },
  {
    id: "receipt",
    video: "/motion/receipt_new.mp4",
  },
  {
    id: "system-1-1",
    video: "/motion/1-1.mp4",
  },
  {
    id: "product-4-3",
    video: "/motion/4-3.mp4",
  },
]

export default function MotionDesignGallery() {
  const headerRef = useRef<HTMLDivElement>(null)
  const motionEl = useRef<HTMLHeadingElement>(null)
  const designEl = useRef<HTMLHeadingElement>(null)
  const lineEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const motion = motionEl.current
    const design = designEl.current
    const line = lineEl.current
    if (!header || !motion || !design || !line) return

    let tl: gsap.core.Timeline

    const setup = () => {
      const cRect = header.getBoundingClientRect()
      const mRect = motion.getBoundingClientRect()
      const dRect = design.getBoundingClientRect()

      const paddingX = parseFloat(window.getComputedStyle(header).paddingLeft)
      const contentLeft = cRect.left + paddingX
      const contentRight = cRect.right - paddingX

      const motionFinalX = contentLeft - mRect.left
      const designFinalX = contentRight - dRect.width - dRect.left

      gsap.set(line, { scaleX: 0, transformOrigin: "center center", opacity: 0 })

      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: "power3.inOut" },
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.to(motion, { x: motionFinalX }, 0)
        .to(line, { scaleX: 1, opacity: 1, ease: "power2.inOut" }, 0)
        .to(design, { x: designFinalX }, 0)
    }

    document.fonts.ready.then(() => requestAnimationFrame(setup))

    return () => {
      tl?.kill()
    }
  }, [])

  return (
    <div className="mt-20 md:mt-28">
      {/* Section Header matching other sections */}
      <div ref={headerRef} className="px-6 md:px-10 pb-8 md:pb-12 overflow-hidden">
        <div className="relative">
          <div
            ref={lineEl}
            className="absolute inset-x-0 border-t border-gray-300"
            style={{ top: "50%" }}
          />
          <div className="relative flex items-baseline justify-center gap-2">
            <h2
              ref={motionEl}
              className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap"
            >
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>M</span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>otion</span>
            </h2>
            <h2
              ref={designEl}
              className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap"
            >
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>D</span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>esign</span>
            </h2>
          </div>
        </div>
        <p
          className="w-full max-w-none text-center text-sm md:text-base text-gray-600 font-light leading-relaxed mt-3 md:mt-4 px-0"
          style={{ fontFamily: 'FunnelDisplay, sans-serif', fontWeight: 300 }}
        >
          Animations and micro-interactions from across my work. The details that make a product feel alive.
        </p>
      </div>

      {/* Video Cards — 1 Video per Row */}
      <div className="flex flex-col gap-8 md:gap-12 px-2 md:px-4 max-w-4xl mx-auto">
        {motionItems.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-none overflow-hidden bg-white border border-white transition-transform duration-500 scale-[1.015] hover:scale-[1.035] hover:z-10 ${UNIFORM_ASPECT_RATIO}`}
          >
            <video
              src={item.video}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover pointer-events-none select-none bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
