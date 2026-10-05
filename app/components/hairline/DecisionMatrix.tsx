"use client"

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react"
import * as HLModule from "@lucasmarkes/hairline"

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect
const HL = HLModule as any

const {
  Cam, facing, fit, open, proj, rings,
  tval, tween, tset, tdone, mk, pointer, put, register, solid, prism,
} = HL

const N = 9, W = 22, H = 10
const X0 = -10, X1 = 160, Y0 = -10, Y1 = 110, WR = 9, WT = 2.2, PB = 5

// Rest & aligned positions for 9 decision matrix items across 3 strategic zones
const ITEMS = [
  { id: 0, z: 0, rx: 12, ry: 14, ax: 16, ay: 16 },
  { id: 1, z: 0, rx: 28, ry: 48, ax: 16, ay: 46 },
  { id: 2, z: 0, rx: 10, ry: 78, ax: 16, ay: 76 },
  { id: 3, z: 1, rx: 66, ry: 18, ax: 68, ay: 16 },
  { id: 4, z: 1, rx: 58, ry: 52, ax: 68, ay: 46 },
  { id: 5, z: 1, rx: 70, ry: 80, ax: 68, ay: 76 },
  { id: 6, z: 2, rx: 122, ry: 16, ax: 120, ay: 16 },
  { id: 7, z: 2, rx: 114, ry: 50, ax: 120, ay: 46 },
  { id: 8, z: 2, rx: 126, ry: 82, ax: 120, ay: 76 },
]

export interface HairlineProps extends React.ComponentPropsWithoutRef<"div"> {
  intensity?: number
  theme?: "auto" | "light" | "dark"
  label?: string
  onRead?: (text: string) => void
}

function createDisposer() {
  let fns: (() => void)[] = []
  return {
    add: (fn: () => void) => {
      fns.push(fn)
    },
    dispose: () => {
      const run = fns
      fns = []
      for (let i = run.length - 1; i >= 0; i--) run[i]()
    },
  }
}

function mountDecisionMatrix(
  host: HTMLDivElement,
  options: { intensity?: number; theme?: string; label?: string; onRead?: (t: string) => void }
) {
  const bag = createDisposer()
  let stag = (options.intensity ?? 0.5) * 40

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("viewBox", "0 0 400 320")
  svg.setAttribute("aria-hidden", "true")
  svg.style.width = "100%"
  svg.style.height = "100%"
  svg.style.display = "block"
  host.appendChild(svg)
  bag.add(() => svg.remove())

  const C = Cam(45, 0.5, 1.6)
  fit(C, [[X0, Y0, -PB], [X1, Y1, -PB], [X1, Y0, -PB], [X0, Y1, -PB], [X0, Y0, H + 20], [X1, Y1, H + 20]], 200, 166)
  const P = proj(C), front = facing(C)

  const g = mk("g", {}, svg)

  // Draw plinth base
  const [pr, pi] = rings(X0, Y0, X1, Y1, WR, WT)
  put(solid(g), prism(P, front, pr, pi, -PB, 0))

  // Subtle zone division creases painted along the board ground
  const col1Line = open([P(50, Y0 + 4, 0.2), P(50, Y1 - 4, 0.2)])
  const col2Line = open([P(102, Y0 + 4, 0.2), P(102, Y1 - 4, 0.2)])
  mk("path", { d: col1Line, class: "nf lo" }, g)
  mk("path", { d: col2Line, class: "nf lo" }, g)

  // Items ordered by ascending (x + y) for back-to-front rendering
  const sorted = ITEMS.slice().sort((a, b) => (a.rx + a.ry) - (b.rx + b.ry))
  const blocks = sorted.map((it) => {
    const el = solid(g)
    return {
      ...it,
      el,
      tx: tween(it.rx),
      ty: tween(it.ry),
      tz: tween(0),
    }
  })

  function hit([sx, sy]: [number, number]) {
    let best = -1, minDist = 40
    blocks.forEach((b, idx) => {
      const sp = P(b.rx + W / 2, b.ry + W / 2, 0)
      const dist = Math.hypot(sx - sp[0], sy - sp[1])
      if (dist < minDist) {
        minDist = dist
        best = idx
      }
    })
    return best
  }

  function drawBlock(b: typeof blocks[0], x: number, y: number, z: number) {
    const [ring, inner] = rings(x, y, x + W, y + W, 3.2, 1.1)
    put(b.el, prism(P, front, ring, inner, z, z + H))
  }

  const B = register(host, (_dt: number, now: number) => {
    let moving = false
    blocks.forEach((b) => {
      const curX = tval(b.tx, now), curY = tval(b.ty, now), curZ = tval(b.tz, now)
      drawBlock(b, curX, curY, curZ)
      if (!tdone(b.tx, now) || !tdone(b.ty, now) || !tdone(b.tz, now)) {
        moving = true
      }
    })
    return moving
  })
  bag.add(B.unregister)

  let act = -1

  function setActive(a: number) {
    if (a === act) return
    const now = performance.now()
    const from = a >= 0 ? a : (act >= 0 ? act : 4)
    act = a

    blocks.forEach((b, i) => {
      const dist = Math.abs(i - from)
      const delay = dist * stag

      if (a < 0) {
        // Rest pose
        tset(b.tx, b.rx, now, delay)
        tset(b.ty, b.ry, now, delay)
        tset(b.tz, 0, now, delay)
        b.el.sil.classList.toggle("hi", i === 4)
      } else {
        // Active pose: lift & align with priority group
        const sameZone = blocks[a].z === b.z
        const targetX = sameZone ? b.ax : b.rx
        const targetY = sameZone ? b.ay : b.ry
        const targetZ = i === a ? 16 : (sameZone ? 8 : 0)

        tset(b.tx, targetX, now, delay)
        tset(b.ty, targetY, now, delay)
        tset(b.tz, targetZ, now, delay)
        b.el.sil.classList.toggle("hi", i === a)
      }
    })

    if (a >= 0) {
      const zoneNames = ["input", "focus", "execute"]
      options.onRead?.(`${zoneNames[blocks[a].z]} 0${(a % 3) + 1}`)
    } else {
      options.onRead?.("rest")
    }

    B.wake()
  }

  bag.add(pointer(host, {
    move: (p: [number, number]) => setActive(hit(p)),
    leave: () => setActive(-1),
  }))

  return {
    update: (opts: { intensity?: number }) => {
      if (opts.intensity !== undefined) stag = opts.intensity * 40
    },
    destroy: bag.dispose,
  }
}

export const DecisionMatrix = forwardRef<HTMLDivElement, HairlineProps>(function DecisionMatrix(props, ref) {
  const { intensity = 0.5, theme = "auto", label, onRead, style, className, ...attrs } = props
  const elRef = useRef<HTMLDivElement | null>(null)
  const figRef = useRef<{ update: (opts: any) => void; destroy: () => void } | null>(null)
  const readRef = useRef(onRead)

  useIsoLayoutEffect(() => {
    readRef.current = onRead
  })

  useIsoLayoutEffect(() => {
    if (!elRef.current) return
    const f = mountDecisionMatrix(elRef.current, {
      intensity,
      theme,
      label,
      onRead: (t) => readRef.current?.(t),
    })
    figRef.current = f
    return () => {
      f.destroy()
      figRef.current = null
    }
  }, [])

  useEffect(() => {
    figRef.current?.update({ intensity })
  }, [intensity])

  return (
    <div
      {...attrs}
      ref={(node) => {
        elRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      className={className}
      style={{ aspectRatio: "5 / 4", ...style }}
    />
  )
})
