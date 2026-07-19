'use client'

import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import PricingCard from '@/components/ui/PricingCard'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'
import ParallaxLayer from '@/components/motion/ParallaxLayer'
import { plans } from '@/config/pricing'

export default function PricingSection() {
  return (
    <Section id="pricing" className="!py-24 md:!py-32" data-testid="pricing-section">
      <div className="mb-12 grid items-end gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal direction="left">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-sgs-blue-100 bg-sgs-blue-50 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-sgs-accent">
              Planos modulares
            </div>
            <Heading size="h2" className="!text-3xl !leading-[1.08] md:!text-5xl">
              Comece com o necessário. Evolua sem trocar de plataforma.
            </Heading>
          </div>
        </Reveal>
        <Reveal direction="right" delay={0.08}>
          <Text size="lg" className="max-w-xl lg:ml-auto">
            Quatro formatos para diferentes níveis de complexidade operacional,
            sempre com implantação orientada e espaço para crescimento.
          </Text>
        </Reveal>
      </div>
      <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-sgs-accent md:hidden">
        Deslize para comparar →
      </p>
      <ParallaxLayer speed={10}>
        <Stagger className="sgs-scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4" staggerDelay={0.1}>
          {plans.map((plan) => (
            <div key={plan.name} className="w-[80vw] max-w-sm shrink-0 snap-center md:w-auto md:max-w-none">
              <PricingCard plan={plan} />
            </div>
          ))}
        </Stagger>
      </ParallaxLayer>
    </Section>
  )
}
