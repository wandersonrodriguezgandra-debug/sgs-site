'use client'

import { User } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Card from '@/components/ui/Card'
import Reveal from '@/components/motion/Reveal'

const placeholderTestimonials = [
  {
    name: 'Espaço reservado',
    company: 'Empresa',
    role: 'Profissional',
    content: 'Espaço reservado para depoimento real de cliente.',
  },
  {
    name: 'Espaço reservado',
    company: 'Empresa',
    role: 'Profissional',
    content: 'Espaço reservado para depoimento real de cliente.',
  },
  {
    name: 'Espaço reservado',
    company: 'Empresa',
    role: 'Profissional',
    content: 'Espaço reservado para depoimento real de cliente.',
  },
]

export default function TestimonialsSection() {
  return (
    <Section id="depoimentos" variant="muted" data-testid="testimonials-section">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4">
          O que dizem nossos clientes
        </Heading>
      </Reveal>
      <Reveal delay={0.1}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
          Empresas que confiam no SGS para transformar sua gestão de Segurança
          do Trabalho.
        </Text>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        {placeholderTestimonials.map((testimonial, index) => (
          <Reveal key={index} delay={index * 0.1}>
            <Card className="h-full border-dashed border-sgs-border/60" hover={false}>
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-sgs-surface-tertiary flex items-center justify-center text-sgs-text-tertiary">
                  <User size={32} />
                </div>
                <p className="text-sgs-text-tertiary text-sm italic leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-medium text-sgs-text-primary text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-sgs-text-tertiary">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <p className="text-center text-xs text-sgs-text-tertiary mt-8 italic">
          Espaços reservados para depoimentos reais de clientes.
        </p>
      </Reveal>
    </Section>
  )
}
