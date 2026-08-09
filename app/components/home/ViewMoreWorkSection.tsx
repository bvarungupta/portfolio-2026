"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const Plus = ({ h, v }: { h: 'left' | 'right'; v: 'top' | 'bottom' }) => (
  <span
    className="absolute select-none pointer-events-none"
    style={{
      [h]: 0, [v]: 0,
      transform: `translate(${h === 'left' ? '-50%' : '50%'}, ${v === 'top' ? 'calc(-50% - 1px)' : '50%'})`,
      fontFamily: 'monospace', fontSize: '16px', lineHeight: 1, color: '#9ca3af', zIndex: 10,
    }}
  >+</span>
)

const ArrowIcon = () => (
  <svg
    className="transition-transform group-hover:translate-x-1"
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#6b7280"
  >
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
  </svg>
)

export default function ViewMoreWorkSection() {
  const [hovered, setHovered] = useState(false)
  const hoveredRef = useRef(false)
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  useEffect(() => {
    const update = () => {
      const deg = Math.min(window.scrollY / 60, 8)
      const isHovered = hoveredRef.current
      if (leftRef.current)
        leftRef.current.style.transform = `translateX(${isHovered ? -28 : 0}px) rotate(-${deg}deg)`
      if (rightRef.current)
        rightRef.current.style.transform = `translateX(${isHovered ? 28 : 0}px) rotate(-${deg}deg)`
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const deg = Math.min(window.scrollY / 60, 8)
    if (leftRef.current)
      leftRef.current.style.transform = `translateX(${hovered ? -28 : 0}px) rotate(-${deg}deg)`
    if (rightRef.current)
      rightRef.current.style.transform = `translateX(${hovered ? 28 : 0}px) rotate(-${deg}deg)`
  }, [hovered])

  return (
    <div
      className="flex justify-center items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left branch */}
      <div
        ref={leftRef}
        style={{
          width: '140px', height: '75px', position: 'relative', flexShrink: 0,
          marginRight: '-65px', zIndex: 1,
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <img
          src="/images/HomeImages/branch.svg"
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            height: '160px', width: 'auto',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            filter: 'brightness(0) opacity(0.75)',
          }}
        />
      </div>

      {/* Button wrapper */}
      <div style={{
        position: 'relative', zIndex: 2, flexShrink: 0,
        boxShadow: hovered ? '0 4px 20px 0px rgba(30, 120, 60, 0.28)' : '0 2px 14px 0px rgba(30, 120, 60, 0)',
        transition: 'box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      }}>
        <Link
          href="/work"
          className="group relative border border-[#e5e7eb] bg-white cursor-pointer transition-colors duration-300 flex items-center px-6 py-3 gap-2"
          style={{
            fontFamily: 'FunnelDisplay, sans-serif',
            overflow: 'visible',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Plus h="left"  v="top" />
          <Plus h="right" v="top" />
          <Plus h="left"  v="bottom" />
          <Plus h="right" v="bottom" />

          <span className="text-sm md:text-base text-gray-500 select-none whitespace-nowrap">
            View more work
          </span>
          <ArrowIcon />
        </Link>
      </div>

      {/* Right branch — mirrored */}
      <div
        ref={rightRef}
        style={{
          width: '140px', height: '75px', position: 'relative', flexShrink: 0,
          marginLeft: '-65px', zIndex: 1,
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <img
          src="/images/HomeImages/branch.svg"
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            height: '160px', width: 'auto',
            transform: 'translate(-50%, -50%) rotate(90deg)',
            filter: 'brightness(0) opacity(0.75)',
          }}
        />
      </div>
    </div>
  )
}
