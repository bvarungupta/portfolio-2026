"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const VisualExplorationsGalleryV1 = dynamic(() => import("./visualExplorationsGalleryV1"), {
  ssr: false,
})

export default function DeferredVisualExplorationsV1() {
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldLoad) return
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "500px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={containerRef} className="min-h-[120px]">
      {shouldLoad ? <VisualExplorationsGalleryV1 /> : null}
    </div>
  )
}
