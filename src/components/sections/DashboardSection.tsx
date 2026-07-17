'use client'

import {
  BarChart3, TrendingUp, Users, FileText, Bell, PieChart,
  Download, Filter, Eye,
} from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Card from '@/components/ui/Card'
import Reveal from '@/components/motion/Reveal'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'
import CursorTarget from '@/components/interaction/CursorTarget'
import AnimatedCounter from '@/components/scroll/AnimatedCounter'
import AnimatedChart from '@/components/scroll/AnimatedChart'

// DADO DEMONSTRATIVO — substituir por dados reais do dashboard

const stats = [
  { label: 'Adesão DDS', value: 94, suffix: '%', color: 'var(--color-green-500, #22c55e)' },
  { label: 'Documentos', value: 87, suffix: '%', color: 'var(--color-sgs-accent)' },
  { label: 'Treinamentos', value: 72, suffix: '%', color: 'var(--color-amber-500, #f59e0b)' },
]

const chartBars = [
  { label: 'Jan', value: 65, color: 'var(--color-sgs-accent)' },
  { label: 'Fev', value: 72, color: 'var(--color-sgs-accent)' },
  { label: 'Mar', value: 68, color: 'var(--color-sgs-accent)' },
  { label: 'Abr', value: 80, color: 'var(--color-sgs-accent)' },
  { label: 'Mai', value: 78, color: 'var(--color-sgs-accent)' },
  { label: 'Jun', value: 87, color: 'var(--color-sgs-accent)' },
]

const features = [
  { icon: <BarChart3 size={20} />, text: 'Indicadores em tempo real' },
  { icon: <TrendingUp size={20} />, text: 'Gráficos de evolução' },
  { icon: <Users size={20} />, text: 'Gestão de colaboradores' },
  { icon: <FileText size={20} />, text: 'Documentos centralizados' },
  { icon: <Bell size={20} />, text: 'Alertas de vencimentos' },
  { icon: <PieChart size={20} />, text: 'Relatórios profissionais' },
  { icon: <Download size={20} />, text: 'Exportação de dados' },
  { icon: <Filter size={20} />, text: 'Filtros avançados' },
  { icon: <Eye size={20} />, text: 'Visão consolidada' },
]

export default function DashboardSection() {
  return (
    <Section id="dashboard" data-through-screen="true">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <Reveal direction="left">
          <div className="space-y-6">
            <Heading size="h2">
              Conheça o painel do SGS
            </Heading>
            <Text size="lg">
              Tenha uma visão completa e em tempo real de todos os indicadores
              de Segurança do Trabalho da sua empresa. O dashboard do SGS
              centraliza informações, facilita a tomada de decisão e mantém sua
              equipe alinhada.
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

        <Reveal direction="right" delay={0.15}>
          <InteractiveSurface tilt="medium" spotlight="medium" glare depth="shallow">
            <CursorTarget type="view" label="Ver painel">
              <Card className="p-0 overflow-hidden" hover={false}>
                <div className="bg-sgs-blue-50 p-6 md:p-8">
                  <div className="rounded-xl overflow-hidden border border-sgs-border bg-white shadow-lg">
                    {/* Window controls */}
                    <div className="p-4 border-b border-sgs-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <span className="text-xs text-sgs-text-tertiary ml-2">SGS Dashboard</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-5">
                      {/* Animated counters row */}
                      <div className="grid grid-cols-3 gap-3">
                        {stats.map((stat) => (
                          <div key={stat.label} className="text-center p-3 bg-sgs-surface-secondary rounded-lg">
                            <div className="text-lg font-bold text-sgs-text-primary">
                              <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2} />
                            </div>
                            <div className="text-xs text-sgs-text-tertiary mt-1">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Animated chart */}
                      <div className="bg-sgs-surface-secondary rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3 text-xs text-sgs-text-tertiary">
                          <BarChart3 size={14} />
                          <span>Evolução de indicadores</span>
                        </div>
                        <AnimatedChart
                          bars={chartBars}
                          height={140}
                          className="px-1"
                          barClassName="rounded-t-sm"
                          scrub
                        />
                      </div>

                      {/* Alert items */}
                      <div className="space-y-2">
                        {['DDS Julho: 94% de adesão', '5 documentos vencendo esta semana', '3 treinamentos agendados'].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-sgs-text-secondary p-2 bg-sgs-surface-secondary rounded-md">
                            <Bell size={12} className="text-sgs-accent shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-sgs-text-tertiary text-center mt-4 italic">
                    DADO DEMONSTRATIVO — substituir pela captura oficial do SGS e dados reais da API.
                  </p>
                </div>
              </Card>
            </CursorTarget>
          </InteractiveSurface>
        </Reveal>
      </div>
    </Section>
  )
}
