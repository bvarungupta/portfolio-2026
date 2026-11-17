"use client";

import SocialCards, { DEMO_CARDS } from "@/components/ui/card-fan-carousel";
import { TextAnimate } from "@/components/ui/text-animate";

const storyParagraphs = [
  "Based in India 🇮🇳, designing digital products that make sense to the people using them. I take ownership from the first messy idea to the final shipped product. The thinking, the decisions, and the details in between.",
  "I work across mobile apps, web products, SaaS, FinTech, EdTech, HealthTech, and whatnot. I like turning complicated problems into experiences that feel simple, intuitive, and just make sense.",
  "I'm particular about the little things. The interaction that feels slightly off, the two pixels that don't line up, the tiny decision that makes everything click. Outside product design, I explore visual design, motion, and brand identity. Apparently, one creative rabbit hole wasn't enough.",
  "Outside work, I'm usually watching anime, overanalysing a movie, or getting lost in a book. Brandon Sanderson for the worlds I wish I could live in, Dan Brown for the plots that make me say just one more chapter. And when I'm not doing either, there's a good chance How I Met Your Mother is playing in the background for the hundredth time.",
  "I like making things that work beautifully, feel human, and don't need to announce how clever they are. They just work. And somehow, that's the hard part.",
];

export default function AboutHeroV2() {
  return (
    <div className="w-full mb-12 sm:mb-16 md:mb-20">
      {/* ── Photo Fan Gallery (Responsive, Compact, Touch & Hover) ── */}
      <div className="w-full flex justify-center overflow-visible pt-0 pb-0">
        <SocialCards cards={DEMO_CARDS} className="py-0 px-0" />
      </div>

      {/* ── Editorial Story Text Section (Magic UI Line-by-Line Animations) ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-10 mt-5 sm:mt-7 md:mt-10">
        {/* Opening Heading + Subtitle with matching font size */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          {/* Opening line - matched font size to subtitle */}
          <TextAnimate
            as="h1"
            animation="fadeIn"
            by="line"
            className="text-[16px] sm:text-xl md:text-[21px] font-semibold tracking-[-0.01em] text-[#111111] leading-snug sm:leading-normal"
            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
          >
            hi, its varun.
          </TextAnimate>

          {/* Subtitle */}
          <TextAnimate
            as="p"
            animation="fadeIn"
            by="line"
            delay={0.12}
            className="text-[16px] sm:text-xl md:text-[21px] text-gray-500 font-light italic mt-1 sm:mt-1.5 tracking-[-0.01em] leading-snug sm:leading-normal"
            style={{ fontFamily: "FunnelDisplay, sans-serif" }}
          >
            product designer. chronic overthinker. details guy.
          </TextAnimate>
        </div>

        {/* Five flowing paragraphs: Animated line-by-line with Magic UI TextAnimate */}
        <div
          className="space-y-5 sm:space-y-6 md:space-y-7 text-[#161616] leading-[1.7] sm:leading-[1.75] md:leading-[1.8] text-[15.5px] sm:text-[16.5px] md:text-[17.5px]"
          style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 400 }}
        >
          {storyParagraphs.map((paragraph, index) => (
            <TextAnimate
              key={index}
              as="p"
              animation="fadeIn"
              by="line"
              startOnView={true}
              once={true}
              delay={0.05}
              className="text-[#161616] leading-[1.7] sm:leading-[1.75] md:leading-[1.8] text-[15.5px] sm:text-[16.5px] md:text-[17.5px]"
              style={{ fontFamily: "FunnelDisplay, sans-serif", fontWeight: 400 }}
            >
              {paragraph}
            </TextAnimate>
          ))}
        </div>
      </div>
    </div>
  );
}
