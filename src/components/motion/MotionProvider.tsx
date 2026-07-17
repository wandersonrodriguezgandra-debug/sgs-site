'use client'

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { MotionContext } from '@/components/motion/MotionContext'

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()

  return (
    <MotionContext.Provider value={{ reducedMotion, isTouch }}>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </MotionContext.Provider>
  )
}
