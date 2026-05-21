"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import PixelTrail from '../../components/ui/PixelTrail';

export default function PixelTrailPlayground() {
  // Playground state parameters
  const [gridSize, setGridSize] = useState(26);
  const [trailSize, setTrailSize] = useState(0.12);
  const [maxAge, setMaxAge] = useState(400);
  const [interpolate, setInterpolate] = useState(1.8);
  const [color, setColor] = useState('#191919');
  const [gooeyEnabled, setGooeyEnabled] = useState(true);
  const [gooStrength, setGooStrength] = useState(4);
  const [containerBg, setContainerBg] = useState('bg-white border-gray-200');

  // Hardcoded preset colors
  const colorPresets = [
    { name: 'Dark Charcoal', value: '#191919' },
    { name: 'Pure White', value: '#ffffff' },
    { name: 'Electric Blue', value: '#3b82f6' },
    { name: 'Neon Green', value: '#10b981' },
    { name: 'Hot Pink', value: '#ec4899' },
    { name: 'Vibrant Amber', value: '#f59e0b' },
  ];

  // Container backgrounds
  const bgPresets = [
    { label: 'Light Grid', value: 'bg-white border-gray-200 text-black' },
    { label: 'Dark Grid', value: 'bg-neutral-950 border-neutral-800 text-white' },
    { label: 'Blue Grid', value: 'bg-blue-950 border-blue-800 text-white' },
  ];

  // Generated code snippet
  const codeSnippet = `import PixelTrail from './PixelTrail';

<div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
  <PixelTrail
    gridSize={${gridSize}}
    trailSize={${trailSize}}
    maxAge={${maxAge}}
    interpolate={${interpolate}}
    color="${color}"
    gooeyEnabled={${gooeyEnabled}}
    gooStrength={${gooStrength}}
  />
</div>`;

  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-24 md:py-32 font-sans selection:bg-black/10">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div>
          <Link
            href="/lab"
            className="inline-flex items-center text-gray-500 hover:text-black transition-colors text-sm font-mono uppercase tracking-widest mb-6"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Lab
          </Link>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: 'SatishSans, sans-serif' }}>
            Pixel Trail Cursor
          </h1>
          <p className="text-gray-500 max-w-xl text-lg leading-relaxed">
            An interactive, shader-based grid cursor that leaves a trail of pixels behind your pointer. Customize parameters and copy the implementation code.
          </p>
        </div>

        <div className="w-full h-px bg-black/5" />

        {/* Playground Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualizer Area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase text-gray-400 tracking-wider">Interactive Preview</span>
              <div className="flex gap-2">
                {bgPresets.map((bg) => (
                  <button
                    key={bg.label}
                    onClick={() => setContainerBg(bg.value)}
                    className={`text-xs px-2.5 py-1 border rounded-md transition-colors cursor-pointer ${
                      containerBg === bg.value
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {bg.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* The actual PixelTrail container */}
            <div
              className={`relative w-full h-[500px] border rounded-2xl overflow-hidden transition-colors duration-300 ${containerBg}`}
            >
              <PixelTrail
                gridSize={gridSize}
                trailSize={trailSize}
                maxAge={maxAge}
                interpolate={interpolate}
                color={color}
                gooeyEnabled={gooeyEnabled}
                gooStrength={gooStrength}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-xs uppercase tracking-widest opacity-25 font-mono">
                  Move mouse inside this area
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Controls Panel */}
          <div className="flex flex-col gap-6 p-6 border border-gray-200 rounded-2xl bg-gray-50/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 font-mono">Controls</h2>

            {/* Grid Size Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-gray-600">
                <span>Grid Size</span>
                <span>{gridSize}</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Trail Size Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-gray-600">
                <span>Trail Size</span>
                <span>{trailSize.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.4"
                step="0.01"
                value={trailSize}
                onChange={(e) => setTrailSize(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Max Age Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-gray-600">
                <span>Max Age (ms)</span>
                <span>{maxAge}ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Interpolate Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-gray-600">
                <span>Interpolate</span>
                <span>{interpolate.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="8"
                step="0.1"
                value={interpolate}
                onChange={(e) => setInterpolate(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* Gooey Filter Switch */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-600">Gooey Filter</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gooeyEnabled}
                  onChange={(e) => setGooeyEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            {/* Gooey Strength Control */}
            {gooeyEnabled && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <div className="flex justify-between text-xs font-mono text-gray-600">
                  <span>Gooey Strength</span>
                  <span>{gooStrength}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={gooStrength}
                  onChange={(e) => setGooStrength(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            )}

            <div className="w-full h-px bg-gray-200" />

            {/* Color Presets */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono text-gray-600">Pixel Color</span>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setColor(preset.value)}
                    title={preset.name}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      color.toLowerCase() === preset.value.toLowerCase()
                        ? 'border-black scale-110 shadow-sm ring-2 ring-black/10'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.value }}
                  />
                ))}
                {/* Custom Color Input */}
                <div className="relative w-6 h-6 rounded-full border border-gray-300 overflow-hidden flex hover:scale-105 transition-transform cursor-pointer">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-[25%] -translate-y-[25%] cursor-pointer border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Output / Clipboard */}
        <div className="flex flex-col gap-4 border border-gray-200 rounded-2xl p-6 bg-neutral-950 text-white font-mono">
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400">Implementation Code</span>
            <button
              onClick={copyToClipboard}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                copied
                  ? 'bg-green-800 border-green-700 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="text-xs overflow-x-auto p-4 bg-neutral-900 rounded-xl leading-relaxed text-neutral-300 whitespace-pre">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
