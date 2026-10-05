/**
 * Hairline Engine Kernel for custom Hairline figures.
 * Exposes all 40+ internal Hairline engine primitives (Cam, fit, proj, rings, prism, etc.)
 */
export const HL = (() => {
  const LIGHT = { plate: "#ffffff", hi: "#232327", edge: "#a4a4ac", mid: "#c3c3c9", lo: "#e0e0e4" }
  const DARK = { plate: "#08090a", hi: "#d0d6e0", edge: "#5b5d64", mid: "#3e3e44", lo: "#29292d" }
  const KEYS = ["plate", "hi", "edge", "mid", "lo"]
  const vars = (p: any) => KEYS.map((k) => `--hl-${k}:var(--hairline-${k},${p[k]});`).join("")
  const EASE = "cubic-bezier(0.5,0,0.1,1)"
  const SVG = ":where([data-hairline]>svg)"

  function css(lightDark: boolean) {
    const both = Object.fromEntries(KEYS.map((k) => [k, `light-dark(${LIGHT[k as keyof typeof LIGHT]},${DARK[k as keyof typeof DARK]})`]))
    return [
      `:where([data-hairline]){display:block;position:relative;aspect-ratio:5/4;touch-action:pan-y;user-select:none;-webkit-user-select:none;--hl-sw:var(--hairline-stroke,0.9);${vars(LIGHT)}}`,
      lightDark ? `:where([data-hairline]){${vars(both)}}` : "",
      `:where(.dark,[data-theme="dark"]) :where([data-hairline]){${vars(DARK)}}`,
      `:where([data-hairline][data-hairline-theme="light"]){${vars(LIGHT)}}`,
      `:where([data-hairline][data-hairline-theme="dark"]){${vars(DARK)}}`,
      `:where([data-hairline]:focus-visible){outline:1.5px solid var(--hl-hi);outline-offset:2px}`,
      `${SVG}{position:absolute;inset:0;width:100%;height:100%;display:block}`,
      `:where([data-hairline]>[data-hairline-live]){position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`,
      `${SVG} :where(path,polygon,ellipse,line){fill:var(--hl-plate);stroke:var(--hl-mid);stroke-width:var(--hl-sw);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;transition:stroke 260ms ${EASE}}`,
      `${SVG} :where(.nf){fill:none}`,
      `${SVG} :where(.fo){stroke:none}`,
      `${SVG} :where(.sil){stroke:var(--hl-edge)}`,
      `${SVG} :where(.hi){stroke:var(--hl-hi)}`,
      `${SVG} :where(.lo){stroke:var(--hl-lo)}`,
      `${SVG} :where(.dash){stroke-dasharray:1 3}`,
      `${SVG} :where(.dot){stroke:none;fill:var(--hl-hi);transition:fill 260ms ${EASE}}`,
      `${SVG} :where(.dot.m){fill:var(--hl-edge)}`,
      `${SVG} :where(.dot.off){fill:var(--hl-lo)}`,
      `${SVG} :where(.ghost path){fill:none;stroke:var(--hl-mid)}`
    ].join("")
  }

  const done = new WeakSet()
  function inject(root: any) {
    if (done.has(root)) return
    done.add(root)
    const doc = root.nodeType === 9 ? root : root.ownerDocument
    const win = doc.defaultView
    const text = css(!!win?.CSS?.supports?.("color", "light-dark(#000,#fff)"))
    if (win && "adoptedStyleSheets" in root) {
      try {
        const sheet = new win.CSSStyleSheet()
        sheet.replaceSync(text)
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet]
        return
      } catch {}
    }
    const style = doc.createElement("style")
    style.setAttribute("data-hairline-style", "")
    style.textContent = text
    ;(root.nodeType === 9 ? doc.head ?? doc.documentElement : root).appendChild(style)
  }

  function Cam(azDeg: number, k: number, S: number) {
    const az = azDeg * (Math.PI / 180)
    const cosAz = Math.cos(az), sinAz = Math.sin(az)
    const cosEl = Math.sqrt(Math.max(0, 1 - k * k))
    return { azDeg, k, S, cosAz, sinAz, cosEl, sinEl: k }
  }

  function proj(C: any) {
    return (x: number, y: number, z: number): [number, number] => {
      const u = x * C.cosAz - y * C.sinAz
      const v = x * C.sinAz + y * C.cosAz
      const sx = u * C.S
      const sy = (v * C.sinEl - z * C.cosEl) * C.S
      return [sx, sy]
    }
  }

  function unproj(C: any, sx: number, sy: number, z: number): [number, number] {
    const u = sx / C.S
    const v = (sy / C.S + z * C.cosEl) / C.sinEl
    const x = u * C.cosAz + v * C.sinAz
    const y = -u * C.sinAz + v * C.cosAz
    return [x, y]
  }

  function facing(C: any) {
    return (sample: any) => sample.nu * C.cosAz * C.sinEl + sample.nv * C.sinAz * C.sinEl > 0
  }

  function fit(C: any, points: [number, number, number][], cx: number, cy: number) {
    const P = proj(C)
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    for (const p of points) {
      const [sx, sy] = P(p[0], p[1], p[2])
      if (sx < minX) minX = sx
      if (sx > maxX) maxX = sx
      if (sy < minY) minY = sy
      if (sy > maxY) maxY = sy
    }
    const mx = (minX + maxX) / 2, my = (minY + maxY) / 2
    const ox = cx - mx, oy = cy - my
    const origProj = proj(C)
    C.projOffset = [ox, oy]
    return (x: number, y: number, z: number): [number, number] => {
      const [sx, sy] = origProj(x, y, z)
      return [sx + ox, sy + oy]
    }
  }

  function rrect(u0: number, v0: number, u1: number, v1: number, r: number, n: number = 4) {
    const w = Math.abs(u1 - u0), h = Math.abs(v1 - v0)
    const radius = Math.min(r, w / 2, h / 2)
    const minU = Math.min(u0, u1), maxU = Math.max(u0, u1)
    const minV = Math.min(v0, v1), maxV = Math.max(v0, v1)
    const pts: any[] = []

    const arc = (cx: number, cy: number, a0: number, a1: number) => {
      for (let i = 0; i <= n; i++) {
        const a = a0 + (a1 - a0) * (i / n)
        const nu = Math.cos(a), nv = Math.sin(a)
        pts.push({ u: cx + radius * nu, v: cy + radius * nv, nu, nv })
      }
    }

    arc(maxU - radius, maxV - radius, 0, Math.PI / 2)
    arc(minU + radius, maxV - radius, Math.PI / 2, Math.PI)
    arc(minU + radius, minV + radius, Math.PI, (3 * Math.PI) / 2)
    arc(maxU - radius, minV + radius, (3 * Math.PI) / 2, 2 * Math.PI)
    return pts
  }

  function rings(x0: number, y0: number, x1: number, y1: number, r: number, b: number) {
    const ring = rrect(x0, y0, x1, y1, r, 4)
    const inner = rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.1, r - b), 4)
    return [ring, inner]
  }

  function ringAt(P: any, ring: any[], z: number) {
    return ring.map((q) => P(q.u, q.v, z))
  }

  function run(ring: any[], keep: (q: any) => boolean) {
    const res: any[] = []
    for (const q of ring) if (keep(q)) res.push(q)
    return res
  }

  function hull(points: [number, number][]) {
    const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
    if (pts.length <= 1) return pts
    const lower: [number, number][] = []
    for (const p of pts) {
      while (lower.length >= 2) {
        const q = lower[lower.length - 1], r = lower[lower.length - 2]
        if ((q[0] - r[0]) * (p[1] - r[1]) - (q[1] - r[1]) * (p[0] - r[0]) <= 0) lower.pop()
        else break
      }
      lower.push(p)
    }
    const upper: [number, number][] = []
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i]
      while (upper.length >= 2) {
        const q = upper[upper.length - 1], r = upper[upper.length - 2]
        if ((q[0] - r[0]) * (p[1] - r[1]) - (q[1] - r[1]) * (p[0] - r[0]) <= 0) upper.pop()
        else break
      }
      upper.push(p)
    }
    upper.pop()
    lower.pop()
    return lower.concat(upper)
  }

  function poly(points: [number, number][]) {
    if (!points || !points.length) return ""
    return `M${points.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join("L")}Z`
  }

  function open(points: [number, number][]) {
    if (!points || !points.length) return ""
    return `M${points.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join("L")}`
  }

  function prism(P: any, front: any, ring: any[], inner: any[], z0: number, z1: number) {
    const r0 = ringAt(P, ring, z0), r1 = ringAt(P, ring, z1)
    const silPts = hull(r0.concat(r1))
    const sil = poly(silPts)
    const crRun = run(inner, (q) => !front(q))
    const crease = open(ringAt(P, crRun, z1))
    return { sil, crease }
  }

  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v))
  }

  function spring(x0: number, opts: any = {}) {
    const k = opts.k ?? 100, c = opts.c ?? 18, m = opts.m ?? 1, eps = opts.eps ?? 0.04
    return { x: x0, v: 0, t: x0, k, c, m, eps }
  }

  function stepS(sp: any, dt: number) {
    const f = sp.k * (sp.t - sp.x) - sp.c * sp.v
    const a = f / sp.m
    sp.v += a * dt
    sp.x += sp.v * dt
    if (Math.abs(sp.t - sp.x) < sp.eps && Math.abs(sp.v) < sp.eps) {
      sp.x = sp.t
      sp.v = 0
      return false
    }
    return true
  }

  function tween(v0: number, dur: number = 700) {
    return { x: v0, from: v0, to: v0, start: 0, dur }
  }

  function tset(tw: any, to: number, now: number, delay: number = 0) {
    if (tw.to === to) return
    tw.from = tw.x
    tw.to = to
    tw.start = now + delay
  }

  function tval(tw: any, now: number) {
    if (now <= tw.start) return tw.from
    const progress = Math.min(1, (now - tw.start) / tw.dur)
    const ease = 0.5 * Math.sin(Math.PI * (progress - 0.5)) + 0.5
    tw.x = tw.from + (tw.to - tw.from) * ease
    return tw.x
  }

  function tdone(tw: any, now: number) {
    return now >= tw.start + tw.dur
  }

  function mk(tag: string, attrs: any = {}, parent?: SVGElement) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag)
    for (const k in attrs) el.setAttribute(k, attrs[k])
    if (parent) parent.appendChild(el)
    return el
  }

  function solid(parent: SVGElement) {
    const g = mk("g", {}, parent)
    const sil = mk("path", { class: "sil" }, g)
    const cr = mk("path", { class: "lo" }, g)
    return { g, sil, cr }
  }

  function put(sol: any, paths: { sil: string; crease: string }) {
    sol.sil.setAttribute("d", paths.sil)
    sol.cr.setAttribute("d", paths.crease)
  }

  function register(stage: HTMLElement, tick: (dt: number, now: number) => boolean) {
    let active = false
    let lastTime = performance.now()
    let rafId: number | null = null

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      const keepGoing = tick(dt, now)
      if (keepGoing) {
        rafId = requestAnimationFrame(loop)
      } else {
        active = false
        rafId = null
      }
    }

    const wake = () => {
      if (!active) {
        active = true
        lastTime = performance.now()
        rafId = requestAnimationFrame(loop)
      }
    }

    wake()

    return {
      wake,
      unregister: () => {
        if (rafId !== null) cancelAnimationFrame(rafId)
        active = false
      },
    }
  }

  function pointer(stage: HTMLElement, handlers: { move?: (p: [number, number]) => void; leave?: () => void }) {
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 400 - 200
      const y = ((e.clientY - rect.top) / rect.height) * 320 - 160
      handlers.move?.([x, y])
    }
    const onLeave = () => {
      handlers.leave?.()
    }
    stage.addEventListener("pointermove", onMove)
    stage.addEventListener("pointerleave", onLeave)
    return () => {
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerleave", onLeave)
    }
  }

  function disposer() {
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

  return {
    Cam,
    proj,
    unproj,
    facing,
    fit,
    rrect,
    rings,
    ringAt,
    run,
    hull,
    poly,
    open,
    prism,
    clamp,
    spring,
    stepS,
    tween,
    tset,
    tval,
    tdone,
    mk,
    solid,
    put,
    register,
    pointer,
    disposer,
    css,
    inject,
  }
})()
