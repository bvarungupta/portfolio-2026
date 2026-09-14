"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LabHeader from "../LabHeader";

interface Question {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  hint: string;
  options: {
    id: string;
    label: string;
    preview: React.ReactNode;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const QUESTION_POOL: Question[] = [
  {
    id: 1,
    category: "Micro-Kerning",
    title: "Which sample has optical kerning applied to T-Y and P-O?",
    subtitle: "Focus on letterpair collisions and visual rhythm between diagonal & curved stems.",
    hint: "Observe the negative space trapped inside the 'T-Y' and 'P-O' intersections.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span
            className="text-2xl md:text-3xl font-light text-black select-none tracking-[0.02em]"
            style={{ fontFamily: "SatishSans, sans-serif" }}
          >
            T<span style={{ letterSpacing: "-0.09em" }}>Y</span>P<span style={{ letterSpacing: "-0.07em" }}>O</span>GRA<span style={{ letterSpacing: "-0.05em" }}>P</span>HY
          </span>
        ),
        isCorrect: true,
        explanation: "Correct! The 'T-Y' and 'P-O' pairs are tucked in optically to equalize negative counter-space.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span
            className="text-2xl md:text-3xl font-light text-black select-none"
            style={{ fontFamily: "SatishSans, sans-serif", letterSpacing: "0.04em" }}
          >
            T Y P O G R A P H Y
          </span>
        ),
        isCorrect: false,
        explanation: "Notice the gaping holes around T and Y. Unkerned default metrics create uneven rhythm.",
      },
    ],
  },
  {
    id: 2,
    category: "Diagonal Kerning",
    title: "Which sample has optical kerning applied to V-A and W-A?",
    subtitle: "Diagonal stems create large triangular gaps if unkerned.",
    hint: "Examine the optical distance between the top right of 'V' and top left of 'A'.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span
            className="text-2xl md:text-3xl font-light text-black select-none"
            style={{ fontFamily: "SatishSans, sans-serif", letterSpacing: "0.05em" }}
          >
            V A L U E &nbsp; W A V E
          </span>
        ),
        isCorrect: false,
        explanation: "The triangular gap between V and A is too wide, breaking the word into isolated fragments.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span
            className="text-2xl md:text-3xl font-light text-black select-none"
            style={{ fontFamily: "SatishSans, sans-serif" }}
          >
            V<span style={{ letterSpacing: "-0.08em" }}>A</span>LUE &nbsp; W<span style={{ letterSpacing: "-0.08em" }}>A</span>V<span style={{ letterSpacing: "-0.08em" }}>E</span>
          </span>
        ),
        isCorrect: true,
        explanation: "Spot on! The overlapping diagonal bounds bring V and A into visual harmony.",
      },
    ],
  },
  {
    id: 3,
    category: "Hanging Punctuation",
    title: "Which pull quote features proper hanging punctuation?",
    subtitle: "Punctuation marks should hang outside the margin to preserve optical text alignment.",
    hint: "Check if the opening quotation mark aligns flush with the text column or hangs outside.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="max-w-xs text-left">
            <p className="text-sm font-light text-black leading-relaxed" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
              &ldquo;Design is intelligence made visible through intentional form.&rdquo;
            </p>
          </div>
        ),
        isCorrect: false,
        explanation: "The quotation mark sits inside the text margin, indenting line one and breaking the left edge.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="max-w-xs text-left relative pl-3">
            <span className="absolute -left-0.5 top-0 text-sm font-light text-black select-none" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
              &ldquo;
            </span>
            <p className="text-sm font-light text-black leading-relaxed" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
              Design is intelligence made visible through intentional form.&rdquo;
            </p>
          </div>
        ),
        isCorrect: true,
        explanation: "Spot on! Hanging the quote mark outside preserves a razor-sharp vertical text margin.",
      },
    ],
  },
  {
    id: 4,
    category: "Optical Alignment",
    title: "Which button label has true Cap-Height optical vertical centering?",
    subtitle: "Mathematical bounding box centering often looks visually dropped due to descenders/ascenders.",
    hint: "Check the vertical relationship between the icon center and the uppercase letter 'C'.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="px-5 py-3 border border-gray-300 inline-flex items-center gap-2 bg-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span className="text-xs uppercase tracking-wider font-mono text-black" style={{ transform: "translateY(2px)" }}>
              CREATE PROJECT
            </span>
          </div>
        ),
        isCorrect: false,
        explanation: "Mathematical centering lowers the text too much, making it feel heavy towards the bottom border.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="px-5 py-3 border border-gray-300 inline-flex items-center gap-2 bg-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: "translateY(-0.5px)" }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span className="text-xs uppercase tracking-wider font-mono text-black" style={{ transform: "translateY(0px)" }}>
              CREATE PROJECT
            </span>
          </div>
        ),
        isCorrect: true,
        explanation: "Correct! Aligning to optical cap-height creates a balanced baseline harmony with the icon.",
      },
    ],
  },
  {
    id: 5,
    category: "Small-Caps Tracking",
    title: "Which All-Caps metadata label has optimal letter-spacing?",
    subtitle: "All-Caps text requires expanded tracking to prevent dense character crowding.",
    hint: "Compare letter-spacing legibility when read at small UI font sizes.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span className="text-[11px] font-mono uppercase font-semibold text-black tracking-normal">
            SYSTEM DESIGN SPECIFICATION 2026
          </span>
        ),
        isCorrect: false,
        explanation: "Unspaced ALL-CAPS causes adjacent vertical stems to blend together into a dense blob.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span className="text-[11px] font-mono uppercase font-semibold text-black tracking-[0.16em]">
            SYSTEM DESIGN SPECIFICATION 2026
          </span>
        ),
        isCorrect: true,
        explanation: "Perfect! Adding +0.16em tracking lets light breathe between capital letters for instant scanning.",
      },
    ],
  },
  {
    id: 6,
    category: "Tabular vs Proportional Numbers",
    title: "Which numeric column uses Tabular Lining Figures for data alignment?",
    subtitle: "Data tables demand fixed-width tabular numbers so decimal points line up vertically.",
    hint: "Watch how numbers 1, 8, 0 align vertically in the columns.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="flex flex-col text-xs font-mono text-gray-800 text-right leading-tight">
            <div>$1,111.11</div>
            <div>$8,888.88</div>
            <div>$0,000.00</div>
          </div>
        ),
        isCorrect: false,
        explanation: "Proportional figures vary in width (1 is narrower than 8), causing decimal points to wobble.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="flex flex-col text-xs font-mono text-gray-800 text-right leading-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
            <div>$1,111.11</div>
            <div>$8,888.88</div>
            <div>$0,000.00</div>
          </div>
        ),
        isCorrect: true,
        explanation: "Tabular lining numbers enforce equal glyph widths so digits align in strict vertical columns.",
      },
    ],
  },
  {
    id: 7,
    category: "Display Leading",
    title: "Which multi-line heading has correct line-height ratio?",
    subtitle: "Display headings require tighter leading (1.1x - 1.2x) than body text (1.5x).",
    hint: "Look at the gap between line 1 and line 2 of the large headline.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <h2 className="text-2xl font-light text-black max-w-xs leading-[1.65]" style={{ fontFamily: "SatishSans, sans-serif" }}>
            Architecting Intention Into Every Pixel
          </h2>
        ),
        isCorrect: false,
        explanation: "Leading is too loose for display text (1.65x), making lines feel disconnected from each other.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <h2 className="text-2xl font-light text-black max-w-xs leading-[1.15]" style={{ fontFamily: "SatishSans, sans-serif" }}>
            Architecting Intention Into Every Pixel
          </h2>
        ),
        isCorrect: true,
        explanation: "Tight display leading (1.15x) binds the multi-line headline into a cohesive typographic unit.",
      },
    ],
  },
  {
    id: 8,
    category: "Ligatures & Stems",
    title: "Which sample uses proper typographic ligatures for 'fi' and 'fl'?",
    subtitle: "Standard fonts join adjacent letters like 'f' and 'i' to eliminate overlapping dots & serifs.",
    hint: "Check the terminal hook of 'f' colliding with the dot on 'i'.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span className="text-2xl font-serif text-black" style={{ fontVariantLigatures: "none" }}>
            definitive flight
          </span>
        ),
        isCorrect: false,
        explanation: "Without ligatures, the hood of 'f' collides awkwardly with the dot of 'i' and stem of 'l'.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span className="text-2xl font-serif text-black" style={{ fontVariantLigatures: "common-ligatures" }}>
            definitive flight
          </span>
        ),
        isCorrect: true,
        explanation: "Correct! Common ligatures merge 'fi' and 'fl' into a single elegant glyph.",
      },
    ],
  },
  {
    id: 9,
    category: "Typographic Quotes",
    title: "Which snippet uses true curly apostrophes instead of straight prime quotes?",
    subtitle: "Professional typography uses curly smart apostrophes (’) rather than straight typewriter ticks (').",
    hint: "Look at the shape of the apostrophe in 'it's' and 'don't'.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <p className="text-sm font-light text-black" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
            It&apos;s clear that design isn&apos;t just decorative.
          </p>
        ),
        isCorrect: false,
        explanation: "Uses straight typewriter quotes ('). This is a common code/developer oversight.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <p className="text-sm font-light text-black" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
            It&rsquo;s clear that design isn&rsquo;t just decorative.
          </p>
        ),
        isCorrect: true,
        explanation: "Right on! True typographic apostrophes (&rsquo;) add human craftsmanship to editorial copy.",
      },
    ],
  },
  {
    id: 10,
    category: "Dashes vs Hyphens",
    title: "Which date range uses a true En-Dash (–) instead of a hyphen (-)?",
    subtitle: "Use En-Dashes (–) to express numeric ranges (e.g., 2024–2026), not short hyphens.",
    hint: "Compare the width of the dash between the years.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span className="text-xs font-mono text-black">
            PROJECT DURATION: 2024-2026
          </span>
        ),
        isCorrect: false,
        explanation: "Uses a hyphen (-), which is meant for compound words (e.g. 'well-designed'), not ranges.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span className="text-xs font-mono text-black">
            PROJECT DURATION: 2024&ndash;2026
          </span>
        ),
        isCorrect: true,
        explanation: "Correct! The En-dash (&ndash;) is precisely sized to indicate numerical spans.",
      },
    ],
  },
  {
    id: 11,
    category: "Ellipsis Glyph",
    title: "Which sample uses a true typographic Ellipsis glyph (…)?",
    subtitle: "Three typed periods (...) have uneven spacing compared to a single ellipsis character (…).",
    hint: "Inspect the space between the dots.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span className="text-sm font-light text-black">
            Loading system resources...
          </span>
        ),
        isCorrect: false,
        explanation: "Typed three individual periods (...), causing them to spread out too wide.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span className="text-sm font-light text-black">
            Loading system resources&hellip;
          </span>
        ),
        isCorrect: true,
        explanation: "Correct! The true ellipsis glyph (&hellip;) has tight, optically metrics-controlled spacing.",
      },
    ],
  },
  {
    id: 12,
    category: "Paragraph Rag & Rivers",
    title: "Which paragraph has a balanced right-hand rag without solitary widows?",
    subtitle: "Good typography avoids jagged right edges or solitary 1-word lines (widows).",
    hint: "Look at the ending line of the paragraph.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="max-w-[200px] text-left border-l border-gray-200 pl-3">
            <p className="text-xs text-gray-700 font-light leading-relaxed">
              We design modular systems that scale seamlessly across digital
              platforms.
            </p>
          </div>
        ),
        isCorrect: false,
        explanation: "Leaves a solitary 1-word widow ('platforms.') stranded on the final line.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="max-w-[210px] text-left border-l border-gray-200 pl-3">
            <p className="text-xs text-gray-700 font-light leading-relaxed">
              We design modular systems that scale seamlessly across digital platforms.
            </p>
          </div>
        ),
        isCorrect: true,
        explanation: "Clean, even rag distribution with balanced line lengths and no lone widows.",
      },
    ],
  },
  {
    id: 13,
    category: "Hanging Bullets",
    title: "Which list alignment features true hanging bullet points?",
    subtitle: "List markers should sit outside the text block so body text aligns in a flat column.",
    hint: "Check whether line 2 of the list item indents back under the bullet point or stays aligned under text.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="text-xs font-light text-gray-800 text-left max-w-xs">
            • Designing flexible component states and design tokens for web apps.
          </div>
        ),
        isCorrect: false,
        explanation: "Inline bullet causes line 2 to wrap under the bullet icon, breaking the vertical text line.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="text-xs font-light text-gray-800 text-left max-w-xs relative pl-4">
            <span className="absolute left-0 top-0 text-orange-500">•</span>
            Designing flexible component states and design tokens for web apps.
          </div>
        ),
        isCorrect: true,
        explanation: "Hanging bullet! Line 2 wraps cleanly under the text column.",
      },
    ],
  },
  {
    id: 14,
    category: "Contrast & Weight Scale",
    title: "Which subtitle pair achieves WCAG AAA contrast and clear weight separation?",
    subtitle: "Subtitles must maintain strong contrast against white backgrounds without muddy gray tones.",
    hint: "Evaluate body legibility and optical weight distinction.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-light text-gray-300 uppercase tracking-widest">
              UX ARCHITECTURE
            </span>
            <span className="text-sm font-light text-gray-400">
              Designing scalable multi-tenant SaaS dashboards.
            </span>
          </div>
        ),
        isCorrect: false,
        explanation: "Low contrast (text-gray-300/400). Fails WCAG AA accessibility tests and causes eye strain.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-mono font-medium text-orange-600 uppercase tracking-wider">
              UX ARCHITECTURE
            </span>
            <span className="text-sm font-light text-zinc-900 leading-snug" style={{ fontFamily: "FunnelDisplay, sans-serif" }}>
              Designing scalable multi-tenant SaaS dashboards.
            </span>
          </div>
        ),
        isCorrect: true,
        explanation: "High contrast (14:1 ratio) + clear weight distinction between orange label and zinc text.",
      },
    ],
  },
  {
    id: 15,
    category: "Type Scale Ratio",
    title: "Which typographic scale uses a mathematical 1.25 (Major Third) ratio?",
    subtitle: "Harmonic font sizing relies on geometric multipliers rather than arbitrary pixel sizes.",
    hint: "Look at the proportional jump from H3 (16px) to H2 (20px) to H1 (25px).",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-light text-black">25px</span>
            <span className="text-[20px] font-light text-gray-700">20px</span>
            <span className="text-[16px] font-light text-gray-500">16px</span>
          </div>
        ),
        isCorrect: true,
        explanation: "Perfect Major Third scale (16 * 1.25 = 20, 20 * 1.25 = 25). Harmonic visual progression.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-light text-black">29px</span>
            <span className="text-[17px] font-light text-gray-700">17px</span>
            <span className="text-[15px] font-light text-gray-500">15px</span>
          </div>
        ),
        isCorrect: false,
        explanation: "Arbitrary sizing creates jarring size leaps between heading levels.",
      },
    ],
  },
  {
    id: 16,
    category: "Subscript & Formula Metrics",
    title: "Which chemical formula uses true subscript glyphs vs downscaled font sizes?",
    subtitle: "Downscaling standard numbers changes stem weight; true subscripts preserve stroke weight.",
    hint: "Compare the line width (stroke weight) of '2' vs 'H' and 'O'.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span className="text-xl font-light text-black">
            H<span className="text-[10px] relative top-1 font-extralight">2</span>O
          </span>
        ),
        isCorrect: false,
        explanation: "Downscaled '2' becomes spindly and thin compared to the surrounding capital letters.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span className="text-xl font-light text-black" style={{ fontVariantPosition: "sub" }}>
            H<sub>2</sub>O
          </span>
        ),
        isCorrect: true,
        explanation: "True subscript glyph (H₂O) matches the optical stroke weight of H and O.",
      },
    ],
  },
  {
    id: 17,
    category: "Dark Canvas Optical Weight",
    title: "Which text on dark canvas applies negative optical weight compensation?",
    subtitle: "Light text on dark backgrounds optically bleeds and looks heavier than dark text on light.",
    hint: "White text on black requires ~5% lighter font weight to match black text on white.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <div className="p-3 bg-black text-white text-xs font-bold tracking-wide">
            OPTICAL WEIGHT BALANCE
          </div>
        ),
        isCorrect: false,
        explanation: "Bold weight on black glows and bleeds, making letterforms appear bloated.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <div className="p-3 bg-black text-white text-xs font-medium tracking-wide">
            OPTICAL WEIGHT BALANCE
          </div>
        ),
        isCorrect: true,
        explanation: "Correct! Reducing weight to Medium compensates for dark canvas optical irradiation.",
      },
    ],
  },
  {
    id: 18,
    category: "Fraction Glyphs",
    title: "Which sample uses true diagonal fraction glyphs (½) vs inline slash (1/2)?",
    subtitle: "Real fraction glyphs use superscript numerators and subscript denominators.",
    hint: "Check the size and position of digits around the fraction slash.",
    options: [
      {
        id: "a",
        label: "Sample A",
        preview: (
          <span className="text-sm font-light text-black">
            Add 1/2 tsp of salt
          </span>
        ),
        isCorrect: false,
        explanation: "Inline 1/2 looks bulky and disrupts body line height.",
      },
      {
        id: "b",
        label: "Sample B",
        preview: (
          <span className="text-sm font-light text-black">
            Add &frac12; tsp of salt
          </span>
        ),
        isCorrect: true,
        explanation: "True diagonal fraction (&frac12;) sits neatly within the font's cap-height bounds.",
      },
    ],
  },
];

// Fisher-Yates Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const QUESTIONS_PER_GAME = 7;
const SECONDS_PER_ROUND = 12;

export default function TypeMatchPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_ROUND);
  const [isInspecting, setIsInspecting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and shuffle questions on mount
  useEffect(() => {
    const shuffled = shuffleArray(QUESTION_POOL).slice(0, QUESTIONS_PER_GAME);
    setQuestions(shuffled);
  }, []);

  const question = questions[currentRound];

  // Timer loop
  useEffect(() => {
    if (!hasStarted || isFinished || selectedOption !== null || !question) return;

    setTimeLeft(SECONDS_PER_ROUND);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setSelectedOption("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, currentRound, isFinished, selectedOption, question]);

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (selectedOption !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(optionId);
    if (isCorrect) {
      const speedBonus = timeLeft > 6 ? 2 : 1;
      setScore((prev) => prev + speedBonus);
    }
  };

  const handleNext = () => {
    if (currentRound < questions.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setSelectedOption(null);
      setIsInspecting(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    const reshuffled = shuffleArray(QUESTION_POOL).slice(0, QUESTIONS_PER_GAME);
    setQuestions(reshuffled);
    setCurrentRound(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setIsInspecting(false);
    setTimeLeft(SECONDS_PER_ROUND);
    setHasStarted(true);
  };

  const getRank = (s: number) => {
    if (s >= 12) return { title: "Principal Typographer 🏆", desc: "Flawless eye for micro-kerning, tabular alignment, ligatures, and optical leading." };
    if (s >= 9) return { title: "Senior Type Director ✍️", desc: "Strong instinct for typography hierarchy, measure, and legibility." };
    if (s >= 6) return { title: "Design Apprentice 📐", desc: "Good foundation, but tricky kerning pairs and hanging quotes still catch you." };
    return { title: "Type Amateur 🙈", desc: "Typography takes practice! Review optical alignment and leading rules." };
  };

  if (!question && !isFinished && hasStarted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div
      className="bg-white min-h-screen px-6 md:px-8 pt-24 md:pt-32 pb-16 max-w-4xl mx-auto"
      style={{ fontFamily: "FunnelDisplay, sans-serif" }}
    >
      {/* Back Link & Title Header */}
      <div className="mb-8">
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors mb-4"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Lab
        </Link>
        <LabHeader firstWord="Type" secondWord="Match" />
      </div>

      {/* Main Game Container */}
      <div className="border border-gray-200 p-6 md:p-10 relative bg-white shadow-[inset_8px_0_24px_-8px_rgba(0,0,0,0.06)] rounded-none">
        {/* Corner squares */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-zinc-300" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-zinc-300" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-zinc-300" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-zinc-300" />

        {!hasStarted ? (
          <div className="py-4 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 mb-2 block font-medium">
              Typography Experiment
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-black tracking-tight mb-4"
              style={{ fontFamily: "SatishSans, sans-serif" }}
            >
              What is Type Match?
            </h2>
            <p className="text-sm text-gray-600 font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Type Match is a fast-paced typography intuition challenge designed to test your visual eye for micro-kerning, optical alignment, display leading, and text hierarchy.
            </p>

            {/* Grid of Uses & What You'll Learn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="p-5 border border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-black font-medium mb-2">
                  🎯 Purpose & Uses
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Train your cognitive precision for UI design systems, brand typography specs, and pixel-perfect layouts across web and mobile.
                </p>
              </div>

              <div className="p-5 border border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-black font-medium mb-2">
                  🧠 What You&apos;ll Learn
                </h3>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1">
                  <li>• Spotting optical kerning & stem collisions</li>
                  <li>• Cap-height optical alignment & hanging margins</li>
                  <li>• Tabular numbers, ligatures & true fraction glyphs</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setHasStarted(true)}
                className="px-8 py-3 bg-black text-white text-xs font-light tracking-wider hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: "FunnelDisplay, sans-serif" }}
              >
                Start Challenge →
              </button>
            </div>
          </div>
        ) : !isFinished && question ? (
          <div>
            {/* Top Bar: Progress, Timer, Inspector Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono uppercase tracking-widest text-orange-500 font-medium">
                  Challenge {currentRound + 1} / {questions.length} — {question.category}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer Bar */}
                <div className="flex items-center gap-2 font-mono text-gray-600">
                  <span className={`w-2 h-2 rounded-full ${timeLeft <= 4 ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
                  <span>{timeLeft}s</span>
                </div>

                {/* Inspect Grid Button */}
                <button
                  onClick={() => setIsInspecting(!isInspecting)}
                  className={`px-2.5 py-1 border text-[11px] font-mono transition-colors cursor-pointer ${
                    isInspecting ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-black"
                  }`}
                >
                  🔍 {isInspecting ? "Exit Grid" : "Inspect Grid"}
                </button>
              </div>
            </div>

            {/* Question Header */}
            <div className="mb-6">
              <h2
                className="text-2xl md:text-3xl font-light text-black tracking-tight mb-2"
                style={{ fontFamily: "SatishSans, sans-serif" }}
              >
                {question.title}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-light mb-2">{question.subtitle}</p>
              <div className="text-[11px] font-mono text-orange-600 bg-orange-50/60 p-2 border border-orange-200/60 inline-block">
                💡 Hint: {question.hint}
              </div>
            </div>

            {/* Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isAnswered = selectedOption !== null;

                let borderStyle = "border-gray-200 hover:border-gray-900";
                if (isAnswered) {
                  if (opt.isCorrect) borderStyle = "border-emerald-500 bg-emerald-50/20";
                  else if (isSelected && !opt.isCorrect) borderStyle = "border-orange-500 bg-orange-50/20";
                  else borderStyle = "border-gray-200 opacity-50";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id, opt.isCorrect)}
                    disabled={isAnswered}
                    className={`p-6 border text-left transition-all duration-200 flex flex-col justify-between min-h-[200px] relative group cursor-pointer ${borderStyle}`}
                  >
                    {/* Inspection Grid Overlay */}
                    {isInspecting && (
                      <div
                        className="absolute inset-0 pointer-events-none opacity-30 z-20"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                          backgroundSize: "8px 8px",
                        }}
                      />
                    )}

                    <div className="flex items-center justify-between w-full mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                        {opt.label}
                      </span>
                      {isAnswered && opt.isCorrect && (
                        <span className="text-xs font-mono text-emerald-600 flex items-center gap-1 font-medium">
                          ✓ Correct Choice
                        </span>
                      )}
                    </div>

                    <div className={`my-auto py-3 ${isInspecting ? "scale-110 origin-left transition-transform" : ""}`}>
                      {opt.preview}
                    </div>

                    {isAnswered && (isSelected || opt.isCorrect) && (
                      <p className="text-xs text-gray-700 mt-4 pt-3 border-t border-gray-200/80 font-light leading-relaxed">
                        {opt.explanation}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {selectedOption !== null && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-mono text-gray-400">
                  {selectedOption === "timeout" ? "⏱ Time expired!" : "Choice recorded."}
                </span>
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-black text-white text-xs font-light tracking-wider hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                >
                  {currentRound < questions.length - 1 ? "Next Challenge →" : "See Final Rank →"}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Game Complete Screen */
          <div className="text-center py-8">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-500 mb-2 block">
              Challenge Complete
            </span>
            <h2
              className="text-3xl md:text-4xl font-light text-black mb-3"
              style={{ fontFamily: "SatishSans, sans-serif" }}
            >
              {getRank(score).title}
            </h2>
            <p className="text-sm text-gray-500 font-light mb-8 max-w-md mx-auto leading-relaxed">
              {getRank(score).desc}
              <br />
              Final Score: <strong className="text-black font-normal">{score} Points</strong>
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 bg-black text-white text-xs font-light tracking-wider hover:bg-orange-500 transition-colors duration-200 cursor-pointer"
              >
                Play Again ↺
              </button>
              <Link
                href="/lab"
                className="px-6 py-2.5 border border-gray-200 text-black text-xs font-light tracking-wider hover:border-black transition-colors duration-200"
              >
                Explore Lab →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
