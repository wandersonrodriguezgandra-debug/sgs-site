'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface DrawSvgPathProps {
  path: string
  className?: string
  viewBox?: string
  strokeColor?: string
  strokeWidth?: number
  duration?: number
  delay?: number
  start?: string
  end?: string
  scrub?: boolean | number
  fill?: string
  trigger?: string
}

export default function DrawSvgPath({
  path,
  className = '',
  viewBox = '0 0 100 100',
  strokeColor = '#2563eb',
  strokeWidth = 2,
  duration = 2,
  delay = 0,
  start = 'top 85%',
  end = 'bottom 15%',
  scrub = false,
  fill = 'none',
  trigger,
}: DrawSvgPathProps) {
  const pathRef = useRef<SVGPathElement>(null!)
  const svgRef = useRef<SVGSVGElement>(null!)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !pathRef.current) return

    let cancelled = false
    let ctx: gsap.Context | null = null

    import('@/lib/gsap').then(({ gsap }) => {
      if (cancelled) return

      const length = pathRef.current!.getTotalLength()
      gsap.set(pathRef.current!, { strokeDasharray: length, strokeDashoffset: length })

      ctx = gsap.context(() => {
        gsap.to(pathRef.current!, {
          strokeDashoffset: 0,
          duration: scrub ? undefined : duration,
          delay,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: trigger || svgRef.current.parentElement,
            start,
            end: scrub ? end : undefined,
            scrub: scrub ? (typeof scrub === 'number' ? scrub : 1) : undefined,
            toggleActions: scrub ? undefined : 'play none none reverse',
          },
        })
      })
    })
    // DADO DEMONSTRATIVO — substituir path por SVG real do SGS

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [reduced, path, duration, delay, start, end, scrub, trigger])

  if (reduced) return null

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className={className}
      fill={fill}
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
    </svg>
  )
}
