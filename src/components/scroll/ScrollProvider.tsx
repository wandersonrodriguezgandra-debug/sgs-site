'use client'

import { useEffect, type ReactNode } from 'react'

interface ScrollProviderProps {
  children: ReactNode
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  useEffect(() => {
    let disposed = false
    let cleanup: (() => void) | undefined

    async function init() {
      const { initLenis, destroyLenis, bindAnchorLinks, scrollToHash } = await import(
        '@/lib/lenis'
      )
      const { ScrollTrigger } = await import('@/lib/gsap')

      if (disposed) return

      const lenis = initLenis()
      let refreshFrame = 0
      let settleFrame = 0
      let hashObserver: MutationObserver | null = null

      const stopWatchingHashTarget = () => {
        hashObserver?.disconnect()
        hashObserver = null
      }

      const watchForHashTarget = () => {
        if (!window.location.hash || hashObserver) return

        hashObserver = new MutationObserver(() => {
          let id = ''
          try {
            id = decodeURIComponent(window.location.hash.slice(1))
          } catch {
            stopWatchingHashTarget()
            return
          }
          if (!document.getElementById(id)) return

          stopWatchingHashTarget()
          lenis?.resize()
          ScrollTrigger.refresh()
          window.requestAnimationFrame(() => scrollToHash(window.location.hash))
        })
        hashObserver.observe(document.body, { childList: true, subtree: true })
      }

      const refreshScrollLayout = (navigateToHash = false) => {
        window.cancelAnimationFrame(refreshFrame)
        window.cancelAnimationFrame(settleFrame)

        refreshFrame = window.requestAnimationFrame(() => {
          lenis?.resize()
          ScrollTrigger.refresh()

          settleFrame = window.requestAnimationFrame(() => {
            if (!navigateToHash || !window.location.hash) return
            if (scrollToHash(window.location.hash)) stopWatchingHashTarget()
            else watchForHashTarget()
          })
        })
      }

      const prepareAnchorNavigation = () => {
        lenis?.resize()
        ScrollTrigger.refresh()
      }

      const unbindAnchors = bindAnchorLinks(prepareAnchorNavigation)
      const handleResize = () => refreshScrollLayout(false)
      const handlePageLoad = () => refreshScrollLayout(Boolean(window.location.hash))
      const handleHashNavigation = () => refreshScrollLayout(true)

      window.addEventListener('resize', handleResize)
      window.addEventListener('load', handlePageLoad)
      window.addEventListener('hashchange', handleHashNavigation)
      window.addEventListener('popstate', handleHashNavigation)

      refreshScrollLayout(Boolean(window.location.hash))
      void document.fonts?.ready.then(() => {
        if (!disposed) refreshScrollLayout(Boolean(window.location.hash))
      })

      cleanup = () => {
        window.cancelAnimationFrame(refreshFrame)
        window.cancelAnimationFrame(settleFrame)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('load', handlePageLoad)
        window.removeEventListener('hashchange', handleHashNavigation)
        window.removeEventListener('popstate', handleHashNavigation)
        stopWatchingHashTarget()
        unbindAnchors()
        destroyLenis()
      }

      if (disposed) cleanup()
    }

    void init()

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}
