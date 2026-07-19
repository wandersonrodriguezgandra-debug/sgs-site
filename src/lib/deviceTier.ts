export type DeviceTier = 'high' | 'low'

// Best-effort read of device capability signals — not all browsers expose
// deviceMemory/hardwareConcurrency, so absence is treated as capable rather
// than penalized. Shared by any WebGL/canvas feature that needs to scale
// particle counts or texture resolution by hardware headroom.
export function getDeviceTier(): DeviceTier {
  if (typeof navigator === 'undefined') return 'low'

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency

  if (typeof memory === 'number' && memory <= 4) return 'low'
  if (typeof cores === 'number' && cores <= 4) return 'low'

  return 'high'
}

export function getCappedPixelRatio(max = 2): number {
  if (typeof window === 'undefined') return 1
  return Math.min(window.devicePixelRatio || 1, max)
}
