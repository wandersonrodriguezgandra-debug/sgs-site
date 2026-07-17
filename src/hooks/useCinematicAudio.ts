'use client'

import { useContext } from 'react'
import { AudioContextCtx } from '@/providers/audio-experience-context'
import type { AudioContextValue } from '@/providers/audio-experience-context'

export function useCinematicAudio(): AudioContextValue {
  const ctx = useContext(AudioContextCtx)
  if (!ctx) {
    return {
      play: () => {},
      stop: () => {},
      stopAll: () => {},
      setMasterVolume: () => {},
      enabled: false,
      setEnabled: () => {},
      masterVolume: 0,
    }
  }
  return ctx
}
