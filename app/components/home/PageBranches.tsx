"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// top = px from page top. edgeOffset = how far behind the screen edge to push it.
const BRANCHES_HOME = [
  // Left side — starts after hero, spaced ~1100px apart
  { side: 'left',  top: 1800, height: 370, rot: -25, speed: 0.08, tiltDir: -1, opacity: 0.09, flip: true,  edgeOffset: 105 },
  { side: 'left',  top: 3800, height: 360, rot: -22, speed: 0.07, tiltDir: -1, opacity: 0.08, flip: true,  edgeOffset: 100 },
  { side: 'right', top: 2700, height: 365, rot: -24, speed: 0.07, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 110 },
  { side: 'right', top: 4700, height: 355, rot: -20, speed: 0.06, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 100 },
]

const BRANCHES_ABOUT = [
  // Spaced to fit exactly on About page (~2900px height) starting at the top
  { side: 'left',  top: 200,  height: 370, rot: -25, speed: 0.08, tiltDir: -1, opacity: 0.09, flip: true,  edgeOffset: 105 },
  { side: 'right', top: 800,  height: 365, rot: -24, speed: 0.07, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 110 },
  { side: 'left',  top: 1400, height: 360, rot: -22, speed: 0.07, tiltDir: -1, opacity: 0.08, flip: true,  edgeOffset: 100 },
  { side: 'right', top: 2000, height: 355, rot: -20, speed: 0.06, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 100 },
  { side: 'left',  top: 2600, height: 360, rot: -22, speed: 0.07, tiltDir: -1, opacity: 0.08, flip: true,  edgeOffset: 100 },
]

const BRANCHES_WORK = [
  // Spaced for Work listing page starting at the top
  { side: 'left',  top: 200,  height: 370, rot: -25, speed: 0.08, tiltDir: -1, opacity: 0.09, flip: true,  edgeOffset: 105 },
  { side: 'right', top: 800,  height: 365, rot: -24, speed: 0.07, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 110 },
  { side: 'left',  top: 1400, height: 360, rot: -22, speed: 0.07, tiltDir: -1, opacity: 0.08, flip: true,  edgeOffset: 100 },
  { side: 'right', top: 2000, height: 355, rot: -20, speed: 0.06, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 100 },
]

const BRANCHES_LAB = [
  // Spaced for Lab directory pages starting at the top
  { side: 'left',  top: 200,  height: 370, rot: -25, speed: 0.08, tiltDir: -1, opacity: 0.09, flip: true,  edgeOffset: 105 },
  { side: 'right', top: 750,  height: 365, rot: -24, speed: 0.07, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 110 },
  { side: 'left',  top: 1300, height: 360, rot: -22, speed: 0.07, tiltDir: -1, opacity: 0.08, flip: true,  edgeOffset: 100 },
]

const BRANCHES_OTHER = [
  // Generic fallback starting early at top 200
  { side: 'left',  top: 200,  height: 370, rot: -25, speed: 0.08, tiltDir: -1, opacity: 0.09, flip: true,  edgeOffset: 105 },
  { side: 'right', top: 800,  height: 365, rot: -24, speed: 0.07, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 110 },
  { side: 'left',  top: 1400, height: 360, rot: -22, speed: 0.07, tiltDir: -1, opacity: 0.08, flip: true,  edgeOffset: 100 },
  { side: 'right', top: 2000, height: 355, rot: -20, speed: 0.06, tiltDir:  1, opacity: 0.08, flip: false, edgeOffset: 100 },
  { side: 'left',  top: 2600, height: 360, rot: -22, speed: 0.07, tiltDir: -1, opacity: 0.08, flip: true,  edgeOffset: 100 },
]

export default function PageBranches() {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)

  let branches = BRANCHES_OTHER // Default fallback
  if (pathname === '/') {
    branches = BRANCHES_HOME
  } else if (pathname === '/about') {
    branches = BRANCHES_ABOUT
  } else if (pathname === '/work') {
    branches = BRANCHES_WORK
  } else if (pathname?.startsWith('/lab')) {
    branches = BRANCHES_LAB
  }

  useEffect(() => {
    if (pathname?.startsWith('/works')) return

    const handleScroll = () => {
      const y    = window.scrollY
      const vh   = window.innerHeight
      const tilt = Math.min(y * 0.012, 6)

      const els = containerRef.current?.querySelectorAll<HTMLImageElement>('[data-branch]')
      els?.forEach(el => {
        const speed   = parseFloat(el.dataset.speed   ?? '0.08')
        const baseRot = parseFloat(el.dataset.rot     ?? '-25')
        const tiltDir = parseFloat(el.dataset.tiltdir ?? '1')
        const flip    = el.dataset.flip === 'true'
        const top     = parseFloat(el.dataset.top     ?? '0')

        // Parallax relative to each branch: 0 displacement when branch is at viewport centre
        const dy  = (y - (top - vh)) * speed * -1
        const rot = baseRot + tiltDir * tilt

        el.style.transform = flip
          ? `translateY(${dy}px) scaleX(-1) rotate(${rot}deg)`
          : `translateY(${dy}px) rotate(${rot}deg)`
      })
    }

    // Run once to initialize positioning on page load
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  if (pathname?.startsWith('/works')) return null

  return (
    <div
      ref={containerRef}
      className="hidden md:block absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 0, overflow: 'clip' }}
    >
      {branches.map((b, i) => (
        <img
          key={i}
          data-branch
          data-speed={b.speed}
          data-rot={b.rot}
          data-tiltdir={b.tiltDir}
          data-flip={String(b.flip)}
          data-top={b.top}
          src="/images/HomeImages/branch.svg"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: b.top,
            [b.side]: `calc(50% - 50vw - ${b.edgeOffset}px)`,
            width: 'auto',
            height: `${b.height}px`,
            transform: b.flip
              ? `translateY(0px) scaleX(-1) rotate(${b.rot}deg)`
              : `translateY(0px) rotate(${b.rot}deg)`,
            filter: `brightness(0) opacity(${b.opacity})`,
          }}
        />
      ))}
    </div>
  )
}
