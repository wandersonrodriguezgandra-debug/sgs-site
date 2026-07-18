'use client'

import {
  BarChart3, Users, FileText, Bell,
} from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Reveal from '@/components/motion/Reveal'
import ParallaxLayer from '@/components/motion/ParallaxLayer'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'

const features = [
  { icon: <BarChart3 size={20} />, text: 'Indicadores em tempo real' },
  { icon: <Users size={20} />, text: 'Gestão de colaboradores' },
  { icon: <FileText size={20} />, text: 'Documentos centralizados' },
  { icon: <Bell size={20} />, text: 'Alertas de vencimentos' },
]

export default function DashboardSection() {
  return (
    <Section id="dashboard" className="!py-24 md:!py-32" data-through-screen="true">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="left">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-sgs-blue-100 bg-sgs-blue-50 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-sgs-accent">
              Cockpit SST
            </div>
            <Heading size="h2" className="!text-3xl !leading-[1.08] md:!text-5xl">
              O dia começa com a prioridade certa.
            </Heading>
            <Text size="lg">
              O dashboard reúne o que venceu, o que está em risco e o que precisa
              de ação hoje. Menos tempo procurando dados; mais tempo conduzindo a operação.
            </Text>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feat) => (
                <div key={feat.text} className="flex items-center gap-3 text-sm text-sgs-text-primary">
                  <span className="text-sgs-accent shrink-0">{feat.icon}</span>
                  {feat.text}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15} duration={1} distance={80}>
          <ParallaxLayer speed={24} reversed>
            <InteractiveSurface tilt="high" spotlight="medium" glare depth="deep">
                <div
                  className="overflow-hidden rounded-2xl border border-sgs-blue-100 bg-white shadow-[0_28px_80px_rgba(0,61,128,0.2)]"
                  data-testid="dashboard-product-image"
                >
                  <div className="flex items-center justify-between border-b border-sgs-blue-100 px-5 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sgs-text-tertiary">
                      Cockpit SST
                    </span>
                  </div>

                  <div className="sgs-showcase-sheen group relative overflow-hidden">
                    <ImageWithFallback
                      src="/images/product/cockpit-sst.webp"
                      alt="Cockpit SST do SGS exibido em um monitor"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.045]"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sgs-blue-950/20 via-transparent to-white/10" aria-hidden="true" />

                    <div className="sgs-showcase-float absolute bottom-5 left-5 rounded-xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">
                      <div className="flex items-center gap-2 text-xs font-bold text-sgs-success">
                        <span className="h-2 w-2 rounded-full bg-sgs-success animate-pulse" />
                        Operação acompanhada em tempo real
                      </div>
                    </div>

                    <div className="sgs-showcase-float-reverse absolute right-5 top-5 rounded-xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md">
                      <div className="text-[10px] uppercase tracking-wider text-sgs-text-tertiary">Visão consolidada</div>
                      <div className="text-lg font-bold text-sgs-blue-950">100% integrada</div>
                    </div>
                  </div>
                </div>
            </InteractiveSurface>
          </ParallaxLayer>
        </Reveal>
      </div>
    </Section>
  )
}
