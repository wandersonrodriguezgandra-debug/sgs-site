'use client'

import { useContext } from 'react'
import { CinematicTimeContext } from '@/providers/cinematic-time-context'
import type { CinematicTimeContextValue } from '@/providers/cinematic-time-context'

export function useCinematicTime(): CinematicTimeContextValue {
  const ctx = useContext(CinematicTimeContext)
  if (!ctx) {
    return {
      state: { timeScale: 1, frozen: false, freezeProgress: 0, analysisTarget: null, analysisData: null },
      freeze: () => {},
      resume: () => {},
      setTimeScale: () => {},
      timeRef: { current: 0 },
    }
  }
  return ctx
}
