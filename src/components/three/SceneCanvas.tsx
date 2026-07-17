'use client'

import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, type WebGLRenderer } from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useAdaptiveDpr } from '@/hooks/useAdaptiveDpr'
import { useWebGLContextLoss } from '@/hooks/useWebGLContextLoss'
import { sceneConfig } from '@/config/scene'
import type { SceneLoadingState } from '@/types/three'

interface SceneCanvasProps {
  children: ReactNode
  className?: string
  onContextLost?: () => void
  onContextRestored?: () => void
  fallback?: ReactNode
  onLoadingChange?: (state: SceneLoadingState) => void
}

function ContextLossMonitor({
  canvas,
  onLost,
  onRestored,
  onPermanentLoss,
}: {
  canvas: HTMLCanvasElement
  onLost?: () => void
  onRestored?: () => void
  onPermanentLoss?: () => void
}) {
  const canvasRef = useRef(canvas)
  canvasRef.current = canvas

  useWebGLContextLoss(canvasRef, {
    onLost,
    onRestored,
    onPermanentLoss,
  })

  return null
}

export default function SceneCanvas({
  children,
  className,
  onContextLost,
  onContextRestored,
  fallback,
  onLoadingChange,
}: SceneCanvasProps) {
  const quality = useGraphicsQuality()
  const reduced = useReducedMotion()
  const dpr = useAdaptiveDpr()
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const [contextFailed, setContextFailed] = useState(false)
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)
  const glRef = useRef<WebGLRenderer | null>(null)

  const updateLoading = useCallback((state: SceneLoadingState) => {
    onLoadingChange?.(state)
  }, [onLoadingChange])

  useEffect(() => {
    if (contextFailed) {
      const timer = setTimeout(() => setContextFailed(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [contextFailed])

  // Progressive loading: poster -> canvas-loading -> basic-ready -> complete
  useEffect(() => {
    updateLoading('canvas-loading')
    const timer = setTimeout(() => updateLoading('basic-ready'), 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreated = useCallback((state: { gl: WebGLRenderer }) => {
    glRef.current = state.gl
    setCanvasEl(state.gl.domElement)
    state.gl.setClearColor(0x000000, 0)
    updateLoading('canvas-loading')
    setTimeout(() => updateLoading('basic-ready'), 300)
    setTimeout(() => updateLoading('complete'), 1200)
  }, [updateLoading])

  if (quality === 'fallback' || contextFailed) {
    return fallback ? <>{fallback}</> : null
  }

  return (
    <Canvas
      ref={canvasRef}
      className={className}
      camera={{
        position: sceneConfig.camera.position,
        fov: sceneConfig.camera.fov,
        near: sceneConfig.camera.near,
        far: sceneConfig.camera.far,
      }}
      dpr={dpr}
      gl={{
        antialias: quality !== 'low',
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: sceneConfig.toneMapping.exposure,
      }}
      frameloop={reduced ? 'demand' : 'always'}
      onCreated={handleCreated}
    >
      {canvasEl && (
        <ContextLossMonitor
          canvas={canvasEl}
          onLost={() => {
            setContextFailed(true)
            updateLoading('fallback')
            onContextLost?.()
          }}
          onRestored={() => {
            setContextFailed(false)
            updateLoading('complete')
            onContextRestored?.()
          }}
          onPermanentLoss={() => {
            setContextFailed(true)
            updateLoading('fallback')
            onContextLost?.()
          }}
        />
      )}
      {children}
    </Canvas>
  )
}
