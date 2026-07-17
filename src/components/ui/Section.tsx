import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'

type SectionVariant = 'default' | 'muted' | 'dark'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  variant?: SectionVariant
  'data-testid'?: string
}

const variantStyles: Record<SectionVariant, string> = {
  default: 'bg-sgs-surface',
  muted: 'bg-sgs-surface-secondary',
  dark: 'bg-sgs-blue-950 text-sgs-text-inverse',
}

export default function Section({
  id,
  children,
  className,
  variant = 'default',
  'data-testid': testId,
}: SectionProps) {
  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('py-16 md:py-24', variantStyles[variant], className)}
    >
      <Container>{children}</Container>
    </section>
  )
}
