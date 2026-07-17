'use client'

import { useEffect, useCallback } from 'react'
import { useState } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { usePointerContext } from '@/providers/PointerContext'
import { useCursorContext } from '@/hooks/CursorContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const TEXT_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'label', 'span',
  'strong', 'em', 'code', 'blockquote', 'figcaption', 'cite',
])

const INTERACTIVE_TAGS = new Set(['button', 'a', 'input', 'textarea', 'select'])

function getDetectedVariant(el: EventTarget | null): string | null {
  if (!el || !(el instanceof Element)) return null

  if (el instanceof HTMLElement) {
    const dv = el.dataset.cursorVariant
    if (dv) return dv
  }

  const tag = el.tagName?.toLowerCase()
  const role = (el as HTMLElement).getAttribute?.('role')

  if (tag === 'button' || role === 'button') return 'button'
  if (tag === 'a' && (el as HTMLAnchorElement).href) return 'link'
  if (INTERACTIVE_TAGS.has(tag)) return 'text'
  if ((el as HTMLElement).isContentEditable) return 'text'
  if (tag === 'video' || tag === 'canvas') return 'card'

  return null
}

function isInsideInteractive(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName?.toLowerCase()
  if (INTERACTIVE_TAGS.has(tag) || (el as HTMLElement).getAttribute?.('role') === 'button') return true
  return el.parentElement ? isInsideInteractive(el.parentElement) : false
}

const VARIANT_CONFIG: Record<string, { ringSize: number; dotOpacity: number; ringOpacity: number; glowEnabled: boolean }> = {
  default: { ringSize: 32, dotOpacity: 1, ringOpacity: 1, glowEnabled: false },
  button: { ringSize: 48, dotOpacity: 0, ringOpacity: 1, glowEnabled: true },
  link: { ringSize: 48, dotOpacity: 0, ringOpacity: 1, glowEnabled: true },
  text: { ringSize: 40, dotOpacity: 0, ringOpacity: 1, glowEnabled: false },
  card: { ringSize: 48, dotOpacity: 0, ringOpacity: 0.4, glowEnabled: false },
  hidden: { ringSize: 0, dotOpacity: 0, ringOpacity: 0, glowEnabled: false },
}

function CinematicCursor() {
  const prefersReducedMotion = useReducedMotion()
  const { x, y, isTouch } = usePointerContext()
  const { cursorVariant: contextVariant, cursorText } = useCursorContext()
  const [isDesktop, setIsDesktop] = useState(false)
  const [detectedVariant, setDetectedVariant] = useState<string | null>(null)
  const [dotOpacityVal, setDotOpacityVal] = useState(1)
  const [ringOpacityVal, setRingOpacityVal] = useState(1)
  const [glowShow, setGlowShow] = useState(false)

  const ringX = useSpring(x, { stiffness: 200, damping: 25 })
  const ringY = useSpring(y, { stiffness: 200, damping: 25 })
  const dotX = useSpring(x, { stiffness: 350, damping: 20 })
  const dotY = useSpring(y, { stiffness: 350, damping: 20 })

  const ringSizeMV = useMotionValue(32)
  const ringSize = useSpring(ringSizeMV, { stiffness: 300, damping: 30 })
  const clickScaleMV = useMotionValue(1)
  const clickScale = useSpring(clickScaleMV, { stiffness: 500, damping: 20 })

  const activeVariant = contextVariant !== 'default' ? contextVariant : (detectedVariant ?? 'default')
  const config = VARIANT_CONFIG[activeVariant] ?? VARIANT_CONFIG.default

  useEffect(() => {
    ringSizeMV.set(config.ringSize)
    setDotOpacityVal(config.dotOpacity)
    setRingOpacityVal(config.ringOpacity)
    setGlowShow(config.glowEnabled)
  }, [config.ringSize, config.dotOpacity, config.ringOpacity, config.glowEnabled, ringSizeMV])

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target
    const variant = getDetectedVariant(target)

    if (variant) {
      setDetectedVariant(variant)
      return
    }

    if (target instanceof Element && !isInsideInteractive(target)) {
      const tag = target.tagName?.toLowerCase()
      if (TEXT_TAGS.has(tag)) {
        setDetectedVariant('text')
        return
      }
    }

    setDetectedVariant(null)
  }, [])

  useEffect(() => {
    if (!isDesktop || isTouch) return
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isDesktop, isTouch, handleMouseMove])

  const handleMouseDown = useCallback(() => { clickScaleMV.set(0.85) }, [clickScaleMV])
  const handleMouseUp = useCallback(() => { clickScaleMV.set(1) }, [clickScaleMV])

  useEffect(() => {
    if (!isDesktop || isTouch) return
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDesktop, isTouch, handleMouseDown, handleMouseUp])

  useEffect(() => {
    if (!isDesktop || isTouch || prefersReducedMotion) return
    const styleId = 'sgs-cinematic-cursor-style'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = `
        @media (pointer: fine) and (hover: hover) {
          html.sgs-cinematic-active, html.sgs-cinematic-active * {
            cursor: none !important;
          }
        }
      `
      document.head.appendChild(styleEl)
    }
    document.documentElement.classList.add('sgs-cinematic-active')
    return () => {
      document.documentElement.classList.remove('sgs-cinematic-active')
    }
  }, [isDesktop, isTouch, prefersReducedMotion])

  if (!isDesktop || isTouch || prefersReducedMotion) return null

  const isExpanded = activeVariant === 'button' || activeVariant === 'link' || activeVariant === 'card'

  return (
    <div data-testid="cinematic-cursor">
      <m.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          scale: clickScale,
          opacity: dotOpacityVal,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div className="h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sgs-accent" />
      </m.div>

      <m.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          opacity: ringOpacityVal,
          scale: clickScale,
          transition: 'opacity 0.2s ease',
        }}
      >
        <m.div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
          style={{
            width: ringSize,
            height: ringSize,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid',
              borderColor: isExpanded ? 'rgba(0, 86, 179, 0.5)' : 'rgba(0, 86, 179, 0.25)',
              transition: 'border-color 0.2s ease',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 86, 179, 0.15) 0%, transparent 70%)',
              opacity: glowShow ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
          {cursorText && (
            <span className="relative text-xs font-medium text-sgs-accent leading-none z-10">
              {cursorText}
            </span>
          )}
        </m.div>
      </m.div>
    </div>
  )
}

export default CinematicCursor
export { CinematicCursor }
