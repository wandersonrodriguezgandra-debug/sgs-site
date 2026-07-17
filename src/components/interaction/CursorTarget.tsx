'use client'

import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useCursorTarget } from '@/hooks/useCursorTarget'

type CursorType = 'default' | 'link' | 'view' | 'open' | 'play' | 'explore' | 'contact'

interface CursorTargetProps {
  children: ReactNode
  type?: CursorType
  label?: string
  className?: string
}

function CursorTarget({
  children,
  type = 'default',
  label,
  className,
}: CursorTargetProps) {
  const ref = useRef<HTMLDivElement>(null!)
  useCursorTarget(ref, type, label || '')

  return (
    <span
      ref={ref}
      className={cn('group/cursor', className)}
      data-cursor={type !== 'default' ? type : undefined}
    >
      {children}
    </span>
  )
}

export default CursorTarget
export { CursorTarget }
