'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { CursorContext } from '@/hooks/CursorContext'
import type { CursorVariant } from '@/hooks/CursorContext'

export function CursorProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState('default')
  const [label, setLabel] = useState('')
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default')
  const [cursorText, setCursorText] = useState('')

  return (
    <CursorContext.Provider
      value={{
        context,
        label,
        setContext,
        setLabel,
        cursorVariant,
        cursorText,
        setCursorVariant,
        setCursorText,
      }}
    >
      {children}
    </CursorContext.Provider>
  )
}
