"use client"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { DISABLE_WELCOME } from "../../lib/welcomeConfig"

const Navbar = dynamic(() => import("./navbar"), { ssr: false })

export default function NavbarClient() {
  const pathname = usePathname()
  const [welcomeActive, setWelcomeActive] = useState(!DISABLE_WELCOME)

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

  if (pathname === '/' && welcomeActive) return null
  if (pathname?.startsWith('/proposals')) return null
  return <Navbar />
}
