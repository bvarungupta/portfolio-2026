"use client"

import { useRef, useEffect, useState, useCallback, useMemo, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, useTexture } from '@react-three/drei'
import { DoubleSide, Mesh, MeshPhysicalMaterial, Object3D, Texture } from 'three'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { VisualExplorationsSound } from './visualExplorationsSound'

gsap.registerPlugin(ScrollTrigger)

// Assets definition (12 images total)
const imageUrls = [
  '/images/visual-explorations/card.webp',
  '/images/visual-explorations/card-business.webp',
  '/images/visual-explorations/Heydu.webp',
  '/images/visual-explorations/MacBook_13.webp',
  '/images/visual-explorations/streer-poster.webp',
  '/images/visual-explorations/about-2.webp',
  '/images/visual-explorations/Ai-healthcare-hero.webp',
  '/images/visual-explorations/App-health.webp',
  '/images/visual-explorations/Health-app.webp',
  '/images/visual-explorations/MIT-Hero.webp',
  '/images/visual-explorations/mobile -app.webp',
  '/images/visual-explorations/saas-hero.webp',
]

const projectNames = [
  "Visual Branding",
  "Tactile Corporate Identity",
  "Heydu Branding Concept",
  "MacBook Pro UI Mockup",
  "Street Culture Poster",
  "Character Illustration",
  "AI Healthcare Dashboard",
  "Health Tracker UI",
  "Clinical Analytics App",
  "MIT Concept Presentation",
  "Fintech Mobile Shell",
  "SaaS Landing Page",
]

// 3D Glass Helmet Model
function HelmetModel({ tubeAngleRef }: { tubeAngleRef: React.MutableRefObject<number> }) {
  const helmet = useGLTF("/models/rubens.glb")
  const scene = useMemo(() => helmet.scene.clone(true), [helmet.scene])
  const modelRef = useRef<Object3D>(null)
  
  const baseRotation = useMemo(() => ({ x: Math.PI / 8, y: Math.PI / 2 }), [])
  
  const glassMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#613309",
        metalness: 0.9,
        roughness: 0.3,
        envMapIntensity: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
      }),
    []
  )

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const scale = isMobile ? 0.042 : 0.05

    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.scale.set(scale, scale, scale)
        object.material = glassMaterial
        object.material.needsUpdate = true
      }
    })

    return () => {
      glassMaterial.dispose()
    }
  }, [scene, glassMaterial])

  useFrame(() => {
    const obj = modelRef.current
    if (!obj) return
    obj.rotation.x = baseRotation.x
    obj.rotation.y = baseRotation.y - tubeAngleRef.current
  })

  return (
    <group ref={modelRef} rotation={[baseRotation.x, baseRotation.y, 0]}>
      <primitive object={scene} position={[0.2, 0, -0.1]} />
    </group>
  )
}

// 3D Cylinder of floating images (stretching visual exploration images)
function ImageTube({
  scrollTargetRef,
  spinVelocityRef,
  naturalDirRef,
  tubeAngleRef,
  onImageHover,
  onImageClick,
}: {
  scrollTargetRef: React.MutableRefObject<number>;
  spinVelocityRef: React.MutableRefObject<number>;
  naturalDirRef: React.MutableRefObject<number>;
  tubeAngleRef: React.MutableRefObject<number>;
  onImageHover: (projectName: string | null, texture: Texture | null, imageUrl: string | null) => void;
  onImageClick: (projectName: string, imageUrl: string, textureIndex: number) => void;
}) {
  const groupRef = useRef<Object3D>(null)
  const rowGroupRefs = useRef<Array<Object3D | null>>([])
  const scrollCurrent = useRef(0)
  const angle = useRef(0)
  const isHovering = useRef(false)
  const speedMultiplier = useRef(1)

  const textures = useTexture(imageUrls)

  const handleHover = useCallback((projectName: string | null, textureIndex: number | null) => {
    isHovering.current = projectName !== null
    const texture = textureIndex !== null ? textures[textureIndex] : null
    const imageUrl = textureIndex !== null ? imageUrls[textureIndex] : null
    onImageHover(projectName, texture, imageUrl)
  }, [onImageHover, textures])

  const cols = 6
  const rows = 5
  const radius = 4
  const tileH = 1
  const ySpacing = 2.7
  const loopHeight = rows * ySpacing
  const repeatCount = 3
  const totalRows = rows * repeatCount

  const rowSpeed = useMemo(() => {
    const speeds: number[] = []
    for (let r = 0; r < rows; r++) {
      const t = rows <= 1 ? 0 : r / (rows - 1)
      speeds.push(0.65 + t * 0.9)
    }
    return speeds
  }, [rows])

  const rowPositions = useMemo(() => {
    const out: Array<{ rowIndex: number; y: number; baseRow: number; rowOffset: number }> = []
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const y = (rowIndex - (totalRows - 1) / 2) * ySpacing
      const baseRow = rowIndex % rows
      const rowOffset = baseRow % 2 === 0 ? 0 : 0.5
      out.push({ rowIndex, y, baseRow, rowOffset })
    }
    return out;
  }, [rows, totalRows, ySpacing])

  useFrame((_state, dt) => {
    scrollCurrent.current += (scrollTargetRef.current - scrollCurrent.current) * 0.12

    if (scrollCurrent.current > loopHeight / 2) {
      scrollCurrent.current -= loopHeight
      scrollTargetRef.current -= loopHeight
    } else if (scrollCurrent.current < -loopHeight / 2) {
      scrollCurrent.current += loopHeight
      scrollTargetRef.current += loopHeight
    }

    const targetMultiplier = isHovering.current ? 0.05 : 1
    speedMultiplier.current += (targetMultiplier - speedMultiplier.current) * 0.1

    const damping = 0.92
    spinVelocityRef.current *= Math.pow(damping, dt * 60)
    spinVelocityRef.current = Math.max(-2.0, Math.min(2.0, spinVelocityRef.current))

    const baseSpeed = naturalDirRef.current * 0.25 * speedMultiplier.current
    angle.current += (baseSpeed + spinVelocityRef.current * speedMultiplier.current) * dt
    tubeAngleRef.current = angle.current

    const group = groupRef.current
    if (!group) return

    group.position.y = -scrollCurrent.current

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const rowObj = rowGroupRefs.current[rowIndex]
      if (!rowObj) continue
      const baseRow = rowIndex % rows
      rowObj.rotation.y = angle.current * rowSpeed[baseRow]
    }
  })

  return (
    <group ref={groupRef}>
      {rowPositions.map(({ rowIndex, y, baseRow, rowOffset }) => (
        <group
          key={rowIndex}
          position={[0, y, 0]}
          ref={(obj) => {
            rowGroupRefs.current[rowIndex] = obj
          }}
        >
          {Array.from({ length: cols }).map((_, col) => {
            const theta = ((col + rowOffset) / cols) * Math.PI * 2
            const x = Math.cos(theta) * radius
            const z = Math.sin(theta) * radius
            const ry = -theta + Math.PI / 2
            const texIndex = (baseRow * 7 + col) % imageUrls.length
            const texture = textures[texIndex]
            const aspect = texture?.image ? ((texture.image as any).width / (texture.image as any).height) : 1.5
            const width = tileH * aspect

            return (
              <mesh
                key={col}
                position={[x, 0, z]}
                rotation={[0, ry, 0]}
                onPointerOver={() => handleHover(projectNames[texIndex], texIndex)}
                onPointerOut={() => handleHover(null, null)}
                onPointerDown={() => onImageClick(projectNames[texIndex], imageUrls[texIndex], texIndex)}
              >
                <planeGeometry args={[width, tileH]} />
                <meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide} />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function LocalLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
        <span className="text-black/50 text-xs font-mono tracking-widest">LOADING 3D ENGINE</span>
      </div>
    </div>
  )
}

export default function VisualExplorationsGalleryV1() {
  const headerRef = useRef<HTMLDivElement>(null)
  const visualEl = useRef<HTMLHeadingElement>(null)
  const explorationsEl = useRef<HTMLHeadingElement>(null)
  const lineEl = useRef<HTMLDivElement>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const tubeScrollTarget = useRef(0)
  const tubeSpinVelocity = useRef(0)
  const tubeNaturalDir = useRef(1)
  const tubeAngle = useRef(0)
  
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [hoveredImageUrl, setHoveredImageUrl] = useState<string | null>(null)
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [selectedProject, setSelectedProject] = useState<{
    name: string;
    imageUrl: string;
    index: number;
  } | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const hoveredItemRef = useRef<{
    name: string;
    imageUrl: string;
    index: number;
  } | null>(null)
  const openOverlayRafRef = useRef<number | null>(null)
  const closeOverlayTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  // Header Scroll Animation
  useEffect(() => {
    const header = headerRef.current
    const visual = visualEl.current
    const explorations = explorationsEl.current
    const line = lineEl.current
    if (!header || !visual || !explorations || !line) return

    let tl: gsap.core.Timeline

    const setupHeader = () => {
      const cRect = header.getBoundingClientRect()
      const vRect = visual.getBoundingClientRect()
      const eRect = explorations.getBoundingClientRect()

      const paddingX = parseFloat(window.getComputedStyle(header).paddingLeft)
      const contentLeft = cRect.left + paddingX
      const contentRight = cRect.right - paddingX

      const visualFinalX = contentLeft - vRect.left
      const explorationsFinalX = (contentRight - eRect.width) - eRect.left

      gsap.set(line, { scaleX: 0, transformOrigin: 'center center', opacity: 0 })

      tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(visual, { x: visualFinalX }, 0)
        .to(line, { scaleX: 1, opacity: 1, ease: 'power2.inOut' }, 0)
        .to(explorations, { x: explorationsFinalX }, 0)
    }

    document.fonts.ready.then(() => requestAnimationFrame(setupHeader))

    return () => {
      tl?.kill()
    }
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setCursorPos({ x, y })
  }, [])

  const onWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    // Intercept scroll delta to spin/scroll the tube
    // Increased scroll multipliers to allow cycling all 12 images rapidly
    tubeScrollTarget.current += event.deltaY * 0.014
    tubeSpinVelocity.current += event.deltaY * 0.024

    if (event.deltaY < 0) tubeNaturalDir.current = -1
    else if (event.deltaY > 0) tubeNaturalDir.current = 1
  }, [])

  const handleImageHover = useCallback(
    (projectName: string | null, _texture: Texture | null, imageUrl: string | null) => {
      if (projectName && imageUrl) {
        hoveredItemRef.current = {
          name: projectName,
          imageUrl,
          index: imageUrls.indexOf(imageUrl),
        }
      } else {
        hoveredItemRef.current = null
      }

      setHoveredProject(projectName)
      if (imageUrl !== hoveredImageUrl) {
        setPreviousImageUrl(hoveredImageUrl)
        setHoveredImageUrl(imageUrl)
      }
    },
    [hoveredImageUrl]
  )

  const handleImageClick = useCallback(
    (projectName: string, imageUrl: string, textureIndex: number) => {
      if (openOverlayRafRef.current != null) cancelAnimationFrame(openOverlayRafRef.current)
      if (closeOverlayTimeoutRef.current != null) clearTimeout(closeOverlayTimeoutRef.current)
      setSelectedProject({ name: projectName, imageUrl, index: textureIndex })
      // rAF ensures the element mounts at opacity:0 first, then .visible triggers the CSS transition
      openOverlayRafRef.current = requestAnimationFrame(() => {
        setShowOverlay(true)
        openOverlayRafRef.current = null
      })
    },
    []
  )

  const handleContainerPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return

      const hoveredItem = hoveredItemRef.current
      if (!hoveredItem) return

      handleImageClick(hoveredItem.name, hoveredItem.imageUrl, hoveredItem.index)
    },
    [handleImageClick]
  )

  const handleCloseProject = useCallback(() => {
    setShowOverlay(false)
    if (closeOverlayTimeoutRef.current != null) clearTimeout(closeOverlayTimeoutRef.current)
    closeOverlayTimeoutRef.current = window.setTimeout(() => {
      setSelectedProject(null)
      closeOverlayTimeoutRef.current = null
    }, 520)
  }, [])

  useEffect(() => {
    if (hoveredImageUrl && previousImageUrl) {
      const timer = setTimeout(() => {
        setPreviousImageUrl(null)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [hoveredImageUrl, previousImageUrl])

  // Native non-passive touchmove so we can call preventDefault and prevent page scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      el.setAttribute('data-touch-y', String(t.clientY))
      el.setAttribute('data-touch-x', String(t.clientX))
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const t = e.touches[0]
      const prevY = parseFloat(el.getAttribute('data-touch-y') || '0')
      const prevX = parseFloat(el.getAttribute('data-touch-x') || '0')
      tubeScrollTarget.current -= (t.clientY - prevY) * 0.04
      tubeSpinVelocity.current -= (t.clientX - prevX) * 0.06
      el.setAttribute('data-touch-y', String(t.clientY))
      el.setAttribute('data-touch-x', String(t.clientX))
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (openOverlayRafRef.current != null) cancelAnimationFrame(openOverlayRafRef.current)
      if (closeOverlayTimeoutRef.current != null) clearTimeout(closeOverlayTimeoutRef.current)
    }
  }, [])

  return (
    <div id="visual-explorations" data-section="visual-explorations" className="mt-20 md:mt-28">
      {/* ── Section header ──────────────────────────────────────── */}
      <div ref={headerRef} className="px-6 md:px-10 pb-8 md:pb-12 overflow-hidden">
        <div className="relative">
          <div ref={lineEl} className="absolute inset-x-0 border-t border-gray-300 hidden md:block" style={{ top: '50%' }} />
          <div className="relative flex items-baseline justify-center gap-2">
            <h2 ref={visualEl} className="relative bg-white pr-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>V</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>isual</span>
            </h2>
            <h2 ref={explorationsEl} className="relative bg-white pl-3 text-2xl md:text-3xl font-light text-black shrink-0 whitespace-nowrap">
              <span style={{ fontFamily: 'VarunCapsSans, sans-serif', fontSize: '1.5em' }}>E</span><span style={{ fontFamily: 'SatishSans, sans-serif' }}>xplorations</span>
            </h2>
          </div>
        </div>
        <p
          className="w-full max-w-none text-center text-sm md:text-base text-gray-600 font-light leading-relaxed mt-3 md:mt-4 px-0"
          style={{ fontFamily: 'FunnelDisplay, sans-serif', fontWeight: 300 }}
        >
          Where I think out loud. Experiments, directions, and things I made just to see what would happen.
        </p>
      </div>

      {/* ── Rubens 3D Showcase Window ───────────────────────────── */}
      <div
        className="relative h-[60vh] md:h-[80vh] bg-transparent overflow-hidden select-none"
        style={{
          isolation: 'isolate',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          touchAction: 'none',
        }}
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerDown={handleContainerPointerDown}
        onWheel={onWheel}
      >
        {isLoading && <LocalLoader />}

        <VisualExplorationsSound containerRef={containerRef} />

        {/* 3D WebGL Canvas */}
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
          dpr={[1, 2]}
          frameloop="always"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          onCreated={({ camera, gl }) => {
            camera.lookAt(0, 0, 0)
            gl.setClearColor(0x000000, 0)
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <Environment preset="studio" blur={10.5} />

            <ImageTube
              scrollTargetRef={tubeScrollTarget}
              spinVelocityRef={tubeSpinVelocity}
              naturalDirRef={tubeNaturalDir}
              tubeAngleRef={tubeAngle}
              onImageHover={handleImageHover}
              onImageClick={handleImageClick}
            />

            <HelmetModel tubeAngleRef={tubeAngle} />
          </Suspense>
        </Canvas>


        {/* Floating cursor label */}
        {hoveredProject && hoveredImageUrl && (
          <div
            className="project-label z-30"
            style={{
              left: `${cursorPos.x + 20}px`,
              top: `${cursorPos.y + 20}px`,
            }}
          >
            <div className="project-thumbnail" style={{ backgroundImage: `url(${hoveredImageUrl})` }} />
            <div className="project-name text-[10px] font-mono tracking-wider font-light text-neutral-800">{hoveredProject}</div>
          </div>
        )}

      </div>

      {/* Click Project Single view detail modal */}
      {portalRoot && selectedProject && createPortal(
        <div 
          className={`project-single-view ${showOverlay ? 'visible' : ''}`}
          onClick={handleCloseProject}
        >
          <div className="project-content" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full">
              <Image
                src={selectedProject.imageUrl}
                alt={selectedProject.name}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 85vw, 600px"
                className="project-image object-contain rounded-xl w-full"
              />
              <button
                className="close-button text-xs font-mono"
                onClick={(e) => { e.stopPropagation(); handleCloseProject() }}
                aria-label="Close"
              >
                ✕ CLOSE
              </button>
            </div>
            <h4
              className="text-2xl md:text-3xl font-light tracking-wide text-black mt-6"
              style={{ fontFamily: 'SatishSans, sans-serif', textTransform: 'none', letterSpacing: '0.02em' }}
            >
              {selectedProject.name}
            </h4>
            <p className="text-sm text-neutral-500 font-light max-w-md mx-auto mt-3 leading-relaxed">
              Creative design exploration showcasing brand, interface layout, and aesthetic structure.
            </p>
          </div>
        </div>,
        portalRoot
      )}

      {/* CSS Styles Localized to Component */}
      <style>{`
        .project-label {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(0, 0, 0, 0.85);
          background: rgba(255, 255, 255, 0.85);
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          pointer-events: none;
          text-transform: uppercase;
          backdrop-filter: blur(15px);
          white-space: nowrap;
          animation: labelFadeIn 0.2s ease-out;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .project-thumbnail {
          width: 40px;
          height: 40px;
          background-size: cover;
          background-position: center;
          border-radius: 6px;
          flex-shrink: 0;
        }

        @keyframes labelFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .project-single-view {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background-color: #ffffff;
          z-index: 20000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .project-single-view.visible {
          opacity: 1;
          pointer-events: all;
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 99px;
          color: black;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.1em;
          font-size: 11px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          z-index: 10;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        .close-button:active {
          transform: scale(0.97);
        }

        .project-content {
          width: 90%;
          max-width: 520px;
          padding: 24px;
          padding-top: 24px;
          color: black;
          text-align: center;
        }

        .project-image {
          width: 100%;
          max-height: 50vh;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          border-radius: 12px;
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .project-content {
            width: 92%;
            padding-top: 24px;
          }
          .project-image {
            max-height: 45vh;
          }
          .close-button {
            top: 12px;
            right: 12px;
            padding: 6px 12px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}

// Preload assets for performance (only in browser — not during SSR)
if (typeof window !== 'undefined') {
  useGLTF.preload("/models/rubens.glb")
}
