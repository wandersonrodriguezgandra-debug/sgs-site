import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { motionTokens } from '@/components/motion/tokens'
import { cn } from '@/lib/utils'

interface ParallaxLayerProps {
  children: ReactNode
  className?: string
  /** Clamped to motionTokens.parallax.strong (30px) — secondary captures only. */
  speed?: number
  direction?: 'vertical' | 'horizontal'
  reversed?: boolean
}

// Parallax só em capturas secundárias, com ponteiro preciso (desktop). Em
// touch o custo de scroll-linked transform não compensa um deslocamento
// pouco perceptível — desativado por completo, igual ao restante da tabela
// mobile/reduced-motion da Fase 3.
export default function ParallaxLayer({
  children,
  className,
  speed = motionTokens.parallax.normal,
  direction = 'vertical',
  reversed = false,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const clampedSpeed = Math.min(speed, motionTokens.parallax.strong)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || isTouch) return

    let ctx: { revert: () => void } | undefined
    let disposed = false

    void import('@/lib/gsap').then(({ gsap }) => {
      if (disposed || !ref.current) return
      const factor = reversed ? -clampedSpeed : clampedSpeed
      const prop = direction === 'vertical' ? 'y' : 'x'

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { [prop]: factor },
          {
            [prop]: -factor,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }, el)
    })

    return () => {
      disposed = true
      ctx?.revert()
    }
  }, [clampedSpeed, direction, reduced, reversed, isTouch])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
