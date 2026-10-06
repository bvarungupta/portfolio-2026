"use client"

import { Reveal } from 'cube-motion/react'
import { Riffle, Turntable, Laptop, Terminal } from "@lucasmarkes/hairline/react"
import { Geist_Mono } from "next/font/google"

const geistMono = Geist_Mono({ subsets: ["latin"] })

const processSteps = [
  {
    step: "01",
    dots: 1,
    title: "Research",
    copy: "I start by understanding the problem before designing the solution. I spend 1–2 weeks on desktop research, user interviews, surveys, and competitive analysis to understand the people, context, and constraints behind the problem.",
    Illustration: Riffle,
  },
  {
    step: "03",
    dots: 2,
    title: "Design",
    copy: "With the direction clear, I move into design. I explore concepts, structure the experience, and refine the visual system across typography, color, components, and interaction, taking everything through high-fidelity design, prototyping, and developer handoff.",
    Illustration: Laptop,
  },
  {
    step: "04",
    dots: 3,
    title: "Build",
    copy: "I take the final designs into production, working closely with developers through implementation, QA, and launch. I handle the handoff, resolve edge cases, and make sure the finished product stays true to the design while working as it should.",
    Illustration: Terminal,
  },
]

export default function DesignProcessGallery() {
  return (
    <div className="mt-20 md:mt-28">
      {/* ── Section Header ── */}
      <div className="px-6 md:px-10 pb-8 md:pb-12 overflow-hidden">
        <div className="relative">
          <div
            className="absolute inset-x-0 border-t border-gray-300"
            style={{ top: "50%" }}
          />
          <div className="relative flex items-baseline justify-between">
            <h2 className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>D</span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>esign</span>
            </h2>
            <h2 className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: "VarunCapsSans, sans-serif", fontSize: "1.5em" }}>P</span>
              <span style={{ fontFamily: "SatishSans, sans-serif" }}>rocess</span>
            </h2>
          </div>
        </div>
        <p
          className="w-full max-w-none text-center text-sm md:text-base text-gray-600 font-light leading-relaxed mt-3 md:mt-4 px-0"
          style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
        >
          How I approach problem solving — from understanding the problem to defining the strategy and building the solution.
        </p>
      </div>

      {/* ── 3 Cards Grid (negative-margin breakout on desktop) ── */}
      <Reveal as="div" targets="children" stagger={200} className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-0 md:-mx-28 lg:-mx-44 xl:-mx-56 px-0 mt-6">
        {processSteps.map((item) => {
          const Illustration = item.Illustration
          return (
            <div
              key={item.step}
              className="group relative bg-white border border-gray-300 rounded-none flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-gray-500 hover:shadow-md"
            >
              {/* Dot indicator bar */}
              <div className="px-3 md:px-5 py-2 border-b border-gray-300 bg-white flex items-center gap-1.5 min-h-[32px]">
                {Array.from({ length: item.dots }).map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
                ))}
              </div>

              {/* Card body */}
              <div className="px-3 py-5 md:px-5 md:py-6 flex flex-col justify-between flex-1">
                <div className="w-full">
                  <div className={`${geistMono.className} text-base md:text-lg text-gray-500 font-normal mb-2 tracking-tight`}>
                    {item.step}
                  </div>

                  <h3
                    className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-2 md:mb-2.5"
                    style={{ fontFamily: "FunnelDisplay, sans-serif" }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-1.5 w-full max-w-none"
                    style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 300 }}
                  >
                    {item.copy}
                  </p>
                </div>

                {/* Hairline illustration */}
                <div className="w-full flex justify-center items-center pt-0 pb-0 mt-1">
                  <Illustration className="w-full max-w-[280px] md:max-w-[320px] aspect-[4/3]" theme="light" />
                </div>
              </div>
            </div>
          )
        })}
      </Reveal>
    </div>
  )
}
