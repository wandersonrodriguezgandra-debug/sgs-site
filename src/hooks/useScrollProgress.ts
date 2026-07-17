'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { subscribeLenis, getLenis } from '@/lib/lenis'

interface ScrollProgressData {
  progress: number
  velocity: number
  direction: 'up' | 'down' | 'idle'
  isScrolling: boolean
}

export function useScrollProgress(): ScrollProgressData {
  const [data, setData] = useState<ScrollProgressData>({ progress: 0, velocity: 0, direction: 'idle', isScrolling: false })
  const prevRef = useRef(0)
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const update = useCallback((p: number, vel: number) => {
    const dir = p > prevRef.current ? 'down' : p < prevRef.current ? 'up' : 'idle'
    prevRef.current = p

    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    idleTimeoutRef.current = setTimeout(() => {
      setData(prev => ({ ...prev, isScrolling: false, velocity: 0, direction: 'idle' }))
    }, 150)
    setData({ progress: p, velocity: vel, direction: dir, isScrolling: true })
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (lenis) {
      const unsub = subscribeLenis((d) => update(d.progress, d.velocity))
      return unsub
    } else {
      const handler = () => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const p = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0
        update(p, 0)
      }
      window.addEventListener('scroll', handler, { passive: true })
      handler()
      return () => window.removeEventListener('scroll', handler)
    }
  }, [update])

  return data
}
