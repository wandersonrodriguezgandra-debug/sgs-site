'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'

// DADO DEMONSTRATIVO — substituir steps por dados reais

interface StoryStep {
  number: number
  title: string
  description: string
}

interface PinnedStorySectionProps {
  steps: StoryStep[]
  title?: string
  subtitle?: string
  id?: string
  className?: string
}

export default function PinnedStorySection({
  steps,
  title = 'Como funciona',
  subtitle = 'Em poucos passos sua empresa estará com a gestão de SST completa.',
  id = 'how-it-works',
  className,
}: PinnedStorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null!)
  const pinRef = useRef<HTMLDivElement>(null!)
  const activeStepRef = useRef(0)
  const [activeStep, setActiveStep] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || steps.length === 0) return

    let cancelled = false
    let ctxCleanup: (() => void) | null = null

    async function init() {
      const { gsap, ScrollTrigger } = await import('@/lib/gsap')
      if (cancelled) return

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${steps.length * 100}%`,
          pin: pinRef.current,
          pinSpacing: true,
          scrub: 1,
          markers: false,
          onUpdate: (self) => {
            const nextStep = Math.min(
              steps.length - 1,
              Math.floor(self.progress * steps.length),
            )
            if (nextStep !== activeStepRef.current) {
              activeStepRef.current = nextStep
              setActiveStep(nextStep)
            }
          },
        })
      })

      ctxCleanup = () => ctx.revert()
    }

    init()

    return () => {
      cancelled = true
      ctxCleanup?.()
    }
  }, [reduced, steps])

  if (reduced) {
    return (
      <Section id={id} variant="muted" className={className}>
        <Heading size="h2" align="center" className="mb-4">{title}</Heading>
        <Text size="lg" className="mb-16 max-w-2xl mx-auto text-center">{subtitle}</Text>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-sgs-border" />
          <div className="space-y-16">
            {steps.map((step) => (
              <div key={step.number} className="relative pl-14">
                <div className="absolute left-0 top-0 w-11 h-11 rounded-full bg-sgs-accent text-white font-heading font-bold text-sm flex items-center justify-center shadow-md">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-sgs-text-primary mb-2">{step.title}</h3>
                  <p className="text-sgs-text-secondary text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    )
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn('relative bg-sgs-surface-secondary', className)}
    >
      <div ref={pinRef} className="min-h-screen flex items-center py-24">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Heading size="h2">{title}</Heading>
              <Text size="lg">{subtitle}</Text>

              <div className="space-y-6 pt-4">
                {steps.map((step, i) => (
                  <div
                    key={step.number}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-xl transition-all duration-500',
                      i === activeStep
                        ? 'bg-sgs-accent/5 border border-sgs-accent/20'
                        : 'opacity-40',
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-sm transition-colors',
                        i === activeStep
                          ? 'bg-sgs-accent text-white shadow-md'
                          : 'bg-sgs-border text-sgs-text-tertiary',
                      )}
                    >
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-sgs-text-primary">{step.title}</h3>
                      <p className="text-sm text-sgs-text-secondary mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                {steps.map((step, i) => (
                  <div
                    key={step.number}
                    className={cn(
                      'absolute inset-0 flex items-center justify-center transition-all duration-700',
                      i === activeStep
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90 pointer-events-none',
                    )}
                  >
                    <div className="w-64 h-64 rounded-2xl bg-sgs-accent/10 border border-sgs-accent/20 flex items-center justify-center">
                      <span className="text-7xl font-heading font-bold text-sgs-accent/30">
                        {step.number}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
