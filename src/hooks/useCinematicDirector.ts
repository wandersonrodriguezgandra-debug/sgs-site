'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { cinematicSequences, cameraPaths, sgsCoreColors } from '@/config/cinematic-sequences'
import type { NarrativeState, CinematicSequence } from '@/types/cinematic'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import type { GraphicsQuality } from '@/types/three'

export function useCinematicDirector() {
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const progressRef = useRef(0)
  const directionRef = useRef<'forward' | 'backward' | 'idle'>('idle')
  const lastProgressRef = useRef(0)

  // quality/reduced ficam em refs para que updateProgress tenha identidade
  // ESTÁVEL (deps []). Sem isso, updateProgress mudava de identidade a cada
  // setState e o efeito consumidor entrava em loop infinito ("Maximum update
  // depth exceeded"), quebrando a cena inteira no desktop.
  const qualityRef = useRef<GraphicsQuality>(quality)
  const reducedRef = useRef(reduced)
  useEffect(() => {
    qualityRef.current = quality
    reducedRef.current = reduced
  }, [quality, reduced])

  const [state, setState] = useState<NarrativeState>({
    progress: 0,
    direction: 'idle',
    activeSequence: null,
    previousSequence: null,
    sceneReady: false,
    currentTheme: {
      color: sgsCoreColors.danger,
      intensity: 1,
    },
  })

  // Callback do scroll — recebe progresso 0-1. Identidade estável (deps []).
  const updateProgress = useCallback((scrollProgress: number) => {
    const clamped = Math.max(0, Math.min(1, scrollProgress))
    const direction = clamped > lastProgressRef.current ? 'forward'
      : clamped < lastProgressRef.current ? 'backward' : directionRef.current

    progressRef.current = clamped
    directionRef.current = direction
    lastProgressRef.current = clamped

    // Encontrar sequência ativa
    const active = cinematicSequences.find(
      (seq) => clamped >= seq.start && clamped < seq.end,
    ) || null

    const activeSeq = active && isSequenceAllowed(active, qualityRef.current, reducedRef.current)
      ? active
      : null

    setState((prev) => {
      // Se nada mudou de forma perceptível, retorna a MESMA referência
      // (React não re-renderiza) — evita churn e qualquer resíduo de loop.
      const sameSeq = prev.activeSequence?.id === activeSeq?.id
      if (sameSeq && Math.abs(prev.progress - clamped) < 0.0005) {
        return prev
      }

      const previousSequence = sameSeq ? prev.previousSequence : prev.activeSequence

      return {
        progress: clamped,
        direction,
        activeSequence: activeSeq,
        previousSequence: previousSequence || null,
        sceneReady: prev.sceneReady,
        currentTheme: {
          color: activeSeq?.color || sgsCoreColors.nucleus,
          intensity: activeSeq?.intensity || 0.5,
        },
      }
    })
  }, [])

  // Marcar cena pronta
  const setSceneReady = useCallback(() => {
    setState((prev) => (prev.sceneReady ? prev : { ...prev, sceneReady: true }))
  }, [])

  // Obter ponto da câmera para o progresso atual
  const getCameraPoint = useCallback((sequenceId?: string): [number, number, number] => {
    const seq = sequenceId
      ? cinematicSequences.find((s) => s.id === sequenceId)
      : state.activeSequence

    if (!seq || !seq.cameraPath) return [0, 0.8, 4.2]

    const path = cameraPaths[seq.cameraPath]
    if (!path || path.length === 0) return [0, 0.8, 4.2]

    // Progresso dentro da sequência
    const seqProgress = (progressRef.current - seq.start) / (seq.end - seq.start)
    const t = Math.max(0, Math.min(1, seqProgress))

    if (path.length === 1) return path[0]

    // Interpolação linear simplificada entre pontos
    const segments = path.length - 1
    const segIndex = Math.min(Math.floor(t * segments), segments - 1)
    const segT = (t * segments) - segIndex

    const p0 = path[segIndex]
    const p1 = path[Math.min(segIndex + 1, path.length - 1)]

    return [
      p0[0] + (p1[0] - p0[0]) * segT,
      p0[1] + (p1[1] - p0[1]) * segT,
      p0[2] + (p1[2] - p0[2]) * segT,
    ]
  }, [state.activeSequence])

  return {
    state,
    updateProgress,
    setSceneReady,
    getCameraPoint,
    progressRef,
  }
}

function isSequenceAllowed(
  seq: CinematicSequence,
  quality: GraphicsQuality,
  reduced: boolean,
): boolean {
  if (reduced && seq.reducedMotionFallback === 'skip') return false
  if (quality === 'fallback') return false
  if (seq.quality === 'ultra' && quality === 'low') return false
  if (seq.quality === 'high' && quality === 'low') return false
  if (seq.quality === 'ultra' && quality === 'medium') return false
  return true
}
