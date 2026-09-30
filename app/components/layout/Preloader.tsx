"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

/**
 * Preloader Configuration Parameters
 * Easily adjust timing, colors, and animation speeds here.
 */
export const PRELOADER_CONFIG = {
  // Theme Background: Solid white matching site theme
  BG_COLOR: "#ffffff",
  // Typography font family
  FONT_FAMILY: "'Quincy CF', Quincy, Georgia, serif",

  // Loading Durations
  MIN_PHASE1_MS: 1000,          // Calm steady pace 0 -> 80 (ms)
  ACCELERATION_MS: 450,         // Rapid ease-in acceleration 80 -> 100 (ms)
  MAX_LOAD_TIMEOUT_MS: 3500,    // Safety fallback timeout (ms)

  // Exit Animation Sequence Timings (in seconds)
  COUNTER_FADE_DURATION: 0.3,   // Step 1: Counter & progress line fade duration
  PANEL_FADE_DURATION: 0.7,     // Step 2: White panel fade duration
  LOGO_CROSSFADE_DURATION: 0.5, // Step 3: Solid logo crossfade duration
  HERO_STAGGER_DELAY: 0.12,     // Step 4: Stagger interval between hero elements
}

export default function Preloader() {
  const [count, setCount] = useState<number>(0)
  const [isDone, setIsDone] = useState<boolean>(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const counterWrapperRef = useRef<HTMLDivElement>(null)
  const solidLogoRef = useRef<HTMLImageElement>(null)
  const isFinishedRef = useRef<boolean>(false)

  useEffect(() => {
    // 1. Check if already shown in this session (run on initial page load only)
    if (typeof window !== "undefined") {
      const alreadyShown = sessionStorage.getItem("portfolio-preloader-shown")
      if (alreadyShown === "true") {
        setIsDone(true)
        return
      }
    }

    // 2. Lock scroll while loading
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    // 3. Measure & Position Solid Logo over Hero Outline Logo
    const alignSolidLogo = () => {
      const heroLogo = document.getElementById("hero-logo-outline")
      if (heroLogo && solidLogoRef.current) {
        const rect = heroLogo.getBoundingClientRect()
        solidLogoRef.current.style.top = `${rect.top}px`
        solidLogoRef.current.style.left = `${rect.left}px`
        solidLogoRef.current.style.width = `${rect.width}px`
        solidLogoRef.current.style.height = `${rect.height}px`
      }
    }

    // Align immediately and listen on window resize
    alignSolidLogo()
    window.addEventListener("resize", alignSolidLogo, { passive: true })
    const alignInterval = setInterval(alignSolidLogo, 100)

    // Fade solid logo in smoothly over 0.3s on initial mount
    if (solidLogoRef.current) {
      gsap.to(solidLogoRef.current, { opacity: 1, duration: 0.3 })
    }

    // 4. Initial state for hero elements (hide them initially for preloader stagger reveal)
    const pillars = document.querySelectorAll("[data-hero-pillar]")
    const angelsLeft = document.querySelectorAll('[data-hero-angel="left"]')
    const angelsRight = document.querySelectorAll('[data-hero-angel="right"]')
    const heading = document.querySelector('[data-hero-element="heading"]')
    const tagline = document.querySelector('[data-hero-element="tagline"]')
    const email = document.querySelector('[data-hero-element="email"]')
    const navbar = document.querySelector('[data-hero-element="navbar"]')

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      setCount(100)
      sessionStorage.setItem("portfolio-preloader-shown", "true")
      document.body.style.overflow = originalOverflow
      document.documentElement.style.overflow = ""
      setIsDone(true)
      clearInterval(alignInterval)
      return
    }

    // Set initial hidden states for hero elements
    if (pillars.length) gsap.set(pillars, { opacity: 0 })
    if (angelsLeft.length) gsap.set(angelsLeft, { opacity: 0, x: -40 })
    if (angelsRight.length) gsap.set(angelsRight, { opacity: 0, x: 40 })
    if (heading) gsap.set(heading, { opacity: 0, y: 20 })
    if (tagline) gsap.set(tagline, { opacity: 0, y: 20 })
    if (email) gsap.set(email, { opacity: 0, y: 20 })
    if (navbar) gsap.set(navbar, { opacity: 0, y: -40 })

    // 5. Real loading progress tracking
    let realLoadFinished = false
    let phase = 1 // 1: 0->80 calm pace, 2: 80->100 rapid ease-in, 3: exit
    const startTime = performance.now()
    let phase2StartTime = 0
    let startValPhase2 = 0
    let rafId: number

    const handleLoadComplete = () => {
      realLoadFinished = true
    }

    if (document.readyState === "complete") {
      realLoadFinished = true
    } else {
      window.addEventListener("load", handleLoadComplete, { once: true })
    }

    const timeoutId = setTimeout(() => {
      realLoadFinished = true
    }, PRELOADER_CONFIG.MAX_LOAD_TIMEOUT_MS)

    // 6. Counter animation loop
    const updateCounter = (now: number) => {
      const elapsed = now - startTime

      if (phase === 1) {
        const timeRatio = Math.min(1, elapsed / PRELOADER_CONFIG.MIN_PHASE1_MS)
        const targetVal = Math.floor(timeRatio * 80)
        setCount(targetVal)

        if (timeRatio >= 1 && realLoadFinished) {
          phase = 2
          phase2StartTime = now
          startValPhase2 = targetVal
        }
      } else if (phase === 2) {
        const p2Elapsed = now - phase2StartTime
        const p2Progress = Math.min(1, p2Elapsed / PRELOADER_CONFIG.ACCELERATION_MS)
        const easeIn = p2Progress * p2Progress
        const currentVal = Math.floor(startValPhase2 + (100 - startValPhase2) * easeIn)

        setCount(currentVal)

        if (p2Progress >= 1 || currentVal >= 100) {
          setCount(100)
          phase = 3
          triggerExitSequence()
          return
        }
      }

      if (phase !== 3) {
        rafId = requestAnimationFrame(updateCounter)
      }
    }

    rafId = requestAnimationFrame(updateCounter)

    // 7. Master Exit Sequence Timeline
    const triggerExitSequence = () => {
      if (isFinishedRef.current) return
      isFinishedRef.current = true
      clearInterval(alignInterval)

      sessionStorage.setItem("portfolio-preloader-shown", "true")

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow
          document.documentElement.style.overflow = ""
          setIsDone(true)
          window.dispatchEvent(new CustomEvent("preloader-complete"))
        },
      })

      // Step 1: Counter & progress line fade out (~0.3s)
      if (counterWrapperRef.current) {
        tl.to(counterWrapperRef.current, {
          opacity: 0,
          duration: PRELOADER_CONFIG.COUNTER_FADE_DURATION,
          ease: "power2.out",
        })
      }

      // Step 2 & 3: White panel fades out (~0.7s) AND solid logo crossfades to 0 (~0.5s)
      if (panelRef.current) {
        tl.to(
          panelRef.current,
          {
            opacity: 0,
            duration: PRELOADER_CONFIG.PANEL_FADE_DURATION,
            ease: "power2.inOut",
          },
          "<"
        )
      }

      if (solidLogoRef.current) {
        tl.to(
          solidLogoRef.current,
          {
            opacity: 0,
            duration: PRELOADER_CONFIG.LOGO_CROSSFADE_DURATION,
            ease: "power2.inOut",
          },
          "<"
        )
      }

      // Step 4: Staggered Hero Section Reveal as panel fades out
      const staggerTime = "<+=0.1"

      // 4a. Side columns & Angel illustrations fade in from sides
      if (pillars.length) {
        tl.to(pillars, { opacity: 0.18, duration: 0.6, ease: "power2.out" }, staggerTime)
      }
      if (angelsLeft.length) {
        tl.to(angelsLeft, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "<")
      }
      if (angelsRight.length) {
        tl.to(angelsRight, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "<")
      }

      // 4b. "Varun Gupta" heading
      if (heading) {
        tl.to(heading, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, `<+=${PRELOADER_CONFIG.HERO_STAGGER_DELAY}`)
      }

      // 4c. Tagline
      if (tagline) {
        tl.to(tagline, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, `<+=${PRELOADER_CONFIG.HERO_STAGGER_DELAY}`)
      }

      // 4d. Email section / pill
      if (email) {
        tl.to(email, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, `<+=${PRELOADER_CONFIG.HERO_STAGGER_DELAY}`)
      }

      // 4e. Navbar slides down from top
      if (navbar) {
        tl.to(navbar, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" }, `<+=${PRELOADER_CONFIG.HERO_STAGGER_DELAY}`)
      }
    }

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
      clearInterval(alignInterval)
      window.removeEventListener("load", handleLoadComplete)
      window.removeEventListener("resize", alignSolidLogo)
      document.body.style.overflow = originalOverflow
      document.documentElement.style.overflow = ""
    }
  }, [])

  if (isDone) return null

  return (
    <>
      {/* Fixed Solid Logo rendered ABOVE the white panel */}
      <img
        ref={solidLogoRef}
        src="/images/common/vg26.svg"
        alt=""
        aria-hidden="true"
        className="fixed z-[10000] pointer-events-none select-none transition-none"
        style={{ opacity: 0 }}
      />

      {/* Full-Screen Pure White Panel Loader */}
      <div
        ref={panelRef}
        className="fixed inset-0 z-[9999] flex flex-col justify-end p-6 md:p-10 pointer-events-auto select-none opacity-100"
        style={{
          backgroundColor: PRELOADER_CONFIG.BG_COLOR,
          willChange: "opacity",
        }}
      >
        {/* Bottom Counter & Progress Wrapper */}
        <div ref={counterWrapperRef} className="relative w-full">
          {/* Right Counter */}
          <div className="flex items-end justify-end w-full">
            <div className="flex items-baseline gap-1">
              <span
                className="font-bold text-black leading-none tracking-tight"
                style={{
                  fontFamily: PRELOADER_CONFIG.FONT_FAMILY,
                  fontSize: "clamp(4rem, 12vw, 10rem)",
                  fontVariantNumeric: "tabular-nums",
                  fontFeatureSettings: '"tnum"',
                  letterSpacing: "-0.05em",
                }}
              >
                {count}%
              </span>
            </div>
          </div>

          {/* Bottom Progress Line */}
          <div className="absolute -bottom-6 md:-bottom-10 left-0 w-full h-[2px] bg-black/10">
            <div
              className="h-full bg-black transition-all duration-75 ease-out"
              style={{ width: `${count}%` }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
