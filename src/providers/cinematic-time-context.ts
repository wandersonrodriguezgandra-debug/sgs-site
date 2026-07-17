import { createContext } from 'react'

export interface CinematicTimeState {
  timeScale: number
  frozen: boolean
  freezeProgress: number
  analysisTarget: string | null
  analysisData: Record<string, string> | null
}

export interface CinematicTimeContextValue {
  state: CinematicTimeState
  freeze: (target?: string, data?: Record<string, string>) => void
  resume: () => void
  setTimeScale: (scale: number) => void
  timeRef: React.MutableRefObject<number>
}

export const CinematicTimeContext = createContext<CinematicTimeContextValue | null>(null)
