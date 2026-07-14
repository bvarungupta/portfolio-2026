"use client"

import { useEffect, useRef, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"

declare global {
  interface Window {
    playSpiralIn?: () => Promise<void>
  }
}

export default function SpiralTransitionOverlay() {
  const pathname = usePathname()
  const router = useRouter()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const lengthRef = useRef<number>(0)

  const playSpiralIn = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const path = pathRef.current
      const wrapper = wrapperRef.current
      if (!path || !wrapper) {
        resolve()
        return
      }

      const length = lengthRef.current || path.getTotalLength()
      lengthRef.current = length

      gsap.killTweensOf(path)
      gsap.killTweensOf(wrapper)

      gsap.set(wrapper, {
        visibility: "visible",
        pointerEvents: "auto",
      })

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        attr: { "stroke-width": 100 },
        stroke: "#151515",
        opacity: 0,
      })

      const tl = gsap.timeline({
        onComplete: () => {
          resolve()
        },
      })

      tl.to(path, {
        opacity: 1,
        duration: 0.5,
        ease: "sine.inOut",
      })

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "sine.inOut",
        },
        "<"
      )

      tl.to(
        path,
        {
          attr: { "stroke-width": 400 },
          duration: 1.4,
          ease: "sine.inOut",
        },
        "<+=0.18"
      )
    })
  }, [])

  const playSpiralOut = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const path = pathRef.current
      const wrapper = wrapperRef.current
      if (!path || !wrapper) {
        resolve()
        return
      }

      const length = lengthRef.current || path.getTotalLength()
      lengthRef.current = length

      gsap.killTweensOf(path)
      gsap.killTweensOf(wrapper)

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(wrapper, {
            visibility: "hidden",
            pointerEvents: "none",
          })
          resolve()
        },
      })

      tl.to(path, {
        attr: { "stroke-width": 100 },
        duration: 1.0,
        ease: "sine.inOut",
      })

      tl.to(
        path,
        {
          strokeDashoffset: -length,
          duration: 1.0,
          ease: "sine.inOut",
        },
        "<+=0.45"
      )
    })
  }, [])

  // Expose global method and intercept standard link clicks pointing to /about
  useEffect(() => {
    window.playSpiralIn = playSpiralIn

    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      // Check if clicking link pointing to /about
      if (href === "/about" || (href && href.endsWith("/about"))) {
        e.preventDefault()
        playSpiralIn().then(() => {
          router.push("/about")
        })
      }
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      window.playSpiralIn = undefined
      document.removeEventListener("click", handleLinkClick)
    }
  }, [playSpiralIn, router])

  // Watch pathname to trigger the spiral out/reveal animation when we land on /about
  useEffect(() => {
    const path = pathRef.current
    const wrapper = wrapperRef.current
    if (!path || !wrapper) return

    const length = path.getTotalLength()
    lengthRef.current = length

    if (pathname === "/about") {
      // Set to fully covered state first
      gsap.set(wrapper, {
        visibility: "visible",
        pointerEvents: "auto",
      })
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: 0,
        attr: { "stroke-width": 400 },
        stroke: "#151515",
        opacity: 1,
      })

      // Run spiral-out reveal transition
      playSpiralOut()
    } else {
      // Hide completely on other pages
      gsap.set(wrapper, {
        visibility: "hidden",
        pointerEvents: "none",
      })
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        attr: { "stroke-width": 100 },
        stroke: "#151515",
        opacity: 0,
      })
    }
  }, [pathname, playSpiralOut])

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 overflow-hidden w-full h-screen pointer-events-none invisible"
      style={{ zIndex: 20000, willChange: "visibility, pointer-events" }}
    >
      <div className="w-full h-full grid place-items-center">
        <svg
          className="block w-[125vw] h-full"
          viewBox="-360 -360 760 760"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d="m0 0c3.36 0.06 6.6-2.82 7.07-7.07 0.59-4.19-1.79-9.6-7.07-12.93-5.18-3.4-13.27-4.43-21.21-1.21-7.92 3.09-15.48 10.7-18.79 21.21-3.42 10.46-2.3 23.68 4.64 35.36 6.83 11.64 19.57 21.35 35.36 24.64 15.69 3.43 34.14 0.2 49.5-10.5 15.38-10.52 27.21-28.47 30.5-49.5 3.43-20.92-1.92-44.6-16.36-63.64-14.2-19.1-37.37-33.1-63.64-36.36-26.16-3.45-55.05 4.06-77.78 22.22-22.82 17.9-38.98 46.25-42.22 77.78-3.48 31.43 6.2 65.49 28.08 91.92 21.58 26.55 55.16 44.87 91.92 48.08 36.66 3.5 75.94-8.33 106.07-33.93 30.27-25.28 50.74-64.07 53.93-106.07 3.53-41.9-10.46-86.4-39.79-120.21-28.97-33.99-72.97-56.62-120.21-59.79-47.13-3.56-96.85 12.6-134.35 45.65-37.71 32.65-62.51 81.88-65.65 134.35-3.55 52.4 14.72 107.29 51.51 148.49 36.35 41.41 90.75 68.41 148.49 71.51 57.63 3.58 117.75-16.86 162.63-57.37 45.14-40.03 74.29-99.66 77.37-162.63 3.62-62.86-19.02-128.21-63.22-176.78-43.73-48.85-108.57-80.17-176.78-83.22-68.13-3.64-138.65 21.15-190.92 69.08-52.57 47.43-86.06 117.45-89.08 190.92-3.66 73.36 23.29 149.1 74.94 205.06 51.12 56.3 126.35 91.94 205.06 94.94 78.6 3.69 159.56-25.42 219.2-80.8 60.03-54.8 97.82-135.26 100.8-219.2 3.72-83.84-27.56-170.01-86.65-233.35-58.51-63.77-144.14-103.69-233.35-106.65-89.07-3.71-180.46 29.68-247.49 92.51-67.51 62.18-109.54 153.08-112.51 247.49-3.74 94.33 31.82 190.91 98.37 261.63 65.88 71.23 161.96 115.43 261.63 118.37 99.57 3.76 201.36-33.95 275.77-104.23 74.96-69.57 121.31-170.86 124.23-275.77"
            fill="none"
            stroke="none"
            strokeWidth="100"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  )
}
