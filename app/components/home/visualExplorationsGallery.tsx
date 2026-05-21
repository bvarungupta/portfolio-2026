"use client"

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const images = [
  '/images/visual-explorations/card.png',
  '/images/visual-explorations/card-business.jpg',
  '/images/visual-explorations/Heydu.jpeg',
  '/images/visual-explorations/MacBook_13.png',
  '/images/visual-explorations/streer-poster.png',
  '/images/visual-explorations/about-2.png',
  '/images/visual-explorations/pixelmask.mp4',
]

// Duplicate images to create a seamless infinite loop
const carouselItems = [...images, ...images]

export default function VisualExplorationsGallery() {
  const headerRef = useRef<HTMLDivElement>(null)
  const visualEl = useRef<HTMLHeadingElement>(null)
  const explorationsEl = useRef<HTMLHeadingElement>(null)
  const lineEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const visual = visualEl.current
    const explorations = explorationsEl.current
    const line = lineEl.current
    if (!header || !visual || !explorations || !line) return

    let tl: gsap.core.Timeline

    const setup = () => {
      const cRect = header.getBoundingClientRect()
      const vRect = visual.getBoundingClientRect()
      const eRect = explorations.getBoundingClientRect()

      const paddingX = parseFloat(window.getComputedStyle(header).paddingLeft)
      const contentLeft = cRect.left + paddingX
      const contentRight = cRect.right - paddingX

      const visualFinalX = contentLeft - vRect.left
      const explorationsFinalX = (contentRight - eRect.width) - eRect.left

      gsap.set(line, { scaleX: 0, transformOrigin: 'center center', opacity: 0 })

      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(visual, { x: visualFinalX }, 0)
        .to(line, { scaleX: 1, opacity: 1, ease: 'power2.inOut' }, 0)
        .to(explorations, { x: explorationsFinalX }, 0)
    }

    document.fonts.ready.then(() => requestAnimationFrame(setup))

    return () => { tl?.kill() }
  }, [])

  return (
    <div className="mt-20 md:mt-28">
      {/* ── Section header ──────────────────────────────────────── */}
      <div ref={headerRef} className="px-6 md:px-10 pb-8 md:pb-12 overflow-hidden">
        <div className="relative">
          <div ref={lineEl} className="absolute inset-x-0 border-t border-gray-300" style={{ top: '50%' }} />
          <div className="relative flex items-baseline justify-center gap-2">
            <h2 ref={visualEl} className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>V</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>isual</span>
            </h2>
            <h2 ref={explorationsEl} className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>E</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>xplorations</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ── Infinite Carousel ───────────────────────────────────── */}
      <div className="relative w-full overflow-hidden flex py-4">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            zIndex: 10,
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            zIndex: 10,
          }}
        />
        <div className="flex w-max animate-infinite-scroll hover:animation-pause">
          {carouselItems.map((src, idx) => {
            const isVideo = src.endsWith('.mp4');
            return (
              <div
                key={idx}
                className="relative shrink-0 w-[80vw] sm:w-[50vw] md:w-[22vw] lg:w-[18vw] aspect-[4/3] overflow-hidden rounded-none bg-[#05070b] shadow-lg mr-4 md:mr-6"
              >
                {isVideo ? (
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <Image
                    src={src}
                    alt={`Visual Exploration ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, (max-width: 1024px) 22vw, 18vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 45s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
