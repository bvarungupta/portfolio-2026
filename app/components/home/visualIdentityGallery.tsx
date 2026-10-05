"use client"

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const fuellstackImages = [
  '/images/Visuals/fuellstack-V/FS-1.png',
  '/images/Visuals/fuellstack-V/FS-2.png',
  '/images/Visuals/fuellstack-V/FS-3.png',
  '/images/Visuals/fuellstack-V/FS-4.png',
]

// 4-box layout matching reference:
// [ large square (cycling) ] [ wide rectangle ]
// [ large square (cycling) ] [ sq ] [ sq     ]
const items = [
  { image: 'cycling', alt: 'Fuellstack Visual Identity', col: '1 / 3', row: '1 / 3' },
  { image: '',        alt: 'Visual 02',                  col: '3 / 5', row: '1 / 2' },
  { image: '',        alt: 'Visual 03',                  col: '3 / 4', row: '2 / 3' },
  { image: '',        alt: 'Visual 04',                  col: '4 / 5', row: '2 / 3' },
]

export default function VisualIdentityGallery() {
  const headerRef  = useRef<HTMLDivElement>(null)
  const visualEl   = useRef<HTMLHeadingElement>(null)
  const identityEl = useRef<HTMLHeadingElement>(null)
  const lineEl     = useRef<HTMLDivElement>(null)
  const [cycleIndex, setCycleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCycleIndex(i => (i + 1) % fuellstackImages.length)
    }, 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const header   = headerRef.current
    const visual   = visualEl.current
    const identity = identityEl.current
    const line     = lineEl.current
    if (!header || !visual || !identity || !line) return

    let tl: gsap.core.Timeline

    const setup = () => {
      const cRect = header.getBoundingClientRect()
      const vRect = visual.getBoundingClientRect()
      const iRect = identity.getBoundingClientRect()

      const paddingX     = parseFloat(window.getComputedStyle(header).paddingLeft)
      const contentLeft  = cRect.left + paddingX
      const contentRight = cRect.right - paddingX

      const visualFinalX   = contentLeft - vRect.left
      const identityFinalX = (contentRight - iRect.width) - iRect.left

      gsap.set(line, { scaleX: 0, transformOrigin: 'center center', opacity: 0 })

      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(visual,   { x: visualFinalX }, 0)
        .to(line,     { scaleX: 1, opacity: 1, ease: 'power2.inOut' }, 0)
        .to(identity, { x: identityFinalX }, 0)
    }

    document.fonts.ready.then(() => requestAnimationFrame(setup))

    return () => { tl?.kill() }
  }, [])

  return (
    <div className="mt-20 md:mt-28">

      {/* ── Section header ──────────────────────────────────────── */}
      <div
        ref={headerRef}
        className="px-6 md:px-10 pb-8 md:pb-12 overflow-hidden"
      >
        <div className="relative">
          <div
            ref={lineEl}
            className="absolute inset-x-0 border-t border-gray-300"
            style={{ top: '50%' }}
          />
          <div className="relative flex items-baseline justify-center gap-2">
            <h2
              ref={visualEl}
              className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap"
            >
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>V</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>isual</span>
            </h2>
            <h2
              ref={identityEl}
              className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap"
            >
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>I</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>dentity</span>
            </h2>
          </div>
        </div>
        <p
          className="w-full max-w-none text-center text-sm md:text-base text-gray-600 font-light leading-relaxed mt-3 md:mt-4 px-0"
          style={{ fontFamily: 'FunnelDisplay, sans-serif', fontWeight: 300 }}
        >
          Brand systems and visual identities built from scratch. Logos, colour, typography, and the full visual language that makes a brand feel like itself.
        </p>
      </div>

      {/* ── Desktop collage (md+) ─────────────────────────────── */}
      <div className="hidden md:flex gap-2">

        {/* Left: cycling square — aspect-ratio makes it truly 1:1 */}
        <div
          className="relative overflow-hidden bg-gray-50 shrink-0"
          style={{ flexBasis: 'calc(50% - 4px)', aspectRatio: '1 / 1' }}
        >
          {fuellstackImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt="Fuellstack Visual Identity"
              fill
              sizes="50vw"
              className="object-cover"
              style={{
                opacity: cycleIndex === idx ? 1 : 0,
                transition: 'opacity 0.15s ease-in-out',
                position: 'absolute',
              }}
            />
          ))}
        </div>

        {/* Right column: landscape top + 2 squares bottom */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="relative overflow-hidden bg-gray-50 flex-1">
            <Image src="/images/Visuals/fuellstack-V/FS-bl0.png" alt="Fuellstack Visual" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="flex gap-2">
            <div className="relative overflow-hidden bg-gray-50 flex-1" style={{ aspectRatio: '1 / 1' }}>
              <Image src="/images/Visuals/fuellstack-V/FS-m0.png" alt="Fuellstack Visual" fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative overflow-hidden bg-gray-50 flex-1" style={{ aspectRatio: '1 / 1' }}>
              <Image src="/images/Visuals/fuellstack-V/FS-ma1.png" alt="Fuellstack Visual" fill sizes="25vw" className="object-cover" />
            </div>
          </div>
        </div>

      </div>

      {/* ── Mobile collage ────────────────────────────────────── */}
      <div className="grid md:hidden gap-1.5">
        {/* Cycling box: full width, 1:1 */}
        <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
          {fuellstackImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt="Fuellstack Visual Identity"
              fill
              sizes="100vw"
              className="object-cover"
              style={{
                opacity: cycleIndex === idx ? 1 : 0,
                transition: 'opacity 0.15s ease-in-out',
                position: 'absolute',
              }}
            />
          ))}
        </div>
        {/* Wide rectangle */}
        <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '2/1' }}>
          <Image src="/images/Visuals/fuellstack-V/FS-bl0.png" alt="Fuellstack Visual" fill sizes="100vw" className="object-cover" />
        </div>
        {/* Two small squares */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
            <Image src="/images/Visuals/fuellstack-V/FS-m0.png" alt="Fuellstack Visual" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
            <Image src="/images/Visuals/fuellstack-V/FS-ma1.png" alt="Fuellstack Visual" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </div>

    </div>
  )
}
