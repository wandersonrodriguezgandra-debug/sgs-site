'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

interface WebGLSectionTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function WebGLSectionTransition({
  children,
  className,
}: WebGLSectionTransitionProps) {
  const sectionRef = useRef<HTMLElement>(null!)
  const canvasContainerRef = useRef<HTMLDivElement>(null!)
  const reduced = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const [heroProgress, setHeroProgress] = useState(0)
  const rafRef = useRef<number>(0)

  const updateProgress = useCallback(() => {
    const hero = document.querySelector('#hero')
    if (!hero) return

    const heroRect = hero.getBoundingClientRect()
    const windowH = window.innerHeight

    const heroTotalH = heroRect.height
    const scrolled = windowH - heroRect.bottom
    // Guard: se o hero ainda não foi medido ou é menor que a viewport,
    // o denominador seria <= 0 e a divisão produziria NaN/Infinity —
    // que vazava para opacity/transform (warning "NaN opacity").
    const denom = heroTotalH - windowH
    const progress = denom > 0 ? Math.max(0, Math.min(1, scrolled / denom)) : 0

    setHeroProgress(Number.isFinite(progress) ? progress : 0)
  }, [])

  // Atualização contínua durante scroll sem GSAP
  useEffect(() => {
    if (reduced || isTouch) return

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, isTouch, updateProgress])

  // Fallback reduced motion / touch: fade-in simples
  const showSimpleFade = reduced || isTouch

  const opacity = reduced ? 1 : Math.max(0, 1 - heroProgress * 2)
  const transformY = reduced ? 0 : heroProgress * 30

  return (
    <section
      ref={sectionRef}
      id="webgl-section-transition"
      className={`relative ${className || ''}`}
      style={{
        opacity: showSimpleFade ? undefined : opacity,
        transform: showSimpleFade ? undefined : `translateY(${transformY}px)`,
        transition: reduced ? 'none' : undefined,
      }}
    >
      {/* Máscara do Canvas 3D — integrada com a primeira seção após o Hero */}
      <div
        id="hero-canvas-mask"
        ref={canvasContainerRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: showSimpleFade
            ? 'none'
            : `linear-gradient(
              to bottom,
              rgba(0,0,0,${Math.max(0, 1 - heroProgress * 1.5)}) 0%,
              rgba(0,0,0,${Math.max(0, 1 - heroProgress * 1.2)}) 40%,
              rgba(0,0,0,${Math.max(0, 0.8 - heroProgress)}) 70%,
              transparent 100%
            )`,
          WebkitMaskImage: showSimpleFade
            ? 'none'
            : `linear-gradient(
              to bottom,
              rgba(0,0,0,${Math.max(0, 1 - heroProgress * 1.5)}) 0%,
              rgba(0,0,0,${Math.max(0, 1 - heroProgress * 1.2)}) 40%,
              rgba(0,0,0,${Math.max(0, 0.8 - heroProgress)}) 70%,
              transparent 100%
            )`,
          maskComposite: 'add',
          transition: 'mask-image 0.1s ease-out',
        }}
      />

      {/* Conteúdo da seção */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}
