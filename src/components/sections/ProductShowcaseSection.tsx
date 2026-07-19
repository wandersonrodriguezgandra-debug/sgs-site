import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import Reveal from '@/components/motion/Reveal'
import ParallaxLayer from '@/components/motion/ParallaxLayer'

export default function ProductShowcaseSection() {
  return (
    <Section
      id="experiencia"
      className="relative overflow-hidden bg-gradient-to-br from-sgs-blue-50 via-white to-cyan-50 !py-24 md:!py-32"
      data-testid="product-showcase-section"
    >
      <div className="sgs-light-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

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
          <ParallaxLayer reversed>
            <div className="relative py-8 sm:px-8">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-sgs-blue-100 bg-white p-2 shadow-[0_35px_90px_rgba(0,61,128,0.22)]">
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
              </div>
            </div>
          </ParallaxLayer>
        </Reveal>
      </div>
    </Section>
  )
}
