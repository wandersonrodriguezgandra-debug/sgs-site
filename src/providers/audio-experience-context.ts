import { createContext } from 'react'

export interface AudioContextValue {
  play: (id: string) => void
  stop: (id: string) => void
  stopAll: () => void
  setMasterVolume: (v: number) => void
  enabled: boolean
  setEnabled: (v: boolean) => void
  masterVolume: number
}

export const AudioContextCtx = createContext<AudioContextValue | null>(null)
