"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const VisualExplorationsGallery = dynamic(() => import("./visualExplorationsGallery"), {
  ssr: false,
})

export default function DeferredVisualExplorations() {
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
      {shouldLoad ? <VisualExplorationsGallery /> : null}
    </div>
  )
}
