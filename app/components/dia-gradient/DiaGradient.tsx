"use client";

// Dia Browser's signature gradient — a self-contained drop-in.
//
// A row of N tall, heavily-blurred columns share one vertical rainbow gradient
// and are arranged in a symmetric bell curve (short at the edges, tallest in the
// middle). The whole field is anchored to the bottom.

import { useEffect, useRef, useState } from "react";

export type Stop = { offset: number; color: string };
export type GradientTheme = "dia" | "ocean" | "sunset" | "neon" | "pastel" | "monochrome";

// Dia's stops & preset color themes
export const GRADIENT_THEMES: Record<GradientTheme, Stop[]> = {
  dia: [
    { offset: 0, color: "#0358F7" },
    { offset: 0.22, color: "#5092C7" },
    { offset: 0.40, color: "#E1ECFE" },
    { offset: 0.58, color: "#FFD400" },
    { offset: 0.70, color: "#FA3D1D" },
    { offset: 0.85, color: "#FD02F5" },
    { offset: 1, color: "#FD02F500" },
  ],
  ocean: [
    { offset: 0, color: "#2563EB" },
    { offset: 0.28, color: "#38BDF8" },
    { offset: 0.55, color: "#5EEAD4" },
    { offset: 0.75, color: "#A78BFA" },
    { offset: 0.90, color: "#C084FC" },
    { offset: 1, color: "#C084FC00" },
  ],
  sunset: [
    { offset: 0, color: "#1a0b2e" },
    { offset: 0.2, color: "#4c1d95" },
    { offset: 0.4, color: "#c026d3" },
    { offset: 0.6, color: "#f97316" },
    { offset: 0.8, color: "#facc15" },
    { offset: 1, color: "#fffbeb00" },
  ],
  neon: [
    { offset: 0, color: "#020617" },
    { offset: 0.25, color: "#1d4ed8" },
    { offset: 0.5, color: "#06b6d4" },
    { offset: 0.75, color: "#10b981" },
    { offset: 0.9, color: "#a7f3d0" },
    { offset: 1, color: "#ecfdf500" },
  ],
  pastel: [
    { offset: 0, color: "#331832" },
    { offset: 0.25, color: "#694f8e" },
    { offset: 0.5, color: "#b68cb8" },
    { offset: 0.75, color: "#f7c5cc" },
    { offset: 0.9, color: "#fbf3d5" },
    { offset: 1, color: "#ffffff00" },
  ],
  monochrome: [
    { offset: 0, color: "#09090b" },
    { offset: 0.3, color: "#27272a" },
    { offset: 0.6, color: "#71717a" },
    { offset: 0.85, color: "#e4e4e7" },
    { offset: 1, color: "#ffffff00" },
  ],
};

const VBW = 1271;
const VBH = 599;

// Height curve fitted to the real Dia footer: a gentle power falloff (not a
// cosine bell), giving the flatter, pyramid-like rise of the original.
function bellHeights(n: number, peak: number, valley: number): number[] {
  const out: number[] = [];
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid; // 0 center → 1 edge
    const eased = 1 - Math.pow(t, 1.24); // 1 at center → 0 at edge
    out.push(peak * VBH * (valley + (1 - valley) * eased));
  }
  return out;
}

export function DiaGradient({
  bars = 15,
  blur = 13,
  peak = 1.0,
  valley = 0.32,
  theme = "dia",
  stops,
  reveal = "none",
  riseMs = 1100,
  opacity = 0.88,
}: {
  bars?: number;
  blur?: number;
  peak?: number;
  valley?: number;
  theme?: GradientTheme;
  stops?: Stop[];
  reveal?: "mount" | "scroll" | "none";
  riseMs?: number;
  opacity?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scaleY, setScaleY] = useState(reveal === "none" ? 1 : 0);

  const activeStops = stops ?? GRADIENT_THEMES[theme] ?? GRADIENT_THEMES.dia;

  useEffect(() => {
    if (reveal === "none") {
      setScaleY(1);
      return;
    }

    if (reveal === "mount") {
      setScaleY(0);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setScaleY(1)),
      );
      return () => cancelAnimationFrame(id);
    }

    // reveal === "scroll"
    let ticking = false;
    const measure = () => {
      ticking = false;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const distanceEntered = vh - r.top;
      const progress = Math.max(0, Math.min(1, distanceEntered / 220));
      setScaleY(progress);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reveal]);

  const heights = bellHeights(bars, peak, valley);
  const colW = VBW / bars;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      style={{
        height: "100%",
        width: "100%",
        transformOrigin: "bottom",
        transform: `scaleY(${scaleY})`,
        transition: reveal === "mount" ? `transform ${riseMs}ms cubic-bezier(0.16, 1, 0.3, 1)` : undefined,
        willChange: "transform",
        opacity,
      }}
    >
      <svg
        style={{ height: "100%", width: "100%" }}
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dia-grad" x1="0" y1="1" x2="0" y2="0">
            {activeStops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id="dia-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
        {heights.map((h, i) => (
          <g key={i} filter="url(#dia-blur)">
            <rect
              x={i * colW}
              y={VBH - h}
              width={colW * 1.23}
              height={h}
              fill="url(#dia-grad)"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
