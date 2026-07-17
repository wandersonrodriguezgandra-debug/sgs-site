'use client'

import { useRef, useState, type ReactNode, type MouseEvent, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type TiltIntensity = 'subtle' | 'medium' | 'high'
type SpotlightIntensity = 'subtle' | 'medium'
type DepthLevel = 'flat' | 'shallow' | 'deep'

interface InteractiveSurfaceProps {
  children: ReactNode
  className?: string
  tilt?: TiltIntensity | false
  spotlight?: SpotlightIntensity | false
  glare?: boolean
  depth?: DepthLevel
  disabled?: boolean
}

const tiltDegree: Record<TiltIntensity, number> = {
  subtle: 3,
  medium: 8,
  high: 15,
}

const depthShadow: Record<DepthLevel, string> = {
  flat: '',
  shallow: 'shadow-md',
  deep: 'shadow-xl',
}

function InteractiveSurface({
  children,
  className,
  tilt = false,
  spotlight = false,
  glare = false,
  depth = 'shallow',
  disabled = false,
}: InteractiveSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const isDisabled = disabled || prefersReducedMotion

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setSpotlightPos({ x, y })

    if (tilt) {
      const maxDeg = tiltDegree[tilt]
      const rotateX = ((y - 50) / 50) * -maxDeg
      const rotateY = ((x - 50) / 50) * maxDeg
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
  }, [tilt])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    setIsHovered(false)
  }, [])

  if (isDisabled) {
    return (
      <div className={cn(depth !== 'flat' && depthShadow[depth], className)}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-xl',
        depth !== 'flat' && depthShadow[depth],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s ease',
      }}
    >
      {children}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,${isHovered ? 0.15 : 0}) 0%, transparent 60%)`,
            transition: 'background 0.3s ease',
          }}
        />
      )}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
            background: `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 60%, transparent 70%)`,
          }}
        />
      )}
    </div>
  )
}

export default InteractiveSurface
export { InteractiveSurface }
