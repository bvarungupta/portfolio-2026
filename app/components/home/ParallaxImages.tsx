"use client"

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Config mirrors ABHAY / TEJAS in page.tsx
const ABHAY = {
  src: '/images/HomeImages/angel-left.svg',
  width: 590,
  left: '-35%',
  top: '-2%',
  rotate: 35,
}

const TEJAS = {
  src: '/images/HomeImages/icarus.svg',
  width: 510,
  right: '-35%',
  top: '40%',
  rotate: -15,
}

export default function ParallaxImages() {
  const abhayDesktop = useRef<HTMLDivElement>(null)
  const tejasDesktop = useRef<HTMLDivElement>(null)
  const abhayMobile = useRef<HTMLDivElement>(null)
  const tejasMobile = useRef<HTMLDivElement>(null)

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
        y: () => window.innerHeight * 0.35,
        x: () => window.innerWidth * 0.25,
        ease: 'none',
        scrollTrigger: st,
      })

      // Mobile: slide off-screen to their respective sides on scroll
      const mobileScrollST = {
        trigger: document.body,
        start: 'top top',
        end: '25% top',
        scrub: true,
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
      {/* ── Desktop ──────────────────────────────────────────── */}
      <div
        ref={abhayDesktop}
        className="absolute h-auto hidden md:block pointer-events-none"
        style={{ width: ABHAY.width, left: ABHAY.left, top: ABHAY.top, transform: `rotate(${ABHAY.rotate}deg)`, zIndex: 10 }}
      >
        <Image src={ABHAY.src} alt="Abhay - Client Collaboration" width={ABHAY.width} height={500} className="w-full h-auto object-contain block" style={{ width: 'auto', height: 'auto' }} />
      </div>
      <div
        ref={tejasDesktop}
        className="absolute h-auto hidden md:block pointer-events-none"
        style={{ width: TEJAS.width, right: TEJAS.right, top: TEJAS.top, transform: `rotate(${TEJAS.rotate}deg)`, zIndex: 10 }}
      >
        <Image src={TEJAS.src} alt="Tejas - Client Collaboration" width={TEJAS.width} height={500} className="w-full h-auto object-contain block" style={{ width: 'auto', height: 'auto' }} />
      </div>

      {/* ── Mobile — fixed to viewport, no container clipping ───────────────── */}
      <div
        ref={abhayMobile}
        className="fixed block md:hidden pointer-events-none"
        style={{ width: 240, left: -90, top: '10vh', transform: 'rotate(40deg)', zIndex: 10 }}
      >
        <Image src={ABHAY.src} alt="Abhay - Client Collaboration" width={240} height={332} className="w-full h-auto object-contain block" style={{ width: 'auto', height: 'auto' }} />
      </div>
      <div
        ref={tejasMobile}
        className="fixed block md:hidden pointer-events-none"
        style={{ width: 190, left: 'calc(100vw - 130px)', top: '55vh', transform: 'rotate(-90deg)', zIndex: 100 }}
      >
        <Image src={TEJAS.src} alt="Tejas - Client Collaboration" width={190} height={270} className="w-full h-auto object-contain block" style={{ width: 'auto', height: 'auto' }} />
      </div>
    </>
  )
}
