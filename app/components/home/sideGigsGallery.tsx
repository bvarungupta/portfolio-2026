"use client"

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollMorphHero from '../ui/scroll-morph-hero'

gsap.registerPlugin(ScrollTrigger)

export default function SideGigsGallery() {
  const headerRef = useRef<HTMLDivElement>(null)
  const sideEl = useRef<HTMLHeadingElement>(null)
  const gigsEl = useRef<HTMLHeadingElement>(null)
  const lineEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const side = sideEl.current
    const gigs = gigsEl.current
    const line = lineEl.current
    if (!header || !side || !gigs || !line) return

    let tl: gsap.core.Timeline

    const setup = () => {
      const cRect = header.getBoundingClientRect()
      const sRect = side.getBoundingClientRect()
      const gRect = gigs.getBoundingClientRect()

      const paddingX = parseFloat(window.getComputedStyle(header).paddingLeft)
      const contentLeft = cRect.left + paddingX
      const contentRight = cRect.right - paddingX

      const sideFinalX = contentLeft - sRect.left
      const gigsFinalX = (contentRight - gRect.width) - gRect.left

      gsap.set(line, { scaleX: 0, transformOrigin: 'center center', opacity: 0 })

      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(side, { x: sideFinalX }, 0)
        .to(line, { scaleX: 1, opacity: 1, ease: 'power2.inOut' }, 0)
        .to(gigs, { x: gigsFinalX }, 0)
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
            <h2 ref={sideEl} className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>S</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>ide</span>
            </h2>
            <h2 ref={gigsEl} className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>G</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>igs</span>
            </h2>
          </div>
        </div>
      </div>

      {/* ── Scroll Morph Hero Component ───────────────────────────────────── */}
      <div className="w-full">
        <ScrollMorphHero />
      </div>
    </div>
  )
}
