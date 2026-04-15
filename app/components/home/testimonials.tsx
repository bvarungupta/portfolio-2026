import { Plus, PlusAt } from '../ui/Markers'

const testimonials = [
  {
    id: 1,
    quote: "Varun brought structure to our chaos. Before him, we were shipping screens without a real system. He helped us define our design language from scratch, and it gave the whole team clarity.",
    name: 'Founder, Early-stage SaaS',
    role: 'Placeholder · Replace with real',
  },
  {
    id: 2,
    quote: "What stood out was how fast he grasped our product context. Within days he was designing flows that felt native to our users. We went from concept to testable prototype in two weeks.",
    name: 'Co-founder, B2B Product',
    role: 'Placeholder · Replace with real',
  },
  {
    id: 3,
    quote: "He doesn't just hand off screens. He thinks about the whole experience. Working with Varun felt like having a design co-founder on the team.",
    name: 'CEO, Consumer App',
    role: 'Placeholder · Replace with real',
  },
]

export default function Testimonials() {
  return (
    <div className="relative overflow-visible border-b border-gray-200">

      {/* ── Section header ─────────────────────────────────── */}
      <div className="relative overflow-visible px-6 md:px-10 py-6 border-b border-gray-200 flex items-baseline gap-4">
        <span
          className="text-[10px] uppercase tracking-widest text-gray-400"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          02
        </span>
        <h2
          className="text-2xl md:text-3xl font-light text-black"
          style={{ fontFamily: 'Garamond, Georgia, serif' }}
        >
          Kind Words
        </h2>
        <Plus h="left" />
        <Plus h="right" />
        <PlusAt x="33.33%" desktop />
        <PlusAt x="66.66%" desktop />
      </div>

      {/* ── 3-col grid ─────────────────────────────────────── */}
      <div className="relative overflow-visible grid grid-cols-1 md:grid-cols-3">
        <PlusAt x="33.33%" desktop />
        <PlusAt x="66.66%" desktop />

        {testimonials.map((t, i) => (
          <div
            key={t.id}
            className={`px-6 md:px-10 py-10 flex flex-col justify-between gap-6 border-b md:border-b-0 border-gray-200 last:border-b-0 ${i < 2 ? 'md:border-r border-gray-200' : ''}`}
          >
            <p
              className="text-base md:text-lg font-light leading-relaxed text-gray-700"
              style={{ fontFamily: 'Garamond, Georgia, serif' }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <p
                className="text-xs text-gray-700"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {t.name}
              </p>
              <p
                className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {t.role}
              </p>
            </div>
          </div>
        ))}

        <Plus h="left" />
        <Plus h="right" />
      </div>
    </div>
  )
}
