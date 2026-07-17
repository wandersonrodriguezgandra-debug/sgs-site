'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface SectionTransitionProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  /** Apply subtle parallax depth during scroll */
  parallax?: boolean
}

/**
 * Cinematic section reveal with blur-to-focus transition.
 * Uses opacity + translateY + filter:blur for safe layout.
 * Optional parallax adds depth during scroll.
 */
export default function SectionTransition({
  children,
  className,
  delay = 0,
  stagger,
  parallax = false,
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
        // Main reveal animation
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

        // Optional parallax: subtle Y shift during scroll
        if (parallax) {
          gsap.to(ref.current, {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })
        }
      })
    }

    init()

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [reduced, delay, stagger, parallax])

  return <div ref={ref} className={cn(className)}>{children}</div>
}
