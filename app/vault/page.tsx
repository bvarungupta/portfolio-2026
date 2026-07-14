"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { mediaList } from "./mediaList";

// Lazy-load the InfiniteCanvas with SSR disabled since it uses WebGL/Three.js
const InfiniteCanvas = dynamic(
  () => import("@/app/components/infinite-canvas").then((mod) => mod.InfiniteCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f4f4f5] text-zinc-600 font-sans z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest animate-pulse">Unlocking The Vault...</p>
        </div>
      </div>
    ),
  }
);

// Lock to Gallery Light theme (Organic Gallery preset)
const GALLERY_THEME = {
  bgColor: "#faf9f5",
  fogColor: "#eae8e2",
  textColor: "text-zinc-800",
};

export default function VaultPage() {
  const [isClient, setIsClient] = useState(false);

  // Split mediaList by category and adjust relative frequency (weighted refImages)
  const redistributedMedia = React.useMemo(() => {
    const refImages = mediaList.filter(item => item.url.includes("visual-ref"));
    const explorationImages = mediaList.filter(item => item.url.includes("visual-explorations"));
    const fuellstackImages = mediaList.filter(item => item.url.includes("fuellstack-V"));

    return [
      ...refImages,
      ...refImages,
      ...refImages,
      ...refImages,
      ...fuellstackImages,
      ...fuellstackImages,
      ...explorationImages,
    ];
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ backgroundColor: GALLERY_THEME.bgColor, color: GALLERY_THEME.textColor }}
    >
      {/* Background paper texture overlay (Option 2: Organic paper grain) */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.065]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main full-screen 3D Canvas */}
      {isClient && (
        <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
          <InfiniteCanvas
            media={redistributedMedia}
            backgroundColor={GALLERY_THEME.bgColor}
            fogColor={GALLERY_THEME.fogColor}
            fogNear={70}
            fogFar={260}
            showFps={false}
            showControls={false}
          />
        </div>
      )}
    </div>
  );
}
