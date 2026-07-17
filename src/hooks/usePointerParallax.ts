import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

interface ParallaxOffset {
  x: number
  y: number
}

export function usePointerParallax(
  ref: React.RefObject<HTMLElement | null>
): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 })
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (reducedMotion || isTouch) {
      setOffset({ x: 0, y: 0 })
      return
    }

    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null

        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

        setOffset({ x, y })
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [ref, reducedMotion, isTouch])

  return offset
}
