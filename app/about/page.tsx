"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import FavoritesShelf from "./FavoritesShelf";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { rise } from "cube-motion";
import { Reveal, Morph } from "cube-motion/react";

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
  const [imageHovered, setImageHovered] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [transitionDone, setTransitionDone] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let triggered = false;
    const onDone = () => {
      if (triggered) return;
      triggered = true;
      setTransitionDone(true);
    };

    window.addEventListener("page-transition-complete", onDone);
    window.addEventListener("preloader-complete", onDone);

    // Fallback timer ensures hero is revealed even if navigating directly or if events were missed
    const isInitialPreload = typeof window !== "undefined" && sessionStorage.getItem("portfolio-preloader-shown") !== "true";
    const timer = setTimeout(onDone, isInitialPreload ? 2000 : 650);

    return () => {
      window.removeEventListener("page-transition-complete", onDone);
      window.removeEventListener("preloader-complete", onDone);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!transitionDone || !heroRef.current) return;
    rise(heroRef.current, { targets: "children", stagger: 140 });
  }, [transitionDone]);

  const handleCopy = () => {
    navigator.clipboard.writeText('bvarungupta@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-12" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
      <style>{`
      @keyframes football-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes key-click {
        0%, 100% { transform: scale(1); }
        10%       { transform: scale(0.65); }
        22%       { transform: scale(1.1); }
        30%       { transform: scale(1); }
      }
      @keyframes saw-motion {
        0%   { transform: translateY(0px) rotate(0deg); }
        50%  { transform: translateY(-11px) rotate(5deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      @keyframes pen-sway {
        0%   { transform: translateX(-8px); }
        50%  { transform: translateX(8px); }
        100% { transform: translateX(-8px); }
      }
      @keyframes brush-tilt {
        0%   { transform: rotate(-10deg); }
        50%  { transform: rotate(42deg); }
        100% { transform: rotate(-10deg); }
      }
    `}</style>
      <style>{`
      @media (max-width: 767px) {
        .himg-pen    { top: -16px !important; left: 10px !important; right: auto !important; }
        .himg-enter  { top: 2px !important; right: 10px !important; left: auto !important; }
        .himg-tab    { top: 2px !important; right: 48px !important; left: auto !important; }
        .himg-ball   { top: calc(44% - 20px) !important; left: 10px !important; right: auto !important; }
        .himg-saw    { top: calc(70% - 20px) !important; right: 10px !important; left: auto !important; }
        .himg-brush  { bottom: 10px !important; left: 10px !important; right: auto !important; }
      }
    `}</style>
      <div className="max-w-3xl mx-auto px-6 md:px-10">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <div className="mb-6 mt-2 flex justify-center md:hidden">
          <div style={{ position: "relative", display: "inline-block" }}>
            <Image
              src="/images/HomeImages/varun-logo-english.svg"
              alt="Varun Gupta written in English"
              width={70}
              height={26}
              style={{
                opacity: logoHovered ? 0 : 1,
                transition: "opacity 0.15s ease",
                position: "relative",
                filter: "brightness(0) opacity(0.5)",
              }}
            />
            <Image
              src="/images/HomeImages/varun-logo-english.svg"
              alt="Varun Gupta at work"
              width={70}
              height={26}
              style={{
                opacity: logoHovered ? 1 : 0,
                transition: "opacity 0.15s ease",
                position: "absolute",
                top: 0,
                left: 0,
                filter: "brightness(0) opacity(0.5)",
              }}
            />
          </div>
        </div>

        {/* ── Section 1: intro + photo ─────────────────────────── */}
        <div
          ref={heroRef}
          className="flex flex-col md:flex-row md:items-end gap-10 md:gap-16 mb-10"
        >
          <div
            className="flex-1 order-2 md:order-1"
            style={{ opacity: transitionDone ? 1 : 0 }}
          >
            <p
              className="text-2xl md:text-3xl leading-snug text-gray-800 mb-6"
              style={{ fontFamily: "SatishSans, serif", fontWeight: 400 }}
            >
              I'm a Product Designer who takes full ownership of the work,
              the thinking, the decisions, and the execution.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Not just the screens, but the thinking, the decisions, and the execution. I come in early, when things are undefined, and stay until they ship.
            </p>
          </div>

          <div
            className="flex-shrink-0 flex justify-center md:justify-end md:pt-4 order-1 md:order-2"
            style={{
              position: "relative",
              opacity: transitionDone ? 1 : 0,
            }}
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
            onClick={() => setLogoHovered(prev => !prev)}
          >
            {/* Text chips */}
            {[
              { label: "UI/UX Designer", top: "28px", left: "5px", rotate: -8, delay: 0, duration: "0.55s" },
              { label: "Developer", top: "28px", right: "5px", rotate: 5, delay: 0.07, duration: "0.45s" },
              { label: "Vibe Coder", top: "48px", right: "8px", rotate: -4, delay: 0.09, duration: "0.5s" },
              { label: "Attacking Midfielder", top: "48%", left: "-8px", rotate: -6, delay: 0.12, duration: "0.6s" },
              { label: "Craftsman", top: "79%", right: "-2px", rotate: 5, delay: 0.06, duration: "0.52s" },
              { label: "Artist", bottom: "-20px", left: "15px", rotate: -5, delay: 0.1, duration: "0.48s" },
            ].map((chip, i) => (
              <div
                key={`chip-${i}`}
                style={{
                  position: "absolute",
                  top: chip.top, bottom: chip.bottom,
                  left: chip.left, right: chip.right,
                  transform: `rotate(${chip.rotate}deg) scale(${imageHovered ? 1 : 0.2})`,
                  opacity: imageHovered ? 1 : 0,
                  transition: `transform ${chip.duration} cubic-bezier(0.34, 1.56, 0.64, 1) ${chip.delay}s, opacity 0.18s ease ${chip.delay}s`,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontFamily: "FunnelDisplay, sans-serif",
                  color: "#374151",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
                  zIndex: 10,
                }}
              >
                {chip.label}
              </div>
            ))}

            {/* Floating images — each near its related chip */}
            {[
              {
                src: "/images/varun-image-hover-images/pen-tool.png",
                size: 34, top: "16px", left: "-36px", rotate: -14, delay: 0.04, duration: "0.6s",
                animation: "pen-sway 1.6s ease-in-out infinite", cls: "himg-pen",
              },
              {
                src: "/images/varun-image-hover-images/enter-button.png",
                size: 32, top: "16px", right: "-36px", rotate: 8, delay: 0.03, duration: "0.42s",
                animation: "key-click 2.2s ease-in-out infinite", cls: "himg-enter",
              },
              {
                src: "/images/varun-image-hover-images/TAB-button.png",
                size: 30, top: "40px", right: "-38px", rotate: -6, delay: 0.06, duration: "0.5s",
                animation: "key-click 2.2s ease-in-out 1.1s infinite", cls: "himg-tab",
              },
              {
                src: "/images/varun-image-hover-images/football.png",
                size: 38, top: "44%", left: "-44px", rotate: 0, delay: 0.09, duration: "0.55s",
                animation: "football-spin 3s linear infinite", cls: "himg-ball",
              },
              {
                src: "/images/varun-image-hover-images/burshes.png",
                size: 36, bottom: "-28px", left: "-24px", rotate: 0, delay: 0.11, duration: "0.52s",
                animation: "brush-tilt 1.1s ease-in-out infinite", cls: "himg-brush",
              },
            ].map((img, i) => (
              <div
                key={`img-${i}`}
                className={img.cls}
                style={{
                  position: "absolute",
                  top: img.top, bottom: img.bottom,
                  left: img.left, right: img.right,
                  transform: `rotate(${img.rotate}deg) scale(${imageHovered ? 1 : 0.1})`,
                  opacity: imageHovered ? 1 : 0,
                  transition: `transform ${img.duration} cubic-bezier(0.34, 1.56, 0.64, 1) ${img.delay}s, opacity 0.15s ease ${img.delay}s`,
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                <div style={{ animation: img.animation }}>
                  <Image src={img.src} alt="" width={img.size} height={img.size} style={{ width: img.size, height: img.size, objectFit: "contain", display: "block" }} />
                </div>
              </div>
            ))}

            <Image
              src="/images/HomeImages/Varun-about.jpg"
              alt="Varun Gupta at work"
              width={260}
              height={320}
              className="object-cover"
              style={{ maxWidth: '260px', width: '100%', position: "relative", zIndex: 1 }}
            />
          </div>
        </div>

        {/* ── Section 2: full-width description ───────────────── */}
        <Reveal as="div" className="mb-20">
          <p className="text-base text-gray-600 leading-relaxed">
            I design digital products that are simple to use and hard to forget.

            My work spans SaaS, FinTech, HealthTech, and EdTech, giving me
            a range of experience that keeps my thinking sharp and my
            approach adaptable. I've taken products from 0 → 1, working
            across the full design lifecycle from ambiguous brief to
            shipped product.

            I care deeply about the details. I work closely with
            cross-functional teams, translate complex problems into clear
            design solutions, and stay involved from research all the way
            through to launch.

            Outside of product work, I explore visual design, motion, and
            brand identity because good product designers understand
            the full picture.
          </p>
        </Reveal>

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

            <a
              href="https://cal.com/bvarungupta/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-sm text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 w-full md:w-auto"
              style={{ fontFamily: "FunnelDisplay, sans-serif", letterSpacing: "0.05em" }}
            >
              Let's Have a Chat
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </a>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
