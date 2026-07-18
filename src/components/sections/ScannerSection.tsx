'use client'

import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Clock3, FileWarning, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Reveal from '@/components/motion/Reveal'
import ParallaxLayer from '@/components/motion/ParallaxLayer'

const operationalItems = [
  { icon: FileWarning, label: 'APR próxima do vencimento', context: 'Obra Norte · vence amanhã', tone: 'warning' as const },
  { icon: AlertTriangle, label: 'Inspeção com ação pendente', context: 'Área de manutenção · alta prioridade', tone: 'critical' as const },
  { icon: UserRoundCheck, label: 'Treinamento atualizado', context: 'Equipe operacional · evidência anexada', tone: 'safe' as const },
  { icon: Clock3, label: 'DDS aguardando assinatura', context: 'Turno B · responsável notificado', tone: 'info' as const },
]

const toneStyles = {
  warning: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-300',
  critical: 'border-red-400/25 bg-red-400/[0.08] text-red-300',
  safe: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300',
  info: 'border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300',
}

export default function ScannerSection() {
  const reduced = useReducedMotion()
  const [sectionRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.18 })
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (reduced || !isInView) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % operationalItems.length)
    }, 1500)

    return () => window.clearInterval(interval)
  }, [isInView, reduced])

  return (
    <section
      id="scanner"
      ref={sectionRef}
      className="relative overflow-hidden bg-sgs-blue-950 py-24 text-white md:py-32"
    >
      <div className="sgs-dark-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-sgs-cyan/10 blur-3xl" aria-hidden="true" />
      <div className="sgs-scanner-signal pointer-events-none absolute left-[12%] top-24 h-2 w-2 rounded-full bg-sgs-cyan" aria-hidden="true" />
      <div className="sgs-scanner-signal sgs-scanner-signal-delay pointer-events-none absolute left-[28%] bottom-32 h-1.5 w-1.5 rounded-full bg-sgs-accent-light" aria-hidden="true" />

      <div className="container-sgs relative z-10 grid items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <Reveal direction="left" distance={58}>
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sgs-cyan/20 bg-sgs-cyan/[0.07] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-sgs-cyan">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sgs-cyan" />
              Visão operacional
            </div>
            <h2 className="max-w-xl font-heading text-3xl font-bold leading-[1.08] text-white md:text-5xl">
              Veja o que exige atenção antes de abrir cinco planilhas.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
              O painel reúne prazo, prioridade, local e responsável para transformar
              pendências soltas em uma fila de trabalho objetiva.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {['Prioridade clara', 'Responsável visível', 'Histórico rastreável'].map((label) => (
                <div key={label} className="flex items-center gap-2 text-sm font-medium text-white/75">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-sgs-success-light" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" distance={64} delay={0.1}>
          <ParallaxLayer speed={16} reversed>
            <div className="sgs-scanner-panel relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-2 shadow-[0_40px_120px_rgba(0,0,0,0.36)] backdrop-blur-sm">
              <div className="sgs-scanner-scanline pointer-events-none absolute inset-x-8 top-8 z-10 h-px bg-gradient-to-r from-transparent via-sgs-cyan to-transparent" aria-hidden="true" />
            <div className="rounded-[1.35rem] border border-white/[0.07] bg-[#08172c]/90 p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sgs-cyan">Fila operacional</p>
                  <p className="mt-1 font-heading text-lg font-semibold text-white">Ações prioritárias</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Atualizado agora
                </div>
              </div>

              <div className="relative space-y-3">
                <div
                  className="pointer-events-none absolute -inset-x-3 h-24 rounded-2xl border border-sgs-cyan/20 bg-sgs-cyan/[0.035] shadow-[0_0_38px_rgba(6,182,212,0.08)] transition-transform duration-700 ease-out"
                  style={{ transform: `translateY(${activeIndex * 108}px)` }}
                  aria-hidden="true"
                />

                {operationalItems.map((item, index) => {
                  const Icon = item.icon
                  const active = index === activeIndex
                  return (
                    <m.div
                      key={item.label}
                      className={`relative flex min-h-24 items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-500 ${
                        active ? 'border-white/15 bg-white/[0.07]' : 'border-white/[0.06] bg-white/[0.025] opacity-65'
                      }`}
                      animate={{ x: active ? 5 : 0, scale: active ? 1.012 : 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${toneStyles[item.tone]}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white sm:text-base">{item.label}</p>
                        <p className="mt-1 truncate text-xs text-white/45 sm:text-sm">{item.context}</p>
                      </div>
                      <span className={`hidden h-2.5 w-2.5 shrink-0 rounded-full sm:block ${active ? 'bg-sgs-cyan shadow-[0_0_14px_rgba(6,182,212,0.8)]' : 'bg-white/15'}`} />
                    </m.div>
                  )
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-xs text-white/35">Interface ilustrativa do fluxo operacional</span>
                <div className="flex gap-1.5" aria-label={`Item ${activeIndex + 1} de ${operationalItems.length}`}>
                  {operationalItems.map((item, index) => (
                    <span key={item.label} className={`h-1.5 rounded-full transition-all duration-500 ${index === activeIndex ? 'w-7 bg-sgs-cyan' : 'w-1.5 bg-white/15'}`} />
                  ))}
                </div>
              </div>
            </div>
            </div>
          </ParallaxLayer>
        </Reveal>
      </div>
    </section>
  )
}
