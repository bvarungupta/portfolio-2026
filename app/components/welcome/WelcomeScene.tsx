"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"

type Star = {
  x: number
  y: number
  size: number
  opacity: number
  twinkleDelay: number
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  ttl: number
  size: number
  hue: "white" | "teal"
  twinkle: number
}

const quote = [
  { text: "discoveries", emphasis: true },
  { text: "are" },
  { text: "out" },
  { text: "there," },
  { text: "waiting" },
  { text: "to" },
  { text: "be" },
  { text: "made." },
  { text: "Why" },
  { text: "not" },
  { text: "by", emphasis: true },
  { text: "you?", emphasis: true },
]

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeLayer(
  seed: number,
  grid: number,
  maxR: number,
  skip: number,
  sizeRange: [number, number, number],
  opRange: [number, number],
) {
  const rand = mulberry32(seed)
  const cellSize = 100 / grid
  const stars: Star[] = []

  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const cx = (col + 0.5) * cellSize - 50
      const cy = (row + 0.5) * cellSize - 50
      if (Math.sqrt(cx * cx + cy * cy) > maxR) continue
      if (rand() < skip) {
        rand()
        rand()
        rand()
        rand()
        continue
      }
      stars.push({
        x: col * cellSize + (rand() * 1.6 - 0.3) * cellSize,
        y: row * cellSize + (rand() * 1.6 - 0.3) * cellSize,
        size: rand() < sizeRange[0] ? sizeRange[1] : sizeRange[2],
        opacity: opRange[0] + rand() * (opRange[1] - opRange[0]),
        twinkleDelay: rand() * 14,
      })
    }
  }

  return stars
}

function StarLayer({ stars, className }: { stars: Star[]; className: string }) {
  return (
    <div
      className={`welcome-starfield ${className} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      style={{ width: "150vmax", height: "150vmax" }}
    >
      {stars.map((star, index) => (
      <span
          key={`${className}-${index}`}
          className="welcome-star absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  )
}

function Starfield() {
  const layers = useMemo(
    () => ({
      far: makeLayer(17, 12, 45, 0.22, [0.8, 1, 1.5], [0.25, 0.5]),
      mid: makeLayer(53, 10, 38, 0.28, [0.65, 1.5, 2], [0.45, 0.7]),
      near: makeLayer(91, 9, 30, 0.32, [0.5, 2, 2.5], [0.6, 0.9]),
    }),
    [],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <StarLayer stars={layers.far} className="welcome-starfield--far" />
      <StarLayer stars={layers.mid} className="welcome-starfield--mid" />
      <StarLayer stars={layers.near} className="welcome-starfield--near" />
    </div>
  )
}

function ShootingStars() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const shapes = ["------*", "-----.", "------+", ".-----*", "-----o"]
    let cancelled = false
    const timers = new Set<number>()

    const spawn = () => {
      if (!stage || cancelled) return
      const el = document.createElement("span")
      el.className = "welcome-shooting-star"
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)]

      const w = window.innerWidth
      const h = window.innerHeight
      const startX = w * (0.55 + Math.random() * 0.4)
      const startY = h * (Math.random() * 0.55)
      const dx = -(w * (0.5 + Math.random() * 0.3))
      const dy = h * (0.3 + Math.random() * 0.35)
      const duration = 1.2 + Math.random() * 0.8
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI

      el.style.left = `${startX}px`
      el.style.top = `${startY}px`
      el.style.setProperty("--shoot-dx", `${dx}px`)
      el.style.setProperty("--shoot-dy", `${dy}px`)
      el.style.setProperty("--shoot-duration", `${duration}s`)
      el.style.setProperty("--shoot-angle", `${angle}deg`)

      stage.appendChild(el)
      const removeTimer = window.setTimeout(() => {
        timers.delete(removeTimer)
        el.remove()
      }, duration * 1000 + 200)
      timers.add(removeTimer)
    }

    const loop = () => {
      if (cancelled) return
      if (stage.childElementCount === 0) spawn()
      const delay = 4000 + Math.random() * 3000
      const loopTimer = window.setTimeout(() => {
        timers.delete(loopTimer)
        loop()
      }, delay)
      timers.add(loopTimer)
    }

    const firstTimer = window.setTimeout(spawn, 800)
    const loopTimer = window.setTimeout(loop, 3500)
    timers.add(firstTimer)
    timers.add(loopTimer)

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
      stage.replaceChildren()
    }
  }, [])

  return <div ref={stageRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" />
}

function WelcomeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const fine = window.matchMedia("(pointer: fine)").matches
    if (!cursor || !fine) return

    document.documentElement.setAttribute("data-welcome-cursor-active", "")

    let targetX = 0
    let targetY = 0
    let currX = 0
    let currY = 0
    let initialized = false
    let rafId = 0
    let idleTimer = 0

    cursor.style.opacity = "0"

    const tick = () => {
      currX += (targetX - currX) * 0.35
      currY += (targetY - currY) * 0.35
      cursor.style.transform = `translate3d(${currX}px, ${currY}px, 0)`
      window.dispatchEvent(new CustomEvent("welcome:pointer", { detail: { x: currX, y: currY } }))
      rafId = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }
    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }
    const resetIdle = () => {
      clearTimeout(idleTimer)
      startLoop()
      idleTimer = window.setTimeout(stopLoop, 500)
    }
    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!initialized) {
        currX = targetX
        currY = targetY
        cursor.style.opacity = "1"
        initialized = true
      }
      resetIdle()
    }
    const onMouseLeave = () => {
      cursor.style.opacity = "0"
    }
    const onMouseEnter = () => {
      cursor.style.opacity = initialized ? "1" : "0"
    }
    const onMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      cursor.dataset.mode = target?.closest("a, button, [role='button']") ? "link" : "dot"
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop()
        clearTimeout(idleTimer)
      } else if (initialized) {
        cursor.style.opacity = "1"
        resetIdle()
      }
    }

    startLoop()
    window.addEventListener("pointermove", onPointerMove)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      stopLoop()
      clearTimeout(idleTimer)
      document.documentElement.removeAttribute("data-welcome-cursor-active")
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  return (
    <div ref={cursorRef} data-welcome-cursor aria-hidden="true" className="welcome-cursor pointer-events-none fixed top-0 left-0 z-[100] hidden md:block">
      <div className="welcome-cursor__shape" />
    </div>
  )
}

function SparkBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let dpr = 1
    let rafId = 0
    let lastFrame = performance.now()
    let lastPointerDown = 0
    const particles: Particle[] = []
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawnBurst = (x: number, y: number) => {
      if (reduced) {
        particles.push({ x, y, vx: 0, vy: 0, life: 0, ttl: 450, size: 24, hue: "teal", twinkle: 0 })
        return
      }

      const count = 22 + Math.floor(Math.random() * 11)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 120 + Math.pow(Math.random(), 0.6) * 380
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          ttl: 650 + Math.random() * 300,
          size: 1.2 + Math.random() * 2.2,
          hue: Math.random() < 0.35 ? "teal" : "white",
          twinkle: Math.random() * Math.PI * 2,
        })
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(48, now - lastFrame)
      lastFrame = now
      const dtSec = dt / 1000

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = "lighter"

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += dt
        if (p.life >= p.ttl) {
          particles.splice(i, 1)
          continue
        }

        p.vy -= 40 * dtSec
        p.vx *= 0.96
        p.vy *= 0.96
        p.x += p.vx * dtSec
        p.y += p.vy * dtSec

        const t = p.life / p.ttl
        const fade = 1 - t
        const twinkle = 0.7 + 0.3 * Math.sin(p.twinkle + p.life * 0.02)
        const alpha = Math.max(0, fade * twinkle)

        if (reduced) {
          const r = p.size + t * 48
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.55})`
          ctx.lineWidth = 1.5
          ctx.stroke()
          continue
        }

        const rgb = p.hue === "teal" ? "101, 182, 195" : "255, 255, 255"
        const radius = p.size * (1 + 0.4 * twinkle)
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6)
        halo.addColorStop(0, `rgba(${rgb}, ${alpha * 0.55})`)
        halo.addColorStop(1, `rgba(${rgb}, 0)`)
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(${rgb}, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = "source-over"
      rafId = requestAnimationFrame(tick)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      lastPointerDown = performance.now()
      spawnBurst(event.clientX, event.clientY)
    }
    const onTouchStart = (event: TouchEvent) => {
      if (performance.now() - lastPointerDown < 50) return
      const touch = event.touches[0]
      if (touch) spawnBurst(touch.clientX, touch.clientY)
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId)
      } else {
        lastFrame = performance.now()
        rafId = requestAnimationFrame(tick)
      }
    }

    resize()
    rafId = requestAnimationFrame(tick)
    window.addEventListener("resize", resize, { passive: true })
    window.addEventListener("pointerdown", onPointerDown, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] h-full w-full" />
}

function WelcomeHero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = heroRef.current
    if (!root) return

    const shoves = Array.from(root.querySelectorAll<HTMLElement>("[data-shove]"))
    const targets = new WeakMap<HTMLElement, { x: number; y: number }>()
    const currents = new WeakMap<HTMLElement, { x: number; y: number }>()

    shoves.forEach((el) => {
      targets.set(el, { x: 0, y: 0 })
      currents.set(el, { x: 0, y: 0 })
    })

    let mx = -9999
    let my = -9999
    let rafId = 0

    const onPointer = (event: Event) => {
      const detail = (event as CustomEvent<{ x: number; y: number }>).detail
      mx = detail.x
      my = detail.y
    }

    const tick = () => {
      for (const el of shoves) {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = cx - mx
        const dy = cy - my
        const dist = Math.hypot(dx, dy) || 1
        const target = targets.get(el)
        const current = currents.get(el)
        if (!target || !current) continue

        if (dist < 95) {
          const force = (1 - dist / 95) ** 1.4
          target.x = (dx / dist) * force * 26
          target.y = (dy / dist) * force * 26
        } else {
          target.x = 0
          target.y = 0
        }

        current.x += (target.x - current.x) * 0.18
        current.y += (target.y - current.y) * 0.18
        el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener("welcome:pointer", onPointer)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("welcome:pointer", onPointer)
    }
  }, [])

  return (
    <section ref={heroRef} className="relative z-10 grid min-h-dvh w-full place-items-center px-5 sm:px-6">
      <div className="flex w-full max-w-[560px] flex-col items-center gap-8 text-center sm:gap-10">
        <div className="flex w-full flex-col items-center gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-5 leading-none">
            <Image
              src="/images/common/vg-outline.svg"
              alt=""
              width={48}
              height={48}
              priority
              className="mb-8 opacity-45"
            />
            <p className="w-full text-center text-sm uppercase text-white/45 sm:text-base" style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}>
              Welcome to
            </p>
            <h1 className="flex w-full flex-wrap justify-center gap-x-3 gap-y-1 text-center text-5xl leading-none tracking-tight text-white sm:text-6xl">
              <span data-shove className="inline-block will-change-transform">
                <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.45em" }}>V</span>
                <span style={{ fontFamily: "SatishSans, sans-serif", marginLeft: "4px" }}>arun's</span>
              </span>
              <span data-shove className="inline-block will-change-transform">
                <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.45em" }}>W</span>
                <span style={{ fontFamily: "SatishSans, sans-serif", marginLeft: "4px" }}>orld</span>
              </span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/45 sm:text-base" style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}>
              Brand, product, and system design for early-stage startups.
            </p>
          </div>
        </div>

        <p className="w-full max-w-[430px] text-center text-base uppercase leading-snug text-white/45 sm:text-lg" style={{ fontFamily: "Garamond, Georgia, serif" }}>
          {quote.map((word, index) => (
            <span key={`${word.text}-${index}`}>
              <span data-shove className={`inline-block will-change-transform ${word.emphasis ? "text-white" : ""}`}>
                {word.text}
              </span>
              {index < quote.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

export default function WelcomeScene() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="welcome-scene relative min-h-dvh overflow-hidden bg-[#05070b] text-white">
      <Image
        src="/images/HomeImages/piller-v.svg"
        alt=""
        width={120}
        height={800}
        priority
        className="pointer-events-none fixed top-0 hidden h-screen w-auto select-none object-contain object-top invert md:block"
        style={{ zIndex: 0, opacity: 0.1, left: "-70px" }}
      />
      <Image
        src="/images/HomeImages/piller-2-v.svg"
        alt=""
        width={120}
        height={800}
        priority
        className="pointer-events-none fixed top-0 hidden h-screen w-auto select-none object-contain object-top invert md:block"
        style={{ zIndex: 0, opacity: 0.1, right: "-40px" }}
      />
      <Image
        src="/images/HomeImages/branch.svg"
        alt=""
        width={220}
        height={120}
        className="pointer-events-none absolute left-1/2 top-[calc(50%+210px)] hidden w-[220px] -translate-x-1/2 select-none opacity-[0.08] invert md:block"
      />
      <Starfield />
      {mounted ? <ShootingStars /> : null}
      <WelcomeHero />
      {mounted ? (
        <>
          <WelcomeCursor />
          <SparkBurst />
        </>
      ) : null}
    </div>
  )
}
