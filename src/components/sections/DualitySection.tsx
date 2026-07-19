'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, CircleOff, FileWarning, ShieldCheck, Timer, Zap } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import ChapterMark from '@/components/ui/ChapterMark'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const without = [
  { icon: CircleOff, text: 'DDS, APR e inspeções vivem em arquivos separados.' },
  { icon: FileWarning, text: 'Prazos e responsáveis ficam desconectados do risco.' },
  { icon: AlertTriangle, text: 'A prioridade real só aparece quando já é tarde.' },
]

const withSgs = [
  { icon: Zap, text: 'Cada registro chega já com contexto e responsável.' },
  { icon: Timer, text: 'Prazos e evidências permanecem no mesmo fluxo.' },
  { icon: ShieldCheck, text: 'A criticidade é visível antes de virar urgência.' },
]

export default function DualitySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    const divider = dividerRef.current
    if (!section || !divider || reduced) return

    let ctx: { revert: () => void } | undefined
    let disposed = false

    void import('@/lib/gsap').then(({ gsap }) => {
      if (disposed) return
      ctx = gsap.context(() => {
        gsap.fromTo(
          divider,
          { opacity: 0, scaleY: 0.6 },
          {
            opacity: 1,
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 0.5,
            },
          },
        )
      }, section)
    })

    return () => {
      disposed = true
      ctx?.revert()
    }
  }, [reduced])

  return (
    <Section
      id="duality"
      variant="dark"
      className="relative overflow-hidden !py-24 md:!py-32"
      data-testid="duality-section"
    >
      <section ref={sectionRef} className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <ChapterMark number="02" label="Contraste" tone="dark" />
          <Heading size="h2" align="center" className="mb-4 !text-3xl !leading-[1.08] !text-white md:!text-5xl">
            A mesma operação, dois cenários possíveis.
          </Heading>
          <Text size="lg" className="mx-auto max-w-xl text-center !text-white/60">
            O risco não muda. O que muda é se alguém enxerga a tempo de agir.
          </Text>
        </div>

        <div className="relative mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 md:grid-cols-2">
          <div
            ref={dividerRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sgs-cyan/70 to-transparent md:block"
          />

          <div className="bg-sgs-blue-950 p-8 md:p-10" data-testid="duality-without">
            <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              Sem o SGS
            </p>
            <ul className="space-y-5">
              {without.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-white/50">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/30" aria-hidden="true" />
                  <span className="text-sm leading-relaxed sm:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-sgs-blue-900 to-sgs-blue-950 p-8 md:p-10" data-testid="duality-with">
            <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-sgs-cyan">
              Com o SGS
            </p>
            <ul className="space-y-5">
              {withSgs.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-white">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sgs-cyan" aria-hidden="true" />
                  <span className="text-sm leading-relaxed sm:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Section>
  )
}
