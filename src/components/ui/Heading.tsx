import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'
type HeadingSize = 'display' | 'h1' | 'h2' | 'h3' | 'h4'
type HeadingAlign = 'left' | 'center'

interface HeadingProps {
  as?: HeadingLevel
  size?: HeadingSize
  children: ReactNode
  className?: string
  align?: HeadingAlign
}

const sizeStyles: Record<HeadingSize, string> = {
  display: 'text-4xl md:text-5xl md:leading-[3.75rem] font-bold',
  h1: 'text-3xl md:text-4xl font-bold',
  h2: 'text-2xl md:text-3xl font-semibold',
  h3: 'text-xl md:text-2xl font-semibold',
  h4: 'text-lg md:text-xl font-medium',
}

const alignStyles: Record<HeadingAlign, string> = {
  left: 'text-left',
  center: 'text-center',
}

export default function Heading({
  as: Tag = 'h2',
  size,
  children,
  className,
  align = 'left',
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        'font-heading text-sgs-text-primary',
        sizeStyles[size ?? Tag],
        alignStyles[align],
        className
      )}
    >
      {children}
    </Tag>
  )
}
