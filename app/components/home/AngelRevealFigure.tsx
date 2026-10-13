"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { attachShaderReveal, prefersReducedMotion } from './dither/shaderReveal'

interface AngelRevealFigureProps {
  name: 'left' | 'right' | 'abhay' | 'tejas'
  src: string
  paintedSrc: string
  width: number
  height: number
  alt: string
  priority?: boolean
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  className?: string
  sizes?: string
  wave?: boolean
}

export default function AngelRevealFigure({
  name,
  src,
  paintedSrc,
  width,
  height,
  alt,
  priority = false,
  loading = 'eager',
  fetchPriority = 'auto',
  className = 'w-full h-auto object-contain block',
  sizes,
  wave = false,
}: AngelRevealFigureProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const glRef = useRef<HTMLCanvasElement>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [fallbackProgress, setFallbackProgress] = useState(0)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = glRef.current
    if (!wrap || !canvas || !paintedSrc) return

    // If user prefers reduced motion, keep monochrome image static
    if (prefersReducedMotion()) return

    const touch = wave || !window.matchMedia('(pointer: fine)').matches
    const cleanup = attachShaderReveal(wrap, canvas, name, paintedSrc, touch)

    // If WebGL failed to initialize, activate smooth CSS opacity fallback
    if (!cleanup) {
      setFallbackMode(true)
    }

    return () => {
      cleanup?.()
    }
  }, [name, paintedSrc, wave])

  // Fallback mode tracking (hover on desktop, scroll on mobile)
  useEffect(() => {
    if (!fallbackMode) return
    const wrap = wrapRef.current
    if (!wrap) return

    const touch = wave || !window.matchMedia('(pointer: fine)').matches
    if (touch) {
      const onScroll = () => {
        const range = Math.min(360, window.innerHeight * 0.45)
        setFallbackProgress(Math.min(1, Math.max(0, window.scrollY / range)))
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    } else {
      const onEnter = () => setIsHovered(true)
      const onLeave = () => setIsHovered(false)

      wrap.addEventListener('mouseenter', onEnter)
      wrap.addEventListener('mouseleave', onLeave)

      return () => {
        wrap.removeEventListener('mouseenter', onEnter)
        wrap.removeEventListener('mouseleave', onLeave)
      }
    }
  }, [fallbackMode, wave])

  const isRight = name === 'right' || name === 'tejas'
  const isTouchFallback = fallbackMode && (wave || (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches))

  return (
    <div ref={wrapRef} className="relative w-full h-auto select-none pointer-events-auto">
      {/* ── Base Monochrome Artwork (Renders immediately) ────────────────── */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={loading}
        fetchPriority={fetchPriority}
        className={className}
        sizes={sizes}
        style={{ width: '100%', height: 'auto' }}
      />

      {/* ── WebGL Shader Reveal Canvas ───────────────────────────────────── */}
      <canvas
        ref={glRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ visibility: 'hidden' }}
      />

      {/* ── Graceful Fallback: Layered Image Opacity (if WebGL unavailable) ─ */}
      {fallbackMode && (
        <div
          aria-hidden="true"
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: isTouchFallback ? fallbackProgress : (isHovered ? 1 : 0),
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={paintedSrc}
            alt=""
            width={isRight ? 1284 : width}
            height={isRight ? 1284 : height}
            className={className}
            style={
              isRight
                ? {
                    width: `${(1284 / 1166) * 100}%`,
                    height: `${(1284 / 1166) * 100}%`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                  }
                : { width: '100%', height: 'auto' }
            }
          />
        </div>
      )}
    </div>
  )
}
