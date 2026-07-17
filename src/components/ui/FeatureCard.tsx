import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={cn('group flex flex-col sm:flex-row gap-5 items-start', className)}
      padding="md"
      hover
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sgs-blue-50 text-sgs-accent transition-all duration-300 group-hover:bg-sgs-accent group-hover:text-white group-hover:scale-110 group-hover:shadow-glow">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-semibold text-sgs-text-primary group-hover:text-sgs-accent transition-colors duration-200">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-sgs-text-secondary">
          {description}
        </p>
      </div>
    </Card>
  )
}
