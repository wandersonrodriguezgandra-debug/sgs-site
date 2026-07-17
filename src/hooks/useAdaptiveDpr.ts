'use client'

import { useRef, useMemo } from 'react'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import type { GraphicsQuality } from '@/types/three'

function getMaxDpr(): number {
  if (typeof window === 'undefined') return 1
  return Math.min(window.devicePixelRatio, 2)
}

function getDprForQuality(quality: GraphicsQuality): [number, number] {
  switch (quality) {
    case 'ultra':
      return [1, Math.min(getMaxDpr(), 2)]
    case 'high':
      return [1, Math.min(getMaxDpr(), 2)]
    case 'medium':
      return [1, Math.min(getMaxDpr(), 1.5)]
    case 'low':
      return [1, 1]
    case 'fallback':
      return [1, 1]
  }
}

export function useAdaptiveDpr(): [number, number] {
  const quality = useGraphicsQuality()
  const dprCache = useRef<[number, number]>([1, 1])

  return useMemo(() => {
    const dpr = getDprForQuality(quality)
    const cached = dprCache.current
    if (dpr[0] !== cached[0] || dpr[1] !== cached[1]) {
      dprCache.current = dpr
    }
    return dprCache.current
  }, [quality])
}
