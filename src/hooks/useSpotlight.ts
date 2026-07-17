import { useCallback, useMemo, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

interface UseSpotlightOptions {
  size?: number
  opacity?: number
  disabled?: boolean
}

export function useSpotlight({
  size = 400,
  opacity = 0.18,
  disabled = false,
}: UseSpotlightOptions = {}) {
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const isDisabled = disabled || reducedMotion || isTouch

  const [active, setActive] = useState(false)

  const style: React.CSSProperties = useMemo(
    () =>
      isDisabled
        ? {}
        : {
            background: `radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(255,255,255,${opacity}) 0%, transparent ${size}px)`,
            opacity: active ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          },
    [isDisabled, opacity, size, active]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      e.currentTarget.style.setProperty('--spotlight-x', `${x}%`)
      e.currentTarget.style.setProperty('--spotlight-y', `${y}%`)
      setActive(true)
    },
    [isDisabled]
  )

  const onMouseLeave = useCallback(() => {
    setActive(false)
  }, [])

  return { style, onMouseMove, onMouseLeave }
}
