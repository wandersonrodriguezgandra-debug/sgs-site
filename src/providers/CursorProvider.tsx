import type { ReactNode } from 'react'
import { CursorProvider as CursorContextProvider } from '@/hooks/useCursorContext'
import { PointerProvider } from '@/providers/PointerProvider'
import { CinematicCursor } from '@/components/interaction/CinematicCursor'

export default function CursorProvider({ children }: { children: ReactNode }) {
  return (
    <CursorContextProvider>
      <PointerProvider>
        {children}
        <CinematicCursor />
      </PointerProvider>
    </CursorContextProvider>
  )
}

export { CursorProvider }
