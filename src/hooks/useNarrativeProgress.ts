'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { subscribeLenis, getLenis, type LenisScrollData } from '@/lib/lenis'

// Mapeia a posição do scroll para progresso narrativo 0-1
// 0 = topo da página, 1 = final da página (antes do footer)
// Prefere o progresso suavizado do Lenis; cai para window.scrollY quando
// o smooth scroll não está ativo (reduced-motion / touch).
export function useNarrativeProgress() {
  const reduced = useReducedMotion()
  const rafRef = useRef<number>(0)
  const [progress, setProgress] = useState(0)
  const lastRef = useRef(0)

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const p = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0
      setProgress(p)
      lastRef.current = p
    })
  }, [])

  useEffect(() => {
    if (reduced) return

    // Caminho preferido: progresso suavizado do Lenis
    const onLenis = (data: LenisScrollData) => {
      setProgress(data.progress)
      lastRef.current = data.progress
    }
    const unsub = subscribeLenis(onLenis)

    // Fallback: se o Lenis não estiver ativo, usa scroll nativo
    let usingFallback = false
    if (!getLenis()) {
      usingFallback = true
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
    }

    return () => {
      unsub()
      if (usingFallback) {
        window.removeEventListener('scroll', handleScroll)
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, handleScroll])

  return progress
}
