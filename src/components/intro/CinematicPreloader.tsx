'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

const LS_KEY = 'sgs:experience'
const TIMEOUT_MS = 10000
const SKIP_BTN_DELAY_MS = 1500

/**
 * CinematicIntro — 5-scene cinematic opening for SGS.
 *
 * Scene 1: Darkness + digital noise + technical lines + "Inicializando ambiente seguro"
 * Scene 2: Fragments converge → SGS logo materializes (voxel-like particle assembly)
 * Scene 3: Risk scanner sweeps across → identifies and neutralizes threats
 * Scene 4: Camera pushes through → reveals Hero section
 * Scene 5: User gains control — cursor influence, scroll indicator
 *
 * Gates:
 *  - ?intro=force  → force play (QA)
 *  - ?intro=off    → skip
 *  - navigator.webdriver → skip (unless force)
 *  - localStorage sgs:experience.introSeen → already seen
 *  - prefers-reduced-motion → ultra-short version (~1.5s)
 */
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
    } catch {
      /* localStorage unavailable */
    }
  } catch {
    return false
  }
  return true
}

export default function CinematicPreloader() {
  const [active, setActive] = useState<boolean>(shouldPlay)
  const [showSkip, setShowSkip] = useState(false)
  const [scene, setScene] = useState<0 | 1 | 2 | 3 | 4>(0)

  const rootRef = useRef<HTMLDivElement>(null!)
  const brandRef = useRef<HTMLDivElement>(null!)
  const taglineRef = useRef<HTMLDivElement>(null!)
  const counterRef = useRef<HTMLSpanElement>(null!)
  const barRef = useRef<HTMLDivElement>(null!)
  const scanRef = useRef<HTMLDivElement>(null!)
  const glowRef = useRef<HTMLDivElement>(null!)
  const skipButtonRef = useRef<HTMLButtonElement>(null!)
  const initTextRef = useRef<HTMLDivElement>(null!)
  const fragmentContainerRef = useRef<HTMLDivElement>(null!)
  const scannerBeamRef = useRef<HTMLDivElement>(null!)
  const riskMarkersRef = useRef<HTMLDivElement>(null!)
  const revealOverlayRef = useRef<HTMLDivElement>(null!)
  const tlRef = useRef<any>(null)
  const gsapRef = useRef<any>(null)
  const lenisRef = useRef<any>(null)
  const prevOverflowRef = useRef('')
  const cancelledRef = useRef(false)

  const reduced = prefersReducedMotion()

  const persistIntroSeen = useCallback(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ introSeen: true }))
    } catch { /* ignore */ }
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

    tlRef.current?.kill()
    tlRef.current = null

    if (counterRef.current) counterRef.current.textContent = '100%'
    if (rootRef.current) rootRef.current.setAttribute('aria-valuenow', '100')

    const gsap = gsapRef.current
    if (gsap && rootRef.current) {
      gsap.set(barRef.current, { scaleX: 1 })
      gsap.to(rootRef.current, {
        opacity: 0,
        yPercent: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          persistIntroSeen()
          setActive(false)
          focusMainContent()
        },
      })
    } else {
      persistIntroSeen()
      focusMainContent()
      setActive(false)
    }

    document.body.style.overflow = prevOverflowRef.current || ''
    lenisRef.current?.start()
  }, [active, persistIntroSeen, focusMainContent])

  const handleSkipKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        skip()
      }
    },
    [skip],
  )

  useEffect(() => {
    if (!active) return

    let cancelled = false
    let cleanupScroll: (() => void) | undefined
    let skipTimer: ReturnType<typeof setTimeout> | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    cancelledRef.current = false

    async function run() {
      let gsap: any
      try {
        const mod = await import('@/lib/gsap')
        gsap = mod.gsap
      } catch {
        if (!cancelled) {
          persistIntroSeen()
          setActive(false)
        }
        return
      }

      gsapRef.current = gsap

      let lenis: any = null
      try {
        const mod = await import('@/lib/lenis')
        lenis = mod.getLenis()
        lenisRef.current = lenis
      } catch { /* lenis unavailable */ }

      if (cancelled || !rootRef.current) return

      lenis?.stop()
      prevOverflowRef.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)

      cleanupScroll = () => {
        document.body.style.overflow = prevOverflowRef.current
        lenis?.start()
      }

      const letters = brandRef.current?.querySelectorAll('[data-letter]')
      const fragments = fragmentContainerRef.current?.querySelectorAll('[data-fragment]')
      const riskMarkers = riskMarkersRef.current?.querySelectorAll('[data-risk]')

      const tl = gsap.timeline({
        onComplete: () => {
          if (cancelled) return
          persistIntroSeen()
          cleanupScroll?.()
          setActive(false)
          focusMainContent()
        },
      })
      tlRef.current = tl

      /* ---- Reduced motion: ultra-short version ---- */
      if (reduced) {
        gsap.set(letters, { yPercent: 120, opacity: 0 })
        gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(initTextRef.current, { opacity: 0 })
        gsap.set(fragments, { opacity: 0, scale: 0 })
        gsap.set(scannerBeamRef.current, { opacity: 0 })
        gsap.set(revealOverlayRef.current, { opacity: 0 })

        const counter = { v: 0 }

        tl
          .set(sceneRef, { v: 1 })
          .to(initTextRef.current, { opacity: 1, duration: 0.2 })
          .to({}, { duration: 0.15 })
          .set(sceneRef, { v: 2 })
          .to(letters, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'expo.out', stagger: 0.04 })
          .to(barRef.current, { scaleX: 1, duration: 0.5, ease: 'power1.inOut' }, 0.1)
          .to(counter, {
            v: 100,
            duration: 0.5,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${Math.round(counter.v)}%`
                rootRef.current?.setAttribute('aria-valuenow', String(Math.round(counter.v)))
              }
            },
          }, 0.1)
          .to({}, { duration: 0.1 })
          .set(sceneRef, { v: 4 })
          .to(rootRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' })
        return
      }

      /* ==============================
         FULL 5-SCENE ANIMATION
         ============================== */

      /* Initial states — all hidden */
      gsap.set(letters, { yPercent: 120, opacity: 0 })
      gsap.set(taglineRef.current, { opacity: 0, letterSpacing: '0.6em' })
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(scanRef.current, { xPercent: -120, opacity: 0 })
      gsap.set(initTextRef.current, { opacity: 0, y: 10 })
      gsap.set(fragments, { opacity: 0, scale: 0, x: () => gsap.utils.random(-200, 200), y: () => gsap.utils.random(-200, 200) })
      gsap.set(scannerBeamRef.current, { opacity: 0, scaleX: 0 })
      gsap.set(riskMarkers, { opacity: 0, scale: 0 })
      gsap.set(revealOverlayRef.current, { clipPath: 'inset(0 0 100% 0)' })

      /* Pulsing glow behind letters */
      gsap.set(glowRef.current, { opacity: 0.3 })
      gsap.to(glowRef.current, {
        opacity: 0.6,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      const counter = { v: 0 }

      /* ====== SCENE 1: Darkness & Initialization (0-1.5s) ====== */
      tl
        .add(() => setScene(0))
        .to(initTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.3)
        /* Digital noise flicker */
        .to(initTextRef.current, { opacity: 0.3, duration: 0.05 }, 0.6)
        .to(initTextRef.current, { opacity: 1, duration: 0.05 }, 0.65)
        .to(initTextRef.current, { opacity: 0.5, duration: 0.05 }, 0.8)
        .to(initTextRef.current, { opacity: 1, duration: 0.05 }, 0.85)
        /* Fade out init text */
        .to(initTextRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 1.1)

      /* ====== SCENE 2: Logo Construction (1.5-4s) ====== */
      tl
        .add(() => setScene(1), 1.3)
        /* Fragments fly in and converge */
        .to(fragments, {
          opacity: 0.8,
          scale: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: {
            each: 0.03,
            from: 'random',
          },
        }, 1.4)
        /* Letters rise from behind mask */
        .to(letters, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.1,
        }, 1.8)
        /* Scanline sweeps the brand */
        .to(scanRef.current, { opacity: 1, duration: 0.1 }, 2.0)
        .to(scanRef.current, { xPercent: 120, duration: 0.8, ease: 'power2.inOut' }, 2.0)
        .to(scanRef.current, { opacity: 0, duration: 0.2 }, '>-0.2')
        /* Fragments settle and fade */
        .to(fragments, {
          opacity: 0,
          scale: 0.5,
          duration: 0.5,
          ease: 'power2.in',
          stagger: { each: 0.02, from: 'random' },
        }, 2.6)
        /* Tagline appears */
        .to(taglineRef.current, {
          opacity: 1,
          letterSpacing: '0.2em',
          duration: 0.7,
          ease: 'expo.out',
        }, 2.4)

      /* ====== SCENE 3: Risk Scanner (4-6s) ====== */
      tl
        .add(() => setScene(2), 3.8)
        /* Scanner beam activates */
        .to(scannerBeamRef.current, {
          opacity: 1,
          scaleX: 1,
          duration: 0.3,
          ease: 'power2.out',
        }, 4.0)
        /* Risk markers appear as scanner passes */
        .to(riskMarkers, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(1.7)',
          stagger: { each: 0.12, from: 'start' },
        }, 4.3)
        /* Risk markers transform: red → safe green */
        .to(riskMarkers, {
          '--risk-color': '#22c55e',
          duration: 0.8,
          ease: 'power2.inOut',
          stagger: 0.1,
        }, 5.0)
        /* Scanner beam fades */
        .to(scannerBeamRef.current, {
          opacity: 0,
          scaleX: 0,
          duration: 0.4,
          ease: 'power2.in',
        }, 5.5)
        /* Risk markers pulse then fade */
        .to(riskMarkers, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          stagger: 0.05,
        }, 5.8)

      /* ====== SCENE 4: System Reveal (6-8s) ====== */
      tl
        .add(() => setScene(3), 5.8)
        /* Progress bar + counter */
        .to(barRef.current, { scaleX: 1, duration: 1.5, ease: 'power1.inOut' }, 5.8)
        .to(counter, {
          v: 100,
          duration: 1.5,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = `${Math.round(counter.v)}%`
              rootRef.current?.setAttribute('aria-valuenow', String(Math.round(counter.v)))
            }
          },
        }, 5.8)
        /* Brand lifts away */
        .to(brandRef.current, {
          yPercent: -40,
          opacity: 0,
          scale: 0.95,
          duration: 0.7,
          ease: 'power3.in',
        }, 7.2)
        .to(taglineRef.current, { opacity: 0, duration: 0.3 }, '<')
        /* Reveal mask opens → hero appears */
        .to(revealOverlayRef.current, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.9,
          ease: 'expo.inOut',
        }, 7.0)

      /* ====== SCENE 5: User Control (8-9s) ====== */
      tl
        .add(() => setScene(4), 7.8)
        /* Overlay fades away completely */
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        }, 8.0)
    }

    run()

    skipTimer = setTimeout(() => setShowSkip(true), SKIP_BTN_DELAY_MS)
    timeoutId = setTimeout(skip, TIMEOUT_MS)

    return () => {
      cancelled = true
      cancelledRef.current = true
      clearTimeout(skipTimer)
      clearTimeout(timeoutId)
      tlRef.current?.kill()
      tlRef.current = null
      if (gsapRef.current) {
        gsapRef.current.killTweensOf(glowRef.current)
      }
      cleanupScroll?.()
    }
  }, [active, reduced, skip, persistIntroSeen, focusMainContent])

  if (!active) return null

  return (
    <div
      ref={rootRef}
      data-testid="cinematic-preloader"
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Carregando introdução SGS"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-sgs-blue-950"
    >
      {/* Scene indicator dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all duration-500',
              scene >= i ? 'bg-sgs-accent-light scale-100' : 'bg-white/20 scale-75'
            )}
          />
        ))}
      </div>

      {/* Grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(74,135,235,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,135,235,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        }}
      />

      {/* Scanline CRT overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)',
        }}
      />

      {/* Central radial glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(0,86,179,0.5) 0%, rgba(6,182,212,0.15) 40%, transparent 65%)' }}
      />

      {/* ====== SCENE 1: Initialization text ====== */}
      <div
        ref={initTextRef}
        className="absolute z-20 flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sgs-cyan animate-pulse-glow" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-sgs-blue-300">
            Inicializando ambiente seguro
          </span>
          <div className="w-2 h-2 rounded-full bg-sgs-cyan animate-pulse-glow" />
        </div>
        <div className="flex gap-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-0.5 bg-sgs-blue-700 rounded-full"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* ====== SCENE 2: Fragment particles ====== */}
      <div
        ref={fragmentContainerRef}
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden="true"
      >
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            data-fragment
            className="absolute rounded-sm"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              width: `${3 + Math.random() * 6}px`,
              height: `${3 + Math.random() * 6}px`,
              background: i % 3 === 0
                ? 'rgba(0, 86, 179, 0.6)'
                : i % 3 === 1
                  ? 'rgba(6, 182, 212, 0.5)'
                  : 'rgba(74, 135, 235, 0.4)',
              boxShadow: '0 0 8px rgba(0, 86, 179, 0.3)',
            }}
          />
        ))}
      </div>

      {/* ====== SCENE 3: Risk Scanner ====== */}
      <div
        ref={scannerBeamRef}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-15 pointer-events-none"
        aria-hidden="true"
        style={{ transformOrigin: 'left center' }}
      >
        <div className="scanner-line" style={{ top: 0 }} />
        <div
          className="absolute inset-x-0 -top-20 h-40 opacity-20"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(0,86,179,0.3), rgba(6,182,212,0.2), rgba(0,86,179,0.3), transparent)',
          }}
        />
      </div>

      {/* Risk markers */}
      <div
        ref={riskMarkersRef}
        className="absolute inset-0 z-12 pointer-events-none"
        aria-hidden="true"
      >
        {[
          { x: '25%', y: '35%', label: 'RISCO' },
          { x: '60%', y: '45%', label: 'ALERTA' },
          { x: '40%', y: '60%', label: 'PENDENTE' },
          { x: '70%', y: '30%', label: 'VERIFICAR' },
        ].map((marker, i) => (
          <div
            key={i}
            data-risk
            className="absolute flex items-center gap-1.5"
            style={{ left: marker.x, top: marker.y, '--risk-color': '#dc2626' } as React.CSSProperties}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--risk-color, #dc2626)', boxShadow: `0 0 8px var(--risk-color, #dc2626)` }}
            />
            <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--risk-color, #dc2626)' }}>
              {marker.label}
            </span>
          </div>
        ))}
      </div>

      {/* ====== Main brand (Scenes 2-4) ====== */}
      <div className="relative z-10 flex flex-col items-center">
        <div ref={brandRef} className="relative overflow-hidden">
          {/* Pulsing glow */}
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 rounded-full opacity-30 blur-2xl"
            style={{ background: 'radial-gradient(circle, rgba(109,158,239,0.5) 0%, transparent 70%)' }}
          />
          <div className="flex items-end leading-none">
            {['S', 'G', 'S'].map((l, i) => (
              <span
                key={i}
                data-letter
                className="inline-block font-heading font-bold text-[24vw] sm:text-[16rem] tracking-tighter text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #6d9eef 60%, #0056b3 100%)',
                }}
              >
                {l}
              </span>
            ))}
          </div>
          {/* Scanline sweep */}
          <div
            ref={scanRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(122,180,255,0.35) 50%, transparent 100%)',
            }}
          />
        </div>

        <div
          ref={taglineRef}
          className="mt-2 font-heading text-xs uppercase text-sgs-blue-200 sm:text-sm"
        >
          Segurança do Trabalho
        </div>

        {/* Progress bar + counter */}
        <div className="mt-10 flex w-56 flex-col items-center gap-2 sm:w-72">
          <div className="h-px w-full overflow-hidden bg-white/10">
            <div
              ref={barRef}
              className="h-full w-full"
              style={{ background: 'linear-gradient(90deg, #0056b3, #06b6d4, #0056b3)' }}
            />
          </div>
          <span
            ref={counterRef}
            className="font-mono text-[0.7rem] tabular-nums tracking-widest text-sgs-blue-200"
          >
            0%
          </span>
        </div>
      </div>

      {/* ====== SCENE 4: Reveal overlay (hero shows through) ====== */}
      <div
        ref={revealOverlayRef}
        className="absolute inset-0 z-5 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, #071a33 0%, #00244d 50%, #071a33 100%)',
        }}
      />

      {/* Skip button */}
      <button
        ref={skipButtonRef}
        type="button"
        data-testid="skip-intro"
        onClick={skip}
        onKeyDown={handleSkipKeyDown}
        aria-label="Pular introdução animada e ir para o conteúdo principal"
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'rounded-lg border border-white/20 bg-sgs-blue-950/80',
          'px-4 py-2 text-sm font-medium text-white/70',
          'backdrop-blur-sm transition-all duration-300',
          'hover:bg-white/10 hover:text-white',
          'focus-visible:outline-2 focus-visible:outline-sgs-accent focus-visible:outline-offset-2',
          showSkip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
        )}
      >
        Pular introdução
      </button>
    </div>
  )
}
