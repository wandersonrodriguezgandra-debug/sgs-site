'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface SectionTransitionProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
}

/**
 * Reveal de assinatura aplicado a cada seção da home.
 * Cinematográfico mas SEGURO para layout: usa apenas opacity + translateY +
 * filter:blur (que entra em foco). Evita clip-path/scale, que criariam um
 * containing-block e quebrariam o `position:fixed` do pin do HowItWorks.
 * O estado final é idêntico ao original (opacity 1, y 0, sem blur) — os
 * snapshots visuais e o pinning permanecem intactos.
 */
export default function SectionTransition({
  children,
  className,
  delay = 0,
  stagger,
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    let ctx: { revert: () => void } | null = null
    let cancelled = false

    async function init() {
      const { gsap } = await import('@/lib/gsap')
      if (cancelled || !ref.current) return

      const targets = stagger && ref.current.children.length > 0
        ? ref.current.children
        : ref.current

      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 56, filter: 'blur(14px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            delay,
            stagger: stagger,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
            clearProps: 'filter',
          },
        )
      })
    }

    init()

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [reduced, delay, stagger])

  return <div ref={ref} className={cn(className)}>{children}</div>
}
