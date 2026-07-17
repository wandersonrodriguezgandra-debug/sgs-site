'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface HorizontalScrollSectionProps {
  children: ReactNode
  id?: string
  className?: string
  containerClassName?: string
}

export default function HorizontalScrollSection({
  children,
  id,
  className,
  containerClassName,
}: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    let ctxCleanup: (() => void) | null = null

    async function init() {
      const { gsap } = await import('@/lib/gsap')
      if (cancelled) return

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        mm.add('(min-width: 1024px) and (pointer: fine)', () => {
          const panels = gsap.utils.toArray<HTMLElement>(
            containerRef.current?.children || [],
          )
          if (panels.length === 0) return

          const totalWidth = panels.reduce((acc, panel) => acc + panel.offsetWidth, 0)
          const viewportWidth = window.innerWidth
          const distance = totalWidth - viewportWidth

          if (distance <= 0) return

          gsap.to(containerRef.current, {
            x: () => -distance,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${distance}`,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
        })

        mm.add('(max-width: 1023px)', () => {})
      })

      ctxCleanup = () => ctx.revert()
    }

    init()

    return () => {
      cancelled = true
      ctxCleanup?.()
    }
  }, [reduced])

  const isHorizontal = !reduced

  if (!isHorizontal) {
    return (
      <section id={id} ref={sectionRef} className={cn('py-16', className)}>
        <div className={cn('max-w-6xl mx-auto px-6', containerClassName)}>
          {children}
        </div>
      </section>
    )
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn('overflow-hidden', className)}
    >
      <div ref={containerRef} className={cn('flex gap-6 px-6', containerClassName)}>
        {children}
      </div>
    </section>
  )
}
