import { createContext, useContext } from 'react'
import type { GlobalPointerState } from '@/hooks/useGlobalPointer'

export const PointerContext = createContext<GlobalPointerState | null>(null)

export function usePointerContext(): GlobalPointerState {
  const ctx = useContext(PointerContext)
  if (!ctx) {
    throw new Error('usePointerContext must be used within a PointerProvider')
  }
  return ctx
}
