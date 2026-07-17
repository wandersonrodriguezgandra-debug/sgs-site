'use client'

import { useRef, useState, useCallback, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CinematicTimeContext, type CinematicTimeState } from './cinematic-time-context'

export function CinematicTimeProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const timeRef = useRef(0)
  const targetRef = useRef<string | null>(null)
  const animRef = useRef<number>(0)
  const freezeStartRef = useRef(0)
  const [state, setState] = useState<CinematicTimeState>({
    timeScale: 1,
    frozen: false,
    freezeProgress: 0,
    analysisTarget: null,
    analysisData: null,
  })

  const updateFreezeAnim = useCallback((elapsed: number) => {
    const duration = 2.0
    const t = Math.min(1, elapsed / duration)
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    const scale = Math.max(0.02, 1 - eased * 0.98)

    setState((prev) => ({
      ...prev,
      timeScale: scale,
      freezeProgress: eased,
      frozen: true,
    }))

    if (t < 1) {
      animRef.current = requestAnimationFrame((now) => updateFreezeAnim(now - freezeStartRef.current))
    }
  }, [])

  const updateResumeAnim = useCallback((elapsed: number) => {
    const duration = 1.5
    const t = Math.min(1, elapsed / duration)
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    const scale = 0.02 + eased * 0.98

    setState((prev) => ({
      ...prev,
      timeScale: scale,
      freezeProgress: 1 - eased,
      frozen: t < 1,
    }))

    if (t < 1) {
      animRef.current = requestAnimationFrame((now) => updateResumeAnim(now - freezeStartRef.current))
    }
  }, [])

  const freeze = useCallback((target?: string, data?: Record<string, string>) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    targetRef.current = target || null
    freezeStartRef.current = performance.now()

    setState((prev) => ({
      ...prev,
      frozen: true,
      freezeProgress: 0,
      timeScale: 1,
      analysisTarget: target || null,
      analysisData: data || null,
    }))

    animRef.current = requestAnimationFrame((now) => updateFreezeAnim(now - freezeStartRef.current))
  }, [updateFreezeAnim])

  const resume = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    targetRef.current = null
    freezeStartRef.current = performance.now()

    animRef.current = requestAnimationFrame((now) => updateResumeAnim(now - freezeStartRef.current))
  }, [updateResumeAnim])

  const setTimeScale = useCallback((scale: number) => {
    setState((prev) => ({ ...prev, timeScale: Math.max(0, Math.min(1, scale)) }))
  }, [])

  if (reduced) {
    return <>{children}</>
  }

  return (
    <CinematicTimeContext.Provider value={{ state, freeze, resume, setTimeScale, timeRef }}>
      {children}
    </CinematicTimeContext.Provider>
  )
}
