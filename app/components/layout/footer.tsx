"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DISABLE_WELCOME } from '../../lib/welcomeConfig'
import { RuixenGradientFooter } from '@/components/ui/ruixen-gradient-footer'

const links = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bvarungupta', icon: '/images/HomeImages/linkedin.svg', color: '#0077b5' },
  { label: 'Behance', href: 'https://behance.net/bvarungupta', icon: '/images/HomeImages/behance.svg', color: '#0057ff' },
  { label: 'Dribbble', href: 'https://dribbble.com/bvarungupta', icon: '/images/HomeImages/dribbble.svg', color: '#ea4c89' },
  { label: 'Figma', href: 'https://figma.com/@bvarungupta', icon: '/images/ToolsIcons/figma-icon.svg', color: '#f24e1e' },
  { label: 'Medium', href: 'https://medium.com/@bvarungupta', icon: '/images/HomeImages/medium.svg', color: '#000000' },
]

const navLinks = [
  { label: 'Works', href: '/#work', icon: '/images/varun-image-hover-images/pen.png', color: '#f97316', size: 42 },
  { label: 'About', href: '/about', icon: '/images/varun-image-hover-images/football.png', color: '#f97316', size: 42 },
  { label: 'Lab', href: '/lab', icon: '/images/varun-image-hover-images/microscope.png', color: '#f97316', size: 42 },
  { label: 'Vault', href: '/vault', icon: '/images/varun-image-hover-images/bulb.png', color: '#f97316', size: 42 },
]

export default function Footer() {
  const pathname = usePathname()
  const isProposalPage = pathname?.startsWith('/proposals') || pathname === '/vault'
  const [welcomeActive, setWelcomeActive] = useState(!DISABLE_WELCOME)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  useEffect(() => {
    if (DISABLE_WELCOME) {
      setWelcomeActive(false)
      return
    }

    if (sessionStorage.getItem('welcome-shown') === 'true') {
      setWelcomeActive(false)
    }

    const handleWelcomeFinished = () => {
      setWelcomeActive(false)
    }
    window.addEventListener('welcome-finished', handleWelcomeFinished)
    return () => {
      window.removeEventListener('welcome-finished', handleWelcomeFinished)
    }
  }, [])

  if (pathname === '/' && welcomeActive) return null
  if (isProposalPage) return null

  return (
    <RuixenGradientFooter
      gradientHeight="280px"
      minReveal={0.045}
      bars={15}
      blur={14}
      peak={0.98}
      valley={0.35}
      className="mt-20 relative bg-white pt-10"
    >
      {/* ── Footer Content ── */}
      <div className="max-w-5xl mx-auto w-full px-6 md:px-10 pb-6 relative z-10">
        {/* Big name */}
        <div className="pb-6 text-center relative flex items-center justify-center gap-0">
          {/* Left branch */}
          <img
            src="/images/HomeImages/branch.svg"
            aria-hidden="true"
            className="hidden md:block shrink-0 pointer-events-none select-none"
            style={{
              height: '160px', width: 'auto',
              transform: 'rotate(90deg)',
              filter: 'brightness(0) opacity(0.18)',
              marginRight: '-30px',
            }}
          />

          <div className="flex flex-col items-center">
            <h2
              className="text-[clamp(3rem,12vw,9rem)] leading-none tracking-tight text-black select-none"
              aria-hidden="true"
            >
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.4em' }}>V</span>
              <span style={{ fontFamily: 'SatishSans, sans-serif', marginLeft: '6px' }}>arun</span>
            </h2>
            <p
              className="mt-4 text-sm text-gray-700 font-light"
              style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
            >
              Product Designer
            </p>
          </div>

          {/* Right branch — mirrored */}
          <img
            src="/images/HomeImages/branch.svg"
            aria-hidden="true"
            className="hidden md:block shrink-0 pointer-events-none select-none"
            style={{
              height: '160px', width: 'auto',
              transform: 'rotate(90deg) scaleX(-1)',
              filter: 'brightness(0) opacity(0.18)',
              marginLeft: '-30px',
            }}
          />
        </div>

        <div className="border-t border-gray-200/80" />

        {/* Bottom row: logo, nav links & social links */}
        <div data-gradient-trigger className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + year */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/common/vg-outline.svg"
              alt="Varun Gupta Portfolio Logo"
              width={28}
              height={28}
              className="opacity-50"
            />
            <span
              className="text-sm font-light tracking-wide text-gray-700"
              style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
            >
              © 2026 Varun Gupta
            </span>
          </div>

          {/* Nav links (2 rows on mobile, 1 row on desktop) */}
          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-center sm:flex sm:flex-row sm:items-center sm:gap-6">
            {navLinks.map((l) => {
              const isHovered = hoveredLink === l.label;
              return (
                <div key={l.label} className="relative">
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${isHovered ? '12deg' : '-15deg'}) scale(${isHovered ? 1.05 : 0.1})`,
                      opacity: isHovered ? 1 : 0,
                      transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease',
                      pointerEvents: 'none',
                      zIndex: 20,
                    }}
                  >
                    <img
                      src={l.icon}
                      alt=""
                      style={{
                        width: `${l.size || 28}px`,
                        height: `${l.size || 28}px`,
                        maxWidth: 'none',
                        display: 'block',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <Link
                    href={l.href}
                    onMouseEnter={() => setHoveredLink(l.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="text-sm font-light tracking-wide transition-colors duration-200"
                    style={{
                      fontFamily: 'FunnelDisplay, sans-serif',
                      color: isHovered ? l.color : '#374151',
                    }}
                  >
                    {l.label}
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Social links (3 in Row 1, 2 in Row 2 on mobile; 1 row on desktop) */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            {/* Row 1 on mobile */}
            <div className="flex items-center gap-6">
              {links.slice(0, 3).map((l) => {
                const isHovered = hoveredLink === l.label;
                return (
                  <div key={l.label} className="relative">
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${isHovered ? '12deg' : '-15deg'}) scale(${isHovered ? 1.05 : 0.1})`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease',
                        pointerEvents: 'none',
                        zIndex: 20,
                      }}
                    >
                      <img
                        src={l.icon}
                        alt=""
                        style={{
                          width: '26px',
                          height: '26px',
                          maxWidth: 'none',
                          display: 'block',
                        }}
                      />
                    </div>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredLink(l.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm font-light tracking-wide transition-colors duration-200"
                      style={{
                        fontFamily: 'FunnelDisplay, sans-serif',
                        color: isHovered ? l.color : '#374151',
                      }}
                    >
                      {l.label}
                    </a>
                  </div>
                )
              })}
            </div>

            {/* Row 2 on mobile */}
            <div className="flex items-center gap-6">
              {links.slice(3).map((l) => {
                const isHovered = hoveredLink === l.label;
                return (
                  <div key={l.label} className="relative">
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${isHovered ? '12deg' : '-15deg'}) scale(${isHovered ? 1.05 : 0.1})`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease',
                        pointerEvents: 'none',
                        zIndex: 20,
                      }}
                    >
                      <img
                        src={l.icon}
                        alt=""
                        style={{
                          width: '26px',
                          height: '26px',
                          maxWidth: 'none',
                          display: 'block',
                        }}
                      />
                    </div>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredLink(l.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm font-light tracking-wide transition-colors duration-200"
                      style={{
                        fontFamily: 'FunnelDisplay, sans-serif',
                        color: isHovered ? l.color : '#374151',
                      }}
                    >
                      {l.label}
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </RuixenGradientFooter>
  )
}
