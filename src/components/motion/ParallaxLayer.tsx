import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface ParallaxLayerProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'vertical' | 'horizontal'
  reversed?: boolean
}

export default function ParallaxLayer({
  children,
  className,
  speed = 20,
  direction = 'vertical',
  reversed = false,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const factor = reversed ? -speed : speed
  const y = useTransform(scrollYProgress, [0, 1], [factor, -factor])
  const x = useTransform(scrollYProgress, [0, 1], [factor, -factor])

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  const style = direction === 'vertical' ? { y } : { x }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={style}
    >
      {children}
    </motion.div>
  )
}
