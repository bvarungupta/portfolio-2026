"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface MotionItem {
  id: string
  video: string
}

const UNIFORM_ASPECT_RATIO = "aspect-[4/3]"

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

function TouchAutoCarousel({
  items,
  direction = "left",
  speed = 0.6,
  cardWidthClass = "w-[51vw] sm:w-[36vw]",
}: {
  items: MotionItem[]
  direction?: "left" | "right"
  speed?: number
  cardWidthClass?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInteractingRef = useRef(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const quadItems = [...items, ...items, ...items, ...items]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let animationFrameId: number

    const tick = () => {
      if (el && !isInteractingRef.current) {
        const oneSetWidth = el.scrollWidth / 4
        if (direction === "left") {
          el.scrollLeft += speed
          if (el.scrollLeft >= oneSetWidth * 2) {
            el.scrollLeft -= oneSetWidth
          }
        } else {
          el.scrollLeft -= speed
          if (el.scrollLeft <= oneSetWidth) {
            el.scrollLeft += oneSetWidth
          }
        }
      }
      animationFrameId = requestAnimationFrame(tick)
    }

    requestAnimationFrame(() => {
      if (el) {
        const oneSetWidth = el.scrollWidth / 4
        if (direction === "right" && el.scrollLeft === 0) {
          el.scrollLeft = oneSetWidth * 2
        }
      }
    })

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [direction, speed])

  const handleTouchStart = () => {
    isInteractingRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }

  const handleTouchEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
    }, 1200)
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      className="flex gap-2 py-1 overflow-x-auto no-scrollbar select-none touch-pan-x"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      {quadItems.map((item, idx) => (
        <div
          key={`tc-${direction}-${item.id}-${idx}`}
          className={`relative ${cardWidthClass} shrink-0 rounded-none border-0 overflow-hidden bg-white ${UNIFORM_ASPECT_RATIO}`}
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
  )
}

export default function MotionDesignGallery() {
  const headerRef = useRef<HTMLDivElement>(null)
  const motionEl = useRef<HTMLHeadingElement>(null)
  const designEl = useRef<HTMLHeadingElement>(null)
  const lineEl = useRef<HTMLDivElement>(null)

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  useEffect(() => {
    motionItems.forEach((item) => {
      const videoEl = videoRefs.current[item.id]
      if (!videoEl) return

      if (hoveredId === null || hoveredId === item.id) {
        if (videoEl.paused) {
          videoEl.play().catch(() => {})
        }
      } else {
        if (!videoEl.paused) {
          videoEl.pause()
        }
      }
    })
  }, [hoveredId])

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

      {/* ── Mobile View: Touch-Slideable + Auto-Moving Carousel (md:hidden) ── */}
      <div className="relative block md:hidden mt-4 overflow-hidden -mx-6 select-none">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Row 1 Auto Moving Left + Touch Slideable */}
        <TouchAutoCarousel
          items={motionItems.slice(0, 3)}
          direction="left"
          speed={0.6}
          cardWidthClass="w-[51vw] sm:w-[36vw]"
        />

        {/* Row 2 Auto Moving Right + Touch Slideable */}
        <div className="mt-2">
          <TouchAutoCarousel
            items={motionItems.slice(3, 6)}
            direction="right"
            speed={0.6}
            cardWidthClass="w-[51vw] sm:w-[36vw]"
          />
        </div>
      </div>

      {/* ── Desktop View: Interactive 2x3 Grid with Hover Scale & Video Pause (hidden md:grid) ── */}
      <div 
        className="hidden md:grid md:grid-cols-3 gap-3 -mx-12 lg:-mx-20 px-4 mt-6"
        onMouseLeave={() => setHoveredId(null)}
      >
        {motionItems.map((item) => {
          const isHovered = hoveredId === item.id
          const isOtherHovered = hoveredId !== null && !isHovered

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              className={`relative rounded-none border-0 overflow-hidden bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${UNIFORM_ASPECT_RATIO} ${
                isHovered
                  ? "scale-[1.12] md:scale-[1.15] z-30 shadow-2xl opacity-100"
                  : isOtherHovered
                  ? "scale-[0.96] z-0 opacity-40 grayscale-[15%]"
                  : "scale-100 z-10 opacity-100 shadow-none"
              }`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[item.id] = el
                }}
                src={item.video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover pointer-events-none select-none bg-white transition-opacity duration-300"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
