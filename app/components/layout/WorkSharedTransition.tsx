"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"

/**
 * Known case-study hero images map.
 * The shared element morph ONLY activates when the clicked card's thumbnail
 * matches the destination page's hero cover image.
 */
export const WORK_HERO_IMAGES: Record<string, string> = {
  '/works/sol': '/images/WorkImages/Sol/main_thumb.png',
  '/works/smartNation': '/images/WorkImages/smartNationImages/SNN.png',
  '/works/blumeHealth': '/images/WorkImages/blumeHealthImages/bh-01.png',
  '/works/skinSage': '/images/WorkImages/skinSageImages/SS-01B.png',
  '/works/skillRadius': '/images/WorkImages/skillradius/SR-01.png',
}

export const hasMatchingHeroImage = (
  targetHref: string,
  thumbnailSrc?: string,
  explicitHeroSrc?: string
): boolean => {
  if (!thumbnailSrc) return false
  const normTarget = targetHref.replace(/\/$/, '')
  const destinationHero = explicitHeroSrc || WORK_HERO_IMAGES[normTarget]
  return Boolean(destinationHero && destinationHero === thumbnailSrc)
}

interface MorphPayload {
  imageSrc: string
  title: string
  targetHref: string
  fromRect: {
    top: number
    left: number
    width: number
    height: number
  }
}

interface WorkTransitionContextType {
  startWorkTransition: (payload: {
    imageSrc: string
    title: string
    targetHref: string
    sourceElement: HTMLElement | null
    heroImageSrc?: string
  }) => void
  isTransitioning: boolean
}

const WorkTransitionContext = createContext<WorkTransitionContextType | null>(null)

export const useWorkTransition = () => {
  const context = useContext(WorkTransitionContext)
  if (!context) {
    throw new Error("useWorkTransition must be used within WorkSharedTransitionProvider")
  }
  return context
}

export function WorkSharedTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const [activeMorph, setActiveMorph] = useState<MorphPayload | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const backdropRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const targetHrefRef = useRef<string | null>(null)
  const morphTimelineRef = useRef<gsap.core.Timeline | null>(null)

  // Disable scrolling while work shared transition animation is active
  useEffect(() => {
    if (!isTransitioning) return

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
  }, [isTransitioning])

  const startWorkTransition = useCallback(
    ({
      imageSrc,
      title,
      targetHref,
      sourceElement,
      heroImageSrc,
    }: {
      imageSrc: string
      title: string
      targetHref: string
      sourceElement: HTMLElement | null
      heroImageSrc?: string
    }) => {
      // Condition: ONLY perform shared element morph if thumbnail and destination hero cover image are identical!
      const canMorph = hasMatchingHeroImage(targetHref, imageSrc, heroImageSrc)

      if (!sourceElement || !canMorph) {
        router.push(targetHref)
        return
      }

      const rect = sourceElement.getBoundingClientRect()
      const payload: MorphPayload = {
        imageSrc,
        title,
        targetHref,
        fromRect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      }

      targetHrefRef.current = targetHref
      setActiveMorph(payload)
      setIsTransitioning(true)
    },
    [router]
  )

  // Run the initial expanding card morph
  useEffect(() => {
    if (!activeMorph || !overlayRef.current || !imgRef.current) return

    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const { fromRect, targetHref } = activeMorph

    // 1. Lock clone at the exact clicked card coordinates
    gsap.set(overlay, {
      top: fromRect.top,
      left: fromRect.left,
      width: fromRect.width,
      height: fromRect.height,
      opacity: 1,
      visibility: "visible",
      scale: 1,
      zIndex: 100000,
      pointerEvents: "none",
      boxShadow: "0 25px 60px -15px rgba(0,0,0,0.25)",
      borderRadius: 0,
    })

    if (backdrop) {
      gsap.set(backdrop, {
        opacity: 0,
        visibility: "visible",
        pointerEvents: "auto",
      })
    }

    // 2. Pre-calculate estimated target cover banner dimensions
    const isMobile = window.innerWidth < 768
    const maxContainerWidth = 1024
    const targetWidth = isMobile
      ? window.innerWidth - 32
      : Math.min(window.innerWidth - 48, maxContainerWidth)
    const targetLeft = isMobile ? 16 : (window.innerWidth - targetWidth) / 2
    const targetHeight = targetWidth * (9 / 16)
    const targetTop = isMobile ? 135 : 170

    // 3. Initiate route transition & scroll reset
    router.push(targetHref)
    window.scrollTo({ top: 0, behavior: "instant" })
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts: { immediate: boolean }) => void } }).__lenis
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }

    // 4. Fluid expansion timeline
    const tl = gsap.timeline()
    morphTimelineRef.current = tl

    // Smooth backdrop veil fade in
    if (backdrop) {
      tl.to(
        backdrop,
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
        },
        0
      )
    }

    // Expanding card morph with organic acceleration
    tl.to(
      overlay,
      {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        duration: 0.65,
        ease: "power3.inOut",
      },
      0
    )

    // Safety timeout in case navigation stalls or is aborted
    const safetyTimer = setTimeout(() => {
      if (isTransitioning) {
        setActiveMorph(null)
        setIsTransitioning(false)
        targetHrefRef.current = null
        if (overlay) gsap.set(overlay, { visibility: "hidden" })
        if (backdrop) gsap.set(backdrop, { visibility: "hidden" })
      }
    }, 2500)

    return () => {
      clearTimeout(safetyTimer)
    }
  }, [activeMorph, router, isTransitioning])

  // Destination page mounted: find real hero cover element & gracefully hand off
  useEffect(() => {
    if (!isTransitioning || !targetHrefRef.current) return

    const currentNormalized = pathname.replace(/\/$/, "")
    const targetNormalized = targetHrefRef.current.replace(/\/$/, "")

    if (currentNormalized === targetNormalized) {
      const overlay = overlayRef.current
      const backdrop = backdropRef.current

      // Check for real destination hero image
      requestAnimationFrame(() => {
        const heroEl = document.querySelector<HTMLElement>("[data-work-hero]")
        const destRect = heroEl ? heroEl.getBoundingClientRect() : null

        const handoffTl = gsap.timeline({
          delay: 0.08,
          onComplete: () => {
            setActiveMorph(null)
            setIsTransitioning(false)
            targetHrefRef.current = null
            if (overlay) gsap.set(overlay, { visibility: "hidden" })
            if (backdrop) gsap.set(backdrop, { visibility: "hidden" })
          },
        })

        // If target element exists in DOM, align precisely to its actual rect
        if (overlay && destRect && destRect.width > 0 && destRect.height > 0) {
          handoffTl.to(
            overlay,
            {
              top: destRect.top,
              left: destRect.left,
              width: destRect.width,
              height: destRect.height,
              boxShadow: "0 0 0 rgba(0,0,0,0)",
              duration: 0.22,
              ease: "power2.out",
            },
            0
          )
        }

        // Crossfade out clone to reveal real page
        if (overlay) {
          handoffTl.to(
            overlay,
            {
              opacity: 0,
              duration: 0.28,
              ease: "power2.out",
            },
            destRect ? 0.12 : 0
          )
        }

        if (backdrop) {
          handoffTl.to(
            backdrop,
            {
              opacity: 0,
              duration: 0.32,
              ease: "power2.out",
            },
            0.05
          )
        }
      })
    }
  }, [pathname, isTransitioning])

  return (
    <WorkTransitionContext.Provider value={{ startWorkTransition, isTransitioning }}>
      {children}

      {/* Seamless backdrop veil during expansion */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[99999] pointer-events-none invisible"
        style={{ willChange: "opacity" }}
      />

      {/* Shared Element Floating Clone */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed pointer-events-none overflow-hidden z-[100000] invisible border border-gray-200"
        style={{
          willChange: "transform, top, left, width, height, opacity",
        }}
      >
        {activeMorph && (
          <img
            ref={imgRef}
            src={activeMorph.imageSrc}
            alt={activeMorph.title}
            className="w-full h-full object-cover block"
          />
        )}
      </div>
    </WorkTransitionContext.Provider>
  )
}

