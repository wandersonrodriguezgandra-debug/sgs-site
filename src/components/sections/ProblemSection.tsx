'use client'

import { ClipboardList, FileText, AlertTriangle, Search } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Stagger from '@/components/motion/Stagger'
import { cn } from '@/lib/utils'

const problems = [
  {
    icon: ClipboardList,
    title: 'Processos manuais',
    description: 'Planilhas e papéis que consomem horas preciosas da sua equipe.',
    tilt: '-rotate-2',
    offset: 'md:translate-y-4',
  },
  {
    icon: FileText,
    title: 'Documentos dispersos',
    description: 'Documentos espalhados em pastas, e-mails e drives sem organização.',
    tilt: 'md:rotate-1',
    offset: '',
  },
  {
    icon: AlertTriangle,
    title: 'Riscos não identificados',
    description: 'Perigos ocupacionais sem registro ou monitoramento adequado.',
    tilt: '-md:rotate-1',
    offset: 'md:translate-y-6',
  },
  {
    icon: Search,
    title: 'Auditorias complicadas',
    description: 'Preparar auditorias exige horas de busca por documentos e registros.',
    tilt: 'md:rotate-2',
    offset: 'md:-translate-y-1',
  },
]

export default function ProblemSection() {
  return (
    <Section id="problema" variant="muted" data-testid="problem-section">
      <Heading size="h2" align="center" className="mb-4">
        Gestão de segurança ainda no papel?
      </Heading>
      <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
        Planilhas, documentos desatualizados, falta de controle &mdash; sua equipe
        perde tempo com processos manuais enquanto riscos reais ficam sem
        monitoramento.
      </Text>
      <Stagger className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {problems.map((problem) => {
          const Icon = problem.icon
          return (
            <div
              key={problem.title}
              data-testid={`problem-card-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'relative p-6 rounded-xl border border-sgs-border bg-sgs-surface',
                'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                problem.tilt,
                problem.offset,
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
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
