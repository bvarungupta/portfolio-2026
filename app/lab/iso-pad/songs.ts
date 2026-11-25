export type SoundVoice =
  | 'juno'
  | 'marimba'
  | 'piano'
  | 'acoustic'
  | 'arp84'
  | 'phaser'
  | 'brass'
  | 'glass'
export type GameMode = 'zen' | 'arcade'
export type SongId = 'free' | 'blinding' | 'shape' | 'faded' | 'wakemeup' | 'stranger'

export const SOUND_VOICES: { id: SoundVoice; label: string }[] = [
  { id: 'juno', label: 'Juno' },
  { id: 'marimba', label: 'Marimba' },
  { id: 'piano', label: 'Piano' },
  { id: 'acoustic', label: 'Acoustic' },
  { id: 'arp84', label: 'Arp84' },
  { id: 'phaser', label: 'Phaser' },
  { id: 'brass', label: 'Brass' },
  { id: 'glass', label: 'Glass' },
]

export interface KeyDef {
  id: string
  row: number
  col: number
  label: string
  code: string
  note: string
  freq: number
  accent: string
  darkAccent: string
  softAccent: string
  glow: string
}

export interface SongStep {
  key: string
  beats: number // rhythmic duration in quarter-note beats (0.5 = 8th, 0.75 = dotted 8th, 1 = quarter)
}

export interface SongDef {
  id: Exclude<SongId, 'free'>
  title: string
  subtitle: string
  bpm: number
  defaultVoice: SoundVoice
  steps: SongStep[]
}

export const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

// Each row carries a distinct studio LED accent + deep pressed border + soft opaque queue tint
const ROW_COLORS = [
  { accent: '#a78bfa', darkAccent: '#6d28d9', softAccent: '#f3f0ff', glow: 'rgba(167, 139, 250, 0.55)' }, // Row 0: Violet
  { accent: '#38bdf8', darkAccent: '#0369a1', softAccent: '#e0f2fe', glow: 'rgba(56, 189, 248, 0.55)' },  // Row 1: Cyan
  { accent: '#fb923c', darkAccent: '#c2410c', softAccent: '#ffedd5', glow: 'rgba(251, 146, 60, 0.6)' },   // Row 2: Orange
  { accent: '#f43f5e', darkAccent: '#be123c', softAccent: '#ffe4e6', glow: 'rgba(244, 63, 94, 0.55)' },   // Row 3: Coral
]

export const KEY_GRID: KeyDef[] = [
  // Row 0 (top-back) — Upper C-major / A-minor extensions
  { id: '0-0', row: 0, col: 0, label: '1', code: 'Digit1', note: 'C5', freq: 523.25, ...ROW_COLORS[0] },
  { id: '0-1', row: 0, col: 1, label: '2', code: 'Digit2', note: 'D5', freq: 587.33, ...ROW_COLORS[0] },
  { id: '0-2', row: 0, col: 2, label: '3', code: 'Digit3', note: 'E5', freq: 659.25, ...ROW_COLORS[0] },
  { id: '0-3', row: 0, col: 3, label: '4', code: 'Digit4', note: 'G5', freq: 783.99, ...ROW_COLORS[0] },
  // Row 1
  { id: '1-0', row: 1, col: 0, label: 'Q', code: 'KeyQ', note: 'G4', freq: 392.0, ...ROW_COLORS[1] },
  { id: '1-1', row: 1, col: 1, label: 'W', code: 'KeyW', note: 'A4', freq: 440.0, ...ROW_COLORS[1] },
  { id: '1-2', row: 1, col: 2, label: 'E', code: 'KeyE', note: 'B4', freq: 493.88, ...ROW_COLORS[1] },
  { id: '1-3', row: 1, col: 3, label: 'R', code: 'KeyR', note: 'C5', freq: 523.25, ...ROW_COLORS[1] },
  // Row 2
  { id: '2-0', row: 2, col: 0, label: 'A', code: 'KeyA', note: 'C4', freq: 261.63, ...ROW_COLORS[2] },
  { id: '2-1', row: 2, col: 1, label: 'S', code: 'KeyS', note: 'D4', freq: 293.66, ...ROW_COLORS[2] },
  { id: '2-2', row: 2, col: 2, label: 'D', code: 'KeyD', note: 'E4', freq: 329.63, ...ROW_COLORS[2] },
  { id: '2-3', row: 2, col: 3, label: 'F', code: 'KeyF', note: 'F4', freq: 349.23, ...ROW_COLORS[2] },
  // Row 3 (front-bottom) — Deep bass anchors
  { id: '3-0', row: 3, col: 0, label: 'Z', code: 'KeyZ', note: 'C3', freq: 130.81, ...ROW_COLORS[3] },
  { id: '3-1', row: 3, col: 1, label: 'X', code: 'KeyX', note: 'E3', freq: 164.81, ...ROW_COLORS[3] },
  { id: '3-2', row: 3, col: 2, label: 'C', code: 'KeyC', note: 'G3', freq: 196.0, ...ROW_COLORS[3] },
  { id: '3-3', row: 3, col: 3, label: 'V', code: 'KeyV', note: 'A3', freq: 220.0, ...ROW_COLORS[3] },
]

export const SONGS: SongDef[] = [
  {
    id: 'blinding',
    title: 'Blinding Lights',
    subtitle: 'The Weeknd · 171 BPM',
    bpm: 171,
    defaultVoice: 'juno',
    steps: [
      // Phrase 1 (Fm, 8 beats): F4 - F4 Eb4 F4 G4 C4 Eb4 (A Dorian: A4 - A4 G4 A4 B4 E4 G4)
      { key: 'W', beats: 1.5 },
      { key: 'W', beats: 0.5 },
      { key: 'Q', beats: 0.5 },
      { key: 'W', beats: 0.5 },
      { key: 'E', beats: 1.0 },
      { key: 'D', beats: 1.0 },
      { key: 'Q', beats: 3.0 },

      // Phrase 2 (Cm, 8 beats): F4 - F4 Eb4 F4 G4 C4 Eb4
      { key: 'W', beats: 1.5 },
      { key: 'W', beats: 0.5 },
      { key: 'Q', beats: 0.5 },
      { key: 'W', beats: 0.5 },
      { key: 'E', beats: 1.0 },
      { key: 'D', beats: 1.0 },
      { key: 'Q', beats: 3.0 },

      // Phrase 3 (Eb, 8 beats): Bb4 - G4 - F4 - Eb4 (D5 - B4 - A4 - G4)
      { key: '2', beats: 1.5 },
      { key: 'E', beats: 1.5 },
      { key: 'W', beats: 1.0 },
      { key: 'Q', beats: 4.0 },

      // Phrase 4 (Bb, 8 beats): Bb4 - G4 - F4 - Eb4 (loops cleanly back to F4 on Beat 1)
      { key: '2', beats: 1.5 },
      { key: 'E', beats: 1.5 },
      { key: 'W', beats: 1.0 },
      { key: 'Q', beats: 4.0 },
    ],
  },
  {
    id: 'shape',
    title: 'Shape of You',
    subtitle: 'Ed Sheeran · 96 BPM',
    bpm: 96,
    defaultVoice: 'marimba',
    steps: [
      { key: 'W', beats: 0.75 }, { key: 'R', beats: 0.75 }, { key: 'W', beats: 0.5 },
      { key: 'W', beats: 0.75 }, { key: 'R', beats: 0.75 }, { key: 'W', beats: 0.5 },
      { key: 'W', beats: 0.75 }, { key: 'R', beats: 0.75 }, { key: 'W', beats: 0.5 },
      { key: 'E', beats: 0.5 }, { key: 'W', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'W', beats: 0.5 },

      { key: 'W', beats: 0.75 }, { key: 'R', beats: 0.75 }, { key: 'W', beats: 0.5 },
      { key: 'W', beats: 0.75 }, { key: 'R', beats: 0.75 }, { key: 'W', beats: 0.5 },
      { key: 'W', beats: 0.75 }, { key: 'R', beats: 0.75 }, { key: 'W', beats: 0.5 },
      { key: 'E', beats: 0.5 }, { key: 'W', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'D', beats: 0.5 },
    ],
  },
  {
    id: 'faded',
    title: 'Faded',
    subtitle: 'Alan Walker · 90 BPM',
    bpm: 90,
    defaultVoice: 'piano',
    steps: [
      // "Where are you now?" (A minor white keys: E5 - C5 - A4 - G4 - E4 - F4 - D4)
      { key: '3', beats: 0.5 }, { key: '3', beats: 0.5 }, { key: '3', beats: 0.5 }, { key: '3', beats: 1.0 },
      // "At-lan-tis..."
      { key: '1', beats: 0.5 }, { key: 'W', beats: 0.5 }, { key: 'Q', beats: 1.5 },
      // "...un-der the sea"
      { key: 'Q', beats: 0.5 }, { key: '1', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'D', beats: 1.5 },
      // "...un-der the sea"
      { key: 'Q', beats: 0.5 }, { key: '1', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'D', beats: 0.5 }, { key: 'S', beats: 1.5 },
      // "I'm fa-ded, I'm fa-ded"
      { key: 'W', beats: 0.5 }, { key: 'F', beats: 0.5 }, { key: 'D', beats: 1.5 },
      { key: 'W', beats: 0.5 }, { key: 'F', beats: 0.5 }, { key: 'D', beats: 1.0 },
    ],
  },
  {
    id: 'wakemeup',
    title: 'Wake Me Up',
    subtitle: 'Avicii · 124 BPM',
    bpm: 124,
    defaultVoice: 'acoustic',
    steps: [
      // "So wake me up when it's all o-ver" (Bm -> Am transposition, exact 4/4 bars at 124 BPM)
      { key: 'Q', beats: 0.5 }, { key: 'W', beats: 0.5 }, { key: 'E', beats: 0.5 }, { key: '1', beats: 0.5 }, { key: '1', beats: 1.0 },
      { key: 'E', beats: 0.5 }, { key: 'W', beats: 0.5 },
      { key: 'W', beats: 0.5 }, { key: 'W', beats: 0.5 }, { key: 'D', beats: 1.5 },
      // "When I'm wi-ser and I'm ol-der"
      { key: 'W', beats: 0.5 }, { key: 'E', beats: 0.5 }, { key: '1', beats: 0.5 },
      { key: '1', beats: 0.5 }, { key: '1', beats: 0.5 }, { key: 'E', beats: 0.5 }, { key: 'W', beats: 0.5 }, { key: 'W', beats: 1.0 },
      // "And I did-n't know I was lost"
      { key: 'Q', beats: 0.5 }, { key: 'W', beats: 0.5 },
      { key: 'E', beats: 0.5 }, { key: '1', beats: 0.5 }, { key: 'D', beats: 0.5 }, { key: 'D', beats: 0.5 }, { key: 'S', beats: 0.5 }, { key: 'A', beats: 1.5 },
    ],
  },
  {
    id: 'stranger',
    title: 'Stranger Arp',
    subtitle: '80s Synth · 112 BPM',
    bpm: 112,
    defaultVoice: 'arp84',
    steps: [
      { key: 'A', beats: 0.5 }, { key: 'D', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'E', beats: 0.5 },
      { key: 'R', beats: 0.5 }, { key: 'E', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'D', beats: 0.5 },
      { key: 'A', beats: 0.5 }, { key: 'D', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'E', beats: 0.5 },
      { key: 'R', beats: 0.5 }, { key: 'E', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'D', beats: 0.5 },
      { key: 'Z', beats: 0.5 }, { key: 'D', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'W', beats: 0.5 },
      { key: '2', beats: 0.5 }, { key: 'W', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'D', beats: 0.5 },
      { key: 'C', beats: 0.5 }, { key: 'F', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'E', beats: 0.5 },
      { key: '3', beats: 0.5 }, { key: 'E', beats: 0.5 }, { key: 'Q', beats: 0.5 }, { key: 'F', beats: 0.5 },
    ],
  },
]
