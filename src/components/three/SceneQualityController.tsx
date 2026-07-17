'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { PerformanceMonitor } from '@react-three/drei'
import type { GraphicsQuality } from '@/types/three'
import type { ReactNode } from 'react'

interface SceneQualityControllerProps {
  children: ReactNode
  onQualityChange?: (quality: GraphicsQuality) => void
}

export default function SceneQualityController({
  children,
  onQualityChange,
}: SceneQualityControllerProps) {
  const baseQuality = useGraphicsQuality()
  const currentQuality = useRef<GraphicsQuality>(baseQuality)
  const fallbackCount = useRef(0)

  useEffect(() => {
    currentQuality.current = baseQuality
  }, [baseQuality])

  const handlePerformanceChange = useCallback(() => {
    if (fallbackCount.current >= 2) return

    fallbackCount.current += 1

    if (currentQuality.current === 'high') {
      currentQuality.current = 'medium'
      onQualityChange?.('medium')
    } else if (currentQuality.current === 'medium') {
      currentQuality.current = 'low'
      onQualityChange?.('low')
    }
  }, [onQualityChange])

  const handleFallback = useCallback(() => {
    if (currentQuality.current !== 'low') {
      currentQuality.current = 'low'
      onQualityChange?.('low')
    }
  }, [onQualityChange])

  if (baseQuality === 'fallback' || baseQuality === 'low') {
    return <>{children}</>
  }

  return (
    <PerformanceMonitor
      factor={1}
      flipflops={3}
      onChange={handlePerformanceChange}
      onFallback={handleFallback}
    >
      {children}
    </PerformanceMonitor>
  )
}
