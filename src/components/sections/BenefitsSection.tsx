'use client'

import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import FeatureCard from '@/components/ui/FeatureCard'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'
import CursorTarget from '@/components/interaction/CursorTarget'
import { benefits } from '@/config/benefits'
import { getIcon } from '@/lib/icons'

export default function BenefitsSection() {
  return (
    <Section id="benefits">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4">
          Por que escolher o SGS?
        </Heading>
      </Reveal>
      <Reveal delay={0.1}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
          Uma plataforma completa para transformar a gestão de Segurança do
          Trabalho da sua empresa com tecnologia, segurança e eficiência.
        </Text>
      </Reveal>
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <Reveal key={benefit.title}>
            <InteractiveSurface tilt="subtle" spotlight="subtle" depth="shallow">
              <CursorTarget type="default">
                <FeatureCard
                  icon={getIcon(benefit.icon)}
                  title={benefit.title}
                  description={benefit.description}
                />
              </CursorTarget>
            </InteractiveSurface>
          </Reveal>
        ))}
      </Stagger>
    </Section>
  )
}
