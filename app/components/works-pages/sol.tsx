"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

const ACCENT = '#FF9F0A';

const Plus = ({ h, v = 'bottom' }: { h: 'left' | 'right'; v?: 'top' | 'bottom' }) => (
  <span
    className="absolute select-none pointer-events-none"
    style={{
      [h]: 0,
      [v]: 0,
      transform: `translate(${h === 'left' ? '-50%' : '50%'}, ${v === 'top' ? '-50%' : '50%'})`,
      fontFamily: 'monospace',
      fontSize: '13px',
      lineHeight: 1,
      color: '#9ca3af',
      zIndex: 10,
    }}
  >+</span>
);

const PlusAt = ({ x, v = 'bottom', desktop = false }: { x: string; v?: 'top' | 'bottom'; desktop?: boolean }) => (
  <span
    className={`absolute select-none pointer-events-none${desktop ? ' hidden md:block' : ''}`}
    style={{
      left: x,
      [v]: 0,
      transform: `translate(-50%, ${v === 'top' ? '-50%' : '50%'})`,
      fontFamily: 'monospace',
      fontSize: '13px',
      lineHeight: 1,
      color: '#9ca3af',
      zIndex: 10,
    }}
  >+</span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: 'FunnelDisplay, sans-serif', color: '#9ca3af' }}>
    {children}
  </p>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-light leading-snug text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
    {children}
  </h2>
);

const COMPARISON_DATA = [
  {
    dimension: "Core Focus",
    whoop: "Recovery, strain and performance for athletes",
    apple: "All-around health and fitness ecosystem",
    oura: "Sleep and wellness insights, sleep first"
  },
  {
    dimension: "Sleep Tracking",
    whoop: "Very strong — sleep performance percentage and sleep need estimation",
    apple: "Good basic tracking, recently added sleep score but less detailed than ring solutions",
    oura: "Best-in-class sleep insights with detailed staging and trends"
  },
  {
    dimension: "Recovery Insights",
    whoop: "Excellent — combines HRV, sleep, and strain into recovery signals used for guidance",
    apple: "Limited direct recovery interpretation, focuses more on raw metrics",
    oura: "Strong recovery metrics tied to sleep and HRV trends"
  },
  {
    dimension: "Activity and Fitness",
    whoop: "Strain focus — workload, exertion, injury prevention",
    apple: "Full fitness suite with workouts, GPS, pace, zones — best for multi-sport",
    oura: "Basic activity tracking, steps and simple activity"
  },
  {
    dimension: "Heart Rate Metrics",
    whoop: "Continuous HR trends, HRV emphasized",
    apple: "Very accurate real-time HR, adds ECG and AFib detection",
    oura: "Resting HR and HRV included, deep sleep HR trends"
  },
  {
    dimension: "Scoring and Insights",
    whoop: "Personalised readiness, recovery and strain scores with coaching nudges",
    apple: "Aggregates raw data, sleep score exists but often higher than Oura test scores",
    oura: "Sleep score, readiness trends, temperature and biometrics tied to predictions"
  },
  {
    dimension: "Integration",
    whoop: "App with subscription-based insights, no watch interface",
    apple: "Deep iOS integration, third-party apps via HealthKit",
    oura: "Ring focused, integrates with Apple Health for broader ecosystem"
  },
  {
    dimension: "User Experience",
    whoop: "For users who want performance and training optimisation",
    apple: "For general wellness with smartwatch convenience",
    oura: "For users who want deep, passive health and sleep insights"
  },
  {
    dimension: "Business Model",
    whoop: "Membership required for full insights",
    apple: "Core platform free, Apple Watch hardware cost",
    oura: "Membership required for premium insights"
  }
];

export default function Sol() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('sol-brief');
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [activeMobileDim, setActiveMobileDim] = useState<number | null>(0);
  const [isDesignHovered, setIsDesignHovered] = useState(false);

  const sections = [
    { id: 'sol-brief', label: 'Overview' },
    { id: 'sol-problem', label: 'Problem' },
    { id: 'sol-approach', label: 'Approach' },
    { id: 'sol-findings', label: 'Research' },
    { id: 'sol-ideation', label: 'Ideation' },
    { id: 'sol-design', label: 'Concept' },
    { id: 'sol-core-idea', label: 'Core Idea' },
    { id: 'sol-app-design', label: 'Design' },
    { id: 'sol-vision', label: 'Vision' },
  ];

  const designSubsections = [
    { id: 'sol-onboarding', label: 'Onboarding' },
    { id: 'sol-plans', label: 'Plans' },
    { id: 'sol-app-structure', label: 'App Structure' },
    { id: 'sol-device-pairing', label: 'Device Pairing' },
    { id: 'sol-home', label: 'Home' },
    { id: 'sol-edu-content', label: 'Educational Content' },
    { id: 'sol-progress', label: 'Progress' },
    { id: 'sol-insights', label: 'Insights' },
    { id: 'sol-sol-ai', label: 'Sol AI' },
    { id: 'sol-monetisation', label: 'Monetisation' },
    { id: 'sol-sensor-logging', label: 'Sensor Logging' },
    { id: 'sol-dynamic-island', label: 'Dynamic Island' },
  ];

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    designSubsections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prev = document.documentElement.style.background;
    document.documentElement.style.background = 'white';
    document.body.style.background = 'white';
    return () => {
      document.documentElement.style.background = prev;
      document.body.style.background = '';
    };
  }, []);

  const stats = [
    { value: '4', label: 'Core constraints', sub: 'Identified before a single screen was designed' },
    { value: '5', label: 'Competitors benchmarked', sub: 'Apple Health, Whoop, Oura and more' },
    { value: 'End to End', label: 'Full design ownership', sub: 'Research, ideation, visual design and documentation' },
  ];

  return (
    <div className="bg-white min-h-screen mt-16 px-4 md:px-0">

      {/* ── Sticky sidebar ──────────────────────────────────────────── */}
      {mounted && createPortal(
        <>
          <nav
            className="hidden xl:flex fixed z-[9999]"
            style={{ top: '50%', transform: 'translateY(-50%)', left: '26px' }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-12px',
                bottom: '-12px',
                left: '-26px',
                width: '32px',
                border: '1px solid #d1d5db',
                borderLeft: 'none',
                borderTopRightRadius: '16px',
                borderBottomRightRadius: '16px',
                zIndex: -1,
              }}
            />
            <div className="flex flex-col">
              {sections.map((s) => {
                const isActive = s.id === 'sol-app-design'
                  ? (activeSection === 'sol-app-design' || designSubsections.some(sub => sub.id === activeSection))
                  : activeSection === s.id;
                const isDesignActive = activeSection === 'sol-app-design' || designSubsections.some(sub => sub.id === activeSection);
                const isDesignExpanded = isDesignActive || isDesignHovered;

                if (s.id === 'sol-app-design') {
                  return (
                    <div
                      key={s.id}
                      onMouseEnter={() => setIsDesignHovered(true)}
                      onMouseLeave={() => setIsDesignHovered(false)}
                      className="flex flex-col"
                    >
                      <button
                        onClick={() => {
                          const el = document.getElementById(s.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
                        className="cursor-pointer flex items-center gap-3 py-[6px] text-left group relative w-full"
                      >
                        <span
                          className="shrink-0 flex items-center justify-center transition-all duration-300 relative z-10 bg-white"
                          style={{ width: '11px', height: '11px' }}
                        >
                          {isActive ? (
                            <span style={{ width: '7px', height: '7px', background: ACCENT, display: 'block' }} />
                          ) : (
                            <span
                              style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: 1, color: '#9ca3af', display: 'block' }}
                              className="group-hover:text-gray-500 transition-colors duration-200"
                            >+</span>
                          )}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-[0.15em] transition-all duration-200 whitespace-nowrap ${isActive ? 'font-semibold' : 'text-gray-400 group-hover:text-gray-600'
                            }`}
                          style={isActive ? { color: ACCENT } : {}}
                        >
                          {s.label}
                        </span>
                      </button>

                      {/* Accordion Subsections */}
                      <div
                        style={{
                          transition: 'max-height 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease-out, margin 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                          maxHeight: isDesignExpanded ? '250px' : '0px',
                          opacity: isDesignExpanded ? 1 : 0,
                          marginTop: isDesignExpanded ? '2px' : '0px',
                          marginBottom: isDesignExpanded ? '2px' : '0px',
                          overflow: 'hidden',
                        }}
                      >
                        <div className="flex flex-col border-l border-gray-200 ml-[5px] pl-[14px] py-1 gap-[2px] relative">
                          {designSubsections.map((sub) => {
                            const isSubActive = activeSection === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  const el = document.getElementById(sub.id);
                                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className="cursor-pointer text-left py-[2.5px] text-[8px] tracking-wider uppercase font-medium relative transition-colors duration-200 whitespace-nowrap block w-full"
                                style={{
                                  fontFamily: 'FunnelDisplay, sans-serif',
                                  color: isSubActive ? ACCENT : '#9ca3af',
                                }}
                              >
                                {isSubActive && (
                                  <span
                                    className="absolute w-[5px] h-[5px] rounded-full animate-fade-in"
                                    style={{
                                      left: '-16.5px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      background: ACCENT
                                    }}
                                  />
                                )}
                                <span className={isSubActive ? 'font-semibold text-black' : 'hover:text-gray-600 transition-colors'}>
                                  {sub.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      const el = document.getElementById(s.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
                    className="cursor-pointer flex items-center gap-3 py-[6px] text-left group relative"
                  >
                    <span
                      className="shrink-0 flex items-center justify-center transition-all duration-300 relative z-10 bg-white"
                      style={{ width: '11px', height: '11px' }}
                    >
                      {isActive ? (
                        <span style={{ width: '7px', height: '7px', background: ACCENT, display: 'block' }} />
                      ) : (
                        <span
                          style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: 1, color: '#9ca3af', display: 'block' }}
                          className="group-hover:text-gray-500 transition-colors duration-200"
                        >+</span>
                      )}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-[0.15em] transition-all duration-200 whitespace-nowrap ${isActive ? 'font-semibold' : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                      style={isActive ? { color: ACCENT } : {}}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </>,
        document.body
      )}

      <div className="relative overflow-visible max-w-5xl mx-auto border-l border-r border-t border-gray-200">
        <Plus h="left" v="top" />
        <Plus h="right" v="top" />

        {/* ── Project Header ──────────────────────────────────────────── */}
        <div className="relative overflow-visible flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-200 bg-white">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden">
            <Image
              src="/images/WorkImages/Sol/sol_mainlogo.svg"
              alt="Sol logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-light tracking-tight" style={{ fontFamily: 'SatishSans, sans-serif' }}>
            Sol
          </h1>
          <Image src="/images/common/vg-outline.svg" alt="Product Design Work" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-20" />
          <Plus h="left" />
          <Plus h="right" />
        </div>

        {/* ── Brief ───────────────────────────────────────────────────── */}
        <div id="sol-brief" className="relative overflow-visible border-b border-gray-200">

          {/* Meta strip */}
          <div className="relative flex flex-wrap md:flex-nowrap items-stretch border-b border-gray-200">
            {[
              { label: 'Company', value: 'Sol Energy' },
              { label: 'Role', value: 'Product Designer' },
              { label: 'Deliverable', value: 'End-to-End App Design' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-6 md:px-8 py-3 ${i === 1 ? 'border-l border-gray-200' : ''} ${i === 2 ? 'w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-200' : ''}`}
              >
                <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.label}</span>
                <span className="text-[11px] text-gray-700 whitespace-nowrap" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.value}</span>
              </div>
            ))}
            {/* Scope marquee — full row on mobile, inline on desktop */}
            <div className="flex items-center gap-2 w-full md:w-auto pl-6 md:pl-8 pr-6 py-3 border-t md:border-t-0 md:border-l border-gray-200 overflow-hidden min-w-0 md:flex-1">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Scope</span>
              <div className="overflow-hidden flex-1" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)' }}>
                <div className="flex gap-2 w-max" style={{ animation: 'marquee 12s linear infinite' }}>
                  {['UI/UX', 'iOS App', 'Health & Fitness', 'Design System', 'Wearables', 'Product Strategy', 'UI/UX', 'iOS App', 'Health & Fitness', 'Design System', 'Wearables', 'Product Strategy'].map((tag, idx) => (
                    <span key={idx} className="text-[9px] px-2 py-0.5 border border-gray-200 text-gray-500 whitespace-nowrap" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full-width cover image */}
          <div className="w-full border-b border-gray-200">
            <Image
              src="/images/WorkImages/Sol/main_thumb.png"
              alt="Sol Energy Cover"
              width={1600}
              height={900}
              className="w-full h-auto block"
              priority
            />
          </div>

          {/* Brief content */}
          <div className="border-b border-gray-200 px-6 md:px-10 py-8 md:py-12">
            <SectionLabel>The Brief</SectionLabel>
            <SectionHeading>A planning system guided by the body.</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Most health apps hand you numbers and leave you to figure out what they mean. Heart rate. HRV. Sleep score. A wall of metrics that tells you everything except the one thing you actually need to know — what should I do today, and when?
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Sol is a premium health and fitness tracking app built around a different idea entirely. Instead of showing users data, it reads their body's natural rhythms and tells them what to do, when to do it, and how hard to push. The brief was to design a luxurious, sophisticated mobile experience that tracks health metrics, surfaces personalised fitness plans, and delivers detailed analytics — all without overwhelming the user.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              The challenge was not just making it look premium. It was making complex biometric data feel effortless and human.
            </p>
          </div>

          {/* Impact Numbers */}
          <div className="relative overflow-visible grid grid-cols-1 md:grid-cols-3 border-b border-gray-200">
            <PlusAt x="33.33%" v="top" desktop />
            <PlusAt x="66.66%" v="top" desktop />
            <PlusAt x="33.33%" desktop />
            <PlusAt x="66.66%" desktop />
            {stats.map((s) => {
              const isHovered = hoveredStat === s.value;
              return (
                <div
                  key={s.value}
                  className="relative px-8 py-8 md:px-10 border-b border-gray-200 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredStat(s.value)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  {/* Gradient bg overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(150% 60% at 50% 100%, rgba(255,159,10,0.22) 0%, transparent 100%)',
                      opacity: isHovered ? 1 : 0,
                      transition: isHovered ? 'opacity 0.3s ease-in' : 'opacity 0.15s ease-out',
                    }}
                  />
                  <p
                    className="text-5xl font-light mb-3"
                    style={{
                      fontFamily: 'SatishSans, sans-serif',
                      color: isHovered ? ACCENT : '#000000',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="text-sm text-gray-700 leading-snug mb-1" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    {s.label}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-[260px]" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    {s.sub}
                  </p>
                </div>
              );
            })}
            <Plus h="left" />
            <Plus h="right" />
          </div>
        </div>

        {/* ── The Problem ────────────────────────────────────────────── */}
        <div id="sol-problem" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 pt-10 pb-6">
            <SectionLabel>The Problem</SectionLabel>
            <SectionHeading>People don't struggle with data. They struggle with direction.</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Health apps have a data problem — not a lack of it, but too much of it presented in the wrong way. Users are handed heart rate numbers, HRV scores, sleep percentages, and step counts with no context for what any of it means in the moment. The result is an experience that feels more like a medical dashboard than a personal guide.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-8" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Four questions kept surfacing in research, across every type of user:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h4 className="text-base font-semibold text-black mb-1.5" style={{ fontFamily: 'SatishSans, sans-serif' }}>"I don't know what to do today."</h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Too much data, no clear starting point. Users open the app and feel overwhelmed before they have even started.
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black mb-1.5" style={{ fontFamily: 'SatishSans, sans-serif' }}>"I don't know when to do it."</h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Timing matters as much as the activity itself. A workout at the wrong time in your recovery cycle does more harm than good. No app was telling users this.
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black mb-1.5" style={{ fontFamily: 'SatishSans, sans-serif' }}>"I don't know how hard to push."</h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Effort without context is guesswork. Users were either under-training out of caution or over-training out of ambition, with nothing to guide the middle ground.
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black mb-1.5" style={{ fontFamily: 'SatishSans, sans-serif' }}>"I don't know if I'm pacing well over time."</h4>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Progress is invisible when you are only looking at today. Users had no way to understand whether their patterns over weeks were moving in the right direction.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-200">
            <Image
              src="/images/WorkImages/Sol/problem.png"
              alt="Sol Problem Analysis"
              width={1600}
              height={900}
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* ── The Approach ───────────────────────────────────────────── */}
        <div id="sol-approach" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 py-10">
            <SectionLabel>The Approach</SectionLabel>
            <SectionHeading>Understanding the body before designing for it.</SectionHeading>

            <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Before any wireframe or visual decision, the work started with building a genuine understanding of the problem space. Health and fitness is a domain where bad design does not just frustrate users — it creates anxiety, compulsive behaviour, and eventually disengagement. Getting the approach wrong had real consequences.
            </p>

            <h3 className="text-xl font-light text-black mt-8 mb-6 border-b border-gray-100 pb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>
              The process followed three phases, each informing the next.
            </h3>

            <div className="space-y-8">
              {/* Phase 1 */}
              <div>
                <h4 className="text-lg font-medium text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>1. Building domain knowledge</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The first step was reading. Articles on wearable technology, biometric tracking, and how health apps process body data. The goal was not to become an expert but to understand what was actually being measured, what the data meant, and where the gaps between raw signal and human understanding were widest.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  One insight became the anchor for everything that followed: bodies operate in rhythms, not scores. Energy rises and falls during the day. Recovery improves or degrades across nights. Sleep quality stabilises or destabilises across weeks. Stress accumulates and releases in patterns. Designing around this meant ditching the score-based model entirely and building around time and rhythm instead.
                </p>
              </div>

              {/* Phase 2 */}
              <div>
                <h4 className="text-lg font-medium text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>2. Identifying constraints early</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Rather than jumping to solutions, the next step was mapping what could go wrong. Four constraints were identified before a single screen was designed:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    "Wearable data is noisy and incomplete — the system had to make good decisions even with imperfect inputs.",
                    "Users do not understand most health metrics — everything needed to be translated into plain language before it reached the screen.",
                    "Scores create anxiety and compulsive checking — Sol would guide, not judge.",
                    "Guidance needs timing, not frequency — the right nudge at the right moment matters far more than constant reminders."
                  ].map((constraint, idx) => (
                    <div key={idx} className="p-4 border border-gray-100 bg-gray-50/50 flex gap-3">
                      <span className="text-sm text-gray-400 font-mono" style={{ color: ACCENT }}>+</span>
                      <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{constraint}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  These constraints became design principles that every screen was tested against.
                </p>
              </div>

              {/* Phase 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-lg font-medium text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>3. Competitive landscape</h4>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    Apple Health, Whoop, and Oura were benchmarked to understand where the category was strong and where it fell short. The pattern was consistent across all three — they excelled at data collection and struggled at guidance. They told users what their body had done. None of them told users what to do next. That gap was exactly where Sol was designed to live.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>4. Ideation and direction</h4>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    With research locked, ideation focused on one question: what does a health app look like when it leads with rhythm instead of scores? The answer shaped everything — the home screen, the daily state model, the way analytics were visualised, and how the Dynamic Island integration was approached. Every screen had to feel like guidance, not reporting.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Research & Findings ─────────────────────────────────────── */}
        <div id="sol-findings" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 py-10">
            <SectionLabel>Research & Findings</SectionLabel>
            <SectionHeading>What we learned before touching the interface.</SectionHeading>

            {/* Sub-section 1: Wearables and health apps */}
            <div className="mb-10">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Building an understanding of wearable and health apps
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Before any ideation, the work started with reading. Articles on wearable technology, how health apps process biometric data, and what types of body metrics they can actually track. This was done deliberately — to understand the space well enough to know what was worth building and what was already being done poorly.
                <br /><br />
                Three key articles shaped the early direction, covering what wearables are, how they work in medical and consumer contexts, and how the category has evolved. A deeper dive into the competitive landscape followed from there.
              </p>
              <div className="w-full">
                <Image
                  src="/images/WorkImages/Sol/wearable.png"
                  alt="Wearable Biometric Research"
                  width={1600}
                  height={900}
                  className="w-full h-auto block"
                />
              </div>
            </div>

            {/* Sub-section 2: Constraints identified early */}
            <div className="mb-10 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Constraints identified early
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Four constraints surfaced before a single screen was designed. These were not assumptions — they were patterns that kept appearing across research:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { title: "Wearable data is noisy and incomplete", text: "Sensors miss readings, signals degrade with movement, and gaps in data are inevitable. The design had to hold up even when inputs were imperfect." },
                  { title: "Users don't understand most health metrics", text: "Heart rate variability, respiratory rate, blood oxygen — these mean very little to the average person without context and translation." },
                  { title: "Scores create anxiety and compulsive checking", text: "A single number that resets every day encourages users to optimise for the score rather than their actual health. Sol needed to move away from this entirely." },
                  { title: "Guidance needs timing, not frequency", text: "One well-timed nudge is worth more than ten generic reminders. The when matters as much as the what." }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 bg-gray-50/50 flex flex-col gap-1.5">
                    <h4 className="text-sm font-semibold text-black flex items-center gap-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                      <span className="font-mono" style={{ color: ACCENT }}>+</span> {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed pl-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="w-full">
                <Image
                  src="/images/WorkImages/Sol/Constraints.png"
                  alt="Sol Research Constraints"
                  width={1600}
                  height={900}
                  className="w-full h-auto block"
                />
              </div>
            </div>

            {/* Sub-section 3: What people actually struggle with */}
            <div className="mb-10 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                What people actually struggle with
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Users do not think about their health in terms of metrics. They think about their day. The real questions they are asking are:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  "I don't know what to do today.",
                  "I don't know when to do it.",
                  "I don't know how hard to push.",
                  "I don't know if I'm pacing well over time."
                ].map((q, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 bg-gray-50/50 flex gap-3 items-center">
                    <span className="text-sm font-semibold" style={{ fontFamily: 'SatishSans, sans-serif', color: ACCENT }}>0{idx + 1}</span>
                    <p className="text-sm text-gray-800 font-medium" style={{ fontFamily: 'SatishSans, sans-serif' }}>"{q}"</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Nobody wakes up thinking "I want heart rate" or "I want HRV." They wake up wanting to know what their body is ready for. That gap between how apps speak and how users think was the core design problem Sol needed to solve.
              </p>
            </div>

            {/* Sub-section 4: Bodies operate in rhythms, not scores */}
            <div className="mb-10 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Bodies operate in rhythms, not scores
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Human physiology does not reset every day like a score. It moves in continuous patterns across hours, days, and weeks. Energy rises and falls during the day. Recovery improves or degrades across nights. Sleep quality stabilises or destabilises across weeks. Stress accumulates and releases in patterns.
                <br /><br />
                Designing around this rhythm rather than a daily score was the single most important shift in the entire project. Everything that followed — the home screen, the insights model, the way time is visualised — came from this one insight.
              </p>
              <div className="w-full flex justify-center">
                <Image
                  src="/images/WorkImages/Sol/rythm.svg"
                  alt="Physiological Rhythms Model"
                  width={800}
                  height={400}
                  className="w-full max-w-2xl h-auto block"
                />
              </div>
            </div>

            {/* Sub-section 5: Metrics that can be tracked with proficiency */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Metrics that can be tracked with proficiency
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Not all data is worth showing. A focused set of signals emerged from research that are both meaningful and accessible without requiring clinical hardware:
                <br /><br />
                Heart rate trend, sleep duration and quality, activity and workouts, and HRV translated into a recovery signal. These four inputs alone are enough to power a daily health state, meaningful insights, personalised fitness plans, and detailed analytics views.
                <br /><br />
                Optional signals — blood oxygen, respiratory rate, nutrition macros, environmental alerts — can layer on top without cluttering the core experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex justify-center p-6 bg-gray-50/30">
                  <Image src="/images/WorkImages/Sol/metric1.svg" alt="Core Biometrics Metric 1" width={180} height={180} className="object-contain" />
                </div>
                <div className="flex justify-center p-6 bg-gray-50/30">
                  <Image src="/images/WorkImages/Sol/metric2.svg" alt="Core Biometrics Metric 2" width={180} height={180} className="object-contain" />
                </div>
              </div>
            </div>

            {/* Sub-section 6: Competitive Landscape */}
            <div className="pt-6 border-t border-gray-100">
              <span className="text-[10px] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'FunnelDisplay, sans-serif', color: '#9ca3af' }}>
                Competitive Landscape
              </span>
              <h3 className="text-xl md:text-2xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                How Sol sits against the market.
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Three products dominate the premium health tracking space. Each excels in a specific area and falls short in the same place — guidance. They report on the body. Sol guides it.
              </p>

              {/* Desktop Table View */}
              <div className="hidden md:block w-full overflow-hidden border border-gray-200 bg-white">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4" style={{ fontFamily: 'SatishSans, sans-serif' }}>Dimension</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4" style={{ fontFamily: 'SatishSans, sans-serif' }}>WHOOP</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4" style={{ fontFamily: 'SatishSans, sans-serif' }}>Apple Health</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4" style={{ fontFamily: 'SatishSans, sans-serif' }}>Oura Ring</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {COMPARISON_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-gray-900 text-xs" style={{ fontFamily: 'SatishSans, sans-serif' }}>{row.dimension}</td>
                        <td className="py-4 px-4 text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{row.whoop}</td>
                        <td className="py-4 px-4 text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{row.apple}</td>
                        <td className="py-4 px-4 text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{row.oura}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card-Based Grid View */}
              <div className="md:hidden space-y-4">
                <p className="text-xs text-gray-400 mb-2 italic" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Tap any dimension to compare details
                </p>
                {COMPARISON_DATA.map((row, idx) => {
                  const isOpen = activeMobileDim === idx;
                  return (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 transition-all duration-300 bg-white"
                      style={{
                        borderColor: isOpen ? ACCENT : '#e5e7eb',
                        boxShadow: isOpen ? '0 4px 20px -2px rgba(255, 159, 10, 0.08)' : 'none'
                      }}
                    >
                      <button
                        onClick={() => setActiveMobileDim(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left focus:outline-none"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span
                            className="text-sm font-semibold transition-colors duration-300"
                            style={{
                              fontFamily: 'SatishSans, sans-serif',
                              color: isOpen ? '#000000' : '#374151'
                            }}
                          >
                            {row.dimension}
                          </span>
                          {!isOpen && (
                            <span className="text-[9px] text-gray-400 font-light uppercase tracking-wider" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                              Compare Brands
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {!isOpen && (
                            <div className="flex -space-x-1.5 opacity-80">
                              <span className="w-[10px] h-[10px] rounded-full border border-white bg-black shrink-0" />
                              <span className="w-[10px] h-[10px] rounded-full border border-white bg-[#FF2D55] shrink-0" />
                              <span className="w-[10px] h-[10px] rounded-full border border-white bg-[#BFA15F] shrink-0" />
                            </div>
                          )}

                          <span
                            className="transition-transform duration-300"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isOpen ? ACCENT : '#9ca3af' }}>
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </span>
                        </div>
                      </button>

                      {/* Content (Expanded) */}
                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: isOpen ? '800px' : '0px',
                          opacity: isOpen ? 1 : 0,
                          marginTop: isOpen ? '14px' : '0px',
                          visibility: isOpen ? 'visible' : 'hidden'
                        }}
                      >
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          {/* WHOOP */}
                          <div className="pl-3 border-l-2 border-black py-0.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-black" />
                              <span className="text-[10px] tracking-wider uppercase font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                                WHOOP
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-light leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                              {row.whoop}
                            </p>
                          </div>

                          {/* Apple Health */}
                          <div className="pl-3 border-l-2 border-[#FF2D55] py-0.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D55]" />
                              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#FF2D55]" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                                Apple Health
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-light leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                              {row.apple}
                            </p>
                          </div>

                          {/* Oura Ring */}
                          <div className="pl-3 border-l-2 border-[#BFA15F] py-0.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
                              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#BFA15F]" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                                Oura Ring
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-light leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                              {row.oura}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Position Takeaway block */}
            <div className="pt-12 mt-12 border-t border-gray-100">
              <span className="text-[10px] uppercase tracking-widest mb-2 block" style={{ fontFamily: 'FunnelDisplay, sans-serif', color: '#9ca3af' }}>
                Strategic Position
              </span>
              <h3 className="text-xl md:text-2xl font-light text-black mb-8" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Where Sol takes the lead.
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Takeaways list */}
                <div className="lg:col-span-7 space-y-6">
                  {[
                    {
                      title: "Insight over scores",
                      desc: "All three competitors lead with daily scores. Sol interprets rhythms instead, giving users direction rather than a number to optimise."
                    },
                    {
                      title: "Proactive guidance",
                      desc: "Whoop nudges based on recovery. Sol extends this with causal understanding and context, surfacing the right action at the right moment."
                    },
                    {
                      title: "Sleep depth",
                      desc: "Oura leads on sleep tracking. Sol learns how deep sleep and recovery trends influence daily energy and makes that connection visible to the user."
                    },
                    {
                      title: "The gap none of them fill",
                      desc: "Timing. None of the three tell users when to act on their data. That is exactly where Sol lives."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="group flex gap-4 p-4 border border-gray-50 bg-gray-50/20 hover:bg-gray-50/40 transition-all duration-300">
                      <span className="text-xs font-mono font-bold select-none text-[#FF9F0A]">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-black" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Images showcase */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <div className="overflow-hidden">
                    <Image
                      src="/images/WorkImages/Sol/takeaway1.png"
                      alt="Sol Strategic Takeaway 1"
                      width={400}
                      height={600}
                      className="w-full h-auto object-contain block"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <Image
                      src="/images/WorkImages/Sol/takeaway2.png"
                      alt="Sol Strategic Takeaway 2"
                      width={400}
                      height={600}
                      className="w-full h-auto object-contain block"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Ideation ────────────────────────────────────────────────── */}
        <div id="sol-ideation" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 py-10">
            <SectionLabel>Ideation</SectionLabel>
            <SectionHeading>From insight to idea.</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              With research locked and constraints defined, ideation focused on one central question: what does a health app look like when it leads with guidance instead of data? The answer did not come from adding more features — it came from stripping the model back to something much simpler.
            </p>

            {/* The Core Idea */}
            <div className="mb-10">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                The Core Idea
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                User selects a goal. Wearable provides data. Sol converts that data into actionable insights and analysis of the body.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                That is the entire product in one sentence. The elegance of it was intentional. Every feature, every screen, every design decision had to serve this loop — goal, data, guidance. Anything that did not fit was cut.
              </p>
            </div>

            {/* SVG Image Showcase */}
            <div className="w-full border-t border-b border-gray-100 py-8 my-8 flex justify-center bg-gray-50/20">
              <Image
                src="/images/WorkImages/Sol/idea.svg"
                alt="Sol Ideation Loop Diagram showing the system flow: user selects a goal, wearable provides health tracking data, and Sol translates it into personalized guidance actions"
                width={988}
                height={876}
                className="w-full max-w-3xl h-auto block"
              />
            </div>

            {/* Key Features Defined */}
            <div className="mb-10 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Key Features Defined
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Three features emerged from ideation as the non-negotiables:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Rhythm-centred Insights",
                    desc: "One clear insight at a time. Not a dashboard of metrics — a single, well-timed nudge that tells the user exactly what they need to know right now. Quiet, unobtrusive, always relevant."
                  },
                  {
                    title: "Pattern-Driven Plan System",
                    desc: "Plans that are goal-oriented and adapt as patterns change. Sleep and Energy is one plan, not the whole product. Build Strength is another. Lose Weight is another. Each plan pulls from wearable inputs and produces a specific set of outputs tailored to that goal."
                  },
                  {
                    title: "Trend-First Progress View",
                    desc: "Progress shown as direction and stability over time, not isolated daily values. A weight trend chart that shows where things are heading. A sleep pattern view that shows whether consistency is improving. The question Sol answers is not 'how did I do today' but 'am I moving in the right direction.'"
                  }
                ].map((feat, idx) => (
                  <div key={idx} className="p-5 border border-gray-100 bg-gray-50/30 flex flex-col gap-2">
                    <span className="text-xs font-mono font-bold text-[#FF9F0A]">0{idx + 1}</span>
                    <h4 className="text-base font-semibold text-black" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                      {feat.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-light" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Principles */}
            <div className="mb-10 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Design Principles
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Four principles were set before a single screen was designed. These were not aesthetic guidelines — they were behavioural commitments about how Sol would treat the user:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "No scores, rankings, or labels that make users feel evaluated",
                    desc: "The body is not a test to pass. Sol avoids any language or visual pattern that creates judgment. No recovery percentage. No readiness score. No ring to close."
                  },
                  {
                    title: "The body does not restart every morning",
                    desc: "Sol focuses on trends, direction, and stability over time rather than isolated daily values. A bad night's sleep is contextualised against the week, not treated as a failure."
                  },
                  {
                    title: "Users want to know what to do first. Explanations come second",
                    desc: "Guidance is always the lead. Data and reasoning are always accessible but never in the way of action. The user should never have to read before they can act."
                  },
                  {
                    title: "The goal is better decisions, not a report card",
                    desc: "Sol is designed to help people make better decisions about their own body — not to tell them how well they are doing."
                  }
                ].map((princ, idx) => (
                  <div key={idx} className="p-5 border border-gray-100 bg-gray-50/20 flex gap-4">
                    <span className="text-sm font-semibold font-mono text-[#FF9F0A] shrink-0">0{idx + 1}</span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-black" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                        {princ.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-light" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                        {princ.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assumptions */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xl font-light text-black mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Assumptions
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Three assumptions underpin the entire product model. These were not ignored — they were documented deliberately so the design could account for the moments when any of them breaks down:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  "Data exists — the user has a wearable that is actively tracking.",
                  "Permissions are granted — the user has consented to share biometric data with Sol.",
                  "The system is reliable — sensor data is accurate enough to generate meaningful patterns over time."
                ].map((assumption, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 bg-gray-50/50 flex gap-3">
                    <span className="text-sm text-gray-400 font-mono" style={{ color: ACCENT }}>+</span>
                    <p className="text-xs text-gray-500 leading-relaxed font-light" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{assumption}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Design ──────────────────────────────────────────────────── */}
        <div id="sol-design" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 py-10">
            <SectionLabel>Concept</SectionLabel>
            <SectionHeading>Introducing Sol</SectionHeading>

            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Most health products are built around measurement. Users are presented with sleep scores, recovery metrics, readiness indicators, and activity data, then expected to interpret what those numbers mean for their day.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              During research, I noticed a disconnect. People rarely ask for more data. Instead, they ask simpler questions:
            </p>

            {/* Simpler Questions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              {[
                "How am I doing today?",
                "Should I train or recover?",
                "Why do I feel different than yesterday?"
              ].map((q, idx) => (
                <div key={idx} className="p-4 border border-gray-100 bg-gray-50/50 flex items-center justify-center text-center rounded-lg">
                  <p className="text-sm italic font-medium text-gray-800" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    "{q}"
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-4 font-semibold text-black mt-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Sol was born from that observation.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Named after the Spanish word for Sun, the product takes inspiration from something predictable, cyclical, and non-judgmental. People don't compete with the sun or optimize for it. They simply understand its patterns and plan around them. Sol applies the same philosophy to the human body.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Rather than functioning as another health dashboard, Sol acts as a planning system powered by biometric data. By combining wearable signals, behavioral patterns, and contextual inputs, the product translates complex health information into practical recommendations that help users make better decisions throughout the day.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              The goal wasn't to build a tool that tracks health. The goal was to build a product that helps people act on it.
            </p>

            {/* Design Showcase Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
              <div className="flex justify-center">
                <Image
                  src="/images/WorkImages/Sol/intro.svg"
                  alt="Sol Mobile Application Home Screen Design showing goal selection overview"
                  width={538}
                  height={364}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/WorkImages/Sol/intro1.svg"
                  alt="Sol Mobile Application Main Interface mockup showcasing daily health state metrics"
                  width={537}
                  height={364}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/WorkImages/Sol/intro3.svg"
                  alt="Sol Mobile Application Analytics Interface mockup displaying detailed heart rate trend lines"
                  width={538}
                  height={363}
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── Core Product Idea ────────────────────────────────────────── */}
        <div id="sol-core-idea" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 py-10">
            <SectionLabel>Core Product Idea</SectionLabel>
            <SectionHeading>Helping users decide what to do next.</SectionHeading>

            <p className="text-sm text-gray-500 leading-relaxed mb-4 font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Most health products focus on helping users understand their data. Sol focuses on helping users decide what to do next.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              That distinction became the foundation of the product.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Through research, I noticed that users rarely struggle to access health information. Modern wearables already provide sleep scores, recovery metrics, heart rate trends, and activity data. The challenge is translating those signals into meaningful actions.
            </p>

            {/* Large Accent Statement */}
            <div className="my-8 pl-4 border-l-2 border-[#FF9F0A]">
              <p className="text-base md:text-lg font-light text-black leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                People don't wake up wanting more health data. They wake up wanting answers.
              </p>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              {[
                "Should I push harder today?",
                "Should I prioritize recovery?",
                "Why am I feeling low on energy?",
                "Am I making progress toward my goal?"
              ].map((q, idx) => (
                <div key={idx} className="p-4 bg-gray-50/10 border border-gray-100 flex items-center justify-center text-center rounded-lg">
                  <p className="text-xs italic text-gray-700 font-medium" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    "{q}"
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Instead of creating another dashboard filled with metrics, I explored what a health product would look like if it functioned more like a decision-making system.
            </p>

            {/* The Core Concept Callout */}
            <div className="my-8 p-6 bg-[#FF9F0A]/5 border border-[#FF9F0A]/10 text-center rounded-lg">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>The Core Concept</p>
              <p className="text-xl md:text-2xl font-light text-black" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Turn biometric data into personalized actions.
              </p>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Rather than asking users to interpret complex signals themselves, Sol continuously analyzes wearable data, behavioral patterns, and contextual inputs to recommend what matters most in the moment.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              This shift reframed the product from a tracking tool into a personal operating system for health.
            </p>

            {/* Core Showcase Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
              <div className="flex justify-center">
                <Image
                  src="/images/WorkImages/Sol/core1.svg?v=2"
                  alt="Sol Mobile Application mockup highlighting Rhythm-centred Insights feature cards"
                  width={317}
                  height={164}
                  className="w-full max-w-[317px] h-auto object-contain block"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/WorkImages/Sol/core2.svg?v=2"
                  alt="Sol Mobile Application mockup highlighting Pattern-Driven Plan System settings"
                  width={317}
                  height={163}
                  className="w-full max-w-[317px] h-auto object-contain block"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/WorkImages/Sol/core3.svg?v=2"
                  alt="Sol Mobile Application mockup highlighting Trend-First Progress View charts"
                  width={317}
                  height={164}
                  className="w-full max-w-[317px] h-auto object-contain block"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── App Design ──────────────────────────────────────────────── */}
        <div id="sol-app-design" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 py-10">
            <SectionLabel>Design</SectionLabel>

            {/* Subsection 1: Onboarding */}
            <div id="sol-onboarding" className="mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Onboarding: Sol is not here to track you. It's here to guide you.
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mt-6">
                {/* Left Column: Text Content */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    The onboarding experience was designed to communicate a simple idea: Sol is not here to track you. It's here to guide you.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    Most health applications begin with permissions, integrations, and device setup. While necessary, these steps often feel disconnected from the user's actual motivation for downloading the product.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    I wanted onboarding to start with intent rather than technology.
                  </p>

                  {/* Visual Highlight statement */}
                  <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                    <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                      Users first define what they care about improving, whether that's increasing energy, building strength, improving sleep, or losing weight. This goal becomes the lens through which Sol interprets incoming data.
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    From there, wearable devices and preferences are connected progressively, helping users understand why data is being collected and how it contributes to future recommendations.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    By the end of onboarding, users don't just understand what Sol measures. They understand how Sol thinks.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    That distinction became important because the success of the product depends on trust. Users need confidence that recommendations are aligned with their goals rather than being generic health advice.
                  </p>
                </div>

                {/* Right Column: Onboarding Video Demo */}
                <div className="flex justify-center md:sticky md:top-24">
                  <video
                    className="w-full max-w-[320px] h-auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                    title="Sol Goal-Oriented Mobile Onboarding Flow Video"
                    aria-label="Interactive demo of Sol onboarding flow where users define their health improvement goals"
                  >
                    <source src="/images/WorkImages/Sol/onboard.mp4" type="video/mp4" />
                    Your browser does not support the HTML5 video tag. This video demonstrates the Sol mobile application's onboarding process, showing how a user selects a health goal (such as sleep consistency or building strength) and progressively connects their wearables.
                  </video>
                </div>
              </div>
            </div>

            {/* Subsection 2: Plans */}
            <div id="sol-plans" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Plans: Organizing the experience around goals.
              </h3>

              {/* Text Content */}
              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  One of the earliest decisions I made was to avoid building another health dashboard.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Most health products present users with the same collection of metrics regardless of what they are trying to achieve. Sleep, recovery, heart rate, activity, and dozens of other signals are surfaced equally, leaving users to decide what matters and what action to take.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  During research, I found that people rarely think in metrics. They think in outcomes.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    They want more energy during the day. They want to build strength consistently. They want to lose weight without constantly questioning whether they're making progress.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  This led to the concept of Plans.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Instead of organizing the product around health data, Sol organizes the experience around goals. Users begin by choosing an outcome they care about, and Sol continuously adapts guidance based on how their body responds over time.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  A Sleep & Energy plan prioritizes recovery signals and energy patterns. A Weight Loss plan focuses on sustainable behavior changes and trend analysis. The same underlying data exists, but its interpretation changes based on user intent.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  This shift transformed Sol from a passive tracking tool into an active guidance system.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The goal was to ensure users never had to ask, "What am I looking at?" and instead focus on "What should I do next?"
                </p>
              </div>

              {/* Plans Showcase Gallery below the text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/plan1.png"
                    alt="Sol Mobile Application interface showing the Sleep and Energy goal-oriented Plan page with recovery metrics and energy patterns"
                    width={858}
                    height={1764}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/plan2.png"
                    alt="Sol Mobile Application interface displaying the Weight Loss Plan screen highlighting trend analysis and behavior change recommendations"
                    width={858}
                    height={1762}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* Subsection 3: App Structure */}
            <div id="sol-app-structure" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                App Structure: Focused Navigation
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Once the concept of Plans was established, the next challenge was deciding how users would navigate the product over time.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Most health applications gradually evolve into collections of disconnected features. Dashboards live in one tab, analytics in another, coaching elsewhere, and educational content becomes a separate destination entirely. As products grow, users often lose sight of what actually matters.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  I wanted Sol to feel more focused.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    The structure was intentionally built around four core areas: Home, Progress, Insights, and Plans. Each section serves a distinct purpose while contributing to a single goal of helping users understand and act on their body's patterns.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Home acts as the daily orientation layer, surfacing what matters right now.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Progress answers whether current behaviors are leading toward desired outcomes.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Insights provides deeper context and education for users who want to understand the reasoning behind recommendations.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Plans serve as the long-term framework that connects user goals with wearable data and behavioral guidance.
                </p>

                <p className="text-sm text-gray-500 leading-relaxed pt-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  This structure helped maintain clarity as the product expanded. Instead of asking users to learn a complex system, each section answers a specific question:
                </p>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                {[
                  { q: "What should I do today?", label: "Home" },
                  { q: "Am I improving over time?", label: "Progress" },
                  { q: "Why is this happening?", label: "Insights" },
                  { q: "What am I working toward?", label: "Plans" }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50/20 border border-gray-100 flex flex-col items-center justify-center text-center rounded-lg shadow-sm">
                    <p className="text-[10px] uppercase tracking-widest text-[#FF9F0A] mb-1 font-semibold" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                      {item.label}
                    </p>
                    <p className="text-xs italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                      "{item.q}"
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  By organizing the product around these questions rather than around metrics, Sol feels less like a tracking tool and more like a decision-making companion.
                </p>
              </div>

              {/* App Structure Images Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/app1.png"
                    alt="Sol Mobile Application Home screen design showing daily orientation layout"
                    width={858}
                    height={1762}
                    className="w-full max-w-[280px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/app2.png"
                    alt="Sol Mobile Application Progress screen layout visualizing long term biometric consistency"
                    width={858}
                    height={1764}
                    className="w-full max-w-[280px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/app3.png"
                    alt="Sol Mobile Application Insights interface visualizing biometric correlations and guidance details"
                    width={858}
                    height={1762}
                    className="w-full max-w-[280px] h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* Subsection 4: Device Pairing */}
            <div id="sol-device-pairing" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Device Pairing: Connecting Capabilities
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Most wearable onboarding experiences focus on technical integration. Connect a device, grant permissions, and start collecting data.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  I wanted the pairing experience to reinforce a different idea.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    In Sol, wearable devices are not the product. They are simply a source of signals that help the system understand the body. The experience was intentionally designed to feel lightweight and trustworthy, helping users understand why data is being collected rather than overwhelming them with technical details.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  This became particularly important because the quality of guidance depends heavily on the quality of incoming data. By positioning wearables as contributors rather than the center of the experience, the product maintains its focus on outcomes rather than metrics.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The goal was to make device connection feel like enabling a capability rather than completing a setup task.
                </p>
              </div>

              {/* Device Pairing Video Showcase */}
              <div className="flex justify-center mt-10 pt-10 border-t border-gray-100">
                <video
                  className="w-full max-w-[320px] h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                  title="Sol Wearable Device pairing interface demo video"
                  aria-label="Interactive demo showing a lightweight, intent-based flow for pairing wearables to the Sol application"
                >
                  <source src="/images/WorkImages/Sol/pairing.mp4" type="video/mp4" />
                  Your browser does not support the HTML5 video tag.
                </video>
              </div>
            </div>

            {/* Subsection 5: Home */}
            <div id="sol-home" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Home: Daily Orientation Layer
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The Home experience acts as the product's daily orientation layer.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  During research, one insight surfaced repeatedly. People rarely wake up wanting to check their recovery score or sleep chart. What they actually want to know is whether they should push harder, slow down, focus, recover, or adjust their plans for the day.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    This led to a deliberate decision to avoid treating Home as a dashboard.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Instead of surfacing dozens of competing metrics, Sol presents a single primary insight supported by contextual signals. Recommendations such as "Energy peak expected mid-afternoon" or "Avoid intense workouts after 7 PM" are designed to answer a question before users have to ask it.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Supporting metrics remain visible, but they serve a different role. Rather than demanding attention, they provide evidence behind the recommendation.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  This shifts the interaction from monitoring health to acting on it. The screen becomes less about information consumption and more about decision-making.
                </p>
              </div>

              {/* Home Image Showcase */}
              <div className="flex justify-center mt-10 pt-10 border-t border-gray-100">
                <Image
                  src="/images/WorkImages/Sol/home1.png"
                  alt="Sol Mobile Application Home screen design focusing on a single primary action recommendation"
                  width={858}
                  height={1762}
                  className="w-full max-w-[300px] h-auto object-contain block"
                />
              </div>
            </div>

            {/* Subsection 6: Educational Content */}
            <div id="sol-edu-content" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Educational Content: Contextual Learning
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  One challenge I identified early was that health insights often stop at observation.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Many products can tell users that recovery has dropped or sleep quality has declined, but very few help them understand what those changes actually mean or how to respond.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    Rather than creating a separate content hub filled with articles and videos, I explored a more contextual approach.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Educational content is surfaced only when it supports a user's current situation. If sleep consistency becomes a recurring factor in energy levels, relevant content appears directly within the experience. If recovery trends suggest increased strain, users receive targeted explanations that help them better understand the signals behind the recommendation.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The goal was to make learning feel timely and actionable rather than forcing users to actively search for information.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Another important consideration was content fatigue. Instead of overwhelming users with endless videos and resources, educational modules are intentionally limited and contextual. Every piece of content exists to clarify an insight, reinforce a recommendation, or help users build a stronger understanding of their own health patterns.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  This also creates a natural opportunity for premium experiences. Advanced educational content, expert-led guidance, and deeper learning pathways can be introduced as part of a subscription offering while maintaining the product's core philosophy of delivering value before asking users to pay.
                </p>
              </div>

              {/* Edu Image Showcase */}
              <div className="flex justify-center mt-10 pt-10 border-t border-gray-100">
                <Image
                  src="/images/WorkImages/Sol/edu.png"
                  alt="Sol Mobile Application contextual learning modules and health education cards"
                  width={1464}
                  height={1762}
                  className="w-full max-w-[560px] h-auto object-contain block"
                />
              </div>
            </div>

            {/* Subsection 7: Progress */}
            <div id="sol-progress" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Progress: Sustained Rhythms over Time
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Most health products evaluate users through daily scores.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  A single night of poor sleep, a missed workout, or a lower recovery score can make it feel like progress has disappeared. In reality, the body doesn't operate in daily snapshots. Meaningful change happens through patterns that emerge over weeks and months.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    The Progress experience was designed around a different question: "Is this plan working over time?"
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Instead of focusing on isolated metrics, this section takes a longitudinal view of health. Weekly, monthly, and yearly trends help users understand how behaviors evolve and whether they are moving toward their goals in a sustainable way.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  A key design decision was redefining what progress means. Many health products equate progress with constant improvement, which can create unrealistic expectations. Sol treats progress as stability and alignment rather than perfection. Consistent sleep patterns, predictable energy levels, and sustainable recovery trends are often more valuable than short-term peaks.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  To support this, trend visualizations are paired with concise explanations that help users understand what they're seeing without requiring them to interpret graphs on their own. The AI layer remains present throughout the experience, continuously connecting patterns, behaviors, and outcomes to provide context around changes over time.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Rather than asking users to judge each day individually, Progress helps them step back and understand the bigger picture. The goal is not to optimize every day. The goal is to build healthier rhythms over time.
                </p>
              </div>

              {/* Progress Images Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/progress1.png"
                    alt="Sol Mobile Application Progress view showing weekly patterns"
                    width={858}
                    height={1764}
                    className="w-full max-w-[280px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/progress2.png"
                    alt="Sol Mobile Application Progress view showing monthly stability patterns"
                    width={858}
                    height={1764}
                    className="w-full max-w-[280px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/progress3.png"
                    alt="Sol Mobile Application Progress view displaying yearly outcomes and behaviors correlation"
                    width={858}
                    height={1762}
                    className="w-full max-w-[280px] h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* Subsection 8: Insights */}
            <div id="sol-insights" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Insights: Explaining the Data
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  While Home focuses on action, Insights focuses on understanding.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  One challenge I noticed across health applications is that users are often given more information than they can realistically process. Charts become increasingly complex, but clarity doesn't necessarily improve.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    Insights was designed as an optional educational layer that helps users explore the reasoning behind recommendations without overwhelming them.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Every visualization is paired with explanation. Rather than simply showing that sleep quality decreased or recovery improved, Sol explains the relationship between behaviors, patterns, and outcomes.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The goal was not to create a library of analytics. The goal was to help users build confidence in the guidance they receive and gradually develop a deeper understanding of their own rhythms.
                </p>
              </div>

              {/* Insights Images Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/insights.png"
                    alt="Sol Mobile Application Insights page presenting detailed pattern correlation analytics"
                    width={858}
                    height={1762}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/insights2.png"
                    alt="Sol Mobile Application Insights screen explaining how specific behaviors relate to sleep biometrics"
                    width={858}
                    height={1762}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* Subsection 9: Sol AI */}
            <div id="sol-sol-ai" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Sol AI: Intelligence in the Background
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  AI sits at the center of the experience, but intentionally remains in the background.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Many AI-powered products position intelligence as the primary feature. Sol takes the opposite approach. AI exists to interpret information and reduce complexity rather than draw attention to itself.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    The system continuously evaluates trends, timing, recovery signals, and recent behavior to identify moments where guidance can genuinely influence decisions. Recommendations appear when context matters, not through constant notifications or interruptions.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  A key part of the experience is explainability. Users can ask why a recommendation was made and receive transparent reasoning tied to their own data and patterns. This creates trust while helping users learn from the system over time.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The objective was never to make AI visible everywhere. It was to make it useful at the right moment.
                </p>
              </div>

              {/* Sol AI Images Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/solai1.png"
                    alt="Sol AI interactive explainability chat window layout design"
                    width={858}
                    height={1762}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/solai2.png"
                    alt="Sol AI recommendation rationale details panel layout design"
                    width={860}
                    height={1766}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* Subsection 10: Contextual Monetisation */}
            <div id="sol-monetisation" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Contextual Monetisation, Not Interruptions
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Most subscription products introduce paywalls at moments of friction. Users attempt to access a feature and are immediately blocked by an upgrade screen.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  I wanted monetisation to feel more aligned with user intent.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    Sol+ is introduced only when users actively seek deeper understanding of their health patterns. Instead of interrupting workflows, premium features appear naturally within moments of curiosity and exploration.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed font-medium text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  This approach aligns monetisation with value. Users are not paying for access to the product. They are paying for a richer understanding of themselves.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The result is a premium experience that feels additive rather than restrictive.
                </p>
              </div>

              {/* Monetisation Images Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/context1.png"
                    alt="Sol+ Premium Membership activation prompts integrated contextually within daily patterns analysis screens"
                    width={858}
                    height={1762}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/context2.png"
                    alt="Sol+ Premium Membership feature details sheet with payment details layout design"
                    width={858}
                    height={1762}
                    className="w-full max-w-[300px] h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* Subsection 11: Sensor Logging */}
            <div id="sol-sensor-logging" className="pt-14 border-t border-gray-100 mb-14">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Contextual Logging: Filling the Gaps
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Wearables are incredibly effective at measuring physiological signals, but they lack context.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  A poor night's sleep could be caused by travel. Elevated stress might be linked to work. Reduced recovery may have nothing to do with exercise at all.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    Without context, data only tells part of the story.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Rather than introducing heavy manual logging, Sol provides lightweight contextual inputs that allow users to capture meaningful life events such as illness, stress, travel, unusual schedules, or workout intensity.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  These moments help the system understand why changes occurred rather than simply detecting that they happened.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The goal was to create a more complete picture of wellbeing while keeping user effort close to zero.
                </p>
              </div>

              {/* Sensor Logging Video Showcase */}
              <div className="flex justify-center mt-10 pt-10 border-t border-gray-100">
                <video
                  className="w-full max-w-[320px] h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                  title="Sol Contextual Logs Input Flow Video"
                  aria-label="Interactive demo showing the quick logging process for travel, illness, and stress events in the Sol app"
                >
                  <source src="/images/WorkImages/Sol/sensors.mp4" type="video/mp4" />
                  Your browser does not support the HTML5 video tag.
                </video>
              </div>
            </div>

            {/* Subsection 12: Dynamic Island */}
            <div id="sol-dynamic-island" className="pt-14 border-t border-gray-100">
              <h3 className="text-xl md:text-2xl font-light text-black mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                Dynamic Island: Glanceable Actions
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Health products often rely on notifications that arrive too frequently or too late.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  I explored Dynamic Island as a way to surface guidance in a more timely and glanceable format. Instead of demanding attention, recommendations appear naturally within moments where users can still act on them.
                </p>

                {/* Highlight Statement */}
                <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                  <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                    Whether highlighting an upcoming energy peak, elevated recovery levels, or a recommendation tied to a user's plan, these nudges extend the product beyond the application itself and into daily routines.
                  </p>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The experience feels less like a notification system and more like a subtle companion that understands when guidance is useful and when silence is better.
                </p>
              </div>

              {/* Dynamic Island Images Showcase */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-10 border-t border-gray-100">
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/d1.png"
                    alt="Sol Dynamic Island notification mockup showing energy peak status details"
                    width={765}
                    height={1542}
                    className="w-full max-w-[220px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/d2.png"
                    alt="Sol Dynamic Island notification mockup displaying current wind down advice"
                    width={765}
                    height={1542}
                    className="w-full max-w-[220px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/d3.png"
                    alt="Sol Dynamic Island notification mockup presenting hydration and lifestyle logs suggestions"
                    width={765}
                    height={1542}
                    className="w-full max-w-[220px] h-auto object-contain block"
                  />
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/images/WorkImages/Sol/d4.png"
                    alt="Sol Dynamic Island notification mockup displaying current recovery status peaks"
                    width={765}
                    height={1542}
                    className="w-full max-w-[220px] h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Vision ──────────────────────────────────────────────────── */}
        <div id="sol-vision" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          <div className="px-6 md:px-10 py-10">
            <SectionLabel>Vision</SectionLabel>
            <SectionHeading>What Sol Could Grow Into</SectionHeading>

            <div className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Designing Sol started with a simple question: What if health products stopped measuring people and started guiding them?
              </p>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                While the current concept focuses on sleep, recovery, activity, and energy management, the underlying system was intentionally designed to be extensible. The real opportunity isn't in tracking more health metrics. It's in becoming a trusted layer that helps users make better decisions across different areas of wellbeing.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Over time, Sol could evolve beyond health tracking into a more comprehensive personal guidance system. Nutrition, stress management, mental wellbeing, habit formation, and even work-life balance could become part of the same ecosystem, all interpreted through the lens of individual goals and daily context.
              </p>

              {/* Highlight Statement */}
              <div className="my-6 pl-4 border-l-2 border-[#FF9F0A]">
                <p className="text-sm italic text-gray-700 font-medium leading-relaxed" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                  What makes this particularly interesting is that the value doesn't come from collecting more data. It comes from building a deeper understanding of patterns. As the system learns how users respond to different behaviors, recommendations become increasingly personalized, shifting from reactive insights to proactive guidance.
                </p>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed font-semibold text-black" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                The long-term vision isn't to become another dashboard filled with metrics. It's to become a system that quietly understands your rhythms, helps you make better decisions, and fades into the background when it isn't needed.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed pt-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                For me, Sol became an exploration of a broader design question:
              </p>

              {/* Accent Conclusion Quote */}
              <div className="my-6 p-6 bg-[#FF9F0A]/5 border border-[#FF9F0A]/10 text-center rounded-lg">
                <p className="text-xl md:text-2xl font-light text-black" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                  How might we design technology that helps people live healthier lives without demanding constant attention in return?
                </p>
              </div>
            </div>

          </div>
        </div>

        <Plus h="left" v="bottom" />
        <Plus h="right" v="bottom" />
      </div>
    </div>
  );
}
