"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from 'cube-motion/react'
import { useWorkTransition, hasMatchingHeroImage } from '@/app/components/layout/WorkSharedTransition'

const allWorks = [
  {
    title: 'Jio Tesseract',
    href: '/works/jio',
    image: '/images/WorkImages/jio/thumbnail.webp',
    tags: ['Product Design'],
  },
  {
    title: 'Sol',
    href: '/works/sol',
    image: '/images/WorkImages/Sol/thumb_short.png',
    heroImage: '/images/WorkImages/Sol/main_thumb.png',
    tags: ['Health & Fitness', 'iOS App', 'Premium Tracker'],
  },
  {
    title: 'Smart Nation',
    href: '/works/smartNation',
    image: '/images/WorkImages/smartNationImages/SN-thumb.webp',
    heroImage: '/images/WorkImages/smartNationImages/SNN.png',
    tags: ['IoT', 'App UI', 'Brand Identity'],
  },
  {
    title: 'Blume Health',
    href: '/works/blumeHealth',
    image: '/images/WorkImages/blumeHealthImages/BM-thumnail.webp',
    heroImage: '/images/WorkImages/blumeHealthImages/bh-01.png',
    tags: ['SaaS'],
  },
  {
    title: 'SkinSage',
    href: '/works/skinSage',
    image: '/images/WorkImages/skinSageImages/SS-thumnail-1.webp',
    heroImage: '/images/WorkImages/skinSageImages/SS-01B.png',
    tags: ['AI', 'Consultation'],
  },
  {
    title: 'SkillRadius',
    href: '/works/skillRadius',
    image: '/images/WorkImages/skillradius/SR-thumnail.webp',
    heroImage: '/images/WorkImages/skillradius/SR-01.png',
    tags: ['LMS'],
  },
]

export default function MoreWorks({ current }: { current: string }) {
  const others = allWorks.filter((w) => w.href !== current).slice(0, 3)
  const { startWorkTransition } = useWorkTransition()

  const handleWorkNavigate = (
    e: React.MouseEvent,
    work: (typeof allWorks)[0],
    triggerEl: HTMLElement | null
  ) => {
    if (!work.href) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return

    // Condition: ONLY morph if thumbnail and destination page hero cover image are identical!
    const canMorph = hasMatchingHeroImage(work.href, work.image, work.heroImage)
    if (!canMorph) {
      // Allow standard Next.js Link routing
      return
    }

    e.preventDefault()

    const imgEl =
      triggerEl?.querySelector<HTMLElement>('[data-card-image]') || triggerEl
    startWorkTransition({
      imageSrc: work.image,
      heroImageSrc: work.heroImage,
      title: work.title,
      targetHref: work.href,
      sourceElement: imgEl,
    })
  }

  return (
    <div className="mt-16 max-w-5xl mx-auto">
      <h2
        className="text-2xl md:text-3xl text-gray-900 mb-6 px-6 md:px-10"
        style={{ fontFamily: 'SatishSans, sans-serif', fontWeight: 'normal' }}
      >
        More Works
      </h2>
      <Reveal as="div" targets="children" stagger={200} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 px-6 md:px-0">
        {others.map((work) => (
          <Link
            key={work.href}
            href={work.href}
            onClick={(e) => handleWorkNavigate(e, work, e.currentTarget)}
            className="group block"
          >
            {/* Image */}
            <div
              data-card-image
              data-cursor="view"
              className="relative overflow-hidden aspect-video bg-gray-50 border border-gray-200"
            >
              <Image
                src={work.image}
                alt={work.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover ${work.title === 'Jio Tesseract' ? 'object-left' : 'object-center'} transition-transform duration-500 group-hover:scale-105`}
              />
            </div>

            {/* Always-visible label below */}
            <div className="pt-2">
              <p
                className="text-sm text-gray-900 font-light leading-snug"
                style={{ fontFamily: 'SatishSans, sans-serif' }}
              >
                {work.title}
              </p>
              <p
                className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5"
                style={{ fontFamily: 'FunnelDisplay, sans-serif' }}
              >
                {work.tags.join(' · ')}
              </p>
            </div>
          </Link>
        ))}
      </Reveal>
    </div>
  )
}
