'use client'

import { useRef, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { useMagneticInteraction } from '@/hooks/useMagneticInteraction'
import { cn } from '@/lib/utils'

interface MagneticProps {
  children: ReactNode
  strength?: number
  radius?: number
  disabled?: boolean
  className?: string
  as?: 'div' | 'span'
}

function Magnetic({
  children,
  strength = 8,
  radius = 150,
  disabled = false,
  className,
  as: Tag = 'div',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const { x, y } = useMagneticInteraction(ref, strength, radius, disabled)

  const MotionTag = Tag === 'span' ? m.span : m.div as typeof m.div

  return (
    <MotionTag
      ref={ref}
      className={cn('inline-block', className)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ x, y } as any}
    >
      {children}
    </MotionTag>
  )
}

export default Magnetic
export { Magnetic }
