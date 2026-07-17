'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

const LS_KEY = 'sgs:experience'
const TIMEOUT_MS = 12000
const SKIP_BTN_DELAY_MS = 1500

function shouldPlay(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    const intro = params.get('intro')
    if (intro === 'force') return true
    if (intro === 'off') return false
    if (navigator.webdriver) return false
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
      if (stored.introSeen) return false
    } catch { /* ignore */ }
  } catch { return false }
  return true
}

export default function CinematicPreloader() {
  const [active, setActive] = useState<boolean>(shouldPlay)
  const [showSkip, setShowSkip] = useState(false)
  const [phase, setPhase] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const rootRef = useRef<HTMLDivElement>(null!)
  const animFrameRef = useRef<number>(0)
  const cancelledRef = useRef(false)
  const reduced = prefersReducedMotion()

  const persistIntroSeen = useCallback(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ introSeen: true })) } catch { /* ignore */ }
  }, [])

  const focusMainContent = useCallback(() => {
    requestAnimationFrame(() => {
      const main = document.getElementById('main-content')
      if (main) {
        main.setAttribute('tabindex', '-1')
        main.focus({ preventScroll: true })
        requestAnimationFrame(() => main.removeAttribute('tabindex'))
      }
    })
  }, [])

  const skip = useCallback(() => {
    if (!active || cancelledRef.current) return
    cancelledRef.current = true
    cancelAnimationFrame(animFrameRef.current)
    persistIntroSeen()
    focusMainContent()
    setActive(false)
    document.body.style.overflow = ''
  }, [active, persistIntroSeen, focusMainContent])

  const handleSkipKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); skip() }
  }, [skip])

  useEffect(() => {
    if (!active) return
    let cancelled = false
    cancelledRef.current = false

    async function run() {
      let lenis: any = null
      try {
        const mod = await import('@/lib/lenis')
        lenis = mod.getLenis()
      } catch { /* ok */ }

      if (cancelled || !rootRef.current) return
      lenis?.stop()
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)

      // ============ CANVAS PARTICLE SYSTEM ============
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      const W = window.innerWidth
      const H = window.innerHeight

      interface P {
        x: number; y: number
        tx: number; ty: number
        size: number; alpha: number
        color: string; phase: number
      }

      const COLORS = ['#0056b3', '#4a87eb', '#06b6d4', '#22c55e', '#6d9eef']
      const particles: P[] = []

      for (let idx = 0; idx < 250; idx++) {
        const angle = Math.random() * Math.PI * 2
        const dist = 150 + Math.random() * 400
        particles.push({
          x: W / 2 + Math.cos(angle) * dist,
          y: H / 2 + Math.sin(angle) * dist,
          tx: W / 2 + (Math.random() - 0.5) * 220,
          ty: H / 2 + (Math.random() - 0.5) * 90,
          size: 1 + Math.random() * 3,
          alpha: 0,
          color: COLORS[idx % COLORS.length],
          phase: Math.random() * Math.PI * 2,
        })
      }

      let time = 0
      let scannerX = -100
      let localPhase = 0
      let phaseTime = 0

      function animate() {
        if (cancelled) return
        time += 0.016
        phaseTime += 0.016
        ctx.clearRect(0, 0, W, H)

        // Background
        const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6)
        bgGrad.addColorStop(0, 'rgba(0, 50, 120, 0.25)')
        bgGrad.addColorStop(1, 'rgba(7, 26, 51, 0)')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, W, H)

        // Grid
        ctx.strokeStyle = 'rgba(74, 135, 235, 0.05)'
        ctx.lineWidth = 0.5
        const gs = 60
        const go = (time * 10) % gs
        for (let x = -gs + go; x < W + gs; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
        for (let y = -gs + go; y < H + gs; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

        // Phase transitions
        if (localPhase === 0 && phaseTime > 0.3) { localPhase = 1; phaseTime = 0; setPhase(1) }
        if (localPhase === 1 && phaseTime > 2.5) { localPhase = 2; phaseTime = 0; setPhase(2) }
        if (localPhase === 2 && phaseTime > 1.8) { localPhase = 3; phaseTime = 0; setPhase(3) }
        if (localPhase === 3 && phaseTime > 1.2) { localPhase = 4; phaseTime = 0; setPhase(4) }

        // Phase 1: particles converge
        if (localPhase >= 1) {
          const fp = Math.min(1, phaseTime / 2.5)
          particles.forEach((p, i) => {
            p.alpha = Math.min(1, fp * 3 - i / particles.length * 0.5)
            p.x += (p.tx - p.x) * 0.015 * (fp + 0.1)
            p.y += (p.ty - p.y) * 0.015 * (fp + 0.1)
          })
        }

        // Phase 2: scanner
        if (localPhase === 2) {
          scannerX = (phaseTime / 1.8) * (W + 200) - 100
          particles.forEach(p => {
            const d = Math.abs(p.x - scannerX)
            if (d < 80) { p.alpha = 1; p.size = 2 + (1 - d / 80) * 4 }
          })
          // Beam
          ctx.globalAlpha = 0.6
          const beamGrad = ctx.createLinearGradient(scannerX - 2, 0, scannerX + 2, 0)
          beamGrad.addColorStop(0, 'transparent')
          beamGrad.addColorStop(0.3, '#06b6d4')
          beamGrad.addColorStop(0.5, '#ffffff')
          beamGrad.addColorStop(0.7, '#06b6d4')
          beamGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = beamGrad
          ctx.fillRect(scannerX - 2, H * 0.1, 4, H * 0.8)
          const bg = ctx.createRadialGradient(scannerX, H / 2, 0, scannerX, H / 2, 150)
          bg.addColorStop(0, 'rgba(6,182,212,0.12)')
          bg.addColorStop(1, 'transparent')
          ctx.fillStyle = bg
          ctx.fillRect(scannerX - 150, 0, 300, H)
          ctx.globalAlpha = 1
        }

        // Phase 3: connections
        if (localPhase >= 3) {
          ctx.globalAlpha = 0.12
          ctx.strokeStyle = '#4a87eb'
          ctx.lineWidth = 0.5
          for (let i = 0; i < 30; i++) {
            const a = particles[i * 8 % particles.length]
            const b = particles[(i * 8 + 5) % particles.length]
            if (a.alpha > 0.3 && b.alpha > 0.3) {
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            }
          }
          ctx.globalAlpha = 1
        }

        // Phase 4: fade out
        if (localPhase === 4) {
          const fade = Math.min(1, phaseTime / 1.5)
          particles.forEach(p => { p.alpha = Math.max(0, 1 - fade) })
        }

        // Draw particles
        particles.forEach(p => {
          if (p.alpha <= 0) return
          ctx.globalAlpha = p.alpha * 0.8
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
          glow.addColorStop(0, p.color + '40')
          glow.addColorStop(1, 'transparent')
          ctx.fillStyle = glow
          ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.globalAlpha = 1

        animFrameRef.current = requestAnimationFrame(animate)
      }

      animate()

      // Auto-exit after animation
      setTimeout(() => {
        if (!cancelled) skip()
      }, 7500)
    }

    run()

    const skipTimer = setTimeout(() => setShowSkip(true), SKIP_BTN_DELAY_MS)
    const timeoutId = setTimeout(skip, TIMEOUT_MS)

    return () => {
      cancelled = true
      cancelledRef.current = true
      clearTimeout(skipTimer)
      clearTimeout(timeoutId)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [active, reduced, skip, persistIntroSeen, focusMainContent])

  if (!active) return null

  const phaseLabels = ['Inicializando...', 'Construindo ambiente...', 'Analisando riscos...', 'Ambiente seguro', 'Carregando...']
  const progress = Math.min(100, (phase / 4) * 100)

  return (
    <div
      ref={rootRef}
      data-testid="cinematic-preloader"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Carregando introdução SGS"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #071a33 0%, #00244d 40%, #071a33 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="flex items-end leading-none">
            {['S', 'G', 'S'].map((l, i) => (
              <span
                key={i}
                className="inline-block font-heading font-bold text-[20vw] sm:text-[14rem] tracking-tighter"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #6d9eef 50%, #0056b3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(0, 86, 179, 0.4))',
                }}
              >
                {l}
              </span>
            ))}
          </div>
          <div className="text-center">
            <span className="font-heading text-xs sm:text-sm uppercase tracking-[0.3em] text-sgs-blue-200">
              Segurança do Trabalho
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-sgs-cyan animate-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-sgs-blue-300">
            {phaseLabels[phase] || 'Carregando...'}
          </span>
          <div className="w-2 h-2 rounded-full bg-sgs-cyan animate-pulse" />
        </div>

        <div className="mt-6 w-64 sm:w-80">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0056b3, #06b6d4)',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-mono text-[10px] text-sgs-blue-300/60">SGS SYSTEM</span>
            <span className="font-mono text-[10px] text-sgs-blue-300/60">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        data-testid="skip-intro"
        onClick={skip}
        onKeyDown={handleSkipKeyDown}
        aria-label="Pular introdução animada"
        className={cn(
          'fixed bottom-6 right-6 z-50 rounded-lg border border-white/20 bg-white/5',
          'px-4 py-2 text-sm font-medium text-white/60 backdrop-blur-sm transition-all duration-300',
          'hover:bg-white/10 hover:text-white hover:border-white/30',
          'focus-visible:outline-2 focus-visible:outline-sgs-accent focus-visible:outline-offset-2',
          showSkip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
        )}
      >
        Pular introdução →
      </button>
    </div>
  )
}
