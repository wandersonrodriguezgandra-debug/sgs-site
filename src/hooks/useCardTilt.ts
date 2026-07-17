import { useCallback, useMemo, useState } from 'react'
import { useMotionValue, useMotionTemplate } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

interface UseCardTiltOptions {
  intensity?: number
  perspective?: number
  scale?: number
  glare?: boolean
  disabled?: boolean
}

interface GlareStyle {
  background: ReturnType<typeof useMotionTemplate>
  opacity: ReturnType<typeof useMotionValue<number>>
  pointerEvents: 'none'
  position: 'absolute'
  inset: number
  borderRadius: string
}

type TiltStyle = Record<string, unknown>

export function useCardTilt({
  intensity = 5,
  perspective = 1000,
  scale = 1.015,
  glare: enableGlare = true,
  disabled = false,
}: UseCardTiltOptions = {}) {
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const isDisabled = disabled || reducedMotion || isTouch

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useMotionValue(0)

  const [isHovered, setIsHovered] = useState(false)

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) / (rect.width / 2)
      const deltaY = (e.clientY - centerY) / (rect.height / 2)

      rotateX.set(-deltaY * intensity)
      rotateY.set(deltaX * intensity)

      if (enableGlare) {
        const pctX = ((e.clientX - rect.left) / rect.width) * 100
        const pctY = ((e.clientY - rect.top) / rect.height) * 100
        glareX.set(pctX)
        glareY.set(pctY)
        glareOpacity.set(1)
      }
    },
    [intensity, enableGlare, isDisabled, rotateX, rotateY, glareX, glareY, glareOpacity]
  )

  const onMouseLeave = useCallback(() => {
    if (isDisabled) return
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
    setIsHovered(false)
  }, [isDisabled, rotateX, rotateY, glareOpacity])

  const onMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const style: TiltStyle = useMemo(
    () =>
      isDisabled
        ? {}
        : {
            transformPerspective: perspective,
            rotateX,
            rotateY,
            scale: isHovered ? scale : 1,
            transformStyle: 'preserve-3d',
            transition: { type: 'spring', stiffness: 300, damping: 30 },
          },
    [isDisabled, perspective, rotateX, rotateY, isHovered, scale]
  )

  const glareStyle: GlareStyle | Record<string, unknown> = useMemo(
    () =>
      !enableGlare || isDisabled
        ? {}
        : {
            background: glareBackground,
            opacity: glareOpacity,
            pointerEvents: 'none' as const,
            position: 'absolute' as const,
            inset: 0,
            borderRadius: 'inherit',
          },
    [enableGlare, isDisabled, glareBackground, glareOpacity]
  )

  return {
    style,
    glareStyle,
    onMouseMove,
    onMouseLeave,
    onMouseEnter,
    isHovered,
  }
}
