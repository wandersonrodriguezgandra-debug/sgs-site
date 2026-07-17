'use client'

import { useState, useEffect } from 'react'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { GraphicsQuality } from '@/types/three'

function estimateDevicePerformance(): number {
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }

  let score = 0

  if (nav.deviceMemory !== undefined) {
    score += nav.deviceMemory * 10
  } else {
    score += 32
  }

  if (nav.hardwareConcurrency !== undefined) {
    score += nav.hardwareConcurrency * 5
  } else {
    score += 40
  }

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  if (!isMobile) score += 20

  return score
}

function isTrulyMobileDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobileUA = /mobi|android|iphone|ipod|windows phone/i.test(userAgent)
  
  if (!isMobileUA) return false

  // Mesmo se mobile UA, verificar se tem características de desktop
  const isTablet = /ipad|android(?!.*mobi)|windows phone/i.test(userAgent)
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const hasHover = window.matchMedia('(hover: hover)').matches
  
  // Se tem pointer fine OU hover (indicadores de mouse/trackpad), é desktop
  if (hasFinePointer || hasHover) return false
  
  // Se é tablet com pouco pointer coarse, pode ter touchpad
  if (isTablet && !hasCoarsePointer) return false

  return true
}

export function useGraphicsQuality(): GraphicsQuality {
  const webgl = useWebGLSupport()
  const reduced = useReducedMotion()
  const [quality, setQuality] = useState<GraphicsQuality>('fallback')
  const [debugOverride] = useState(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const override = params.get('graphicsQuality')
    return override && ['ultra', 'high', 'medium', 'low', 'fallback'].includes(override)
      ? override as GraphicsQuality
      : null
  })

  useEffect(() => {
    // Se há override via URL, usar
    if (debugOverride) {
      setQuality(debugOverride)
      if (typeof window !== 'undefined') {
        console.log(`✓ Graphics quality override applied: ${debugOverride}`)
      }
      return
    }

    if (!webgl.supported) {
      setQuality('fallback')
      return
    }

    if (reduced) {
      setQuality('low')
      return
    }

    const perfScore = estimateDevicePerformance()
    const isMobile = isTrulyMobileDevice()

    if (isMobile) {
      if (perfScore > 60 && webgl.contextType === 'webgl2') {
        setQuality('medium')
      } else {
        setQuality('low')
      }
      return
    }

    // Desktop
    if (perfScore > 110 && webgl.contextType === 'webgl2') {
      setQuality('ultra')
    } else if (perfScore > 70 && webgl.contextType === 'webgl2') {
      setQuality('high')
    } else if (perfScore > 40) {
      setQuality('medium')
    } else {
      setQuality('low')
    }
  }, [webgl.supported, webgl.contextType, reduced, debugOverride])

  return quality
}
