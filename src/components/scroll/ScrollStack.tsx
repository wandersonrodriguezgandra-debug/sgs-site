'use client'

import {
  Children,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface ScrollStackProps {
  children: ReactNode
  className?: string
}

interface ScrollStackItemProps {
  children: ReactNode
  index: number
  total: number
}

function ScrollStackItem({ children, index, total }: ScrollStackItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const item = itemRef.current
    if (!item) return

    let animationFrame = 0

    const updateStickyOffset = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight
        const stickyOffset = Math.min(0, viewportHeight - item.offsetHeight)
        item.style.top = `${Math.round(stickyOffset)}px`
      })
    }

    const resizeObserver = new ResizeObserver(updateStickyOffset)
    resizeObserver.observe(item)
    window.addEventListener('resize', updateStickyOffset)
    window.visualViewport?.addEventListener('resize', updateStickyOffset)
    updateStickyOffset()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateStickyOffset)
      window.visualViewport?.removeEventListener('resize', updateStickyOffset)
    }
  }, [])

  return (
    <div
      ref={itemRef}
      data-scroll-stack-item
      data-stack-index={index}
      className="sticky w-full"
      style={{ zIndex: total - index }}
    >
      <div
        data-scroll-stack-surface
        data-stack-entry-side={index === 0 ? 'none' : index % 2 === 1 ? 'left' : 'right'}
        className={cn(
          'relative isolate overflow-clip bg-sgs-surface [transform-style:preserve-3d] [backface-visibility:hidden] will-change-transform',
          index > 0 && 'rounded-t-[1.5rem] shadow-[0_-24px_80px_rgba(2,12,27,0.22)] md:rounded-t-[2rem]',
        )}
      >
        {index < total - 1 && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-[60] h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
            <div
              data-scroll-stack-edge
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-[60] w-28 opacity-0 blur-sm bg-gradient-to-l from-sgs-cyan/45 via-sgs-accent/20 to-transparent"
            />
          </>
        )}

        {children}

        <div
          data-scroll-stack-shade
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-50 bg-slate-950 opacity-0"
        />
      </div>
    </div>
  )
}

export default function ScrollStack({ children, className }: ScrollStackProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const items = Children.toArray(children)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced || items.length < 2) return

    let cancelled = false
    let context: { revert: () => void } | null = null
    let stackResizeObserver: ResizeObserver | null = null
    let refreshTimer = 0

    async function initializeStackMotion() {
      const { gsap, ScrollTrigger } = await import('@/lib/gsap')
      const currentRoot = rootRef.current
      if (cancelled || !currentRoot) return

      const stackItems = Array.from(
        currentRoot.querySelectorAll<HTMLElement>(':scope > [data-scroll-stack-item]'),
      )

      context = gsap.context(() => {
        stackItems.slice(0, -1).forEach((item, index) => {
          const nextItem = stackItems[index + 1]
          const currentSurface = item.querySelector<HTMLElement>('[data-scroll-stack-surface]')
          const shade = item.querySelector<HTMLElement>('[data-scroll-stack-shade]')
          const nextSurface = nextItem.querySelector<HTMLElement>('[data-scroll-stack-surface]')
          const currentEdge = item.querySelector<HTMLElement>('[data-scroll-stack-edge]')

          if (currentSurface) {
            gsap.fromTo(
              currentSurface,
              {
                scale: 1,
                xPercent: 0,
                rotationY: 0,
                rotationZ: 0,
                skewY: 0,
                boxShadow: '0 0 0 rgba(2, 12, 27, 0)',
              },
              {
                scale: 0.97,
                xPercent: 108,
                rotationY: 22,
                rotationZ: 1.8,
                skewY: -1.5,
                boxShadow: '34px 18px 80px rgba(2, 12, 27, 0.38)',
                transformPerspective: 1600,
                force3D: true,
                immediateRender: false,
                ease: 'none',
                scrollTrigger: {
                  trigger: nextItem,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          if (shade) {
            gsap.to(shade, {
              opacity: 0.18,
              ease: 'none',
              scrollTrigger: {
                trigger: nextItem,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6,
              },
            })
          }

          if (nextSurface) {
            gsap.fromTo(
              nextSurface,
              {
                xPercent: 0,
                y: () => -(window.visualViewport?.height ?? window.innerHeight) * 0.18,
                rotationY: -4,
                rotationZ: 0,
                transformPerspective: 1600,
                transformOrigin: 'center top',
              },
              {
                xPercent: 0,
                y: 0,
                rotationY: 0,
                rotationZ: 0,
                ease: 'none',
                force3D: true,
                immediateRender: false,
                scrollTrigger: {
                  trigger: nextItem,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            )
          }

          if (currentEdge) {
            gsap.fromTo(
              currentEdge,
              { opacity: 0 },
              {
                opacity: 0.98,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                  trigger: nextItem,
                  start: 'top bottom',
                  end: 'top 20%',
                  scrub: 0.6,
                },
              },
            )
          }

        })
      }, currentRoot)

      stackResizeObserver = new ResizeObserver(() => {
        window.clearTimeout(refreshTimer)
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120)
      })
      stackResizeObserver.observe(currentRoot)
      ScrollTrigger.refresh()
    }

    void initializeStackMotion()

    return () => {
      cancelled = true
      window.clearTimeout(refreshTimer)
      stackResizeObserver?.disconnect()
      context?.revert()
    }
  }, [items.length, reduced])

  if (reduced) {
    return <div data-testid="scroll-stack" className={cn('relative', className)}>{items}</div>
  }

  return (
    <div
      ref={rootRef}
      data-testid="scroll-stack"
      className={cn('relative isolate overflow-visible', className)}
    >
      {items.map((child, index) => (
        <ScrollStackItem key={index} index={index} total={items.length}>
          {child}
        </ScrollStackItem>
      ))}
    </div>
  )
}
