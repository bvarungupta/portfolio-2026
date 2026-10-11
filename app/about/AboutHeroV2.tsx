"use client";

import { useEffect, useRef, useState } from "react";
import { rise, reveal } from "cube-motion";
import SplitType from "split-type";
import SocialCards, { DEMO_CARDS } from "@/components/ui/card-fan-carousel";

export default function AboutHeroV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [transitionDone, setTransitionDone] = useState(false);

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
    const timer = setTimeout(onDone, isInitialPreload ? 2000 : 500);

    return () => {
      window.removeEventListener("page-transition-complete", onDone);
      window.removeEventListener("preloader-complete", onDone);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !transitionDone) return;

    let revealCleanups: (() => void)[] = [];
    let splitInstances: SplitType[] = [];
    let isCleanedUp = false;

    const setupLineAnimations = async () => {
      if (isCleanedUp) return;

      // Clean up previous splits and reveals
      revealCleanups.forEach((c) => c());
      revealCleanups = [];
      splitInstances.forEach((s) => s.revert());
      splitInstances = [];

      // Ensure fonts are ready before computing line wrapping
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }
      if (isCleanedUp) return;

      // 1. Animate header elements with cube-motion rise on page entrance
      if (headerRef.current) {
        rise(headerRef.current, { targets: "children", stagger: 120 });
      }

      // 2. Split each paragraph into lines for cube-motion line-by-line reveal
      const paragraphs = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal='paragraph']"));

      paragraphs.forEach((p) => {
        const split = new SplitType(p, {
          types: "lines",
          lineClass: "editorial-cube-line",
        });
        splitInstances.push(split);

        if (split.lines && split.lines.length) {
          split.lines.forEach((line) => {
            line.style.display = "block";
            line.style.overflow = "visible";
          });
          // Attach cube-motion reveal to lines per paragraph with 65ms stagger
          const unbind = reveal(split.lines, { stagger: 65 });
          revealCleanups.push(unbind);
        }
      });
    };

    setupLineAnimations();

    // Debounced window resize recalculation for dynamic responsive line re-wrapping
    let resizeTimer: NodeJS.Timeout;
    let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const handleResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupLineAnimations();
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      isCleanedUp = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      revealCleanups.forEach((c) => c());
      splitInstances.forEach((s) => s.revert());
    };
  }, [transitionDone]);

  return (
    <div className="w-full mb-12 sm:mb-16 md:mb-20">
      {/* ── Photo Fan Gallery (Responsive, Compact, Touch & Hover) ── */}
      <div className="w-full flex justify-center overflow-visible pt-0 pb-0">
        <SocialCards cards={DEMO_CARDS} className="py-0 px-0" />
      </div>

      {/* ── Editorial Story Text Section (Cube Motion Line-by-Line Animations) ── */}
      <div
        ref={containerRef}
        className="max-w-3xl mx-auto px-5 sm:px-8 md:px-10 mt-5 sm:mt-7 md:mt-10"
      >
        {/* Opening Heading + Subtitle with cube-motion rise on page entrance */}
        <div
          ref={headerRef}
          style={{ opacity: transitionDone ? 1 : 0 }}
          className="mb-6 sm:mb-8 md:mb-10"
        >
          {/* Opening line */}
          <h1
            className="text-[28px] sm:text-4xl md:text-[40px] font-bold tracking-[-0.03em] text-[#111111] leading-[1.18]"
            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
          >
            hi, its varun.
          </h1>

          {/* Subtitle */}
          <p
            className="text-[16px] sm:text-xl md:text-[21px] text-gray-500 font-light italic mt-2 sm:mt-2.5 tracking-[-0.01em] leading-snug sm:leading-normal"
            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
          >
            product designer. chronic overthinker. details guy.
          </p>
        </div>

        {/* Five flowing paragraphs: Animated line-by-line with cube-motion reveal */}
        <div
          className="space-y-5 sm:space-y-6 md:space-y-7 text-[#161616] leading-[1.7] sm:leading-[1.75] md:leading-[1.8] text-[15.5px] sm:text-[16.5px] md:text-[17.5px]"
          style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 400 }}
        >
          <p data-reveal="paragraph">
            Based in India 🇮🇳, designing digital products that make sense to the people using them. I take ownership from the first messy idea to the final shipped product. The thinking, the decisions, and the details in between.
          </p>

          <p data-reveal="paragraph">
            I work across mobile apps, web products, SaaS, FinTech, EdTech, HealthTech, and whatnot. I like turning complicated problems into experiences that feel simple, intuitive, and just make sense.
          </p>

          <p data-reveal="paragraph">
            I&apos;m particular about the little things. The interaction that feels slightly off, the two pixels that don&apos;t line up, the tiny decision that makes everything click. Outside product design, I explore visual design, motion, and brand identity. Apparently, one creative rabbit hole wasn&apos;t enough.
          </p>

          <p data-reveal="paragraph">
            Outside work, I&apos;m usually watching anime, overanalysing a movie, or getting lost in a book. Brandon Sanderson for the worlds I wish I could live in, Dan Brown for the plots that make me say <em className="italic">just one more chapter</em>. And when I&apos;m not doing either, there&apos;s a good chance <em className="italic">How I Met Your Mother</em> is playing in the background for the hundredth time.
          </p>

          <p data-reveal="paragraph">
            I like making things that work beautifully, feel human, and don&apos;t need to announce how clever they are. They just work. And somehow, that&apos;s the hard part.
          </p>
        </div>
      </div>
    </div>
  );
}
