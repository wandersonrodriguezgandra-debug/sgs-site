'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { getDeviceTier, getCappedPixelRatio } from '@/lib/deviceTier'
import { IMMERSIVE_HERO_ENABLED } from '@/lib/flags'

// A drifting field of points behind the hero copy, with a radial pulse of
// light that blooms in over the first ~1.6s and settles into ambient
// motion. Pure WebGL (via OGL, ~30KB — Three.js would be 5x heavier for a
// scene this simple), lazy-imported so it never sits in the initial
// bundle. Purely additive: the canvas is absolutely positioned behind the
// H1/CTA, contributes zero layout, and never gates when the real content
// becomes visible.
export default function HeroWebGLScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isTouch = useIsTouchDevice()

  useEffect(() => {
    if (!IMMERSIVE_HERO_ENABLED || reduced) return
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let cleanup: (() => void) | undefined

    void import('ogl').then(({ Renderer, Camera, Transform, Program, Mesh, Geometry }) => {
      if (disposed || !container) return

      const tier = getDeviceTier()
      const particleCount = isTouch || tier === 'low' ? 220 : 480

      const renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: getCappedPixelRatio(isTouch || tier === 'low' ? 1.5 : 2),
      })
      const gl = renderer.gl
      gl.canvas.style.width = '100%'
      gl.canvas.style.height = '100%'
      container.appendChild(gl.canvas)

      const camera = new Camera(gl, { fov: 45 })
      camera.position.set(0, 0, 5)
      camera.lookAt([0, 0, 0])

      const scene = new Transform()

      const positions = new Float32Array(particleCount * 3)
      const seeds = new Float32Array(particleCount)
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 3.2
        const angle = Math.random() * Math.PI * 2
        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = Math.sin(angle) * radius * 0.6
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2
        seeds[i] = Math.random() * Math.PI * 2
      }

      const geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        seed: { size: 1, data: seeds },
      })

      // sgs-accent (#0056b3) and sgs-cyan (#06b6d4) from the design tokens,
      // blended toward white at the core of the pulse.
      const program = new Program(gl, {
        vertex: /* glsl */ `
          attribute vec3 position;
          attribute float seed;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          uniform float uTime;
          varying float vSeed;
          void main() {
            vSeed = seed;
            vec3 p = position;
            p.x += sin(uTime * 0.15 + seed) * 0.08;
            p.y += cos(uTime * 0.12 + seed * 1.3) * 0.08;
            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (2.0 + sin(seed) * 1.5) * (4.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragment: /* glsl */ `
          precision highp float;
          uniform float uPulse;
          varying float vSeed;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d);
            vec3 accent = vec3(0.0, 0.337, 0.702);
            vec3 cyan = vec3(0.024, 0.714, 0.831);
            vec3 color = mix(accent, cyan, sin(vSeed) * 0.5 + 0.5);
            color = mix(color, vec3(1.0), uPulse * 0.4);
            gl_FragColor = vec4(color, alpha * (0.35 + uPulse * 0.4));
          }
        `,
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
        },
        transparent: true,
        depthTest: false,
      })

      const points = new Mesh(gl, { mode: gl.POINTS, geometry, program, frustumCulled: false })
      points.setParent(scene)

      let rafId = 0
      let startTime = 0
      let running = true

      const resize = () => {
        const { clientWidth, clientHeight } = container
        renderer.setSize(clientWidth, clientHeight)
        camera.perspective({ aspect: clientWidth / clientHeight })
      }
      resize()
      window.addEventListener('resize', resize)

      const pulseDurationMs = 1600

      const frame = (now: number) => {
        if (!running) return
        if (!startTime) startTime = now
        const elapsed = now - startTime
        const t = elapsed / 1000

        program.uniforms.uTime.value = t
        program.uniforms.uPulse.value = Math.max(0, 1 - elapsed / pulseDurationMs)

        renderer.render({ scene, camera })
        rafId = requestAnimationFrame(frame)
      }
      rafId = requestAnimationFrame(frame)

      const io = new IntersectionObserver(
        ([entry]) => {
          running = entry.isIntersecting && document.visibilityState === 'visible'
          if (running) rafId = requestAnimationFrame(frame)
          else cancelAnimationFrame(rafId)
        },
        { threshold: 0 },
      )
      io.observe(container)

      const handleVisibility = () => {
        running = document.visibilityState === 'visible'
        if (running) {
          startTime = 0
          rafId = requestAnimationFrame(frame)
        } else {
          cancelAnimationFrame(rafId)
        }
      }
      document.addEventListener('visibilitychange', handleVisibility)

      cleanup = () => {
        running = false
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', resize)
        document.removeEventListener('visibilitychange', handleVisibility)
        io.disconnect()
        gl.canvas.remove()
      }

      if (disposed) cleanup()
    })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [reduced, isTouch])

  if (!IMMERSIVE_HERO_ENABLED || reduced) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    />
  )
}
