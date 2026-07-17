'use client'

import { ClipboardList, FileText, AlertTriangle, Search, X, TrendingDown } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Stagger from '@/components/motion/Stagger'
import Reveal from '@/components/motion/Reveal'
import BlurReveal from '@/components/motion/BlurReveal'
import { cn } from '@/lib/utils'

const problems = [
  {
    icon: ClipboardList,
    title: 'Processos manuais',
    description: 'Planilhas e papéis que consomem horas preciosas da sua equipe.',
    stat: '15h/mês',
    statLabel: 'perdidas por semana',
    tilt: '-rotate-2',
    offset: 'md:translate-y-4',
    severity: 'critical' as const,
  },
  {
    icon: FileText,
    title: 'Documentos dispersos',
    description: 'Documentos espalhados em pastas, e-mails e drives sem organização.',
    stat: '40%',
    statLabel: 'dos documentos perdidos',
    tilt: 'md:rotate-1',
    offset: '',
    severity: 'warning' as const,
  },
  {
    icon: AlertTriangle,
    title: 'Riscos não identificados',
    description: 'Perigos ocupacionais sem registro ou monitoramento adequado.',
    stat: '73%',
    statLabel: 'dos acidentes evitáveis',
    tilt: '-md:rotate-1',
    offset: 'md:translate-y-6',
    severity: 'critical' as const,
  },
  {
    icon: Search,
    title: 'Auditorias complicadas',
    description: 'Preparar auditorias exige horas de busca por documentos e registros.',
    stat: '3 dias',
    statLabel: 'de preparação',
    tilt: 'md:rotate-2',
    offset: 'md:-translate-y-1',
    severity: 'warning' as const,
  },
]

const severityStyles = {
  critical: {
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    border: 'border-red-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]',
    statColor: 'text-red-400',
  },
  warning: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    statColor: 'text-amber-400',
  },
}

export default function ProblemSection() {
  return (
    <Section id="problema" variant="muted" data-testid="problem-section" className="relative overflow-hidden">
      {/* Background chaos visualization */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Scattered lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="10" y1="20" x2="35" y2="25" stroke="#dc2626" strokeWidth="0.3" />
          <line x1="60" y1="15" x2="85" y2="30" stroke="#f59e0b" strokeWidth="0.3" />
          <line x1="20" y1="70" x2="50" y2="65" stroke="#dc2626" strokeWidth="0.3" />
          <line x1="70" y1="60" x2="90" y2="75" stroke="#f59e0b" strokeWidth="0.3" />
          <line x1="5" y1="45" x2="30" y2="50" stroke="#dc2626" strokeWidth="0.3" />
          <line x1="55" y1="40" x2="80" y2="45" stroke="#f59e0b" strokeWidth="0.3" />
        </svg>
      </div>

      <Reveal>
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingDown className="h-5 w-5 text-sgs-danger" />
          <span className="font-mono text-xs tracking-widest uppercase text-sgs-danger/80">
            O problema
          </span>
        </div>
        <Heading size="h2" align="center" className="mb-4">
          Gestão de segurança ainda no papel?
        </Heading>
      </Reveal>
      <BlurReveal delay={0.1} blur={4}>
        <Text size="lg" className="mb-8 max-w-2xl mx-auto text-center">
          Planilhas, documentos desatualizados, falta de controle &mdash; sua equipe
          perde tempo com processos manuais enquanto riscos reais ficam sem
          monitoramento.
        </Text>
      </BlurReveal>

      {/* Impact stats */}
      <Reveal delay={0.15} className="mb-12">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {[
            { value: '15h', label: 'perdidas por semana', color: '#dc2626' },
            { value: '40%', label: 'documentos perdidos', color: '#f59e0b' },
            { value: '73%', label: 'acidentes evitáveis', color: '#dc2626' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold font-heading" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-sgs-text-tertiary mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Stagger className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto" staggerDelay={0.1}>
        {problems.map((problem) => {
          const Icon = problem.icon
          const styles = severityStyles[problem.severity]
          return (
            <div
              key={problem.title}
              data-testid={`problem-card-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'relative p-6 rounded-xl border bg-sgs-surface group',
                'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                styles.border,
                styles.glow,
                problem.tilt,
                problem.offset,
              )}
            >
              {/* Severity dot */}
              <div className="absolute top-3 right-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  problem.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                )} />
              </div>

              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                  styles.iconBg,
                  styles.iconColor,
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-sgs-text-primary mb-1">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-sgs-text-secondary leading-relaxed">
                    {problem.description}
                  </p>
                  {/* Impact stat */}
                  <div className="mt-3 flex items-center gap-2">
                    <X className="h-3 w-3 text-sgs-danger" />
                    <span className={cn('text-sm font-bold', styles.statColor)}>
                      {problem.stat}
                    </span>
                    <span className="text-xs text-sgs-text-tertiary">
                      {problem.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </Stagger>
    </Section>
  )
}
