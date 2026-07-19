'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  BellRing,
  Building2,
  ClipboardCheck,
  FileText,
  FolderOpen,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  PieChart,
  Search,
  ShieldCheck,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import ModuleDetailsDialog from '@/components/interaction/ModuleDetailsDialog'
import { modules } from '@/config/modules'
import { motionTokens } from '@/components/motion/tokens'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import type { Module } from '@/types'

const categories = ['Todos', ...new Set(modules.map((module) => module.category))]

const moduleIconMap: Record<string, LucideIcon> = {
  AlertTriangle,
  BellRing,
  Building2,
  ClipboardCheck,
  FileText,
  FolderOpen,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  PieChart,
  Search,
  Target,
  Users,
}

const categoryStyles: Record<string, string> = {
  Analytics: 'border-violet-200 bg-violet-50 text-violet-700',
  Comunicação: 'border-amber-200 bg-amber-50 text-amber-700',
  Documentos: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  Gestão: 'border-blue-200 bg-blue-50 text-blue-700',
  Segurança: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export default function ModulesShowcaseSection() {
  const reduced = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const filteredModules = activeCategory === 'Todos'
    ? modules
    : modules.filter((module) => module.category === activeCategory)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || reduced) return

    let ctx: ReturnType<typeof import('gsap').default.context> | undefined
    let disposed = false

    void import('@/lib/gsap').then(({ gsap }) => {
      if (disposed) return
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-module-card]'))
      ctx = gsap.context(() => {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: motionTokens.distance.medium },
          {
            autoAlpha: 1,
            y: 0,
            duration: motionTokens.duration.normal,
            ease: motionTokens.gsapEase.expo,
            stagger: motionTokens.stagger.normal,
            scrollTrigger: { trigger: grid, start: 'top 85%' },
          },
        )
      }, grid)
    })

    return () => {
      disposed = true
      ctx?.revert()
    }
  }, [reduced, filteredModules.length])

  return (
    <Section
      id="modules"
      variant="default"
      className="relative py-20 md:py-28"
      data-testid="modules-section"
    >
      <div className="relative" data-testid="modules-showcase-section">
        <div className="relative z-10 mb-10 text-center md:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sgs-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sgs-accent">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            13 módulos conectados
          </div>
          <Heading size="h2" align="center" className="mb-4">
            Um ecossistema completo para sua segurança
          </Heading>
          <Text size="lg" className="mx-auto max-w-2xl text-center">
            Do DDS ao dashboard estratégico, cada módulo do SGS foi desenhado para
            simplificar a gestão de SST.
          </Text>
        </div>

        <div className="sgs-scrollbar-none relative z-10 mb-10 flex max-w-full justify-start overflow-x-auto pb-2 sm:justify-center" aria-label="Filtrar módulos por categoria">
          <div className="flex min-w-max items-center gap-2 rounded-2xl border border-sgs-blue-100 bg-white p-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                data-testid={`category-filter-${category.toLowerCase()}`}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200',
                  activeCategory === category
                    ? 'bg-sgs-accent text-white'
                    : 'text-sgs-text-secondary hover:bg-sgs-blue-50 hover:text-sgs-accent',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={gridRef}
          role="list"
          aria-label="Módulos do SGS"
          className="relative z-10 mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="modules-grid"
        >
          {filteredModules.map((module, index) => {
            const Icon = moduleIconMap[module.icon] ?? ShieldCheck
            return (
              <button
                key={module.name}
                type="button"
                role="listitem"
                data-module-card
                data-testid={`module-card-${module.name.toLowerCase().replace(/\s+/g, '-')}`}
                aria-label={`Abrir detalhes do módulo ${module.name}`}
                onClick={() => setSelectedModule(module)}
                className="group relative flex flex-col items-start rounded-2xl border border-sgs-blue-100 bg-white p-6 text-left transition-colors duration-200 hover:border-sgs-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sgs-accent focus-visible:ring-offset-2"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sgs-accent to-sgs-blue-700 text-white">
                  <Icon className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={cn(
                    'rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em]',
                    categoryStyles[module.category] ?? categoryStyles.Gestão,
                  )}>
                    {module.category}
                  </span>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-sgs-text-tertiary">
                    {String(index + 1).padStart(2, '0')} / {String(filteredModules.length).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mb-2 font-heading text-lg font-bold tracking-tight text-sgs-text-primary">
                  {module.name}
                </h3>
                <p className="text-sm leading-relaxed text-sgs-text-secondary">
                  {module.description}
                </p>
                <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.14em] text-sgs-accent transition-transform duration-200 group-hover:translate-x-0.5">
                  Ver detalhes →
                </span>
              </button>
            )
          })}
        </div>

        {selectedModule && (
          <ModuleDetailsDialog
            module={selectedModule}
            open
            onClose={() => setSelectedModule(null)}
          />
        )}
      </div>
    </Section>
  )
}
