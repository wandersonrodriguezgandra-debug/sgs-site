'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

export default function ScrollProgress({ className }: { className?: string }) {
  const barRef = useRef<HTMLDivElement>(null!)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    let ctx: { revert: () => void } | null = null
    let cancelled = false

    async function init() {
      const { gsap } = await import('@/lib/gsap')
      if (cancelled || !barRef.current) return

      ctx = gsap.context(() => {
        gsap.to(barRef.current, {
          scaleX: 1,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        })
      })
    }

    init()

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 h-[3px] z-[9998] scale-x-0 origin-left',
        'bg-gradient-to-r from-sgs-accent to-sgs-blue-400',
        className,
      )}
      ref={barRef}
      role="progressbar"
      aria-label="Progresso da página"
    />
  )
}
