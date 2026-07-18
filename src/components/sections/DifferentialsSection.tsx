'use client'

import {
  LayoutDashboard, Palette, Puzzle, Cloud,
  FileText, Zap, Bell, History,
} from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'

const differentials = [
  {
    icon: <LayoutDashboard size={28} />,
    title: 'Plataforma criada para SST',
    description: 'Desenvolvida exclusivamente para Segurança do Trabalho, com funcionalidades que realmente fazem diferença no dia a dia.',
  },
  {
    icon: <Palette size={28} />,
    title: 'Interface intuitiva',
    description: 'Experiência do usuário pensada para facilitar o uso, com navegação simples e design limpo.',
  },
  {
    icon: <Puzzle size={28} />,
    title: 'Módulos integrados',
    description: 'Todos os módulos se comunicam entre si, eliminando retrabalho e garantindo consistência dos dados.',
  },
  {
    icon: <Cloud size={28} />,
    title: '100% na nuvem',
    description: 'Acesse de qualquer lugar, a qualquer hora, sem necessidade de instalação ou manutenção de servidores.',
  },
  {
    icon: <FileText size={28} />,
    title: 'Relatórios profissionais',
    description: 'Relatórios completos e personalizáveis que transformam dados em insights para tomada de decisão.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Automação de processos',
    description: 'Automatize tarefas repetitivas, notificações e lembretes para aumentar a produtividade da equipe.',
  },
  {
    icon: <Bell size={28} />,
    title: 'Alertas inteligentes',
    description: 'Notificações proativas sobre prazos, vencimentos e eventos importantes para nunca perder nada.',
  },
  {
    icon: <History size={28} />,
    title: 'Histórico completo',
    description: 'Registro detalhado de todas as atividades para consultas, auditorias e conformidade regulatória.',
  },
]

export default function DifferentialsSection() {
  return (
    <Section id="diferenciais" variant="muted">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4">
          Nossos diferenciais
        </Heading>
      </Reveal>
      <Reveal delay={0.1}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center">
          O que nos torna a escolha certa para a gestão de Segurança do Trabalho
          da sua empresa.
        </Text>
      </Reveal>

      <Stagger className="grid md:grid-cols-2 gap-6">
        {differentials.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.05}>
            <InteractiveSurface tilt="subtle" spotlight="subtle" depth="shallow">
              <div className="flex gap-5 p-6 rounded-xl bg-sgs-surface border border-sgs-border hover:shadow-lg hover:border-sgs-accent/20 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-sgs-blue-50 flex items-center justify-center text-sgs-accent shrink-0 group-hover:bg-sgs-accent group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-sgs-text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-sgs-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </InteractiveSurface>
          </Reveal>
        ))}
      </Stagger>
    </Section>
  )
}
