import Link from 'next/link'
import LabHeader from './LabHeader'

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

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/lab/color"
          className="group relative border border-gray-200 px-6 py-8 hover:border-gray-900 transition-colors duration-200 overflow-hidden"
          style={{ background: '#ffffff', textDecoration: 'none', borderRadius: '0 16px 0 16px', boxShadow: 'inset 8px 0 24px -8px rgba(0,0,0,0.12)' }}
        >
          <div
            className="text-2xl font-light tracking-tight mb-3 text-black"
            style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
          >
            Color
          </div>
          <div className="text-xs mb-8" style={{ color: 'rgba(0,0,0,0.4)', letterSpacing: '0.02em', lineHeight: '1.5' }}>
            How good is your color memory?
          </div>

          {/* Revolving color wheel — bottom right, half visible */}
          <img
            src="/images/HomeImages/color-wheel.png"
            alt=""
            className="color-wheel-spin"
            style={{
              position: 'absolute',
              bottom: '-45px',
              right: '-45px',
              width: '160px',
              height: '160px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />

          <div className="absolute bottom-5 right-5" style={{ zIndex: 1, width: '30px', height: '30px', borderRadius: '50%', background: '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.18), inset -1px -1px 3px rgba(255,255,255,0.9)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </Link>

        {/* Visitor Card Lab */}
        <Link
          href="/lab/visitor-card"
          className="visitor-lab-card group relative border border-gray-200 px-6 py-8 hover:border-gray-900 transition-colors duration-200 overflow-hidden"
          style={{ background: '#ffffff', textDecoration: 'none', borderRadius: '0 16px 0 16px', boxShadow: 'inset 8px 0 24px -8px rgba(0,0,0,0.12)' }}
        >
          <div
            className="text-2xl font-light tracking-tight mb-3 text-black"
            style={{ fontFamily: 'SatishSans, sans-serif', letterSpacing: '-0.01em' }}
          >
            Visitor Card
          </div>
          <div className="text-xs mb-8" style={{ color: 'rgba(0,0,0,0.4)', letterSpacing: '0.02em', lineHeight: '1.5' }}>
            Design and sign your custom visitor badge.
          </div>

          <img
            src="/images/HomeImages/Visitoricon.png"
            alt=""
            style={{
              position: 'absolute',
              bottom: '-70px',
              right: 'var(--visitor-icon-right, -50px)',
              width: '260px',
              height: '260px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />

          <div className="absolute bottom-5 right-5" style={{ zIndex: 1, width: '30px', height: '30px', borderRadius: '50%', background: '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.18), inset -1px -1px 3px rgba(255,255,255,0.9)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  )
}
