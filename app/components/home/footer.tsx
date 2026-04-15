"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from '../ui/Markers'

export default function Footer() {
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null)

  const handleCopy = (type: 'email', value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <>
      {/* ── Let's Work Together CTA ────────────────────────── */}
      <div className="max-w-5xl mx-auto mt-10 mb-6 border border-gray-200 px-6 md:px-10 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-visible">
        <Plus h="left" v="top" />
        <Plus h="right" v="top" />
        <Plus h="left" />
        <Plus h="right" />

        <div>
          <p
            className="text-[10px] uppercase tracking-widest text-gray-400 mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Let&apos;s Work Together
          </p>
          <Image
            src="/images/common/sa26.svg"
            alt="Varun"
            width={56}
            height={56}
            className="w-12 h-12 mb-4 opacity-80"
          />
          <h3
            className="text-3xl md:text-4xl font-light text-gray-900 leading-snug"
            style={{ fontFamily: 'Garamond, Georgia, serif' }}
          >
            Great products happen<br />when the right people meet.
          </h3>
          <p
            className="text-sm text-gray-400 mt-3 max-w-md"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            If you&apos;re building something and need a designer who goes all in, let&apos;s talk.
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => handleCopy('email', 'bvarungupta@gmail.com')}
            className="w-full flex items-center gap-3 px-5 py-3 border border-gray-900 text-gray-900 text-xs tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m2 7 10 7 10-7"/>
            </svg>
            {copied === 'email' ? 'Copied!' : 'bvarungupta@gmail.com'}
          </button>
          <a
            href="https://linkedin.com/in/bvarungupta"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-5 py-3 border border-gray-200 text-gray-500 text-xs tracking-wide hover:border-gray-400 hover:text-gray-700 transition-colors duration-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p
            className="text-gray-300 text-xs"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            &copy; {new Date().getFullYear()} Varun Gupta. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { href: 'https://linkedin.com/in/bvarungupta', src: '/images/HomeImages/social/linkedin.svg',  alt: 'LinkedIn'  },
              { href: 'https://behance.net/bvarungupta',     src: '/images/HomeImages/social/behance.svg',   alt: 'Behance'   },
              { href: 'https://dribbble.com/bvarungupta',         src: '/images/HomeImages/social/dribbble.svg',  alt: 'Dribbble'  },
            ].map((s) => (
              <Link key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={20}
                  height={20}
                  className="opacity-30 hover:opacity-60 transition-opacity duration-200"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
