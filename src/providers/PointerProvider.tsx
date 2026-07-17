import type { ReactNode } from 'react'
import { useGlobalPointer } from '@/hooks/useGlobalPointer'
import { PointerContext } from '@/providers/PointerContext'

export function PointerProvider({ children }: { children: ReactNode }) {
  const state = useGlobalPointer()
  return <PointerContext.Provider value={state}>{children}</PointerContext.Provider>
}
