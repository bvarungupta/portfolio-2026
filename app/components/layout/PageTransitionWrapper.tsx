"use client";
import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

declare global {
  interface Window {
    exitPage?: (callback?: () => void) => void;
  }
}

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  isWorkPage?: boolean;
}

export default function PageTransitionWrapper({ children, isWorkPage = false }: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isWorkPage) {
      gsap.fromTo(containerRef.current,
        { y: '100vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          onComplete: () => {
            window.dispatchEvent(new CustomEvent("page-transition-complete"));
          },
        }
      );
    } else {
      gsap.fromTo(containerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            window.dispatchEvent(new CustomEvent("page-transition-complete"));
          },
        }
      );
    }
  }, [pathname, isWorkPage]);

  // ✅ Use useCallback to prevent dependency issues
  const exitPage = useCallback((callback?: () => void) => {
    if (!containerRef.current) return;

    if (isWorkPage) {
      gsap.to(containerRef.current, {
        y: '100vh',
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
        onComplete: callback
      });
    } else {
      gsap.to(containerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: callback
      });
    }
  }, [isWorkPage]);

  // ✅ Now exitPage won't change on every render
  useEffect(() => {
    window.exitPage = exitPage;
  }, [exitPage]);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}