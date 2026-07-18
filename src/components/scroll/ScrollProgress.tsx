'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const narrativeSections = [
  { id: 'hero', label: 'Visão geral' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'problema', label: 'O desafio' },
  { id: 'scanner', label: 'Operação' },
  { id: 'modules', label: 'Módulos' },
  { id: 'how-it-works', label: 'Implantação' },
  { id: 'dashboard', label: 'Cockpit SST' },
  { id: 'security', label: 'Segurança' },
  { id: 'pricing', label: 'Planos' },
  { id: 'faq', label: 'Dúvidas' },
  { id: 'contato', label: 'Próximo passo' },
] as const

export default function ScrollProgress({ className }: { className?: string }) {
  const barRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const bar = barRef.current
    if (reduced || !bar) return

    let frame = 0
    const update = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        const progress = Math.max(0, Math.min(1, window.scrollY / limit))
        bar.style.transform = `scaleX(${progress})`
        bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) return

    const sections = narrativeSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0.08, 0.25, 0.5, 0.75] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [reduced])

  if (reduced) return null

  return (
    <>
      <div
        ref={barRef}
        role="progressbar"
        aria-label="Progresso da página"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className={cn(
          'fixed left-0 right-0 top-0 z-[9998] h-[3px] origin-left scale-x-0',
          'bg-gradient-to-r from-sgs-accent via-sgs-cyan to-sgs-blue-400',
          className,
        )}
      />

      <nav
        aria-label="Navegação da narrativa"
        className="pointer-events-none fixed right-5 top-1/2 z-[70] hidden -translate-y-1/2 xl:block"
      >
        <div className="group pointer-events-auto flex items-center gap-3 rounded-full border border-sgs-blue-100/80 bg-white/75 px-2.5 py-3 shadow-[0_18px_50px_rgba(7,26,51,0.1)] backdrop-blur-xl">
          <div className="flex flex-col items-center gap-2" aria-hidden="true">
            {narrativeSections.map((section) => {
              const isActive = section.id === activeSection
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-label={section.label}
                  aria-current={isActive ? 'step' : undefined}
                  className="group relative flex h-3 w-3 items-center justify-center"
                >
                  <span
                    className={cn(
                      'block rounded-full transition-[width,height,background-color,box-shadow] duration-300',
                      isActive
                        ? 'h-2.5 w-2.5 bg-sgs-accent shadow-[0_0_12px_rgba(0,86,179,0.55)]'
                        : 'h-1.5 w-1.5 bg-sgs-blue-200 group-hover:h-2 group-hover:w-2 group-hover:bg-sgs-cyan',
                    )}
                  />
                </a>
              )
            })}
          </div>
          <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-sgs-accent opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-28 group-hover:opacity-100 group-focus-within:max-w-28 group-focus-within:opacity-100">
            {narrativeSections.find((section) => section.id === activeSection)?.label}
          </span>
        </div>
      </nav>
    </>
  )
}
