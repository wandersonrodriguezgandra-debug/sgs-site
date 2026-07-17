'use client'

import { ClipboardList, FileText, AlertTriangle, Search } from 'lucide-react'
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
    tilt: '-rotate-2',
    offset: 'md:translate-y-4',
    severity: 'critical' as const,
  },
  {
    icon: FileText,
    title: 'Documentos dispersos',
    description: 'Documentos espalhados em pastas, e-mails e drives sem organização.',
    tilt: 'md:rotate-1',
    offset: '',
    severity: 'warning' as const,
  },
  {
    icon: AlertTriangle,
    title: 'Riscos não identificados',
    description: 'Perigos ocupacionais sem registro ou monitoramento adequado.',
    tilt: '-md:rotate-1',
    offset: 'md:translate-y-6',
    severity: 'critical' as const,
  },
  {
    icon: Search,
    title: 'Auditorias complicadas',
    description: 'Preparar auditorias exige horas de busca por documentos e registros.',
    tilt: 'md:rotate-2',
    offset: 'md:-translate-y-1',
    severity: 'warning' as const,
  },
]

const severityStyles = {
  critical: {
    iconBg: 'bg-red-50 dark:bg-red-950/30',
    iconColor: 'text-red-500',
    border: 'border-red-200/50 dark:border-red-800/30',
    glow: 'hover:shadow-[0_0_20px_rgba(220,38,38,0.1)]',
  },
  warning: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/30',
    iconColor: 'text-amber-500',
    border: 'border-amber-200/50 dark:border-amber-800/30',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]',
  },
}

export default function ProblemSection() {
  return (
    <Section id="problema" variant="muted" data-testid="problem-section">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4">
          Gestão de segurança ainda no papel?
        </Heading>
      </Reveal>
      <BlurReveal delay={0.1} blur={4}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
          Planilhas, documentos desatualizados, falta de controle &mdash; sua equipe
          perde tempo com processos manuais enquanto riscos reais ficam sem
          monitoramento.
        </Text>
      </BlurReveal>

      {/* Visual indicator: chaos state */}
      <Reveal delay={0.15} className="mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-red-300" />
          <span className="font-mono text-xs tracking-widest uppercase text-red-400">
            Estado atual
          </span>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-red-300" />
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
                'relative p-6 rounded-xl border bg-sgs-surface',
                'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                styles.border,
                styles.glow,
                problem.tilt,
                problem.offset,
              )}
            >
              {/* Severity indicator dot */}
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
                <div>
                  <h3 className="font-heading text-lg font-semibold text-sgs-text-primary mb-1">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-sgs-text-secondary leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </Stagger>
    </Section>
  )
}
