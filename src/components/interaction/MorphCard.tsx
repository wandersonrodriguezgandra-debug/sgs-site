'use client'

import { useCallback, useEffect, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MorphCardProps {
  children: ReactNode
  layoutId: string
  expanded: boolean
  onClose?: () => void
  className?: string
  style?: Record<string, string | number | undefined>
  as?: 'div' | 'article'
}

function MorphCard({
  children,
  layoutId,
  expanded,
  onClose,
  className,
  style,
  as: Tag = 'div',
}: MorphCardProps) {
  const prefersReducedMotion = useReducedMotion()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (expanded) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expanded, handleKeyDown])

  if (prefersReducedMotion) {
    return (
      <Tag
        className={cn(className)}
        style={style}
        aria-expanded={expanded}
        aria-controls={`${layoutId}-content`}
      >
        {children}
      </Tag>
    )
  }

  return (
    <m.div
      layoutId={layoutId}
      layout
      className={cn('rounded-xl', className)}
      style={style}
      aria-expanded={expanded}
      aria-controls={`${layoutId}-content`}
      transition={{
        layout: { type: 'spring', stiffness: 400, damping: 35 },
      }}
    >
      <div id={`${layoutId}-content`}>{children}</div>
    </m.div>
  )
}

export default MorphCard
export { MorphCard }
