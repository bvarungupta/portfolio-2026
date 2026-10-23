"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { useColumnBlinds } from "./ColumnBlindsTransition"
import SplitNavMenu, { SplitNavMenuItem } from "./SplitNavMenu"

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin)

const splitNavItems: SplitNavMenuItem[] = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  {
    name: "Resume",
    href: "https://drive.google.com/file/d/1gVS7dO5vmJz11-2KYrHCzc8IlHcqFIwP/view?usp=drive_link",
    external: true,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const { navigateWithBlinds, prefetchWithBlinds } = useColumnBlinds()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuButtonHovered, setIsMenuButtonHovered] = useState(false)

  const isDarkPage = pathname === "/lab/specimen"

  // Idle prefetch for primary destinations (/work, /about, /lab)
  useEffect(() => {
    const idlePrefetch = () => {
      const targets = ["/work", "/about", "/lab"]
      targets.forEach((route) => {
        if (route !== pathname) {
          prefetchWithBlinds(route)
        }
      })
    }

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const id = (
          window as unknown as {
            requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number
          }
        ).requestIdleCallback(idlePrefetch, { timeout: 3000 })
        return () =>
          (
            window as unknown as {
              cancelIdleCallback: (id: number) => void
            }
          ).cancelIdleCallback(id)
      } else {
        const timer = setTimeout(idlePrefetch, 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [pathname, prefetchWithBlinds])

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: {
        y: 0,
        offsetY: 0,
      },
      ease: "power2.inOut",
    })
  }

  const scrollToExplorationsSection = () => {
    const explorationsSection =
      document.querySelector('[data-section="visual-explorations"]') ||
      document.querySelector("#visual-explorations") ||
      Array.from(document.querySelectorAll("h2"))
        .find((el) => el.textContent?.toLowerCase().includes("explorations"))
        ?.closest("div")

    if (explorationsSection) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: explorationsSection,
          offsetY: 60,
        },
        ease: "power2.inOut",
      })
    }
  }

  const navigateWithTransition = (href: string, callback?: () => void) => {
    navigateWithBlinds(href, callback)
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
    if (pathname !== "/") {
      navigateWithTransition("/")
    } else {
      scrollToTop()
    }
  }

  const handleSplitNavNavigate = (item: SplitNavMenuItem) => {
    setIsMenuOpen(false)

    if (item.name === "Exploration" || item.name === "Explorations") {
      if (pathname === "/") {
        scrollToExplorationsSection()
      } else {
        navigateWithTransition("/", () => {
          setTimeout(() => {
            scrollToExplorationsSection()
          }, 500)
        })
      }
    } else if (item.name === "About") {
      navigateWithTransition("/about")
    } else if (item.name === "Home") {
      if (pathname !== "/") {
        navigateWithTransition("/")
      } else {
        scrollToTop()
      }
    } else {
      if (pathname !== item.href) {
        navigateWithTransition(item.href)
      }
    }
  }

  // Route change reset
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* ── Top-Left Floating Logo (mix-blend-mode: difference, 0.75x mobile, full desktop) ── */}
      <button
        type="button"
        onClick={handleLogoClick}
        onMouseEnter={() => {
          if (pathname !== "/") prefetchWithBlinds("/")
        }}
        aria-label="Varun Gupta Portfolio — Home"
        className="fixed z-[10020] top-[max(20px,env(safe-area-inset-top))] left-[max(20px,env(safe-area-inset-left))] md:top-8 md:left-10 cursor-pointer w-11 h-11 md:w-14 md:h-14 flex items-center justify-center p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 rounded-sm group transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{
          mixBlendMode: "difference",
        }}
      >
        <svg
          viewBox="0 0 720 865"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[22.5px] h-auto md:w-[36px] pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M392.186 106.521C376.916 99.1653 359.205 110.292 359.205 127.242V392.859C359.205 410.521 340.123 421.592 324.79 412.826L281.325 387.978C149.674 312.285 65.5666 174.616 57.8063 22.9991C57.157 10.3132 46.921 0 34.2184 0H23C10.2975 0 0 10.2975 0 23V391.158C0 518.364 73.1125 636.029 189.139 691.682L327.814 758.48C343.084 765.835 360.795 754.708 360.795 737.758V472.142C360.795 454.48 379.876 443.409 395.21 452.174L438.675 477.022C570.326 552.715 654.433 690.384 662.194 842.001C662.843 854.687 673.079 865 685.782 865H697C709.703 865 720 854.703 720 842V473.842C720 346.636 646.888 228.971 530.861 173.318L392.186 106.521Z"
            fill="#ffffff"
          />
        </svg>
      </button>

      {/* ── Top-Right Floating Hamburger & Morphing Close Icon (mix-blend-mode: difference, 0.75x mobile, full desktop) ── */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        onMouseEnter={() => setIsMenuButtonHovered(true)}
        onMouseLeave={() => setIsMenuButtonHovered(false)}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        className="fixed z-[10020] top-[max(20px,env(safe-area-inset-top))] right-[max(20px,env(safe-area-inset-right))] md:top-8 md:right-10 cursor-pointer w-11 h-11 md:w-14 md:h-14 flex items-center justify-center p-2 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500"
        style={{
          mixBlendMode: "difference",
        }}
      >
        <div
          className="relative w-[22.5px] h-[22.5px] md:w-[36px] md:h-[36px] flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: isMenuOpen && isMenuButtonHovered ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {/* Top Line */}
          <span
            className={`absolute h-[1.75px] md:h-[2.5px] w-[22.5px] md:w-[36px] bg-white rounded-full transition-all duration-300 ease-out pointer-events-none ${
              isMenuOpen
                ? "translate-y-0 rotate-45"
                : "-translate-y-[3.75px] md:-translate-y-[6px] rotate-0"
            }`}
            style={{
              transformOrigin: "center",
            }}
          />
          {/* Bottom Line */}
          <span
            className={`absolute h-[1.75px] md:h-[2.5px] w-[22.5px] md:w-[36px] bg-white rounded-full transition-all duration-300 ease-out pointer-events-none ${
              isMenuOpen
                ? "translate-y-0 -rotate-45"
                : "translate-y-[3.75px] md:translate-y-[6px] rotate-0"
            }`}
            style={{
              transformOrigin: "center",
            }}
          />
        </div>
      </button>

      {/* ── Animated Split-Screen Navigation Overlay ── */}
      <SplitNavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={splitNavItems}
        pathname={pathname}
        onNavigate={handleSplitNavNavigate}
        isDarkPage={isDarkPage}
      />
    </>
  )
}
