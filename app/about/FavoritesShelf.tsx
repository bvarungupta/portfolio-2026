"use client";

import { useState } from "react";
import Image from "next/image";

type Palette = "pink" | "teal" | "green" | "orange" | "neutral" | "ink";

interface Fave {
  title: string;
  subtitle: string;
  /** Short personal blurb shown on the card back. */
  blurb: string;
  /** Palette tint used for the placeholder cover. */
  tint: Palette;
  /** Optional real image override (drop into public/images/favorites/...). */
  cover?: string;
}

interface Category {
  key: string;
  title: string;
  favorites: Fave[];
}

const CATEGORIES: Category[] = [
  {
    key: "books",
    title: "Books",
    favorites: [
      {
        title: "Yumi and the Nightmare Painter",
        subtitle: "Brandon Sanderson",
        blurb: "I have to admit, I'm a massive Sanderson fan. This is such a beautiful story.",
        tint: "pink",
        cover: "/images/favorites/books/yumi.jpg",
      },
      {
        title: "The Way of Kings",
        subtitle: "Brandon Sanderson",
        blurb: "Life before death.",
        tint: "teal",
        cover: "/images/favorites/books/way-of-kings.jpg",
      },
      {
        title: "Babel",
        subtitle: "R.F. Kuang",
        blurb:
          "I love linguistics and I love fantasy novels, and this is the perfect combination of the two.",
        tint: "green",
        cover: "/images/favorites/books/babel.jpg",
      },
      {
        title: "Tomorrow, and Tomorrow, and Tomorrow",
        subtitle: "Gabrielle Zevin",
        blurb: "Honestly, what more could one ask for than a book about video game designers?",
        tint: "orange",
        cover: "/images/favorites/books/tomorrow.jpg",
      },
    ],
  },
  {
    key: "movies",
    title: "Movies & Shows",
    favorites: [
      {
        title: "君の名は。",
        subtitle: "Makoto Shinkai",
        blurb: "I've loved this movie since the beginning of high school!",
        tint: "teal",
        cover: "/images/favorites/movies/your-name.jpg",
      },
      {
        title: "Ponyo",
        subtitle: "Studio Ghibli",
        blurb: "This was my first ever Ghibli film, and it still brings back such happy memories.",
        tint: "pink",
        cover: "/images/favorites/movies/ponyo.png",
      },
      {
        title: "开端",
        subtitle: "正午阳光",
        blurb: "I never previously was able to get into cdramas, but this was phenomenal.",
        tint: "green",
        cover: "/images/favorites/movies/kaiduan.jpg",
      },
      {
        title: "Start-Up",
        subtitle: "Studio Dragon and HighZium Studio",
        blurb: "I liked this kdrama lot. Maybe because I like startups a lot.",
        tint: "orange",
        cover: "/images/favorites/movies/startup.jpg",
      },
    ],
  },
  {
    key: "songs",
    title: "Songs",
    favorites: [
      {
        title: "LAJF",
        subtitle: "Ben Cristovao, ANNABELLE",
        blurb: "I've been listening to Czech songs recently, and this one is on repeat for me.",
        tint: "pink",
        cover: "/images/favorites/music/lajf.jpg",
      },
      {
        title: "VVS",
        subtitle: "Show Me the Money 9",
        blurb: "This has been my favorite song since the pandemic. Always a booster to my day.",
        tint: "orange",
        cover: "/images/favorites/music/vvs.jpg",
      },
      {
        title: "能遇見，就很不錯了",
        subtitle: "Firdhaus",
        blurb: "A beautiful, beautiful song. Malaysian pride!",
        tint: "teal",
        cover: "/images/favorites/music/firdhaus.jpeg",
      },
      {
        title: "跳楼机",
        subtitle: "LBI利比",
        blurb: "LBI利比 also released another favorite song of mine, 小城夏天.",
        tint: "green",
        cover: "/images/favorites/music/tiaolouji.jpg",
      },
    ],
  },
  {
    key: "games",
    title: "Games",
    favorites: [
      {
        title: "Omori",
        subtitle: "Omocat",
        blurb: "Omori is an absolute masterpiece. I love the art style of this game.",
        tint: "orange",
        cover: "/images/favorites/games/omori.jpg",
      },
      {
        title: "Arcs",
        subtitle: "Leder Games",
        blurb:
          "Somehow, I'm a super aggressive Arcs player. I'm literally always battling everywhere.",
        tint: "ink",
        cover: "/images/favorites/games/arcs.jpg",
      },
      {
        title: "Terraforming Mars",
        subtitle: "Jacob Fryxelius",
        blurb: "I was introduced to this game not too long ago, but it's become a fast favorite.",
        cover: "/images/favorites/games/terraforming-mars.png",
        tint: "orange",
      },
      {
        title: "Persona 5 Royal",
        subtitle: "Atlus",
        blurb:
          "I'm still not entirely done with the last couple of palaces, but this was my first proper foray into video games.",
        cover: "/images/favorites/games/p5r.jpeg",
        tint: "teal",
      },
    ],
  },
];

export default function FavoritesShelf() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  const activeCategory = CATEGORIES[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length);
    setFlippedMap({});
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % CATEGORIES.length);
    setFlippedMap({});
  };

  const toggleFlip = (cardKey: string) => {
    setFlippedMap((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  return (
    <section className="favorites-shelf about-section w-full my-20">
      <style>{`
        .favorites-shelf {
          --color-ink: #171717;
          --color-ink-dim: #6b7280;
          --color-ink-mute: #9ca3af;
          --color-ink-inverted: #ffffff;
          --color-bg-white: #ffffff;
          --color-bg-neutral: #f3f4f6;
          --color-bg-neutral-2: #e5e7eb;

          --color-pink: #f472b6;
          --color-pink-0: #f472b6;
          --color-pink-1: #db2777;

          --color-teal: #2dd4bf;
          --color-teal-0: #2dd4bf;
          --color-teal-3: #0f766e;

          --color-green: #34d399;
          --color-green-0: #34d399;
          --color-green-1: #059669;

          --color-orange: #fb923c;
          --color-orange-0: #fb923c;
          --color-orange-1: #ea580c;

          --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          --font-display: "FunnelDisplay", sans-serif;
          --font-body: "FunnelDisplay", sans-serif;

          --duration-fast: 150ms;
          --duration-base: 300ms;
          --ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);

          perspective: 1200px;
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          min-width: 0;
        }
        @media (min-width: 768px) {
          .favorites-shelf {
            margin-left: -48px;
            margin-right: -48px;
            width: calc(100% + 96px);
          }
        }
        @media (min-width: 1024px) {
          .favorites-shelf {
            margin-left: -80px;
            margin-right: -80px;
            width: calc(100% + 160px);
          }
        }
        @media (max-width: 767px) {
          .favorites-shelf {
            overflow-x: clip;
            width: 100%;
          }
        }

        .favorites-carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
          max-width: 100%;
          min-height: 340px;
        }
        @media (min-width: 768px) {
          .favorites-carousel {
            gap: 40px;
          }
        }

        .favorites-arrow {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 28px;
          border: 0;
          border-radius: 4px;
          background: var(--color-bg-neutral-2);
          color: var(--color-ink-dim);
          font-family: var(--font-mono);
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
          transition:
            background var(--duration-fast) var(--ease-out-soft),
            color var(--duration-fast) var(--ease-out-soft);
        }
        .favorites-arrow::before {
          content: "";
          position: absolute;
          inset: -16px -20px;
        }
        .favorites-arrow:hover {
          background: var(--color-bg-neutral);
          color: var(--color-ink);
        }

        .favorites-lane {
          width: 100%;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .favorites-lane-wrapper {
          position: relative;
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
        }

        .favorites-lane-frame {
          width: 100%;
          display: flex;
          align-items: center;
        }

        .favorites-row {
          display: flex;
          gap: 20px;
          justify-content: center;
          align-items: center;
          padding: 32px 24px 24px;
          margin: -16px 0;
          list-style: none;
        }

        @media (max-width: 767px) {
          .favorites-lane-frame {
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            scroll-snap-type: x proximity;
            -webkit-overflow-scrolling: touch;
            mask-image: linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent);
          }
          .favorites-lane-frame::-webkit-scrollbar {
            display: none;
          }
          .favorites-lane {
            justify-content: flex-start;
            width: max-content;
          }
          .favorites-row {
            justify-content: flex-start;
            padding-left: 24px;
            padding-right: 24px;
          }
          .favorites-card-wrap {
            scroll-snap-align: center;
          }
        }

        .favorites-card-wrap {
          scroll-snap-align: start;
          flex: 0 0 auto;
          transform: rotate(var(--card-rot, 0deg));
          transform-origin: center 90%;
          transition: transform var(--duration-base) var(--ease-out-soft);
          will-change: transform;
        }
        .favorites-card-wrap:hover {
          transform: rotate(calc(var(--card-rot, 0deg) * 0.3)) translateY(-6px);
          z-index: 2;
        }

        .favorites-card {
          appearance: none;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          width: 148px;
          display: block;
          text-align: left;
          color: inherit;
          font: inherit;
        }
        .favorites-card__inner {
          position: relative;
          display: block;
          transform-style: preserve-3d;
          transition: transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .favorites-card.is-flipped .favorites-card__inner {
          transform: rotateY(180deg);
        }

        .favorites-card__face {
          display: flex;
          flex-direction: column;
          gap: 10px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .favorites-card__face--front {
          position: relative;
        }
        .favorites-card__face--back {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          aspect-ratio: 5 / 8;
          transform: rotateY(180deg);
          justify-content: space-between;
          padding: 14px;
          border-radius: 10px;
          background: var(--color-bg-white);
          box-shadow: 0 8px 18px -6px rgba(36, 36, 36, 0.18);
          color: var(--color-ink);
        }

        /* Cover swatch — polaroid-ish. Border, inner gloss, star corner. */
        .favorites-card__cover {
          position: relative;
          width: 100%;
          aspect-ratio: 5 / 8;
          border-radius: 10px;
          overflow: hidden;
          background: var(--color-bg-neutral);
          box-shadow:
            0 4px 10px -4px rgba(36, 36, 36, 0.22),
            inset 0 0 0 1px rgba(255, 255, 255, 0.35);
          display: grid;
          place-items: center;
          transition:
            box-shadow var(--duration-base) var(--ease-out-soft),
            transform var(--duration-base) var(--ease-out-soft);
        }
        .favorites-lane[data-lane="songs"] .favorites-card__cover {
          aspect-ratio: 1 / 1;
        }
        .favorites-lane[data-lane="songs"] .favorites-card__face--back {
          aspect-ratio: 1 / 1;
        }

        .favorites-card-wrap:hover .favorites-card__cover {
          box-shadow:
            0 16px 28px -10px rgba(36, 36, 36, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        .favorites-card[data-color="pink"] .favorites-card__cover {
          background: linear-gradient(
            145deg,
            var(--color-pink) 0%,
            var(--color-pink-0) 70%,
            var(--color-pink-1) 100%
          );
        }
        .favorites-card[data-color="teal"] .favorites-card__cover {
          background: linear-gradient(
            145deg,
            var(--color-teal) 0%,
            var(--color-teal-0) 70%,
            var(--color-teal-3) 100%
          );
        }
        .favorites-card[data-color="green"] .favorites-card__cover {
          background: linear-gradient(
            145deg,
            var(--color-green) 0%,
            var(--color-green-0) 70%,
            var(--color-green-1) 100%
          );
        }
        .favorites-card[data-color="orange"] .favorites-card__cover {
          background: linear-gradient(
            145deg,
            var(--color-orange) 0%,
            var(--color-orange-0) 70%,
            var(--color-orange-1) 100%
          );
        }
        .favorites-card[data-color="neutral"] .favorites-card__cover {
          background: linear-gradient(145deg, var(--color-bg-neutral-2) 0%, var(--color-bg-neutral) 100%);
          color: var(--color-ink);
        }
        .favorites-card[data-color="ink"] .favorites-card__cover {
          background: linear-gradient(145deg, #1a1a1a 0%, #242424 70%, #3a3a3a 100%);
        }

        .favorites-card__cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Sheen — an angled light pass that moves on hover. */
        .favorites-card__sheen {
          position: absolute;
          inset: -20% -40%;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 45%,
            rgba(255, 255, 255, 0.45) 50%,
            transparent 55%
          );
          transform: translateX(-60%);
          transition: transform 620ms var(--ease-out-soft);
          mix-blend-mode: soft-light;
        }
        .favorites-card-wrap:hover .favorites-card__sheen {
          transform: translateX(60%);
        }

        /* Star corner badge — whimsy accent, pops on hover. */
        .favorites-card__star {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 14px;
          color: var(--color-ink-inverted);
          text-shadow: 0 1px 3px rgba(36, 36, 36, 0.35);
          opacity: 0;
          transform: scale(0.6) rotate(-18deg);
          transition:
            opacity var(--duration-base) var(--ease-out-soft),
            transform var(--duration-base) var(--ease-out-soft);
        }
        .favorites-card[data-color="neutral"] .favorites-card__star {
          color: var(--color-ink);
          text-shadow: 0 1px 3px rgba(255, 255, 255, 0.6);
        }
        .favorites-card-wrap:hover .favorites-card__star {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .favorites-card__meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 0 2px;
        }
        .favorites-card__title {
          font-family: var(--font-display);
          font-weight: 300;
          font-size: 15px;
          line-height: 1.15;
          color: var(--color-ink);
        }
        .favorites-card__sub {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--color-ink-dim);
        }

        .favorites-card__blurb {
          font-family: var(--font-body);
          font-size: 13.5px;
          line-height: 1.45;
          color: var(--color-ink);
        }
        .favorites-card__back-hint {
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--color-ink-mute);
          align-self: flex-end;
        }

        @media (prefers-reduced-motion: reduce) {
          .favorites-card-wrap,
          .favorites-card__inner,
          .favorites-card__cover,
          .favorites-card__sheen,
          .favorites-card__star {
            transition: none !important;
          }
          .favorites-card.is-flipped .favorites-card__inner {
            transform: none;
          }
          .favorites-card.is-flipped .favorites-card__face--front {
            display: none;
          }
          .favorites-card.is-flipped .favorites-card__face--back {
            transform: none;
            position: relative;
          }
        }
      `}</style>

      <h2
        className="text-xl md:text-2xl text-gray-700 leading-snug mb-2 text-center"
        style={{ fontFamily: "SatishSans, serif", fontWeight: 400 }}
      >
        A few of my favorite things
      </h2>

      <h3
        className="text-sm text-gray-500 mb-10 text-center h-8"
        style={{ fontFamily: "FunnelDisplay, sans-serif" }}
      >
        {activeCategory.title}
      </h3>

      <div className="favorites-carousel mt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="favorites-arrow"
          aria-label="Previous category"
        >
          <span>←</span>
        </button>

        <div className="favorites-lane-wrapper">
          <div className="favorites-lane-frame">
            <div className="favorites-lane" data-lane={activeCategory.key}>
            <ul className="favorites-row" role="list">
              {activeCategory.favorites.map((fave, i) => {
                const cardKey = `${activeCategory.key}-${i}`;
                const isFlipped = !!flippedMap[cardKey];
                const rotation = ((i % 2 === 0 ? -1 : 1) * (1 + i * 0.5)).toFixed(2);

                return (
                  <li
                    key={cardKey}
                    className="favorites-card-wrap"
                    style={{ "--card-rot": `${rotation}deg` } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFlip(cardKey)}
                      className={`favorites-card ${isFlipped ? "is-flipped" : ""}`}
                      data-color={fave.tint}
                      aria-label={`${fave.title} by ${fave.subtitle}`}
                    >
                      <span className="favorites-card__inner">
                        <span className="favorites-card__face favorites-card__face--front">
                          <span className="favorites-card__cover">
                            {fave.cover ? (
                              <Image
                                src={fave.cover}
                                alt={fave.title}
                                fill
                                sizes="148px"
                                className="favorites-card__cover-img object-cover"
                              />
                            ) : null}
                            <span className="favorites-card__sheen" aria-hidden="true" />
                            <span className="favorites-card__star" aria-hidden="true">
                              ★
                            </span>
                          </span>
                          <span className="favorites-card__meta">
                            <span className="favorites-card__title truncate block max-w-[148px]" title={fave.title}>
                              {fave.title}
                            </span>
                            <span className="favorites-card__sub truncate block max-w-[148px]" title={fave.subtitle}>
                              {fave.subtitle}
                            </span>
                          </span>
                        </span>
                        <span
                          className="favorites-card__face favorites-card__face--back"
                          aria-hidden="true"
                        >
                          <span className="favorites-card__blurb text-xs leading-normal select-none overflow-y-auto max-h-[160px] pr-1">
                            {fave.blurb}
                          </span>
                          <span className="favorites-card__back-hint select-none mt-2">
                            flip back
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

        <button
          type="button"
          onClick={handleNext}
          className="favorites-arrow"
          aria-label="Next category"
        >
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
