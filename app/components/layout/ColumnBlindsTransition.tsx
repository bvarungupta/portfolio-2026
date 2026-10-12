"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
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
  return (
    <svg
      viewBox="0 0 720 487"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M486.687 0.138672C497.204 0.132513 528.893 -0.502689 537.722 1C542.708 1.84988 547.36 4.17744 551.166 7.71484C565.617 21.3984 557.044 62.9587 559.3 83.6055C564.402 133.135 622.345 95.9852 645.867 117.933C657.599 128.877 654.035 170.827 654 187.641L653.758 288.163C653.712 305.174 653.353 324.475 653.908 340.442C654.498 380.606 693.42 357.865 710.578 371.818C724.6 383.224 718.423 430.013 719.765 447.186C720.424 455.518 718.827 470.116 713.655 476.125C707.72 483.009 696.624 485.759 688.074 485.695C664.402 485.793 641.019 485.311 617.382 485.233C601.647 484.864 585.483 486.823 569.829 485.23C540.488 482.246 545.532 449.748 545.647 427.298L545.821 370.581L545.798 172.285C546.318 143.677 544.756 131.16 513.274 130.817C476.875 130.687 440.777 130.604 404.354 130.919C393.919 131.009 383.032 132.478 377.362 144.056C376.136 146.568 374.816 153.197 374.724 156.064C373.775 186.3 374.319 216.761 374.331 247.049L374.516 445.772C374.435 477.617 365.734 488 335.259 485.691C318.124 484.393 289.268 490.352 276.842 476.696L276.333 476.132C264.242 462.907 273.753 181.561 270.722 145.042C270.313 140.143 270.448 135.919 271.044 132.282C225.959 134.021 150.225 127.641 126.317 132.515C120.604 133.678 114.844 136.073 110.66 140.486C106.732 144.643 106.326 151.617 105.851 157.235C103.707 182.263 105.34 208.854 105.375 234.021L105.364 378.748C105.26 398.93 108.806 452.046 103.139 467.859C100.693 474.695 96.1041 480.391 89.6836 483.272C80.0876 487.578 25.5728 487.029 15.6445 482.555C9.16025 479.632 5.39559 475.158 2.79492 468.272C1.53286 464.928 0.923199 461.614 0.796875 458.007C-0.977457 407.212 0.763498 355.575 0.783203 304.69C0.804064 252.115 -0.846762 198.941 0.773438 146.426C0.956549 140.507 0.710553 132.121 3.03418 126.645C14.6189 99.3418 51.0929 117.335 71.5459 108.885C100.334 96.9895 78.4302 41.6801 88.8027 17.5996C92.859 8.17373 99.4651 4.7352 108.053 1.30273L233.045 1.12109C250.672 1.08051 274.234 -1.14566 291.316 1.56543C297.042 2.47612 303.717 5.25433 307.819 9.66016C319.119 21.8027 315.514 78.1801 315.236 96.4512C315.162 101.318 314.931 106.026 313.997 110.38C325.537 110.773 336.82 111.695 344.19 109.019C385.171 94.134 333.709 15.212 384.015 0.28418L486.687 0.138672Z"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinejoin="round"
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
  const isHoldingRef = useRef(false)

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

  const navigateWithBlinds = useCallback((href: string, callback?: () => void) => {
    if (isBlindsActive || !containerRef.current) return

    // If already on the same page, just scroll top
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Prefetch destination chunks immediately upon user intent
    router.prefetch(href)

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
    isHoldingRef.current = false

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
        isHoldingRef.current = true
        // Swap route while curtain is fully closed
        router.push(href)
        window.scrollTo({ top: 0, behavior: "instant" })
        const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts: { immediate: boolean }) => void } }).__lenis
        if (lenis) {
          lenis.scrollTo(0, { immediate: true })
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

    // Safety timeout in case navigation stalls (1.6s max)
    const safety = setTimeout(() => {
      if (isBlindsActive) {
        setIsBlindsActive(false)
        isHoldingRef.current = false
        targetHrefRef.current = null
        gsap.set(container, { visibility: "hidden", pointerEvents: "none" })
      }
    }, 1600)

    return () => clearTimeout(safety)
  }, [isBlindsActive, pathname, router])

  // Destination route mounted: unveil smoothly to top without artificial delay
  useEffect(() => {
    if (!isBlindsActive || !targetHrefRef.current || !containerRef.current) return

    const currentNorm = pathname.replace(/\/$/, "")
    const targetNorm = targetHrefRef.current.replace(/\/$/, "")

    if (currentNorm === targetNorm) {
      const container = containerRef.current
      const allCols = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-col"))
      const columns = allCols.filter(col => window.getComputedStyle(col).display !== "none")
      const allLabels = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-label"))
      const labels = allLabels.filter(el => {
        const col = el.closest(".global-blind-col")
        if (col && window.getComputedStyle(col).display === "none") return false
        return window.getComputedStyle(el).display !== "none"
      })

      // Frame tick for the new page DOM to mount cleanly behind closed blinds
      requestAnimationFrame(() => {
        const { duration, stagger } = getTiming()
        const exitTl = gsap.timeline({
          onComplete: () => {
            gsap.set(container, { visibility: "hidden", pointerEvents: "none" })
            setIsBlindsActive(false)
            isHoldingRef.current = false
            targetHrefRef.current = null
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
    }
  }, [pathname, isBlindsActive])

  // Browser Back/Forward navigation safety (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (isBlindsActive && containerRef.current) {
        setIsBlindsActive(false)
        isHoldingRef.current = false
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
