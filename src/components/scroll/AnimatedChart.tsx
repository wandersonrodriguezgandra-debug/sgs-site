'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

// DADO DEMONSTRATIVO — substituir por dados reais da API

interface ChartBar {
  label: string
  value: number
  color?: string
}

interface AnimatedChartProps {
  bars: ChartBar[]
  maxValue?: number
  height?: number
  className?: string
  barClassName?: string
  showLabels?: boolean
  showValues?: boolean
  scrub?: boolean
}

export default function AnimatedChart({
  bars,
  maxValue,
  height = 200,
  className,
  barClassName,
  showLabels = true,
  showValues = true,
  scrub = false,
}: AnimatedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const reduced = useReducedMotion()

  const max = maxValue ?? Math.max(...bars.map((b) => b.value))
  const normalizedBars = bars.map((b) => ({
    ...b,
    percent: (b.value / max) * 100,
  }))

  useEffect(() => {
    if (reduced || !containerRef.current) return

    let cancelled = false
    let ctx: gsap.Context | null = null

    import('@/lib/gsap').then(({ gsap }) => {
      if (cancelled) return

      const barEls = containerRef.current!.querySelectorAll<HTMLElement>('[data-chart-bar]')
      const labelEls = containerRef.current!.querySelectorAll<HTMLElement>('[data-chart-value]')

      ctx = gsap.context(() => {
        gsap.fromTo(
          barEls,
          { scaleY: 0, transformOrigin: 'bottom center' },
          {
            scaleY: 1,
            duration: scrub ? undefined : 0.8,
            ease: 'back.out(1.7)',
            stagger: scrub ? 0 : 0.1,
            scrollTrigger: scrub
              ? {
                  trigger: containerRef.current!,
                  start: 'top 80%',
                  end: 'bottom 20%',
                  scrub: 1,
                }
              : {
                  trigger: containerRef.current!,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
          },
        )

        if (labelEls.length > 0) {
          gsap.fromTo(
            labelEls,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              delay: 0.3,
              scrollTrigger: {
                trigger: containerRef.current!,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        }
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [reduced, normalizedBars, scrub])

  if (reduced) {
    return (
      <div ref={containerRef} className={cn('flex items-end gap-3', className)} style={{ height }}>
        {normalizedBars.map((bar) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn('w-full rounded-t', barClassName)}
              style={{
                height: `${bar.percent}%`,
                backgroundColor: bar.color || 'var(--color-sgs-accent)',
              }}
            />
            {showLabels && <span className="text-xs text-sgs-text-tertiary">{bar.label}</span>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('flex items-end gap-3', className)} style={{ height }}>
      {normalizedBars.map((bar) => (
        <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
          {showValues && (
            <span
              data-chart-value
              className="text-xs font-medium text-sgs-text-primary opacity-0"
            >
              {bar.value}{bar.label === 'Adesão' || bar.label === 'Docs' || bar.label === 'Trein.' ? '%' : ''}
            </span>
          )}
          <div
            data-chart-bar
            className={cn('w-full rounded-t scale-y-0', barClassName)}
            style={{
              height: `${bar.percent}%`,
              backgroundColor: bar.color || 'var(--color-sgs-accent)',
            }}
          />
          {showLabels && (
            <span className="text-xs text-sgs-text-tertiary">{bar.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}
