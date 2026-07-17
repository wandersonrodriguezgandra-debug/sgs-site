'use client'

import { useEffect, useState, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'

interface AnimatedCounterProps {
  from?: number
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  from = 0,
  to,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState(from)
  const reduced = useReducedMotion()
  const [setRef, inView] = useInView<HTMLSpanElement>({ threshold: 0.5 })
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    if (!inView) return

    if (reduced) {
      setDisplayed(to)
      return
    }

    let cancelled = false

    import('@/lib/gsap').then(({ gsap }) => {
      if (cancelled) return

      const obj = { value: from }
      const ctx = gsap.context(() => {
        gsap.to(obj, {
          value: to,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            if (!cancelled) setDisplayed(obj.value)
          },
        })
      })
      ctxRef.current = ctx
    })

    return () => {
      cancelled = true
      ctxRef.current?.revert()
    }
  }, [inView, reduced, from, to, duration])

  return (
    <span ref={setRef} className={className}>
      {prefix}{displayed.toFixed(decimals)}{suffix}
    </span>
  )
}
