'use client'

import { useState, useEffect } from 'react'

export type DeviceTier = 'ultra' | 'high' | 'medium' | 'low' | 'fallback'

interface DeviceCapability {
  tier: DeviceTier
  score: number
  isMobile: boolean
  isTouch: boolean
  gpuTier: number
  memoryGB: number
  cpuCores: number
  reducedMotion: boolean
  webgl2: boolean
}

function getWebGLSupport(): { supported: boolean; webgl2: boolean; renderer?: string } {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : undefined
      return { supported: true, webgl2: true, renderer }
    }
    const gl1 = canvas.getContext('webgl')
    if (gl1) return { supported: true, webgl2: false }
    return { supported: false, webgl2: false }
  } catch {
    return { supported: false, webgl2: false }
  }
}

function getGPUTier(renderer?: string): number {
  if (!renderer) return 1
  const u = renderer.toUpperCase()
  // High-end GPUs
  if (u.includes('RTX') || u.includes('RX 7') || u.includes('RX 6') ||
      u.includes('TITAN') || u.includes('APPLE M')) return 3
  // Mid-range
  if (u.includes('GTX 1') || u.includes('GTX 2') || u.includes('GTX 3') ||
      u.includes('RX 5') || u.includes('ARC') || u.includes('INTEL IRIS')) return 2
  // Low-end / integrated
  return 1
}

export function useDeviceCapability(): DeviceCapability {
  const [caps, setCaps] = useState<DeviceCapability>(() => ({
    tier: 'medium',
    score: 50,
    isMobile: false,
    isTouch: false,
    gpuTier: 1,
    memoryGB: 4,
    cpuCores: 2,
    reducedMotion: false,
    webgl2: false,
  }))

  useEffect(() => {
    const memoryGB = (navigator as any)?.deviceMemory ?? 4
    const cpuCores = navigator.hardwareConcurrency ?? 2
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const webgl = getWebGLSupport()
    const gpuTier = getGPUTier(webgl.renderer)

    let score = 0
    score += Math.min(memoryGB, 32) * 3
    score += Math.min(cpuCores, 16) * 4
    score += gpuTier * 15
    score += webgl.webgl2 ? 10 : webgl.supported ? 5 : 0
    if (!isMobile) score += 15

    let tier: DeviceTier = 'fallback'
    if (score >= 120 && webgl.webgl2) tier = 'ultra'
    else if (score >= 80 && webgl.webgl2) tier = 'high'
    else if (score >= 50) tier = 'medium'
    else if (score >= 25) tier = 'low'
    else tier = 'fallback'

    if (!webgl.supported && tier !== 'low') tier = 'fallback'
    if (reduced && tier === 'ultra') tier = 'high'
    if (isMobile && tier === 'ultra') tier = 'high'

    setCaps({ tier, score, isMobile, isTouch, gpuTier, memoryGB, cpuCores, reducedMotion: reduced, webgl2: webgl.webgl2 })
  }, [])

  return caps
}
