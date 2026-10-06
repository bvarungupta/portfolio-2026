"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const isVisible = useRef(false)
  const prevPos = useRef({ x: 0, y: 0 })
  const prevAngle = useRef(0)
  const idleTimeout = useRef<NodeJS.Timeout | null>(null)

  const size = 68

  useEffect(() => {
    // Disable on touch devices and mobile screens
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    const isFine = window.matchMedia("(pointer: fine)").matches
    const isDesktop = window.innerWidth >= 768

    if (!isTouch && isFine && isDesktop) {
      setIsEnabled(true)
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) return

    const cursor = cursorRef.current
    const label = labelRef.current
    if (!cursor) return

    // Ensure initial state is hidden
    gsap.set(cursor, {
      opacity: 0,
      scale: 0,
      xPercent: -50,
      yPercent: -50,
      pointerEvents: "none",
    })

    // ── Click drop bounce animation ───────────────────────────────
    const onClickDrop = () => {
      if (!isVisible.current || !cursorRef.current) return

      gsap.to(cursorRef.current, {
        scale: 1.25,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          if (!cursorRef.current) return
          gsap.to(cursorRef.current, {
            scale: 1,
            duration: 0.4,
            ease: "bounce.out",
          })
        },
      })
    }

    // ── Liquid movement tracking ──────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const isOverViewTarget = Boolean(target?.closest("[data-cursor='view']"))

      if (isOverViewTarget) {
        if (!isVisible.current) {
          isVisible.current = true
          prevPos.current = { x: e.clientX, y: e.clientY }
          prevAngle.current = 0

          // Instantly snap to pointer upon entering
          gsap.set(cursor, {
            left: e.clientX,
            top: e.clientY,
            scaleX: 1,
            scaleY: 1,
            rotate: 0,
          })
          if (label) gsap.set(label, { rotate: 0 })

          gsap.to(cursor, {
            opacity: 1,
            scale: 1,
            duration: 0.28,
            ease: "power3.out",
            overwrite: "auto",
          })
        }

        // Calculate velocity and directional angle
        const dx = e.clientX - prevPos.current.x
        const dy = e.clientY - prevPos.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)

        let delta = angle - prevAngle.current
        if (delta > 180) delta -= 360
        if (delta < -180) delta += 360

        const smoothingFactor = 0.2
        const smoothAngle = prevAngle.current + delta * smoothingFactor

        const maxStretch = 1.25
        const stretch = Math.min(distance / 25, maxStretch)

        const absDx = Math.abs(dx)
        const absDy = Math.abs(dy)
        const total = absDx + absDy || 1
        const xRatio = absDx / total

        const scaleX = 1 + xRatio * stretch
        const scaleY = 1 - xRatio * stretch * 0.3

        gsap.to(cursor, {
          duration: 0.7,
          left: e.clientX,
          top: e.clientY,
          scaleX,
          scaleY,
          rotate: smoothAngle,
          ease: "power2.out",
          overwrite: "auto",
        })

        // Counter-rotate the text so "VIEW" remains upright and readable
        if (label) {
          gsap.to(label, {
            duration: 0.7,
            rotate: -smoothAngle,
            ease: "power2.out",
            overwrite: "auto",
          })
        }

        // Relax back to round circle when mouse slows or pauses
        if (idleTimeout.current) clearTimeout(idleTimeout.current)
        idleTimeout.current = setTimeout(() => {
          if (isVisible.current && cursor) {
            gsap.to(cursor, {
              scaleX: 1,
              scaleY: 1,
              duration: 0.4,
              ease: "power2.out",
            })
          }
        }, 80)

        prevAngle.current = smoothAngle
        prevPos.current = { x: e.clientX, y: e.clientY }
      } else if (isVisible.current) {
        isVisible.current = false
        if (idleTimeout.current) clearTimeout(idleTimeout.current)

        gsap.to(cursor, {
          opacity: 0,
          scale: 0,
          duration: 0.2,
          ease: "power2.in",
          overwrite: "auto",
        })
      }
    }

    const onMouseLeaveDoc = () => {
      if (!isVisible.current || !cursor) return
      isVisible.current = false
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
      gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.2 })
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("click", onClickDrop)
    document.addEventListener("mouseleave", onMouseLeaveDoc)

    return () => {
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("click", onClickDrop)
      document.removeEventListener("mouseleave", onMouseLeaveDoc)
    }
  }, [size, isEnabled])

  if (!isEnabled) return null

  return (
    <div
      ref={cursorRef}
      className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[99999] rounded-full items-center justify-center select-none backdrop-blur-[10px] saturate-[180%]"
      style={{
        opacity: 0,
        width: size,
        height: size,
        willChange: "transform, left, top",
        background: `
          radial-gradient(125.95% 106.37% at 32.61% 3.41%,
          rgba(255, 255, 255, 0.75) 0%,
          rgba(255, 255, 255, 0.55) 28.13%,
          rgba(252, 252, 252, 0.45) 45.31%,
          rgba(248, 248, 248, 0.38) 66.67%,
          rgba(243, 243, 243, 0.30) 100%)
        `,
        boxShadow: `
          0 10px 24px rgba(0, 0, 0, 0.14),
          inset -4px -8px 12px rgba(255, 255, 255, 0.35),
          inset 3px 3px 8px rgba(255, 255, 255, 0.55),
          inset 5px 10px 14px rgba(255, 255, 255, 0.30)
        `,
        border: "1px solid rgba(255, 255, 255, 0.65)",
      }}
    >
      <span
        ref={labelRef}
        className="text-[#111827] text-[11px] font-medium tracking-[0.14em] uppercase will-change-transform inline-block pointer-events-none"
        style={{
          fontFamily: "FunnelDisplay, sans-serif",
        }}
      >
        View
      </span>
    </div>
  )
}
