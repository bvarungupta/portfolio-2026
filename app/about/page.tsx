"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import FavoritesShelf from "./FavoritesShelf";
import AboutHeroV1 from "./AboutHeroV1";
import AboutHeroV2 from "./AboutHeroV2";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { rise } from "cube-motion";
import { Reveal, Morph } from "cube-motion/react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";

const companies: {
  src: string;
  name: string;
  year: string;
  shadow: string;
  tags: { label: string; rotate: number; x: number }[];
}[] = [
    { src: "/images/inAbout/Abhi.svg", name: "Abhiyantrik", year: "2025", shadow: "rgba(99, 102, 241, 0.22)", tags: [{ label: "IoT", rotate: -9, x: -26 }, { label: "Smart Home", rotate: 6, x: 28 }] },
    { src: "/images/inAbout/blumeH.svg", name: "BlumeHealth", year: "2025", shadow: "rgba(52, 211, 153, 0.28)", tags: [{ label: "SaaS", rotate: -7, x: -26 }, { label: "Health", rotate: 5, x: 30 }] },
    { src: "/images/inAbout/SR.svg", name: "SkillRadius", year: "2026", shadow: "rgba(109, 84, 224, 0.25)", tags: [{ label: "LMS", rotate: -8, x: -24 }, { label: "EdTech", rotate: 6, x: 30 }] },
    { src: "/images/inAbout/SS.svg", name: "SkinSage", year: "2026", shadow: "rgba(34, 197, 94, 0.28)", tags: [{ label: "AI", rotate: -6, x: -24 }, { label: "MedTech", rotate: 8, x: 30 }] },
    { src: "/images/inAbout/fuellstack.svg", name: "Fuellstack", year: "2025", shadow: "rgba(220, 88, 20, 0.25)", tags: [{ label: "IT Agency", rotate: -7, x: 0 }] },
    { src: "/images/inAbout/LV.svg", name: "LogicVeda", year: "2025", shadow: "rgba(109, 84, 224, 0.25)", tags: [{ label: "EdTech", rotate: 7, x: 0 }] },
    { src: "/images/inAbout/Storuage.svg", name: "Storuage", year: "2025", shadow: "rgba(245, 158, 11, 0.28)", tags: [{ label: "IoT", rotate: -6, x: -28 }, { label: "Smart Kitchen", rotate: 5, x: 34 }] },
    { src: "/images/inAbout/Wagwan.svg", name: "Wagwan", year: "2025 - Present", shadow: "rgba(239, 68, 68, 0.25)", tags: [{ label: "Social", rotate: -7, x: -22 }, { label: "Events", rotate: 6, x: 24 }] },
  ];

const socialPlatforms = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bvarungupta', icon: '/images/HomeImages/linkedin.svg', color: '#0077b5', description: 'Where I pretend to be professional.' },
  { label: 'Behance', href: 'https://behance.net/bvarungupta', icon: '/images/HomeImages/behance.svg', color: '#0057ff', description: 'Where I over-explain every design decision.' },
  { label: 'Dribbble', href: 'https://dribbble.com/bvarungupta', icon: '/images/HomeImages/dribbble.svg', color: '#ea4c89', description: 'Pretty pixels with no context.' },
  { label: 'Figma', href: 'https://figma.com/@bvarungupta', icon: '/images/ToolsIcons/figma-icon.svg', color: '#f24e1e', description: 'Where I go to feel productive and lose 3 hours.' },
  { label: 'Medium', href: 'https://medium.com/@bvarungupta', icon: '/images/HomeImages/medium.svg', color: '#000000', description: 'Thoughts I had at 2am that felt important.' },
  { label: 'Instagram', href: 'https://www.instagram.com/itsvaruuuun?igsh=MXQ4aGx5ZjNwbnF0cA==', icon: '/images/HomeImages/instagram.svg', color: '#e1306c', description: 'Where the algorithm decides my personality' },
];

interface Tool {
  name: string;
  src: string;
}

const designTools: Tool[] = [
  { name: "Figma", src: "/images/ToolsIcons/figma-icon.svg" },
  { name: "Photoshop", src: "/images/ToolsIcons/adobe-photoshop-icon.svg" },
  { name: "Illustrator", src: "/images/ToolsIcons/illustrator.png" },
  { name: "After Effects", src: "/images/ToolsIcons/adobe-after-effects-icon.svg" },
  { name: "Affinity Designer", src: "/images/ToolsIcons/affinity.svg" },
  { name: "Blender", src: "/images/ToolsIcons/blender-icon.svg" },
  { name: "LottieFiles", src: "/images/ToolsIcons/lottiefiles.svg" },
  { name: "Rive", src: "/images/ToolsIcons/rive-icon.svg" },
  { name: "Zeplin", src: "/images/ToolsIcons/zeplin-icon.webp" },
  { name: "Paper", src: "/images/ToolsIcons/paper.png" },
  { name: "Spline", src: "/images/ToolsIcons/spline-icon.webp" },
  { name: "Jitter", src: "/images/ToolsIcons/jitter.png" },
];

const developmentTools: Tool[] = [
  { name: "Cursor", src: "/images/ToolsIcons/cursor-ai-code-icon.svg" },
  { name: "Anti Gravity", src: "/images/ToolsIcons/antigravity.svg" },
  { name: "GitHub", src: "/images/ToolsIcons/github-icon.svg" },
  { name: "Framer", src: "/images/ToolsIcons/framer-logo.svg" },
  { name: "Webflow", src: "/images/ToolsIcons/webflow.svg" },
  { name: "Wix", src: "/images/ToolsIcons/wix.png" },
  { name: "Wordpress", src: "/images/ToolsIcons/wordpress.png" },
  { name: "Shopify", src: "/images/ToolsIcons/shopify.svg" },
  { name: "Astro Build", src: "/images/ToolsIcons/astro.png" },
  { name: "Supabase", src: "/images/ToolsIcons/supabase.webp" },
  { name: "Next JS", src: "/images/ToolsIcons/next.png" },
  { name: "React", src: "/images/ToolsIcons/react.png" },
];

const productivityTools: Tool[] = [
  { name: "Claude Code", src: "/images/ToolsIcons/claude-ai-icon.svg" },
  { name: "ChatGPT", src: "/images/ToolsIcons/chatgpt-icon.svg" },
  { name: "Google Gemini", src: "/images/ToolsIcons/google-gemini-icon.svg" },
  { name: "Notion", src: "/images/ToolsIcons/notion.png" },
  { name: "Miro", src: "/images/ToolsIcons/miro.png" },
  { name: "Maze", src: "/images/ToolsIcons/maze.svg" },
  { name: "Mobbin", src: "/images/ToolsIcons/mobbin.png" },
  { name: "Replit", src: "/images/ToolsIcons/replit.png" },
  { name: "Vercel", src: "/images/ToolsIcons/vercel.svg" },
  { name: "Arc", src: "/images/ToolsIcons/arc.png" },
  { name: "Linear", src: "/images/ToolsIcons/linear.webp" },
  { name: "Hotjar", src: "/images/ToolsIcons/hotjar.png" },
];


function FavStyleToolIcon({
  tool,
  index,
}: {
  tool: Tool;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const rotation = ((index % 2 === 0 ? -1 : 1) * (1.5 + (index % 4) * 0.8)).toFixed(2);

  return (
    <div
      className="flex flex-col items-center gap-2 text-center w-20 select-none cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered
          ? `translate3d(0, -6px, 0) rotate(${parseFloat(rotation) * 0.3}deg)`
          : `translate3d(0, 0, 0) rotate(${rotation}deg)`,
        transformOrigin: "center 90%",
        transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center relative">
        <div className="w-9 h-9 flex items-center justify-center relative overflow-visible">
          <Image
            src={tool.src}
            alt={tool.name}
            width={36}
            height={36}
            className="w-full h-full object-contain pointer-events-none"
          />
          {/* Sheen effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md">
            {/* First sheen sweep */}
            <div
              className="absolute inset-[-20%_-40%] pointer-events-none"
              style={{
                background: "linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.9) 50%, transparent 60%)",
                transform: hovered ? "translateX(60%)" : "translateX(-60%)",
                transition: hovered
                  ? "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "transform 0ms",
                mixBlendMode: "overlay",
              }}
            />
            {/* Second sheen sweep (staggered) */}
            <div
              className="absolute inset-[-20%_-40%] pointer-events-none"
              style={{
                background: "linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)",
                transform: hovered ? "translateX(60%)" : "translateX(-60%)",
                transition: hovered
                  ? "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "transform 0ms",
                transitionDelay: hovered ? "120ms" : "0ms",
                mixBlendMode: "overlay",
              }}
            />
          </div>
          {/* Star Corner Badge (Top Right) */}
          <span
            className="absolute top-[-5px] right-[-5px] text-[10px] text-amber-500 pointer-events-none select-none"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.15)",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1) rotate(0deg)" : "scale(0.6) rotate(-18deg)",
              transition: "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            ★
          </span>
        </div>
      </div>
      <span className="text-[11px] text-gray-600 leading-tight" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>{tool.name}</span>
    </div>
  );
}

export default function About() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText('bvarungupta@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pt-14 sm:pt-16 pb-12" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
      {/* 
        ── About Page Hero ──────────────────────────────────────────────
        Hero V2 is active below (interactive fanned-out photograph gallery + editorial story).
        Hero V1 is preserved completely in AboutHeroV1.tsx for instant comparison or reversion:
        To revert to Hero V1, comment out <AboutHeroV2 /> and uncomment <div className="max-w-3xl mx-auto px-6 md:px-10"><AboutHeroV1 /></div>.
      */}
      <AboutHeroV2 />
      {/* <div className="max-w-3xl mx-auto px-6 md:px-10"><AboutHeroV1 /></div> */}

      <div className="max-w-3xl mx-auto px-6 md:px-10">
        {/* ── Experience timeline ──────────────────────────────── */}
        {false && (
          <div className="mb-20">
            <p
              className="text-xl md:text-2xl text-gray-700 leading-snug mb-10"
              style={{ fontFamily: "SatishSans, serif", fontWeight: 400 }}
            >
              I've helped startups take their digital products from idea to launch. These are some of the companies I've partnered with.
            </p>
            <div className="grid grid-cols-4 justify-items-center gap-8 md:gap-12 pb-4">
              {companies.map((co, i) => {
                const isHovered = hovered === i;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 flex-shrink-0"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Logo + chips wrapper */}
                    <div style={{ position: "relative", display: "flex", justifyContent: "center", width: "60px", height: "60px" }}>

                      {/* Chips — behind logo, pop up on hover */}
                      {co.tags.map((tag, ti) => (
                        <div
                          key={ti}
                          style={{
                            position: "absolute",
                            bottom: isHovered ? "68px" : "20px",
                            left: "50%",
                            transform: `translateX(calc(-50% + ${tag.x}px)) rotate(${tag.rotate}deg)`,
                            opacity: isHovered ? 1 : 0,
                            transition: `bottom 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${ti * 0.06}s, opacity 0.2s ease ${ti * 0.06}s`,
                            zIndex: 0,
                            background: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "20px",
                            padding: "3px 8px",
                            fontSize: "10px",
                            fontFamily: "FunnelDisplay, sans-serif",
                            color: "#374151",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                          }}
                        >
                          {tag.label}
                        </div>
                      ))}

                      {/* Logo box */}
                      <div
                        style={{
                          position: "relative",
                          zIndex: 1,
                          width: "60px",
                          height: "60px",
                          background: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          borderRadius: "30%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          boxShadow: isHovered ? `inset 0 -14px 20px 4px ${co.shadow}` : "none",
                          transition: "box-shadow 0.3s ease",
                        }}
                      >
                        <Image src={co.src} alt={co.name} width={60} height={60} className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <span className="text-[11px] text-gray-500" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>{co.name}</span>
                    <span className="text-[10px] text-gray-300 text-center" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>{co.year}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Section: Elsewhere / Connect ────────────────────── */}
        <div className="mb-20">
          <Reveal as="div" className="text-center mb-10">
            <p
              className="text-xl md:text-2xl text-gray-700 leading-snug mb-2"
              style={{ fontFamily: "SatishSans, serif", fontWeight: 400 }}
            >
              Also Here
            </p>
            <p className="text-sm text-gray-500" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
              Same person, different tabs.
            </p>
          </Reveal>

          <Reveal as="div" targets="children" stagger={80} className="grid grid-cols-2 md:grid-cols-3 justify-items-center gap-x-6 gap-y-12 md:gap-x-12 md:gap-y-16 max-w-3xl mx-auto">
            {socialPlatforms.map((platform, index) => {
              const isHovered = hoveredSocial === platform.label;
              const rotation = ((index % 2 === 0 ? -1 : 1) * (5 + (index % 4) * 2)).toFixed(2);
              return (
                <a
                  key={platform.label}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(platform.label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className="flex flex-col items-center text-center cursor-pointer select-none w-full max-w-[150px] md:max-w-[170px]"
                  style={{
                    transform: isHovered ? 'translate3d(0, -6px, 0)' : 'translate3d(0, 0, 0)',
                    transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {/* Tilted brand SVG icon container with sheen sweep */}
                  <div className="w-12 h-12 mb-3 flex items-center justify-center relative overflow-visible">
                    <div 
                      className="w-12 h-12 flex items-center justify-center relative overflow-hidden"
                      style={{
                        transform: isHovered
                          ? `rotate(${parseFloat(rotation) * 0.3}deg)`
                          : `rotate(${rotation}deg)`,
                        transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <img
                        src={platform.icon}
                        alt={platform.label}
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'block',
                          objectFit: 'contain',
                        }}
                      />
                      
                      {/* Sheen sweep overlay on hover (exactly like My Toolkit icons) */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* First sheen sweep */}
                        <div
                          className="absolute inset-[-20%_-40%] pointer-events-none"
                          style={{
                            background: "linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.9) 50%, transparent 60%)",
                            transform: isHovered ? "translateX(60%)" : "translateX(-60%)",
                            transition: isHovered
                              ? "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)"
                              : "transform 0ms",
                            mixBlendMode: "overlay",
                          }}
                        />
                        {/* Second sheen sweep (staggered) */}
                        <div
                          className="absolute inset-[-20%_-40%] pointer-events-none"
                          style={{
                            background: "linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)",
                            transform: isHovered ? "translateX(60%)" : "translateX(-60%)",
                            transition: isHovered
                              ? "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)"
                              : "transform 0ms",
                            transitionDelay: isHovered ? "120ms" : "0ms",
                            mixBlendMode: "overlay",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-xs text-zinc-600 font-light leading-relaxed max-w-[200px] transition-colors duration-300"
                    style={{
                      fontFamily: "FunnelDisplay, sans-serif",
                      color: isHovered ? platform.color : '#52525b',
                    }}
                  >
                    {platform.description}
                  </p>
                </a>
              );
            })}
          </Reveal>
        </div>

        {/* ── Toolkit ──────────────────────────────────────────── */}
        <div className="mb-20">
          <Reveal as="div" className="text-center mb-10">
            <p
              className="text-xl md:text-2xl text-gray-700 leading-snug mb-2"
              style={{ fontFamily: "SatishSans, serif", fontWeight: 400 }}
            >
              My Toolkit
            </p>
            <p className="text-sm text-gray-500" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
              Tools I use to design, build, and ship every day.
            </p>
          </Reveal>

          <div className="flex flex-col gap-12">

            {/* Design & Animations */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-5 text-center" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>Design & Animations</p>
              <Reveal as="div" targets="children" stagger={35} className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-8">
                {designTools.map((tool, index) => (
                  <FavStyleToolIcon key={tool.name} tool={tool} index={index} />
                ))}
                <div className="flex flex-col items-center gap-2 text-center justify-center w-20 select-none">
                  <span className="text-[11px] text-gray-500" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>+ more</span>
                </div>
              </Reveal>
            </div>

            {/* Development */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-5 text-center" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>Development</p>
              <Reveal as="div" targets="children" stagger={35} className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-8">
                {developmentTools.map((tool, index) => (
                  <FavStyleToolIcon key={tool.name} tool={tool} index={index} />
                ))}
              </Reveal>
            </div>

            {/* Productivity & Assistive Tools */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-5 text-center" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>Productivity & Assistive Tools</p>
              <Reveal as="div" targets="children" stagger={35} className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-8">
                {productivityTools.map((tool, index) => (
                  <FavStyleToolIcon key={tool.name} tool={tool} index={index} />
                ))}
              </Reveal>
            </div>

          </div>
        </div>

        {/* ── Favorites Shelf ──────────────────────────────────── */}
        <FavoritesShelf />

        {/* ── Closing CTA ──────────────────────────────────────── */}
        <Reveal as="div" targets="children" stagger={120} className="text-center">
          <p
            className="text-2xl md:text-3xl text-gray-700 leading-snug mb-8"
            style={{ fontFamily: "SatishSans, serif", fontWeight: 400 }}
          >
            If you're building something and need a designer who takes ownership end to end, let's talk.
          </p>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 w-full md:w-auto md:inline-flex">
            <div className="flex flex-col md:flex-row items-stretch w-full md:w-auto">
              <a
                href="mailto:bvarungupta@gmail.com"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-sm text-gray-700 hover:border-gray-400 hover:text-gray-950 transition-all duration-200"
                style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "0.05em" }}
              >
                say hello
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div
                className={`flex items-center justify-center px-5 py-3 border border-t-0 md:border-t md:border-l-0 text-sm select-all cursor-pointer transition-colors duration-300 ${
                  copied ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-700 bg-zinc-50/20'
                }`}
                style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "0.03em" }}
                onClick={handleCopy}
              >
                <Morph
                  active={copied}
                  off="bvarungupta@gmail.com"
                  on="copieeeeeeed!!!"
                  className={`text-sm transition-colors duration-300 ${copied ? 'text-white' : 'text-gray-700'}`}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                  className={`ml-2.5 transition-colors duration-200 flex-shrink-0 cursor-pointer ${copied ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
                  title="Copy email"
                >
                  <Morph
                    active={copied}
                    off={
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="5" y="5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M9 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    }
                    on={
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    }
                  />
                </button>
              </div>
            </div>

            <AntiMetalButton
              href="https://cal.com/bvarungupta/15min"
              target="_blank"
              rel="noopener noreferrer"
              label="Let's Have a Chat"
              className="w-full md:w-48 shrink-0"
            />
          </div>
        </Reveal>

      </div>
    </div>
  );
}
