'use client'

import { useRef, useEffect } from 'react'

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      container.style.setProperty('--mouse-x', `${x}%`)
      container.style.setProperty('--mouse-y', `${y}%`)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mouse‑following radial glow */}
      <div
        className="absolute inset-0 transition-[background] duration-1000 ease-out"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,180,255,0.08), transparent 40%)',
        }}
      />

      {/* Fine grid layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main grid layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '96px 96px',
        }}
      />

      {/* Gradient radial layers */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sgs-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sgs-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sgs-accent/3 rounded-full blur-3xl" />

      {/* Decorative floating orbs */}
      <div className="absolute top-[15%] right-[20%] w-32 h-32 bg-sgs-accent/8 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[30%] left-[10%] w-24 h-24 bg-sgs-blue-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
      <div className="absolute top-[40%] right-[35%] w-20 h-20 bg-sgs-accent/6 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  )
}
