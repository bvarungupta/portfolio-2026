"use client"

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DISABLE_WELCOME } from '../../lib/welcomeConfig'
import AngelRevealFigure from '../home/AngelRevealFigure'

gsap.registerPlugin(ScrollTrigger)

const EMAIL_ADDRESS = 'bvarungupta@gmail.com'

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bvarungupta', icon: '/images/HomeImages/linkedin.svg', color: '#0077b5' },
  { label: 'Behance', href: 'https://behance.net/bvarungupta', icon: '/images/HomeImages/behance.svg', color: '#0057ff' },
  { label: 'Dribbble', href: 'https://dribbble.com/bvarungupta', icon: '/images/HomeImages/dribbble.svg', color: '#ea4c89' },
]

export default function Footer() {
  const pathname = usePathname()
  const [welcomeActive, setWelcomeActive] = useState(!DISABLE_WELCOME)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mailCopied, setMailCopied] = useState(false)

  const footerRef = useRef<HTMLElement>(null)
  const leftCloudRef = useRef<HTMLDivElement>(null)
  const rightCloudRef = useRef<HTMLDivElement>(null)

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

  // Scroll-based Slide-In: left and right clouds smoothly slide in from both sides as footer enters
  useEffect(() => {
    const leftEl = leftCloudRef.current
    const rightEl = rightCloudRef.current
    const footerEl = footerRef.current
    if (!leftEl || !rightEl || !footerEl) return

    const mm = gsap.matchMedia()

    // Desktop: Left & right clouds slide in smoothly from both sides to frame the content
    mm.add('(min-width: 640px)', () => {
      gsap.fromTo(
        leftEl,
        {
          xPercent: -40,
          y: 20,
          scale: 0.93,
        },
        {
          xPercent: 0,
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerEl,
            start: 'top bottom+=200',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )

      gsap.fromTo(
        rightEl,
        {
          xPercent: 40,
          y: 20,
          scale: 0.93,
        },
        {
          xPercent: 0,
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerEl,
            start: 'top bottom+=200',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )
    })

    // Mobile: Top & bottom clouds slide in from left and right edges
    mm.add('(max-width: 639px)', () => {
      gsap.fromTo(
        leftEl,
        {
          xPercent: -35,
          y: -10,
        },
        {
          xPercent: 0,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: footerEl,
            start: 'top bottom+=150',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )

      gsap.fromTo(
        rightEl,
        {
          xPercent: 35,
          y: 10,
        },
        {
          xPercent: 0,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: footerEl,
            start: 'top bottom+=150',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )
    })

    const handleRefresh = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('welcome-finished', handleRefresh)
    window.addEventListener('resize', handleRefresh)
    const timer = setTimeout(handleRefresh, 400)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('welcome-finished', handleRefresh)
      window.removeEventListener('resize', handleRefresh)
      mm.revert()
    }
  }, [welcomeActive])

  return (
    <footer
      ref={footerRef}
      className={`${pathname?.startsWith('/lab/iso-pad') ? 'mt-0' : 'mt-20'} relative bg-white pt-[calc(48vw_+_16px)] sm:pt-12 pb-[calc(49vw_-_22px)] sm:pb-6 overflow-hidden ${
        pathname === '/' && welcomeActive ? 'invisible pointer-events-none' : ''
      }`}
    >
      {/* ── Parallax Cloud Layer with WebGL Shader Reveal ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left Cloud: Anchored at top-0 on mobile; on desktop brought closer, dynamically moving away as screen size shrinks (zero overlap) */}
        <div
          ref={leftCloudRef}
          className="absolute top-0 -left-[16vw] sm:top-auto sm:bottom-0 sm:left-auto sm:right-[calc(50%+clamp(180px,265px-5vw,220px))] w-[96vw] sm:w-[clamp(450px,40vw,680px)] pointer-events-auto select-none opacity-100"
          style={{ willChange: 'transform' }}
        >
          <AngelRevealFigure
            name="footer-left"
            src="/images/footer/leftcloud-bw.webp"
            paintedSrc="/images/footer/leftcloud-color.webp?v=30"
            alt="Left Cloud Atmosphere"
            width={3548}
            height={1774}
            className="w-full h-auto object-contain block"
            priority={true}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 96vw, 48vw"
          />
        </div>

        {/* Right Cloud: Anchored at bottom-0 on mobile; on desktop brought closer, dynamically moving away as screen size shrinks (zero overlap) */}
        <div
          ref={rightCloudRef}
          className="absolute bottom-0 -right-[16vw] sm:bottom-0 sm:right-auto sm:left-[calc(50%+clamp(180px,265px-5vw,220px))] w-[92vw] sm:w-[clamp(430px,38vw,640px)] pointer-events-auto select-none opacity-100"
          style={{ willChange: 'transform' }}
        >
          <AngelRevealFigure
            name="footer-right"
            src="/images/footer/rightcloud-bw.webp"
            paintedSrc="/images/footer/rightcloud-color.webp?v=30"
            alt="Right Cloud Atmosphere"
            width={3312}
            height={1774}
            className="w-full h-auto object-contain block"
            priority={true}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 92vw, 45vw"
          />
        </div>
      </div>

      {/* ── Footer Content (Option 1: centered, elevated z-10 for zero overlap) ── */}
      <div className="max-w-xl mx-auto w-full px-5 sm:px-6 pb-6 relative z-10">
        {/* Big name */}
        <div className="pb-4 sm:pb-6 text-center relative flex items-center justify-center gap-0">
          {/* Left branch */}
          <img
            src="/images/HomeImages/branch.svg"
            aria-hidden="true"
            className="hidden sm:block shrink-0 pointer-events-none select-none"
            style={{
              height: '140px',
              width: 'auto',
              transform: 'rotate(90deg)',
              filter: 'brightness(0) opacity(0.18)',
              marginRight: '-24px',
            }}
          />

          <div className="flex flex-col items-center">
            <h2
              className="text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-tight text-black select-none"
              aria-hidden="true"
            >
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.4em' }}>V</span>
              <span style={{ fontFamily: 'SatishSans, sans-serif', marginLeft: '6px' }}>arun</span>
            </h2>
            <p
              className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-gray-700 font-light"
              style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
            >
              Product Designer
            </p>
          </div>

          {/* Right branch — mirrored */}
          <img
            src="/images/HomeImages/branch.svg"
            aria-hidden="true"
            className="hidden sm:block shrink-0 pointer-events-none select-none"
            style={{
              height: '140px',
              width: 'auto',
              transform: 'rotate(90deg) scaleX(-1)',
              filter: 'brightness(0) opacity(0.18)',
              marginLeft: '-24px',
            }}
          />
        </div>

        {/* Short divider line between Varun and links */}
        <div className="w-36 sm:w-60 mx-auto border-t border-gray-200/80" />

        {/* Footer items: Socials only (LinkedIn, Behance, Dribbble, Mail copy) */}
        <div className="py-5 sm:py-6 flex flex-col items-center gap-4 sm:gap-5 w-full">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-9 w-full">
            {socialLinks.map((l) => {
              const isHovered = hoveredLink === l.label
              return (
                <div key={l.label} className="relative">
                  {l.icon && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '22px',
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
                  )}
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredLink(l.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="text-xs sm:text-sm font-light tracking-wide leading-tight transition-colors duration-200 block py-0.5"
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

            {/* Mail (click copies email to clipboard) */}
            <div className="relative">
              <div
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${hoveredLink === 'Mail' ? '10deg' : '-15deg'}) scale(${hoveredLink === 'Mail' ? 1.05 : 0.1})`,
                  opacity: hoveredLink === 'Mail' ? 1 : 0,
                  transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: 'block', filter: 'drop-shadow(0 3px 6px rgba(249,115,22,0.22))' }}
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="24" height="18" rx="5.5" fill="#f97316" />
                  <path
                    d="M5.5 9.2L12.7 14.3C13.48 14.85 14.52 14.85 15.3 14.3L22.5 9.2"
                    stroke="#ffffff"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(EMAIL_ADDRESS).catch(() => {})
                  }
                  setMailCopied(true)
                  setTimeout(() => setMailCopied(false), 2000)
                }}
                onMouseEnter={() => setHoveredLink('Mail')}
                onMouseLeave={() => setHoveredLink(null)}
                aria-label="Copy email address"
                className="text-xs sm:text-sm font-light tracking-wide leading-tight transition-colors duration-200 block py-0.5 cursor-pointer"
                style={{
                  fontFamily: 'FunnelDisplay, sans-serif',
                  color: mailCopied ? '#f97316' : hoveredLink === 'Mail' ? '#f97316' : '#374151',
                }}
              >
                {mailCopied ? 'Copied!' : 'Mail'}
              </button>
            </div>
          </div>

          {/* Logo + Copyright centered below the 4 columns */}
          <div className="pt-2 flex items-center justify-center gap-2.5 text-center">
            <Image
              src="/images/common/vg-outline.svg"
              alt="Varun Gupta Portfolio Logo"
              width={22}
              height={22}
              className="opacity-50"
            />
            <span
              className="text-xs sm:text-sm font-light tracking-wide text-gray-700"
              style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
            >
              © 2026 Varun Gupta
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
