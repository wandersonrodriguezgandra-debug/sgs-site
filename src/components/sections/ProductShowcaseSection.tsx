'use client'

import { m } from 'framer-motion'
import { MonitorSmartphone, Radio, ScanLine } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Reveal from '@/components/motion/Reveal'
import ParallaxLayer from '@/components/motion/ParallaxLayer'

export default function ProductShowcaseSection() {
  const reduced = useReducedMotion()

  return (
    <Section
      id="experiencia"
      className="relative overflow-hidden bg-gradient-to-br from-sgs-blue-50 via-white to-cyan-50 !py-24 md:!py-32"
      data-testid="product-showcase-section"
    >
      <div className="sgs-light-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-24 top-8 h-80 w-80 rounded-full bg-sgs-blue-100/70 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sgs-cyan/10 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div className="space-y-7">
          <Reveal direction="right" distance={42} delay={0.08} duration={0.9}>
            <Heading size="h2" className="max-w-xl !text-3xl !leading-[1.08] text-sgs-blue-950 md:!text-5xl">
              O SGS acompanha sua operação em qualquer lugar
            </Heading>
          </Reveal>

          <Reveal direction="right" distance={36} delay={0.16} duration={0.8}>
            <Text size="lg" className="max-w-xl text-sgs-text-secondary">
              Do escritório ao campo, a experiência continua clara, rápida e conectada.
              Cada decisão chega à equipe certa sem perder contexto.
            </Text>
          </Reveal>
        </div>

        <Reveal direction="left" distance={58} delay={0.12} duration={1}>
          <ParallaxLayer speed={20} reversed>
            <div className="relative py-8 sm:px-8">
              <m.div
                className="absolute inset-[12%] rounded-full bg-sgs-accent/20 blur-3xl"
                animate={reduced ? undefined : { scale: [0.9, 1.16, 0.9], opacity: [0.28, 0.55, 0.28] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />

              <div className="sgs-showcase-orbit absolute inset-[5%] rounded-full border border-dashed border-sgs-accent/20" aria-hidden="true" />

              <m.div
                data-showcase-card
                initial={reduced ? undefined : { opacity: 0, scale: 0.88, rotateY: -14, x: 56 }}
                whileInView={reduced ? undefined : { opacity: 1, scale: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.15, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                style={{ perspective: 1400, transformStyle: 'preserve-3d' }}
                className="sgs-showcase-sheen group relative overflow-hidden rounded-[1.75rem] border border-sgs-blue-100 bg-white p-2 shadow-[0_35px_90px_rgba(0,61,128,0.22)] transition-transform duration-700 hover:-translate-y-2 hover:rotate-[0.4deg]"
              >
                <div className="sgs-showcase-scanline pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-sgs-cyan-light to-transparent" aria-hidden="true" />
                <div className="flex items-center justify-between border-b border-sgs-blue-100 px-4 py-3">
                  <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sgs-text-tertiary">SGS conectado</span>
              </div>
              <ImageWithFallback
                src="/images/product/sgs-responsive.webp"
                alt="SGS exibido em notebook, tablet e celular"
                className="aspect-[16/9] w-full rounded-b-[1.35rem] object-cover"
                  decoding="async"
                />
              </m.div>

              <m.div
                className="sgs-showcase-float absolute -left-2 top-1/4 hidden items-center gap-2 rounded-2xl border border-sgs-blue-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur md:flex"
                initial={reduced ? undefined : { opacity: 0, x: -24 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
              >
                <MonitorSmartphone className="h-5 w-5 text-sgs-accent" />
                <div>
                  <div className="text-xs font-bold text-sgs-blue-950">Responsivo</div>
                  <div className="text-[10px] text-sgs-text-tertiary">qualquer dispositivo</div>
                </div>
              </m.div>

              <m.div
                className="sgs-showcase-float-reverse absolute -right-1 bottom-1/4 hidden items-center gap-2 rounded-2xl border border-sgs-cyan/20 bg-white/95 px-4 py-3 shadow-xl backdrop-blur sm:flex"
                initial={reduced ? undefined : { opacity: 0, x: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, delay: 0.58, ease: 'easeOut' }}
              >
                <Radio className="h-5 w-5 text-sgs-success" />
                <div>
                  <div className="text-xs font-bold text-sgs-blue-950">Ao vivo</div>
                  <div className="text-[10px] text-sgs-text-tertiary">dados sincronizados</div>
                </div>
              </m.div>

              <m.div
                className="sgs-showcase-float absolute right-[12%] top-[6%] hidden h-11 w-11 items-center justify-center rounded-full bg-sgs-accent text-white shadow-xl shadow-sgs-accent/30 lg:flex"
                initial={reduced ? undefined : { opacity: 0, scale: 0.5, rotate: -30 }}
                whileInView={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.75, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <ScanLine className="h-5 w-5" />
              </m.div>
            </div>
          </ParallaxLayer>
        </Reveal>
      </div>

    </Section>
  )
}
