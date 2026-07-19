// Shared with HomePage's lazy placeholder so the reserved height matches
// the variant ScannerSection will actually mount, without importing the
// (GSAP-heavy) component module eagerly.
export function shouldPin(): boolean {
  if (typeof window === 'undefined') return false
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  return !reduced && !isTouch
}
