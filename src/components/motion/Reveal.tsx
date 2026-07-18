import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
  duration?: number
  distance?: number
}

function getTransform(direction: Direction, distance: number): string {
  if (direction === 'up') return `translate3d(0, ${distance}px, 0)`
  if (direction === 'down') return `translate3d(0, -${distance}px, 0)`
  if (direction === 'left') return `translate3d(${distance}px, 0, 0)`
  if (direction === 'right') return `translate3d(-${distance}px, 0, 0)`
  return 'translate3d(0, 0, 0)'
}

export default function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  distance = 30,
}: RevealProps) {
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
          { opacity: 0, transform: getTransform(direction, distance) },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
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
  }, [delay, direction, distance, duration, prefersReducedMotion])

  return (
    <div
      ref={ref}
      className={cn(className)}
    >
      {children}
    </div>
  )
}
