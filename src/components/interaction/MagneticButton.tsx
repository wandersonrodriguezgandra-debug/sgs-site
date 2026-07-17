'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { m } from 'framer-motion'
import { useMagneticInteraction } from '@/hooks/useMagneticInteraction'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  href?: string
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  type?: 'button' | 'submit' | 'reset'
  'data-testid'?: string
}

function MagneticButton({
  children,
  className,
  disabled = false,
  href,
  onClick: _onClick,
  type = 'button',
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const shouldDisable = disabled || prefersReducedMotion || isTouch
  const { x, y } = useMagneticInteraction(ref, 3.6, 30, shouldDisable)

  const motionProps = {
    className: cn(
      'inline-flex items-center justify-center gap-2 relative overflow-hidden rounded-lg transition-colors duration-200',
      'bg-sgs-accent text-sgs-text-inverse hover:bg-sgs-accent-dark px-6 py-3 font-medium',
      'cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-sgs-accent',
      shouldDisable && 'opacity-50 pointer-events-none',
      className
    ),
    whileHover: shouldDisable ? {} : { scale: 1.02 },
    whileTap: shouldDisable ? {} : { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
    'data-testid': rest['data-testid'] || undefined,
  }

  const content = (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <m.div ref={ref} className="inline-block" style={{ x, y } as Record<string, unknown>}>
        <m.a href={href} {...motionProps}>
          {content}
        </m.a>
      </m.div>
    )
  }

  return (
    <m.div ref={ref} className="inline-block" style={{ x, y } as Record<string, unknown>}>
      <m.button type={type} disabled={shouldDisable} {...motionProps}>
        {content}
      </m.button>
    </m.div>
  )
}

export default MagneticButton
export { MagneticButton }
