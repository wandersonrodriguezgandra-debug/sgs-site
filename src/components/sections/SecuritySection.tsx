'use client'

import { Shield, Lock, Database, FileSearch } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Card from '@/components/ui/Card'
import Reveal from '@/components/motion/Reveal'
import BlurReveal from '@/components/motion/BlurReveal'
import Stagger from '@/components/motion/Stagger'
import ParallaxLayer from '@/components/motion/ParallaxLayer'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import ChapterMark from '@/components/ui/ChapterMark'

const securityFeatures = [
  {
    icon: <Lock size={24} />,
    title: 'Controle de acesso',
    description: 'Perfis configuráveis ajudam cada pessoa a acessar somente o que faz parte da sua rotina.',
  },
  {
    icon: <Database size={24} />,
    title: 'Registros e auditoria',
    description: 'Ações, responsáveis e evidências permanecem conectados para consulta e rastreabilidade.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Proteção de dados',
    description: 'A plataforma adota práticas de segurança e privacidade compatíveis com dados de SST.',
  },
  {
    icon: <FileSearch size={24} />,
    title: 'Acompanhamento',
    description: 'Eventos relevantes ficam visíveis para apoiar verificação, suporte e melhoria contínua.',
  },
]

export default function SecuritySection() {
  return (
    <Section id="security" variant="dark" className="relative overflow-hidden">
      <div className="sgs-dark-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-28 top-1/4 h-[500px] w-[500px] rounded-full bg-sgs-cyan/15 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="mx-auto max-w-2xl text-left">
        <ChapterMark number="05" label="Segurança" tone="dark" />
      </div>

      <Reveal>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-sgs-cyan/50" />
          <Shield className="h-5 w-5 text-sgs-cyan" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-sgs-cyan/50" />
        </div>
        <Heading size="h2" align="center" className="mb-4 !text-3xl !leading-[1.08] !text-white md:!text-5xl">
          Segurança que acompanha o fluxo inteiro
        </Heading>
      </Reveal>
      <BlurReveal delay={0.1} blur={4}>
        <Text size="lg" className="mb-14 max-w-2xl mx-auto text-center text-white/60">
          Sua informação é tratada com responsabilidade. Trabalhamos com as melhores
          práticas de segurança para garantir proteção em cada camada do sistema.
        </Text>
      </BlurReveal>

      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <Reveal direction="left" duration={1} distance={90}>
          <ParallaxLayer speed={16}>
            <InteractiveSurface tilt="high" spotlight="medium" glare depth="deep">
                <div
                  className="sgs-showcase-sheen group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-2 shadow-[0_35px_100px_rgba(0,0,0,0.4)]"
                  data-testid="security-product-image"
                >
                  <ImageWithFallback
                    src="/images/product/sgs-intelligence.webp"
                    alt="Painel do SGS em uma central de segurança com indicadores holográficos"
                    className="aspect-[16/9] w-full rounded-xl object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]"
                    decoding="async"
                  />
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-tr from-sgs-blue-950/25 via-transparent to-sgs-cyan/10" aria-hidden="true" />

                  <div className="sgs-showcase-float absolute left-6 top-6 rounded-xl border border-white/70 bg-white/[0.92] px-4 py-3 shadow-xl backdrop-blur-md">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-sgs-text-tertiary">Governança</div>
                    <div className="text-sm font-bold text-sgs-blue-950">LGPD por padrão</div>
                  </div>

                  <div className="sgs-showcase-float-reverse absolute bottom-6 right-6 flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/[0.92] px-4 py-3 shadow-xl backdrop-blur-md">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-sgs-success">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-sgs-blue-950">Proteção ativa</div>
                      <div className="text-[10px] text-sgs-text-tertiary">rastreabilidade contínua</div>
                    </div>
                  </div>
                </div>
            </InteractiveSurface>
          </ParallaxLayer>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2" staggerDelay={0.09}>
          {securityFeatures.map((feature) => (
            <Reveal key={feature.title} direction="right" distance={40}>
              <InteractiveSurface tilt="medium" spotlight="subtle" depth="shallow" className="h-full">
                <Card className="h-full border-white/10 bg-white/[0.05] shadow-lg backdrop-blur-sm" hover={false}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sgs-cyan/10 text-sgs-cyan">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-heading text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55">
                    {feature.description}
                  </p>
                </Card>
              </InteractiveSurface>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
