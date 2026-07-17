'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

interface NarrativeScrollWrapperProps {
  sectionIndex: number
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

const sectionLabels = ['01', '02', '03', '04', '05', '06']

export default function NarrativeScrollWrapper({
  sectionIndex,
  title,
  subtitle,
  children,
  className,
}: NarrativeScrollWrapperProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const reduced = useReducedMotion()
  const [contentRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  useEffect(() => {
    if (reduced) return

    let ctx: { revert: () => void } | null = null
    let cancelled = false

    async function init() {
      const { gsap } = await import('@/lib/gsap')
      if (cancelled || !ref.current) return

      ctx = gsap.context(() => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 56, filter: 'blur(14px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
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
  }, [reduced])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div
        className="absolute left-0 top-0 bottom-0 w-16 hidden lg:flex flex-col items-center pt-24 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
          <span className="text-xs font-mono text-sgs-accent font-bold tracking-widest">
            {sectionLabels[sectionIndex] ?? `0${sectionIndex + 1}`}
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-sgs-accent/50 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-sgs-accent ring-2 ring-sgs-accent/20" />
        </div>
      </div>

      <div className="pl-0 lg:pl-16" ref={contentRef}>
        {(title || subtitle) && (
          <m.div
            initial={reduced ? undefined : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            {title && (
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-sgs-text-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-sgs-text-secondary max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </m.div>
        )}
        {children}
      </div>
    </div>
  )
}
