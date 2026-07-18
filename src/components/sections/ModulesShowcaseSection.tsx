'use client'

import { useCallback, useEffect, useState, type FocusEvent } from 'react'
import { m } from 'framer-motion'
import {
  AlertTriangle,
  BellRing,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FolderOpen,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  MoveHorizontal,
  Pause,
  PieChart,
  Play,
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
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'
import type { Module } from '@/types'

const AUTOPLAY_INTERVAL_MS = 4200
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

function getRelativePosition(index: number, activeIndex: number, total: number): number {
  const forwardDistance = (index - activeIndex + total) % total
  return forwardDistance > total / 2 ? forwardDistance - total : forwardDistance
}

function getCardMotion(relativePosition: number, reduced: boolean) {
  if (relativePosition === 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
      filter: 'blur(0px)',
    }
  }

  if (relativePosition > 0 && relativePosition <= 4) {
    return {
      x: relativePosition * 28,
      y: relativePosition * 22,
      z: relativePosition * -70,
      scale: 1 - relativePosition * 0.055,
      rotateY: relativePosition * -1.5,
      rotateZ: relativePosition * 1.15,
      opacity: 1 - relativePosition * 0.17,
      filter: `blur(${reduced ? 0 : Math.max(0, relativePosition - 2) * 0.8}px)`,
    }
  }

  if (relativePosition < 0) {
    return {
      x: -190,
      y: -12,
      z: 30,
      scale: 0.92,
      rotateY: 8,
      rotateZ: -7,
      opacity: 0,
      filter: 'blur(4px)',
    }
  }

  return {
    x: 130,
    y: 96,
    z: -340,
    scale: 0.72,
    rotateY: -8,
    rotateZ: 6,
    opacity: 0,
    filter: 'blur(5px)',
  }
}

export default function ModulesShowcaseSection() {
  const reduced = useReducedMotion()
  const [sectionRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const filteredModules = activeCategory === 'Todos'
    ? modules
    : modules.filter((module) => module.category === activeCategory)

  const moveCarousel = useCallback((step: number) => {
    setActiveIndex((currentIndex) => (
      (currentIndex + step + filteredModules.length) % filteredModules.length
    ))
  }, [filteredModules.length])

  const selectModule = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const selectCategory = useCallback((category: string) => {
    setActiveCategory(category)
    setActiveIndex(0)
  }, [])

  useEffect(() => {
    if (reduced || !autoplay || !isInView || isHovered || isFocusWithin) return

    const intervalId = window.setInterval(() => {
      moveCarousel(1)
    }, AUTOPLAY_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [activeIndex, autoplay, isFocusWithin, isHovered, isInView, moveCarousel, reduced])

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocusWithin(false)
    }
  }, [])

  return (
    <Section
      id="modules"
      variant="default"
      className="relative overflow-hidden py-20 md:py-28"
      data-testid="modules-section"
    >
      <div
        ref={sectionRef}
        className="relative"
        data-testid="modules-showcase-section"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsFocusWithin(true)}
        onBlurCapture={handleBlur}
      >
        <div
          aria-hidden="true"
          className="sgs-showcase-orbit pointer-events-none absolute -left-40 top-12 h-80 w-80 rounded-full border border-dashed border-sgs-accent/20"
        />
        <div
          aria-hidden="true"
          className="sgs-showcase-float pointer-events-none absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-52 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[90px]"
        />

        <div className="relative z-10 mb-10 text-center md:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sgs-blue-100 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sgs-accent shadow-sm backdrop-blur">
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
          <div className="flex min-w-max items-center gap-2 rounded-2xl border border-sgs-blue-100 bg-white/85 p-2 shadow-sm backdrop-blur">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                data-testid={`category-filter-${category.toLowerCase()}`}
                aria-pressed={activeCategory === category}
                onClick={() => selectCategory(category)}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300',
                  activeCategory === category
                    ? 'bg-sgs-accent text-white shadow-md shadow-sgs-accent/20'
                    : 'text-sgs-text-secondary hover:bg-sgs-blue-50 hover:text-sgs-accent',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Módulos do SGS"
          className="relative z-10 mx-auto max-w-5xl"
          data-testid="modules-carousel"
        >
          <div
            className="relative mx-auto h-[350px] w-[calc(100%-2.5rem)] max-w-3xl sm:h-[330px] sm:w-[calc(100%-5rem)]"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            {filteredModules.map((module, index) => {
              const relativePosition = getRelativePosition(index, activeIndex, filteredModules.length)
              const isActive = relativePosition === 0
              const Icon = moduleIconMap[module.icon] ?? ShieldCheck
              const motionState = getCardMotion(relativePosition, reduced)

              return (
                <m.article
                  key={module.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${filteredModules.length}: ${module.name}`}
                  aria-hidden={!isActive}
                  data-testid={`modules-carousel-card-${index}`}
                  data-active={isActive ? 'true' : 'false'}
                  className="absolute inset-x-0 top-0 select-none"
                  style={{
                    zIndex: isActive ? filteredModules.length + 2 : filteredModules.length - Math.max(relativePosition, 0),
                    pointerEvents: isActive ? 'auto' : 'none',
                    transformStyle: 'preserve-3d',
                  }}
                  initial={false}
                  animate={motionState}
                  transition={reduced ? { duration: 0 } : {
                    type: 'spring',
                    stiffness: 210,
                    damping: 25,
                    mass: 0.85,
                  }}
                >
                  <button
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    data-testid={`module-card-${module.name.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-label={`Abrir detalhes do módulo ${module.name}`}
                    onClick={() => setSelectedModule(module)}
                    className={cn(
                      'sgs-showcase-sheen relative min-h-[290px] w-full overflow-hidden rounded-[1.75rem] border bg-white p-6 text-left shadow-[0_30px_90px_rgba(0,52,112,0.18)] sm:min-h-[270px] sm:p-8',
                      isActive ? 'border-sgs-blue-100' : 'border-sgs-blue-200',
                    )}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-gradient-to-br from-sgs-blue-100 via-cyan-50 to-transparent opacity-90"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-1.5 w-full bg-sgs-blue-50"
                    >
                      <m.div
                        className="h-full bg-gradient-to-r from-sgs-accent via-cyan-400 to-sgs-blue-400"
                        initial={false}
                        animate={{ width: isActive ? '100%' : '0%' }}
                        transition={{ duration: reduced ? 0 : AUTOPLAY_INTERVAL_MS / 1000, ease: 'linear' }}
                      />
                    </div>

                    <div className="relative flex h-full flex-col sm:flex-row sm:items-center sm:gap-8">
                      <m.div
                        className="mb-5 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sgs-accent to-sgs-blue-700 text-white shadow-xl shadow-sgs-accent/25 sm:mb-0 sm:h-24 sm:w-24"
                        animate={isActive && !reduced ? {
                          rotate: [0, -4, 4, 0],
                          scale: [1, 1.06, 1],
                        } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 1.1, ease: 'easeInOut' }}
                      >
                        <Icon className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.7} aria-hidden="true" />
                      </m.div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className={cn(
                            'rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]',
                            categoryStyles[module.category] ?? categoryStyles.Gestão,
                          )}>
                            {module.category}
                          </span>
                          <span className="font-mono text-xs font-semibold tracking-[0.18em] text-sgs-text-tertiary">
                            {String(index + 1).padStart(2, '0')} / {String(filteredModules.length).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="mb-3 font-heading text-2xl font-bold tracking-tight text-sgs-text-primary sm:text-3xl">
                          {module.name}
                        </h3>
                        <p className="max-w-xl text-base leading-relaxed text-sgs-text-secondary sm:text-lg">
                          {module.description}
                        </p>
                        <span className="mt-5 inline-flex text-xs font-bold uppercase tracking-[0.14em] text-sgs-accent">
                          Ver detalhes →
                        </span>
                      </div>
                    </div>
                  </button>
                </m.article>
              )
            })}
          </div>

          <div className="mt-5 flex flex-col items-center gap-5 sm:mt-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                aria-label="Mostrar módulo anterior"
                data-testid="modules-carousel-previous"
                onClick={() => moveCarousel(-1)}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-sgs-blue-100 bg-white text-sgs-accent shadow-md transition-all duration-300 hover:-translate-x-1 hover:border-sgs-accent hover:bg-sgs-accent hover:text-white hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sgs-accent focus-visible:ring-offset-2"
              >
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              </button>

              <div
                className="flex min-w-24 items-center justify-center gap-2 rounded-full border border-sgs-blue-100 bg-white/90 px-4 py-3 text-sm font-semibold text-sgs-text-primary shadow-sm backdrop-blur sm:min-w-44 sm:px-5"
                aria-live="polite"
              >
                <MoveHorizontal className="h-4 w-4 text-sgs-accent" aria-hidden="true" />
                <span className="sm:hidden">Módulos</span>
                <span className="hidden sm:inline">Navegar pelos módulos</span>
              </div>

              <button
                type="button"
                aria-label="Mostrar próximo módulo"
                data-testid="modules-carousel-next"
                onClick={() => moveCarousel(1)}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-sgs-blue-100 bg-white text-sgs-accent shadow-md transition-all duration-300 hover:translate-x-1 hover:border-sgs-accent hover:bg-sgs-accent hover:text-white hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sgs-accent focus-visible:ring-offset-2"
              >
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>

              {!reduced && (
                <button
                  type="button"
                  aria-label={autoplay ? 'Pausar avanço automático' : 'Retomar avanço automático'}
                  aria-pressed={!autoplay}
                  data-testid="modules-carousel-autoplay"
                  onClick={() => setAutoplay((current) => !current)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-sgs-blue-100 bg-white text-sgs-text-secondary shadow-md transition-all duration-300 hover:border-sgs-accent hover:text-sgs-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sgs-accent focus-visible:ring-offset-2"
                >
                  {autoplay
                    ? <Pause className="h-4 w-4" aria-hidden="true" />
                    : <Play className="h-4 w-4" aria-hidden="true" />}
                </button>
              )}
            </div>

            <div className="flex max-w-full items-center gap-1.5 overflow-hidden px-2" aria-label="Selecionar módulo">
              {filteredModules.map((module, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={module.name}
                    type="button"
                    aria-label={`Mostrar módulo ${module.name}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => selectModule(index)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sgs-accent focus-visible:ring-offset-2',
                      isActive
                        ? 'w-9 bg-sgs-accent shadow-[0_0_14px_rgba(0,86,179,0.35)]'
                        : 'w-2 bg-sgs-blue-200 hover:bg-sgs-blue-400',
                    )}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {selectedModule && (
          <ModuleDetailsDialog
            module={selectedModule}
            layoutId={`module-${selectedModule.name}`}
            open
            onClose={() => setSelectedModule(null)}
          />
        )}
      </div>
    </Section>
  )
}
