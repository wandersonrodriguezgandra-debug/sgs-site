import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

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

function getVariants(direction: Direction, distance: number, blur: number) {
  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }

  return {
    hidden: { opacity: 0, filter: `blur(${blur}px)`, ...offset[direction] },
    visible: { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 },
  }
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
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={getVariants(direction, distance, blur)}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
