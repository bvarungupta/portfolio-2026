"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
}

export interface SocialCardsProps {
  cards?: CardItem[];
  className?: string;
}

const MAX_VISIBLE = 7;

const FAN_POSITIONS = [
  { rot: -20,   scale: 0.80, x: -18,   y: 4.5, zIndex: 1 },
  { rot: -13.5, scale: 0.86, x: -12.5, y: 2.5, zIndex: 2 },
  { rot: -7,    scale: 0.93, x: -6.5,  y: 0.8, zIndex: 3 },
  { rot: 0,     scale: 1.0,  x: 0,     y: 0.0, zIndex: 10 },
  { rot: 7,     scale: 0.93, x: 6.5,   y: 0.8, zIndex: 3 },
  { rot: 13.5,  scale: 0.86, x: 12.5,  y: 2.5, zIndex: 2 },
  { rot: 20,    scale: 0.80, x: 18,    y: 4.5, zIndex: 1 },
];

export const DEMO_CARDS: CardItem[] = [
  { imgUrl: "/images/about/beach.jpg", alt: "Beach" },
  { imgUrl: "/images/about/concert.jpg", alt: "Concert" },
  { imgUrl: "/images/about/books.jpeg", alt: "Books" },
  { imgUrl: "/images/about/varun.jpg", alt: "Varun Gupta" },
  { imgUrl: "/images/about/harbor.jpg", alt: "Harbor" },
  { imgUrl: "/images/about/imax.jpg", alt: "IMAX Cinema" },
  { imgUrl: "/images/about/ps.jpeg", alt: "PlayStation" },
];

function getResponsiveMultiplier(width: number) {
  if (width < 360) return 0.38;
  if (width < 400) return 0.44;
  if (width < 480) return 0.52;
  if (width < 640) return 0.66;
  if (width < 768) return 0.80;
  if (width < 1024) return 0.90;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 400) idealPx = 11.5 * 16;
  else if (width < 480) idealPx = 13 * 16;
  else if (width < 640) idealPx = 15.5 * 16;
  else if (width < 768) idealPx = 18 * 16;
  else if (width < 1024) idealPx = 20 * 16;
  else idealPx = 23 * 16;

  if (typeof window === "undefined") return 1;
  const available = window.innerHeight * 0.6;
  const ratio = available / idealPx;
  if (width < 480) return Math.min(0.85, Math.max(0.65, ratio));
  if (available >= idealPx) return 1;
  return Math.max(0.7, ratio);
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 20,
    scale: 1.0 - 0.20 * absDistance * absDistance,
    x: distance * 18,
    y: absDistance * absDistance * 4.5,
    zIndex: 10 - Math.abs(slot - center),
  };
}

export default function SocialCards({ cards = DEMO_CARDS, className }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);

  // Take up to MAX_VISIBLE cards for the fan arc
  const displayCards = cards.slice(0, MAX_VISIBLE);
  const totalCards = displayCards.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const config = (slot: number) => getSlotConfig(totalCards, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const onCardDone = () => {
      if (++completedCount >= totalCards) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    // Entrance Animation
    cardElements.forEach((card, slot) => {
      const { x, y, rot, scale, zIndex } = config(slot);
      const target = {
        x: `${x * multiplier}rem`,
        y: `${y * hMult}rem`,
        rotation: rot,
        scale,
        opacity: 1,
        zIndex,
      };

      if (isFirstMount) {
        gsap.set(card, { x: 0, y: `${10 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
        gsap.to(card, {
          ...target,
          duration: 1.2,
          ease: "elastic.out(1.05,.78)",
          delay: 0.15 + slot * 0.05,
          onComplete: onCardDone,
        });
      } else {
        gsap.to(card, { ...target, duration: 0.4, ease: "power2.out" });
      }
    });

    // Hover spread interactions
    const visibleEntries: { el: HTMLElement; slot: number }[] = cardElements.map((el, slot) => ({ el, slot }));
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: NodeJS.Timeout | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.0 * hM;
            targetScale *= 1.1;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 4.8 * (1 - 0.3 * Math.abs(normalized)) * (1 + 0.15 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 2.5 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 2.5 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 0.8 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 0.8 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
        });
        gsap.set(el, { zIndex: hoveredSlot === slot ? 25 : base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    // Touch and click support for mobile screens
    const clickHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot === slot) {
          activeSlot = null;
          updateHoverLayout(null);
        } else {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("click", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    // Dismiss active card on tap outside
    const onPointerDownOutside = (e: PointerEvent) => {
      if (container && !container.contains(e.target as Node)) {
        if (activeSlot !== null) {
          activeSlot = null;
          updateHoverLayout(null);
        }
      }
    };
    document.addEventListener("pointerdown", onPointerDownOutside);

    let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      clickHandlers.forEach(({ el, handler }) => el.removeEventListener("click", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("pointerdown", onPointerDownOutside);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [totalCards]);

  if (!totalCards) return null;

  return (
    <section className={cn("flex flex-col items-center w-full py-0 px-2 sm:px-4 md:px-8 relative z-20 select-none overflow-x-clip", className)}>
      <div className="flex items-center justify-center w-full max-w-[80rem]">
        <div
          ref={containerRef}
          className="fan-layout relative flex justify-center items-center w-full h-[15rem] min-[390px]:h-[16.5rem] sm:h-[18.5rem] md:h-[21rem] lg:h-[22.5rem] touch-pan-y"
        >
          {displayCards.map((card, index) => {
            const cardContent = (
              <div className="relative w-full h-full overflow-hidden rounded-xl md:rounded-2xl border-[2px] border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-neutral-100">
                <img
                  src={card.imgUrl}
                  loading="lazy"
                  alt={card.alt || `Card ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              </div>
            );

            const commonClasses =
              "fan-card absolute left-1/2 top-[42%] sm:top-[44%] md:top-[46%] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6.4rem] h-[8.9rem] min-[390px]:w-[7.2rem] min-[390px]:h-[10rem] min-[480px]:w-[8.2rem] min-[480px]:h-[11.4rem] sm:w-[9.6rem] sm:h-[13.4rem] md:w-[11rem] md:h-[15.2rem] lg:w-[12.4rem] lg:h-[17.2rem] cursor-pointer will-change-transform touch-manipulation";

            return card.linkUrl ? (
              <a
                key={index}
                href={card.linkUrl}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={cn(commonClasses, "block")}
              >
                {cardContent}
              </a>
            ) : (
              <div key={index} className={commonClasses}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
