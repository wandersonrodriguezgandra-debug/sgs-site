import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
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

function getVariants(direction: Direction, distance: number) {
  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  return {
    hidden: { opacity: 0, ...offset[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  }
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
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={getVariants(direction, distance)}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}
