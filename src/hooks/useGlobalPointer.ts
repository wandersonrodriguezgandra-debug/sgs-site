import { useEffect, useRef, useState } from 'react'
import { useMotionValue } from 'framer-motion'

export interface GlobalPointerState {
  x: ReturnType<typeof useMotionValue<number>>
  y: ReturnType<typeof useMotionValue<number>>
  velocity: ReturnType<typeof useMotionValue<number>>
  isMoving: boolean
  target: EventTarget | null
  isTouch: boolean
}

export function useGlobalPointer(): GlobalPointerState {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const velocity = useMotionValue(0)
  const [isMoving, setIsMoving] = useState(false)
  const [target, setTarget] = useState<EventTarget | null>(null)
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  )

  const lastPos = useRef({ x: 0, y: 0, time: 0 })
  const smoothed = useRef(0)
  const moveTimer = useRef(0)
  const rafId = useRef(0)

  useEffect(() => {
    if (isTouch) return

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setTarget(e.target)

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

      setIsMoving(true)
      clearTimeout(moveTimer.current)
      moveTimer.current = window.setTimeout(() => setIsMoving(false), 120)
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
      clearTimeout(moveTimer.current)
    }
  }, [isTouch, x, y, velocity])

  return { x, y, velocity, isMoving, target, isTouch }
}
