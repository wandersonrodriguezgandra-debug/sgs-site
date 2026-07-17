'use client'

import { useState } from 'react'
import { useCinematicDebugMode } from '@/providers/CinematicDebugProvider'

export interface DebugPanelAction {
  id: string
  label: string
  action: () => void
  category: 'scenes' | 'quality' | 'memory' | 'control'
}

export function useDebugPanelActions(): DebugPanelAction[] {
  const { debugMode, setDebugMode, applySceneTarget } = useCinematicDebugMode()

  const actions: DebugPanelAction[] = [
    // Cenas Individuais
    {
      id: 'run-opening',
      label: 'Executar Abertura',
      action: () => applySceneTarget('opening'),
      category: 'scenes',
    },
    {
      id: 'run-voxels',
      label: 'Executar Voxels',
      action: () => applySceneTarget('voxels'),
      category: 'scenes',
    },
    {
      id: 'run-scanner',
      label: 'Executar Scanner',
      action: () => applySceneTarget('scanner'),
      category: 'scenes',
    },
    {
      id: 'run-frozen-time',
      label: 'Executar Frozen Time',
      action: () => applySceneTarget('frozen-time'),
      category: 'scenes',
    },
    {
      id: 'run-spatial-warp',
      label: 'Executar Spatial Warp',
      action: () => applySceneTarget('spatial-warp'),
      category: 'scenes',
    },
    {
      id: 'run-through-screen',
      label: 'Executar Through-Screen',
      action: () => applySceneTarget('through-screen'),
      category: 'scenes',
    },
    {
      id: 'run-ending',
      label: 'Executar Final Cinematográfico',
      action: () => applySceneTarget('ending'),
      category: 'scenes',
    },

    // Qualidade Gráfica
    {
      id: 'quality-ultra',
      label: 'Ultra',
      action: () => setDebugMode({ graphicsQualityOverride: 'ultra' }),
      category: 'quality',
    },
    {
      id: 'quality-high',
      label: 'High',
      action: () => setDebugMode({ graphicsQualityOverride: 'high' }),
      category: 'quality',
    },
    {
      id: 'quality-medium',
      label: 'Medium',
      action: () => setDebugMode({ graphicsQualityOverride: 'medium' }),
      category: 'quality',
    },
    {
      id: 'quality-low',
      label: 'Low',
      action: () => setDebugMode({ graphicsQualityOverride: 'low' }),
      category: 'quality',
    },

    // Memória
    {
      id: 'reset-experience',
      label: 'Reiniciar Experiência',
      action: () => {
        try {
          sessionStorage.removeItem('sgs-experience-memory')
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setDebugMode({ resetExperience: true })
          setTimeout(() => window.location.reload(), 300)
        } catch (e) {
          console.error('Failed to reset experience:', e)
        }
      },
      category: 'memory',
    },

    // Controles
    {
      id: 'scroll-top',
      label: 'Ir ao Topo',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      category: 'control',
    },
    {
      id: 'scroll-hero',
      label: 'Ir ao Hero',
      action: () => {
        const el = document.querySelector('[data-testid="hero-section"]')
        el?.scrollIntoView({ behavior: 'smooth' })
      },
      category: 'control',
    },
    {
      id: 'toggle-animations',
      label: debugMode.forceAnimations ? '✓ Animações Forçadas' : 'Forçar Animações',
      action: () => setDebugMode({ forceAnimations: !debugMode.forceAnimations }),
      category: 'control',
    },
  ]

  return actions
}

export function useDebugPanelState() {
  const { debugMode, togglePanel, setDebugMode } = useCinematicDebugMode()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return {
    isVisible: debugMode.enabled && debugMode.showPanel,
    isCollapsed,
    setIsCollapsed,
    togglePanel,
    debugMode,
    setDebugMode,
  }
}
