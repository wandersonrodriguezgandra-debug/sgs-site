import { Children, useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type StaggerDirection = 'forward' | 'center'

interface StaggerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
  direction?: StaggerDirection
  delay?: number
}

export default function Stagger({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
  direction = 'forward',
  delay = 0,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const childrenArray = Children.toArray(children)
  const total = childrenArray.length

  useEffect(() => {
    const container = ref.current
    if (!container || reduced) return

    const animations: Animation[] = []
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const items = Array.from(container.querySelectorAll<HTMLElement>(':scope > [data-stagger-item]'))
      items.forEach((item, index) => {
        const sequenceIndex = direction === 'center'
          ? Math.abs(index - (items.length - 1) / 2)
          : index

        animations.push(item.animate(
          [
            { opacity: 0, transform: 'translate3d(0, 24px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' },
          ],
          {
            duration: 620,
            delay: (delay + sequenceIndex * staggerDelay) * 1000,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          },
        ))
      })

      if (once) observer.disconnect()
    }, { threshold: 0.08 })

    observer.observe(container)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [delay, direction, once, reduced, staggerDelay, total])

  return (
    <div
      ref={ref}
      className={cn(className)}
    >
      {childrenArray.map((child, index) => (
        <div key={index} data-stagger-item>
          {child}
        </div>
      ))}
    </div>
  )
}
