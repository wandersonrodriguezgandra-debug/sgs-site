// Fonte única de verdade para "reduced motion", com override de QA.
//   ?motion=on   -> força motion ligado (reduced = false)
//   ?motion=off  -> força reduced-motion (reduced = true)
// Persistido em sessionStorage para sobreviver a navegações SPA.
// SEM o parâmetro, lê o media query real — comportamento de produção inalterado.

function readMotionOverride(): boolean | null {
  if (typeof window === 'undefined') return null
  try {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('motion')
    if (q === 'on') {
      sessionStorage.setItem('sgs:motion', 'on')
      return false
    }
    if (q === 'off') {
      sessionStorage.setItem('sgs:motion', 'off')
      return true
    }
    const stored = sessionStorage.getItem('sgs:motion')
    if (stored === 'on') return false
    if (stored === 'off') return true
  } catch {
    // sessionStorage indisponível — ignora override
  }
  return null
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const override = readMotionOverride()
  if (override !== null) return override
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
