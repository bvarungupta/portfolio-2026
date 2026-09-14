'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import LabHeader from '../LabHeader'

// --- Bezier Math Utils ---
interface Point {
  x: number
  y: number
}

interface BezierCurve {
  p0: Point
  c1: Point
  c2: Point
  p3: Point
}

interface ChallengeLevel {
  id: number
  name: string
  category: string
  description: string
  hint: string
  p0: Point
  p3: Point
  targetC1: Point
  targetC2: Point
  initialC1: Point
  initialC2: Point
}

const CHALLENGE_POOL: ChallengeLevel[] = [
  {
    id: 1,
    name: 'Garamond Serif Bracket',
    category: 'Typography Stem Transition',
    description:
      'Adjust control handles to create a fluid, organic transition from the vertical stem to the horizontal serif bracket without a harsh corner.',
    hint: 'Extend C1 vertically along the stem and keep C2 horizontal along the bracket line for optimal tangency.',
    p0: { x: 100, y: 320 },
    p3: { x: 300, y: 120 },
    targetC1: { x: 100, y: 220 },
    targetC2: { x: 190, y: 120 },
    initialC1: { x: 170, y: 290 },
    initialC2: { x: 240, y: 190 },
  },
  {
    id: 2,
    name: 'Superellipse Corner (Squircle)',
    category: 'Curvature Continuity (C²)',
    description:
      'Form a smooth C² continuous squircle corner. Standard circular arcs abruptly jump in curvature, whereas squircles ramp curvature gradually.',
    hint: 'Push C1 and C2 further towards the corner intersection to expand curvature transition length.',
    p0: { x: 80, y: 280 },
    p3: { x: 320, y: 100 },
    targetC1: { x: 210, y: 280 },
    targetC2: { x: 320, y: 190 },
    initialC1: { x: 120, y: 280 },
    initialC2: { x: 320, y: 240 },
  },
  {
    id: 3,
    name: "Modernist 'S' Spine",
    category: 'Double Inflection Spline',
    description:
      'Sculpt the central spine curve of a high-contrast serif letter S. The curvature must cross zero smoothly at the central inflection point.',
    hint: 'Keep C1 and C2 opposing each other across the diagonal baseline to create an even, rhythmic S-loop.',
    p0: { x: 90, y: 100 },
    p3: { x: 310, y: 300 },
    targetC1: { x: 260, y: 100 },
    targetC2: { x: 140, y: 300 },
    initialC1: { x: 150, y: 180 },
    initialC2: { x: 250, y: 220 },
  },
  {
    id: 4,
    name: 'Teardrop Terminal Loop',
    category: 'Stroke Acceleration',
    description:
      'Shape the elegant teardrop terminal of a lowercase italic g. The curve requires rapid curvature acceleration at the tip.',
    hint: 'Pull C2 close to P3 to create a tight bulbous terminal while C1 maintains a gentle sweep.',
    p0: { x: 80, y: 140 },
    p3: { x: 320, y: 260 },
    targetC1: { x: 220, y: 100 },
    targetC2: { x: 340, y: 160 },
    initialC1: { x: 160, y: 200 },
    initialC2: { x: 240, y: 300 },
  },
  {
    id: 5,
    name: 'Optima Flared Stem',
    category: 'Subtle Optical Flare',
    description:
      'Hermann Zapf designed Optima without serifs, using subtle 2.5% stem curvature instead. Sculpt this extremely subtle, refined flare.',
    hint: 'Very small control handle offsets produce high-grade optical warmth without looking bent.',
    p0: { x: 100, y: 300 },
    p3: { x: 300, y: 100 },
    targetC1: { x: 185, y: 215 },
    targetC2: { x: 215, y: 185 },
    initialC1: { x: 120, y: 280 },
    initialC2: { x: 280, y: 120 },
  },
  {
    id: 6,
    name: "Baskerville 'Q' Swash Tail",
    category: 'Calligraphic Fluid Sweep',
    description:
      'Reconstruct the iconic fluid swash tail of Baskerville Capital Q. The curve requires balanced inflection and weight flow.',
    hint: 'Extend C1 deeply downward while pulling C2 high above the terminal node.',
    p0: { x: 60, y: 300 },
    p3: { x: 340, y: 160 },
    targetC1: { x: 180, y: 340 },
    targetC2: { x: 220, y: 60 },
    initialC1: { x: 120, y: 260 },
    initialC2: { x: 280, y: 200 },
  },
  {
    id: 7,
    name: 'Bodoni High-Contrast Hairline',
    category: 'Abrupt Weight Transition',
    description:
      'Bodoni features extreme contrast between thick stems and hairline curves. Sculpt the sharp transition arc into the horizontal serif.',
    hint: 'Keep C1 vertically constrained along the stem before sweeping C2 sharply horizontal.',
    p0: { x: 100, y: 320 },
    p3: { x: 300, y: 80 },
    targetC1: { x: 100, y: 160 },
    targetC2: { x: 220, y: 80 },
    initialC1: { x: 160, y: 240 },
    initialC2: { x: 260, y: 140 },
  },
  {
    id: 8,
    name: 'Apple Watch Corner Radius',
    category: 'C³ Continuous Squircle',
    description:
      'Apple Watch hardware uses C³ continuous squircle corners. Adjust handles so the derivative of curvature is completely seamless.',
    hint: 'Push handle lengths evenly past the 55% mark to prevent curvature jumps.',
    p0: { x: 60, y: 320 },
    p3: { x: 340, y: 60 },
    targetC1: { x: 215, y: 320 },
    targetC2: { x: 340, y: 185 },
    initialC1: { x: 130, y: 320 },
    initialC2: { x: 340, y: 250 },
  },
  {
    id: 9,
    name: "Gill Sans 'R' Swash Leg",
    category: 'Humanist Diagonal Arch',
    description:
      'Eric Gill gave the leg of uppercase R a distinctive humanist flare. Sculpt this fluid diagonal stroke with subtle waist curvature.',
    hint: 'C1 and C2 should form an asymmetrical parallel tangent along the diagonal axis.',
    p0: { x: 80, y: 80 },
    p3: { x: 320, y: 320 },
    targetC1: { x: 160, y: 80 },
    targetC2: { x: 240, y: 320 },
    initialC1: { x: 120, y: 160 },
    initialC2: { x: 280, y: 240 },
  },
  {
    id: 10,
    name: 'Futura Geometric Quadrant',
    category: 'Geometric Circle Approximation',
    description:
      'Paul Renner designed Futura around pure geometric circles. Match the classic 0.55228 Bézier constant for circular arcs.',
    hint: 'Set handle length to approximately 55% of the quadrant radius on both axes.',
    p0: { x: 80, y: 280 },
    p3: { x: 280, y: 80 },
    targetC1: { x: 190, y: 280 },
    targetC2: { x: 280, y: 190 },
    initialC1: { x: 140, y: 280 },
    initialC2: { x: 280, y: 230 },
  },
  {
    id: 11,
    name: "Didot Capital 'A' Apex Arch",
    category: 'Modernist Cap Arch',
    description:
      'The inner apex arch of Didot capital A requires high-precision optical symmetry at extreme hairline stroke widths.',
    hint: 'Keep C1 and C2 horizontally aligned at equal heights above the baseline.',
    p0: { x: 100, y: 280 },
    p3: { x: 300, y: 280 },
    targetC1: { x: 150, y: 80 },
    targetC2: { x: 250, y: 80 },
    initialC1: { x: 120, y: 180 },
    initialC2: { x: 280, y: 180 },
  },
  {
    id: 12,
    name: "Helvetica 'n' Shoulder Arc",
    category: 'Grotesque Stem Shoulder',
    description:
      'Helvetica lowercase n features a square, sturdy shoulder curve that branches smoothly out of the left vertical stem.',
    hint: 'Extend C1 high straight up out of P0 before turning horizontally towards C2.',
    p0: { x: 100, y: 300 },
    p3: { x: 300, y: 240 },
    targetC1: { x: 100, y: 120 },
    targetC2: { x: 220, y: 100 },
    initialC1: { x: 150, y: 220 },
    initialC2: { x: 250, y: 180 },
  },
  {
    id: 13,
    name: "Caslon 'g' Ear Hook",
    category: 'Organic Ear Terminal',
    description:
      'The ear of lowercase g in William Caslon’s typefaces is famously organic. Sculpt this bulbous terminal hook.',
    hint: 'Pull C1 downward and right, allowing C2 to wrap tightly back around P3.',
    p0: { x: 120, y: 260 },
    p3: { x: 320, y: 120 },
    targetC1: { x: 220, y: 320 },
    targetC2: { x: 340, y: 220 },
    initialC1: { x: 160, y: 220 },
    initialC2: { x: 260, y: 180 },
  },
  {
    id: 14,
    name: 'Bickham Calligraphic Flourish',
    category: 'High-Velocity Script Loop',
    description:
      'Sculpt a sweeping copperplate calligraphic flourish. The curve requires dramatic handle elongation across wide canvas spans.',
    hint: 'Pull C1 down near the bottom margin and C2 high near the top margin.',
    p0: { x: 60, y: 220 },
    p3: { x: 340, y: 180 },
    targetC1: { x: 200, y: 360 },
    targetC2: { x: 200, y: 40 },
    initialC1: { x: 140, y: 260 },
    initialC2: { x: 260, y: 140 },
  },
  {
    id: 15,
    name: 'Continuous Inflection Alignment',
    category: 'Zero-Curvature Crossing',
    description:
      'Align a double-curve spline so the point of zero curvature occurs exactly halfway along the path distance.',
    hint: 'Form equal and opposite control arm lengths on both sides of the central diagonal.',
    p0: { x: 100, y: 120 },
    p3: { x: 300, y: 280 },
    targetC1: { x: 220, y: 120 },
    targetC2: { x: 180, y: 280 },
    initialC1: { x: 140, y: 180 },
    initialC2: { x: 260, y: 220 },
  },
]

// Fisher-Yates Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const QUESTIONS_PER_GAME = 6

// Evaluate point on cubic bezier: B(t)
function evalBezier(p0: Point, c1: Point, c2: Point, p3: Point, t: number): Point {
  const mt = 1 - t
  const mt2 = mt * mt
  const mt3 = mt2 * mt
  const t2 = t * t
  const t3 = t2 * t

  return {
    x: mt3 * p0.x + 3 * mt2 * t * c1.x + 3 * mt * t2 * c2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * c1.y + 3 * mt * t2 * c2.y + t3 * p3.y,
  }
}

// First derivative B'(t)
function evalBezierDeriv1(p0: Point, c1: Point, c2: Point, p3: Point, t: number): Point {
  const mt = 1 - t
  const mt2 = mt * mt
  const t2 = t * t

  return {
    x: 3 * mt2 * (c1.x - p0.x) + 6 * mt * t * (c2.x - c1.x) + 3 * t2 * (p3.x - c1.x),
    y: 3 * mt2 * (c1.y - p0.y) + 6 * mt * t * (c2.y - c1.y) + 3 * t2 * (p3.y - c1.y),
  }
}

// Second derivative B''(t)
function evalBezierDeriv2(p0: Point, c1: Point, c2: Point, p3: Point, t: number): Point {
  const mt = 1 - t

  return {
    x: 6 * mt * (c2.x - 2 * c1.x + p0.x) + 6 * t * (p3.x - 2 * c2.x + c1.x),
    y: 6 * mt * (c2.y - 2 * c1.y + p0.y) + 6 * t * (p3.y - 2 * c2.y + c1.y),
  }
}

// Calculate signed curvature K(t) and normal vector
function getCurvatureInfo(p0: Point, c1: Point, c2: Point, p3: Point, t: number) {
  const d1 = evalBezierDeriv1(p0, c1, c2, p3, t)
  const d2 = evalBezierDeriv2(p0, c1, c2, p3, t)

  const speedSq = d1.x * d1.x + d1.y * d1.y
  const speed = Math.sqrt(speedSq)
  if (speed < 1e-5) return { k: 0, nx: 0, ny: 0 }

  const num = d1.x * d2.y - d1.y * d2.x
  const k = num / Math.pow(speedSq, 1.5)

  // Unit normal vector
  const nx = -d1.y / speed
  const ny = d1.x / speed

  return { k, nx, ny }
}

// Calculate curve precision match score (0 - 100%)
function calculateCurveScore(user: BezierCurve, target: BezierCurve): number {
  const SAMPLES = 40
  let totalDist = 0

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const uPt = evalBezier(user.p0, user.c1, user.c2, user.p3, t)
    const tPt = evalBezier(target.p0, target.c1, target.c2, target.p3, t)

    const dx = uPt.x - tPt.x
    const dy = uPt.y - tPt.y
    totalDist += Math.sqrt(dx * dx + dy * dy)
  }

  const avgDist = totalDist / (SAMPLES + 1)
  const MAX_ERR = 35
  const score = Math.max(0, Math.min(100, (1 - avgDist / MAX_ERR) * 100))
  return Math.round(score)
}

export default function BezierSculptorPage() {
  const [challenges, setChallenges] = useState<ChallengeLevel[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [userC1, setUserC1] = useState<Point>({ x: 0, y: 0 })
  const [userC2, setUserC2] = useState<Point>({ x: 0, y: 0 })
  const [activeHandle, setActiveHandle] = useState<'c1' | 'c2' | null>(null)
  const [showComb, setShowComb] = useState(true)
  const [showTarget, setShowTarget] = useState(false)
  const [levelScores, setLevelScores] = useState<number[]>([])
  const [isFinished, setIsFinished] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [lastScore, setLastScore] = useState<number | null>(null)

  const svgRef = useRef<SVGSVGElement | null>(null)

  // Initialize and shuffle challenges on mount
  useEffect(() => {
    const shuffled = shuffleArray(CHALLENGE_POOL).slice(0, QUESTIONS_PER_GAME)
    setChallenges(shuffled)
  }, [])

  const level = challenges[currentLevelIdx]

  // Reset handle positions on level change
  useEffect(() => {
    if (!level) return
    setUserC1(level.initialC1)
    setUserC2(level.initialC2)
    setHasEvaluated(false)
    setLastScore(null)
  }, [currentLevelIdx, level])

  // Dragging logic
  const handlePointerDown = (handle: 'c1' | 'c2') => (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveHandle(handle)
  }

  const updateHandlePos = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current || !activeHandle) return
      const rect = svgRef.current.getBoundingClientRect()
      const scaleX = 400 / rect.width
      const scaleY = 400 / rect.height

      const x = Math.max(10, Math.min(390, (clientX - rect.left) * scaleX))
      const y = Math.max(10, Math.min(390, (clientY - rect.top) * scaleY))

      if (activeHandle === 'c1') setUserC1({ x, y })
      else if (activeHandle === 'c2') setUserC2({ x, y })
    },
    [activeHandle]
  )

  useEffect(() => {
    if (!activeHandle) return

    const onPointerMove = (e: PointerEvent) => {
      updateHandlePos(e.clientX, e.clientY)
    }
    const onPointerUp = () => {
      setActiveHandle(null)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [activeHandle, updateHandlePos])

  // Live score precision calculation
  const liveScore = level
    ? calculateCurveScore(
        { p0: level.p0, c1: userC1, c2: userC2, p3: level.p3 },
        { p0: level.p0, c1: level.targetC1, c2: level.targetC2, p3: level.p3 }
      )
    : 0

  // Dynamic stroke color for user curve based on accuracy
  const userCurveColor =
    liveScore >= 90
      ? '#10b981' // Emerald
      : liveScore >= 75
      ? '#3b82f6' // Blue
      : '#000000' // Black

  // Handle angle & length calculations for HUD tooltips
  const getHandleMetrics = (origin: Point, handle: Point) => {
    const dx = handle.x - origin.x
    const dy = handle.y - origin.y
    const len = Math.round(Math.sqrt(dx * dx + dy * dy))
    const angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI)
    return { len, angle }
  }

  const c1Metrics = level ? getHandleMetrics(level.p0, userC1) : { len: 0, angle: 0 }
  const c2Metrics = level ? getHandleMetrics(level.p3, userC2) : { len: 0, angle: 0 }

  // Evaluate current level score
  const handleCheckCurve = () => {
    const score = liveScore
    setLastScore(score)
    setHasEvaluated(true)
    setShowTarget(true)
  }

  const handleNextLevel = () => {
    if (lastScore !== null) {
      setLevelScores((prev) => [...prev, lastScore])
    }

    if (currentLevelIdx < challenges.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1)
      setShowTarget(false)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    const reshuffled = shuffleArray(CHALLENGE_POOL).slice(0, QUESTIONS_PER_GAME)
    setChallenges(reshuffled)
    setCurrentLevelIdx(0)
    setLevelScores([])
    setIsFinished(false)
    setHasStarted(true)
    setShowTarget(false)
  }

  const overallScore =
    levelScores.length > 0
      ? Math.round(levelScores.reduce((a, b) => a + b, 0) / levelScores.length)
      : 0

  const getRank = (score: number) => {
    if (score >= 93)
      return {
        title: 'Master Type Sculptor 🏆',
        desc: 'Flawless instinct for curvature continuity, tangent arms, and optical stem transitions.',
      }
    if (score >= 82)
      return {
        title: 'Senior Vector Artist ✍️',
        desc: 'Strong geometric precision with smooth C² curvature transitions.',
      }
    if (score >= 68)
      return {
        title: 'Anchor Precisionist 📐',
        desc: 'Good control handle awareness, but subtle flares and squircle inflection points still trip you up.',
      }
    return {
      title: 'Nodal Novice 🙈',
      desc: 'Bézier curves take practice! Watch the curvature comb spikes to spot abrupt tangent breaks.',
    }
  }

  // Generate SVG path strings
  const userPath = level
    ? `M ${level.p0.x} ${level.p0.y} C ${userC1.x} ${userC1.y}, ${userC2.x} ${userC2.y}, ${level.p3.x} ${level.p3.y}`
    : ''
  const targetPath = level
    ? `M ${level.p0.x} ${level.p0.y} C ${level.targetC1.x} ${level.targetC1.y}, ${level.targetC2.x} ${level.targetC2.y}, ${level.p3.x} ${level.p3.y}`
    : ''

  // Generate Curvature Comb normal lines
  const combLines: { x1: number; y1: number; x2: number; y2: number }[] = []
  if (level && showComb) {
    const STEPS = 36
    const SCALE = 2200
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS
      const pt = evalBezier(level.p0, userC1, userC2, level.p3, t)
      const { k, nx, ny } = getCurvatureInfo(level.p0, userC1, userC2, level.p3, t)

      const length = Math.min(80, Math.max(-80, k * SCALE))
      combLines.push({
        x1: pt.x,
        y1: pt.y,
        x2: pt.x + nx * length,
        y2: pt.y + ny * length,
      })
    }
  }

  if (!level && !isFinished && hasStarted) {
    return <div className="min-h-screen bg-white" />
  }

  return (
    <div
      className="bg-white min-h-screen px-6 md:px-8 pt-24 md:pt-32 pb-16 max-w-4xl mx-auto"
      style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
    >
      {/* Top Back Navigation */}
      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors mb-4"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Lab
        </Link>
        <LabHeader firstWord="Bezier" secondWord="Sculptor" />
      </div>

      {/* Main Container */}
      <div className="border border-gray-200 p-6 md:p-10 relative bg-white shadow-[inset_8px_0_24px_-8px_rgba(0,0,0,0.06)]">
        {/* Corner markers */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-zinc-300" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-zinc-300" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-zinc-300" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-zinc-300" />

        {!hasStarted ? (
          /* Onboarding Screen */
          <div className="py-4 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 mb-2 block font-medium">
              Vector Geometry & Curvature Studio
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-black tracking-tight mb-4"
              style={{ fontFamily: 'SatishSans, sans-serif' }}
            >
              What is Bezier Sculptor?
            </h2>
            <p className="text-sm text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Bezier Sculptor is an interactive vector curve intuition game designed to test your eye for cubic Bézier handles, tangency angles, and C² continuous curvature transitions across typography and UI geometry.
            </p>

            {/* Purpose & Learning Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="p-5 border border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-black font-medium mb-2">
                  🎯 Purpose & Uses
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Refine your micro-vector craftsmanship for icon design, custom font stem bracketing, superellipse UI corners, and continuous splines.
                </p>
              </div>

              <div className="p-5 border border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-black font-medium mb-2">
                  🧠 What You&apos;ll Learn
                </h3>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1">
                  <li>• Reading live Curvature Combs ($K(t)$ derivatives)</li>
                  <li>• Spotting abrupt curvature breaks vs C² continuity</li>
                  <li>• Aligning handle tangencies for optical stem flares</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setHasStarted(true)}
                className="px-8 py-3 bg-black text-white text-xs font-light tracking-wider hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
              >
                Start Challenge →
              </button>
            </div>
          </div>
        ) : !isFinished && level ? (
          /* Active Challenge Screen */
          <div>
            {/* Top Bar Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-3 text-xs">
              <div>
                <span className="font-mono uppercase tracking-widest text-orange-500 font-medium">
                  Challenge {currentLevelIdx + 1} of {challenges.length} — {level.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Toggle Curvature Comb */}
                <button
                  onClick={() => setShowComb(!showComb)}
                  className={`px-3 py-1.5 border text-[11px] font-mono transition-colors cursor-pointer ${
                    showComb
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'border-gray-300 text-gray-600 hover:border-black'
                  }`}
                >
                  {showComb ? '⚡ Curvature Comb ON' : '⚡ Curvature Comb OFF'}
                </button>

                {/* Toggle Target Reference */}
                <button
                  onClick={() => setShowTarget(!showTarget)}
                  className={`px-3 py-1.5 border text-[11px] font-mono transition-colors cursor-pointer ${
                    showTarget
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 text-gray-600 hover:border-black'
                  }`}
                >
                  👁 {showTarget ? 'Target Guide ON' : 'Show Target Guide'}
                </button>
              </div>
            </div>

            {/* Level Title & Hint */}
            <div className="mb-6">
              <h2
                className="text-2xl md:text-3xl font-light text-black tracking-tight mb-2"
                style={{ fontFamily: 'SatishSans, sans-serif' }}
              >
                {level.name}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-light mb-3">
                {level.description}
              </p>
              <div className="text-[11px] font-mono text-orange-600 bg-orange-50/60 p-2.5 border border-orange-200/60 inline-block">
                💡 Hint: {level.hint}
              </div>
            </div>

            {/* Interactive Vector Canvas Container */}
            <div className="relative w-full aspect-square max-w-[500px] mx-auto border border-gray-200 bg-gray-50/30 overflow-hidden mb-6 group">
              {/* Background Precision Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Real-time Live Precision HUD Pill */}
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <div
                  className={`px-3 py-1 text-[11px] font-mono border transition-all duration-200 shadow-sm ${
                    liveScore >= 90
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : liveScore >= 75
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  Live Precision: <span className="font-bold">{liveScore}%</span>
                </div>
              </div>

              {/* Canvas SVG */}
              <svg
                ref={svgRef}
                viewBox="0 0 400 400"
                className="w-full h-full select-none touch-none"
              >
                {/* Target Ghost Curve */}
                {showTarget && (
                  <path
                    d={targetPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    className="opacity-80"
                  />
                )}

                {/* Target Handles Ghost */}
                {showTarget && (
                  <>
                    <line
                      x1={level.p0.x}
                      y1={level.p0.y}
                      x2={level.targetC1.x}
                      y2={level.targetC1.y}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                    <line
                      x1={level.p3.x}
                      y1={level.p3.y}
                      x2={level.targetC2.x}
                      y2={level.targetC2.y}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                    <circle
                      cx={level.targetC1.x}
                      cy={level.targetC1.y}
                      r="4"
                      fill="#10b981"
                      opacity="0.7"
                    />
                    <circle
                      cx={level.targetC2.x}
                      cy={level.targetC2.y}
                      r="4"
                      fill="#10b981"
                      opacity="0.7"
                    />
                  </>
                )}

                {/* Curvature Comb Normal Lines */}
                {showComb &&
                  combLines.map((line, idx) => (
                    <line
                      key={idx}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#f97316"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  ))}

                {/* Comb Envelope Curve */}
                {showComb && combLines.length > 1 && (
                  <path
                    d={combLines.reduce(
                      (acc, pt, i) =>
                        i === 0
                          ? `M ${pt.x2} ${pt.y2}`
                          : `${acc} L ${pt.x2} ${pt.y2}`,
                      ''
                    )}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                )}

                {/* User Active Curve */}
                <path
                  d={userPath}
                  fill="none"
                  stroke={userCurveColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-colors duration-200"
                />

                {/* Control Handle Line 1 (P0 -> C1) */}
                <line
                  x1={level.p0.x}
                  y1={level.p0.y}
                  x2={userC1.x}
                  y2={userC1.y}
                  stroke="#3b82f6"
                  strokeWidth={activeHandle === 'c1' ? '2' : '1.5'}
                  strokeDasharray="3 3"
                />

                {/* Control Handle Line 2 (P3 -> C2) */}
                <line
                  x1={level.p3.x}
                  y1={level.p3.y}
                  x2={userC2.x}
                  y2={userC2.y}
                  stroke="#3b82f6"
                  strokeWidth={activeHandle === 'c2' ? '2' : '1.5'}
                  strokeDasharray="3 3"
                />

                {/* Fixed Anchor Points P0 & P3 */}
                <rect
                  x={level.p0.x - 4}
                  y={level.p0.y - 4}
                  width="8"
                  height="8"
                  fill="#000"
                />
                <rect
                  x={level.p3.x - 4}
                  y={level.p3.y - 4}
                  width="8"
                  height="8"
                  fill="#000"
                />

                {/* Draggable Control Handle C1 */}
                <g
                  onPointerDown={handlePointerDown('c1')}
                  className="cursor-grab active:cursor-grabbing group/c1"
                >
                  <circle
                    cx={userC1.x}
                    cy={userC1.y}
                    r="20"
                    fill="transparent"
                  />
                  <circle
                    cx={userC1.x}
                    cy={userC1.y}
                    r="7.5"
                    fill="#ffffff"
                    stroke="#3b82f6"
                    strokeWidth={activeHandle === 'c1' ? '3' : '2'}
                    className="transition-all duration-150"
                  />
                  <text
                    x={userC1.x}
                    y={userC1.y - 12}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fill="#3b82f6"
                    fontWeight="bold"
                  >
                    C1
                  </text>
                  {/* HUD Handle Metrics Tooltip */}
                  {(activeHandle === 'c1' || activeHandle === null) && (
                    <text
                      x={userC1.x}
                      y={userC1.y + 20}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="monospace"
                      fill="#6b7280"
                      className="opacity-60 group-hover/c1:opacity-100 transition-opacity"
                    >
                      {c1Metrics.len}px | {c1Metrics.angle}°
                    </text>
                  )}
                </g>

                {/* Draggable Control Handle C2 */}
                <g
                  onPointerDown={handlePointerDown('c2')}
                  className="cursor-grab active:cursor-grabbing group/c2"
                >
                  <circle
                    cx={userC2.x}
                    cy={userC2.y}
                    r="20"
                    fill="transparent"
                  />
                  <circle
                    cx={userC2.x}
                    cy={userC2.y}
                    r="7.5"
                    fill="#ffffff"
                    stroke="#3b82f6"
                    strokeWidth={activeHandle === 'c2' ? '3' : '2'}
                    className="transition-all duration-150"
                  />
                  <text
                    x={userC2.x}
                    y={userC2.y - 12}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fill="#3b82f6"
                    fontWeight="bold"
                  >
                    C2
                  </text>
                  {/* HUD Handle Metrics Tooltip */}
                  {(activeHandle === 'c2' || activeHandle === null) && (
                    <text
                      x={userC2.x}
                      y={userC2.y + 20}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="monospace"
                      fill="#6b7280"
                      className="opacity-60 group-hover/c2:opacity-100 transition-opacity"
                    >
                      {c2Metrics.len}px | {c2Metrics.angle}°
                    </text>
                  )}
                </g>
              </svg>
            </div>

            {/* Evaluation Score Output & Next Level Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
              <div>
                {hasEvaluated && lastScore !== null ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-light text-black font-mono">
                      {lastScore}% Match
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {lastScore >= 90
                        ? '✨ Excellent precision!'
                        : lastScore >= 75
                        ? '👍 Good tangency alignment.'
                        : '⚠️ Adjust handle length.'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-gray-400">
                    Drag handles C1 & C2 to sculpt the target curvature.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!hasEvaluated ? (
                  <button
                    onClick={handleCheckCurve}
                    className="px-6 py-2.5 bg-black text-white text-xs font-light tracking-wider hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
                    style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
                  >
                    Check Precision →
                  </button>
                ) : (
                  <button
                    onClick={handleNextLevel}
                    className="px-6 py-2.5 bg-black text-white text-xs font-light tracking-wider hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
                    style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
                  >
                    {currentLevelIdx < challenges.length - 1
                      ? 'Next Curve →'
                      : 'See Final Rank →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Game Complete Screen */
          <div className="text-center py-8">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 mb-2 block">
              Vector Challenge Complete
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-black mb-3"
              style={{ fontFamily: 'SatishSans, sans-serif' }}
            >
              {getRank(overallScore).title}
            </h2>
            <p className="text-sm text-gray-500 font-light mb-8 max-w-md mx-auto leading-relaxed">
              {getRank(overallScore).desc}
              <br />
              Average Curve Precision:{' '}
              <strong className="text-black font-normal font-mono">
                {overallScore}%
              </strong>
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 bg-black text-white text-xs font-light tracking-wider hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
              >
                Play Again ↺
              </button>
              <Link
                href="/lab"
                className="px-6 py-2.5 border border-gray-200 text-black text-xs font-light tracking-wider hover:border-black transition-colors duration-200"
              >
                Explore Lab →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
