import type { ReactNode, MouseEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  href?: string
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  'data-testid'?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-sgs-accent text-sgs-text-inverse hover:bg-sgs-accent-dark shadow-sm hover:shadow-glow-strong',
  secondary: 'bg-sgs-blue-50 text-sgs-accent hover:bg-sgs-blue-100',
  outline: 'border border-sgs-accent/30 text-sgs-accent hover:bg-sgs-accent/5 hover:border-sgs-accent/50',
  ghost: 'text-sgs-accent hover:bg-sgs-blue-50',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  const classes = cn(
    // hover:scale-[1.03] / active:scale-[0.97] — motionTokens.scale.hover/press
    'inline-flex items-center justify-center gap-2 font-medium transition-[background-color,color,transform] duration-200 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-sgs-accent cursor-pointer select-none',
    variantStyles[variant],
    sizeStyles[size],
    isDisabled && 'opacity-50 pointer-events-none',
    className
  )

  const testId = rest['data-testid'] || undefined

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} data-testid={testId}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={classes}
      onClick={onClick}
      data-testid={testId}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
export { Button }
