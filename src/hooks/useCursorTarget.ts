import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useCursorContext } from '@/hooks/CursorContext'
import type { CursorVariant } from '@/hooks/CursorContext'

function mapTypeToVariant(type: string): CursorVariant {
  switch (type) {
    case 'link': return 'link'
    case 'view': return 'card'
    case 'open':
    case 'play':
    case 'explore':
    case 'contact': return 'button'
    default: return 'default'
  }
}

export function useCursorTarget(
  ref: RefObject<HTMLElement | null>,
  type: string = 'default',
  label: string = '',
) {
  const { setContext, setLabel, setCursorVariant } = useCursorContext()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const variant = mapTypeToVariant(type)

    const handleEnter = () => { setContext(type); setLabel(label); setCursorVariant(variant) }
    const handleLeave = () => { setContext('default'); setLabel(''); setCursorVariant('default') }
    const handleFocus = () => { setContext(type); setLabel(label); setCursorVariant(variant) }
    const handleBlur = () => { setContext('default'); setLabel(''); setCursorVariant('default') }

    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('mouseleave', handleLeave)
    el.addEventListener('focus', handleFocus)
    el.addEventListener('blur', handleBlur)

    return () => {
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('mouseleave', handleLeave)
      el.removeEventListener('focus', handleFocus)
      el.removeEventListener('blur', handleBlur)
    }
  }, [ref, type, label, setContext, setLabel, setCursorVariant])
}
