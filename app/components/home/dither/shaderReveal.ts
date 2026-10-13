/**
 * WebGL Shader Reveal Engine
 * Inspired by Satish Hebbal's portfolio (portfolio-2026)
 *
 * The monochrome artwork is permanently rendered on the base layer.
 * On hover, this WebGL overlay reveals the colour artwork with an organic noise
 * threshold and soft trailing wake that follows the cursor.
 *
 * Touch screens reveal via a directional wave that sweeps with the scroll.
 * At rest, the canvas is hidden (0 GPU work) and the base image displays quietly.
 */

// ── Configuration ─────────────────────────────────────────────────────────────
// Hover reveal radius: reduced by ~30% from the baseline (180px -> 125px)
export const HERO_REVEAL_RADIUS = 125

export interface ShaderRevealConfig {
  radius: number
  falloff: number
  shNoise: number
  shNoiseScale: number
  shSoftness: number
  shAnimate: boolean
  shSpeed: number
  trail: boolean
  healMs: number
  enterMs: number
  spacing: number
  maxStamps: number
  dprCap: number
}

export const SHADER_REVEAL_DEFAULTS: ShaderRevealConfig = {
  radius: HERO_REVEAL_RADIUS,
  falloff: 1.2,
  shNoise: 1.42,
  shNoiseScale: 4.0,
  shSoftness: 0.072,
  shAnimate: true,
  shSpeed: 1.2,
  trail: true,
  healMs: 2200,
  enterMs: 180,
  spacing: 0.2,
  maxStamps: 40,
  dprCap: 2,
}

const MAX_POINTS = 48
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uColor;
uniform vec2 uSize;
uniform vec3 uPts[${MAX_POINTS}];
uniform int uCount;
uniform float uRadius;
uniform float uFalloff;
uniform float uNoise;
uniform float uNoiseScale;
uniform float uSoft;
uniform float uTime;
uniform vec3 uWave;
uniform float uWaveOn;
uniform float uWaveWidth;
uniform vec2 uScale;
uniform vec2 uOffset;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  // figure-local CSS px, y down, to match pointer coordinates
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uSize;

  float m = 0.0;
  for (int i = 0; i < ${MAX_POINTS}; i++) {
    if (i >= uCount) break;
    vec3 s = uPts[i];
    float d = distance(p, s.xy) / uRadius;
    m = max(m, s.z * pow(clamp(1.0 - d * d, 0.0, 1.0), uFalloff));
  }
  vec2 np = p / 100.0 * uNoiseScale;
  float n = fbm(np + vec2(uTime * 0.13, -uTime * 0.09));
  float field = 0.0;

  if (uWaveOn > 0.5) {
    // Mobile scroll bloom: uWave.x advances across figure from -1.05 to +1.05
    float u = dot(p / uSize - 0.5, normalize(uWave.yz));
    float k = (uWave.x - u) / uWaveWidth;
    float waveM = clamp(0.5 + k * 0.5, 0.0, 1.0);
    // Organic bloom edge: noise modulates along the advancing frontier
    float edgeFactor = 4.0 * waveM * (1.0 - waveM);
    field = waveM + (n - 0.5) * 0.85 * edgeFactor;
  } else {
    // Desktop hover: cursor stamps with trailing noise
    field = m + (n - 0.5) * uNoise;
  }
  const float T = 0.5;

  float reveal = smoothstep(T - uSoft, T + uSoft, field);

  // Exact UV coordinate mapping between monochrome canvas and colour canvas
  vec2 colorUv = vec2(vUv.x * uScale.x + uOffset.x, vUv.y * uScale.y + uOffset.y);
  vec4 color = texture2D(uColor, colorUv);

  // Output colour layer with alpha modulated by reveal factor
  // Composites cleanly over the base monochrome <img> underneath with zero holes or white gaps
  gl_FragColor = color * reveal;
}`

type Point = { x: number; y: number; t: number }

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) throw new Error('Failed to create shader')
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh) ?? 'shader compile failed'
    gl.deleteShader(sh)
    throw new Error(info)
  }
  return sh
}

// Global scroll frame subscriber to optimize scroll events
type ScrollCallback = (y: number) => void
const scrollSubscribers = new Set<ScrollCallback>()
let scrollFrame = 0

const flushScroll = () => {
  scrollFrame = 0
  const y = typeof window !== 'undefined' ? window.scrollY : 0
  scrollSubscribers.forEach((cb) => cb(y))
}

const scheduleScroll = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(flushScroll)
}

function onScrollFrame(cb: ScrollCallback): () => void {
  if (typeof window === 'undefined') return () => {}
  if (scrollSubscribers.size === 0) window.addEventListener('scroll', scheduleScroll, { passive: true })
  scrollSubscribers.add(cb)
  cb(window.scrollY)
  return () => {
    scrollSubscribers.delete(cb)
    if (scrollSubscribers.size === 0) {
      window.removeEventListener('scroll', scheduleScroll)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
      scrollFrame = 0
    }
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Attach the shader reveal to a figure wrapper. Returns a cleanup function,
 * or null if WebGL is unavailable.
 */
export function attachShaderReveal(
  wrap: HTMLDivElement,
  canvas: HTMLCanvasElement,
  name: 'left' | 'right' | 'abhay' | 'tejas',
  paintedSrc: string,
  touch = false,
  config = SHADER_REVEAL_DEFAULTS
): (() => void) | null {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
  if (!gl) return null

  type Res = {
    prog: WebGLProgram
    buf: WebGLBuffer
    colorTex: WebGLTexture
    U: Record<string, WebGLUniformLocation | null>
  }
  let res: Res | null = null

  const makeTex = () => {
    const t = gl.createTexture()!
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }

  const init = (): boolean => {
    if (gl.isContextLost()) return false
    try {
      const prog = gl.createProgram()!
      const vs = compile(gl, gl.VERTEX_SHADER, VERT)
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
      gl.attachShader(prog, vs)
      gl.attachShader(prog, fs)
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog) ?? 'link failed')
      }
      gl.useProgram(prog)
      const buf = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const aPos = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
      const u = (n: string) => gl.getUniformLocation(prog, n)
      res = {
        prog,
        buf,
        colorTex: makeTex(),
        U: {
          color: u('uColor'),
          size: u('uSize'),
          pts: u('uPts'),
          count: u('uCount'),
          radius: u('uRadius'),
          falloff: u('uFalloff'),
          noise: u('uNoise'),
          noiseScale: u('uNoiseScale'),
          soft: u('uSoft'),
          time: u('uTime'),
          wave: u('uWave'),
          waveOn: u('uWaveOn'),
          waveWidth: u('uWaveWidth'),
          scale: u('uScale'),
          offset: u('uOffset'),
        },
      }
      return true
    } catch (e) {
      console.warn('[shader reveal init failed]', e)
      res = null
      return false
    }
  }

  if (!init()) return null

  const upload = (tex: WebGLTexture, source: HTMLImageElement) => {
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  }

  let img: HTMLImageElement | null = null
  let painted: HTMLImageElement | null = null
  let ready = false
  let frame = 0
  let pointer: { x: number; y: number } | null = null
  let head: { x: number; y: number } | null = null
  let dropped = { x: 0, y: 0 }
  let enteredAt = 0
  let stamps: Point[] = []
  let showing = false
  const ptsArray = new Float32Array(MAX_POINTS * 3)
  const t0 = performance.now()

  // Mobile scroll bloom: progress from 0.0 (monochrome) to 1.0 (full colour)
  let waveProgress = 0
  const isLeft = name === 'left' || name === 'abhay'
  const waveDir = isLeft ? [0.35, 1] : [-0.35, 1]
  const WAVE_WIDTH = 0.30
  const waveVisible = () => touch && waveProgress > 0.005

  // Show only controls canvas visibility. The base monochrome image NEVER disappears.
  const show = (on: boolean) => {
    if (on === showing) return
    showing = on
    canvas.style.visibility = on ? 'visible' : 'hidden'
  }

  const bindTextures = () => {
    if (!painted || !res) return
    upload(res.colorTex, painted)
  }

  const setup = () => {
    img = wrap.querySelector('img')
    if (!res || gl.isContextLost()) return
    if (!img || !img.complete || !img.naturalWidth || !painted?.complete || !painted.naturalWidth) return
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (!w || !h) return
    const dpr = Math.min(window.devicePixelRatio || 1, config.dprCap)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    bindTextures()
    ready = true
    if (pointer || waveVisible()) kick()
  }

  const loadPainted = () => {
    if (painted) return
    painted = new Image()
    painted.decoding = 'async'
    painted.onload = setup
    painted.onerror = () => { painted = null }
    painted.src = paintedSrc
  }

  // Client coordinate -> figure-local coordinate, accounting for parent rotation and scale
  const toLocal = (px: number, py: number) => {
    const parent = wrap.parentElement
    const t = parent ? getComputedStyle(parent).transform : 'none'
    const m = new DOMMatrix(t === 'none' ? undefined : t)
    const scale = Math.hypot(m.a, m.b) || 1
    const theta = Math.atan2(m.b, m.a)
    const r = wrap.getBoundingClientRect()
    const dx = px - (r.left + r.width / 2)
    const dy = py - (r.top + r.height / 2)
    const cos = Math.cos(-theta)
    const sin = Math.sin(-theta)
    return {
      x: (dx * cos - dy * sin) / scale + wrap.clientWidth / 2,
      y: (dx * sin + dy * cos) / scale + wrap.clientHeight / 2,
    }
  }

  const track = (now: number) => {
    const w = wrap.clientWidth, h = wrap.clientHeight
    const p = pointer ? toLocal(pointer.x, pointer.y) : null
    const near = p && p.x > -config.radius && p.y > -config.radius && p.x < w + config.radius && p.y < h + config.radius
    if (!p || !near) {
      if (head && config.trail) stamps.push({ x: head.x, y: head.y, t: now })
      head = null
      return
    }
    if (!head) {
      enteredAt = now
      dropped = p
    } else if (config.trail && Math.hypot(p.x - dropped.x, p.y - dropped.y) >= config.radius * config.spacing) {
      stamps.push({ x: dropped.x, y: dropped.y, t: now })
      dropped = p
    }
    const cap = Math.min(config.maxStamps, MAX_POINTS - 1)
    while (stamps.length > cap) stamps.shift()
    head = p
  }

  const draw = (now: number) => {
    frame = 0
    if (!ready || !res || gl.isContextLost()) {
      show(false)
      return
    }
    track(now)
    stamps = config.trail ? stamps.filter((p) => now - p.t <= config.healMs) : []
    const U = res.U

    let n = 0
    for (const p of stamps) {
      const a = 1 - easeOut((now - p.t) / Math.max(1, config.healMs))
      if (a <= 0.01) continue
      ptsArray[n * 3] = p.x
      ptsArray[n * 3 + 1] = p.y
      ptsArray[n * 3 + 2] = a
      n++
    }
    if (head) {
      ptsArray[n * 3] = head.x
      ptsArray[n * 3 + 1] = head.y
      ptsArray[n * 3 + 2] = config.enterMs > 0 ? easeOut((now - enteredAt) / config.enterMs) : 1
      n++
    }
    const waving = waveVisible()
    if (!n && !waving) {
      show(false)
      return
    }
    show(true)

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform1i(U.color, 0)
    gl.uniform2f(U.size, wrap.clientWidth, wrap.clientHeight)
    gl.uniform3fv(U.pts, ptsArray)
    gl.uniform1i(U.count, n)
    gl.uniform1f(U.radius, config.radius)
    gl.uniform1f(U.falloff, config.falloff)
    gl.uniform1f(U.noise, config.shNoise)
    gl.uniform1f(U.noiseScale, config.shNoiseScale)
    gl.uniform1f(U.soft, config.shSoftness)
    gl.uniform1f(U.time, config.shAnimate ? ((now - t0) / 1000) * config.shSpeed : 0)
    const front = -1.05 + 2.10 * waveProgress
    gl.uniform3f(U.wave, front, waveDir[0], waveDir[1])
    gl.uniform1f(U.waveOn, waving ? 1 : 0)
    gl.uniform1f(U.waveWidth, WAVE_WIDTH)

    // Accurate texture coordinate mapping:
    // Left angel: both source images are 1504x1002 (scale=1, offset=0)
    // Right angel: BW is 1166x1166, Color is 1284x1284 (scale=1166/1284, offset=(0, 118/1284))
    if (!isLeft) {
      gl.uniform2f(U.scale, 1166.0 / 1284.0, 1166.0 / 1284.0)
      gl.uniform2f(U.offset, 0.0, (1284.0 - 1166.0) / 1284.0)
    } else {
      gl.uniform2f(U.scale, 1.0, 1.0)
      gl.uniform2f(U.offset, 0.0, 0.0)
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    const entering = head && now - enteredAt < config.enterMs
    const flowing = config.shAnimate && config.shSpeed > 0 && head
    if (stamps.length || entering || flowing) frame = requestAnimationFrame(draw)
  }

  const kick = () => {
    if (!frame && ready) frame = requestAnimationFrame(draw)
  }

  const onMove = (e: MouseEvent) => {
    loadPainted()
    pointer = { x: e.clientX, y: e.clientY }
    kick()
  }

  const onLeave = () => {
    pointer = null
    kick()
  }

  const imgEl = wrap.querySelector('img')
  if (imgEl && !imgEl.complete) {
    imgEl.addEventListener('load', setup, { once: true })
  } else {
    setup()
  }

  // Load painted color image
  loadPainted()

  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(setup, 150)
  }

  // WebGL context loss handling
  const onLost = (e: Event) => {
    e.preventDefault()
    ready = false
    res = null
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    show(false)
  }
  const onRestored = () => {
    if (init()) setup()
  }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)

  if (!touch) {
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
  }

  window.addEventListener('resize', onResize)

  const unScroll = onScrollFrame((y) => {
    if (touch) {
      loadPainted()
      // Mobile scroll reveal range: completes within hero scroll (approx 360px)
      const range = Math.min(360, window.innerHeight * 0.45)
      const was = waveVisible()
      waveProgress = Math.min(1, Math.max(0, y / range))
      if (was || waveVisible()) kick()
      return
    }
    if (pointer) kick()
  })

  return () => {
    window.removeEventListener('mousemove', onMove)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', onResize)
    imgEl?.removeEventListener('load', setup)
    unScroll()
    clearTimeout(resizeTimer)
    if (frame) cancelAnimationFrame(frame)
    if (painted) {
      painted.onload = null
      painted.onerror = null
    }
    canvas.removeEventListener('webglcontextlost', onLost)
    canvas.removeEventListener('webglcontextrestored', onRestored)
    show(false)

    if (res && !gl.isContextLost()) {
      gl.deleteTexture(res.colorTex)
      gl.deleteBuffer(res.buf)
      gl.deleteProgram(res.prog)
    }
    res = null
  }
}
