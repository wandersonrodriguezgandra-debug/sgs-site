import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  'data-testid'?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-sgs-blue-50 text-sgs-accent',
  success: 'bg-green-50 text-sgs-success',
  warning: 'bg-amber-50 text-sgs-warning',
  info: 'bg-sky-50 text-sgs-info',
}

function Badge({
  variant = 'default',
  children,
  className,
  'data-testid': testId,
}: BadgeProps) {
  return (
    <span
      data-testid={testId}
      className={cn(
        'inline-flex items-center px-3 py-1 text-xs font-medium rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
export { Badge }
