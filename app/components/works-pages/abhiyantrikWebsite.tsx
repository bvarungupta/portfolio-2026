"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image'
import { Plus } from '../ui/Markers'
import SmartTouchSwitchBoard, { SwitchState } from './abhiyantrik/SmartTouchSwitchBoard'
import SmartMCB, { MCBState } from './abhiyantrik/SmartMCB'
import PhoneShell from './abhiyantrik/PhoneShell'

const AbhiyantrikWebsite = () => {

  // ── Slider state ───────────────────────────────────────
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setSliderPosition(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { if (isDragging) handleSliderMove(e.clientX); };
  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => handleSliderMove(e.clientX);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => { setIsDragging(true); e.preventDefault(); };
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches.length > 0) { handleSliderMove(e.touches[0].clientX); e.preventDefault(); }
  };

  // ── Copy state ─────────────────────────────────────────
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null);
  const handleCopy = (type: 'email', value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── Interactive demo state ──────────────────────────────
  const [switchState, setSwitchState] = useState<SwitchState>({
    light1: false, light2: false, light3: false, light4: false,
    fan: false, tv: false, router: false,
  });
  const [fanSpeed, setFanSpeed] = useState(0);
  const [activeDemo, setActiveDemo] = useState<'switch' | 'mcb'>('switch');
  const [mcbState, setMCBState] = useState<MCBState>({ mcb: false });
  const toggleMCB = () => setMCBState(prev => ({ mcb: !prev.mcb }));

  const toggleSwitch = (switchName: keyof SwitchState) => {
    setSwitchState(prev => ({ ...prev, [switchName]: !prev[switchName] }));
  };
  const handleFanSpeedChange = (newSpeed: number) => {
    setFanSpeed(newSpeed);
    setSwitchState(prev => ({ ...prev, fan: newSpeed > 0 }));
  };
  const toggleAllDevices = (state: boolean) => {
    setSwitchState({
      light1: state, light2: state, light3: state, light4: state,
      fan: state, tv: state, router: state,
    });
    if (!state) setFanSpeed(0);
  };

  // ── Sidebar navigation ─────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('aby-header');
  useEffect(() => { setMounted(true); }, []);

  const sections = [
    { id: 'aby-header',  label: 'Overview' },
    { id: 'aby-01',      label: 'Landing Page' },
    { id: 'aby-02',      label: 'Flow' },
    { id: 'aby-03',      label: 'Interactive Product\nExperience' },
    { id: 'aby-04',      label: '3D Mockup' },
  ];

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
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mobileDevices = {
    fan: switchState.fan,
    tv: switchState.tv,
    router: switchState.router,
    light1: switchState.light1,
    light2: switchState.light2,
    light3: switchState.light3,
    light4: switchState.light4,
  };

  return (
    <div className="bg-white min-h-screen mt-16">

      {/* ── Sticky left sidebar — portalled to body ───────── */}
      {mounted && createPortal(
        <>
          <div
            className="hidden xl:block fixed z-[9998] pointer-events-none"
            style={{
              top: 'calc(50% - 130px)',
              bottom: 'calc(50% - 130px)',
              left: 0,
              width: '32px',
              border: '1px solid #d1d5db',
              borderLeft: 'none',
              borderTopRightRadius: '16px',
              borderBottomRightRadius: '16px',
            }}
          />
          <nav
            className="hidden xl:flex fixed z-[9999]"
            style={{ top: '50%', transform: 'translateY(-50%)', left: '26px' }}
          >
            <div className="flex flex-col">
              {sections.map((s) => {
                const isActive = activeSection === s.id;
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
                        <span style={{ width: '7px', height: '7px', background: '#111827', display: 'block' }} />
                      ) : (
                        <span
                          style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: 1, color: '#9ca3af', display: 'block' }}
                          className="group-hover:text-gray-500 transition-colors duration-200"
                        >+</span>
                      )}
                    </span>
                    <span className={`text-[9px] uppercase tracking-[0.15em] transition-all duration-200 whitespace-pre-line ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-400 group-hover:text-gray-600'}`}>
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

      {/* ════════════════════════════════════════════════════
          TOP SECTIONS — constrained box
      ════════════════════════════════════════════════════ */}
      <div className="px-4 md:px-0">
        <div className="relative overflow-visible max-w-5xl mx-auto border-l border-r border-t border-gray-200 bg-white">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />

          {/* ── Header ───────────────────────────────────── */}
          <div id="aby-header" className="relative overflow-visible flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-200">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center">
              <Image src="/images/WorkImages/abhiyantrikImages/abhiyantrik-logo.png" alt="Abhiyantrik Logo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl md:text-4xl font-light" style={{ fontFamily: 'Garamond, Georgia, serif' }}>Abhiyantrik</h1>
            <Image src="/images/common/vg-outline.svg" alt="Varun Gupta Portfolio Logo" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-20" />
            <Plus h="left" /><Plus h="right" />
          </div>

          {/* ── Meta row ─────────────────────────────────── */}
          <div className="flex flex-col md:flex-row items-stretch border-b border-gray-200">
            <div className="flex items-center gap-3 px-6 md:px-8 py-3 border-b md:border-b-0 md:border-r border-gray-200">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Company</span>
              <span className="text-[11px] text-gray-700" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Abhiyantrik Solutions</span>
            </div>
            <div className="flex items-center gap-2 px-6 md:px-8 py-3">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0 mr-1" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Scope</span>
              {['Web Design', 'Development', 'Creative Direction'].map(tag => (
                <span key={tag} className="text-[9px] px-2 py-1 border border-gray-200 text-gray-500" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* ── Hero image ───────────────────────────────── */}
          <div className="w-full border-b border-gray-200">
            <Image src="/images/WorkImages/abhiyantrikImages/Abhiyantrik-tumb-1.png" alt="Abhiyantrik Website Mockup" width={1200} height={800} className="w-full h-auto" />
          </div>

          {/* ── 01 · Landing Page ────────────────────────── */}
          <div id="aby-01" className="relative overflow-visible border-b border-gray-200">
            <div className="relative overflow-visible px-6 md:px-10 py-6 border-b border-gray-200 flex items-baseline gap-4">
              <h2 className="text-2xl md:text-3xl font-light text-black" style={{ fontFamily: 'Garamond, Georgia, serif' }}>Landing Page</h2>
              <Plus h="left" /><Plus h="right" />
            </div>
            <div className="relative overflow-visible px-6 md:px-10 py-8 flex flex-col gap-6">
              <p className="text-sm text-gray-500 leading-relaxed w-full" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                I designed and developed Abhiyantrik Solutions&apos; complete website experience, from initial sketches to a fully interactive platform. The site showcases Smart Nation&apos;s innovative home automation products through immersive product demonstrations, allowing visitors to experience the technology before they buy.
              </p>
              <a href="https://www.abhiyantriksolutions.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-black border border-gray-200 w-fit hover:bg-gray-50 transition-colors" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                <span className="px-4 py-2 border-r border-gray-200">Visit website ↗</span>
                <span className="px-4 py-2 text-gray-400">abhiyantriksolutions.in</span>
              </a>
              <Plus h="left" /><Plus h="right" />
            </div>
          </div>

          {/* ── 02 · Flow ────────────────────────────────── */}
          <div id="aby-02" className="relative overflow-visible border-b border-gray-200">
            <div className="relative overflow-visible px-6 md:px-10 py-6 border-b border-gray-200 flex items-baseline gap-4">
              <h2 className="text-2xl md:text-3xl font-light text-black" style={{ fontFamily: 'Garamond, Georgia, serif' }}>Flow</h2>
              <Plus h="left" /><Plus h="right" />
            </div>
            <div className="px-6 md:px-10 py-8 md:py-12">
              <div className="flex items-center justify-center mb-8">
                <Image src="/images/WorkImages/abhiyantrikImages/flow.png" alt="Development Flow" width={1400} height={600} className="w-full md:w-2/3 max-w-2xl h-auto mx-auto" />
              </div>
              <h3 className="text-xl md:text-2xl font-light mb-4" style={{ fontFamily: 'Garamond, Georgia, serif' }}>From Concept to Deployment</h3>
              <p className="text-sm text-gray-500 leading-relaxed w-full" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Started with the idea of bringing an interactive product experience into the website itself, so users could feel the product before they buy. Concept got confirmed, then moved into full Figma design for the entire site. Created all 3D assets and visuals in Blender and Photoshop. Moved into development using Claude AI to vibe-code and complete the build, then deployed live.
              </p>
            </div>
            <Plus h="left" /><Plus h="right" />
          </div>

          {/* ── 03 · Interactive Product Experience — header + intro + toggle ── */}
          <div id="aby-03" className="relative overflow-visible">
            <div className="relative overflow-visible px-6 md:px-10 py-6 border-b border-gray-200 flex items-baseline gap-4">
              <h2 className="text-2xl md:text-3xl font-light text-black" style={{ fontFamily: 'Garamond, Georgia, serif' }}>Interactive Product Experience</h2>
              <Plus h="left" /><Plus h="right" />
            </div>
            <div className="px-6 md:px-10 py-8 flex flex-col gap-6">
              <p className="text-sm text-gray-500 leading-relaxed w-full" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Traditional product pages tell. Interactive experiences sell. I built two core product demonstrations that let users actually feel the Smart Nation ecosystem right in their browser.
              </p>
              <div className="flex justify-center">
                {/* Aluminum case outer shell */}
                <div style={{
                  background: 'linear-gradient(160deg, #e8e8e8 0%, #c8c8c8 20%, #d8d8d8 40%, #b0b0b0 60%, #d0d0d0 80%, #e4e4e4 100%)',
                  borderRadius: '999px',
                  padding: '5px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(90,90,90,0.35)',
                }}>
                  {/* Recessed track */}
                  <div className="relative flex items-center" style={{
                    background: 'linear-gradient(180deg, #787878 0%, #929292 50%, #888888 100%)',
                    borderRadius: '999px',
                    boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.55), inset 0 1px 3px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(255,255,255,0.08)',
                    padding: '4px',
                  }}>
                    {/* Sliding polished pill */}
                    <div
                      className="absolute transition-all duration-300 ease-in-out"
                      style={{
                        top: '4px', bottom: '4px',
                        width: 'calc(50% - 4px)',
                        left: activeDemo === 'switch' ? '4px' : 'calc(50%)',
                        borderRadius: '999px',
                        background: 'linear-gradient(160deg, #f8f8f8 0%, #e0e0e0 30%, #f2f2f2 55%, #c8c8c8 80%, #dedede 100%)',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(100,100,100,0.2)',
                      }}
                    />
                    <button
                      onClick={() => setActiveDemo('switch')}
                      className="relative z-10 flex-1 whitespace-nowrap transition-all duration-300"
                      style={{
                        fontFamily: 'FunnelDisplay, sans-serif',
                        fontSize: '9px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '8px 20px',
                        color: activeDemo === 'switch' ? '#1a1a1a' : 'rgba(230,230,230,0.9)',
                        textShadow: activeDemo === 'switch' ? '0 1px 0 rgba(255,255,255,0.7)' : '0 1px 2px rgba(0,0,0,0.4)',
                        fontWeight: activeDemo === 'switch' ? '600' : '500',
                      }}
                    >
                      Smart Switch
                    </button>
                    <button
                      onClick={() => setActiveDemo('mcb')}
                      className="relative z-10 flex-1 whitespace-nowrap transition-all duration-300"
                      style={{
                        fontFamily: 'FunnelDisplay, sans-serif',
                        fontSize: '9px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '8px 20px',
                        color: activeDemo === 'mcb' ? '#1a1a1a' : 'rgba(230,230,230,0.9)',
                        textShadow: activeDemo === 'mcb' ? '0 1px 0 rgba(255,255,255,0.7)' : '0 1px 2px rgba(0,0,0,0.4)',
                        fontWeight: activeDemo === 'mcb' ? '600' : '500',
                      }}
                    >
                      Smart MCB
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fade bottom of side border lines */}
          <div className="absolute bottom-0 h-24 w-px pointer-events-none" style={{ left: '-1px', background: 'linear-gradient(to bottom, transparent, white)' }} />
          <div className="absolute bottom-0 h-24 w-px pointer-events-none" style={{ right: '-1px', background: 'linear-gradient(to bottom, transparent, white)' }} />

        </div>{/* ── END constrained box ── */}
      </div>

      {/* ════════════════════════════════════════════════════
          FULL-WIDTH INTERACTIVE DEMO — Smart Touch Switch
      ════════════════════════════════════════════════════ */}
      <div className="w-full bg-white">

        {/* ── Demo content — conditionally rendered ── */}
        <div className="flex justify-center py-12 px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-5xl">

            {/* Hardware — switches based on activeDemo */}
            <div className="flex-1 w-full order-1 md:order-1 flex flex-col gap-3">
              {activeDemo === 'switch' ? (
                <>
                  <p className="text-center text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Click any switch to toggle</p>
                  <SmartTouchSwitchBoard
                    switchState={switchState}
                    onSwitchToggle={toggleSwitch}
                    fanSpeed={fanSpeed}
                    onFanSpeedChange={handleFanSpeedChange}
                  />
                </>
              ) : (
                <>
                  <p className="text-center text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Click the MCB to toggle power</p>
                  <SmartMCB mcbState={mcbState} onMCBToggle={toggleMCB} />
                </>
              )}
            </div>

            {/* Phone — always mounted, screens slide internally */}
            <div className="shrink-0 order-2 md:order-2 flex flex-col gap-3 items-center">
              <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>
                Synced mobile app
              </p>
              <PhoneShell
                activeScreen={activeDemo}
                onNavigateTo={(screen) => setActiveDemo(screen)}
                devices={mobileDevices}
                toggleDevice={(id) => toggleSwitch(id as keyof SwitchState)}
                fanSpeed={fanSpeed}
                toggleAllDevices={toggleAllDevices}
                mcbState={mcbState.mcb}
                toggleMCB={toggleMCB}
              />
            </div>

          </div>
        </div>

      </div>

      {/* ════════════════════════════════════════════════════
          CONTINUE CONSTRAINED — MCB + 3D Mockup
      ════════════════════════════════════════════════════ */}
      <div className="px-4 md:px-0">
        <div className="relative overflow-visible max-w-5xl mx-auto border-l border-r border-t border-gray-200">
          <Plus h="left" v="top" /><Plus h="right" v="top" />

          {/* ── 04 · 3D Product Mockup ─────────────────────── */}
          <div id="aby-04" className="relative overflow-visible border-b border-gray-200">
            <div className="relative overflow-visible px-6 md:px-10 py-6 border-b border-gray-200 flex items-baseline gap-4">
              <h2 className="text-2xl md:text-3xl font-light text-black" style={{ fontFamily: 'Garamond, Georgia, serif' }}>3D Product Mockups</h2>
              <Plus h="left" /><Plus h="right" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 leading-relaxed py-8 md:py-10 px-6 md:px-10 text-center" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Used Blender to create realistic 3D product mockups for the website.
              </p>
              <div
                ref={sliderRef}
                className="relative w-full overflow-hidden cursor-pointer select-none touch-none border-t border-b border-gray-200 aspect-video"
                onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove} onMouseLeave={() => setIsDragging(false)}
                onClick={handleMouseClick}
                onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}
              >
                <div className="absolute inset-0">
                  <Image src="/images/WorkImages/abhiyantrikImages/product-raw.png" alt="Product Raw" width={1000} height={600} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                  <Image src="/images/WorkImages/abhiyantrikImages/product-render.png" alt="Product Rendered" width={1000} height={600} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-0 bottom-0 w-px bg-white shadow-lg cursor-ew-resize" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/>
                    </svg>
                  </div>
                </div>
                <span className="absolute bottom-3 left-4 text-[9px] uppercase tracking-widest text-white border border-white px-2 py-0.5" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Rendered</span>
                <span className="absolute bottom-3 right-4 text-[9px] uppercase tracking-widest text-white border border-white px-2 py-0.5" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Raw</span>
              </div>
            </div>

            <Plus h="left" /><Plus h="right" />
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          CTA + FOOTER
      ════════════════════════════════════════════════════ */}
      <div className="px-4 md:px-0">
        <div className="max-w-5xl mx-auto mt-10 mb-6 border border-gray-200 px-6 md:px-10 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-visible">
          <Plus h="left" v="top" /><Plus h="right" v="top" /><Plus h="left" /><Plus h="right" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Let&apos;s Work Together</p>
            <h3 className="text-3xl md:text-4xl font-light text-gray-900 leading-snug" style={{ fontFamily: 'Garamond, Georgia, serif' }}>
              Great products happen<br />when the right people meet.
            </h3>
            <p className="text-sm text-gray-400 mt-3 max-w-md" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              If you&apos;re building something and need a designer who goes all in, let&apos;s talk.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <button onClick={() => handleCopy('email', 'bvarungupta@gmail.com')} className="w-full flex items-center gap-3 px-5 py-3 border border-gray-900 text-gray-900 text-xs tracking-wide hover:bg-gray-900 hover:text-white transition-colors duration-200" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
              {copied === 'email' ? 'Copied!' : 'bvarungupta@gmail.com'}
            </button>
            <a href="https://linkedin.com/in/bvarungupta" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-5 py-3 border border-gray-200 text-gray-500 text-xs tracking-wide hover:border-gray-400 hover:text-gray-700 transition-colors duration-200" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-10 pb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <p className="text-gray-300 text-xs" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>&copy; {new Date().getFullYear()} Varun Gupta. All rights reserved.</p>
            <p className="text-gray-200 text-xs" style={{ fontFamily: 'Garamond, Georgia, serif' }}>Designed &amp; built by Varun</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AbhiyantrikWebsite;
