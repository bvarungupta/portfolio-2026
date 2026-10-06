"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"


interface ColumnBlindsContextType {
  navigateWithBlinds: (href: string, callback?: () => void) => void
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

function VgOutline({ maskId, className }: { maskId: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 720 487"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask id={maskId} fill="white">
        <path d="M486.687 0.138672C497.204 0.132513 528.893 -0.502689 537.722 1C542.708 1.84988 547.36 4.17744 551.166 7.71484C565.617 21.3984 557.044 62.9587 559.3 83.6055C564.402 133.135 622.345 95.9852 645.867 117.933C657.599 128.877 654.035 170.827 654 187.641L653.758 288.163C653.712 305.174 653.353 324.475 653.908 340.442C654.498 380.606 693.42 357.865 710.578 371.818C724.6 383.224 718.423 430.013 719.765 447.186C720.424 455.518 718.827 470.116 713.655 476.125C707.72 483.009 696.624 485.759 688.074 485.695C664.402 485.793 641.019 485.311 617.382 485.233C601.647 484.864 585.483 486.823 569.829 485.23C540.488 482.246 545.532 449.748 545.647 427.298L545.821 370.581L545.798 172.285C546.318 143.677 544.756 131.16 513.274 130.817C476.875 130.687 440.777 130.604 404.354 130.919C393.919 131.009 383.032 132.478 377.362 144.056C376.136 146.568 374.816 153.197 374.724 156.064C373.775 186.3 374.319 216.761 374.331 247.049L374.516 445.772C374.435 477.617 365.734 488 335.259 485.691C318.124 484.393 289.268 490.352 276.842 476.696L276.333 476.132C264.242 462.907 273.753 181.561 270.722 145.042C270.313 140.143 270.448 135.919 271.044 132.282C225.959 134.021 150.225 127.641 126.317 132.515C120.604 133.678 114.844 136.073 110.66 140.486C106.732 144.643 106.326 151.617 105.851 157.235C103.707 182.263 105.34 208.854 105.375 234.021L105.364 378.748C105.26 398.93 108.806 452.046 103.139 467.859C100.693 474.695 96.1041 480.391 89.6836 483.272C80.0876 487.578 25.5728 487.029 15.6445 482.555C9.16025 479.632 5.39559 475.158 2.79492 468.272C1.53286 464.928 0.923199 461.614 0.796875 458.007C-0.977457 407.212 0.763498 355.575 0.783203 304.69C0.804064 252.115 -0.846762 198.941 0.773438 146.426C0.956549 140.507 0.710553 132.121 3.03418 126.645C14.6189 99.3418 51.0929 117.335 71.5459 108.885C100.334 96.9895 78.4302 41.6801 88.8027 17.5996C92.859 8.17373 99.4651 4.7352 108.053 1.30273L233.045 1.12109C250.672 1.08051 274.234 -1.14566 291.316 1.56543C297.042 2.47612 303.717 5.25433 307.819 9.66016C319.119 21.8027 315.514 78.1801 315.236 96.4512C315.162 101.318 314.931 106.026 313.997 110.38C325.537 110.773 336.82 111.695 344.19 109.019C385.171 94.134 333.709 15.212 384.015 0.28418L486.687 0.138672Z" />
      </mask>
      <path
        d="M486.687 0.138672L486.681 -9.86133L486.672 -9.86132L486.687 0.138672ZM537.722 1L539.402 -8.85785L539.4 -8.85821L537.722 1ZM551.166 7.71484L558.042 0.453627L558.008 0.421474L557.973 0.389639L551.166 7.71484ZM559.3 83.6055L569.247 82.5807L569.244 82.5499L569.241 82.5192L559.3 83.6055ZM645.867 117.933L639.045 125.244L639.046 125.245L645.867 117.933ZM654 187.641L664 187.665V187.661L654 187.641ZM653.758 288.163L663.758 288.19L663.758 288.187L653.758 288.163ZM653.908 340.442L663.907 340.295L663.906 340.195L663.902 340.095L653.908 340.442ZM710.578 371.818L716.888 364.061L716.887 364.06L710.578 371.818ZM719.765 447.186L709.795 447.965L709.796 447.975L719.765 447.186ZM713.655 476.125L721.229 482.655L721.234 482.649L713.655 476.125ZM688.074 485.695L688.149 475.696L688.091 475.695L688.033 475.695L688.074 485.695ZM617.382 485.233L617.147 495.231L617.248 495.233L617.349 495.233L617.382 485.233ZM569.829 485.23L570.841 475.282L570.841 475.282L569.829 485.23ZM545.647 427.298L555.647 427.349L555.647 427.339V427.328L545.647 427.298ZM545.821 370.581L555.821 370.612L555.821 370.596V370.58L545.821 370.581ZM545.798 172.285L535.799 172.103L535.798 172.195V172.286L545.798 172.285ZM513.274 130.817L513.383 120.818L513.347 120.818L513.31 120.817L513.274 130.817ZM404.354 130.919L404.441 140.919L404.441 140.919L404.354 130.919ZM377.362 144.056L368.381 139.658L368.376 139.669L377.362 144.056ZM374.724 156.064L364.729 155.742L364.729 155.751L374.724 156.064ZM374.331 247.049L364.331 247.053V247.058L374.331 247.049ZM374.516 445.772L384.516 445.798L384.516 445.781V445.763L374.516 445.772ZM335.259 485.691L334.503 495.663H334.504L335.259 485.691ZM276.842 476.696L269.414 483.392L269.43 483.409L269.446 483.427L276.842 476.696ZM276.333 476.132L283.761 469.437L283.737 469.41L283.713 469.384L276.333 476.132ZM270.722 145.042L280.687 144.215L280.687 144.212L270.722 145.042ZM271.044 132.282L280.912 133.899L282.892 121.818L270.659 122.29L271.044 132.282ZM126.317 132.515L128.313 142.313L128.315 142.313L126.317 132.515ZM110.66 140.486L103.403 133.606L103.398 133.612L103.393 133.617L110.66 140.486ZM105.851 157.235L115.814 158.089L115.815 158.078L105.851 157.235ZM105.375 234.021L115.375 234.021V234.014L115.375 234.007L105.375 234.021ZM105.364 378.748L115.364 378.8L115.364 378.774V378.749L105.364 378.748ZM103.139 467.859L93.7249 464.486L93.723 464.491L103.139 467.859ZM89.6836 483.272L93.7769 492.396L93.7786 492.396L89.6836 483.272ZM15.6445 482.555L11.5355 491.672L11.5357 491.672L15.6445 482.555ZM2.79492 468.272L-6.56093 471.803L-6.56011 471.806L2.79492 468.272ZM0.796875 458.007L-9.19703 458.356L-9.197 458.357L0.796875 458.007ZM0.783203 304.69L-9.2168 304.686V304.687L0.783203 304.69ZM0.773438 146.426L-9.22178 146.117L-9.22181 146.117L0.773438 146.426ZM3.03418 126.645L-6.17142 122.739L-6.17143 122.739L3.03418 126.645ZM71.5459 108.885L75.3644 118.127L75.3647 118.127L71.5459 108.885ZM88.8027 17.5996L97.9869 21.5557L97.9883 21.5525L88.8027 17.5996ZM108.053 1.30273L108.038 -8.69726L106.121 -8.69447L104.341 -7.983L108.053 1.30273ZM233.045 1.12109L233.059 11.1211L233.068 11.1211L233.045 1.12109ZM291.316 1.56543L292.887 -8.31041L292.884 -8.31097L291.316 1.56543ZM307.819 9.66016L315.14 2.84779L315.138 2.8454L307.819 9.66016ZM315.236 96.4512L325.235 96.6043V96.6034L315.236 96.4512ZM313.997 110.38L304.22 108.282L301.712 119.967L313.656 120.374L313.997 110.38ZM344.19 109.019L347.604 118.418L347.604 118.418L344.19 109.019ZM384.015 0.28418L384 -9.71581L382.555 -9.71376L381.17 -9.30264L384.015 0.28418Z"
        fill="currentColor"
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
  const isHoldingRef = useRef(false)

  // 0.75x calibrated timing for luxury architectural pacing
  const DURATION = 0.56
  const STAGGER = 0.053

  const navigateWithBlinds = useCallback((href: string, callback?: () => void) => {
    if (isBlindsActive || !containerRef.current) return

    // If already on the same page, just scroll top
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    targetHrefRef.current = href
    callbackRef.current = callback || null
    setIsBlindsActive(true)
    isHoldingRef.current = false

    const container = containerRef.current
    const allCols = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-col"))
    const columns = allCols.filter(col => window.getComputedStyle(col).display !== "none")
    const labels = container.querySelectorAll<HTMLElement>(".global-blind-label")

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

    // Phase 1: Columns slide up from bottom with 0.75x architectural cascade
    tl.set(columns, { scaleY: 0, transformOrigin: "bottom center" })
      .set(labels, { opacity: 0, y: 14 })
      .to(columns, {
        scaleY: 1,
        duration: DURATION,
        stagger: STAGGER,
        ease: "power4.inOut"
      })
      .to(labels, {
        opacity: 0.9,
        y: 0,
        duration: 0.22,
        stagger: STAGGER,
        ease: "power2.out"
      }, `-=${DURATION * 0.45}`)

    // Safety timeout in case navigation stalls
    const safety = setTimeout(() => {
      if (isBlindsActive) {
        setIsBlindsActive(false)
        isHoldingRef.current = false
        targetHrefRef.current = null
        gsap.set(container, { visibility: "hidden", pointerEvents: "none" })
      }
    }, 3500)

    return () => clearTimeout(safety)
  }, [isBlindsActive, pathname, router, DURATION, STAGGER])

  // Destination route mounted: unveil smoothly to top
  useEffect(() => {
    if (!isBlindsActive || !targetHrefRef.current || !containerRef.current) return

    const currentNorm = pathname.replace(/\/$/, "")
    const targetNorm = targetHrefRef.current.replace(/\/$/, "")

    if (currentNorm === targetNorm) {
      const container = containerRef.current
      const allCols = Array.from(container.querySelectorAll<HTMLElement>(".global-blind-col"))
      const columns = allCols.filter(col => window.getComputedStyle(col).display !== "none")
      const labels = container.querySelectorAll<HTMLElement>(".global-blind-label")

      // Small tick for the new page DOM to mount cleanly behind closed blinds
      requestAnimationFrame(() => {
        const exitTl = gsap.timeline({
          delay: 0.08,
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
          y: -14,
          duration: 0.18,
          ease: "power2.in"
        })
        // Columns exit upward (transformOrigin: top center) with identical 0.75x cascade
        .set(columns, { transformOrigin: "top center" })
        .to(columns, {
          scaleY: 0,
          duration: DURATION,
          stagger: STAGGER,
          ease: "power4.inOut"
        }, "-=0.06")
      })
    }
  }, [pathname, isBlindsActive, DURATION, STAGGER])

  // Expose global window helper for easy invocation
  useEffect(() => {
    (window as unknown as { triggerColumnTransition?: (href: string) => void }).triggerColumnTransition = navigateWithBlinds
    return () => {
      delete (window as unknown as { triggerColumnTransition?: (href: string) => void }).triggerColumnTransition
    }
  }, [navigateWithBlinds])

  return (
    <ColumnBlindsContext.Provider value={{ navigateWithBlinds, isBlindsActive }}>
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
          className="global-blind-col relative h-full flex flex-col justify-between items-start text-left p-4 sm:p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 w-[calc(33.333%+1px)] md:w-[calc(20%+1px)] border-r border-neutral-700"
          style={{ willChange: "transform", zIndex: 10, marginRight: "-1px" }}
        >
          <div
            className="global-blind-label text-xs sm:text-sm md:text-base uppercase text-[#878787] opacity-0 min-h-[24px] whitespace-nowrap overflow-hidden font-normal text-left w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            SYS.2026 // EST.
          </div>
          <div
            className="global-blind-label text-base md:text-xl text-[#878787] opacity-0 text-left select-none min-h-[24px] w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            +
          </div>
          <div
            className="global-blind-label text-xs sm:text-sm md:text-base uppercase text-[#878787] opacity-0 leading-tight min-h-[24px] whitespace-nowrap overflow-hidden font-normal text-left w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            BASED IN INDIA
          </div>
        </div>

        {/* COLUMN 2: Middle column on mobile (2 of 3), 2nd column on desktop (2 of 5) */}
        <div
          className="global-blind-col relative h-full flex flex-col justify-between items-center text-center p-4 sm:p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 w-[calc(33.333%+1px)] md:w-[calc(20%+1px)] border-r border-neutral-700"
          style={{ willChange: "transform", zIndex: 9, marginRight: "-1px" }}
        >
          <div className="min-h-[24px]" />
          <div className="flex items-center justify-center w-full min-h-[24px]">
            <VgOutline
              maskId="vg-blind-mask-mobile"
              className="global-blind-label block md:hidden w-10 sm:w-12 h-auto text-neutral-700 opacity-0 select-none pointer-events-none"
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
          <div className="flex items-center justify-center w-full min-h-[24px]">
            <VgOutline
              maskId="vg-blind-mask-desktop"
              className="global-blind-label w-12 md:w-14 h-auto text-neutral-700 opacity-0 select-none pointer-events-none"
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
          className="global-blind-col relative h-full flex flex-col justify-between items-end text-right p-4 sm:p-6 md:p-10 bg-[#0E0E0E] text-neutral-700 select-none shrink-0 grow-0 w-[calc(33.334%+1px)] md:w-[calc(20%+1px)] border-r-0"
          style={{ willChange: "transform", zIndex: 6, marginRight: "0" }}
        >
          <div
            className="global-blind-label text-xs sm:text-sm md:text-base uppercase text-[#878787] opacity-0 min-h-[24px] whitespace-nowrap overflow-hidden font-normal text-right w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            PRODUCT DESIGNER
          </div>
          <div
            className="global-blind-label text-base md:text-xl text-[#878787] opacity-0 text-right select-none min-h-[24px] w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            +
          </div>
          <div
            className="global-blind-label text-xs sm:text-sm md:text-base uppercase text-[#878787] opacity-0 leading-tight min-h-[24px] whitespace-nowrap overflow-hidden font-normal text-right w-full"
            style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "-1px" }}
          >
            © VARUN GUPTA
          </div>
        </div>
      </div>
    </ColumnBlindsContext.Provider>
  )
}
