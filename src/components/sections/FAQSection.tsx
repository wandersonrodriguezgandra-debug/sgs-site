'use client'

import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Accordion from '@/components/ui/Accordion'
import Reveal from '@/components/motion/Reveal'
import ParallaxLayer from '@/components/motion/ParallaxLayer'
import { faqItems } from '@/config/faq'

export default function FAQSection() {
  const accordionItems = faqItems.map((item, index) => ({
    id: `faq-${index}`,
    title: item.question,
    content: item.answer,
  }))

  return (
    <Section id="faq" className="!py-24 md:!py-32" data-testid="faq-section">
      <Reveal>
        <div className="mb-5 text-center">
          <span className="inline-flex rounded-full border border-sgs-blue-100 bg-sgs-blue-50 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-sgs-accent">
            Respostas diretas
          </span>
        </div>
        <Heading size="h2" align="center" className="mb-4 !text-3xl !leading-[1.08] md:!text-5xl">
          O que você precisa saber antes de começar
        </Heading>
      </Reveal>
      <Reveal delay={0.1}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
          Tire suas principais dúvidas sobre o SGS.
        </Text>
      </Reveal>
      <Reveal delay={0.15}>
        <ParallaxLayer speed={8}>
          <div className="sgs-faq-shell mx-auto max-w-3xl rounded-2xl shadow-[0_24px_70px_rgba(7,26,51,0.07)]">
            <div className="sgs-faq-signal" aria-hidden="true" />
            <Accordion items={accordionItems} />
          </div>
        </ParallaxLayer>
      </Reveal>
    </Section>
  )
}
