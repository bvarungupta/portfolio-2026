"use client"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const Navbar = dynamic(() => import("./navbar"), { ssr: false })

export default function NavbarClient() {
  const pathname = usePathname()
  if (pathname === '/') return null
  if (pathname?.startsWith('/proposals')) return null
  return <Navbar />
}
