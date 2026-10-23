"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

export interface SplitNavMenuItem {
  name: string
  href: string
  icon?: string
  external?: boolean
}

interface SplitNavMenuProps {
  isOpen: boolean
  onClose: () => void
  items: SplitNavMenuItem[]
  pathname: string
  onNavigate: (item: SplitNavMenuItem) => void
  isDarkPage?: boolean
}

const desktopSocialLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/bvarungupta",
    icon: "/images/HomeImages/linkedin.svg",
    color: "#0077b5",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918790129593",
    icon: "/images/ToolsIcons/whatsapp.svg",
    color: "#25D366",
  },
  {
    label: "Behance",
    href: "https://behance.net/bvarungupta",
    icon: "/images/HomeImages/behance.svg",
    color: "#0057ff",
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/bvarungupta",
    icon: "/images/HomeImages/dribbble.svg",
    color: "#ea4c89",
  },
  {
    label: "Figma",
    href: "https://figma.com/@bvarungupta",
    icon: "/images/ToolsIcons/figma-icon.svg",
    color: "#f24e1e",
  },
  {
    label: "Medium",
    href: "https://medium.com/@bvarungupta",
    icon: "/images/HomeImages/medium.svg",
    color: "#000000",
  },
]

const mobileSocialLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/bvarungupta",
    icon: "/images/HomeImages/linkedin.svg",
    color: "#0077b5",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/itsvaruuuun?igsh=MXQ4aGx5ZjNwbnF0cA==",
    icon: "/images/HomeImages/instagram.svg",
    color: "#e1306c",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918790129593",
    icon: "/images/ToolsIcons/whatsapp.svg",
    color: "#25D366",
  },
]

export default function SplitNavMenu({
  isOpen,
  onClose,
  items,
  pathname,
  onNavigate,
  isDarkPage = false,
}: SplitNavMenuProps) {
  const shouldReduceMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  // Prevent background scrolling while menu is open
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis
    if (lenis) {
      lenis.stop()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      if (lenis) {
        lenis.start()
      }
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  const isItemActive = (item: SplitNavMenuItem) => {
    if (item.name === "Home") return pathname === "/"
    if (item.name === "Work") return pathname === "/work" || pathname.startsWith("/works/")
    if (item.name === "About") return pathname === "/about"
    return pathname === item.href
  }

  const panelVariants = {
    hidden: {
      x: shouldReduceMotion ? 0 : "100%",
      opacity: shouldReduceMotion ? 0 : 1,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.45,
        ease: [0.32, 0.72, 0, 1] as const,
      },
    },
    exit: {
      x: shouldReduceMotion ? 0 : "100%",
      opacity: shouldReduceMotion ? 0 : 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.35,
        ease: [0.32, 0.72, 0, 1] as const,
      },
    },
  }

  const linkVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.16 + i * 0.045,
        duration: shouldReduceMotion ? 0.15 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
      transition: { duration: 0.15 },
    },
  }

  const bottomVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.16 + items.length * 0.045 + 0.04,
        duration: shouldReduceMotion ? 0.15 : 0.35,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 6,
      transition: { duration: 0.12 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10010] pointer-events-auto">
          {/* Subtle dimming backdrop over the left viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] cursor-pointer"
            aria-hidden="true"
          />

          {/* Split-screen right panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute top-0 right-0 bottom-0 h-full w-full md:w-1/2 lg:w-[48%] xl:w-[45%] flex flex-col justify-between overflow-y-auto px-6 sm:px-10 md:px-14 shadow-2xl border-l transition-colors duration-300 ${
              isDarkPage
                ? "bg-[#0b0c10] border-zinc-800 text-white"
                : "bg-[#fafafa] border-zinc-200/90 text-zinc-900"
            }`}
            style={{
              paddingTop: "max(1.75rem, env(safe-area-inset-top, 1.75rem))",
              paddingBottom: "max(1.75rem, env(safe-area-inset-bottom, 1.75rem))",
            }}
          >
            {/* Main navigation links — aligned toward the bottom half on mobile with balanced spacing above contact */}
            <nav className="flex-1 flex flex-col justify-end pb-8 sm:pb-10 md:justify-center md:py-8 md:pb-0">
              <ul className="flex flex-col gap-1 sm:gap-1.5 md:gap-1.5 lg:gap-2">
                {items.map((item, index) => {
                  const active = isItemActive(item)
                  const isHovered = hoveredIndex === index
                  const hasOtherHovered = hoveredIndex !== null && !isHovered

                  return (
                    <motion.li
                      key={item.name}
                      custom={index}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="group flex items-center text-left w-fit cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 rounded-sm py-0.5"
                          style={{
                            opacity: hasOtherHovered ? 0.35 : 1,
                          }}
                        >
                          {/* Large typography title with restrained editorial hover shift */}
                          <span
                            className={`text-[clamp(3.25rem,13vw,4.5rem)] md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] transition-all duration-300 ${
                              isDarkPage
                                ? "text-zinc-100 group-hover:text-orange-500 group-hover:translate-x-2"
                                : "text-zinc-900 group-hover:text-orange-500 group-hover:translate-x-2"
                            }`}
                            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                          >
                            {item.name}
                          </span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            onNavigate(item)
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          className="group flex items-center text-left w-fit cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 rounded-sm py-0.5"
                          style={{
                            opacity: hasOtherHovered ? 0.35 : 1,
                          }}
                        >
                          {/* Active dot indicator */}
                          {active && (
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-3.5 shrink-0 self-center"
                              aria-hidden="true"
                            />
                          )}

                          {/* Large typography title with restrained editorial hover shift */}
                          <span
                            className={`text-[clamp(3.25rem,13vw,4.5rem)] md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] transition-all duration-300 ${
                              active
                                ? "text-orange-500"
                                : isDarkPage
                                  ? "text-zinc-100 group-hover:text-orange-500 group-hover:translate-x-2"
                                  : "text-zinc-900 group-hover:text-orange-500 group-hover:translate-x-2"
                            }`}
                            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                          >
                            {item.name}
                          </span>
                        </button>
                      )}
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            {/* Bottom section: contact info and social links */}
            <motion.div
              variants={bottomVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="shrink-0 pt-5 sm:pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-4 sm:gap-5 mt-auto"
            >
              {/* Email / Contact */}
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest text-zinc-400 font-sans mb-1"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Get in touch
                </p>
                <a
                  href="mailto:bvarungupta@gmail.com"
                  className={`text-sm sm:text-base font-light transition-colors duration-200 hover:text-orange-500 ${
                    isDarkPage ? "text-zinc-300" : "text-zinc-700"
                  }`}
                  style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                >
                  bvarungupta@gmail.com
                </a>
              </div>

              {/* Mobile social links: strictly LinkedIn, Instagram, WhatsApp */}
              <div
                className="flex md:hidden items-center gap-x-8 sm:gap-x-10 text-sm font-light"
                style={{ fontFamily: "FunnelDisplay, sans-serif" }}
              >
                {mobileSocialLinks.map((l) => {
                  const isHovered = hoveredSocial === l.label
                  const activeColor = l.color

                  return (
                    <div key={l.label} className="relative">
                      {/* Floating hover sticker matching footer */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "24px",
                          left: "50%",
                          transform: `translateX(-50%) rotate(${isHovered ? "12deg" : "-15deg"}) scale(${isHovered ? 1.05 : 0.1})`,
                          opacity: isHovered ? 1 : 0,
                          transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease",
                          pointerEvents: "none",
                          zIndex: 20,
                        }}
                      >
                        <Image
                          src={l.icon}
                          alt=""
                          width={26}
                          height={26}
                          className="w-[26px] h-[26px] max-w-none block"
                        />
                      </div>

                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setHoveredSocial(l.label)}
                        onMouseLeave={() => setHoveredSocial(null)}
                        className="text-sm font-light tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 rounded-sm"
                        style={{
                          fontFamily: "FunnelDisplay, sans-serif",
                          color: isHovered ? activeColor : isDarkPage ? "#a1a1aa" : "#374151",
                        }}
                      >
                        {l.label}
                      </a>
                    </div>
                  )
                })}
              </div>

              {/* Desktop social links: all 6 links with generous horizontal spacing */}
              <div
                className="hidden md:flex items-center gap-x-6 lg:gap-x-8 xl:gap-x-9 text-sm font-light flex-wrap"
                style={{ fontFamily: "FunnelDisplay, sans-serif" }}
              >
                {desktopSocialLinks.map((l) => {
                  const isHovered = hoveredSocial === l.label
                  const activeColor = l.color

                  return (
                    <div key={l.label} className="relative">
                      {/* Floating hover sticker matching footer */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "24px",
                          left: "50%",
                          transform: `translateX(-50%) rotate(${isHovered ? "12deg" : "-15deg"}) scale(${isHovered ? 1.05 : 0.1})`,
                          opacity: isHovered ? 1 : 0,
                          transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease",
                          pointerEvents: "none",
                          zIndex: 20,
                        }}
                      >
                        <Image
                          src={l.icon}
                          alt=""
                          width={26}
                          height={26}
                          className="w-[26px] h-[26px] max-w-none block"
                        />
                      </div>

                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => setHoveredSocial(l.label)}
                        onMouseLeave={() => setHoveredSocial(null)}
                        className="text-sm font-light tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 rounded-sm"
                        style={{
                          fontFamily: "FunnelDisplay, sans-serif",
                          color: isHovered
                            ? isDarkPage && activeColor === "#000000"
                              ? "#ffffff"
                              : activeColor
                            : isDarkPage
                              ? "#a1a1aa"
                              : "#374151",
                        }}
                      >
                        {l.label}
                      </a>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
