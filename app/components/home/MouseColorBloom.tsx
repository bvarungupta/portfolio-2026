"use client"

import { useRef, useEffect } from 'react'

// ─── Bloom config ─────────────────────────────────────────────────────────────
const BLOOM = {
  radius:  140,                        // px — size of the color circle
  color:   'rgba(59, 130, 246, 0.85)', // original blue bloom hue
}

export default function MouseColorBloom() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only enable on desktop with fine pointer (disable on mobile and touch devices)
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const isFine = window.matchMedia('(pointer: fine)').matches
    const isDesktop = window.innerWidth >= 768

    if (isTouch || !isFine || !isDesktop) return

    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      // Deactivate when scrolled down past the hero fold
      if (window.scrollY > window.innerHeight) {
        el.style.setProperty('--mx', '-500px')
        el.style.setProperty('--my', '-500px')
        return
      }

      el.style.setProperty('--mx', `${e.clientX}px`)
      el.style.setProperty('--my', `${e.clientY}px`)
    }

    const onScroll = () => {
      if (window.scrollY > window.innerHeight) {
        el.style.setProperty('--mx', '-500px')
        el.style.setProperty('--my', '-500px')
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none hidden md:block"
      style={{
        zIndex: 2,
        background: `radial-gradient(circle ${BLOOM.radius}px at var(--mx, -500px) var(--my, -500px), ${BLOOM.color} 0%, transparent 100%)`,
        mixBlendMode: 'color',
      }}
    />
  )
}
