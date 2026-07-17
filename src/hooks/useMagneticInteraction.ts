import { useEffect, type RefObject } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

export function useMagneticInteraction(
  ref: RefObject<HTMLElement | null>,
  strength: number = 8,
  radius: number = 150,
  disabled: boolean = false,
) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const isActive = !disabled && !reducedMotion && !isTouch

  useEffect(() => {
    const el = ref.current
    if (!el || !isActive) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const dist = Math.sqrt(distX * distX + distY * distY)

      if (dist < radius && dist > 0) {
        const power = (1 - dist / radius) * strength
        x.set((distX / dist) * power)
        y.set((distY / dist) * power)
      } else if (dist === 0) {
        x.set(0)
        y.set(0)
      }
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, strength, radius, isActive, x, y])

  return { x: springX, y: springY }
}
