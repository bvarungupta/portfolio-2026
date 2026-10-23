"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useId } from "react"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"


interface ColumnBlindsContextType {
  navigateWithBlinds: (href: string, callback?: () => void) => void
  prefetchWithBlinds: (href: string) => void
  isBlindsActive: boolean
}

const ColumnBlindsContext = createContext<ColumnBlindsContextType | null>(null)

export const useColumnBlinds = () => {
  const context = useContext(ColumnBlindsContext)
  if (!context) {
    throw new Error("useColumnBlinds must be used within ColumnBlindsProvider")
  }
  return context
}

function VgOutline({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const rawId = useId()
  const maskId = "blind_vg_mask_" + rawId.replace(/[^a-zA-Z0-9_-]/g, "_")

  return (
    <svg
      viewBox="0 0 750 895"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="750" height="895" fill="black">
        <rect fill="white" width="750" height="895" />
        <path d="M407.186 121.521C391.916 114.165 374.205 125.292 374.205 142.242V407.859C374.205 425.521 355.123 436.592 339.79 427.826L296.325 402.978C164.674 327.285 80.5666 189.616 72.8063 37.9991C72.157 25.3132 61.921 15 49.2184 15H38C25.2975 15 15 25.2975 15 38V406.158C15 533.364 88.1125 651.029 204.139 706.682L342.814 773.48C358.084 780.835 375.795 769.708 375.795 752.758V487.142C375.795 469.48 394.876 458.409 410.21 467.174L453.675 492.022C585.326 567.715 669.433 705.384 677.194 857.001C677.843 869.687 688.079 880 700.782 880H712C724.703 880 735 869.703 735 857V488.842C735 361.636 661.888 243.971 545.861 188.318L407.186 121.521Z" />
      </mask>
      <path
        d="M296.325 402.978L339.79 427.826C355.123 436.592 374.205 425.521 374.205 407.859V142.242C374.205 125.292 391.916 114.165 407.186 121.521L545.861 188.318C661.887 243.971 735 361.636 735 488.842V857C735 869.703 724.703 880 712 880H700.782C688.079 880 677.843 869.687 677.194 857.001C669.433 705.384 585.326 567.715 453.675 492.022L410.21 467.174C394.876 458.409 375.795 469.48 375.795 487.142V752.758C375.795 769.708 358.084 780.835 342.814 773.48L204.139 706.682C88.1125 651.029 15 533.364 15 406.158V38C15 25.2975 25.2975 15 38 15H49.2184C61.921 15 72.157 25.3132 72.8063 37.9991C80.5666 189.616 164.674 327.285 296.325 402.978Z"
        strokeWidth="30"
        stroke="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}

export function ColumnBlindsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const [isBlindsActive, setIsBlindsActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const targetHrefRef = useRef<string | null>(null)
  const callbackRef = useRef<(() => void) | null>(null)
  const isClosedRef = useRef(false)
  const isRouteReadyRef = useRef(false)
  const isUnveilingRef = useRef(false)

  // Disable scrolling while page transition animation is active
  useEffect(() => {
    if (!isBlindsActive) return

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis
    if (lenis) {
      lenis.stop()
    }

    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    const preventDefault = (e: Event) => {
      e.preventDefault()
    }
    window.addEventListener("wheel", preventDefault, { passive: false })
    window.addEventListener("touchmove", preventDefault, { passive: false })

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      window.removeEventListener("wheel", preventDefault)
      window.removeEventListener("touchmove", preventDefault)
      if (lenis) {
        lenis.start()
      }
    }
  }, [isBlindsActive])

  const prefetchWithBlinds = useCallback((href: string) => {
    router.prefetch(href)
  }, [router])

  const getTiming = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    return {
      duration: isMobile ? 0.32 : 0.40,
      stagger: isMobile ? 0.03 : 0.035,
    }
  }

  // Reveal destination page smoothly once both curtain is closed AND destination is mounted
  const triggerUnveil = useCallback(() => {
    if (isUnveilingRef.current || !containerRef.current) return
    isUnveilingRef.current = true

    const container = containerRef.current
    const allCols = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-col"))
    const columns = allCols.filter(col => window.getComputedStyle(col).display !== "none")
    const allLabels = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-label"))
    const labels = allLabels.filter(el => {
      const col = el.closest(".global-blind-col")
      if (col && window.getComputedStyle(col).display === "none") return false
      return window.getComputedStyle(el).display !== "none"
    })

    requestAnimationFrame(() => {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts: { immediate: boolean }) => void } }).__lenis
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo({ top: 0, behavior: "instant" })
      }

      const { duration, stagger } = getTiming()
      const exitTl = gsap.timeline({
        onComplete: () => {
          gsap.set(container, { visibility: "hidden", pointerEvents: "none" })
          setIsBlindsActive(false)
          targetHrefRef.current = null
          isClosedRef.current = false
          isRouteReadyRef.current = false
          isUnveilingRef.current = false
          if (callbackRef.current) {
            callbackRef.current()
            callbackRef.current = null
          }
        }
      })

      // Labels glide up and dissolve
      exitTl.to(labels, {
        opacity: 0,
        y: -10,
        duration: 0.12,
        ease: "power2.in"
      })
      // Columns exit upward (transformOrigin: top center) with identical cascade
      .set(columns, { transformOrigin: "top center" })
      .to(columns, {
        scaleY: 0,
        duration,
        stagger,
        ease: "power4.inOut"
      }, "-=0.08")
    })
  }, [])

  const navigateWithBlinds = useCallback((href: string, callback?: () => void) => {
    if (isBlindsActive || !containerRef.current) return

    // If already on the same page, just scroll top
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      router.push(href)
      window.scrollTo({ top: 0, behavior: "instant" })
      if (callback) callback()
      return
    }

    targetHrefRef.current = href
    callbackRef.current = callback || null
    setIsBlindsActive(true)
    isClosedRef.current = false
    isRouteReadyRef.current = false
    isUnveilingRef.current = false

    // Prefetch destination chunks and initiate route transition in parallel with curtain closing!
    router.prefetch(href)
    router.push(href)

    const container = containerRef.current
    const allCols = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-col"))
    const columns = allCols.filter(col => window.getComputedStyle(col).display !== "none")
    const allLabels = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-label"))
    const labels = allLabels.filter(el => {
      const col = el.closest(".global-blind-col")
      if (col && window.getComputedStyle(col).display === "none") return false
      return window.getComputedStyle(el).display !== "none"
    })

    const { duration, stagger } = getTiming()
    gsap.set(container, { visibility: "visible", pointerEvents: "auto" })

    const tl = gsap.timeline({
      onComplete: () => {
        isClosedRef.current = true
        // Scroll reset behind closed curtain
        window.scrollTo({ top: 0, behavior: "instant" })
        const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts: { immediate: boolean }) => void } }).__lenis
        if (lenis) {
          lenis.scrollTo(0, { immediate: true })
        }

        // If the destination route is already mounted behind the closed curtain, unveil immediately!
        if (isRouteReadyRef.current && !isUnveilingRef.current) {
          triggerUnveil()
        }
      }
    })

    // Phase 1: Columns slide up from bottom with calibrated architectural cascade
    tl.set(columns, { scaleY: 0, transformOrigin: "bottom center" })
      .set(labels, { opacity: 0, y: 10 })
      .to(columns, {
        scaleY: 1,
        duration,
        stagger,
        ease: "power4.inOut"
      })
      .to(labels, {
        opacity: 0.9,
        y: 0,
        duration: 0.16,
        stagger,
        ease: "power2.out"
      }, `-=${duration * 0.45}`)

    // Safety timeout in case navigation stalls (2.0s max)
    const safety = setTimeout(() => {
      if (isBlindsActive) {
        setIsBlindsActive(false)
        targetHrefRef.current = null
        isClosedRef.current = false
        isRouteReadyRef.current = false
        isUnveilingRef.current = false
        gsap.set(container, { visibility: "hidden", pointerEvents: "none" })
      }
    }, 2000)

    return () => clearTimeout(safety)
  }, [isBlindsActive, pathname, router, triggerUnveil])

  // Destination route mounted: unveil smoothly once curtain is fully closed
  useEffect(() => {
    if (!isBlindsActive || !targetHrefRef.current || !containerRef.current) return

    const currentNorm = pathname.replace(/\/$/, "")
    const targetNorm = targetHrefRef.current.replace(/\/$/, "")

    if (currentNorm === targetNorm) {
      isRouteReadyRef.current = true

      // If curtain has already completed its closing cascade, unveil immediately!
      if (isClosedRef.current && !isUnveilingRef.current) {
        triggerUnveil()
      }
    }
  }, [pathname, isBlindsActive, triggerUnveil])

  // Browser Back/Forward navigation safety (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (isBlindsActive && containerRef.current) {
        setIsBlindsActive(false)
        isClosedRef.current = false
        isRouteReadyRef.current = false
        isUnveilingRef.current = false
        targetHrefRef.current = null
        gsap.set(containerRef.current, { visibility: "hidden", pointerEvents: "none" })
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isBlindsActive])

  // Expose global window helper for easy invocation
  useEffect(() => {
    (window as unknown as { triggerColumnTransition?: (href: string) => void }).triggerColumnTransition = navigateWithBlinds
    return () => {
      delete (window as unknown as { triggerColumnTransition?: (href: string) => void }).triggerColumnTransition
    }
  }, [navigateWithBlinds])

  return (
    <ColumnBlindsContext.Provider value={{ navigateWithBlinds, prefetchWithBlinds, isBlindsActive }}>
      {children}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* GLOBAL ARCHITECTURAL COLUMN BLINDS OVERLAY (CHARCOAL 0.75x)   */}
      {/* 3 COLUMNS ON MOBILE (< 768px), 5 COLUMNS ON DESKTOP (≥ 768px)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none invisible z-[99999] flex w-full h-full overflow-hidden"
        style={{
          willChange: "transform",
          backgroundColor: "transparent",
          fontFamily: "FunnelDisplay, sans-serif",
        }}
      >
        {/* COLUMN 1: System info (visible on mobile & desktop) */}
        <div
          className="global-blind-col relative h-full flex flex-col justify-between items-start text-left px-3 py-6 sm:p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 w-[calc(33.333%+1px)] md:w-[calc(20%+1px)] border-r border-neutral-700"
          style={{ willChange: "transform", zIndex: 10, marginRight: "-1px" }}
        >
          <div
            className="global-blind-label text-[10px] sm:text-sm md:text-base uppercase text-[#878787] opacity-0 min-h-[24px] leading-tight font-normal text-left w-full break-words"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-0.5px" }}
          >
            SYS.2026 // EST.
          </div>
          <div
            className="global-blind-label text-sm sm:text-base md:text-xl text-[#878787] opacity-0 text-left select-none min-h-[24px] w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            +
          </div>
          <div
            className="global-blind-label text-[10px] sm:text-sm md:text-base uppercase text-[#878787] opacity-0 leading-tight min-h-[24px] font-normal text-left w-full break-words"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-0.5px" }}
          >
            BASED IN INDIA
          </div>
        </div>

        {/* COLUMN 2: Middle column on mobile (2 of 3), 2nd column on desktop (2 of 5) */}
        <div
          className="global-blind-col relative h-full flex flex-col justify-between items-center text-center px-3 py-6 sm:p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 w-[calc(33.333%+1px)] md:w-[calc(20%+1px)] border-r border-neutral-700"
          style={{ willChange: "transform", zIndex: 9, marginRight: "-1px" }}
        >
          <div className="min-h-[24px]" />
          <div className="global-blind-label flex md:hidden items-center justify-center w-full min-h-[24px] opacity-0 select-none pointer-events-none">
            <VgOutline
              className="w-10 sm:w-14 h-auto text-neutral-700"
              style={{ color: "#404040" }}
            />
          </div>
          <div className="min-h-[24px]" />
        </div>

        {/* COLUMN 3: Hidden on mobile, 3rd column on desktop (Center of 5 columns) */}
        <div
          className="global-blind-col relative h-full flex-col justify-between items-center text-center p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 hidden md:flex md:w-[calc(20%+1px)] border-r border-neutral-700"
          style={{ willChange: "transform", zIndex: 8, marginRight: "-1px" }}
        >
          <div className="min-h-[24px]" />
          <div className="global-blind-label flex items-center justify-center w-full min-h-[24px] opacity-0 select-none pointer-events-none">
            <VgOutline
              className="w-12 md:w-16 h-auto text-neutral-700"
              style={{ color: "#404040" }}
            />
          </div>
          <div className="min-h-[24px]" />
        </div>

        {/* COLUMN 4: Hidden on mobile, 4th column on desktop (4 of 5) */}
        <div
          className="global-blind-col relative h-full flex-col justify-between items-start text-left p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 hidden md:flex md:w-[calc(20%+1px)] border-r border-neutral-700"
          style={{ willChange: "transform", zIndex: 7, marginRight: "-1px" }}
        >
          <div className="min-h-[24px]" />
          <div className="min-h-[24px]" />
          <div className="min-h-[24px]" />
        </div>

        {/* COLUMN 5: Last column (3 of 3 on mobile, 5 of 5 on desktop). Right-aligned flush with right edge. */}
        <div
          className="global-blind-col relative h-full flex flex-col justify-between items-end text-right px-3 py-6 sm:p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 w-[calc(33.334%+1px)] md:w-[calc(20%+1px)] border-r-0"
          style={{ willChange: "transform", zIndex: 6, marginRight: "0" }}
        >
          <div
            className="global-blind-label text-[10px] sm:text-sm md:text-base uppercase text-[#878787] opacity-0 min-h-[24px] leading-tight font-normal text-right w-full break-words"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-0.5px" }}
          >
            PRODUCT DESIGNER
          </div>
          <div
            className="global-blind-label text-sm sm:text-base md:text-xl text-[#878787] opacity-0 text-right select-none min-h-[24px] w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            +
          </div>
          <div
            className="global-blind-label text-[10px] sm:text-sm md:text-base uppercase text-[#878787] opacity-0 leading-tight min-h-[24px] font-normal text-right w-full break-words"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-0.5px" }}
          >
            © VARUN GUPTA
          </div>
        </div>
      </div>
    </ColumnBlindsContext.Provider>
  )
}
