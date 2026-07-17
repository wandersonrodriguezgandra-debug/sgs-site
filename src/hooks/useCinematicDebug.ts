'use client'

import { useEffect, useState } from 'react'
import { useCinematicDebugMode } from '@/providers/CinematicDebugProvider'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useNarrativeProgress } from '@/hooks/useNarrativeProgress'
import { useExperienceMemory } from '@/hooks/useExperienceMemory'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useCinematicAudio } from '@/hooks/useCinematicAudio'
import type { GraphicsQuality } from '@/types/three'

export interface CinematicDebugState {
  graphicsQuality: GraphicsQuality
  webglSupported: boolean
  webglVersion: 'webgl2' | 'webgl' | null
  webglMaxTextureSize: number
  webglMaxVertexAttribs: number
  reducedMotion: boolean
  isTouchDevice: boolean
  sceneVisible: boolean
  scrollProgress: number
  introSeen: boolean
  voxelSequenceSeen: boolean
  cinematicSequenceActive: boolean
  timeScaleCurrent: number
  audioEnabled: boolean
  fps: number
  drawCalls: number
  triangles: number
  textureCount: number
  memoryUsage: string
}

export function useCinematicDebug(): CinematicDebugState {
  const { debugMode } = useCinematicDebugMode()
  const quality = useGraphicsQuality()
  const webgl = useWebGLSupport()
  const reduced = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const scrollProgress = useNarrativeProgress()
  const { memory } = useExperienceMemory()
  const audio = useCinematicAudio()

  const [sceneVisible, setSceneVisible] = useState(false)
  const [fps, setFps] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState('0 MB')

  // Detectar visibilidade da cena
  useEffect(() => {
    const checkVisibility = () => {
      const sceneEl = document.querySelector('[data-testid="progressive-scene"]')
      if (sceneEl) {
        const rect = sceneEl.getBoundingClientRect()
        setSceneVisible(rect.top < window.innerHeight && rect.bottom > 0)
      }
    }

    window.addEventListener('scroll', checkVisibility)
    checkVisibility()

    return () => window.removeEventListener('scroll', checkVisibility)
  }, [])

  // Monitor FPS simplificado
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const countFrames = () => {
      frameCount++
      const now = performance.now()
      if (now - lastTime >= 1000) {
        setFps(Math.round(frameCount))
        frameCount = 0
        lastTime = now
      }
      requestAnimationFrame(countFrames)
    }

    const raf = requestAnimationFrame(countFrames)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Capturar memória do navegador
  useEffect(() => {
    if ((performance as any).memory) {
      const mem = (performance as any).memory
      const usedMb = Math.round(mem.usedJSHeapSize / 1048576)
      setMemoryUsage(`${usedMb} MB`)
    }
  }, [])

  const effectiveQuality = debugMode.graphicsQualityOverride || quality

  return {
    graphicsQuality: effectiveQuality,
    webglSupported: webgl.supported,
    webglVersion: webgl.contextType,
    webglMaxTextureSize: webgl.maxTextureSize,
    webglMaxVertexAttribs: webgl.maxVertexAttribs,
    reducedMotion: reduced,
    isTouchDevice: isTouch,
    sceneVisible,
    scrollProgress: Math.round(scrollProgress * 1000) / 1000,
    introSeen: memory.introSeen,
    voxelSequenceSeen: memory.voxelSequenceSeen,
    cinematicSequenceActive: false,
    timeScaleCurrent: 1,
    audioEnabled: audio.enabled,
    fps,
    drawCalls: 0,
    triangles: 0,
    textureCount: 0,
    memoryUsage,
  }
}

// Função auxiliar para registrar estado no console
export function logCinematicDebugState(state: CinematicDebugState) {
  if (typeof window === 'undefined') return

  console.table({
    'Graphics Quality': state.graphicsQuality,
    'WebGL Supported': state.webglSupported,
    'WebGL Version': state.webglVersion || 'none',
    'WebGL Max Texture': state.webglMaxTextureSize,
    'WebGL Max Attribs': state.webglMaxVertexAttribs,
    'Reduced Motion': state.reducedMotion,
    'Touch Device': state.isTouchDevice,
    'Scene Visible': state.sceneVisible,
    'Scroll Progress': state.scrollProgress,
    'Intro Seen': state.introSeen,
    'Voxel Sequence Seen': state.voxelSequenceSeen,
    'Cinematic Active': state.cinematicSequenceActive,
    'Time Scale': state.timeScaleCurrent,
    'Audio Enabled': state.audioEnabled,
    'FPS': state.fps,
    'Draw Calls': state.drawCalls,
    'Triangles': state.triangles,
    'Textures': state.textureCount,
    'Memory Usage': state.memoryUsage,
  })
}
