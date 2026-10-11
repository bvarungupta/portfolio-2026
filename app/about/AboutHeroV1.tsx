"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { rise } from "cube-motion";
import { Reveal } from "cube-motion/react";

export default function AboutHeroV1() {
  const [imageHovered, setImageHovered] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
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

    const isInitialPreload =
      typeof window !== "undefined" &&
      sessionStorage.getItem("portfolio-preloader-shown") !== "true";
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

  return (
    <>
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
        @media (max-width: 767px) {
          .himg-pen    { top: -16px !important; left: 10px !important; right: auto !important; }
          .himg-enter  { top: 2px !important; right: 10px !important; left: auto !important; }
          .himg-tab    { top: 2px !important; right: 48px !important; left: auto !important; }
          .himg-ball   { top: calc(44% - 20px) !important; left: 10px !important; right: auto !important; }
          .himg-saw    { top: calc(70% - 20px) !important; right: 10px !important; left: auto !important; }
          .himg-brush  { bottom: 10px !important; left: 10px !important; right: auto !important; }
        }
      `}</style>

      {/* ── Mobile Logo ── */}
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

      {/* ── Section 1: Intro + Photo ── */}
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

          {/* Floating animated images */}
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
                <Image
                  src={img.src}
                  alt=""
                  width={img.size}
                  height={img.size}
                  style={{ width: img.size, height: img.size, objectFit: "contain", display: "block" }}
                />
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

      {/* ── Section 2: full-width description ── */}
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
    </>
  );
}
