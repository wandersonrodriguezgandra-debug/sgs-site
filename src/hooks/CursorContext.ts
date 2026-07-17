import { createContext, useContext } from 'react'

export type CursorVariant = 'default' | 'button' | 'link' | 'text' | 'card' | 'hidden'

export interface CursorContextValue {
  context: string
  label: string
  setContext: (context: string) => void
  setLabel: (label: string) => void
  cursorVariant: CursorVariant
  cursorText: string
  setCursorVariant: (variant: CursorVariant) => void
  setCursorText: (text: string) => void
}

export const CursorContext = createContext<CursorContextValue>({
  context: 'default',
  label: '',
  setContext: () => {},
  setLabel: () => {},
  cursorVariant: 'default',
  cursorText: '',
  setCursorVariant: () => {},
  setCursorText: () => {},
})

export function useCursorContext(): CursorContextValue {
  return useContext(CursorContext)
}
