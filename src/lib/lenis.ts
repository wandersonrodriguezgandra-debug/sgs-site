import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/reduced-motion'

// Gerenciador singleton do Lenis para a rolagem suave da experiência.
// Mantém uma única instância global e permite que hooks (ex.: useNarrativeProgress)
// leiam o progresso suavizado sem cada um instanciar seu próprio listener.

export interface LenisScrollData {
  scroll: number
  limit: number
  velocity: number
  progress: number
}

let lenis: Lenis | null = null
let rafId = 0
const listeners = new Set<(data: LenisScrollData) => void>()

function emit(instance: Lenis) {
  const limit = instance.limit || 0
  const scroll = instance.scroll || 0
  const data: LenisScrollData = {
    scroll,
    limit,
    velocity: instance.velocity || 0,
    progress: limit > 0 ? Math.max(0, Math.min(1, scroll / limit)) : 0,
  }
  for (const fn of listeners) fn(data)
}

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined') return null
  if (lenis) return lenis

  if (prefersReducedMotion()) return null // sem smooth scroll — respeita acessibilidade

  lenis = new Lenis({
    duration: 1.1,
    // easing "expo.out" — desaceleração longa e premium
    easing: (t: number) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: false, // touch nativo em mobile (mais responsivo)
  })

  // Sincroniza ScrollTrigger a cada frame do Lenis
  lenis.on('scroll', () => {
    // O ScrollTrigger precisa receber o progresso suavizado do Lenis para
    // manter as transições vinculadas ao scroll sincronizadas.
    ScrollTrigger.update()
    if (lenis) emit(lenis)
  })

  // Dirige o Lenis por um loop rAF dedicado (canônico e confiável).
  // ScrollTrigger continua sincronizado pelo callback de scroll acima.
  const raf = (time: number) => {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  gsap.ticker.lagSmoothing(0)
  rafId = requestAnimationFrame(raf)

  // Handle de debug em DEV para QA de scroll
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
  }

  return lenis
}

export function destroyLenis() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  if (!lenis) return
  lenis.destroy()
  lenis = null
}

export function getLenis(): Lenis | null {
  return lenis
}

/**
 * Assina eventos de scroll suavizado. Retorna função de cleanup.
 * Se o Lenis não estiver ativo (reduced-motion), o subscriber deve
 * usar seu próprio fallback de window scroll.
 */
export function subscribeLenis(fn: (data: LenisScrollData) => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

// Offset do header fixo (h-20 = 80px em desktop)
const HEADER_OFFSET = -80

/**
 * Intercepta cliques em links de âncora (#id) da mesma página e os
 * roteia pelo scroll suave do Lenis, respeitando o header fixo.
 * Retorna função de cleanup. No-op se o Lenis não estiver ativo.
 */
export function bindAnchorLinks(): () => void {
  if (typeof document === 'undefined') return () => {}

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const anchor = (e.target as HTMLElement)?.closest('a')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href || !href.startsWith('#') || href === '#') return
    const el = document.querySelector(href)
    if (!el) return
    e.preventDefault()
    scrollTo(el as HTMLElement, HEADER_OFFSET)
    // Atualiza o hash sem provocar salto nativo
    history.pushState(null, '', href)
  }

  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

export function scrollTo(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset })
  } else if (typeof window !== 'undefined') {
    if (typeof target === 'string') {
      const el = document.querySelector(target)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target + offset, behavior: 'smooth' })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
