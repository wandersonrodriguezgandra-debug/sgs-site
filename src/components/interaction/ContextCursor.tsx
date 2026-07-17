'use client'

import { useEffect, useState } from 'react'
import { m, useSpring, useTransform } from 'framer-motion'
import { usePointerContext } from '@/providers/PointerContext'
import { useCursorContext } from '@/hooks/CursorContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ContextStyle {
  size: number
  fill?: boolean
  text?: string
  scale?: number
}

const contextConfig: Record<string, ContextStyle> = {
  default: { size: 32 },
  link: { size: 40, fill: true },
  view: { size: 44, text: '👁' },
  open: { size: 44, scale: 1.15 },
  play: { size: 44, text: '▶' },
  explore: { size: 44 },
  contact: { size: 36 },
}

function ContextCursor() {
  const prefersReducedMotion = useReducedMotion()
  const { x, y, velocity, isTouch } = usePointerContext()
  const { context, label } = useCursorContext()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  const springX = useSpring(x, { stiffness: 250, damping: 25 })
  const springY = useSpring(y, { stiffness: 250, damping: 25 })
  const dotSpringX = useSpring(x, { stiffness: 300, damping: 20 })
  const dotSpringY = useSpring(y, { stiffness: 300, damping: 20 })

  const rawScale = useTransform(velocity, [0, 18], [1, 1.12])
  const ringScale = useSpring(rawScale, { stiffness: 350, damping: 30 })

  const labelX = useTransform(x, (v) => v)
  const labelY = useTransform(y, (v) => v + 24)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const unsub = velocity.on('change', (v: number) => {
      setIsMoving(v > 2)
    })
    return unsub
  }, [velocity])

  useEffect(() => {
    if (!isDesktop || isTouch || prefersReducedMotion) return

    const styleId = 'sgs-cursor-style'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = `
        @media (pointer: fine) and (hover: hover) {
          html.sgs-cursor-active, html.sgs-cursor-active * {
            cursor: none !important;
          }
        }
      `
      document.head.appendChild(styleEl)
    }
    document.documentElement.classList.add('sgs-cursor-active')

    return () => {
      document.documentElement.classList.remove('sgs-cursor-active')
    }
  }, [isDesktop, isTouch, prefersReducedMotion])

  if (!isDesktop || isTouch || prefersReducedMotion) return null

  const config = contextConfig[context] ?? contextConfig.default

  return (
    <>
      <m.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ x: dotSpringX, y: dotSpringY, willChange: isMoving ? 'transform' : 'auto' }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sgs-accent" />
      </m.div>

      <m.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: springX,
          y: springY,
          scale: ringScale,
          willChange: isMoving ? 'transform' : 'auto',
        }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border transition-colors duration-300"
          style={{
            width: config.size,
            height: config.size,
            borderColor: 'rgba(0, 86, 179, 0.5)',
            backgroundColor: config.fill ? 'rgba(0, 86, 179, 0.08)' : 'transparent',
          }}
        >
          {config.text && (
            <span className="text-xs leading-none">{config.text}</span>
          )}
        </div>
      </m.div>

      <m.div
        className="pointer-events-none fixed top-0 left-0 z-[9997]"
        style={{ x: labelX, y: labelY }}
      >
        <div
          className="-translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-300"
          style={{
            color: '#0056B3',
            backgroundColor: 'rgba(0, 86, 179, 0.08)',
            opacity: label ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          {label}
        </div>
      </m.div>
    </>
  )
}

export default ContextCursor
export { ContextCursor }
