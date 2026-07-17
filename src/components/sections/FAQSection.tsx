'use client'

import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Accordion from '@/components/ui/Accordion'
import Reveal from '@/components/motion/Reveal'
import { faqItems } from '@/config/faq'

export default function FAQSection() {
  const accordionItems = faqItems.map((item, index) => ({
    id: `faq-${index}`,
    title: item.question,
    content: item.answer,
  }))

  return (
    <Section id="faq" data-testid="faq-section">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4">
          Perguntas frequentes
        </Heading>
      </Reveal>
      <Reveal delay={0.1}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
          Tire suas principais dúvidas sobre o SGS.
        </Text>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="max-w-3xl mx-auto">
          <Accordion items={accordionItems} />
        </div>
      </Reveal>
    </Section>
  )
}
