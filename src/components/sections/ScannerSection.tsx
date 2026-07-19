'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, FileWarning, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { motionTokens } from '@/components/motion/tokens'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import Reveal from '@/components/motion/Reveal'
import { shouldPin } from '@/lib/scanner-pin'

const stages = [
  {
    number: '01',
    title: 'Detectar',
    description: 'O sistema identifica o risco assim que ele é registrado em campo.',
    icon: FileWarning,
    item: { label: 'APR próxima do vencimento', context: 'Obra Norte · vence amanhã', tone: 'warning' as const },
  },
  {
    number: '02',
    title: 'Classificar',
    description: 'Criticidade e prioridade de resposta são definidas automaticamente.',
    icon: AlertTriangle,
    item: { label: 'Inspeção com ação pendente', context: 'Área de manutenção · alta prioridade', tone: 'critical' as const },
  },
  {
    number: '03',
    title: 'Agir',
    description: 'Responsável, prazo e medida de controle ficam associados ao risco.',
    icon: UserRoundCheck,
    item: { label: 'Treinamento atualizado', context: 'Equipe operacional · evidência anexada', tone: 'safe' as const },
  },
  {
    number: '04',
    title: 'Comprovar',
    description: 'Documentos e histórico consolidam a evidência para auditoria.',
    icon: ShieldCheck,
    item: { label: 'DDS aguardando assinatura', context: 'Turno B · responsável notificado', tone: 'info' as const },
  },
]

const toneStyles = {
  warning: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-300',
  critical: 'border-red-400/25 bg-red-400/[0.08] text-red-300',
  safe: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300',
  info: 'border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300',
}

function StageCard({ stage }: { stage: (typeof stages)[number] }) {
  const Icon = stage.icon
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${toneStyles[stage.item.tone]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white sm:text-base">{stage.item.label}</p>
        <p className="mt-1 truncate text-xs text-white/45 sm:text-sm">{stage.item.context}</p>
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-sgs-blue-100 px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sgs-text-tertiary">Cockpit SST</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sgs-success">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Auditável
        </span>
      </div>
      <ImageWithFallback
        src="/images/product/cockpit-sst.webp"
        alt="Cockpit SST do SGS com os riscos já tratados e documentados"
        className="aspect-[4/3] w-full object-cover"
        decoding="async"
      />
    </div>
  )
}

function StaticStages() {
  return (
    <section className="relative bg-sgs-blue-950 py-24 text-white md:py-32">
      <div className="container-sgs">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-sgs-blue-200">
            Da observação à evidência
          </p>
          <h2 className="max-w-xl font-heading text-3xl font-bold leading-[1.08] text-white md:text-5xl">
            Veja o que exige atenção antes de abrir cinco planilhas.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {stages.map((stage) => (
            <Reveal key={stage.number} distance={motionTokens.distance.medium}>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-sgs-blue-200">
                  {stage.number} · {stage.title}
                </p>
                <p className="mb-3 max-w-lg text-sm leading-relaxed text-white/60">{stage.description}</p>
                <StageCard stage={stage} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal distance={motionTokens.distance.medium}>
          <div className="mt-10 max-w-md">
            <DashboardPreview />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function PinnedScanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRefs = useRef<Array<HTMLDivElement | null>>([])
  const dashboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const dashboard = dashboardRef.current
    if (!section || !dashboard) return

    const ctx = gsap.context(() => {
      const cardEls = stageRefs.current.filter((el): el is HTMLDivElement => el !== null)
      gsap.set(cardEls, { autoAlpha: 0, y: motionTokens.distance.dramatic })
      gsap.set(dashboard, { autoAlpha: 0, scale: 1.04 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=220%',
          scrub: motionTokens.scanner.scrub,
          pin: true,
          onEnter: () => gsap.set(cardEls, { willChange: 'transform, opacity' }),
          onLeaveBack: () => gsap.set(cardEls, { willChange: 'auto' }),
          onLeave: () => gsap.set(cardEls, { willChange: 'auto' }),
        },
      })

      cardEls.forEach((el, index) => {
        timeline.to(el, { autoAlpha: 1, y: 0, ease: motionTokens.gsapEase.expo, duration: 1 }, index === 0 ? 0 : '>-0.15')
        if (index > 0) {
          timeline.to(cardEls[index - 1], { autoAlpha: 0.35, ease: motionTokens.gsapEase.power2, duration: 0.6 }, '<')
        }
      })

      timeline.to(dashboard, { autoAlpha: 1, scale: 1, ease: motionTokens.gsapEase.expo, duration: 1.2 }, '>-0.1')
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen items-center overflow-hidden bg-sgs-blue-950 text-white"
    >
        <div className="sgs-dark-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="container-sgs relative z-10 grid items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-sgs-blue-200">
              Da observação à evidência
            </p>
            <h2 className="max-w-xl font-heading text-3xl font-bold leading-[1.08] text-white md:text-5xl">
              Veja o que exige atenção antes de abrir cinco planilhas.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
              Detectar, classificar, agir e comprovar — o ciclo operacional que o SGS
              conduz do registro em campo até a evidência auditável.
            </p>
          </div>

          <div className="relative h-[26rem]">
            {stages.map((stage, index) => (
              <div
                key={stage.number}
                ref={(el) => { stageRefs.current[index] = el }}
                className="absolute inset-x-0 top-0"
                style={{ top: `${index * 6.5}rem` }}
              >
                <StageCard stage={stage} />
              </div>
            ))}

            <div ref={dashboardRef} className="absolute inset-x-0 bottom-0 max-w-md">
              <DashboardPreview />
            </div>
          </div>
        </div>
    </section>
  )
}

export default function ScannerSection() {
  const [pinned, setPinned] = useState(shouldPin)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setPinned(shouldPin())
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return pinned ? <PinnedScanner /> : <StaticStages />
}
