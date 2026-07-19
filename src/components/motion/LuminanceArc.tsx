'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Camada única, fixa atrás de todo o conteúdo, que faz a página atravessar
// de escuridão (hero) a claridade plena (formulário) via crossfade de
// opacity de duas camadas de gradiente. Não substitui os fundos reais das
// seções (Scanner/Security continuam com seu bg-sgs-blue-950 próprio) —
// é luz por cima, dirigida por um progresso 0→1 do scroll da página inteira.
export default function LuminanceArc() {
  const darkRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const dark = darkRef.current
    const light = lightRef.current
    if (!dark || !light) return

    if (reduced) {
      // Sem animação contínua: a transição acompanha a seção mais próxima
      // do topo do viewport, trocada em saltos discretos (barato, sem scrub).
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-luminance]'))
      if (sections.length === 0) return

      const setByClosest = () => {
        let closest = sections[0]
        let closestDist = Infinity
        for (const section of sections) {
          const dist = Math.abs(section.getBoundingClientRect().top)
          if (dist < closestDist) {
            closestDist = dist
            closest = section
          }
        }
        const value = Number(closest.dataset.luminance ?? '0')
        light.style.opacity = String(value)
      }

      setByClosest()
      window.addEventListener('scroll', setByClosest, { passive: true })
      return () => window.removeEventListener('scroll', setByClosest)
    }

    let ctx: { revert: () => void } | undefined
    let disposed = false

    void import('@/lib/gsap').then(({ gsap }) => {
      if (disposed) return
      const main = document.getElementById('main-content')
      if (!main) return

      ctx = gsap.context(() => {
        gsap.fromTo(
          light,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: main,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.65,
            },
          },
        )
      })
    })

    return () => {
      disposed = true
      ctx?.revert()
    }
  }, [reduced])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div
        ref={darkRef}
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #071a33 0%, #071a33 100%)' }}
      />
      <div
        ref={lightRef}
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', opacity: 0 }}
      />
    </div>
  )
}
