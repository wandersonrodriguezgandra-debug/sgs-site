import { useRef, type ReactNode, type MouseEvent, type RefObject } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMagneticInteraction } from '@/hooks/useMagneticInteraction'
import { motionTokens } from '@/components/motion/tokens'

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
  /** Pull magnético em direção ao cursor (assinatura Lusion). Ligado por padrão. */
  magnetic?: boolean
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
  magnetic = true,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading
  const ref = useRef<HTMLElement>(null!)

  const { x, y } = useMagneticInteraction(
    ref,
    motionTokens.magnetic.strong,
    80,
    !magnetic || isDisabled,
  )

  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-sgs-accent cursor-pointer select-none',
    variantStyles[variant],
    sizeStyles[size],
    isDisabled && 'opacity-50 pointer-events-none',
    className
  )

  const motionProps = {
    className: classes,
    style: { x, y },
    whileHover: isDisabled ? {} : { scale: 1.03 },
    whileTap: isDisabled ? {} : { scale: 0.97 },
    onClick,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
    'data-testid': rest['data-testid'] || undefined,
  }

  if (href) {
    return (
      <motion.a
        ref={ref as unknown as RefObject<HTMLAnchorElement>}
        href={href}
        {...motionProps}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as unknown as RefObject<HTMLButtonElement>}
      type={type}
      disabled={isDisabled}
      {...motionProps}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  )
}

export default Button
export { Button }
