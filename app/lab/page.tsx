"use client"

import Link from 'next/link'
import LabHeader from './LabHeader'
import dynamic from 'next/dynamic'

const PixelTrail = dynamic(() => import('../components/ui/PixelTrail'), {
  ssr: false,
})

export default function Lab() {
  return (
    <div
      className="bg-white min-h-screen px-8 pt-28 md:pt-36 pb-16 max-w-5xl mx-auto"
      style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
    >
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .color-wheel-spin {
          animation: spin-slow 12s linear infinite;
        }
        @media (max-width: 767px) {
          .visitor-lab-card {
            --visitor-icon-right: -180px;
          }
        }
      `}</style>

      <LabHeader />

      {/* Section 1: Tools & Instruments */}
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400 mb-3.5">
          Instruments &amp; Interactive Tools
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Iso Studio Lab */}
          <Link
            href="/lab/iso-pad"
            className="group relative border border-zinc-200/90 rounded-2xl px-7 py-7 min-h-[214px] hover:border-zinc-400 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #ffffff 15%, #f4f2ff 100%)',
              textDecoration: 'none',
            }}
          >
            <div className="relative z-10 max-w-[58%]">
              <div
                className="text-2xl font-light tracking-tight mb-2 text-zinc-950"
                style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Iso Studio
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                Tactile 3D spatial melody synth &amp; rhythm studio.
              </div>
            </div>

            <div className="relative z-10 mt-8 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Synth · Audio Lab
            </div>

            <img
              src="/images/HomeImages/isopad-thumb.jpg"
              alt=""
              className="transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
              style={{
                position: 'absolute',
                bottom: '-14px',
                right: '-6px',
                width: '185px',
                height: '185px',
                objectFit: 'contain',
                pointerEvents: 'none',
                filter: 'contrast(1.05) brightness(1.03)',
                maskImage: 'radial-gradient(circle at 52% 52%, black 56%, transparent 78%)',
                WebkitMaskImage: 'radial-gradient(circle at 52% 52%, black 56%, transparent 78%)',
              }}
            />

            <div className="absolute bottom-5 right-5 z-10 w-8 h-8 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-zinc-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>

          {/* Visitor Card Lab */}
          <Link
            href="/lab/visitor-card"
            className="visitor-lab-card group relative border border-zinc-200/90 rounded-2xl px-7 py-7 min-h-[214px] hover:border-zinc-400 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #ffffff 15%, #fff7eb 100%)',
              textDecoration: 'none',
            }}
          >
            <div className="relative z-10 max-w-[58%]">
              <div
                className="text-2xl font-light tracking-tight mb-2 text-zinc-950"
                style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Visitor Card
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                Design and sign your custom visitor badge.
              </div>
            </div>

            <div className="relative z-10 mt-8 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Badge Maker · Canvas
            </div>

            <img
              src="/images/HomeImages/Visitoricon.png"
              alt=""
              className="transition-transform duration-300 group-hover:scale-105"
              style={{
                position: 'absolute',
                bottom: '-65px',
                right: 'var(--visitor-icon-right, -44px)',
                width: '245px',
                height: '245px',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />

            <div className="absolute bottom-5 right-5 z-10 w-8 h-8 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-zinc-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>

          {/* Bezier Sculptor Lab */}
          <Link
            href="/lab/bezier-sculptor"
            className="group relative border border-zinc-200/90 rounded-2xl px-7 py-7 min-h-[214px] hover:border-zinc-400 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #ffffff 15%, #f1f6ff 100%)',
              textDecoration: 'none',
            }}
          >
            <div className="relative z-10 max-w-[58%]">
              <div
                className="text-2xl font-light tracking-tight mb-2 text-zinc-950"
                style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Bezier Sculptor
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                How precise is your vector curve intuition?
              </div>
            </div>

            <div className="relative z-10 mt-8 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Vector · Precision
            </div>

            {/* Vector Control Handle & Curvature Comb Technical Blueprint Illustration */}
            <div
              className="absolute bottom-[-12px] right-[-6px] w-52 h-52 pointer-events-none select-none opacity-35 group-hover:opacity-90 transition-opacity duration-300"
              style={{ zIndex: 0 }}
            >
              <svg className="w-full h-full" viewBox="0 0 220 220" fill="none">
                <line x1="10" y1="180" x2="210" y2="180" stroke="#000000" strokeDasharray="3 3" opacity="0.4" />
                <line x1="30" y1="20" x2="30" y2="200" stroke="#000000" strokeDasharray="3 3" opacity="0.4" />
                <line x1="10" y1="40" x2="210" y2="40" stroke="#f97316" strokeDasharray="2 2" strokeWidth="1" />
                <circle cx="160" cy="180" r="75" stroke="#000000" strokeDasharray="2 4" opacity="0.25" />
                <circle cx="160" cy="180" r="45" stroke="#f97316" strokeDasharray="2 4" opacity="0.3" />
                <line x1="55" y1="165" x2="70" y2="148" stroke="#f97316" strokeWidth="1.2" />
                <line x1="85" y1="135" x2="110" y2="112" stroke="#f97316" strokeWidth="1.5" />
                <line x1="115" y1="95" x2="145" y2="68" stroke="#f97316" strokeWidth="1.5" />
                <line x1="145" y1="62" x2="175" y2="32" stroke="#f97316" strokeWidth="1.2" />
                <line x1="172" y1="42" x2="198" y2="15" stroke="#f97316" strokeWidth="1.2" />
                <path d="M 70 148 Q 110 112, 198 15" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="2 3" opacity="0.8" />
                <path
                  d="M 30 180 C 100 180, 140 40, 200 40 L 200 65 C 150 65, 110 195, 30 195 Z"
                  fill="#000000"
                  opacity="0.08"
                />
                <path d="M 30 180 C 100 180, 140 40, 200 40" fill="none" stroke="#000000" strokeWidth="2.5" />
                <line x1="30" y1="180" x2="100" y2="180" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="3 3" />
                <line x1="200" y1="40" x2="140" y2="40" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="100" cy="180" r="4.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
                <circle cx="140" cy="40" r="4.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.5" />
                <rect x="27" y="177" width="6" height="6" fill="#000000" />
                <rect x="197" y="37" width="6" height="6" fill="#000000" />
                <text x="36" y="32" fontSize="9" fontFamily="monospace" fill="#f97316" fontWeight="bold">C² CONTINUITY</text>
                <text x="108" y="194" fontSize="8" fontFamily="monospace" fill="#3b82f6">C₁(x, y)</text>
                <text x="132" y="30" fontSize="8" fontFamily="monospace" fill="#3b82f6">C₂(x, y)</text>
                <text x="14" y="174" fontSize="8" fontFamily="monospace" fill="#000000">P₀</text>
                <text x="204" y="52" fontSize="8" fontFamily="monospace" fill="#000000">P₃</text>
                <text x="142" y="112" fontSize="8" fontFamily="monospace" fill="#f97316">K(t) DERIVATIVE</text>
              </svg>
            </div>

            <div className="absolute bottom-5 right-5 z-10 w-8 h-8 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-zinc-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>

          {/* Specimen-09 Lab */}
          <Link
            href="/lab/specimen"
            className="group relative border border-zinc-200/90 rounded-2xl px-7 py-7 min-h-[214px] hover:border-zinc-400 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #ffffff 15%, #eefaf4 100%)',
              textDecoration: 'none',
            }}
          >
            <div className="relative z-10 max-w-[58%]">
              <div
                className="text-2xl font-light tracking-tight mb-2 text-zinc-950"
                style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Specimen-09
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                Interactive WebGL fluid sweep specimen scanner.
              </div>
            </div>

            <div className="relative z-10 mt-8 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              WebGL · Fluid Sweep
            </div>

            <img
              src="/images/HomeImages/specimen.png"
              alt=""
              className="transition-transform duration-300 group-hover:scale-105"
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-12px',
                width: '155px',
                height: '155px',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />

            <div className="absolute bottom-5 right-5 z-10 w-8 h-8 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-zinc-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Section 2: Perception Games & Shaders */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400 mb-3.5">
          Experiments &amp; Visual Games
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Match Lab */}
          <Link
            href="/lab/type-match"
            className="group relative border border-zinc-200/90 rounded-2xl px-7 py-7 min-h-[214px] hover:border-zinc-400 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #ffffff 15%, #fff8f0 100%)',
              textDecoration: 'none',
            }}
          >
            <div className="relative z-10 max-w-[58%]">
              <div
                className="text-2xl font-light tracking-tight mb-2 text-zinc-950"
                style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Type Match
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                How sharp is your typographic eye?
              </div>
            </div>

            <div className="relative z-10 mt-8 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Typography · Quiz
            </div>

            {/* Rich Typography Specimen Illustration */}
            <div
              className="absolute bottom-[-14px] right-[-8px] w-48 h-48 pointer-events-none select-none opacity-25 group-hover:opacity-80 transition-opacity duration-300"
              style={{ zIndex: 0 }}
            >
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <line x1="0" y1="40" x2="200" y2="40" stroke="#000000" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="200" y2="100" stroke="#f97316" strokeWidth="1.5" />
                <line x1="0" y1="160" x2="200" y2="160" stroke="#000000" strokeDasharray="3 3" />
                <circle cx="110" cy="100" r="55" stroke="#000000" strokeDasharray="2 4" />
                <text x="14" y="34" fontSize="10" fontFamily="monospace" fill="#000000">Cap-Height</text>
                <text x="14" y="94" fontSize="10" fontFamily="monospace" fill="#f97316">Baseline</text>
                <text x="14" y="154" fontSize="10" fontFamily="monospace" fill="#000000">Descender</text>
              </svg>

              <div
                className="absolute inset-0 flex items-center justify-end pr-3 pt-2 text-7xl font-serif text-black"
                style={{ fontFamily: 'SatishSans, Garamond, serif', letterSpacing: '-0.06em' }}
              >
                <span style={{ fontFamily: 'VarunCapsSans, serif', fontSize: '1.2em' }}>A</span>
                <span style={{ fontFamily: 'SatishSans, serif', color: '#f97316', marginLeft: '-4px' }}>a</span>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 z-10 w-8 h-8 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-zinc-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>

          {/* Color Lab */}
          <Link
            href="/lab/color"
            className="group relative border border-zinc-200/90 rounded-2xl px-7 py-7 min-h-[214px] hover:border-zinc-400 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #ffffff 15%, #fff3f6 100%)',
              textDecoration: 'none',
            }}
          >
            <div className="relative z-10 max-w-[58%]">
              <div
                className="text-2xl font-light tracking-tight mb-2 text-zinc-950"
                style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Color
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                How good is your color memory?
              </div>
            </div>

            <div className="relative z-10 mt-8 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Perception · Memory
            </div>

            {/* Revolving color wheel — bottom right */}
            <img
              src="/images/HomeImages/color-wheel.png"
              alt=""
              className="color-wheel-spin"
              style={{
                position: 'absolute',
                bottom: '-45px',
                right: '-45px',
                width: '165px',
                height: '165px',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />

            <div className="absolute bottom-5 right-5 z-10 w-8 h-8 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-zinc-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>

          {/* Pixel Trail Lab */}
          <Link
            href="/lab/pixel-trail"
            className="group relative md:col-span-2 border border-zinc-200/90 rounded-2xl px-7 py-7 min-h-[190px] hover:border-zinc-400 hover:shadow-[0_14px_34px_-14px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #ffffff 15%, #f3f4f6 100%)',
              textDecoration: 'none',
            }}
          >
            {/* Live background interaction */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
              <PixelTrail
                gridSize={16}
                trailSize={0.16}
                maxAge={300}
                interpolate={2}
                color="#111111"
                gooeyEnabled={true}
                gooStrength={3}
              />
            </div>

            <div className="relative z-10 pointer-events-none max-w-[58%]">
              <div
                className="text-2xl font-light tracking-tight mb-2 text-zinc-950"
                style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Pixel Trail
              </div>
              <div className="text-[13px] text-zinc-500 leading-relaxed">
                Interactive shader-based pixel grid cursor effect.
              </div>
            </div>

            <div className="relative z-10 pointer-events-none mt-8 text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">
              Shader · Interaction
            </div>

            <div className="absolute bottom-5 right-5 pointer-events-none z-10 w-8 h-8 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:border-zinc-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
