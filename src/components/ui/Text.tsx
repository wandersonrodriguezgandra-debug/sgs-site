import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TextSize = 'lg' | 'md' | 'sm'
type TextColor = 'primary' | 'secondary' | 'tertiary'

interface TextProps {
  size?: TextSize
  children: ReactNode
  className?: string
  color?: TextColor
  as?: 'p' | 'span'
  'data-testid'?: string
}

const sizeStyles: Record<TextSize, string> = {
  lg: 'text-lg leading-relaxed',
  md: 'text-base leading-relaxed',
  sm: 'text-sm leading-relaxed',
}

const colorStyles: Record<TextColor, string> = {
  primary: 'text-sgs-text-primary',
  secondary: 'text-sgs-text-secondary',
  tertiary: 'text-sgs-text-tertiary',
}

export default function Text({
  size = 'md',
  children,
  className,
  color = 'secondary',
  as: Tag = 'p',
  'data-testid': testId,
}: TextProps) {
  return (
    <Tag data-testid={testId} className={cn(sizeStyles[size], colorStyles[color], className)}>
      {children}
    </Tag>
  )
}
