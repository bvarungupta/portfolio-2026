"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  LinkedinLogo,
  SlackLogo,
  InstagramLogo,
  SpotifyLogo,
  PinterestLogo,
  YoutubeLogo,
  DiscordLogo,
  AmazonLogo,
  TwitchLogo,
  RedditLogo,
  WhatsappLogo,
  TwitterLogo,
  ChartLineUp,
  Play,
  TrendUp,
  Palette,
  Note,
  GameController,
  BookOpen,
  PlayCircle,
  Barbell,
  Chalkboard,
  VideoCamera,
  Television,
  PhoneCall,
  MusicNote
} from '@phosphor-icons/react';

const ACCENT = '#0066CC'; // Jio blue

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

const segments = [
  {
    title: "Young Professionals",
    personas: [
      {
        avatar: '/images/WorkImages/jio/male.svg',
        name: "Aman Verma",
        sub: "30 years old · Product Manager · Hyderabad (Tier 1) · Single · ₹20–25 Lakh/yr · Tech Savvy · Practical",
        about: "Aman is a product manager at a fast-growing tech startup who travels frequently for work. Constantly switching between laptop, phone, and tablet disrupts his workflow. In public settings like airports and coworking spaces, the lack of screen privacy makes sensitive work feel exposed. He sees JioGlass as the one device that could replace all of it.",
        situation: "Aman hates people peeking over his shoulder while analyzing stock charts or watching a movie. A private, immersive experience is exactly what he is looking for.",
        goals: "Stay on top of product development and team collaboration. Reduce device dependency. Climb the corporate ladder.",
        frustrations: "Lacks privacy on public transport. Struggles with mobile efficiency for work. Mentally drained by constant device switching.",
        reasons: "Privacy during travel. Multitasking on the go. Enhanced entertainment during downtime.",
        apprehensions: "Comfort during extended wear on long flights. Battery life lasting a full travel day.",
        brands: ["LinkedIn", "Slack", "Bloomberg", "Netflix", "Zerodha"]
      },
      {
        avatar: '/images/WorkImages/jio/female.svg',
        name: "Neha Sharma",
        sub: "28 years old · Marketing Manager · Bangalore (Tier 1) · Single · ₹8–10 Lakh/yr · Creative · Trend Setter",
        about: "Neha thrives in fast-paced environments and spends most of her day on social media, managing clients, and brainstorming campaigns. She loves art galleries, binge-watching shows, and journaling. Known for her fashion sense, she wants tools that enhance productivity without compromising her image. JioGlass appeals to her as a way to lead by example while staying ahead of the curve.",
        situation: "Neha wants tools that enhance productivity and streamline virtual presentations and remote collaboration, all without making her look like she is trying too hard.",
        goals: "Simplify work processes for presentations and remote collaboration. Grow in her career. Balance a busy professional life and personal downtime without sacrificing style.",
        frustrations: "Overwhelmed by steep learning curves of new tech. Struggles to juggle work and personal time. Worried about bulky, unfashionable designs.",
        reasons: "Boost productivity with AR tools for virtual presentations. Stay ahead in her career by embracing innovative tech.",
        apprehensions: "Whether the device will be worth the cost. Integration with existing setup. Time spent learning something new.",
        brands: ["Instagram", "Canva", "Notion", "Spotify", "Pinterest"]
      }
    ]
  },
  {
    title: "Casual Gamers",
    personas: [
      {
        avatar: '/images/WorkImages/jio/female2.svg',
        name: "Mishayl",
        sub: "Young adult · Casual Gamer · Family-oriented",
        about: "Mishayl loves family gaming nights and movie nights with cousins. She sees JioGlass as a way to make multiplayer sessions more immersive and comfortable, and to transform her home into a personal cinema for group viewing experiences.",
        situation: "Mishayl envisions AR glasses enhancing family gaming nights where immersive visuals and interactive features make multiplayer sessions more engaging and comfortable.",
        goals: "Make family gaming more immersive and interactive. Elevate home entertainment experiences. Bond with family through shared AR experiences.",
        frustrations: "Existing gaming setups feel flat and disconnected. Struggles to find experiences that bring the whole family together.",
        reasons: "Immersive family gaming. Group movie experiences. Interactive AR entertainment.",
        apprehensions: "Whether the experience will be comfortable for extended family sessions. Cost vs value for a shared household device.",
        brands: ["YouTube", "Discord", "Netflix", "Amazon", "Instagram"]
      },
      {
        avatar: '/images/WorkImages/jio/male2.svg',
        name: "Dhanush",
        sub: "Young adult · Passionate Gamer · Experience Seeker",
        about: "Dhanush is a passionate gamer who thrives on immersive experiences, whether outdoor games like Pokémon Go or indoor sessions where he can project entire game environments into his space. He is constantly seeking ways to make gaming more interactive and engaging.",
        situation: "Dhanush wants to project entire game environments into his space and make every session feel like stepping inside the game itself.",
        goals: "Push gaming experiences to the next level. Explore outdoor and indoor AR gaming. Immerse himself in game environments beyond a screen.",
        frustrations: "Current setups cannot match the level of immersion he craves. Feels limited by traditional screens and controllers.",
        reasons: "Full-environment gaming projection. Outdoor AR gaming. Next-level immersion.",
        apprehensions: "Latency and responsiveness in fast-paced games. Compatibility with existing gaming platforms.",
        brands: ["Steam", "YouTube", "Twitch", "Discord", "Reddit"]
      }
    ]
  },
  {
    title: "Gen Z / Students",
    personas: [
      {
        avatar: '/images/WorkImages/jio/male3.svg',
        name: "Arnav",
        sub: "Teen · Student · Curious Learner",
        about: "Arnav struggles to grasp complex science concepts through traditional textbooks. After watching a STEM YouTuber use AR to explain the solar system or molecules, he became fascinated with how AR could make learning more interactive and engaging.",
        situation: "Arnav might ask his parents for an AR device after seeing how it could make complex science concepts come alive in a way no textbook could.",
        goals: "Make studying more interactive and visual. Explore STEM concepts in 3D. Stay engaged with content that matches his digital-native instincts.",
        frustrations: "Traditional textbooks feel static and hard to connect with. Finds it difficult to visualise abstract concepts.",
        reasons: "Interactive and immersive learning. 3D visualisation of complex concepts. Engagement through tech.",
        apprehensions: "Whether parents will see it as a learning tool rather than a gaming device. Screen time concerns.",
        brands: ["YouTube", "Khan Academy", "Instagram", "Reddit", "Spotify"]
      },
      {
        avatar: '/images/WorkImages/jio/male4.svg',
        name: "Rohan",
        sub: "Teen · Student · Gaming Enthusiast",
        about: "Rohan is most likely to purchase JioGlass during a special promotion or festival offer. A compelling demo at a local store or online showcasing immersive gaming and multiplayer AR features could spark his interest. Gaming influencers play a big role in his purchase decisions.",
        situation: "Rohan responds to influencer demos and festival offers. A well-placed campaign showing real gaming use cases from creators he follows could be the tipping point.",
        goals: "Elevate gaming with immersive AR. Stay connected with friends through multiplayer experiences. Discover new ways to experience content.",
        frustrations: "Current gaming setup lacks the immersion he sees content creators experiencing. Budget constraints make premium tech feel out of reach.",
        reasons: "Immersive gaming. Multiplayer AR experiences. Influencer-validated tech.",
        apprehensions: "Price point. Whether the experience matches what he has seen online.",
        brands: ["YouTube", "Instagram", "Twitch", "Discord", "Spotify"]
      }
    ]
  },
  {
    title: "Experience Seekers",
    personas: [
      {
        avatar: '/images/WorkImages/jio/female3.svg',
        name: "Kashish",
        sub: "Young adult · Experience Seeker · Entertainment Lover",
        about: "Kashish thrives on engaging entertainment but feels limited by traditional experiences. He is intrigued by AR potential to elevate gaming, make it more dynamic and interactive, or host virtual movie nights with friends. He wants to explore alternate realities and bring friends into shared immersive spaces.",
        situation: "Kashish might use AR to explore alternate gaming realities or bring virtual movie nights to life with friends, turning passive entertainment into something participatory.",
        goals: "Elevate everyday entertainment beyond the screen. Host virtual movie nights and gaming sessions with friends. Explore alternate realities and creative AR spaces.",
        frustrations: "Traditional entertainment feels flat and passive. Limited by what a standard phone or TV screen can offer.",
        reasons: "Dynamic interactive entertainment. Social AR experiences with friends. Exploring new forms of content.",
        apprehensions: "Whether the social AR experience requires others to also own the device. Content library depth.",
        brands: ["Netflix", "Spotify", "Instagram", "YouTube", "Reddit"]
      },
      {
        avatar: '/images/WorkImages/jio/male.svg',
        name: "Rajesh",
        sub: "Working adult · Family Man · Fitness Enthusiast",
        about: "Rajesh envisions using AR glasses to host family game nights where everyone can enjoy interactive and immersive gaming together. He is also excited about integrating fitness-oriented AR games like virtual workouts and active challenges into his personal routine.",
        situation: "Rajesh sees JioGlass as a family device first — something that brings everyone to the same immersive experience, then doubles as his personal fitness companion.",
        goals: "Bring the family together through interactive AR gaming. Integrate fitness into his daily routine through AR. Balance work, family, and personal wellness.",
        frustrations: "Hard to find activities that engage the whole family. Fitness routines feel repetitive and unmotivated.",
        reasons: "Family AR gaming. Fitness-oriented AR experiences. Active and engaging entertainment.",
        apprehensions: "Whether family members of different ages can use it comfortably. Durability for active use.",
        brands: ["YouTube", "WhatsApp", "Amazon", "Hotstar", "Cult.fit"]
      }
    ]
  },
  {
    title: "Educators / Pros",
    personas: [
      {
        avatar: '/images/WorkImages/jio/male2.svg',
        name: "Dr. Kapoor",
        sub: "Academic · Physics Educator · Innovation Advocate",
        about: "Dr. Kapoor frequently engages with students who struggle to grasp abstract physics concepts. AR glasses can help him bring those concepts to life with simulations and 3D models — demonstrating particle behavior in a collider or the dynamics of planetary orbits in a highly visual, interactive manner.",
        situation: "Dr. Kapoor wants to demonstrate particle behavior in a collider or planetary orbits not through a diagram on a board, but through a living, interactive simulation students can see in front of them.",
        goals: "Make abstract science concepts tangible and visual. Improve student engagement and comprehension. Stay at the forefront of EdTech innovation.",
        frustrations: "Students struggle to visualise abstract physics concepts through traditional teaching methods. Existing tools lack the interactivity needed to truly engage learners.",
        reasons: "3D simulations for physics teaching. Immersive classroom experiences. Interactive demonstrations of complex concepts.",
        apprehensions: "Whether the technology is reliable enough for classroom use. Learning curve for non-tech-savvy students.",
        brands: ["Google Classroom", "YouTube", "LinkedIn", "Khan Academy", "Notion"]
      },
      {
        avatar: '/images/WorkImages/jio/male3.svg',
        name: "Jaffer",
        sub: "Professional · Tech Entrepreneur · Innovation-Forward",
        about: "Jaffer would enjoy JioGlass because it aligns with his passion for exploring innovative technology and staying at the forefront of industry trends. The ability to engage in immersive virtual meetings, interact with 3D models, and multitask hands-free appeals to his interest in pushing the boundaries of how work gets done.",
        situation: "Jaffer sees JioGlass not as a consumer product but as a professional tool that could fundamentally change how he runs meetings, reviews 3D models, and collaborates across distances.",
        goals: "Push the boundaries of how work and collaboration happen. Stay ahead of emerging technology trends. Lead by example in adopting future-forward tools.",
        frustrations: "Current tools for remote collaboration feel flat and disconnected. Feels limited by what existing hardware allows in professional settings.",
        reasons: "Immersive virtual meetings. Hands-free multitasking. 3D model interaction for design and strategy.",
        apprehensions: "Enterprise compatibility. Whether colleagues and clients will adapt to the new format.",
        brands: ["LinkedIn", "Slack", "Notion", "Google Meet", "Twitter"]
      }
    ]
  },
  {
    title: "Baby Boomers",
    personas: [
      {
        avatar: '/images/WorkImages/jio/female4.svg',
        name: "Kamala Devi",
        sub: "70 years old · Housewife · Pune (Tier 1) · Widow · Caring · Family-Oriented · Patient",
        about: "Kamala Devi lives with her son, daughter-in-law, and two grandchildren. She cherishes time with family, teaching traditions like cooking and stitching. After cataract surgery she wears glasses for close-up tasks. She occasionally feels lonely when her children are busy, and lacks entertainment variety in her daily routine.",
        situation: "Kamala's son could introduce her to JioGlass by setting up her favourite old movies for a comfortable immersive viewing experience. As she watches she might be amazed by the clarity and ease of use, and discover a new way to connect with her grandchildren through immersive storytelling.",
        goals: "Keep grandchildren entertained with fun educational activities. Reduce isolation and connect with neighbours and family. Enjoy more variety in her entertainment.",
        frustrations: "Difficulty with close-up tasks without glasses. Poor audio and visual quality on video calls. Grandchildren's energy sometimes leads to broken things around the house.",
        reasons: "Enhanced connectivity with family. Comfortable visuals suited for her needs. Relaxed and immersive entertainment.",
        apprehensions: "New technology may be too complicated to use. Worried about eye strain. Fears grandchildren might damage the device.",
        brands: ["YouTube", "WhatsApp", "Hotstar", "JioTV", "Truecaller"]
      },
      {
        avatar: '/images/WorkImages/jio/male4.svg',
        name: "Harish Chandra",
        sub: "65 years old · Retired Government Officer · Varanasi (Tier 2) · Widower · Sentimental · Nostalgic · Loving",
        about: "Harish lives with his daughter and her family after losing his wife. He stays active through community events and time with his grandchildren. He finds solace in classic Hindi movies, ghazals, and old songs. Quiet evenings often bring loneliness, but he remains warm and purposeful through family and community connections.",
        situation: "Harish's daughter could introduce AR glasses by setting up cherished photos, videos of his wife, and classic Hindi films, making the experience feel personal and familiar before it feels like technology.",
        goals: "Foster deep connections with his daughter and grandchildren. Maintain good physical and mental health. Share life experiences, stories, and values with his grandchildren.",
        frustrations: "Struggles with modern devices and feels disconnected from family. Feels left out as family uses advanced tech while he sticks to basic phone functions. Isolation during quiet evenings.",
        reasons: "Experience and relive cherished memories. Virtual engagement through music and classic movies. Stay connected with family through immersive video calls.",
        apprehensions: "Concerned about growing more isolated as family gets busier. Worried that embracing too many changes at once might overwhelm him.",
        brands: ["YouTube", "WhatsApp", "JioTV", "Hotstar", "Gaana"]
      }
    ]
  }
];

const brandIconMap: { [key: string]: React.ComponentType<{ weight?: 'fill' | 'regular' | 'thin' | 'light' | 'bold' | 'duotone'; size?: number | string; className?: string }> } = {
  'LinkedIn': LinkedinLogo,
  'Slack': SlackLogo,
  'Bloomberg': ChartLineUp,
  'Netflix': Play,
  'Zerodha': TrendUp,
  'Instagram': InstagramLogo,
  'Canva': Palette,
  'Notion': Note,
  'Spotify': SpotifyLogo,
  'Pinterest': PinterestLogo,
  'YouTube': YoutubeLogo,
  'Discord': DiscordLogo,
  'Amazon': AmazonLogo,
  'Steam': GameController,
  'Twitch': TwitchLogo,
  'Reddit': RedditLogo,
  'Khan Academy': BookOpen,
  'WhatsApp': WhatsappLogo,
  'Hotstar': PlayCircle,
  'Cult.fit': Barbell,
  'Google Classroom': Chalkboard,
  'Google Meet': VideoCamera,
  'Twitter': TwitterLogo,
  'JioTV': Television,
  'Truecaller': PhoneCall,
  'Gaana': MusicNote
};

export default function JioGlasses() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('jio-brief');
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredProcessStep, setHoveredProcessStep] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [empathySlide, setEmpathySlide] = useState(0);
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  const moodboardScrollRef = useRef<HTMLDivElement>(null);
  const [moodboardSlide, setMoodboardSlide] = useState(0);
  const [activeSegment, setActiveSegment] = useState(0);
  const [activePersona, setActivePersona] = useState(0);

  const scrollMoodboard = (dir: number) => {
    const el = moodboardScrollRef.current; if (!el) return;
    const next = moodboardSlide + dir;
    if (next < 0 || next > 6) return;
    el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' });
  };

  const handleMoodboardScroll = () => {
    const el = moodboardScrollRef.current; if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    if (index !== moodboardSlide && index >= 0 && index <= 6) {
      setMoodboardSlide(index);
    }
  };

  const sections = [
    { id: 'jio-brief', label: 'Overview' },
    { id: 'jio-problem', label: 'The Problem' },
    { id: 'jio-solution', label: 'The Solution' },
    { id: 'jio-objectives', label: 'Objectives' },
    { id: 'jio-user-research', label: 'User Research' },
    { id: 'jio-empathy-map', label: 'Empathy Maps' },
    { id: 'jio-process', label: 'Process' },
    { id: 'jio-wireflow', label: 'Wireflow' },
    { id: 'jio-moodboard', label: 'Moodboard' },
    { id: 'jio-design-system', label: 'Design System' },
    { id: 'jio-the-design', label: 'The Design' },
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

  return (
    <div className="bg-white min-h-screen mt-16 px-4 md:px-0">

      {/* ── Sticky sidebar ──────────────────────────────────────────── */}
      {mounted && createPortal(
        <>
          <div
            className="hidden xl:block fixed z-[9998] pointer-events-none"
            style={{
              top: 'calc(50% - 175px)',
              bottom: 'calc(50% - 175px)',
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
              src="/images/WorkImages/jio/JioLogo.svg"
              alt="Reliance Tesseract logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-light tracking-tight" style={{ fontFamily: 'SatishSans, sans-serif' }}>
            Jio Tesseract
          </h1>
          <Image src="/images/common/vg-outline.svg" alt="Product Design Work" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain opacity-20" />
          <Plus h="left" />
          <Plus h="right" />
        </div>

        {/* ── Brief ───────────────────────────────────────────────────── */}
        <div id="jio-brief" className="relative overflow-visible border-b border-gray-200">

          {/* Meta strip */}
          <div className="relative flex flex-wrap md:flex-nowrap items-stretch border-b border-gray-200">
            {[
              { label: 'Company', value: 'Jio Tesseract' },
              { label: 'Role', value: 'Product Designer' },
              { label: 'Deliverable', value: 'Zero to V1' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-6 md:px-8 py-3 ${i === 1 ? 'border-l border-gray-200' : ''} ${i === 2 ? 'w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-200' : ''}`}
              >
                <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.label}</span>
                <span className="text-[11px] text-gray-700" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.value}</span>
              </div>
            ))}
            {/* Scope marquee */}
            <div className="flex items-center gap-2 w-full md:w-auto pl-6 md:pl-8 pr-6 py-3 border-t md:border-t-0 md:border-l border-gray-200 overflow-hidden min-w-0 md:flex-1">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Scope</span>
              <div className="overflow-hidden flex-1" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)' }}>
                <div className="flex gap-2 w-max" style={{ animation: 'marquee 14s linear infinite' }}>
                  {['Packaging', 'Web Design', 'User Research', 'Application UI/UX', 'Brand Identity', 'Design System', 'Motion', 'End to End Product UI/UX', 'Packaging', 'Web Design', 'User Research', 'Application UI/UX', 'Brand Identity', 'Design System', 'Motion', 'End to End Product UI/UX'].map((tag, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 border border-gray-200 text-gray-500 whitespace-nowrap" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>

          {/* Cover image */}
          <div className="w-full border-b border-gray-200">
            <Image
              src="/images/WorkImages/jio/thumbnail.webp"
              alt="Jio Tesseract"
              width={1600}
              height={900}
              className="w-full h-auto block"
            />
          </div>

          {/* Brief content */}
          <div className="px-6 md:px-10 py-6 md:py-8">
            <SectionLabel>The Brief</SectionLabel>
            <SectionHeading>India's first consumer MR glasses. Designed for everyone.</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Jio Tesseract had the hardware. A lightweight, 76g mixed reality headset with a 201-inch virtual screen, spatial audio, and cross-device compatibility. What they needed was a landing page that could make someone who had never worn AR glasses in their life feel like they absolutely needed to.
              <br /><br />
              The challenge wasn&apos;t technical. It was human. JioGlass wasn&apos;t targeting early adopters or tech enthusiasts — it was targeting India at scale. Students, retirees, gamers, professionals, binge watchers. Four completely different people with four completely different reasons to care. The design had to hold all of them without losing any of them.
              <br /><br />
              I joined the Jio Tesseract UX team as a designer on this project. We started from scratch — moodboards, photography direction, 3D render references, persona research across three user segments, empathy mapping, information architecture, wireflows, wireframes, and final visual design. Every section of the page had to earn its place. Every headline had to do real work.
            </p>
            <a
              href="https://www.figma.com/design/5aUxcV70YBMnXEkFuuoP38/Jio-Glasses-Master-UX?node-id=80-22346&t=EUx1LK3PivKu9ipa-1"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredLink('process')}
              onMouseLeave={() => setHoveredLink(null)}
              className="inline-flex items-center gap-2 mt-4 text-[11px] px-3 py-1.5 border"
              style={{
                fontFamily: 'FunnelDisplay, sans-serif',
                background: hoveredLink === 'process' ? '#0F3CC9' : 'transparent',
                borderColor: hoveredLink === 'process' ? '#0F3CC9' : '#e5e7eb',
                color: hoveredLink === 'process' ? 'white' : '#6b7280',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 object-contain">
                <g clipPath="url(#clip0_jio_btn)">
                  <rect width="120" height="120" rx="60" fill={hoveredLink === 'process' ? 'white' : '#000093'} style={{ transition: 'fill 0.2s ease' }} />
                  <path
                    d="M87.9373 72.7941C83.5218 72.7941 80.4819 69.5523 80.4819 64.9252C80.4819 60.3655 83.5891 57.1237 87.9373 57.1237C92.2854 57.1237 95.3926 60.3655 95.3926 64.9926C95.3926 69.4753 92.2181 72.7941 87.9373 72.7941ZM88.0816 47.0327C76.7591 47.0327 69.2268 54.2186 69.2268 64.9156C69.2268 75.8916 76.4801 82.9332 87.8699 82.9332C99.1924 82.9332 106.648 75.8916 106.648 64.9829C106.648 54.2186 99.2694 47.0327 88.0816 47.0327ZM58.9047 31.3623C54.6239 31.3623 51.9304 33.7768 51.9304 37.5766C51.9304 41.4437 54.6913 43.8582 59.1067 43.8582C63.3875 43.8582 66.0811 41.4437 66.0811 37.5766C66.0811 33.7095 63.3202 31.3623 58.9047 31.3623ZM59.6647 47.379H58.2794C54.9029 47.379 52.344 48.9662 52.344 53.8049V75.9012C52.344 80.8072 54.8259 82.3271 58.4237 82.3271H59.7994C63.1855 82.3271 65.6001 80.6726 65.6001 75.9012V53.8049C65.6001 48.8316 63.2529 47.379 59.6647 47.379ZM41.5795 36.9609H39.5786C35.7787 36.9609 33.7105 39.1061 33.7105 43.3869V64.0306C33.7105 69.3503 31.9116 71.2165 27.7077 71.2165C24.3985 71.2165 21.705 69.7639 19.5598 67.1377C19.3481 66.8588 15 68.927 15 74.0446C15 79.5663 20.1754 82.9524 29.776 82.9524C41.4448 82.9524 47.5919 77.0844 47.5919 64.2422V43.3772C47.5919 39.0965 45.5236 36.9609 41.5795 36.9609Z"
                    fill={hoveredLink === 'process' ? '#0F3CC9' : 'white'}
                    style={{ transition: 'fill 0.2s ease' }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_jio_btn">
                    <rect width="120" height="120" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              View Full Process
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
          </div>
        </div>

        {/* ── KPI strip ───────────────────────────────────────────────── */}
        <div className="relative border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { value: '450M+', label: 'Jio Subscribers', sub: 'The scale the design had to speak to' },
              { value: '12 Weeks', label: 'Turnaround', sub: 'From first session to V1 live' },
              { value: '45+', label: 'Screens Designed', sub: 'Landing page, built end to end, Spatial UI' },
            ].map((s, i) => {
              const hovered = hoveredStat === s.value;
              return (
                <div
                  key={s.value}
                  className="relative overflow-hidden cursor-default border-b border-gray-200 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                  onMouseEnter={() => setHoveredStat(s.value)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse 160% 120% at 50% 120%, rgba(0,102,204,0.15) 0%, transparent 70%)',
                      opacity: hovered ? 1 : 0,
                      transition: 'opacity 0.25s ease',
                    }}
                  />
                  <div className="relative px-8 py-8 md:px-8 md:py-5">
                    <p
                      className="text-4xl md:text-3xl font-light mb-1 transition-colors duration-200"
                      style={{ fontFamily: 'SatishSans, sans-serif', color: hovered ? ACCENT : '#111' }}
                    >
                      {s.value}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{s.label}</p>
                    <p className="text-[10px] text-gray-400" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Problem Section ─────────────────────────────────────────── */}
        <div id="jio-problem" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">
            <div className="max-w-3xl mb-12">
              <SectionLabel>The Problem</SectionLabel>
              <SectionHeading>Mixed Reality is inevitable. But hardware alone doesn&apos;t sell.</SectionHeading>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Jio Tesseract had built hardware that could genuinely change how people consume content, work, and experience the world. But hardware alone doesn&apos;t sell, especially in a category most Indians had never interacted with before.
                <br /><br />
                The landing page needed to introduce an entirely new product category, speak to four completely different types of users, and make the technology feel inevitable to someone who had never worn AR glasses in their life. There was no existing playbook for this. No Indian brand had launched consumer MR at this scale before.
              </p>
            </div>

            <div className="pt-10 border-t border-gray-200">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Key Friction Points</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'No Category Playbook',
                    desc: 'No major Indian brand had launched consumer-grade mixed reality at this scale before, meaning zero local reference points for user behavior.'
                  },
                  {
                    title: 'The Unfamiliarity Barrier',
                    desc: 'Mixed reality is hard to explain in text or static images. Users needed to feel what it is like before putting them on.'
                  },
                  {
                    title: 'One Page, Four Personas',
                    desc: 'A single page experience had to speak to Binge Watchers, Gamers, Professionals, and Students simultaneously without clutter.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-sm font-mono text-[#0066CC] mb-3">0{i + 1}.</span>
                    <h4 className="text-sm font-medium text-gray-800 mb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{item.title}</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Solution Section ────────────────────────────────────────── */}
        <div id="jio-solution" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">
            <SectionLabel>The Solution</SectionLabel>
            <SectionHeading>Show people their version of JioGlass before selling them the product.</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed max-w-3xl mb-10" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              A persona-driven landing page experience built around one core idea: show people their version of JioGlass before selling them the product. Instead of a generic feature dump, the page was structured to meet each user segment exactly where they are. Binge watchers see their cinema, gamers see their battlefield, professionals see their portable office. Every section, every headline, and every visual decision was tied directly back to the research.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Binge Watchers',
                  subtitle: 'Their Cinema',
                  desc: 'A virtual 201-inch screen with immersive spatial audio, turning any space into a private personal theatre.'
                },
                {
                  title: 'Gamers',
                  subtitle: 'Their Battlefield',
                  desc: 'Zero-latency mirroring, massive portable HUD view, and high-fidelity visuals right in front of their eyes.'
                },
                {
                  title: 'Professionals',
                  subtitle: 'Their Portable Office',
                  desc: 'A multi-screen virtual desktop workspace built for lightweight 76g comfort during extended work sessions.'
                }
              ].map((card, i) => (
                <div
                  key={i}
                  className="group relative p-6 border border-gray-200 transition-all duration-300 hover:border-[#0066CC] hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#0066CC]/[0.01] rounded-full blur-2xl group-hover:bg-[#0066CC]/[0.04] transition-all duration-500 pointer-events-none" />
                  <p className="text-[10px] font-mono text-[#0066CC] mb-4">SEGMENT 0{i + 1}</p>
                  <h3 className="text-lg font-light text-gray-800 mb-1" style={{ fontFamily: 'SatishSans, sans-serif' }}>{card.title}</h3>
                  <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{card.subtitle}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Objectives Section ───────────────────────────────────────── */}
        <div id="jio-objectives" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">
            <SectionLabel>Objectives</SectionLabel>
            <SectionHeading>Three Pillars of Conviction</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed max-w-3xl mb-10" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              To turn general curiosity into absolute conviction, the landing page had to address critical user psychology barriers and deliver value across three main pillars.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200">
              {[
                {
                  num: '01',
                  title: 'Make the unfamiliar feel familiar',
                  desc: 'Design an experience that introduces a brand new product category to users who have never encountered MR hardware before, without overwhelming or alienating them.'
                },
                {
                  num: '02',
                  title: 'Speak to everyone without losing anyone',
                  desc: 'Build a single cohesive page narrative that serves four distinct user segments, each with different motivations, concerns, and entry points.'
                },
                {
                  num: '03',
                  title: 'Turn hesitation into conviction',
                  desc: 'Proactively address the doubts users didn&apos;t know they had, about comfort, usability, and relevance to their life, before they had a chance to bounce.'
                }
              ].map((obj, i) => (
                <div key={i} className="px-6 py-8 hover:bg-gray-50/30 transition-colors duration-300">
                  <div className="text-2xl font-light font-mono text-[#0066CC] mb-4">{obj.num}</div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{obj.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{obj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── User Research Section ───────────────────────────────────── */}
        <div id="jio-user-research" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-10 md:py-16">
            <SectionLabel>User Research</SectionLabel>
            <SectionHeading>Six Segments, Twelve Personas</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-10" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              Before designing a single screen, we mapped who we were designing for — six completely different segments of mass India, each with their own motivations, frustrations, and entry points. Twelve personas. Every design decision had a real person behind it.
            </p>

            {/* ── Segment Selector — 3-col stat-card style ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 mb-10">
              {segments.map((seg, idx) => {
                const isActive = activeSegment === idx;
                const isHovered = hoveredSegment === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => { setActiveSegment(idx); setActivePersona(0); }}
                    onMouseEnter={() => setHoveredSegment(idx)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    className={`relative overflow-hidden px-5 py-5 text-left cursor-pointer ${isActive ? 'bg-[#0066CC]' : 'bg-white'
                      }`}
                  >
                    {/* Radial glow for inactive hovered — same as stats card */}
                    {!isActive && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'radial-gradient(ellipse 160% 120% at 50% 120%, rgba(0,102,204,0.15) 0%, transparent 70%)',
                          opacity: isHovered ? 1 : 0,
                          transition: 'opacity 0.25s ease',
                        }}
                      />
                    )}
                    <div className="relative">
                      <span className={`text-[9px] font-mono block mb-2 tracking-widest transition-colors duration-200 ${isActive ? 'text-blue-200' : isHovered ? 'text-[#0066CC]' : 'text-gray-400'
                        }`}>
                        SEGMENT 0{idx + 1}
                      </span>
                      <p
                        className={`text-sm font-medium leading-tight transition-colors duration-200 ${isActive ? 'text-white' : isHovered ? 'text-[#0066CC]' : 'text-gray-800'
                          }`}
                        style={{ fontFamily: 'SatishSans, sans-serif' }}
                      >
                        {seg.title}
                      </p>
                      <p className={`text-[10px] mt-1 font-mono transition-colors duration-200 ${isActive ? 'text-blue-200' : isHovered ? 'text-[#0066CC]/60' : 'text-gray-400'
                        }`}>
                        {seg.personas.length} personas
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Persona viewer ── */}
            {(() => {
              const pers = segments[activeSegment].personas[activePersona];
              const total = segments[activeSegment].personas.length;
              const subTags = pers.sub.split(/\s*[·•]\s*/).map(s => s.trim()).filter(Boolean);
              return (
                <div className="border-none md:border md:border-gray-200">
                  {/* Top bar — name + nav */}
                  <div className="flex items-start justify-between px-0 md:px-8 pt-6 md:pt-8 pb-5 md:pb-6 border-b border-gray-200 gap-4 md:gap-6">
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono text-[#0066CC] uppercase tracking-widest block mb-2">
                        Persona 0{activePersona + 1} / 0{total} · {segments[activeSegment].title}
                      </span>
                      <h4 className="text-xl md:text-2xl font-light text-gray-900 mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>
                        {pers.name}
                      </h4>
                      {/* Sub-line as marquee — never wraps on mobile */}
                      <div
                        className="overflow-hidden"
                        style={{
                          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 90%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 90%, transparent 100%)',
                        }}
                      >
                        <div
                          className="flex gap-2 w-max"
                          style={{ animation: 'marquee 18s linear infinite' }}
                        >
                          {[...subTags, ...subTags].map((tag, ti) => (
                            <span
                              key={ti}
                              className="inline-block px-2.5 py-1 text-[10px] font-mono text-[#0066CC] bg-[#0066CC]/[0.05] border border-[#0066CC]/20 leading-none whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Prev / Next */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <button
                        onClick={() => setActivePersona(p => Math.max(0, p - 1))}
                        disabled={activePersona === 0}
                        style={{
                          width: 36, height: 36,
                          background: activePersona === 0 ? 'white' : ACCENT,
                          color: activePersona === 0 ? '#d1d5db' : 'white',
                          border: `1.5px solid ${activePersona === 0 ? '#d1d5db' : ACCENT}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: activePersona === 0 ? 'not-allowed' : 'pointer',
                          transition: 'all .2s',
                        }}
                        aria-label="Previous persona"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button
                        onClick={() => setActivePersona(p => Math.min(total - 1, p + 1))}
                        disabled={activePersona === total - 1}
                        style={{
                          width: 36, height: 36,
                          background: activePersona === total - 1 ? 'white' : ACCENT,
                          color: activePersona === total - 1 ? '#d1d5db' : 'white',
                          border: `1.5px solid ${activePersona === total - 1 ? '#d1d5db' : ACCENT}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: activePersona === total - 1 ? 'not-allowed' : 'pointer',
                          transition: 'all .2s',
                        }}
                        aria-label="Next persona"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Content — single column stacked sections */}
                  <div className="divide-y divide-gray-100">
                    {/* About */}
                    <div className="px-0 md:px-8 py-7">
                      <p className="text-xs font-mono text-[#0066CC] uppercase tracking-widest mb-3">About</p>
                      <p className="text-sm text-gray-600 leading-loose" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                        {pers.about}
                      </p>
                    </div>
                    {/* Trigger */}
                    <div className="px-0 md:px-8 py-7 bg-transparent md:bg-[#0066CC]/[0.02]">
                      <p className="text-xs font-mono text-[#0066CC] uppercase tracking-widest mb-3">✦ Trigger Situation</p>
                      <p className="text-sm text-gray-700 leading-loose" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                        {pers.situation}
                      </p>
                    </div>
                    {/* Goals */}
                    <div className="px-0 md:px-8 py-7">
                      <p className="text-xs font-mono text-[#0066CC] uppercase tracking-widest mb-3">Goals</p>
                      <p className="text-sm text-gray-600 leading-loose" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{pers.goals}</p>
                    </div>
                    {/* Frustrations */}
                    <div className="px-0 md:px-8 py-7">
                      <p className="text-xs font-mono text-[#0066CC] uppercase tracking-widest mb-3">Frustrations</p>
                      <p className="text-sm text-gray-600 leading-loose" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{pers.frustrations}</p>
                    </div>
                    {/* Why Buy */}
                    <div className="px-0 md:px-8 py-7">
                      <p className="text-xs font-mono text-[#0066CC] uppercase tracking-widest mb-3">Why Buy</p>
                      <p className="text-sm text-gray-600 leading-loose" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{pers.reasons}</p>
                    </div>
                    {/* Apprehensions */}
                    <div className="px-0 md:px-8 py-7">
                      <p className="text-xs font-mono text-[#0066CC] uppercase tracking-widest mb-3">Apprehensions</p>
                      <p className="text-sm text-gray-600 leading-loose" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{pers.apprehensions}</p>
                    </div>
                  </div>

                  {/* Brands footer */}
                  <div className="px-0 md:px-8 py-6 border-t border-gray-200 bg-transparent md:bg-gray-50/30 flex flex-wrap items-center gap-3">
                    <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mr-2">Platforms</p>
                    {pers.brands.map((brand, bIdx) => {
                      const IconComp = brandIconMap[brand];
                      return (
                        <div
                          key={bIdx}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-500 hover:text-[#0066CC] hover:border-[#0066CC] transition-all duration-200 cursor-default"
                          title={brand}
                        >
                          {IconComp && <IconComp weight="fill" size={12} className="text-current flex-shrink-0" />}
                          <span className="text-[9px] font-mono leading-none">{brand}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Slide dots */}
                  <div className="flex items-center gap-2 px-0 md:px-8 py-4 border-t border-gray-200">
                    {segments[activeSegment].personas.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePersona(i)}
                        style={{
                          width: i === activePersona ? 20 : 6,
                          height: 6,
                          borderRadius: 3,
                          background: i === activePersona ? ACCENT : '#d1d5db',
                          transition: 'all .3s',
                          cursor: 'pointer',
                          border: 'none',
                          padding: 0,
                        }}
                        aria-label={`Go to persona ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* ── Empathy Map Section ─────────────────────────────────────── */}
        {(() => {
          const empathyPersonas = [
            {
              name: 'Aman Verma',
              age: '30 years old',
              profession: 'Product Manager',
              segment: 'Segment 1',
              segmentLabel: 'Young Professionals',
              says: 'Switching between laptop, phone, and tablet feels mentally exhausting. Hates feeling watched while working on sensitive financial data. Wants something productive that does not add bulk to his bag.',
              thinks: 'How do I keep my work private when I am on the move? Will the battery last a full flight? It would be amazing to have one tool that handles work and lets me unwind.',
              feels: 'Frustrated by the lack of privacy and efficiency during travel. Confident about exploring cutting-edge tech that aligns with his ambitions. Tired of squinting at a tiny screen trying to decipher endless data.',
              does: 'Uses high-end laptop and smartphone for work and entertainment. Invests time researching products before committing. Engages in forums focused on financial analysis tools. Always keeps himself busy with work or entertainment.',
            },
            {
              name: 'Neha Sharma',
              age: '28 years old',
              profession: 'Marketing Manager',
              segment: 'Segment 1',
              segmentLabel: 'Young Professionals',
              says: 'Loves staying on top of trends because that is what makes her campaigns stand out. Looking good and staying professional is non-negotiable. Wants presentations with a wow factor without spending hours on them.',
              thinks: 'Am I doing enough to stay ahead in my career? Wishes she could manage work and personal life without feeling so drained. Needs to set a positive example for her team.',
              feels: 'Frustrated by the overwhelming demands of her job and the steep learning curve of new tech. Feels the need to push creative boundaries and make her mark. Wants to stay polished and professional while staying connected and efficient.',
              does: 'Regularly explores trendy items that fit her lifestyle. Watches reels to stay updated on makeup, music, and entertainment. Follows influencers and purchases items they promote. Constantly experiments with ways to elevate her presentation.',
            },
            {
              name: 'Dhanush CP',
              age: 'Teen',
              profession: 'Casual Gamer',
              segment: 'Segment 2',
              segmentLabel: 'Casual Gamers',
              says: 'Pokémon Go is fun but imagines a Pokémon actually coming to life. Loves hanging out and staying active. Wants to run while playing a video game and not stay in one place.',
              thinks: 'How can he take gaming to the next level? Loves virtual worlds but does not want to miss real-world adventures. Wondering if his parents can afford a high-tech device that supports his gaming. The idea of digital elements blending into the real world feels mind-blowing.',
              feels: 'Excited about blending virtual and real worlds through AR. Frustrated by the limitations of current gaming setups for outdoor use. Gets worried his interests might be too expensive. Passionate about gaming as a way to express himself and connect with others.',
              does: 'Spends hours strategizing and leveling up characters. Explores outdoors with games like Pokémon Go. Plays multiplayer sessions with friends. Researches new games and gadgets constantly. Dreams of gaming gear that is lightweight, portable, and immersive.',
            },
            {
              name: 'Mehak Singh',
              age: 'Teen',
              profession: 'Student',
              segment: 'Segment 3',
              segmentLabel: 'Gen Z / Students',
              says: 'Loves learning about different cultures and historical sites. Wishes history and geography lessons were more exciting and real. Wants her school projects to stand out and impress everyone.',
              thinks: 'It would be amazing to feel like she is actually visiting the places she reads about. Needs something that helps her connect better with study topics. There is so much more to history and geography than textbooks can show.',
              feels: 'Excited about exploring new ways to learn beyond the classroom. Frustrated by the theoretical and dull nature of her current lessons. Curious about the world and how cultures differ. Hesitant about relying too much on technology.',
              does: 'Spends hours learning and experimenting with new design tools. Takes on freelance projects to build her portfolio. Finds inspiration at art galleries and tries new creative techniques. Pushes herself to blend artistic skills with innovative technology.',
            },
            {
              name: 'Nitesh Varma',
              age: 'Adult',
              profession: 'Interior Designer',
              segment: 'Segment 4',
              segmentLabel: 'Experience Seekers',
              says: 'Wants designs that are both functional and stylish and truly stand out. Frustrated when he cannot visualise how a space will come together. Wishes he had more time to relax without feeling guilty about work.',
              thinks: 'Will this design live up to expectations and client needs? How can he find more inspiration and break out of a creative rut? Needs tools that help, not complicate his process. Balancing work, creativity, and personal life feels almost impossible.',
              feels: 'Overwhelmed by his busy schedule and creative blocks. Frustrated when he overthinks decisions or struggles to communicate ideas clearly. Inspired by bold, unique designs and the potential of technology like AR.',
              does: 'Multitasks between interior design projects, lifestyle blogging, and personal life. Explores creative ways to balance functionality and aesthetics. Uses technology to streamline project management but hesitates to adopt new tools fully. Engages in online platforms to network and seek inspiration.',
            },
            {
              name: 'Priya Manjunath',
              age: 'Adult',
              profession: 'Engineering Educator',
              segment: 'Segment 5',
              segmentLabel: 'Educators',
              says: 'Wants students to really get tough concepts without it feeling like rocket science. Teaching is not just about textbooks, it is about making lessons come alive. Imagines how much easier AR would make explaining fluid mechanics.',
              thinks: 'How can she make abstract engineering concepts easier to visualise? Will investing in AR actually help or just be another complicated tool? Needs to stay ahead because students deserve more than just lectures. Will the college back her if she pushes for this kind of tech adoption?',
              feels: 'Frustrated when traditional methods fall flat and students struggle to keep up. Excited about the possibilities AR can bring to the classroom. Hopeful she can make a meaningful impact on how subjects are taught. Nervous about whether she will get the support she needs.',
              does: 'Spends time researching and experimenting with new ways to make lessons interactive. Participates in hackathons and reads tech blogs to stay on top of trends. Creates hands-on learning experiences that go beyond the classroom. Guides students one-on-one to think critically and solve practical problems.',
            },
          ];

          const TOTAL = empathyPersonas.length;
          const current = empathyPersonas[empathySlide];

          const quadrants = [
            {
              key: 'says',
              label: 'Says',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ),
              bg: '#FDF5E6',
              hoverBg: 'radial-gradient(ellipse 160% 120% at 50% 120%, rgba(251,191,36,0.18) 0%, transparent 70%)',
              accentColor: '#D97706',
              text: current.says,
            },
            {
              key: 'thinks',
              label: 'Thinks',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ),
              bg: '#E5F1F7',
              hoverBg: 'radial-gradient(ellipse 160% 120% at 50% 120%, rgba(59,130,246,0.15) 0%, transparent 70%)',
              accentColor: '#2563EB',
              text: current.thinks,
            },
            {
              key: 'feels',
              label: 'Feels',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              ),
              bg: '#F5F3FF',
              hoverBg: 'radial-gradient(ellipse 160% 120% at 50% 120%, rgba(139,92,246,0.15) 0%, transparent 70%)',
              accentColor: '#7C3AED',
              text: current.feels,
            },
            {
              key: 'does',
              label: 'Does',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              ),
              bg: '#E8FAF7',
              hoverBg: 'radial-gradient(ellipse 160% 120% at 50% 120%, rgba(99,102,241,0.15) 0%, transparent 70%)',
              accentColor: '#4F46E5',
              text: current.does,
            },
          ];

          return (
            <div id="jio-empathy-map" className="relative border-b border-gray-200">
              <Plus h="left" v="top" />
              <Plus h="right" v="top" />
              <div className="px-6 md:px-10 py-10 md:py-16">

                {/* Header */}
                <SectionLabel>Empathy Map</SectionLabel>
                <SectionHeading>What users say, think, feel, and do</SectionHeading>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-10" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Personas tell us who the user is. Empathy maps tell us what is actually going on inside their head. For each segment we mapped what users say out loud, what they privately think, what they feel emotionally, and what they actually do day to day. This gap between what people say and what they feel is where the most important design decisions live.
                </p>

                {/* Slide title — segment + counter only */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[9px] font-mono text-[#0066CC] uppercase tracking-widest">{current.segment} · {current.segmentLabel}</span>
                  <span className="w-px h-3 bg-gray-300" />
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{empathySlide + 1} / {TOTAL}</span>
                </div>

                {/* Empathy Map Card */}
                <div className="-mx-6 md:mx-0 border-none md:border md:border-gray-200 overflow-hidden mb-6">

                  {/* Persona header — name + age/profession */}
                  <div
                    className="px-6 py-4"
                    style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}
                  >
                    <p className="text-sm font-medium text-gray-900 leading-snug" style={{ fontFamily: 'SatishSans, sans-serif' }}>{current.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{current.age} · {current.profession}</p>
                  </div>

                  {/* Quadrant Grid — always 2×2 on desktop, stacked on mobile */}
                  <div className="relative grid grid-cols-1 md:grid-cols-2">

                    {/* Center light bulb icon */}
                    <div
                      className="hidden md:flex absolute z-20 pointer-events-none"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '36px',
                        height: '36px',
                        background: 'white',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
                      </svg>
                    </div>

                    {quadrants.map((q, qi) => {
                      const isHov = hoveredQuadrant === `${empathySlide}-${q.key}`;
                      let borderClass = "";
                      if (q.key === 'says') {
                        borderClass = "border-b md:border-r border-gray-200";
                      } else if (q.key === 'thinks') {
                        borderClass = "border-b border-gray-200";
                      } else if (q.key === 'feels') {
                        borderClass = "border-b md:border-b-0 md:border-r border-gray-200";
                      } else if (q.key === 'does') {
                        borderClass = "border-none";
                      }
                      return (
                        <div
                          key={q.key}
                          className={`relative overflow-hidden p-5 md:p-6 cursor-default transition-all duration-200 ${borderClass}`}
                          style={{
                            background: q.bg,
                            minHeight: '140px',
                          }}
                          onMouseEnter={() => setHoveredQuadrant(`${empathySlide}-${q.key}`)}
                          onMouseLeave={() => setHoveredQuadrant(null)}
                        >
                          {/* Hover glow overlay */}
                          <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                              background: q.hoverBg,
                              opacity: isHov ? 1 : 0,
                            }}
                          />
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                              <span style={{ color: isHov ? q.accentColor : '#9CA3AF', transition: 'color 0.2s ease' }}>
                                {q.icon}
                              </span>
                              <p
                                className="text-[10px] uppercase tracking-widest font-semibold transition-colors duration-200"
                                style={{
                                  fontFamily: 'FunnelDisplay, sans-serif',
                                  color: isHov ? q.accentColor : '#6B7280',
                                }}
                              >
                                {q.label}
                              </p>
                            </div>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ fontFamily: 'FunnelDisplay, sans-serif', color: '#374151' }}
                            >
                              {q.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Slider navigation — left/right arrows below map */}
                <div className="flex items-center justify-between">
                  {/* Dot indicators */}
                  <div className="flex items-center gap-2">
                    {empathyPersonas.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setEmpathySlide(i)}
                        aria-label={`Go to persona ${i + 1}`}
                        className="transition-all duration-300"
                        style={{
                          width: i === empathySlide ? '16px' : '6px',
                          height: '6px',
                          borderRadius: '9999px',
                          background: i === empathySlide ? ACCENT : '#D1D5DB',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>

                  {/* Arrow buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEmpathySlide(s => Math.max(0, s - 1))}
                      disabled={empathySlide === 0}
                      className="w-9 h-9 flex items-center justify-center transition-all duration-200 cursor-pointer"
                      style={{
                        borderRadius: '4px',
                        background: empathySlide === 0 ? 'white' : ACCENT,
                        color: empathySlide === 0 ? '#D1D5DB' : 'white',
                        border: `1.5px solid ${empathySlide === 0 ? '#E5E7EB' : ACCENT}`,
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button
                      onClick={() => setEmpathySlide(s => Math.min(TOTAL - 1, s + 1))}
                      disabled={empathySlide === TOTAL - 1}
                      className="w-9 h-9 flex items-center justify-center transition-all duration-200 cursor-pointer"
                      style={{
                        borderRadius: '4px',
                        background: empathySlide === TOTAL - 1 ? 'white' : ACCENT,
                        color: empathySlide === TOTAL - 1 ? '#D1D5DB' : 'white',
                        border: `1.5px solid ${empathySlide === TOTAL - 1 ? '#E5E7EB' : ACCENT}`,
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </div>
                </div>

                {/* Key Insight block */}
                <div
                  className="mt-10 p-6 border border-gray-200"
                  style={{ background: '#F9FAFB' }}
                >
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Key Insight</p>
                  <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                    Across all segments one pattern kept surfacing. The hesitation was never really about price or complexity. It was about familiarity. Users across every segment were asking the same underlying question in different ways: is this actually for someone like me? That single insight became the strategic anchor for how the landing page was structured, what each section needed to say, and which objections had to be addressed before the user ever reached the buy button.
                  </p>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ── Process Section ─────────────────────────────────────────── */}

        <div id="jio-process" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">
            <div className="max-w-3xl mb-12">
              <SectionLabel>Process</SectionLabel>
              <SectionHeading>How we went from a brief to a landing page for a product nobody had seen before.</SectionHeading>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                The process was structured but never rigid. Designing for a completely new product category meant every phase had to inform the next one. We couldn&apos;t assume what users wanted because most of them had never interacted with MR hardware before. So we built from the ground up, letting research shape visual decisions and letting visual decisions pressure-test the research.
              </p>
            </div>

            <div className="pt-10 border-t border-gray-200 mb-12">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Phase Breakdown</p>
              <div className="space-y-10 max-w-3xl">
                {[
                  {
                    title: 'Brief',
                    desc: 'The project started with a clear brief from Jio Tesseract — design a landing page experience for JioGlass that could speak to mass India. Not tech enthusiasts. Everyone. That single constraint shaped every decision that followed.'
                  },
                  {
                    title: 'Research and Moodboard',
                    desc: 'Before touching wireframes, we ran parallel tracks. User research helped us map who we were designing for and what would make them trust an unfamiliar product. The moodboard defined what the product should feel like visually before a single screen existed. Both had to agree before we moved forward.'
                  },
                  {
                    title: 'Benchmarking',
                    desc: 'We audited how global MR and consumer tech brands — Apple Vision Pro, Meta Quest, Samsung — handled landing page experiences for hardware that needed explanation. The goal wasn&apos;t to copy but to understand what creates credibility at first glance in this category.'
                  },
                  {
                    title: 'IA and Wireframes',
                    desc: 'With research and visual direction locked, we mapped a 15-section page architecture where every section earned its place. Wireflows came first to map the user journey, followed by low-fidelity wireframes to test hierarchy and content priority, then final wireframes with components and spacing locked.'
                  },
                  {
                    title: 'Visual Design',
                    desc: 'The visual layer was built on top of the Jio design system with deliberate choices around typography, colour, and imagery to position JioGlass as premium but accessible. Every section was designed to feel like a natural continuation of the one before it.'
                  },
                  {
                    title: 'Handoff',
                    desc: 'Final designs were documented and handed off with component annotations, interaction notes, and Jio design system references to ensure a clean transition to development.'
                  }
                ].map((phase, i) => (
                  <div key={i} className="flex flex-col items-start">
                    <span className="text-[11px] font-mono text-[#0066CC] mb-1.5">0{i + 1}</span>
                    <h4 className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'SatishSans, sans-serif' }}>{phase.title}</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{phase.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Horizontal process chart at the bottom of the section */}
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {[
                { step: '01', name: 'Brief' },
                { step: '02', name: 'Research' },
                { step: '03', name: 'Benchmarking' },
                { step: '04', name: 'IA & Wireframes' },
                { step: '05', name: 'Visual Design' },
                { step: '06', name: 'Handoff' }
              ].map((p, idx) => {
                const isStepHovered = hoveredProcessStep === p.name;
                return (
                  <div
                    key={idx}
                    className="relative p-5 md:py-6 flex flex-col items-center justify-center text-center cursor-default transition-colors duration-200"
                    onMouseEnter={() => setHoveredProcessStep(p.name)}
                    onMouseLeave={() => setHoveredProcessStep(null)}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'radial-gradient(ellipse 160% 120% at 50% 120%, rgba(0,102,204,0.15) 0%, transparent 70%)',
                          opacity: isStepHovered ? 1 : 0,
                          transition: 'opacity 0.25s ease',
                        }}
                      />
                    </div>

                    <span className="relative z-10 text-[9px] font-mono text-gray-400 mb-1 transition-colors duration-200" style={isStepHovered ? { color: '#0066CC' } : {}}>PHASE {p.step}</span>
                    <span className="relative z-10 text-[11px] uppercase tracking-wider text-gray-700 font-medium transition-colors duration-200" style={isStepHovered ? { color: '#0066CC', fontFamily: 'FunnelDisplay, sans-serif' } : { fontFamily: 'FunnelDisplay, sans-serif' }}>{p.name}</span>

                    {idx < 5 && (
                      <>
                        {/* Desktop Arrow: sits on the right border */}
                        <div
                          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 items-center justify-center w-5 h-5 rounded-full border border-gray-200 bg-white text-gray-400 font-mono text-[9px] select-none pointer-events-none"
                        >
                          →
                        </div>
                        {/* Mobile Arrow: sits on the bottom border */}
                        <div
                          className="flex md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 items-center justify-center w-4 h-4 rounded-full border border-gray-200 bg-white text-gray-400 font-mono text-[8px] select-none pointer-events-none"
                        >
                          ↓
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Wireflow Section ────────────────────────────────────────── */}
        <div id="jio-wireflow" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">

            {/* Heading */}
            <SectionLabel>Wireflow</SectionLabel>
            <SectionHeading>Mapping every path before designing any screen.</SectionHeading>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-10" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
              With research locked and personas mapped, the next step was understanding how a user actually moves through the JioGlass experience. Before designing any individual screen, we needed to map every possible path from the landing page to purchase and beyond. The wireflow made sure no journey was left unaccounted for and every section of the page had a clear purpose in the overall flow.
            </p>

            {/* Sub-sections */}
            <div className="space-y-10 border-t border-gray-200 pt-10">

              {/* Landing Page as Hub */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>The Landing Page as the Hub</p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Everything starts at the JioGlass Landing Page. From here users can explore immersive features, real-life scenarios, interactive demos, specs, support, and purchase options. Five primary paths branch out from this single entry point — News, Search, Product Description, FAQs, and Experience in Store. Each path serves a different type of user with a different level of intent.
                </p>

                {/* Five paths grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-gray-200 border border-gray-200 mt-6">
                  {[
                    {
                      title: 'News',
                      desc: 'Product innovations, new features, and partnerships. For users who want to stay informed before committing.',
                    },
                    {
                      title: 'Search',
                      desc: 'A universal search bar to explore all JioGlass content — blogs, news, FAQs, and technical details.',
                    },
                    {
                      title: 'Product Description',
                      desc: 'Features, use cases, specs, and benefits. The core conversion page for users ready to evaluate seriously.',
                    },
                    {
                      title: 'FAQs',
                      desc: 'Compatibility, repairs, Jio integration, and usage tips. For users with specific concerns before purchasing.',
                    },
                    {
                      title: 'Experience in Store',
                      desc: 'In-store demo locations where users can try JioGlass firsthand. For users who need to hold the product before they buy.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-white px-5 py-6">
                      <span className="text-[9px] font-mono text-[#0066CC] block mb-2 tracking-widest">0{i + 1}</span>
                      <p className="text-sm font-medium text-gray-800 mb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{item.title}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Path */}
              <div className="border-t border-gray-200 pt-10">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>The Purchase Path</p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  From the Product Description Page the user moves into the buying flow. Two paths open up — Cart for users ready to purchase, and Accounts/Profile Page for users managing their relationship with the product over time.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  The Cart leads to a seamless Checkout — reviewing items, selecting payment options, applying discounts, confirming shipping details, and completing the purchase. The Accounts/Profile Page branches into five destinations covering everything a user needs before and after purchase.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-gray-200 border border-gray-200">
                  {[
                    { title: 'Order History', desc: 'A log of all past purchases with details on items, dates, and statuses.' },
                    { title: 'Wishlist', desc: 'Save desired products or accessories for future purchase.' },
                    { title: 'Saved Addresses', desc: 'Manage delivery addresses for seamless order placement.' },
                    { title: 'Track Order', desc: 'Real-time tracking with estimated delivery timelines and updates.' },
                    { title: 'Support', desc: 'A helpdesk for all queries including FAQs, live chat, and troubleshooting guides.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white px-5 py-6">
                      <span className="text-[9px] font-mono text-[#0066CC] block mb-2 tracking-widest">0{i + 1}</span>
                      <p className="text-sm font-medium text-gray-800 mb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{item.title}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post-Purchase */}
              <div className="border-t border-gray-200 pt-10">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Post-Purchase Layer</p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  From Support, three final pages complete the ecosystem — Terms and Conditions, Privacy Policy, and Shipping and Return. These pages exist to build trust and handle the practical concerns that surface after a user has committed to a purchase.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
                  {[
                    { title: 'Terms and Conditions', desc: 'Legal framework governing product use, warranties, and liabilities.' },
                    { title: 'Privacy Policy', desc: 'How user data is collected, stored, and protected across the JioGlass ecosystem.' },
                    { title: 'Shipping and Return', desc: 'Delivery timelines, return windows, and refund procedures to reduce post-purchase friction.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white px-5 py-6">
                      <span className="text-[9px] font-mono text-[#0066CC] block mb-2 tracking-widest">0{i + 1}</span>
                      <p className="text-sm font-medium text-gray-800 mb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{item.title}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Insight */}
              <div className="border-t border-gray-200 pt-10">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>What the Wireflow Revealed</p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Mapping the full flow made one thing immediately clear — the landing page was not just a marketing surface. It was the single most important screen in the entire ecosystem. Every other page depends on it doing its job. If a user leaves the landing page without being convinced, none of the downstream pages ever get seen. That insight reinforced every structural decision we made in the sections that followed.
                </p>
              </div>

            </div>
          </div>

          {/* Full-bleed Wireflow diagram */}
          <div className="border-t border-gray-200 relative">
            {/* Mobile scroll hint */}
            <div className="flex items-center gap-1.5 px-6 py-2 md:hidden border-b border-gray-100">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="text-[9px] uppercase tracking-widest text-gray-400" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Scroll to explore</span>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[960px] md:min-w-0">
                <Image
                  src="/images/WorkImages/jio/Wireflow.svg"
                  alt="JioGlass Wireflow diagram"
                  width={2400}
                  height={1200}
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          <Plus h="left" />
          <Plus h="right" />
        </div>

        {/* ── Moodboard Section ───────────────────────────────────────── */}
        <div id="jio-moodboard" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">
            <div className="max-w-3xl mb-12">
              <SectionLabel>Moodboard</SectionLabel>
              <SectionHeading>Before the screens, we defined the feel.</SectionHeading>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Before any wireframe was touched, we needed to agree on what JioGlass should look like in the world. The product had to feel like it belonged next to the best consumer tech hardware globally, while still being built for India. That tension had to live in every render, every shadow, every material choice.
                <br /><br />
                We built three visual directions to pressure-test the language before anything else moved forward.
              </p>
            </div>

            <div className="pt-10 border-t border-gray-200 mb-12">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Visual Directions</p>
              <div className="space-y-10 max-w-3xl">
                {[
                  {
                    title: 'Photo Realistic Renders',
                    desc: 'The first direction established how JioGlass sits in physical space. Tabletop renders, shadow-enhanced stills, detailed close-ups. The reference point was Apple\'s product photography language — controlled light, minimal surface noise, hardware that looks engineered down to the millimetre. The goal was simple: make it look like something you would trust before reading a single spec.'
                  },
                  {
                    title: 'Product Material Highlight',
                    desc: 'Material-in-focus renders under dramatic lighting pushed contrast and surface detail to the foreground. This direction was about communicating build quality at a glance. The kind of visual that makes someone feel the weight and finish of the product before they have ever held it.'
                  },
                  {
                    title: 'Transparent Overlay & Exploded View Renders',
                    desc: 'Internal components in detail. Transparent overlays showing what is inside. This direction served the more technically minded segment. Showing the engineering signals confidence in the build, not just the marketing. When you can see what is inside, you trust what is outside.'
                  }
                ].map((dir, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="text-sm font-mono text-[#0066CC] shrink-0 mt-0.5" style={{ minWidth: '2rem' }}>0{i + 1}.</span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'SatishSans, sans-serif' }}>{dir.title}</h4>
                      <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{dir.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Slider Component */}
          <div className="relative border-t border-gray-200">
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollMoodboard(-1)}
              disabled={moodboardSlide === 0}
              className="absolute top-1/2 -translate-y-1/2 left-2 md:left-0 md:-translate-x-1/2 w-9 h-9 flex items-center justify-center z-10 transition-all duration-200 rounded-[4px]"
              style={{
                background: moodboardSlide === 0 ? 'white' : ACCENT,
                color: moodboardSlide === 0 ? '#d1d5db' : 'white',
                border: `1.5px solid ${moodboardSlide === 0 ? '#d1d5db' : ACCENT}`,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollMoodboard(1)}
              disabled={moodboardSlide === 6}
              className="absolute top-1/2 -translate-y-1/2 right-2 md:right-0 md:translate-x-1/2 w-9 h-9 flex items-center justify-center z-10 transition-all duration-200 rounded-[4px]"
              style={{
                background: moodboardSlide === 6 ? 'white' : ACCENT,
                color: moodboardSlide === 6 ? '#d1d5db' : 'white',
                border: `1.5px solid ${moodboardSlide === 6 ? '#d1d5db' : ACCENT}`,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            {/* Slides container */}
            <div
              ref={moodboardScrollRef}
              onScroll={handleMoodboardScroll}
              className="overflow-x-auto snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                #jio-moodboard-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}} />
              <div id="jio-moodboard-scroll" className="flex">
                {[
                  "/images/WorkImages/jio/jio-moodboard.png",
                  "/images/WorkImages/jio/jio-moodboard-1.png",
                  "/images/WorkImages/jio/jio-moodboard-2.png",
                  "/images/WorkImages/jio/jio-moodboard-3.png",
                  "/images/WorkImages/jio/jio-moodboard-4.png",
                  "/images/WorkImages/jio/jio-moodboard-5.png",
                  "/images/WorkImages/jio/jio-moodboard-6.png"
                ].map((src, i) => (
                  <div key={i} className="w-full flex-shrink-0 snap-start h-[260px] sm:h-[360px] md:h-[480px] lg:h-[600px] relative">
                    <Image
                      src={src}
                      alt={`Jio Tesseract Moodboard direction slide ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 py-4 border-t border-gray-200 bg-gray-50/20">
              {Array.from({ length: 7 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const el = moodboardScrollRef.current; if (!el) return;
                    el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' });
                  }}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: moodboardSlide === i ? ACCENT : '#d1d5db',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Design System Section ───────────────────────────────────── */}
        <div id="jio-design-system" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">
            <div className="max-w-3xl">
              <SectionLabel>Design System</SectionLabel>
              <SectionHeading>Consistency at scale, built for Jio.</SectionHeading>
            </div>
          </div>

          {/* Typography */}
          <div className="relative overflow-visible px-6 md:px-10 py-10 border-t border-gray-200">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-6" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Typography</p>
            <div className="max-w-2xl mb-10">
              <h4 className="text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>JioType</h4>
              <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                The project was built entirely on JioType, Jio Tesseract&apos;s brand typeface. Every size, weight, and spacing decision was made to ensure the landing page felt cohesive with the wider Jio ecosystem while maintaining its own premium character. JioType brings a sense of familiarity to users already within the Jio world, while feeling refined enough to carry a hardware product at this level.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
              {/* Specimen */}
              <div className="shrink-0">
                <p className="text-6xl md:text-8xl font-bold leading-none text-black" style={{ fontFamily: 'JioType, sans-serif', fontWeight: 700 }}>JioType</p>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed" style={{ fontFamily: 'JioType, sans-serif' }}>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
                <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily: 'JioType, sans-serif' }}>a b c d e f g h i j k l m n o p q r s t u v w x y z</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'JioType, sans-serif' }}>0 1 2 3 4 5 6 7 8 9</p>
              </div>

              {/* Type scale */}
              <div className="flex-1 flex flex-col gap-3 w-full">
                {[
                  { label: 'Onboard Large', size: '28px', weight: 'Bold', sample: 'Jio Tesseract' },
                  { label: 'Onboard Medium', size: '16px', weight: 'Bold', sample: 'Jio Tesseract' },
                  { label: 'Onboard Small', size: '13px', weight: 'Regular', sample: 'Jio Tesseract' },
                  { label: 'Body Large', size: '16px', weight: 'Regular', sample: 'Reliance Tesseract' },
                  { label: 'Body Medium', size: '14px', weight: 'Regular', sample: 'Reliance Tesseract' },
                  { label: 'Body Small', size: '12px', weight: 'Regular', sample: 'Reliance Tesseract' },
                ].map((t) => (
                  <div key={t.label} className="flex items-baseline gap-4 border-b border-gray-100 pb-2">
                    <p className="text-[10px] text-gray-400 w-28 md:w-32 shrink-0" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{t.label}</p>
                    <p
                      className="text-gray-800 leading-snug flex-1"
                      style={{ fontFamily: 'JioType, sans-serif', fontSize: t.size, fontWeight: t.weight === 'Bold' ? 700 : 400 }}
                    >{t.sample}</p>
                    <p className="text-[10px] text-gray-300 shrink-0" style={{ fontFamily: 'monospace' }}>{t.size} · {t.weight}</p>
                  </div>
                ))}
              </div>
            </div>
            <Plus h="left" />
            <Plus h="right" />
          </div>

          {/* Icons Intro */}
          <div className="relative overflow-visible border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ alignItems: 'stretch' }}>
              <div className="px-6 md:px-10 py-10 md:py-14 flex flex-col justify-center md:border-r border-gray-200">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Icons</p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  Icons are graphic symbols used to represent concepts and features, serving as a powerful tool for visual communication across the JioGlass landing page. They provide additional functional value and help users quickly recognise actions, understand information, and navigate features without needing to read.
                </p>
              </div>
              <div
                className="w-full min-h-[240px]"
                style={{
                  backgroundImage: 'url(/images/WorkImages/jio/icons.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  alignSelf: 'stretch',
                }}
              />
            </div>
            <Plus h="left" />
            <Plus h="right" />
          </div>

          {/* Icon Grid */}
          <div className="relative overflow-visible border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="px-6 md:px-10 py-10 md:py-14 flex flex-col justify-center order-1 md:order-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Icon Grid</p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                  To ensure visual uniformity, all icons are produced on a consistent 24x24px grid. Line strokes are 2px in thickness, with concentric guides to facilitate the placement of key shapes. This guarantees that every icon aligns with Jio brand standards and retains a cohesive appearance across all sections of the page.
                </p>
              </div>
              <div className="flex items-center justify-center p-2 md:p-4 md:border-r border-gray-200 bg-gray-50/10 order-2 md:order-1">
                <div className="w-full">
                  <Image
                    src="/images/WorkImages/jio/icon-grid.png"
                    alt="JioGlass Icon Grid layout"
                    width={800}
                    height={600}
                    className="w-full h-auto block object-contain"
                  />
                </div>
              </div>
            </div>
            <Plus h="left" />
            <Plus h="right" />
          </div>

          {/* Characteristics */}
          <div className="relative overflow-visible border-t border-gray-200 px-6 md:px-10 py-10 md:py-12">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Characteristics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Simple',
                  desc: 'Icons are kept as simple as possible to effectively convey their intended meaning without visual noise.',
                  img: '/images/WorkImages/jio/simple.png'
                },
                {
                  title: 'Round',
                  desc: 'Icons are rounded to complement the JioType design language, drawn on a consistent grid with a toolkit of rounded forms.',
                  img: '/images/WorkImages/jio/Round.png'
                },
                {
                  title: 'Understandable',
                  desc: 'Icons communicate their intended meaning through simple metaphors that are universally recognised across user segments.',
                  img: '/images/WorkImages/jio/Understandable.png'
                }
              ].map((char, i) => (
                <div key={i} className="flex flex-col">
                  {/* Icon Image block */}
                  <div className="aspect-[4/3] md:aspect-square w-full border border-gray-200 bg-gray-50/10 flex items-center justify-center mb-4 overflow-hidden order-2 md:order-1">
                    <Image
                      src={char.img}
                      alt={char.title}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-115"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 md:mb-1 order-1 md:order-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{char.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed order-3 md:order-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{char.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration System */}
          <div className="relative overflow-visible border-t border-gray-200 px-6 md:px-10 py-10 md:py-14">
            <div className="max-w-3xl mb-8">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Illustration System</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Illustrations are an integral part of the JioGlass design system, providing visual aids that enhance understanding and bring the product experience to life. Every illustration was crafted to embody the Jio Tesseract brand character — ensuring consistency in style, tone, and quality across every section of the landing page.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Illustrations played a key role in making an unfamiliar product category feel approachable. For a product most users had never seen before, the right illustration could do what copy alone couldn&apos;t — show someone their version of JioGlass before they ever held it.
              </p>
            </div>

            <div className="w-full border border-gray-200 bg-gray-50/10 flex items-center justify-center overflow-hidden p-0 mb-14 h-[260px] sm:h-[360px] md:h-[480px] lg:h-[600px] relative">
              <Image
                src="/images/WorkImages/jio/Illustration.png"
                alt="JioGlass Illustration System overview"
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
              />
            </div>

            {/* Role of Illustrations */}
            <div className="max-w-3xl mb-8">
              <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>Role of Illustrations</h4>
              <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Illustrations play a vital role in building the JioGlass visual identity and communicating its values to the target audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
              {[
                {
                  title: 'Communication',
                  desc: 'Illustrations can communicate an idea or emotion more effectively than a copy line or a photograph. On a landing page for a product most users had never seen, this made them an essential tool — not decoration.',
                  img: '/images/WorkImages/jio/Communication.png'
                },
                {
                  title: 'Character',
                  desc: 'Illustrations express the Jio Tesseract brand personality and bring warmth to every interaction. They give the page a human quality that hardware specs alone never could.',
                  img: '/images/WorkImages/jio/Character.png'
                },
                {
                  title: 'Consistency',
                  desc: 'Illustrations bring consistency to how users experience the brand across every section of the page. That consistency builds trust — and trust is what turns a first-time visitor into a buyer.',
                  img: '/images/WorkImages/jio/Consistency.png'
                }
              ].map((role, i) => (
                <div key={i} className="flex flex-col">
                  {/* Role Image block */}
                  <div className="aspect-[4/3] md:aspect-square w-full border border-gray-200 bg-gray-50/10 flex items-center justify-center mb-4 overflow-hidden order-2 md:order-1">
                    <Image
                      src={role.img}
                      alt={role.title}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-115"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 md:mb-1 order-1 md:order-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{role.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed order-3 md:order-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{role.desc}</p>
                </div>
              ))}
            </div>

            {/* The Jio Story */}
            <div className="max-w-3xl mb-8">
              <h4 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'SatishSans, sans-serif' }}>The Jio Story</h4>
              <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Every illustration on the JioGlass landing page tells a story. The goal was to bring delight while conveying trust and brand recognition — not just decorating the page but actively moving the user toward a decision. Before any illustration was created, three questions were answered: who is the customer, what is the message, and what emotion should they feel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Charming',
                  desc: 'Illustrations aim to evoke warmth and genuine smiles through simple, relatable moments. The tone is light and human without being slapstick or gimmicky. Every concept was tested against one question: does this feel real to someone using JioGlass in their daily life?',
                  img: '/images/WorkImages/jio/Charming.svg'
                },
                {
                  title: 'Indian',
                  desc: 'Every illustration was grounded in the Indian context. Metaphors, settings, and characters were chosen to resonate with the actual audience — not borrowed from Western references that would feel distant or unfamiliar. The visual language had to feel like it was made for India, because it was.',
                  img: '/images/WorkImages/jio/Indian.svg'
                },
                {
                  title: 'Future Forward',
                  desc: 'Illustrations avoided references that felt dated or nostalgic. The visual direction leaned aspirational — showing users a version of their life that feels one step ahead, the kind of imagery that makes someone feel like JioGlass belongs in their future.',
                  img: '/images/WorkImages/jio/Future-foward.svg'
                }
              ].map((pill, i) => (
                <div key={i} className="flex flex-col">
                  {/* Illustration Image box */}
                  <div className="aspect-[4/3] md:aspect-square w-full border border-gray-200 bg-gray-50/10 flex items-center justify-center mb-4 overflow-hidden order-2 md:order-1">
                    <img
                      src={pill.img}
                      alt={pill.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-115"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 md:mb-1 order-1 md:order-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{pill.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed order-3 md:order-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>{pill.desc}</p>
                </div>
              ))}
            </div>

            <Plus h="left" />
            <Plus h="right" />
          </div>

          {/* Components */}
          <div className="relative overflow-visible border-t border-gray-200 px-6 md:px-10 py-10 md:py-14">
            <div className="max-w-3xl mb-12">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Components</p>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Every interactive pattern on the JioGlass landing page was drawn from a shared component library — ensuring visual consistency across states, breakpoints, and user segments.
              </p>
            </div>

            <div className="space-y-16">
              {[
                {
                  name: 'Avatar',
                  desc: 'Used to display user profile pictures or initials in navigation and settings. Helps personalize the JioGlass experience and manage user accounts with clear visual indicators.',
                  file: 'Avatar.png',
                  width: 6666,
                  height: 14409
                },
                {
                  name: 'Bottom Sheet',
                  desc: 'An overlay panel sliding from the bottom, offering context-specific actions or settings. Perfect for mobile navigation, minimizing screen clutter while keeping interactions within easy thumb reach.',
                  file: 'Bottom-Sheet.png',
                  width: 4167,
                  height: 4320
                },
                {
                  name: 'Checkbox',
                  desc: 'A fundamental control for multi-select choices, such as preferences or configurations. Designed with interactive state feedbacks and distinct checkmarks to guarantee clarity.',
                  file: 'Checkbox.png',
                  width: 5895,
                  height: 3324
                },
                {
                  name: 'FAB (Floating Action Button)',
                  desc: 'Represents the primary positive action on a screen, like adding a new device or launching a demo. Floats above content to stay accessible while scrolling.',
                  file: 'FAB.png',
                  width: 4986,
                  height: 2229
                },
                {
                  name: 'Heading',
                  desc: 'Establishes standard text hierarchies across sections. Ensures consistent typography size, line heights, and margins to build a clean layout throughout the interface.',
                  file: 'Heading.png',
                  width: 6666,
                  height: 6660
                },
                {
                  name: 'Selector',
                  desc: 'An interactive choice card or segment switch for toggling settings or models. Built with explicit active state borders and icons to make user selections intuitive.',
                  file: 'Selector.png',
                  width: 9765,
                  height: 4731
                },
                {
                  name: 'Slider',
                  desc: 'A fluid slider component for fine-tuning numeric values like volume, brightness, or scale. Offers instant visual feedback with custom handle controls.',
                  file: 'Slider.svg',
                  width: 2713,
                  height: 2384
                },
                {
                  name: 'Stepper',
                  desc: 'Used to increment or decrement quantities, like product items in the shopping cart. Designed with responsive buttons to prevent accidental double-clicks.',
                  file: 'Stepper.png',
                  width: 3366,
                  height: 2832
                },
                {
                  name: 'Toast',
                  desc: 'Temporary, non-disruptive feedback messages that slide in to notify users of status changes like item added, settings saved, or connectivity updates.',
                  file: 'Toast.png',
                  width: 6666,
                  height: 7338
                },
                {
                  name: 'Bottom Nav',
                  desc: 'The primary tab bar for switching main views on mobile. Adheres to accessibility standards, providing clear icons and labels for smooth navigation across JioGlass features.',
                  file: 'BottomNav.svg',
                  width: 1802,
                  height: 914
                }
              ].map((c, i) => (
                <div key={i} className="border-t border-gray-200/60 pt-12 first:border-t-0 first:pt-0">
                  <div className="max-w-3xl mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Component {i + 1}</p>
                    <h4 className="text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'SatishSans, sans-serif' }}>{c.name}</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                      {c.desc}
                    </p>
                  </div>

                  <div className="w-full relative cursor-zoom-in group mt-6 flex justify-center bg-white"
                    onClick={() => setZoomedImage({ src: `/images/WorkImages/jio/components/${c.file}`, alt: c.name })}
                  >
                    <Image
                      src={`/images/WorkImages/jio/components/${c.file}`}
                      alt={c.name}
                      width={c.width}
                      height={c.height}
                      className="max-h-[600px] w-auto block object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    {/* Tooltip Overlay */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-gray-200 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1 shadow-sm">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      <span className="text-[8px] uppercase tracking-widest text-gray-500 font-semibold" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Click to zoom</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Plus h="left" />
            <Plus h="right" />
          </div>
        </div>

        {/* ── The Design Section ───────────────────────────────────────── */}
        <div id="jio-the-design" className="relative border-b border-gray-200">
          <Plus h="left" v="top" />
          <Plus h="right" v="top" />
          <div className="px-6 md:px-10 py-8 md:py-12">
            <div className="max-w-3xl">
              <SectionLabel>The Design</SectionLabel>
              <SectionHeading>A landing page built to make an unfamiliar product feel inevitable.</SectionHeading>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>
                Every screen was designed with one question in mind — does this move the user one step closer to believing JioGlass was made for them? Here is how it came together, screen by screen.
              </p>
            </div>
          </div>

          <div className="w-full border-t border-gray-200 overflow-hidden relative">
            <video className="w-full h-auto block" autoPlay loop muted playsInline>
              <source src="/images/WorkImages/jio/demo.mp4" type="video/mp4" />
            </video>
          </div>

          <Plus h="left" />
          <Plus h="right" />
        </div>

        {/* Zoom Lightbox Modal */}
        {mounted && zoomedImage && createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setZoomedImage(null)}
          >
            <div className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors duration-200 p-2 cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>

            <div
              className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedImage.src}
                alt={zoomedImage.alt}
                className="max-w-full max-h-[85vh] object-contain select-none shadow-2xl rounded-lg"
              />
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <p className="text-white text-xs tracking-wider font-semibold uppercase mb-1" style={{ fontFamily: 'SatishSans, sans-serif' }}>{zoomedImage.alt}</p>
              <p className="text-white/40 text-[9px] uppercase tracking-widest" style={{ fontFamily: 'FunnelDisplay, sans-serif' }}>Click anywhere to close</p>
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
}
