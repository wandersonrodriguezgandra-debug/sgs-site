'use client'

import { type ReactNode } from 'react'
import { m } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCardTilt } from '@/hooks/useCardTilt'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  perspective?: number
  scale?: number
  glare?: boolean
  disabled?: boolean
}

function TiltCard({
  children,
  className,
  intensity = 5,
  perspective = 1000,
  scale = 1.01,
  glare = false,
  disabled = false,
}: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const isDisabled = disabled || prefersReducedMotion

  const {
    style,
    glareStyle,
    onMouseMove,
    onMouseLeave,
    onMouseEnter,
  } = useCardTilt({
    intensity,
    perspective,
    scale,
    glare,
    disabled: isDisabled,
  })

  if (isDisabled) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <m.div
      className={cn('tilt-depth-container', className)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={style as any}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      {children}
      {glare && (
        <m.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={glareStyle as any}
        />
      )}
    </m.div>
  )
}

export default TiltCard
export { TiltCard }
