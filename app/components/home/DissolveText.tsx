"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

interface DissolveTextProps {
  children: string
  className?: string
  style?: React.CSSProperties
}

export default function DissolveText({ children, className, style }: DissolveTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const textElement = containerRef.current
    const canvas = canvasRef.current
    if (!textElement || !canvas) return

    // Initially hide HTML text color (transparent) to avoid layout shifts but keep space occupied
    textElement.style.color = "transparent"

    let animationFrameId: number
    let renderer: THREE.WebGLRenderer
    let scene: THREE.Scene
    let camera: THREE.OrthographicCamera
    let geometry: THREE.PlaneGeometry
    let material: THREE.ShaderMaterial
    let texture: THREE.CanvasTexture
    let mesh: THREE.Mesh

    const init = () => {
      const width = textElement.clientWidth
      const height = textElement.clientHeight

      // Set canvas size
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Offscreen canvas to render text
      const offscreen = document.createElement("canvas")
      offscreen.width = width * 2 // Double width/height for high DPI rendering (sharp text!)
      offscreen.height = height * 2
      const ctx = offscreen.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, offscreen.width, offscreen.height)

      const computed = window.getComputedStyle(textElement)
      const fontWeight = computed.fontWeight || "400"
      const fontSize = parseFloat(computed.fontSize) || 24
      const fontFamily = computed.fontFamily || "sans-serif"
      const color = computed.color || "#000000"
      const textAlign = computed.textAlign || "left"

      // Scale context for high-DPI canvas drawing
      ctx.scale(2, 2)

      // Apply style
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      ctx.fillStyle = color
      ctx.textBaseline = "middle"
      ctx.textAlign = textAlign as CanvasTextAlign

      const x = textAlign === "center" ? width / 2 : textAlign === "right" ? width : 0
      ctx.fillText(children, x, height / 2)

      // Three.js Scene Setup
      scene = new THREE.Scene()

      camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        0.1,
        100
      )
      camera.position.z = 10

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height)

      // Create texture from canvas
      texture = new THREE.CanvasTexture(offscreen)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter

      geometry = new THREE.PlaneGeometry(width, height)

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uProgress: { value: 0.0 }, // Starts fully dissolved
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D uTexture;
          uniform float uProgress;

          float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }

          float noise(vec2 p){
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);
            
            float res = mix(
              mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
              mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
            return res*res;
          }

          void main() {
            vec4 texColor = texture2D(uTexture, vUv);
            if (texColor.a < 0.01) discard;

            // Dense noise to create a highly detailed, organic sand-dissolve look
            float noiseVal = noise(vUv * 35.0);
            float edge = 0.12;
            float dissolve = smoothstep(1.0 - uProgress - edge, 1.0 - uProgress + edge, noiseVal);
            
            gl_FragColor = vec4(texColor.rgb, texColor.a * (1.0 - dissolve));
          }
        `,
        transparent: true,
      })

      mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Render loop
      const tick = () => {
        renderer.render(scene, camera)
        animationFrameId = requestAnimationFrame(tick)
      }
      tick()

      // Start dissolve appear animation using GSAP
      gsap.to(material.uniforms.uProgress, {
        value: 1.0,
        duration: 1.6,
        ease: "power2.out",
        delay: 0.25, // brief delay for page entrance choreo
        onComplete: () => {
          // Restore native text rendering for perfect subpixel clarity and text selection/accessibility
          textElement.style.color = ""
          canvas.style.display = "none"
          cleanup()
        },
      })
    }

    const cleanup = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (geometry) geometry.dispose()
      if (material) material.dispose()
      if (texture) texture.dispose()
      if (renderer) renderer.dispose()
    }

    // Wait for custom fonts to load so the canvas renders with the correct typeface
    document.fonts.ready.then(() => {
      init()
    })

    return () => {
      cleanup()
    }
  }, [children])

  return (
    <span
      ref={containerRef}
      className={`${className} relative inline-block`}
      style={{ ...style }}
    >
      {children}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      />
    </span>
  )
}
