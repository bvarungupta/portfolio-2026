'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  KEY_GRID,
  SONGS,
  SPEED_OPTIONS,
  SOUND_VOICES,
  KeyDef,
  SoundVoice,
  GameMode,
  SongId,
} from './songs'
import { IsoAudioEngine, SynthParams } from './audio'

type ThemeMode = 'light' | 'dark' | 'retro'

const ISO_SCALE_X = 66
const ISO_SCALE_Y = 34
const CENTER_X = 1.52
const CENTER_Y = 1.56
const ORIGIN_X = 270
const ORIGIN_Y = 178

type Pt = [number, number]

function projectIso(gx: number, gy: number, gz: number, yawDeg = 45): Pt {
  const rad = (yawDeg * Math.PI) / 180
  const dx = gx - CENTER_X
  const dy = gy - CENTER_Y
  const rx = dx * Math.cos(rad) - dy * Math.sin(rad)
  const ry = dx * Math.sin(rad) + dy * Math.cos(rad)
  return [ORIGIN_X + rx * ISO_SCALE_X, ORIGIN_Y + ry * ISO_SCALE_Y - gz]
}

function getRotatedDepth(gx: number, gy: number, yawDeg: number): number {
  const rad = (yawDeg * Math.PI) / 180
  const dx = gx - CENTER_X
  const dy = gy - CENTER_Y
  return dx * Math.sin(rad) + dy * Math.cos(rad)
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

function fmt(p: Pt): string {
  return `${p[0].toFixed(2)} ${p[1].toFixed(2)}`
}

interface RoundedRing {
  pts: Pt[]
  inPt: Pt[]
  outPt: Pt[]
  midPt: Pt[]
  c1: Pt[]
  c2: Pt[]
  path: string
}

function buildRoundedRing(
  cx: number,
  cy: number,
  halfSpanX: number,
  halfSpanY: number,
  z: number,
  yawDeg: number,
  r = 0.22
): RoundedRing {
  // Clockwise in world space: 0=(top-left), 1=(top-right), 2=(bottom-right), 3=(bottom-left)
  const pts: Pt[] = [
    projectIso(cx - halfSpanX, cy - halfSpanY, z, yawDeg),
    projectIso(cx + halfSpanX, cy - halfSpanY, z, yawDeg),
    projectIso(cx + halfSpanX, cy + halfSpanY, z, yawDeg),
    projectIso(cx - halfSpanX, cy + halfSpanY, z, yawDeg),
  ]

  const inPt: Pt[] = []
  const outPt: Pt[] = []
  const midPt: Pt[] = []
  const c1: Pt[] = []
  const c2: Pt[] = []

  let path = ''
  for (let i = 0; i < 4; i++) {
    const prev = pts[(i + 3) % 4]
    const curr = pts[i]
    const next = pts[(i + 1) % 4]

    const pIn = lerpPt(curr, prev, r)
    const pOut = lerpPt(curr, next, r)
    const pMid: Pt = [
      0.25 * pIn[0] + 0.5 * curr[0] + 0.25 * pOut[0],
      0.25 * pIn[1] + 0.5 * curr[1] + 0.25 * pOut[1],
    ]

    inPt.push(pIn)
    outPt.push(pOut)
    midPt.push(pMid)
    c1.push(lerpPt(pIn, curr, 0.5))
    c2.push(lerpPt(curr, pOut, 0.5))

    path += i === 0 ? `M ${fmt(pIn)} ` : `L ${fmt(pIn)} `
    path += `Q ${fmt(curr)} ${fmt(pOut)} `
  }
  path += 'Z'

  return { pts, inPt, outPt, midPt, c1, c2, path }
}

interface SideWall {
  path: string
  shade: number // 0 = darker right-leaning face, 1 = lighter left-leaning face
  depth: number
}

// 360-degree accurate curved prism walls: renders only front-facing faces at any yaw angle
function buildRotatedPrism(
  cx: number,
  cy: number,
  topSpanX: number,
  topSpanY: number,
  baseSpanX: number,
  baseSpanY: number,
  topZ: number,
  baseZ: number,
  yawDeg: number,
  r = 0.22
) {
  const top = buildRoundedRing(cx, cy, topSpanX, topSpanY, topZ, yawDeg, r)
  const base = buildRoundedRing(cx, cy, baseSpanX, baseSpanY, baseZ, yawDeg, r)

  const walls: SideWall[] = []
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    // In clockwise screen coords (+X right, +Y down), a front-facing outer wall has edge moving right-to-left (dx < 0)
    const dx = top.pts[j][0] - top.pts[i][0]
    if (dx < -0.5) {
      const edgeMidX = (top.pts[i][0] + top.pts[j][0]) * 0.5
      const centerScreen = projectIso(cx, cy, topZ, yawDeg)
      const shade = edgeMidX < centerScreen[0] ? 1 : 0
      const depth = (top.pts[i][1] + top.pts[j][1]) * 0.5

      const path = [
        `M ${fmt(top.midPt[i])}`,
        `Q ${fmt(top.c2[i])} ${fmt(top.outPt[i])}`,
        `L ${fmt(top.inPt[j])}`,
        `Q ${fmt(top.c1[j])} ${fmt(top.midPt[j])}`,
        `L ${fmt(base.midPt[j])}`,
        `Q ${fmt(base.c1[j])} ${fmt(base.inPt[j])}`,
        `L ${fmt(base.outPt[i])}`,
        `Q ${fmt(base.c2[i])} ${fmt(base.midPt[i])}`,
        'Z',
      ].join(' ')

      walls.push({ path, shade, depth })
    }
  }

  walls.sort((a, b) => a.depth - b.depth)
  return { topPath: top.path, walls }
}

function keyCenter(k: KeyDef): [number, number] {
  return [k.col * 1.04 - 0.03, k.row * 1.04 - 0.03]
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface Shockwave {
  gx: number
  gy: number
  radius: number
  alpha: number
  color: string
}

// Bespoke thematic micro-art for each song cartridge (zero generic numbering)
function SongMotifIcon({ id, accent, active }: { id: SongId; accent: string; active: boolean }) {
  const stroke = active ? accent : 'currentColor'
  if (id === 'free') {
    return (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="shrink-0">
        <path
          d="M1 8C3 2 5 2 7 8C9 14 11 14 13 8C15 3 17 3 19 8"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (id === 'blinding') {
    return (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="shrink-0">
        <circle cx="10" cy="8" r="3.2" stroke={stroke} strokeWidth="1.5" />
        <path d="M10 1.5V3.2M10 12.8V14.5M3.5 8H5.2M14.8 8H16.5M5.4 3.4L6.6 4.6M13.4 11.4L14.6 12.6M14.6 3.4L13.4 4.6M6.6 11.4L5.4 12.6" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'shape') {
    return (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="shrink-0">
        <polygon points="10,2 17,8 10,14 3,8" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="10" cy="8" r="1.6" fill={stroke} />
      </svg>
    )
  }
  if (id === 'faded') {
    return (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="shrink-0">
        <rect x="2.5" y="2.5" width="15" height="11" rx="1.8" stroke={stroke} strokeWidth="1.4" />
        <path d="M5.5 10.5V5.5L8.2 9L10.9 5.5V10.5M13 10.5L14.8 5.5L16 10.5" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (id === 'wakemeup') {
    return (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="shrink-0">
        <path d="M3 12H17" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M5.5 12A4.5 4.5 0 0 1 14.5 12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 3.5V5.2M4.8 5.8L6 7M15.2 5.8L14 7" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="shrink-0">
      <path d="M2 13L6 5L10 11L14 3L18 13" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="3" r="1.5" fill={stroke} />
    </svg>
  )
}

const SONG_THEME: Record<SongId, { tag: string; accent: string }> = {
  free: { tag: 'Freestyle', accent: '#71717a' },
  blinding: { tag: 'The Weeknd', accent: '#f43f5e' },
  shape: { tag: 'Ed Sheeran', accent: '#fb923c' },
  faded: { tag: 'Alan Walker', accent: '#06b6d4' },
  wakemeup: { tag: 'Avicii', accent: '#10b981' },
  stranger: { tag: '80s Synth', accent: '#8b5cf6' },
}

const STUDIO_THEME: Record<
  ThemeMode,
  {
    page: string
    labLink: string
    titleText: string
    modeShell: string
    notesOn: string
    notesOff: string
    audioOn: string
    chassis: string
    rivet: string
    rack: string
    tileActive: string
    tileIdle: string
    tileTagActive: string
    display: string
    displayMeta: string
    displayPill: string
    displayScore: string
    runway: string
    cardActive: string
    cardIdle: string
    cardFirstLabel: string
    miniBox: string
    miniCellOff: string
    runwayFade: string
    emptyCardText: string
    scopeBox: string
    dspBox: string
    dspDivider: string
    dspResetActive: string
    dspResetIdle: string
    voiceActive: string
    voiceIdle: string
    padBay: string
    padBarBorder: string
    listenIdle: string
    modeToggleBg: string
    stepActive: string
    stepIdle: string
    speedIdle: string
    speedMenu: string
    speedMenuHover: string
    drumsOn: string
    drumsOff: string
    orbitBtn: string
    orbitResetIdle: string
    bpmWrap: string
    bpmVal: string
    overlayBg: string
    modalCard: string
    modalLabel: string
    modalTitle: string
    modalBadge: string
    modalStatBox: string
    modalStatVal: string
    modalStreakVal: string
    modalReplay: string
    modalNext: string
    railBorder: string
    railKbd: string
    knobTrack: string
    knobFill: string
    knobStroke: string
    knobPointer: string
    knobLabel: string
    knobVal: string
    svgShadow: string
    svgWallL: string
    svgWallR: string
    svgWallStroke: string
    svgDeckTop: string
    svgDeckStroke: string
    svgWellFill: string
    svgWellStroke: string
    svgStrumIdle: string
    svgStrumStroke: string
    svgKeyTop: string
    svgKeyTopHover: string
    svgKeyCue: string | null
    svgKeyWallL: string
    svgKeyWallR: string
    svgKeyTopStroke: string
    svgKeyTopHoverStroke: string
    svgKeySocket: string
    svgKeySocketStroke: string
    svgKeyWallStroke: string
    svgInnerDish: string
    svgLegend: string
    svgLegendCue: string
    svgNoteIdle: string
  }
> = {
  light: {
    page: 'bg-white text-zinc-900',
    labLink: 'bg-white border-zinc-300 text-zinc-600 hover:border-zinc-900 hover:text-black shadow-xs',
    titleText: 'text-black',
    modeShell: 'bg-zinc-200/80 border-zinc-300',
    notesOn: 'bg-white border-zinc-400 text-black font-medium shadow-xs',
    notesOff: 'bg-zinc-200/50 border-zinc-300 text-zinc-500',
    audioOn: 'bg-white border-zinc-300 text-zinc-800 hover:border-black shadow-xs',
    chassis:
      'bg-[#fafafa] border-zinc-200 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]',
    rivet: 'bg-zinc-300 border-zinc-400/70',
    rack: 'bg-[#f4f4f5] border-zinc-200/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]',
    tileActive: 'bg-white text-black shadow-xs',
    tileIdle: 'bg-white/75 border-zinc-200 text-zinc-600 hover:bg-white hover:border-zinc-300 hover:text-black',
    tileTagActive: 'text-zinc-700 font-semibold',
    display: 'bg-white border-zinc-200 shadow-[inset_0_1px_4px_rgba(0,0,0,0.03)]',
    displayMeta: 'text-zinc-500',
    displayPill: 'bg-white border-zinc-300 text-zinc-900',
    displayScore: 'text-zinc-900',
    runway: 'bg-[#f4f4f5] border-zinc-200',
    cardActive: 'bg-white border-transparent opacity-100 shadow-xs',
    cardIdle: 'bg-white/75 border-zinc-300 opacity-75',
    cardFirstLabel: '#18181b',
    miniBox: 'bg-zinc-100',
    miniCellOff: '#d4d4d8',
    runwayFade: 'from-[#f4f4f5]',
    emptyCardText: 'text-zinc-800',
    scopeBox: 'bg-[#f4f4f5] border-zinc-200',
    dspBox: 'bg-[#f4f4f5] border-zinc-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]',
    dspDivider: 'border-zinc-200',
    dspResetActive: 'bg-white border-zinc-300 text-zinc-900 hover:border-black cursor-pointer shadow-2xs',
    dspResetIdle: 'bg-transparent border-zinc-200 text-zinc-400 cursor-default',
    voiceActive: 'bg-zinc-900 text-white border-black font-bold shadow-[0_1.5px_0_#000]',
    voiceIdle: 'bg-white/80 border-zinc-300 text-zinc-600 hover:bg-white hover:text-black',
    padBay: 'bg-[#f4f4f5] border-zinc-200/90 shadow-[inset_0_1px_4px_rgba(0,0,0,0.03)]',
    padBarBorder: 'border-zinc-200',
    listenIdle: 'bg-[#18181b] border-black text-white hover:bg-zinc-800',
    modeToggleBg: 'bg-[#e4e4e7] border-zinc-300',
    stepActive: 'bg-white text-black font-bold shadow-xs',
    stepIdle: 'text-zinc-600 hover:text-black',
    speedIdle: 'bg-white border-zinc-300 text-zinc-700 hover:border-black',
    speedMenu: 'bg-white border-zinc-200 text-zinc-800',
    speedMenuHover: 'hover:bg-zinc-100',
    drumsOn: 'bg-white border-zinc-400 text-black font-medium',
    drumsOff: 'bg-zinc-100 border-zinc-300 text-zinc-400',
    orbitBtn: 'bg-white border-zinc-300 text-zinc-700 hover:border-black',
    orbitResetIdle: 'bg-white border-zinc-300 text-zinc-700 hover:border-black',
    bpmWrap: 'text-zinc-600',
    bpmVal: 'text-black',
    overlayBg: 'bg-white/80',
    modalCard: 'bg-white border-zinc-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)]',
    modalLabel: 'text-orange-600',
    modalTitle: 'text-zinc-900',
    modalBadge: 'bg-orange-50 border-orange-300 text-orange-600',
    modalStatBox: 'bg-[#f4f4f5] border-zinc-200',
    modalStatVal: 'text-zinc-900',
    modalStreakVal: 'text-orange-600',
    modalReplay: 'bg-zinc-900 text-white hover:bg-zinc-800',
    modalNext: 'bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400',
    railBorder: 'border-zinc-200 text-zinc-500',
    railKbd: 'bg-white border-zinc-300 text-zinc-800',
    knobTrack: '#e4e4e7',
    knobFill: '#ffffff',
    knobStroke: '#d4d4d8',
    knobPointer: '#18181b',
    knobLabel: 'text-zinc-500',
    knobVal: 'text-zinc-800',
    svgShadow: 'rgba(0,0,0,0.08)',
    svgWallL: '#f4f4f5',
    svgWallR: '#e4e4e7',
    svgWallStroke: '#d4d4d8',
    svgDeckTop: '#ffffff',
    svgDeckStroke: '#d4d4d8',
    svgWellFill: '#f4f4f5',
    svgWellStroke: '#e4e4e7',
    svgStrumIdle: '#ffffff',
    svgStrumStroke: '#d4d4d8',
    svgKeyTop: '#ffffff',
    svgKeyTopHover: '#ffffff',
    svgKeyCue: null,
    svgKeyWallL: '#f4f4f5',
    svgKeyWallR: '#e4e4e7',
    svgKeyTopStroke: '#a1a1aa',
    svgKeyTopHoverStroke: '#52525b',
    svgKeySocket: '#e4e4e7',
    svgKeySocketStroke: '#d4d4d8',
    svgKeyWallStroke: '#d4d4d8',
    svgInnerDish: 'rgba(0,0,0,0.06)',
    svgLegend: '#18181b',
    svgLegendCue: '#18181b',
    svgNoteIdle: '#71717a',
  },
  dark: {
    page: 'bg-[#0b0c10] text-zinc-100',
    labLink: 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white',
    titleText: 'text-white',
    modeShell: 'bg-zinc-950 border-zinc-800',
    notesOn: 'bg-zinc-900 border-zinc-600 text-zinc-200',
    notesOff: 'bg-zinc-950 border-zinc-800 text-zinc-500',
    audioOn: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    chassis:
      'bg-[#12141b] border-zinc-800 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.05)]',
    rivet: 'bg-zinc-800 border-zinc-700',
    rack: 'bg-[#0a0c10] border-zinc-800/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]',
    tileActive: 'bg-[#1c202c] text-white',
    tileIdle: 'bg-[#151822] border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white',
    tileTagActive: 'text-zinc-200 font-semibold',
    display: 'bg-[#07080c] border-zinc-800 shadow-[inset_0_2px_20px_rgba(0,0,0,0.95)]',
    displayMeta: 'text-zinc-400',
    displayPill: 'bg-zinc-900 border-zinc-800 text-zinc-100',
    displayScore: 'text-white',
    runway: 'bg-[#0c0e14] border-zinc-800/80',
    cardActive: 'bg-zinc-900 border-transparent opacity-100',
    cardIdle: 'bg-zinc-950/90 border-zinc-800 opacity-70',
    cardFirstLabel: '#ffffff',
    miniBox: 'bg-black/50',
    miniCellOff: '#27272a',
    runwayFade: 'from-[#0c0e14]',
    emptyCardText: 'text-zinc-200',
    scopeBox: 'bg-[#050608] border-zinc-800/70',
    dspBox: 'bg-[#151821] border-zinc-800/90',
    dspDivider: 'border-zinc-800/80',
    dspResetActive: 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-500 cursor-pointer',
    dspResetIdle: 'bg-transparent border-zinc-800 text-zinc-600 cursor-default',
    voiceActive: 'bg-zinc-100 text-black border-white font-bold',
    voiceIdle: 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white',
    padBay: 'bg-[#0d0f15] border-zinc-800/80 shadow-[inset_0_2px_12px_rgba(0,0,0,0.65)]',
    padBarBorder: 'border-zinc-800/80',
    listenIdle: 'bg-orange-500/20 border-orange-500 text-orange-300 hover:bg-orange-500/30',
    modeToggleBg: 'bg-zinc-950 border-zinc-800',
    stepActive: 'bg-zinc-100 text-black font-bold',
    stepIdle: 'text-zinc-400 hover:text-white',
    speedIdle: 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-500',
    speedMenu: 'bg-[#151822] border-zinc-700 text-zinc-200',
    speedMenuHover: 'hover:bg-zinc-800',
    drumsOn: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    drumsOff: 'bg-zinc-950 border-zinc-800 text-zinc-600',
    orbitBtn: 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500',
    orbitResetIdle: 'bg-zinc-900 border-zinc-700 text-zinc-300',
    bpmWrap: 'text-zinc-400',
    bpmVal: 'text-white',
    overlayBg: 'bg-[#0a0b0f]/85',
    modalCard: 'bg-zinc-950 border-zinc-800 shadow-2xl',
    modalLabel: 'text-orange-400',
    modalTitle: 'text-white',
    modalBadge: 'bg-orange-500/15 border-orange-500/60 text-orange-400',
    modalStatBox: 'bg-zinc-900 border-zinc-800',
    modalStatVal: 'text-white',
    modalStreakVal: 'text-orange-400',
    modalReplay: 'bg-white text-black hover:bg-zinc-200',
    modalNext: 'border-zinc-700 text-white hover:border-zinc-500',
    railBorder: 'border-zinc-800/80 text-zinc-500',
    railKbd: 'bg-zinc-900 border-zinc-700 text-zinc-200',
    knobTrack: '#272a36',
    knobFill: '#171922',
    knobStroke: '#3a3f52',
    knobPointer: '#ffffff',
    knobLabel: 'text-zinc-400',
    knobVal: 'text-zinc-200',
    svgShadow: 'rgba(0,0,0,0.68)',
    svgWallL: '#181b24',
    svgWallR: '#12141b',
    svgWallStroke: '#2d3242',
    svgDeckTop: '#1e222d',
    svgDeckStroke: '#3b4156',
    svgWellFill: '#0e1015',
    svgWellStroke: '#252936',
    svgStrumIdle: '#191d28',
    svgStrumStroke: '#3e4559',
    svgKeyTop: '#1b1e28',
    svgKeyTopHover: '#282c3a',
    svgKeyCue: '#252938',
    svgKeyWallL: '#161922',
    svgKeyWallR: '#11131a',
    svgKeyTopStroke: '#3b4054',
    svgKeyTopHoverStroke: '#71717a',
    svgKeySocket: '#090a0e',
    svgKeySocketStroke: '#202432',
    svgKeyWallStroke: '#2e3346',
    svgInnerDish: 'rgba(255,255,255,0.06)',
    svgLegend: '#d4d4d8',
    svgLegendCue: '#ffffff',
    svgNoteIdle: '#71717a',
  },
  retro: {
    page: 'bg-[#0e0716] text-amber-50',
    labLink: 'bg-[#1c112a] border-[#59356e] text-amber-100/80 hover:border-cyan-400 hover:text-cyan-200',
    titleText: 'text-[#fef3c7]',
    modeShell: 'bg-[#150c20] border-[#4b2d5a]',
    notesOn: 'bg-[#231433] border-cyan-400/60 text-cyan-200',
    notesOff: 'bg-[#150c20] border-[#3d254c] text-amber-100/45',
    audioOn: 'bg-[#231433] border-[#59356e] text-amber-100 hover:border-fuchsia-400',
    chassis:
      'bg-[#191023] border-[#7c4b27] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.9),0_0_55px_-12px_rgba(217,70,239,0.22),inset_0_1px_0_rgba(253,230,138,0.14)]',
    rivet: 'bg-amber-700/80 border-amber-400/50',
    rack: 'bg-[#100918] border-[#442a37] shadow-[inset_0_2px_10px_rgba(0,0,0,0.85)]',
    tileActive: 'bg-[#28183b] text-[#fef3c7]',
    tileIdle: 'bg-[#1d122b] border-[#3b2549] text-amber-100/70 hover:border-cyan-400/50 hover:text-amber-50',
    tileTagActive: 'text-cyan-300 font-semibold',
    display:
      'bg-[#041014] border-[#155e75] shadow-[inset_0_2px_22px_rgba(0,0,0,0.96),0_0_24px_rgba(34,211,238,0.1)]',
    displayMeta: 'text-cyan-300/75',
    displayPill: 'bg-[#092129] border-[#0e7490] text-cyan-200',
    displayScore: 'text-amber-300',
    runway: 'bg-[#06171d] border-[#155e75]/75',
    cardActive: 'bg-[#0b2730] border-transparent opacity-100',
    cardIdle: 'bg-[#071a21]/95 border-[#134e4a]/75 opacity-75',
    cardFirstLabel: '#a5f3fc',
    miniBox: 'bg-black/60',
    miniCellOff: '#164e63',
    runwayFade: 'from-[#06171d]',
    emptyCardText: 'text-cyan-100',
    scopeBox: 'bg-[#030c10] border-[#155e75]/80',
    dspBox: 'bg-[#20142c] border-[#523346] shadow-[inset_0_1px_0_rgba(251,191,36,0.08)]',
    dspDivider: 'border-[#3f2644]',
    dspResetActive: 'bg-[#2b1a3d] border-amber-400/60 text-amber-200 hover:border-cyan-300 cursor-pointer',
    dspResetIdle: 'bg-transparent border-[#3b2549] text-amber-100/35 cursor-default',
    voiceActive: 'bg-amber-400 text-[#1b1026] border-amber-200 font-bold shadow-[0_0_12px_rgba(251,191,36,0.45)]',
    voiceIdle: 'bg-[#291a39] border-[#4b3159] text-amber-100/75 hover:border-cyan-400/60 hover:text-white',
    padBay: 'bg-[#120a1b] border-[#57343e] shadow-[inset_0_2px_16px_rgba(0,0,0,0.85)]',
    padBarBorder: 'border-[#3b2545]',
    listenIdle: 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-200 hover:bg-fuchsia-500/35',
    modeToggleBg: 'bg-[#0c0614] border-[#3d264d]',
    stepActive: 'bg-amber-300 text-[#1a0f24] font-bold',
    stepIdle: 'text-amber-100/65 hover:text-white',
    speedIdle: 'bg-[#231433] border-[#4e3161] text-amber-100 hover:border-cyan-400',
    speedMenu: 'bg-[#1b1028] border-[#59356e] text-amber-50',
    speedMenuHover: 'hover:bg-[#2c1a42]',
    drumsOn: 'bg-[#231433] border-cyan-400/55 text-cyan-200',
    drumsOff: 'bg-[#120a1b] border-[#362044] text-amber-100/35',
    orbitBtn: 'bg-[#231433] border-[#4e3161] text-amber-200 hover:border-cyan-400',
    orbitResetIdle: 'bg-[#231433] border-[#4e3161] text-amber-200',
    bpmWrap: 'text-cyan-300/75',
    bpmVal: 'text-amber-300',
    overlayBg: 'bg-[#0e0716]/88',
    modalCard: 'bg-[#1a1026] border-[#7c4b27] shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_32px_rgba(232,121,249,0.2)]',
    modalLabel: 'text-cyan-300',
    modalTitle: 'text-[#fef3c7]',
    modalBadge: 'bg-fuchsia-500/20 border-fuchsia-400/70 text-fuchsia-300',
    modalStatBox: 'bg-[#11091b] border-[#3f264e]',
    modalStatVal: 'text-amber-100',
    modalStreakVal: 'text-cyan-300',
    modalReplay: 'bg-gradient-to-r from-amber-400 to-orange-400 text-[#191023] hover:brightness-110',
    modalNext: 'border-[#59356e] text-amber-100 hover:border-cyan-400',
    railBorder: 'border-[#3b2545] text-amber-100/55',
    railKbd: 'bg-[#231433] border-[#59356e] text-amber-200',
    knobTrack: '#3b2549',
    knobFill: '#f5ead6',
    knobStroke: '#8a653f',
    knobPointer: '#2b1910',
    knobLabel: 'text-amber-200/70',
    knobVal: 'text-amber-100',
    svgShadow: 'rgba(6,2,14,0.75)',
    svgWallL: '#5c3116',
    svgWallR: '#3e1f0d',
    svgWallStroke: '#8f522b',
    svgDeckTop: '#6e3b1b',
    svgDeckStroke: '#a86336',
    svgWellFill: '#0e0717',
    svgWellStroke: '#22d3ee55',
    svgStrumIdle: '#2a183b',
    svgStrumStroke: '#22d3ee66',
    svgKeyTop: '#f5ead6',
    svgKeyTopHover: '#fff7e8',
    svgKeyCue: '#2a163d',
    svgKeyWallL: '#e0ceb0',
    svgKeyWallR: '#c3ad89',
    svgKeyTopStroke: '#9c7f57',
    svgKeyTopHoverStroke: '#22d3ee',
    svgKeySocket: '#150b21',
    svgKeySocketStroke: '#4c2f63',
    svgKeyWallStroke: '#9c7f57',
    svgInnerDish: 'rgba(120,75,39,0.16)',
    svgLegend: '#281810',
    svgLegendCue: '#ffffff',
    svgNoteIdle: '#785a43',
  },
}

// Physical Machined Rotary Encoder Knob
function RotaryKnob({
  label,
  value,
  accent,
  theme,
  onChange,
}: {
  label: string
  value: number
  accent: string
  theme: ThemeMode
  onChange: (next: number) => void
}) {
  const T = STUDIO_THEME[theme]
  const dragStartRef = useRef<{ y: number; startVal: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragStartRef.current = { y: e.clientY, startVal: value }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return
    const dy = dragStartRef.current.y - e.clientY
    const next = Math.min(1, Math.max(0, dragStartRef.current.startVal + dy / 100))
    onChange(next)
  }

  const handlePointerUp = () => {
    dragStartRef.current = null
  }

  const angle = -135 + value * 270
  const r = 18
  const circ = 2 * Math.PI * r
  const arcLen = circ * 0.75
  const filledLen = arcLen * value

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault()
          onChange(Math.min(1, Math.max(0, value - e.deltaY * 0.0015)))
        }}
        title="Drag up/down or scroll"
        className="relative w-11 h-11 cursor-ns-resize flex items-center justify-center"
      >
        <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke={T.knobTrack}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circ}`}
            transform="rotate(135 24 24)"
          />
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${filledLen} ${circ}`}
            transform="rotate(135 24 24)"
          />
          <circle
            cx="24"
            cy="24"
            r="12.5"
            fill={T.knobFill}
            stroke={T.knobStroke}
            strokeWidth="1.2"
          />
          <g transform={`rotate(${angle} 24 24)`}>
            <line
              x1="24"
              y1="24"
              x2="24"
              y2="13.5"
              stroke={T.knobPointer}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
      <div className="text-center leading-none">
        <div
          className={`text-[8.5px] font-mono tracking-widest uppercase ${T.knobLabel}`}
        >
          {label}
        </div>
        <div
          className={`text-[9.5px] font-mono font-medium mt-0.5 ${T.knobVal}`}
        >
          {Math.round(value * 100)}
        </div>
      </div>
    </div>
  )
}

const DEFAULT_SYNTH_PARAMS: SynthParams = {
  cutoff: 0.78,
  reverb: 0.42,
  delay: 0.35,
}

export default function IsoStudioPage() {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [yawDeg, setYawDeg] = useState(45) // Rotatable isometric azimuth angle!
  const [voice, setVoice] = useState<SoundVoice>('juno')
  const [gameMode, setGameMode] = useState<GameMode>('zen')
  const [selectedSong, setSelectedSong] = useState<SongId>('blinding')
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false)
  const [isPlayingArcade, setIsPlayingArcade] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [drumsEnabled, setDrumsEnabled] = useState(true)
  const [showNotes, setShowNotes] = useState(true)
  const [synthParams, setSynthParams] = useState<SynthParams>(DEFAULT_SYNTH_PARAMS)

  const isDspModified =
    Math.abs(synthParams.cutoff - DEFAULT_SYNTH_PARAMS.cutoff) > 0.005 ||
    Math.abs(synthParams.reverb - DEFAULT_SYNTH_PARAMS.reverb) > 0.005 ||
    Math.abs(synthParams.delay - DEFAULT_SYNTH_PARAMS.delay) > 0.005

  const [songStepIdx, setSongStepIdx] = useState(0)
  const [arcadeProgress, setArcadeProgress] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [hitsRight, setHitsRight] = useState(0)
  const [hitsTotal, setHitsTotal] = useState(0)
  const [songComplete, setSongComplete] = useState(false)
  const [judgeBanner, setJudgeBanner] = useState<{
    text: string
    delta?: string
    color: string
    id: number
  } | null>(null)

  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [lastKey, setLastKey] = useState<KeyDef>(KEY_GRID[8])
  const [ambientColor, setAmbientColor] = useState('#fb923c')
  const [ribbonIdx, setRibbonIdx] = useState<number | null>(null)

  const physicsRef = useRef<Record<string, { z: number; vz: number }>>({})
  const deckTiltRef = useRef({ rx: 0, ry: 0, vrx: 0, vry: 0 })
  const tapeShiftRef = useRef(0)
  const yawRef = useRef(45)
  const orbitDragRef = useRef<{ startX: number; startYaw: number } | null>(null)
  const [, setTick] = useState(0)

  const audioRef = useRef<IsoAudioEngine | null>(null)
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const sparksRef = useRef<Spark[]>([])
  const wavesRef = useRef<Shockwave[]>([])

  const activeKeysRef = useRef<Record<string, boolean>>({})
  const hoveredIdRef = useRef<string | null>(null)
  const pointerDownRef = useRef(false)
  const ribbonDraggingRef = useRef(false)
  const lastRibbonIdxRef = useRef<number | null>(null)

  const voiceRef = useRef<SoundVoice>('juno')
  const isMutedRef = useRef(false)
  const themeRef = useRef<ThemeMode>('light')
  const gameModeRef = useRef<GameMode>('zen')
  const selectedSongRef = useRef<SongId>('blinding')
  const songStepIdxRef = useRef(0)
  const isPlayingArcadeRef = useRef(false)
  const isAutoPlayingRef = useRef(false)
  const arcadeStepHitRef = useRef(false)
  const lastBeatTimeRef = useRef(0)
  const drumsEnabledRef = useRef(true)

  yawRef.current = yawDeg
  themeRef.current = theme
  voiceRef.current = voice
  isMutedRef.current = isMuted
  gameModeRef.current = gameMode
  selectedSongRef.current = selectedSong
  songStepIdxRef.current = songStepIdx
  isPlayingArcadeRef.current = isPlayingArcade
  isAutoPlayingRef.current = isAutoPlaying
  drumsEnabledRef.current = drumsEnabled

  if (Object.keys(physicsRef.current).length === 0) {
    for (const k of KEY_GRID) {
      physicsRef.current[k.id] = { z: 0, vz: 0 }
    }
  }

  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new IsoAudioEngine()
    return audioRef.current
  }, [])

  useEffect(() => {
    audioRef.current?.setParams(synthParams)
  }, [synthParams])

  const spawnKeyFX = useCallback((keyDef: KeyDef, multiplier = 1) => {
    const [cx, cy] = keyCenter(keyDef)
    const [sx, sy] = projectIso(cx, cy, 8, yawRef.current)
    const count = 14 + Math.min(10, multiplier * 2)
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45
      const speed = 1.5 + Math.random() * 2.9
      sparksRef.current.push({
        x: sx,
        y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.65 - 2.2 - Math.random() * 1.4,
        life: 0,
        maxLife: 24 + Math.random() * 12,
        color: keyDef.accent,
        size: 1.8 + Math.random() * 2,
      })
    }
    wavesRef.current.push({
      gx: cx,
      gy: cy,
      radius: 0.45,
      alpha: 0.9,
      color: keyDef.accent,
    })
  }, [])

  const showJudgment = useCallback((text: string, color: string, delta?: string) => {
    setJudgeBanner({ text, color, delta, id: Math.random() })
  }, [])

  const handleSongHit = useCallback(
    (pressedKey: KeyDef) => {
      if (selectedSongRef.current === 'free' || isAutoPlayingRef.current) return
      const song = SONGS.find((s) => s.id === selectedSongRef.current)
      if (!song) return

      const idx = songStepIdxRef.current
      const currentStep = song.steps[idx]
      const targetLabel = currentStep.key

      if (gameModeRef.current === 'zen') {
        setHitsTotal((t) => t + 1)
        if (pressedKey.label === targetLabel) {
          setHitsRight((r) => r + 1)
          const nextStreak = streak + 1
          const mult = nextStreak >= 16 ? 4 : nextStreak >= 8 ? 3 : nextStreak >= 4 ? 2 : 1
          setStreak(nextStreak)
          setMaxStreak((m) => Math.max(m, nextStreak))
          setScore((s) => s + 100 * mult)
          tapeShiftRef.current = 1.0
          showJudgment(mult > 1 ? `LOCKED ×${mult}` : 'LOCKED', pressedKey.accent)

          if (idx + 1 >= song.steps.length) {
            setSongComplete(true)
            setSongStepIdx(0)
            songStepIdxRef.current = 0
          } else {
            setSongStepIdx(idx + 1)
            songStepIdxRef.current = idx + 1
          }
        } else {
          setStreak(0)
          showJudgment(`EXPECTED ${targetLabel}`, '#f43f5e')
        }
      } else if (isPlayingArcadeRef.current) {
        const beatMs = (60000 / song.bpm) * currentStep.beats
        const elapsed = performance.now() - lastBeatTimeRef.current
        const progress = elapsed / beatMs
        const deltaMs = Math.round(elapsed)

        setHitsTotal((t) => t + 1)
        const nextLabel = song.steps[(idx + 1) % song.steps.length].key

        if (!arcadeStepHitRef.current && pressedKey.label === targetLabel) {
          arcadeStepHitRef.current = true
          const isPerfect = progress <= 0.55
          const nextStreak = streak + 1
          const mult = nextStreak >= 16 ? 4 : nextStreak >= 8 ? 3 : nextStreak >= 4 ? 2 : 1
          setHitsRight((r) => r + 1)
          setStreak(nextStreak)
          setMaxStreak((m) => Math.max(m, nextStreak))
          setScore((s) => s + (isPerfect ? 150 : 90) * mult)
          showJudgment(
            isPerfect ? `PERFECT ×${mult}` : `GREAT ×${mult}`,
            isPerfect ? '#0284c7' : pressedKey.accent,
            `+${deltaMs}ms`
          )
        } else if (progress > 0.65 && pressedKey.label === nextLabel) {
          const earlyMs = Math.round(elapsed - beatMs)
          setHitsRight((r) => r + 1)
          setStreak((s) => s + 1)
          setScore((s) => s + 75)
          showJudgment('EARLY', '#7c3aed', `${earlyMs}ms`)
        } else {
          setStreak(0)
          showJudgment('MISS', '#f43f5e')
        }
      }
    },
    [streak, showJudgment]
  )

  const triggerKeyDown = useCallback(
    (keyDef: KeyDef, playAudio = true, isAutomated = false) => {
      const wasActive = activeKeysRef.current[keyDef.id]
      activeKeysRef.current = { ...activeKeysRef.current, [keyDef.id]: true }
      setActiveKeys({ ...activeKeysRef.current })
      setLastKey(keyDef)
      setAmbientColor(keyDef.accent)

      if (!wasActive || isAutomated) {
        if (playAudio) getAudio().playNote(keyDef, voiceRef.current, isMutedRef.current, isAutomated ? 0.72 : 1)
        spawnKeyFX(keyDef, Math.min(4, Math.floor(streak / 4) + 1))
        if (!isAutomated) handleSongHit(keyDef)

        deckTiltRef.current.vrx += (keyDef.row - 1.5) * 0.42
        deckTiltRef.current.vry += (keyDef.col - 1.5) * -0.42

        for (const other of KEY_GRID) {
          const p = physicsRef.current[other.id]
          if (!p) continue
          if (other.id === keyDef.id) {
            p.vz -= 3.2
          } else {
            const dist = Math.hypot(other.row - keyDef.row, other.col - keyDef.col)
            if (dist <= 2.6) {
              p.vz -= 1.5 * Math.max(0, 1 - dist / 2.8)
            }
          }
        }
      }
    },
    [getAudio, spawnKeyFX, handleSongHit, streak]
  )

  const triggerKeyUp = useCallback((keyId: string) => {
    if (!activeKeysRef.current[keyId]) return
    const next = { ...activeKeysRef.current }
    delete next[keyId]
    activeKeysRef.current = next
    setActiveKeys(next)
  }, [])

  const triggerChordWave = useCallback(() => {
    const chord = [KEY_GRID[12], KEY_GRID[8], KEY_GRID[10], KEY_GRID[4]]
    chord.forEach((k, i) => {
      setTimeout(() => {
        triggerKeyDown(k, true, true)
        setTimeout(() => triggerKeyUp(k.id), 140)
      }, i * 48)
    })
  }, [triggerKeyDown, triggerKeyUp])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (!e.repeat) triggerChordWave()
        return
      }
      const matched = KEY_GRID.find((k) => k.code === e.code)
      if (matched) {
        e.preventDefault()
        if (!e.repeat) {
          if (isAutoPlayingRef.current) setIsAutoPlaying(false)
          triggerKeyDown(matched, true)
        }
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const matched = KEY_GRID.find((k) => k.code === e.code)
      if (matched) triggerKeyUp(matched.id)
    }

    const onBlur = () => {
      activeKeysRef.current = {}
      setActiveKeys({})
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [triggerKeyDown, triggerKeyUp, triggerChordWave])

  const speedMenuRef = useRef<HTMLDivElement | null>(null)
  const playbackSpeedRef = useRef<number>(1)
  playbackSpeedRef.current = playbackSpeed

  useEffect(() => {
    if (!speedMenuOpen) return
    const onDocDown = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setSpeedMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', onDocDown)
    return () => window.removeEventListener('mousedown', onDocDown)
  }, [speedMenuOpen])

  // Direct Auto-Play Song Mode (faithful original BPM * playbackSpeed & syncopated note durations!)
  useEffect(() => {
    const song = SONGS.find((s) => s.id === selectedSong)
    if (!isAutoPlaying || !song) return

    const quarterMs = (60000 / song.bpm) / playbackSpeed
    const eighthMs = quarterMs / 2
    let localStep = songStepIdxRef.current
    let noteTimer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false

    // Backing drum pulse locked strictly to original BPM * playbackSpeed
    let eighthCount = 0
    if (drumsEnabledRef.current) getAudio().playDrum('kick', isMutedRef.current)
    const drumTimer = setInterval(() => {
      eighthCount++
      if (!drumsEnabledRef.current) return
      const audio = getAudio()
      if (eighthCount % 4 === 0) audio.playDrum('kick', isMutedRef.current)
      else if (eighthCount % 4 === 2) audio.playDrum('rim', isMutedRef.current)
      audio.playDrum('hat', isMutedRef.current)
    }, eighthMs)

    const scheduleNext = () => {
      if (cancelled) return
      const step = song.steps[localStep]
      const kd = KEY_GRID.find((k) => k.label === step.key)
      const durMs = Math.max(60, step.beats * quarterMs)

      if (kd) {
        triggerKeyDown(kd, true, true)
        tapeShiftRef.current = 1.0
        setTimeout(() => triggerKeyUp(kd.id), Math.min(durMs * 0.72, 240))
      }

      const nextIdx = (localStep + 1) % song.steps.length
      localStep = nextIdx
      setSongStepIdx(nextIdx)
      songStepIdxRef.current = nextIdx

      noteTimer = setTimeout(scheduleNext, durMs)
    }

    scheduleNext()

    return () => {
      cancelled = true
      if (noteTimer) clearTimeout(noteTimer)
      clearInterval(drumTimer)
    }
  }, [isAutoPlaying, selectedSong, playbackSpeed, getAudio, triggerKeyDown, triggerKeyUp])

  // Arcade Beat Mode Loop (note-duration + speed accurate!)
  useEffect(() => {
    const song = SONGS.find((s) => s.id === selectedSong)
    const shouldRun =
      !isAutoPlaying && gameMode === 'arcade' && selectedSong !== 'free' && isPlayingArcade

    if (!shouldRun || !song) {
      setArcadeProgress(0)
      return
    }

    const quarterMs = (60000 / song.bpm) / playbackSpeed
    const eighthMs = quarterMs / 2
    let eighthCount = 0
    let stepTimer: ReturnType<typeof setTimeout> | null = null
    let currentStepDur = Math.max(80, song.steps[songStepIdxRef.current].beats * quarterMs)
    lastBeatTimeRef.current = performance.now()
    arcadeStepHitRef.current = false

    const drumTimer = setInterval(() => {
      eighthCount++
      if (!drumsEnabledRef.current) return
      const audio = getAudio()
      if (eighthCount % 4 === 0) audio.playDrum('kick', isMutedRef.current)
      else if (eighthCount % 4 === 2) audio.playDrum('rim', isMutedRef.current)
      audio.playDrum('hat', isMutedRef.current)
    }, eighthMs)

    const advanceStep = () => {
      const next = songStepIdxRef.current + 1
      if (next >= song.steps.length) {
        setSongComplete(true)
        setIsPlayingArcade(false)
        setSongStepIdx(0)
        songStepIdxRef.current = 0
        return
      }
      songStepIdxRef.current = next
      setSongStepIdx(next)
      lastBeatTimeRef.current = performance.now()
      arcadeStepHitRef.current = false
      currentStepDur = Math.max(80, song.steps[next].beats * quarterMs)
      stepTimer = setTimeout(advanceStep, currentStepDur)
    }

    stepTimer = setTimeout(advanceStep, currentStepDur)

    let raf = 0
    const tickProg = () => {
      const p = (performance.now() - lastBeatTimeRef.current) / currentStepDur
      setArcadeProgress(Math.min(1, Math.max(0, p)))
      raf = requestAnimationFrame(tickProg)
    }
    raf = requestAnimationFrame(tickProg)

    return () => {
      if (stepTimer) clearTimeout(stepTimer)
      clearInterval(drumTimer)
      cancelAnimationFrame(raf)
    }
  }, [gameMode, selectedSong, playbackSpeed, isPlayingArcade, isAutoPlaying, getAudio])

  useEffect(() => {
    if (!judgeBanner) return
    const t = setTimeout(() => setJudgeBanner(null), 650)
    return () => clearTimeout(t)
  }, [judgeBanner])

  // Master 60fps Loop
  useEffect(() => {
    let rafId = 0
    const timeBuf = new Uint8Array(128)

    const loop = () => {
      let dirty = false

      for (const k of KEY_GRID) {
        const p = physicsRef.current[k.id]
        const isDown = Boolean(activeKeysRef.current[k.id])
        const isHover = hoveredIdRef.current === k.id
        const target = isDown ? -11.5 : isHover ? 4.0 : 0

        const force = (target - p.z) * 0.26
        p.vz = (p.vz + force) * 0.74
        p.z += p.vz

        if (Math.abs(p.z - target) > 0.015 || Math.abs(p.vz) > 0.015) dirty = true
        else {
          p.z = target
          p.vz = 0
        }
      }

      const dt = deckTiltRef.current
      dt.vrx = (dt.vrx + (0 - dt.rx) * 0.14) * 0.78
      dt.vry = (dt.vry + (0 - dt.ry) * 0.14) * 0.78
      dt.rx += dt.vrx
      dt.ry += dt.vry
      if (Math.abs(dt.rx) > 0.01 || Math.abs(dt.ry) > 0.01) dirty = true

      if (tapeShiftRef.current > 0.005) {
        tapeShiftRef.current *= 0.78
        dirty = true
      } else {
        tapeShiftRef.current = 0
      }

      if (dirty) setTick((t) => (t + 1) % 100000)

      // FX Canvas (rotated isometric shockwaves + sparks!)
      const fxCanvas = fxCanvasRef.current
      if (fxCanvas) {
        const ctx = fxCanvas.getContext('2d')
        if (ctx) {
          const dpr = window.devicePixelRatio || 1
          const rect = fxCanvas.getBoundingClientRect()
          if (
            rect.width > 0 &&
            (fxCanvas.width !== Math.round(rect.width * dpr) ||
              fxCanvas.height !== Math.round(rect.height * dpr))
          ) {
            fxCanvas.width = Math.round(rect.width * dpr)
            fxCanvas.height = Math.round(rect.height * dpr)
          }
          if (fxCanvas.width > 0 && fxCanvas.height > 0) {
            ctx.save()
            ctx.scale(fxCanvas.width / 540, fxCanvas.height / 340)
            ctx.clearRect(0, 0, 540, 340)

            wavesRef.current = wavesRef.current.filter((w) => w.alpha > 0.02)
            for (const w of wavesRef.current) {
              w.radius += 0.13
              w.alpha *= 0.91
              const curYaw = yawRef.current
              const pts = [
                projectIso(w.gx - w.radius, w.gy - w.radius, 6, curYaw),
                projectIso(w.gx + w.radius, w.gy - w.radius, 6, curYaw),
                projectIso(w.gx + w.radius, w.gy + w.radius, 6, curYaw),
                projectIso(w.gx - w.radius, w.gy + w.radius, 6, curYaw),
              ]
              ctx.beginPath()
              ctx.moveTo(pts[0][0], pts[0][1])
              ctx.lineTo(pts[1][0], pts[1][1])
              ctx.lineTo(pts[2][0], pts[2][1])
              ctx.lineTo(pts[3][0], pts[3][1])
              ctx.closePath()
              ctx.strokeStyle = w.color
              ctx.globalAlpha = w.alpha
              ctx.lineWidth = 1.6
              ctx.stroke()
            }

            sparksRef.current = sparksRef.current.filter((s) => s.life + 1 < s.maxLife)
            for (const s of sparksRef.current) {
              s.life++
              s.x += s.vx
              s.y += s.vy
              s.vy += 0.14
              const p = Math.max(0, 1 - s.life / s.maxLife)
              const r = s.size * p
              if (r <= 0.05) continue
              ctx.globalAlpha = p
              ctx.fillStyle = s.color
              ctx.beginPath()
              ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
              ctx.fill()
            }
            ctx.restore()
          }
        }
      }

      // Live Oscilloscope (adapts cleanly to Light Paper LCD or Dark OLED!)
      const scopeCanvas = scopeCanvasRef.current
      if (scopeCanvas) {
        const sctx = scopeCanvas.getContext('2d')
        if (sctx) {
          const w = scopeCanvas.width
          const h = scopeCanvas.height
          sctx.clearRect(0, 0, w, h)

          sctx.strokeStyle =
            themeRef.current === 'light'
              ? 'rgba(0,0,0,0.08)'
              : themeRef.current === 'retro'
                ? 'rgba(34,211,238,0.18)'
                : 'rgba(255,255,255,0.07)'
          sctx.lineWidth = 1
          sctx.beginPath()
          sctx.moveTo(0, h / 2)
          sctx.lineTo(w, h / 2)
          sctx.stroke()

          const hasData = audioRef.current?.getTimeDomainData(timeBuf)
          sctx.strokeStyle = themeRef.current === 'retro' ? '#22d3ee' : ambientColor
          sctx.lineWidth = 1.75
          if (themeRef.current !== 'light') {
            sctx.shadowColor = themeRef.current === 'retro' ? '#22d3ee' : ambientColor
            sctx.shadowBlur = themeRef.current === 'retro' ? 10 : 7
          }
          sctx.beginPath()
          const len = timeBuf.length
          for (let i = 0; i < len; i++) {
            const x = (i / (len - 1)) * w
            const v = hasData ? (timeBuf[i] - 128) / 128 : 0
            const y = h / 2 + v * (h * 0.42)
            if (i === 0) sctx.moveTo(x, y)
            else sctx.lineTo(x, y)
          }
          sctx.stroke()
          sctx.shadowBlur = 0
        }
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [ambientColor])

  useEffect(() => {
    const onPointerUp = () => {
      pointerDownRef.current = false
      ribbonDraggingRef.current = false
      orbitDragRef.current = null
      setRibbonIdx(null)
      lastRibbonIdxRef.current = null
      for (const id of Object.keys(activeKeysRef.current)) {
        triggerKeyUp(id)
      }
    }
    window.addEventListener('pointerup', onPointerUp)
    return () => window.removeEventListener('pointerup', onPointerUp)
  }, [triggerKeyUp])

  const selectSong = (id: SongId) => {
    setSelectedSong(id)
    setSongStepIdx(0)
    songStepIdxRef.current = 0
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setHitsRight(0)
    setHitsTotal(0)
    setSongComplete(false)
    setJudgeBanner(null)
    setIsAutoPlaying(false)
    const found = SONGS.find((s) => s.id === id)
    if (found) {
      setVoice(found.defaultVoice)
      setIsPlayingArcade(gameMode === 'arcade')
    } else {
      setIsPlayingArcade(false)
    }
  }

  const STRUM_KEYS = [
    KEY_GRID[12], KEY_GRID[8], KEY_GRID[9], KEY_GRID[10],
    KEY_GRID[4], KEY_GRID[6], KEY_GRID[0], KEY_GRID[3],
  ]

  const triggerStrumSegment = (idx: number) => {
    if (idx === lastRibbonIdxRef.current) return
    lastRibbonIdxRef.current = idx
    setRibbonIdx(idx)
    const k = STRUM_KEYS[idx]
    if (k) {
      triggerKeyDown(k, true, true)
      setTimeout(() => triggerKeyUp(k.id), 130)
    }
  }

  const T = STUDIO_THEME[theme]
  const isRetro = theme === 'retro'
  const activeSong = SONGS.find((s) => s.id === selectedSong) || null
  const currentTargetLabel = activeSong ? activeSong.steps[songStepIdx]?.key || null : null
  const currentTargetKey = currentTargetLabel
    ? KEY_GRID.find((k) => k.label === currentTargetLabel) || null
    : null
  const nextTargetLabel =
    activeSong && songStepIdx + 1 < activeSong.steps.length
      ? activeSong.steps[songStepIdx + 1].key
      : null

  const tapeCards = activeSong
    ? [0, 1, 2, 3, 4, 5]
        .map((offset) => {
          const stepIndex = songStepIdx + offset
          if (stepIndex >= activeSong.steps.length) return null
          const lbl = activeSong.steps[stepIndex].key
          const kd = KEY_GRID.find((k) => k.label === lbl)
          if (!kd) return null
          return { offset, stepIndex, keyDef: kd }
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)
    : []

  const accuracy = hitsTotal > 0 ? Math.round((hitsRight / hitsTotal) * 100) : 100
  const grade = accuracy >= 96 ? 'S' : accuracy >= 88 ? 'A' : accuracy >= 75 ? 'B' : 'C'

  // Dynamic 360° back-to-front sorting by rotated depth
  const sortedKeys = [...KEY_GRID].sort((a, b) => {
    const [ax, ay] = keyCenter(a)
    const [bx, by] = keyCenter(b)
    return getRotatedDepth(ax, ay, yawDeg) - getRotatedDepth(bx, by, yawDeg)
  })

  const deckPrism = buildRotatedPrism(1.53, 1.62, 2.52, 2.56, 2.56, 2.6, -8, -30, yawDeg, 0.08)
  const innerWell = buildRoundedRing(1.53, 1.53, 2.18, 2.18, -8.3, yawDeg, 0.06)

  const tiltStyle = {
    transform: `perspective(1100px) rotateX(${deckTiltRef.current.rx.toFixed(2)}deg) rotateY(${deckTiltRef.current.ry.toFixed(2)}deg)`,
    transformStyle: 'preserve-3d' as const,
  }

  const cardStride = 66
  const tapeSlidePx =
    !isAutoPlaying && gameMode === 'arcade' && isPlayingArcade
      ? -arcadeProgress * cardStride
      : tapeShiftRef.current * cardStride

  const normalizedYaw = ((Math.round(yawDeg) % 360) + 360) % 360

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden px-4 sm:px-6 lg:px-10 pt-20 md:pt-24 pb-12 select-none transition-colors duration-300 flex flex-col justify-center ${T.page}`}
      style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
    >
      {/* Subtle 90s Synthwave Room Ambience (Retro Mode only) */}
      {isRetro && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full blur-[120px] opacity-30"
            style={{
              background:
                'radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(139,92,246,0.28) 45%, transparent 75%)',
            }}
          />
          <div
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[1100px] h-[360px] rounded-full blur-[110px] opacity-25"
            style={{
              background:
                'radial-gradient(circle, rgba(34,211,238,0.42) 0%, rgba(245,158,11,0.18) 50%, transparent 75%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[42vh] opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(34,211,238,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,121,249,0.24) 1px, transparent 1px)',
              backgroundSize: '46px 32px',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            }}
          />
        </div>
      )}

      <div className="relative z-10 w-full max-w-[1160px] mx-auto">
        {/* ── HARDWARE TOP INSTRUMENT PLATE ── */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
          <div className="flex items-center justify-start order-1">
            <Link
              href="/lab"
              className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 border transition-colors ${T.labLink}`}
              style={{ borderRadius: '6px' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Lab
            </Link>
          </div>

          {/* Centered Portfolio Display Heading */}
          <div className="col-span-2 md:col-span-1 order-3 md:order-2 flex items-center justify-center text-center">
            <h1
              className={`text-2xl sm:text-[32px] font-light leading-none tracking-tight select-none ${T.titleText}`}
              style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.015em' }}
            >
              <span
                style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.38em', lineHeight: 0.9 }}
              >
                I
              </span>
              <span style={{ marginLeft: '1px' }}>so</span>{' '}
              <span style={{ fontFamily: 'SatishSans, sans-serif' }}>Studio</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 order-2 md:order-3">
            {/* Day / Night / 90s Retro Studio Mode Switch */}
            <div
              className={`inline-flex p-0.5 border font-mono text-[10px] uppercase tracking-wider ${T.modeShell}`}
              style={{ borderRadius: '7px' }}
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-2 py-1 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-black font-semibold shadow-xs rounded-[5px]'
                    : isRetro
                      ? 'text-amber-100/55 hover:text-white'
                      : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                ☀ Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-800 text-white font-semibold rounded-[5px]'
                    : isRetro
                      ? 'text-amber-100/55 hover:text-white'
                      : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                ☾ Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('retro')}
                className={`inline-flex items-center gap-1 px-2 py-1 transition-all cursor-pointer ${
                  theme === 'retro'
                    ? 'text-[#fef3c7] font-semibold border border-[#a86336]/80 shadow-[inset_0_1px_0_rgba(253,230,138,0.22)] rounded-[5px]'
                    : theme === 'light'
                      ? 'text-zinc-500 hover:text-zinc-900'
                      : 'text-zinc-400 hover:text-amber-200'
                }`}
                style={
                  theme === 'retro'
                    ? {
                        background:
                          'repeating-linear-gradient(90deg, #4b250e 0px, #6e3a1a 2px, #3c1c09 4px, #5d3014 6px)',
                      }
                    : undefined
                }
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <line x1="8" y1="0.8" x2="8" y2="2.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="8" cy="8.5" r="5.7" stroke="currentColor" strokeWidth="1.2" />
                  <ellipse cx="8" cy="8.5" rx="2.7" ry="5.7" stroke="currentColor" strokeWidth="1" />
                  <line x1="2.4" y1="8.5" x2="13.6" y2="8.5" stroke="currentColor" strokeWidth="1" />
                  <path d="M3.4 5.5H12.6M3.4 11.5H12.6" stroke="currentColor" strokeWidth="0.9" />
                  <circle cx="6.2" cy="6.6" r="0.85" fill="currentColor" />
                </svg>
                <span>Retro</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowNotes((n) => !n)}
              className={`px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                showNotes ? T.notesOn : T.notesOff
              }`}
              style={{ borderRadius: '7px' }}
            >
              Notes {showNotes ? '●' : '○'}
            </button>

            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className={`px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                isMuted ? 'border-rose-500/50 text-rose-500 bg-rose-500/10' : T.audioOn
              }`}
              style={{ borderRadius: '7px' }}
            >
              {isMuted ? 'Muted' : 'Audio On'}
            </button>
          </div>
        </div>

        {/* ── MAIN MACHINED STUDIO CHASSIS ── */}
        <div
          className={`relative rounded-[24px] border p-3.5 sm:p-5 transition-colors duration-300 ${T.chassis}`}
          style={
            isRetro
              ? {
                  background:
                    'repeating-linear-gradient(90deg, #4b250e 0px, #6e3a1a 2px, #3c1c09 4px, #5d3014 6px)',
                }
              : undefined
          }
        >
          {/* Corner Hex Rivets */}
          {['top-2.5 left-2.5', 'top-2.5 right-2.5', 'bottom-2.5 left-2.5', 'bottom-2.5 right-2.5'].map((pos) => (
            <div
              key={pos}
              className={`hidden sm:block absolute ${pos} w-2 h-2 rounded-full border ${T.rivet}`}
            />
          ))}

          {/* ── DEDICATED SONG SELECTION RACK (Songs only, equal widths across full span) ── */}
          <div className={`rounded-2xl border p-2 sm:p-2.5 mb-4 ${T.rack}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(['free', ...SONGS.map((s) => s.id)] as SongId[]).map((id) => {
                const song = SONGS.find((s) => s.id === id)
                const active = selectedSong === id
                const meta = SONG_THEME[id]
                const title = song ? song.title : 'Free Jam'

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectSong(id)}
                    className={`group relative px-3 py-2 text-left rounded-xl border transition-all overflow-hidden flex flex-col justify-between gap-1.5 cursor-pointer ${
                      active ? T.tileActive : T.tileIdle
                    }`}
                    style={
                      active
                        ? {
                            borderColor: meta.accent,
                            boxShadow: `0 0 0 1px ${meta.accent}33`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between gap-1">
                      <SongMotifIcon id={id} accent={meta.accent} active={active} />
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider ${
                          active ? T.tileTagActive : 'opacity-60'
                        }`}
                      >
                        {meta.tag}
                      </span>
                    </div>
                    <div className="text-[11.5px] font-semibold truncate tracking-tight">
                      {title}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── ALIGNED DUAL-PANEL INSTRUMENT WORKSPACE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[370px_1fr] xl:grid-cols-[390px_1fr] gap-5 items-stretch">
            {/* ── LEFT COLUMN: THEME-ADAPTIVE DISPLAY + ROTARY KNOBS ── */}
            <div className="flex flex-col justify-between gap-3.5">
              {/* Theme-Adaptive Display: Crisp Paper LCD / Obsidian OLED / 90s Phosphor CRT */}
              <div
                className={`relative rounded-2xl border p-3.5 overflow-hidden flex-1 flex flex-col justify-between transition-colors ${T.display}`}
              >
                {isRetro && (
                  <div
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to bottom, #67e8f9 0px, #67e8f9 1px, transparent 1px, transparent 3px)',
                    }}
                  />
                )}
                {/* Display Top Telemetry */}
                <div
                  className={`relative z-10 flex items-center justify-between text-[10px] font-mono mb-2.5 ${T.displayMeta}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded border uppercase font-semibold ${T.displayPill}`}
                    >
                      {activeSong ? activeSong.title : 'FREE JAM'}
                    </span>
                    {activeSong && (
                      <span className={isAutoPlaying ? 'text-orange-500 font-bold' : ''}>
                        {isAutoPlaying ? 'AUTO ' : ''}
                        {songStepIdx}/{activeSong.steps.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    {activeSong && !isAutoPlaying && (
                      <span className={isRetro ? 'text-fuchsia-400 font-bold' : 'text-orange-500 font-bold'}>
                        {streak}×{streak >= 16 ? 4 : streak >= 8 ? 3 : streak >= 4 ? 2 : 1}
                      </span>
                    )}
                    <span className={`font-bold ${T.displayScore}`}>
                      {activeSong && !isAutoPlaying
                        ? score.toLocaleString()
                        : `${lastKey.note} · ${Math.round(lastKey.freq)}Hz`}
                    </span>
                  </div>
                </div>

                {/* Tape Runway */}
                {activeSong ? (
                  <div
                    className={`relative z-10 h-[106px] rounded-xl border overflow-hidden mb-2.5 flex items-center px-3 transition-colors ${T.runway}`}
                  >
                    <div
                      className="absolute left-3 top-2 bottom-2 w-[56px] rounded-lg border-2 pointer-events-none z-20 transition-colors"
                      style={{
                        borderColor: currentTargetKey ? currentTargetKey.accent : '#fb923c',
                        boxShadow: currentTargetKey
                          ? `0 0 14px ${currentTargetKey.glow}`
                          : undefined,
                      }}
                    >
                      <div
                        className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 rounded text-[8px] font-mono font-bold text-white uppercase"
                        style={{ backgroundColor: currentTargetKey?.accent || '#fb923c' }}
                      >
                        {isAutoPlaying ? 'PLAY' : 'HIT'}
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-[10px] will-change-transform"
                      style={{ transform: `translateX(${tapeSlidePx.toFixed(1)}px)` }}
                    >
                      {tapeCards.map((card) => {
                        const isFirst = card.offset === 0
                        return (
                          <div
                            key={`tape-${card.stepIndex}`}
                            className={`w-[56px] h-[80px] shrink-0 rounded-lg border flex flex-col items-center justify-between py-1.5 transition-opacity ${
                              isFirst ? T.cardActive : T.cardIdle
                            }`}
                          >
                            <div className="text-center leading-none">
                              <div
                                className="font-mono text-base font-bold"
                                style={{
                                  color: isFirst ? T.cardFirstLabel : card.keyDef.accent,
                                }}
                              >
                                {card.keyDef.label}
                              </div>
                              <div className="font-mono text-[8px] text-zinc-500 mt-0.5">
                                {card.keyDef.note}
                              </div>
                            </div>

                            <div className={`grid grid-cols-4 gap-[2.5px] p-1 rounded ${T.miniBox}`}>
                              {KEY_GRID.map((cell) => {
                                const isCell = cell.id === card.keyDef.id
                                return (
                                  <span
                                    key={cell.id}
                                    className="w-[4px] h-[4px] rounded-[1px]"
                                    style={{
                                      backgroundColor: isCell
                                        ? card.keyDef.accent
                                        : T.miniCellOff,
                                      boxShadow: isCell ? `0 0 4px ${card.keyDef.accent}` : undefined,
                                    }}
                                  />
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div
                      className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent z-10 ${T.runwayFade}`}
                    />
                  </div>
                ) : (
                  <div
                    className={`relative z-10 h-[106px] rounded-xl border mb-2.5 flex flex-col items-center justify-center text-center px-4 ${T.runway}`}
                  >
                    <div className={`text-xs font-mono ${T.emptyCardText}`}>
                      LAST NOTE: <span style={{ color: lastKey.accent }}>{lastKey.label}</span> ({lastKey.note})
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-1">
                      Select any song tile above to play or listen
                    </div>
                  </div>
                )}

                {/* Hit Telemetry */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono mb-2 h-4">
                  {judgeBanner ? (
                    <span style={{ color: judgeBanner.color }} className="font-bold tracking-wider">
                      {judgeBanner.text} {judgeBanner.delta && <span className="text-zinc-400">{judgeBanner.delta}</span>}
                    </span>
                  ) : (
                    <span className={isRetro ? 'text-cyan-300/60' : 'text-zinc-500'}>
                      {isAutoPlaying
                        ? 'AUTO DEMO · PRESS ANY KEY TO TAKE OVER'
                        : activeSong
                          ? `ACCURACY ${accuracy}%`
                          : 'SPACE · CHORD STRUM'}
                    </span>
                  )}
                  <span className={isRetro ? 'text-amber-300/75 uppercase' : 'text-zinc-500 uppercase'}>{voice}</span>
                </div>

                {/* Live Oscilloscope */}
                <div className={`relative z-10 rounded-lg border p-1 ${T.scopeBox}`}>
                  <canvas ref={scopeCanvasRef} width={340} height={44} className="w-full h-[44px] block" />
                </div>
              </div>

              {/* Rotary DSP Encoders & Voice Deck */}
              <div
                className={`rounded-2xl border p-3.5 flex flex-col gap-2.5 transition-colors ${T.dspBox}`}
              >
                <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider">
                  <span className={isRetro ? 'text-amber-200/70' : 'text-zinc-500'}>DSP FX</span>
                  <button
                    type="button"
                    disabled={!isDspModified}
                    onClick={() => setSynthParams(DEFAULT_SYNTH_PARAMS)}
                    title="Reset Cutoff, Space & Echo to defaults (78 / 42 / 35)"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9.5px] transition-colors ${
                      isDspModified ? T.dspResetActive : T.dspResetIdle
                    }`}
                  >
                    <span>↺</span>
                    <span>Reset</span>
                  </button>
                </div>

                <div className="flex items-center justify-around">
                  <RotaryKnob
                    label="Cutoff"
                    value={synthParams.cutoff}
                    accent={isRetro ? '#22d3ee' : '#0284c7'}
                    theme={theme}
                    onChange={(cutoff) => setSynthParams((p) => ({ ...p, cutoff }))}
                  />
                  <RotaryKnob
                    label="Space"
                    value={synthParams.reverb}
                    accent={isRetro ? '#e879f9' : '#7c3aed'}
                    theme={theme}
                    onChange={(reverb) => setSynthParams((p) => ({ ...p, reverb }))}
                  />
                  <RotaryKnob
                    label="Echo"
                    value={synthParams.delay}
                    accent={isRetro ? '#fbbf24' : '#ea580c'}
                    theme={theme}
                    onChange={(delay) => setSynthParams((p) => ({ ...p, delay }))}
                  />
                </div>

                <div className={`pt-2.5 border-t ${T.dspDivider}`}>
                  <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider mb-2">
                    <span className={isRetro ? 'text-amber-200/70' : 'text-zinc-500'}>Sound Modes</span>
                    <span className={isRetro ? 'text-cyan-300/70' : 'text-zinc-400'}>
                      {SOUND_VOICES.find((v) => v.id === voice)?.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SOUND_VOICES.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVoice(v.id)}
                        className={`py-1.5 text-[9.5px] font-mono uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                          voice === v.id ? T.voiceActive : T.voiceIdle
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: ROTATABLE ISOMETRIC 4×4 PAD BAY ── */}
            <div
              className={`relative rounded-2xl border p-3.5 sm:p-4 flex flex-col justify-between transition-colors ${T.padBay}`}
            >
              {/* Song Complete Overlay */}
              {songComplete && activeSong && (
                <div
                  className={`absolute inset-0 z-40 rounded-2xl backdrop-blur-md flex items-center justify-center p-4 transition-colors ${T.overlayBg}`}
                >
                  <div
                    className={`border rounded-2xl p-6 max-w-xs w-full text-center transition-colors ${T.modalCard}`}
                  >
                    <div
                      className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${T.modalLabel}`}
                    >
                      Track Cleared
                    </div>
                    <h2 className={`text-xl font-semibold mb-3 ${T.modalTitle}`}>
                      {activeSong.title}
                    </h2>
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border text-2xl font-mono font-bold mb-4 ${T.modalBadge}`}
                    >
                      {grade}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-5 text-xs font-mono">
                      <div className={`border rounded-lg p-2 ${T.modalStatBox}`}>
                        <div className="text-zinc-500 text-[9px]">SCORE</div>
                        <div className={`font-bold mt-0.5 ${T.modalStatVal}`}>
                          {score}
                        </div>
                      </div>
                      <div className={`border rounded-lg p-2 ${T.modalStatBox}`}>
                        <div className="text-zinc-500 text-[9px]">ACC</div>
                        <div className={`font-bold mt-0.5 ${T.modalStatVal}`}>
                          {accuracy}%
                        </div>
                      </div>
                      <div className={`border rounded-lg p-2 ${T.modalStatBox}`}>
                        <div className="text-zinc-500 text-[9px]">STREAK</div>
                        <div className={`font-bold mt-0.5 ${T.modalStreakVal}`}>
                          {maxStreak}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => selectSong(activeSong.id)}
                        className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer ${T.modalReplay}`}
                      >
                        Replay
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = (SONGS.findIndex((s) => s.id === activeSong.id) + 1) % SONGS.length
                          selectSong(SONGS[nextIdx].id)
                        }}
                        className={`flex-1 py-2 rounded-xl border font-mono text-xs transition-colors cursor-pointer ${T.modalNext}`}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Pad Strip: Transport Controls (Listen, Step/Beat, Speed, Drums) + Orbit & BPM */}
              <div
                className={`flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-1 border-b text-[10px] font-mono ${T.padBarBorder}`}
              >
                {/* Playback Transport Cluster */}
                <div
                  className={`flex flex-wrap items-center gap-1.5 transition-opacity ${
                    activeSong ? 'opacity-100' : 'opacity-35 pointer-events-none'
                  }`}
                  aria-hidden={!activeSong}
                >
                  <button
                    type="button"
                    disabled={!activeSong}
                    onClick={() => {
                      setIsAutoPlaying((a) => !a)
                      setIsPlayingArcade(false)
                      setSongComplete(false)
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                      isAutoPlaying && activeSong
                        ? 'bg-orange-500 border-orange-600 text-white'
                        : T.listenIdle
                    }`}
                  >
                    <span>{isAutoPlaying && activeSong ? '■ Stop' : '▶ Listen'}</span>
                  </button>

                  <div
                    className={`inline-flex p-0.5 rounded-lg border font-mono text-[10px] uppercase ${T.modeToggleBg}`}
                  >
                    <button
                      type="button"
                      disabled={!activeSong}
                      onClick={() => {
                        setIsAutoPlaying(false)
                        setGameMode('zen')
                        setIsPlayingArcade(false)
                      }}
                      className={`px-2 py-1 rounded-[6px] transition-all cursor-pointer ${
                        !isAutoPlaying && gameMode === 'zen' ? T.stepActive : T.stepIdle
                      }`}
                    >
                      Step
                    </button>
                    <button
                      type="button"
                      disabled={!activeSong}
                      onClick={() => {
                        setIsAutoPlaying(false)
                        setGameMode('arcade')
                        setIsPlayingArcade(true)
                        setSongComplete(false)
                      }}
                      className={`px-2 py-1 rounded-[6px] transition-all cursor-pointer ${
                        !isAutoPlaying && gameMode === 'arcade'
                          ? 'bg-sky-400 text-black font-bold'
                          : T.stepIdle
                      }`}
                    >
                      Beat
                    </button>
                  </div>

                  {/* YouTube-style 0.25x..2x Playback Speed Selector */}
                  <div ref={speedMenuRef} className="relative">
                    <button
                      type="button"
                      disabled={!activeSong}
                      onClick={() => setSpeedMenuOpen((o) => !o)}
                      title="Playback speed (0.25x increments)"
                      className={`px-2 py-1.5 rounded-lg border font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                        playbackSpeed !== 1
                          ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                          : T.speedIdle
                      }`}
                    >
                      {playbackSpeed}×
                    </button>

                    {speedMenuOpen && activeSong && (
                      <div
                        className={`absolute left-0 top-full mt-1.5 z-50 w-28 rounded-xl border p-1 shadow-xl font-mono text-[11px] ${T.speedMenu}`}
                      >
                        <div className="px-2 py-1 text-[9px] uppercase tracking-wider text-zinc-400 border-b border-zinc-500/20 mb-0.5">
                          Speed
                        </div>
                        {SPEED_OPTIONS.map((spd) => {
                          const activeSpd = playbackSpeed === spd
                          return (
                            <button
                              key={spd}
                              type="button"
                              onClick={() => {
                                setPlaybackSpeed(spd)
                                setSpeedMenuOpen(false)
                              }}
                              className={`w-full px-2 py-1 rounded-lg text-left flex items-center justify-between cursor-pointer transition-colors ${
                                activeSpd ? 'bg-orange-500 text-white font-bold' : T.speedMenuHover
                              }`}
                            >
                              <span>{spd === 1 ? 'Normal' : `${spd}×`}</span>
                              {spd === 1 && <span className="text-[9px] opacity-70">1×</span>}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!activeSong}
                    onClick={() => setDrumsEnabled((d) => !d)}
                    className={`px-2 py-1.5 rounded-lg border font-mono text-[10px] uppercase transition-colors cursor-pointer ${
                      drumsEnabled ? T.drumsOn : T.drumsOff
                    }`}
                  >
                    Drums {drumsEnabled ? '●' : '○'}
                  </button>
                </div>

                {/* Orbit Controls + Effective BPM */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setYawDeg((y) => y - 45)}
                      className={`w-5.5 h-5.5 rounded border flex items-center justify-center cursor-pointer transition-colors ${T.orbitBtn}`}
                      title="Rotate left 45°"
                    >
                      ↺
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={normalizedYaw}
                      onChange={(e) => setYawDeg(parseFloat(e.target.value))}
                      aria-label="Keyboard rotation angle"
                      className={`w-14 sm:w-16 cursor-ew-resize ${
                        isRetro ? 'accent-cyan-400' : 'accent-orange-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setYawDeg((y) => y + 45)}
                      className={`w-5.5 h-5.5 rounded border flex items-center justify-center cursor-pointer transition-colors ${T.orbitBtn}`}
                      title="Rotate right 45°"
                    >
                      ↻
                    </button>
                    <button
                      type="button"
                      onClick={() => setYawDeg(45)}
                      className={`px-1 py-0.5 rounded border text-[9px] cursor-pointer transition-colors ${
                        normalizedYaw === 45 ? 'opacity-45 border-transparent' : T.orbitResetIdle
                      }`}
                    >
                      {normalizedYaw}°
                    </button>
                  </div>

                  <span className={T.bpmWrap}>
                    BPM{' '}
                    <strong className={T.bpmVal}>
                      {Math.round((activeSong ? activeSong.bpm : 104) * playbackSpeed)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Rotatable Interactive 3D Pad Canvas Stage (Drag background horizontally to orbit!) */}
              <div
                className="relative w-full max-w-[540px] aspect-[540/340] mx-auto my-2 cursor-grab active:cursor-grabbing"
                style={tiltStyle}
                onPointerDown={(e) => {
                  // Only start deck orbit if user drags background stage/bezel, not directly clicking a keycap
                  if ((e.target as HTMLElement).closest('[data-iso-key]')) return
                  orbitDragRef.current = { startX: e.clientX, startYaw: yawDeg }
                }}
                onPointerMove={(e) => {
                  if (!orbitDragRef.current) return
                  const dx = e.clientX - orbitDragRef.current.startX
                  setYawDeg(orbitDragRef.current.startYaw + dx * 0.45)
                }}
              >
                <canvas
                  ref={fxCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                />

                <svg
                  viewBox="0 0 540 340"
                  className="w-full h-full overflow-visible touch-none relative z-10"
                  role="img"
                  aria-label="Iso Studio 16 Key Hardware Pad"
                >
                  <defs>
                    <filter id="pad-led-glow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Ground Shadow */}
                  <path
                    d={buildRoundedRing(1.53, 1.62, 2.66, 2.7, -38, yawDeg, 0.1).path}
                    fill={T.svgShadow}
                  />

                  {/* Machined Deck Housing (360° rotatable curved walls) */}
                  {deckPrism.walls.map((w, idx) => (
                    <path
                      key={`deck-wall-${idx}`}
                      d={w.path}
                      fill={w.shade === 1 ? T.svgWallL : T.svgWallR}
                      stroke={T.svgWallStroke}
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  ))}
                  <path
                    d={deckPrism.topPath}
                    fill={T.svgDeckTop}
                    stroke={T.svgDeckStroke}
                    strokeWidth="1.35"
                  />
                  <path
                    d={innerWell.path}
                    fill={T.svgWellFill}
                    stroke={T.svgWellStroke}
                    strokeWidth="1"
                  />

                  {/* Touch Strum Strip along the front-left chassis edge */}
                  <g
                    className="cursor-ew-resize"
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      ribbonDraggingRef.current = true
                    }}
                    onPointerUp={() => {
                      ribbonDraggingRef.current = false
                      lastRibbonIdxRef.current = null
                      setRibbonIdx(null)
                    }}
                  >
                    {STRUM_KEYS.map((sk, sIdx) => {
                      const gx = -0.35 + sIdx * 0.52
                      const gy = 3.92
                      const seg = buildRoundedRing(gx, gy, 0.16, 0.16, -7.2, yawDeg, 0.25)
                      const lit = ribbonIdx === sIdx
                      return (
                        <path
                          key={`strum-${sIdx}`}
                          d={seg.path}
                          fill={lit ? sk.accent : T.svgStrumIdle}
                          stroke={lit ? '#ffffff' : T.svgStrumStroke}
                          strokeWidth={lit ? '1.4' : '1'}
                          onPointerEnter={() => {
                            if (ribbonDraggingRef.current) triggerStrumSegment(sIdx)
                          }}
                          onPointerDown={(e) => {
                            e.stopPropagation()
                            triggerStrumSegment(sIdx)
                          }}
                        />
                      )
                    })}
                  </g>

                  {/* 16 Unobstructed Rotatable Sculpted Keycaps */}
                  {sortedKeys.map((keyDef) => {
                    const p = physicsRef.current[keyDef.id]
                    const z = p ? p.z : 0
                    const isDown = Boolean(activeKeys[keyDef.id])
                    const isHover = hoveredId === keyDef.id
                    const isCurrentCue = currentTargetLabel === keyDef.label
                    const isNextCue = nextTargetLabel === keyDef.label

                    const [cx, cy] = keyCenter(keyDef)
                    const topZ = 11 + z
                    const skirtZ = -6 + z * 0.42

                    const socketRing = buildRoundedRing(cx, cy, 0.46, 0.46, -8.1, yawDeg, 0.2)
                    const keyPrism = buildRotatedPrism(cx, cy, 0.37, 0.37, 0.44, 0.44, topZ, skirtZ, yawDeg, 0.24)
                    const innerDish = buildRoundedRing(cx, cy, 0.26, 0.26, topZ + 0.5, yawDeg, 0.25)

                    const [labelX, labelY] = projectIso(cx, cy, topZ, yawDeg)
                    const [cornerX, cornerY] = projectIso(cx + 0.25, cy - 0.25, topZ + 0.8, yawDeg)

                    const topFill = isDown
                      ? keyDef.accent
                      : isCurrentCue
                        ? T.svgKeyCue ?? keyDef.softAccent
                        : isHover
                          ? T.svgKeyTopHover
                          : T.svgKeyTop

                    const leftWallFill = isDown ? keyDef.accent : T.svgKeyWallL
                    const rightWallFill = isDown ? keyDef.darkAccent : T.svgKeyWallR

                    const topStroke = isDown
                      ? keyDef.darkAccent
                      : isCurrentCue
                        ? keyDef.accent
                        : isHover
                          ? T.svgKeyTopHoverStroke
                          : T.svgKeyTopStroke

                    return (
                      <g
                        key={keyDef.id}
                        data-iso-key={keyDef.label}
                        className="cursor-pointer"
                        onPointerEnter={() => {
                          hoveredIdRef.current = keyDef.id
                          setHoveredId(keyDef.id)
                          if (pointerDownRef.current) triggerKeyDown(keyDef, true)
                        }}
                        onPointerLeave={() => {
                          if (hoveredIdRef.current === keyDef.id) {
                            hoveredIdRef.current = null
                            setHoveredId(null)
                          }
                          if (activeKeysRef.current[keyDef.id]) triggerKeyUp(keyDef.id)
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          pointerDownRef.current = true
                          if (isAutoPlayingRef.current) setIsAutoPlaying(false)
                          triggerKeyDown(keyDef, true)
                        }}
                        onPointerUp={() => {
                          pointerDownRef.current = false
                          triggerKeyUp(keyDef.id)
                        }}
                      >
                        <path
                          d={socketRing.path}
                          fill={isDown ? `${keyDef.accent}38` : T.svgKeySocket}
                          stroke={isDown ? keyDef.darkAccent : T.svgKeySocketStroke}
                          strokeWidth={isDown ? '1.2' : '0.9'}
                        />

                        {keyPrism.walls.map((w, wIdx) => (
                          <path
                            key={`kw-${keyDef.id}-${wIdx}`}
                            d={w.path}
                            fill={w.shade === 1 ? leftWallFill : rightWallFill}
                            stroke={isDown ? keyDef.darkAccent : T.svgKeyWallStroke}
                            strokeWidth="1.1"
                            strokeLinejoin="round"
                          />
                        ))}

                        <path
                          d={keyPrism.topPath}
                          fill={topFill}
                          stroke={topStroke}
                          strokeWidth={isDown ? '1.6' : isCurrentCue ? '1.45' : '1.25'}
                          filter={isDown ? 'url(#pad-led-glow)' : undefined}
                        />

                        <path
                          d={innerDish.path}
                          fill="none"
                          stroke={isDown ? 'rgba(255,255,255,0.4)' : T.svgInnerDish}
                          strokeWidth="0.8"
                          style={{ pointerEvents: 'none' }}
                        />

                        {isNextCue && !isCurrentCue && (
                          <circle
                            cx={cornerX}
                            cy={cornerY}
                            r={2.5}
                            fill={keyDef.accent}
                            opacity="0.85"
                            style={{ pointerEvents: 'none' }}
                          />
                        )}

                        <text
                          x={labelX}
                          y={showNotes ? labelY + 1 : labelY + 3.5}
                          textAnchor="middle"
                          fontSize="10.5"
                          fontFamily="monospace"
                          fontWeight="700"
                          fill={isDown ? '#ffffff' : isCurrentCue ? T.svgLegendCue : T.svgLegend}
                          style={{ pointerEvents: 'none' }}
                        >
                          {keyDef.label}
                        </text>
                        {showNotes && (
                          <text
                            x={labelX}
                            y={labelY + 10.5}
                            textAnchor="middle"
                            fontSize="7"
                            fontFamily="monospace"
                            fill={isDown ? '#ffffff' : isCurrentCue ? keyDef.accent : T.svgNoteIdle}
                            style={{ pointerEvents: 'none' }}
                          >
                            {keyDef.note}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Clean Separated Hardware Shortcut Rail (generous spacing below deck!) */}
              <div
                className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono ${T.railBorder}`}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded border ${T.railKbd}`}>
                    1–4 · Q–R · A–F · Z–V
                  </span>
                  <span>Keys</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Drag pad to orbit</span>
                  <span>·</span>
                  <span>Strum strip</span>
                  <span>·</span>
                  <span className={`px-1.5 py-0.5 rounded border ${T.railKbd}`}>
                    Space
                  </span>
                  <span>Chord</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
