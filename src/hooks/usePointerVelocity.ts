import { useEffect, useRef } from 'react'
import { useMotionValue } from 'framer-motion'

export function usePointerVelocity(): ReturnType<typeof useMotionValue<number>> {
  const velocity = useMotionValue(0)
  const lastPos = useRef({ x: 0, y: 0, time: 0 })
  const smoothed = useRef(0)
  const rafId = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      const dt = now - lastPos.current.time
      if (dt > 0 && dt < 120) {
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const raw = (dist / dt) * 16.67
        smoothed.current = raw * 0.3 + smoothed.current * 0.7
      }
      lastPos.current = { x: e.clientX, y: e.clientY, time: now }
    }

    const tick = () => {
      smoothed.current *= 0.9
      velocity.set(smoothed.current)
      rafId.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [velocity])

  return velocity
}
