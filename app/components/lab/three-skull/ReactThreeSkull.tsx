"use client"

import React, { useEffect, useRef } from "react"
import Three from "./core/Three"

export default function ReactThreeSkull() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let three: any

    const runSim = async () => {
      three = new Three(container)
      await three.run()
      await three.scene.ready
    }

    runSim()

    return () => {
      if (three) {
        three.destroy()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      id="app"
      className="w-full h-full relative"
      style={{ background: "#000", overflow: "hidden" }}
    />
  )
}
