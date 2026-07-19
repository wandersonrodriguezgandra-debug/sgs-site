import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { motionTokens, cssEase } from '@/components/motion/tokens'
import { cn } from '@/lib/utils'

const EASING = cssEase(motionTokens.ease.sgs)

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface BlurRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  blur?: number
  distance?: number
  direction?: Direction
}

function getTransform(direction: Direction, distance: number): string {
  if (direction === 'up') return `translate3d(0, ${distance}px, 0)`
  if (direction === 'down') return `translate3d(0, -${distance}px, 0)`
  if (direction === 'left') return `translate3d(${distance}px, 0, 0)`
  if (direction === 'right') return `translate3d(-${distance}px, 0, 0)`
  return 'translate3d(0, 0, 0)'
}

export default function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  blur = 8,
  distance = 20,
  direction = 'up',
}: BlurRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion) return

    let animation: Animation | null = null
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      animation = element.animate(
        [
          {
            opacity: 0,
            filter: `blur(${blur}px)`,
            transform: getTransform(direction, distance),
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            transform: 'translate3d(0, 0, 0)',
          },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: EASING,
          fill: 'both',
        },
      )
      observer.disconnect()
    }, { threshold: 0.08 })

    observer.observe(element)
    return () => {
      observer.disconnect()
      animation?.cancel()
    }
  }, [blur, delay, direction, distance, duration, prefersReducedMotion])

  return (
    <div
      ref={ref}
      className={cn(className)}
    >
      {children}
    </div>
  )
}
