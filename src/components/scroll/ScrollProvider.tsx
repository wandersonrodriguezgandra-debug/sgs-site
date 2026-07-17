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
      const { ScrollTrigger } = await import('@/lib/gsap')
      const { initLenis, destroyLenis, bindAnchorLinks } = await import('@/lib/lenis')

      // Inicializa smooth scroll (no-op em reduced-motion — respeita acessibilidade)
      initLenis()

      // Roteia âncoras da mesma página pelo scroll suave
      const unbindAnchors = bindAnchorLinks()

      ScrollTrigger.refresh()

      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', handleResize)

      cleanup = () => {
        window.removeEventListener('resize', handleResize)
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
