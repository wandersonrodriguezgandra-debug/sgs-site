'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import TypewriterText from '@/components/motion/TypewriterText'
import HeroBackground from '@/components/sections/HeroBackground'
import HeroVideoBackground from '@/components/sections/HeroVideoBackground'

const heroLines = [
  'Segurança inteligente.',
  'Riscos sob controle.',
] as const

export default function HeroSection() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  // Scroll indicator bounce
  useEffect(() => {
    if (!scrollIndicatorRef.current) return
    const el = scrollIndicatorRef.current
    let frame: number
    let t = 0
    function animate() {
      t += 0.03
      el.style.transform = `translateY(${Math.sin(t) * 6}px)`
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-neutral-950"
    >
      <HeroVideoBackground src="/videos/hero-sgs-clean.mp4" poster="/videos/hero-poster-clean.webp" />
      <HeroBackground />

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'linear-gradient(90deg, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.66) 38%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0.02) 100%)',
            'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.55) 100%)',
          ].join(', '),
        }}
      />

      <div className="container-sgs relative z-10 w-full py-28 md:py-32 lg:py-36">
        <div className="max-w-3xl" data-testid="hero-title">
          <TypewriterText
            lines={heroLines}
            typingDelay={80}
            deletingDelay={40}
            pauseDelay={1250}
            className="text-4xl font-bold leading-[1.04] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl xl:text-7xl"
            lineClassNames={[
              'text-white',
              'bg-gradient-to-r from-sgs-cyan via-sky-300 to-sgs-blue-200 bg-clip-text text-transparent',
            ]}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-white/45">Role para explorar</span>
        <ChevronDown className="h-5 w-5 text-white/45" />
      </div>
    </section>
  )
}
