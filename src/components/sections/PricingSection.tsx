'use client'

import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import PricingCard from '@/components/ui/PricingCard'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'
import { plans } from '@/config/pricing'

export default function PricingSection() {
  return (
    <Section id="pricing" data-testid="pricing-section">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4">
          Planos
        </Heading>
      </Reveal>
      <Reveal delay={0.1}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
          Escolha o plano ideal para o momento da sua empresa. Todos os planos
          incluem suporte e atualizações.
        </Text>
      </Reveal>
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start" staggerDelay={0.12}>
        {plans.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 0.05}>
            <InteractiveSurface
              tilt={plan.highlighted ? 'medium' : 'subtle'}
              spotlight="medium"
              glare
              depth={plan.highlighted ? 'deep' : 'shallow'}
            >
              <PricingCard plan={plan} index={index} />
            </InteractiveSurface>
          </Reveal>
        ))}
      </Stagger>
    </Section>
  )
}
