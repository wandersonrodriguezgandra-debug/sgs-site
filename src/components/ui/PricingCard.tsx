import { m } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Plan } from '@/types'

interface PricingCardProps {
  plan: Plan
  index: number
  className?: string
}

export default function PricingCard({ plan, index, className }: PricingCardProps) {
  return (
    <m.div
      className={cn(
        'sgs-pricing-card relative h-full',
        plan.highlighted && 'md:scale-105 z-10',
        className
      )}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotateX: 1.5, rotateY: plan.highlighted ? 0 : index % 2 === 0 ? -1.2 : 1.2 }}
      style={{ transformPerspective: 900 }}
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
    </m.div>
  )
}
