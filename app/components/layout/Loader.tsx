"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const loaderRef = useRef<HTMLDivElement>(null)
  const exitedRef = useRef(false)

  useEffect(() => {
    const exit = () => {
      if (exitedRef.current) return
      exitedRef.current = true
      setProgress(100)
      setTimeout(() => {
        if (loaderRef.current) {
          gsap.to(loaderRef.current, {
            y: "-100%",
            duration: 0.9,
            ease: "power3.inOut",
            onComplete: () => {
              if (loaderRef.current) loaderRef.current.style.display = "none"
            },
          })
        }
      }, 400)
    }

    // If browser already finished loading (cached page, fast network)
    if (document.readyState === "complete") {
      exit()
      return
    }

    // Count already-loaded resources as a starting baseline
    let loadedCount = performance.getEntriesByType("resource").length
    // Estimate total — we don't know the final count upfront so we use
    // double the current count (or 30 minimum) as a working estimate
    const totalEstimate = Math.max(loadedCount * 2, 30)

    // Reflect the baseline immediately
    setProgress(Math.min(Math.floor((loadedCount / totalEstimate) * 85), 85))

    // Watch each resource as it finishes loading
    const observer = new PerformanceObserver((list) => {
      loadedCount += list.getEntries().length
      // Cap at 90 — the final 10 jumps to 100 only when everything is truly done
      const pct = Math.min(Math.floor((loadedCount / totalEstimate) * 90), 90)
      setProgress(pct)
    })

    observer.observe({ entryTypes: ["resource"] })

    // window 'load' fires when every resource (images, fonts, scripts) is ready
    const handleLoad = () => {
      observer.disconnect()
      exit()
    }

    window.addEventListener("load", handleLoad)

    return () => {
      observer.disconnect()
      window.removeEventListener("load", handleLoad)
    }
  }, [])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-white flex flex-col items-center justify-center"
      style={{ zIndex: 99999 }}
    >
      <Image
        src="/images/common/vg-outline.svg"
        alt="Product Design Work"
        width={48}
        height={48}
        className="w-10 h-10 object-contain opacity-80 mb-5"
      />
      <p
        className="text-sm text-gray-400 tabular-nums"
        style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}
      >
        {progress}
      </p>
    </div>
  )
}
