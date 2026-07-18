'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface ScrollProviderProps {
  children: ReactNode
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let cleanup: (() => void) | undefined

    async function init() {
      const { initLenis, destroyLenis, bindAnchorLinks } = await import('@/lib/lenis')
      const { ScrollTrigger } = await import('@/lib/gsap')

      // Inicializa smooth scroll (no-op em reduced-motion — respeita acessibilidade)
      const lenis = initLenis()

      // Roteia âncoras da mesma página pelo scroll suave
      const unbindAnchors = bindAnchorLinks()

      let refreshFrame = 0
      let settleFrame = 0

      const refreshScrollLayout = () => {
        window.cancelAnimationFrame(refreshFrame)
        window.cancelAnimationFrame(settleFrame)
        refreshFrame = window.requestAnimationFrame(() => {
          settleFrame = window.requestAnimationFrame(() => {
            lenis?.resize()
            ScrollTrigger.refresh()
          })
        })
      }

      window.addEventListener('resize', refreshScrollLayout)
      window.addEventListener('sgs:intro-complete', refreshScrollLayout)
      ScrollTrigger.refresh()

      cleanup = () => {
        window.cancelAnimationFrame(refreshFrame)
        window.cancelAnimationFrame(settleFrame)
        window.removeEventListener('resize', refreshScrollLayout)
        window.removeEventListener('sgs:intro-complete', refreshScrollLayout)
        unbindAnchors()
        destroyLenis()
      }
    }

    init()

    return () => {
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}
