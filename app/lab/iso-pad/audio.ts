import { KeyDef, SoundVoice } from './songs'

export interface SynthParams {
  cutoff: number // 0..1 (maps 320Hz -> 9500Hz)
  reverb: number // 0..1
  delay: number  // 0..1
}

// Studio Web Audio Synth Engine with Live DSP Filter, Hall Reverb, Delay, Backing Drums & Oscilloscope Analyser
export class IsoAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private dryBus: GainNode | null = null
  private masterFilter: BiquadFilterNode | null = null
  private delayWet: GainNode | null = null
  private reverbWet: GainNode | null = null
  public analyser: AnalyserNode | null = null

  private params: SynthParams = { cutoff: 0.78, reverb: 0.42, delay: 0.35 }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return null

      const ctx = new AudioCtx()
      this.ctx = ctx

      const compressor = ctx.createDynamicsCompressor()
      compressor.threshold.setValueAtTime(-15, ctx.currentTime)
      compressor.knee.setValueAtTime(18, ctx.currentTime)
      compressor.ratio.setValueAtTime(4, ctx.currentTime)

      const masterFilter = ctx.createBiquadFilter()
      masterFilter.type = 'lowpass'
      masterFilter.Q.setValueAtTime(1.4, ctx.currentTime)
      masterFilter.frequency.setValueAtTime(this.cutoffToHz(this.params.cutoff), ctx.currentTime)

      const master = ctx.createGain()
      master.gain.setValueAtTime(0.88, ctx.currentTime)

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.78

      // Feedback stereo-style delay
      const delay = ctx.createDelay(1.0)
      delay.delayTime.setValueAtTime(0.26, ctx.currentTime)
      const delayFeedback = ctx.createGain()
      delayFeedback.gain.setValueAtTime(0.32, ctx.currentTime)
      const delayFilter = ctx.createBiquadFilter()
      delayFilter.type = 'lowpass'
      delayFilter.frequency.setValueAtTime(2400, ctx.currentTime)
      const delayWet = ctx.createGain()
      delayWet.gain.setValueAtTime(this.params.delay * 0.55, ctx.currentTime)

      delay.connect(delayFilter)
      delayFilter.connect(delayFeedback)
      delayFeedback.connect(delay)
      delayFilter.connect(delayWet)
      delayWet.connect(compressor)

      // Algorithmic impulse-response hall reverb
      const reverb = ctx.createConvolver()
      const irLen = Math.floor(ctx.sampleRate * 1.65)
      const irBuf = ctx.createBuffer(2, irLen, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const data = irBuf.getChannelData(ch)
        for (let i = 0; i < irLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.4)
        }
      }
      reverb.buffer = irBuf
      const reverbWet = ctx.createGain()
      reverbWet.gain.setValueAtTime(this.params.reverb * 0.65, ctx.currentTime)
      reverb.connect(reverbWet)
      reverbWet.connect(compressor)

      const dry = ctx.createGain()
      dry.gain.setValueAtTime(0.9, ctx.currentTime)
      dry.connect(masterFilter)
      masterFilter.connect(compressor)
      masterFilter.connect(delay)
      masterFilter.connect(reverb)

      compressor.connect(master)
      master.connect(analyser)
      analyser.connect(ctx.destination)

      this.masterGain = master
      this.dryBus = dry
      this.masterFilter = masterFilter
      this.delayWet = delayWet
      this.reverbWet = reverbWet
      this.analyser = analyser
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  private cutoffToHz(norm: number): number {
    return 320 * Math.pow(30, Math.min(1, Math.max(0, norm)))
  }

  public setParams(next: SynthParams) {
    this.params = next
    if (!this.ctx) return
    const now = this.ctx.currentTime
    if (this.masterFilter) {
      this.masterFilter.frequency.setTargetAtTime(this.cutoffToHz(next.cutoff), now, 0.025)
    }
    if (this.reverbWet) {
      this.reverbWet.gain.setTargetAtTime(next.reverb * 0.65, now, 0.03)
    }
    if (this.delayWet) {
      this.delayWet.gain.setTargetAtTime(next.delay * 0.55, now, 0.03)
    }
  }

  public getTimeDomainData(target: Uint8Array<ArrayBuffer>): boolean {
    if (!this.analyser) return false
    this.analyser.getByteTimeDomainData(target)
    return true
  }

  public playNote(keyDef: KeyDef, voice: SoundVoice, muted: boolean, gainScale = 1) {
    if (muted) return
    const ctx = this.ensureContext()
    if (!ctx || !this.dryBus) return

    const now = ctx.currentTime

    if (voice === 'marimba') {
      // Warm wooden resonator marimba (Shape of You signature timbre)
      const body = ctx.createOscillator()
      const overtone = ctx.createOscillator()
      const bodyEnv = ctx.createGain()
      const overEnv = ctx.createGain()

      body.type = 'sine'
      body.frequency.setValueAtTime(keyDef.freq, now)
      overtone.type = 'sine'
      overtone.frequency.setValueAtTime(keyDef.freq * 3.98, now) // classic marimba bar 4th harmonic

      bodyEnv.gain.setValueAtTime(0.001, now)
      bodyEnv.gain.linearRampToValueAtTime(0.32 * gainScale, now + 0.005)
      bodyEnv.gain.exponentialRampToValueAtTime(0.0008, now + 0.34)

      overEnv.gain.setValueAtTime(0.001, now)
      overEnv.gain.linearRampToValueAtTime(0.11 * gainScale, now + 0.003)
      overEnv.gain.exponentialRampToValueAtTime(0.0008, now + 0.065)

      body.connect(bodyEnv)
      overtone.connect(overEnv)
      bodyEnv.connect(this.dryBus)
      overEnv.connect(this.dryBus)

      body.start(now)
      overtone.start(now)
      body.stop(now + 0.36)
      overtone.stop(now + 0.08)
    } else if (voice === 'brass') {
      // Bold cinematic horn/brass BGM stab (Veezha Veera mass anthem timbre)
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const sub = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const env = ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'sawtooth'
      sub.type = 'triangle'
      osc1.frequency.setValueAtTime(keyDef.freq, now)
      osc2.frequency.setValueAtTime(keyDef.freq * 1.0085, now)
      sub.frequency.setValueAtTime(keyDef.freq * 0.5, now)

      const subGain = ctx.createGain()
      subGain.gain.setValueAtTime(0.45, now)

      filter.type = 'lowpass'
      filter.Q.setValueAtTime(2.4, now)
      filter.frequency.setValueAtTime(Math.max(320, keyDef.freq * 1.4), now)
      filter.frequency.linearRampToValueAtTime(Math.min(5200, keyDef.freq * 5.8), now + 0.032)
      filter.frequency.exponentialRampToValueAtTime(Math.max(240, keyDef.freq * 1.8), now + 0.34)

      env.gain.setValueAtTime(0.001, now)
      env.gain.linearRampToValueAtTime(0.22 * gainScale, now + 0.018)
      env.gain.exponentialRampToValueAtTime(0.0008, now + 0.38)

      osc1.connect(filter)
      osc2.connect(filter)
      sub.connect(subGain)
      subGain.connect(filter)
      filter.connect(env)
      env.connect(this.dryBus)

      osc1.start(now)
      osc2.start(now)
      sub.start(now)
      osc1.stop(now + 0.4)
      osc2.stop(now + 0.4)
      sub.stop(now + 0.4)
    } else if (voice === 'piano') {
      // Rich acoustic / felt grand piano chime (Runaway single-note resonance)
      const h1 = ctx.createOscillator()
      const h2 = ctx.createOscillator()
      const h3 = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const env = ctx.createGain()

      h1.type = 'triangle'
      h2.type = 'sine'
      h3.type = 'sine'
      h1.frequency.setValueAtTime(keyDef.freq, now)
      h2.frequency.setValueAtTime(keyDef.freq * 2.0, now)
      h3.frequency.setValueAtTime(keyDef.freq * 3.01, now)

      const g2 = ctx.createGain()
      g2.gain.setValueAtTime(0.28, now)
      g2.gain.exponentialRampToValueAtTime(0.02, now + 0.65)
      const g3 = ctx.createGain()
      g3.gain.setValueAtTime(0.11, now)
      g3.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(4200, now)
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.85)

      env.gain.setValueAtTime(0.001, now)
      env.gain.linearRampToValueAtTime(0.26 * gainScale, now + 0.006)
      env.gain.exponentialRampToValueAtTime(0.0008, now + 1.15)

      h1.connect(filter)
      h2.connect(g2)
      h3.connect(g3)
      g2.connect(filter)
      g3.connect(filter)
      filter.connect(env)
      env.connect(this.dryBus)

      h1.start(now)
      h2.start(now)
      h3.start(now)
      h1.stop(now + 1.2)
      h2.stop(now + 1.2)
      h3.stop(now + 0.35)
    } else if (voice === 'arp84') {
      // Dark 80s modular square+sub pulse (Stranger Arp vibe)
      const sq = ctx.createOscillator()
      const sub = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const env = ctx.createGain()

      sq.type = 'square'
      sub.type = 'sawtooth'
      sq.frequency.setValueAtTime(keyDef.freq, now)
      sub.frequency.setValueAtTime(keyDef.freq * 0.5, now)

      const subGain = ctx.createGain()
      subGain.gain.setValueAtTime(0.45, now)

      filter.type = 'lowpass'
      filter.Q.setValueAtTime(4.8, now)
      filter.frequency.setValueAtTime(keyDef.freq * 6, now)
      filter.frequency.exponentialRampToValueAtTime(Math.max(160, keyDef.freq * 1.1), now + 0.28)

      env.gain.setValueAtTime(0.001, now)
      env.gain.linearRampToValueAtTime(0.14 * gainScale, now + 0.008)
      env.gain.exponentialRampToValueAtTime(0.0008, now + 0.42)

      sq.connect(filter)
      sub.connect(subGain)
      subGain.connect(filter)
      filter.connect(env)
      env.connect(this.dryBus)

      sq.start(now)
      sub.start(now)
      sq.stop(now + 0.44)
      sub.stop(now + 0.44)
    } else if (voice === 'glass') {
      const carrier = ctx.createOscillator()
      const mod = ctx.createOscillator()
      const modGain = ctx.createGain()
      const env = ctx.createGain()

      carrier.type = 'sine'
      carrier.frequency.setValueAtTime(keyDef.freq, now)

      mod.type = 'sine'
      mod.frequency.setValueAtTime(keyDef.freq * 2.0, now)
      modGain.gain.setValueAtTime(keyDef.freq * 0.85, now)
      modGain.gain.exponentialRampToValueAtTime(1, now + 0.25)

      env.gain.setValueAtTime(0.001, now)
      env.gain.linearRampToValueAtTime(0.24 * gainScale, now + 0.008)
      env.gain.exponentialRampToValueAtTime(0.0008, now + 0.65)

      mod.connect(modGain)
      modGain.connect(carrier.frequency)
      carrier.connect(env)
      env.connect(this.dryBus)

      carrier.start(now)
      mod.start(now)
      carrier.stop(now + 0.68)
      mod.stop(now + 0.35)
    } else if (voice === 'juno') {
      // Lush 80s Juno-60 chorus dual-sawtooth poly synth (Blinding Lights lead)
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const env = ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'sawtooth'
      osc1.frequency.setValueAtTime(keyDef.freq, now)
      osc2.frequency.setValueAtTime(keyDef.freq * 1.0065, now)

      filter.type = 'lowpass'
      filter.Q.setValueAtTime(3.4, now)
      filter.frequency.setValueAtTime(keyDef.freq * 7, now)
      filter.frequency.exponentialRampToValueAtTime(Math.max(180, keyDef.freq * 1.6), now + 0.38)

      env.gain.setValueAtTime(0.001, now)
      env.gain.linearRampToValueAtTime(0.17 * gainScale, now + 0.01)
      env.gain.exponentialRampToValueAtTime(0.0008, now + 0.55)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(env)
      env.connect(this.dryBus)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.58)
      osc2.stop(now + 0.58)
    } else if (voice === 'acoustic') {
      // Crisp folk acoustic steel-string pluck + warm wood body (Wake Me Up guitar feel)
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const body = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const env = ctx.createGain()
      const bodyEnv = ctx.createGain()

      osc1.type = 'triangle'
      osc2.type = 'sawtooth'
      osc1.frequency.setValueAtTime(keyDef.freq, now)
      osc2.frequency.setValueAtTime(keyDef.freq * 2.0, now)

      body.type = 'sine'
      body.frequency.setValueAtTime(keyDef.freq, now)
      bodyEnv.gain.setValueAtTime(0.18 * gainScale, now)
      bodyEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

      const g2 = ctx.createGain()
      g2.gain.setValueAtTime(0.16, now)
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(3800, now)
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.32)

      env.gain.setValueAtTime(0.001, now)
      env.gain.linearRampToValueAtTime(0.28 * gainScale, now + 0.004)
      env.gain.exponentialRampToValueAtTime(0.0008, now + 0.45)

      osc1.connect(filter)
      osc2.connect(g2)
      g2.connect(filter)
      filter.connect(env)
      env.connect(this.dryBus)
      body.connect(bodyEnv)
      bodyEnv.connect(this.dryBus)

      osc1.start(now)
      osc2.start(now)
      body.start(now)
      osc1.stop(now + 0.48)
      osc2.stop(now + 0.12)
      body.stop(now + 0.3)
    } else {
      // Swirly phased Tame Impala synth-guitar ('phaser' Currents timbre)
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const phaseFilter1 = ctx.createBiquadFilter()
      const phaseFilter2 = ctx.createBiquadFilter()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      const env = ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'triangle'
      osc1.frequency.setValueAtTime(keyDef.freq, now)
      osc2.frequency.setValueAtTime(keyDef.freq * 1.005, now)

      phaseFilter1.type = 'allpass'
      phaseFilter1.frequency.setValueAtTime(Math.max(400, keyDef.freq * 2.1), now)
      phaseFilter1.Q.setValueAtTime(4.5, now)

      phaseFilter2.type = 'lowpass'
      phaseFilter2.frequency.setValueAtTime(Math.min(4800, keyDef.freq * 5.2), now)
      phaseFilter2.Q.setValueAtTime(3.2, now)

      lfo.type = 'sine'
      lfo.frequency.setValueAtTime(3.6, now)
      lfoGain.gain.setValueAtTime(650, now)
      lfo.connect(lfoGain)
      lfoGain.connect(phaseFilter1.frequency)
      lfoGain.connect(phaseFilter2.frequency)

      env.gain.setValueAtTime(0.001, now)
      env.gain.linearRampToValueAtTime(0.24 * gainScale, now + 0.01)
      env.gain.exponentialRampToValueAtTime(0.0008, now + 0.44)

      osc1.connect(phaseFilter1)
      osc2.connect(phaseFilter1)
      phaseFilter1.connect(phaseFilter2)
      phaseFilter2.connect(env)
      env.connect(this.dryBus)

      osc1.start(now)
      osc2.start(now)
      lfo.start(now)
      osc1.stop(now + 0.46)
      osc2.stop(now + 0.46)
      lfo.stop(now + 0.46)
    }
  }

  public playDrum(kind: 'kick' | 'hat' | 'rim', muted: boolean) {
    if (muted) return
    const ctx = this.ensureContext()
    if (!ctx || !this.masterGain) return
    const now = ctx.currentTime

    if (kind === 'kick') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(125, now)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.09)
      gain.gain.setValueAtTime(0.24, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now)
      osc.stop(now + 0.15)
    } else if (kind === 'rim') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(420, now)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.025)
      gain.gain.setValueAtTime(0.11, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now)
      osc.stop(now + 0.045)
    } else {
      const bufSize = Math.floor(ctx.sampleRate * 0.03)
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.setValueAtTime(6500, now)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.055, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
      src.connect(hp)
      hp.connect(g)
      g.connect(this.masterGain)
      src.start(now)
    }
  }
}
