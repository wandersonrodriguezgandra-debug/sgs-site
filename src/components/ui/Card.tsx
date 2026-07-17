import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardPadding = 'md' | 'lg'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: CardPadding
  as?: 'div' | 'section' | 'article'
}

const paddingStyles: Record<CardPadding, string> = {
  md: 'p-6',
  lg: 'p-8',
}

function Card({
  children,
  className,
  hover = true,
  padding = 'md',
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-sgs-surface border border-sgs-border rounded-xl',
        paddingStyles[padding],
        hover && 'transition-shadow duration-300 hover:shadow-lg',
        className
      )}
    >
      {children}
    </Tag>
  )
}

export default Card
export { Card }
