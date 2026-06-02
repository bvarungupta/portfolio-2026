"use client";

import { useEffect, useMemo, useRef } from "react";

type AudioPool = {
  nextIndex: number;
  clips: HTMLAudioElement[];
};

function makeAudioPool(url: string, poolSize: number, volume: number): AudioPool {
  const clips = Array.from({ length: poolSize }, () => {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.volume = volume;
    return audio;
  });

  return { nextIndex: 0, clips };
}

export function VisualExplorationsSound({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const clickUrls = useMemo(() => ["/sounds/clickDown.mp3", "/sounds/clickUp.mp3"], []);

  const clickPoolsRef = useRef<AudioPool[] | null>(null);
  const lastPointerDownAtRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    clickPoolsRef.current = clickUrls.map((url) => makeAudioPool(url, 4, 0.35));

    const onPointerDown = (event: PointerEvent) => {
      if (typeof (event as unknown as MouseEvent).button === "number") {
        const button = (event as unknown as MouseEvent).button;
        if (button !== 0) return;
      }

      const now = performance.now();
      if (now - lastPointerDownAtRef.current < 25) return;
      lastPointerDownAtRef.current = now;

      const pools = clickPoolsRef.current;
      if (!pools || pools.length === 0) return;

      const pool = pools[Math.floor(Math.random() * pools.length)];
      const audio = pool.clips[pool.nextIndex];
      pool.nextIndex = (pool.nextIndex + 1) % pool.clips.length;

      try {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {
      }
    };

    container.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      container.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, [clickUrls, containerRef]);

  return null;
}
