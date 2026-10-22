"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { attachShaderReveal, prefersReducedMotion } from './dither/shaderReveal'

interface ProcessRevealFigureProps {
  name: string
  src: string
  paintedSrc: string
  width: number
  height: number
  alt: string
  priority?: boolean
  sizes?: string
  cardRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export default function ProcessRevealFigure({
  name,
  src,
  paintedSrc,
  width,
  height,
  alt,
  priority = false,
  sizes,
  cardRef,
  className = 'w-full h-auto object-contain block align-bottom',
}: ProcessRevealFigureProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const glRef = useRef<HTMLCanvasElement>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = glRef.current
    const card = cardRef.current
    if (!wrap || !canvas || !paintedSrc) return

    // On mobile screens (<768px), colour version is displayed by default; skip WebGL setup
    if (typeof window !== 'undefined' && window.innerWidth < 768) return

    // If user prefers reduced motion, keep monochrome image static
    if (prefersReducedMotion()) return

    const touch = !window.matchMedia('(pointer: fine)').matches
    const cleanup = attachShaderReveal(
      wrap,
      canvas,
      name,
      paintedSrc,
      touch,
      undefined,
      card,
      { disableTouchBloom: true }
    )

    // If WebGL failed to initialize, activate CSS fallback
    if (!cleanup) {
      setFallbackMode(true)
    }

    return () => {
      cleanup?.()
    }
  }, [name, paintedSrc, cardRef])

  // Fallback mode tracking (hover on desktop, disabled on touch)
  useEffect(() => {
    if (!fallbackMode) return
    const card = cardRef.current
    if (!card) return

    const touch = !window.matchMedia('(pointer: fine)').matches
    if (touch) return

    const onEnter = () => setIsHovered(true)
    const onLeave = () => setIsHovered(false)

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)

    return () => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [fallbackMode, cardRef])

  return (
    <>
      {/* ── Mobile: Colour artwork by default (no hover required) ─────────── */}
      <div
        className="block md:hidden relative w-full h-auto select-none leading-none overflow-hidden"
        style={{ lineHeight: 0 }}
      >
        <Image
          src={paintedSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized
          sizes={sizes}
          className={className}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* ── Desktop: Monochrome base with hover colour reveal ─────────────── */}
      <div
        ref={wrapRef}
        className="hidden md:block relative w-full h-auto select-none pointer-events-auto leading-none overflow-hidden"
        style={{ lineHeight: 0 }}
      >
        {/* Base Monochrome Artwork */}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized
          sizes={sizes}
          className={className}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />

        {/* WebGL Shader Reveal Canvas */}
        <canvas
          ref={glRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ visibility: 'hidden' }}
        />

        {/* Graceful Fallback if WebGL unavailable */}
        {fallbackMode && (
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-700 ease-out"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={paintedSrc}
              alt=""
              width={width}
              height={height}
              className={className}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}
      </div>
    </>
  )
}
