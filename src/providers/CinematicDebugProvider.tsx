'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { GraphicsQuality } from '@/types/three'

interface CinematicDebugMode {
  enabled: boolean
  forceQuality: GraphicsQuality | null
  resetExperience: boolean
  targetScene: string | null
  forceAnimations: boolean
  showPanel: boolean
  graphicsQualityOverride: GraphicsQuality | null
}

interface CinematicDebugContextType {
  debugMode: CinematicDebugMode
  setDebugMode: (mode: Partial<CinematicDebugMode>) => void
  togglePanel: () => void
  resetDebugMode: () => void
  applySceneTarget: (scene: string) => void
}

const CinematicDebugContext = createContext<CinematicDebugContextType | undefined>(undefined)

const defaultDebugMode: CinematicDebugMode = {
  enabled: false,
  forceQuality: null,
  resetExperience: false,
  targetScene: null,
  forceAnimations: false,
  showPanel: false,
  graphicsQualityOverride: null,
}

export function CinematicDebugProvider({ children }: { children: ReactNode }) {
  const [debugMode, setDebugModeState] = useState<CinematicDebugMode>(defaultDebugMode)

  // Detectar parâmetros de URL na inicialização
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const isDebug = params.has('cinematicDebug')

    if (isDebug) {
      // Modo cinematográfico forçado ativado
      const newMode: CinematicDebugMode = {
        enabled: true,
        forceQuality: 'ultra',
        resetExperience: params.has('resetExperience'),
        targetScene: params.get('scene'),
        forceAnimations: true,
        showPanel: true,
        graphicsQualityOverride: null,
      }

      // Processar parâmetros individuais
      const quality = params.get('graphicsQuality')
      if (quality && ['ultra', 'high', 'medium', 'low', 'fallback'].includes(quality)) {
        newMode.graphicsQualityOverride = quality as GraphicsQuality
        newMode.forceQuality = quality as GraphicsQuality
      }

      setDebugModeState(newMode)

      // Log no console
      console.group('🎬 CINEMATIC DEBUG MODE ACTIVATED')
      console.log('Debug Mode:', newMode)
      console.log('URL Params:', Object.fromEntries(params))
      console.groupEnd()

      // Limpar memória se solicitado
      if (newMode.resetExperience) {
        try {
          sessionStorage.removeItem('sgs-experience-memory')
          console.log('✓ Experience memory cleared')
        } catch (e) {
          console.warn('Could not clear experience memory:', e)
        }
      }

      // Remover parâmetro de reset da URL para evitar resets infinitos
      if (params.has('resetExperience')) {
        const cleanParams = new URLSearchParams(params)
        cleanParams.delete('resetExperience')
        window.history.replaceState({}, '', `?${cleanParams.toString()}`)
      }
    }
  }, [])

  const setDebugMode = useCallback((updates: Partial<CinematicDebugMode>) => {
    setDebugModeState((prev) => ({ ...prev, ...updates }))
  }, [])

  const togglePanel = useCallback(() => {
    setDebugModeState((prev) => ({ ...prev, showPanel: !prev.showPanel }))
  }, [])

  const resetDebugMode = useCallback(() => {
    setDebugModeState(defaultDebugMode)
  }, [])

  const applySceneTarget = useCallback((scene: string) => {
    setDebugModeState((prev) => ({ ...prev, targetScene: scene }))
  }, [])

  const value: CinematicDebugContextType = {
    debugMode,
    setDebugMode,
    togglePanel,
    resetDebugMode,
    applySceneTarget,
  }

  return (
    <CinematicDebugContext.Provider value={value}>
      {children}
    </CinematicDebugContext.Provider>
  )
}

export function useCinematicDebugMode(): CinematicDebugContextType {
  const context = useContext(CinematicDebugContext)
  if (!context) {
    throw new Error('useCinematicDebugMode must be used within CinematicDebugProvider')
  }
  return context
}
