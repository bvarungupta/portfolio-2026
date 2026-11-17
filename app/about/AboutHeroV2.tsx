"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import SocialCards, { DEMO_CARDS } from "@/components/ui/card-fan-carousel";

gsap.registerPlugin(ScrollTrigger);

const storyParagraphs = [
  "Based in India 🇮🇳, designing digital products that make sense to the people using them. I take ownership from the first messy idea to the final shipped product. The thinking, the decisions, and the details in between.",
  "I work across mobile apps, web products, SaaS, FinTech, EdTech, HealthTech, and whatnot. I like turning complicated problems into experiences that feel simple, intuitive, and just make sense.",
  "I'm particular about the little things. The interaction that feels slightly off, the two pixels that don't line up, the tiny decision that makes everything click. Outside product design, I explore visual design, motion, and brand identity. Apparently, one creative rabbit hole wasn't enough.",
  "Outside work, I'm usually watching anime, overanalysing a movie, or getting lost in a book. Brandon Sanderson for the worlds I wish I could live in, Dan Brown for the plots that make me say just one more chapter. And when I'm not doing either, there's a good chance How I Met Your Mother is playing in the background for the hundredth time.",
  "I like making things that work beautifully, feel human, and don't need to announce how clever they are. They just work. And somehow, that's the hard part.",
];

export default function AboutHeroV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [transitionDone, setTransitionDone] = useState(false);

  // 1. Wait for page transition / preloader to settle before initiating animations
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
    const timer = setTimeout(onDone, isInitialPreload ? 1800 : 350);

    return () => {
      window.removeEventListener("page-transition-complete", onDone);
      window.removeEventListener("preloader-complete", onDone);
      clearTimeout(timer);
    };
  }, []);

  // 2. Set up Magic UI Blur-In text animation, line by line, sequentially on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !transitionDone) return;

    let splitInstances: SplitType[] = [];
    let isCleanedUp = false;

    const setupAnimations = async () => {
      if (isCleanedUp) return;

      // Clean up previous splits
      splitInstances.forEach((s) => s.revert());
      splitInstances = [];

      // Ensure custom fonts are loaded so line wrapping measurements are pixel-exact
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font loading error fallback
        }
      }
      if (isCleanedUp) return;

      // ── Animate Header & Subtitle with Magic UI blur-in ──
      const headerElements = [h1Ref.current, subtitleRef.current].filter(Boolean);
      if (headerElements.length > 0) {
        gsap.fromTo(
          headerElements,
          {
            opacity: 0,
            filter: "blur(10px)",
            y: 14,
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
          }
        );
      }

      // ── Split editorial paragraphs into natural visual lines ──
      const paragraphElements = Array.from(
        el.querySelectorAll<HTMLElement>("[data-reveal='editorial-p']")
      );

      paragraphElements.forEach((p) => {
        const split = new SplitType(p, {
          types: "lines",
          lineClass: "magic-blur-line",
        });
        splitInstances.push(split);

        if (split.lines) {
          split.lines.forEach((line) => {
            line.style.display = "block";
            line.style.overflow = "visible";
            line.style.willChange = "filter, opacity, transform";
          });
        }
      });

      // Gather all lines across all paragraphs in exact sequential document order
      const allLines = Array.from(
        el.querySelectorAll<HTMLElement>(".magic-blur-line")
      );

      if (allLines.length === 0) return;

      // Check which lines are already above the trigger line (e.g. paragraph 1 on viewport load)
      const viewportTriggerY = window.innerHeight * 0.88;

      // Set initial blur-in state for all lines
      gsap.set(allLines, {
        opacity: 0,
        filter: "blur(12px)",
        y: 16,
      });

      // Batch animate with GSAP ScrollTrigger for seamless sequential scroll trigger
      ScrollTrigger.batch(allLines, {
        start: "top 88%",
        once: true,
        interval: 0.08,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.55,
            stagger: 0.12, // Sequential one after another line stagger!
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });

      // Refresh ScrollTrigger to calculate accurate triggers after line splitting
      ScrollTrigger.refresh();
    };

    setupAnimations();

    // Responsive recalculation on window resize
    let resizeTimer: NodeJS.Timeout;
    let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const handleResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupAnimations();
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      isCleanedUp = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      splitInstances.forEach((s) => s.revert());
      // Kill only scrolltriggers associated with magic-blur-line
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && (st.trigger as HTMLElement).classList?.contains("magic-blur-line")) {
          st.kill();
        }
      });
    };
  }, [transitionDone]);

  return (
    <div className="w-full mb-12 sm:mb-16 md:mb-20">
      {/* ── Photo Fan Gallery (Responsive, Compact, Touch & Hover) ── */}
      <div className="w-full flex justify-center overflow-visible pt-0 pb-0">
        <SocialCards cards={DEMO_CARDS} className="py-0 px-0" />
      </div>

      {/* ── Editorial Story Text Section (Magic UI Blur-In Line-by-Line Animations) ── */}
      <div
        ref={containerRef}
        className="max-w-3xl mx-auto px-5 sm:px-8 md:px-10 mt-5 sm:mt-7 md:mt-10"
      >
        {/* Opening Heading + Subtitle with matching font size */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          {/* Opening line - matched font size to subtitle */}
          <h1
            ref={h1Ref}
            className="text-[16px] sm:text-xl md:text-[21px] font-semibold tracking-[-0.01em] text-[#111111] leading-snug sm:leading-normal"
            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
          >
            hi, its varun.
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-[16px] sm:text-xl md:text-[21px] text-gray-500 font-light italic mt-1 sm:mt-1.5 tracking-[-0.01em] leading-snug sm:leading-normal"
            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
          >
            product designer. chronic overthinker. details guy.
          </p>
        </div>

        {/* Five flowing paragraphs: Animated line-by-line sequentially with Magic UI Blur-In */}
        <div
          className="space-y-5 sm:space-y-6 md:space-y-7 text-[#161616] leading-[1.7] sm:leading-[1.75] md:leading-[1.8] text-[15.5px] sm:text-[16.5px] md:text-[17.5px]"
          style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 400 }}
        >
          {storyParagraphs.map((paragraph, index) => (
            <p
              key={index}
              data-reveal="editorial-p"
              className="text-[#161616] leading-[1.7] sm:leading-[1.75] md:leading-[1.8] text-[15.5px] sm:text-[16.5px] md:text-[17.5px]"
              style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 400 }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
