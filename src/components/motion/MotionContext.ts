import { createContext, useContext } from 'react'

export interface MotionContextValue {
  reducedMotion: boolean
  isTouch: boolean
}

export const MotionContext = createContext<MotionContextValue>({
  reducedMotion: false,
  isTouch: false,
})

export function useMotionContext() {
  return useContext(MotionContext)
}
