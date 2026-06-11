"use client"

import { useState, useEffect } from "react"
import WelcomeScene from "./components/welcome/WelcomeScene"
import HomePortfolio from "./components/home/HomePortfolio"
import Loader from "./components/layout/Loader"
import { DISABLE_WELCOME } from "./lib/welcomeConfig"

export default function PortfolioPage() {
  const [stage, setStage] = useState<'welcome' | 'fade-out' | 'portfolio'>(
    DISABLE_WELCOME ? 'portfolio' : 'welcome'
  )

  useEffect(() => {
    if (DISABLE_WELCOME) {
      return
    }

    // Check if welcome is already shown in this session
    const hasShown = sessionStorage.getItem('welcome-shown')
    if (hasShown === 'true') {
      setStage('portfolio')
      // Immediately notify other components (e.g. Navbar) that welcome is done
      window.dispatchEvent(new Event('welcome-finished'))
      return
    }

    const timer1 = setTimeout(() => {
      setStage('fade-out')
    }, 2000)

    const timer2 = setTimeout(() => {
      sessionStorage.setItem('welcome-shown', 'true')
      setStage('portfolio')
      window.dispatchEvent(new Event('welcome-finished'))
    }, 2300)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#05070b]">
      {/* Welcome Screen Overlay */}
      {stage !== 'portfolio' && (
        <div
          className={`transition-opacity duration-300 ${
            stage === 'fade-out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <WelcomeScene />
        </div>
      )}

      {/* Portfolio Content */}
      {stage === 'portfolio' && (
        <>
          <Loader />
          <div className="animate-crossfade-in">
            <HomePortfolio />
          </div>
        </>
      )}
    </div>
  )
}
