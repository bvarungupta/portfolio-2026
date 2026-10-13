"use client"

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Config mirrors ABHAY / TEJAS in page.tsx
const ABHAY = {
  src: '/images/HomeImages/left-angel-bw.webp',
  width: 640,
}

const TEJAS = {
  src: '/images/HomeImages/Right-angel-bw.webp',
  width: 550,
}

export default function ParallaxImages() {
  const abhayDesktop = useRef<HTMLDivElement>(null)
  const tejasDesktop = useRef<HTMLDivElement>(null)
  const abhayMobile = useRef<HTMLDivElement>(null)
  const tejasMobile = useRef<HTMLDivElement>(null)

  // Clean up any leftover dev tuning storage
  useEffect(() => {
    try {
      localStorage.removeItem('hero-angel-tuning-dev')
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }

      // Desktop: drift down + slide outward
      gsap.to(abhayDesktop.current, {
        y: () => window.innerHeight * 0.35,
        x: () => -window.innerWidth * 0.25,
        ease: 'none',
        scrollTrigger: st,
      })
      gsap.to(tejasDesktop.current, {
        y: () => window.innerHeight * 0.25,
        x: () => window.innerWidth * 0.25,
        ease: 'none',
        scrollTrigger: st,
      })

      // Mobile: slide off-screen to clear room for content
      const mobileScrollST = {
        trigger: document.body,
        start: 'top top',
        end: '25% top',
        scrub: 0.5,
      }
      gsap.to(abhayMobile.current, {
        x: () => -window.innerWidth * 0.6,
        opacity: 0,
        ease: 'none',
        scrollTrigger: mobileScrollST,
      })
      gsap.to(tejasMobile.current, {
        x: () => window.innerWidth * 0.6,
        opacity: 0,
        ease: 'none',
        scrollTrigger: mobileScrollST,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ── Desktop — full-width viewport-aligned container ────────────────── */}
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full pointer-events-none overflow-visible">
        {/* Left Angel (Desktop) */}
        <div
          ref={abhayDesktop}
          data-hero-angel="left"
          className="absolute h-auto pointer-events-none"
          style={{
            width: 'clamp(380px, 32.4vw, 640px)',
            left: '45px',
            top: '8.5%',
            zIndex: 2,
          }}
        >
          <div
            style={{
              transform: 'rotate(-12deg) scale(1.575)',
              transformOrigin: 'center center',
            }}
          >
            <Image
              src={ABHAY.src}
              alt="Abhay - Client Collaboration"
              width={640}
              height={Math.round((640 * 501) / 752)}
              priority
              loading="eager"
              fetchPriority="high"
              className="w-full h-auto object-contain block"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Right Angel (Desktop) */}
        <div
          ref={tejasDesktop}
          data-hero-angel="right"
          className="absolute h-auto pointer-events-none"
          style={{
            width: 'clamp(324px, 27.9vw, 550px)',
            right: '0px',
            top: '63%',
            zIndex: 2,
          }}
        >
          <div
            style={{
              transform: 'rotate(-29deg) scale(1.5)',
              transformOrigin: 'center center',
            }}
          >
            <Image
              src={TEJAS.src}
              alt="Tejas - Client Collaboration"
              width={550}
              height={Math.round((550 * 641) / 642)}
              loading="eager"
              fetchPriority="low"
              className="w-full h-auto object-contain block"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile — fixed to viewport, no container clipping ───────────────── */}
      {/* Left Angel (Mobile) */}
      <div
        ref={abhayMobile}
        data-hero-angel="left"
        className="fixed block md:hidden pointer-events-none"
        style={{
          width: 270,
          left: -115,
          top: '14.5vh',
          zIndex: 2,
        }}
      >
        <div
          style={{
            transform: 'rotate(-2deg) scale(1.26)',
            transformOrigin: 'center center',
          }}
        >
          <Image
            src={ABHAY.src}
            alt="Abhay - Client Collaboration"
            width={270}
            height={Math.round((270 * 501) / 752)}
            priority
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto object-contain block"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      {/* Right Angel (Mobile) */}
      <div
        ref={tejasMobile}
        data-hero-angel="right"
        className="fixed block md:hidden pointer-events-none"
        style={{
          width: 236,
          right: -90,
          top: '64vh',
          zIndex: 2,
        }}
      >
        <div
          style={{
            transform: 'rotate(-20deg) scale(1.2)',
            transformOrigin: 'center center',
          }}
        >
          <Image
            src={TEJAS.src}
            alt="Tejas - Client Collaboration"
            width={236}
            height={Math.round((236 * 641) / 642)}
            loading="eager"
            fetchPriority="low"
            className="w-full h-auto object-contain block"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </>
  )
}
