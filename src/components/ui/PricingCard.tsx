import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Plan } from '@/types'

interface PricingCardProps {
  plan: Plan
  className?: string
}

export default function PricingCard({ plan, className }: PricingCardProps) {
  return (
    <div
      className={cn(
        'sgs-pricing-card group relative h-full transition-transform duration-200 ease-out hover:-translate-y-1.5',
        plan.highlighted && 'md:scale-105 z-10',
        className
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <Badge variant="info">Mais popular</Badge>
        </div>
      )}
      <Card
        className={cn(
          'flex flex-col h-full',
          plan.highlighted &&
            'border-sgs-accent shadow-lg ring-1 ring-sgs-accent/20'
        )}
        padding="lg"
        hover={false}
      >
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="font-heading text-xl font-bold text-sgs-text-primary">
            {plan.name}
          </h3>
          <p className="text-sgs-text-secondary text-sm">{plan.description}</p>
        </div>

        <ul className="flex flex-col gap-3 mb-8 flex-1" role="list">
          {plan.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-sgs-text-secondary"
            >
              <Check className="h-5 w-5 shrink-0 text-sgs-success mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.highlighted ? 'primary' : 'outline'}
          className="w-full"
        >
          {plan.cta}
        </Button>
      </Card>
    </div>
  )
}
