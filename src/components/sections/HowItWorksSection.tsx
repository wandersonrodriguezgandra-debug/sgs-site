'use client'

import { m } from 'framer-motion'
import { ArrowDown, CheckCircle2 } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'
import { steps } from '@/config/steps'

export default function HowItWorksSection() {
  return (
    <Section
      id="how-it-works"
      variant="muted"
      className="relative overflow-hidden !py-24 md:!py-32"
      data-testid="how-it-works-section"
    >
      <div className="sgs-light-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="sgs-how-works-orbit pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full border border-sgs-cyan/15" aria-hidden="true" />

      <div className="relative z-10 grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <Reveal direction="left" distance={48}>
          <div className="lg:sticky lg:top-24">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sgs-blue-100 bg-white px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-sgs-accent shadow-sm">
              Fluxo de implantação
            </div>
            <Heading size="h2" className="max-w-lg !text-3xl md:!text-5xl md:!leading-[1.08]">
              Da configuração à decisão, sem labirinto.
            </Heading>
            <Text size="lg" className="mt-6 max-w-md">
              O SGS organiza a implantação em uma sequência simples. Cada etapa
              prepara a próxima e mantém equipe, documentos e indicadores no mesmo fluxo.
            </Text>

            <div className="mt-8 hidden items-center gap-3 text-sm font-semibold text-sgs-accent lg:flex">
              Acompanhe a sequência
              <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
            </div>
          </div>
        </Reveal>

        <Stagger className="sgs-how-works-list relative space-y-4" staggerDelay={0.08}>
          {steps.map((step, index) => (
            <m.article
              key={step.number}
              className="sgs-step-card group relative overflow-hidden rounded-2xl border border-sgs-blue-100 bg-white p-6 shadow-[0_18px_50px_rgba(7,26,51,0.06)] transition-[border-color,box-shadow] duration-500 hover:border-sgs-blue-300 hover:shadow-[0_26px_70px_rgba(0,86,179,0.12)] sm:p-7"
              whileHover={{ y: -6, rotateX: 1.5, rotateY: index % 2 === 0 ? -1.2 : 1.2 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              style={{ transformPerspective: 900 }}
            >
              <div className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-gradient-to-b from-sgs-cyan to-sgs-accent transition-transform duration-500 group-hover:scale-y-100" aria-hidden="true" />
              <div className="sgs-step-progress absolute left-0 top-1/2 h-px w-8 -translate-x-full bg-gradient-to-r from-transparent to-sgs-cyan" aria-hidden="true" />
              <div className="flex gap-5 sm:items-center sm:gap-7">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sgs-blue-50 font-mono text-sm font-bold text-sgs-accent transition-colors duration-500 group-hover:bg-sgs-accent group-hover:text-white">
                  {String(step.number).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold text-sgs-text-primary sm:text-xl">
                      {step.title}
                    </h3>
                    {index === steps.length - 1 && (
                      <CheckCircle2 className="hidden h-5 w-5 text-sgs-success sm:block" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-sgs-text-secondary sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </m.article>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
