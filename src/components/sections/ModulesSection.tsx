'use client'

import { useState } from 'react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import ModuleCard from '@/components/ui/ModuleCard'
import Reveal from '@/components/motion/Reveal'
import BlurReveal from '@/components/motion/BlurReveal'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'
import CursorTarget from '@/components/interaction/CursorTarget'
import MorphCard from '@/components/interaction/MorphCard'
import ModuleDetailsDialog from '@/components/interaction/ModuleDetailsDialog'
import HorizontalScrollSection from '@/components/scroll/HorizontalScrollSection'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { modules } from '@/config/modules'
import type { Module } from '@/types'
import { cn } from '@/lib/utils'

const categories = ['Todos', ...new Set(modules.map((m) => m.category))]

export default function ModulesSection() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const reduced = useReducedMotion()

  const filtered =
    activeCategory === 'Todos'
      ? modules
      : modules.filter((m) => m.category === activeCategory)

  function renderCard(mod: Module) {
    return (
      <InteractiveSurface
        tilt="medium"
        spotlight="medium"
        glare
        depth="shallow"
      >
        <CursorTarget
          type="explore"
          label="Explorar módulo"
        >
          <button
            type="button"
            data-testid={`module-card-${mod.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedModule(mod)}
            className="w-full text-left"
          >
            <ModuleCard
              icon={mod.icon}
              name={mod.name}
              description={mod.description}
              category={mod.category}
              badge={mod.badge}
            />
          </button>
        </CursorTarget>
      </InteractiveSurface>
    )
  }

  const cards = filtered.map((mod) => (
    <div
      key={mod.name}
      className={cn(
        'w-[280px] shrink-0',
        reduced ? '' : 'first:ml-6 last:mr-6 lg:first:ml-12 lg:last:mr-12',
      )}
    >
      <MorphCard
        layoutId={`module-${mod.name}`}
        expanded={selectedModule?.name === mod.name}
        style={
          selectedModule?.name === mod.name
            ? { visibility: 'hidden' as const, pointerEvents: 'none' as const }
            : undefined
        }
      >
        {renderCard(mod)}
      </MorphCard>
    </div>
  ))

  return (
    <Section id="modules" variant="muted" data-testid="modules-section">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4">
          Módulos do sistema
        </Heading>
      </Reveal>
      <BlurReveal delay={0.1} blur={4}>
        <Text size="lg" className="mb-6 max-w-2xl mx-auto text-center">
          Módulos integrados que cobrem todas as necessidades da gestão de SST,
          do operacional ao estratégico.
        </Text>
      </BlurReveal>

      {/* Module count indicator */}
      <Reveal delay={0.12} className="mb-8">
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-xs tracking-wider text-sgs-text-tertiary">
            {modules.length} módulos disponíveis
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              data-testid={`category-filter-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-sgs-accent text-white'
                  : 'bg-sgs-surface text-sgs-text-secondary hover:bg-sgs-surface-tertiary border border-sgs-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.length > 0 ? (
        reduced ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((mod) => (
              <div key={mod.name}>
                <MorphCard
                  layoutId={`module-${mod.name}`}
                  expanded={selectedModule?.name === mod.name}
                  style={
                    selectedModule?.name === mod.name
                      ? { visibility: 'hidden', pointerEvents: 'none' as const }
                      : undefined
                  }
                >
                  {renderCard(mod)}
                </MorphCard>
              </div>
            ))}
          </div>
        ) : (
          <HorizontalScrollSection>
            {cards}
          </HorizontalScrollSection>
        )
      ) : (
        <p className="text-center text-sgs-text-tertiary py-12">
          Nenhum módulo encontrado nesta categoria.
        </p>
      )}

      {selectedModule && (
        <ModuleDetailsDialog
          module={selectedModule}
          layoutId={`module-${selectedModule.name}`}
          open={!!selectedModule}
          onClose={() => setSelectedModule(null)}
        />
      )}
    </Section>
  )
}
