'use client'

import { useState, useCallback } from 'react'

export type SceneLoadingState =
  | 'poster'
  | 'canvas-loading'
  | 'basic-ready'
  | 'effects-loading'
  | 'complete'
  | 'fallback'
  | 'error'

export function useSceneLoadingState() {
  const [state, setState] = useState<SceneLoadingState>('poster')

  const transition = useCallback((next: SceneLoadingState) => {
    setState(next)
  }, [])

  return { state, transition }
}
