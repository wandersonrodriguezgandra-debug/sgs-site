'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type TransitionDirection = 'left' | 'right' | 'up'

interface SectionTransitionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: TransitionDirection
}

/**
 * Entrada lateral de página com progressive enhancement. O conteúdo nasce
 * visível e só recebe movimento quando o navegador confirma a interseção;
 * assim uma falha de animação nunca deixa uma seção fora da tela.
 */
export default function SectionTransition({
  children,
  className,
  delay = 0,
  direction = 'up',
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null!)
  const reduced = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (reduced || !element) return

    let animation: Animation | null = null
    const offset = direction === 'left'
      ? 'translate3d(-72px, 0, 0)'
      : direction === 'right'
        ? 'translate3d(72px, 0, 0)'
        : 'translate3d(0, 48px, 0)'

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      animation = element.animate(
        [
          { opacity: 0.35, transform: offset },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        {
          duration: 900,
          delay: delay * 1000,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        },
      )
      observer.disconnect()
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' })

    observer.observe(element)

    return () => {
      observer.disconnect()
      animation?.cancel()
    }
  }, [delay, direction, reduced])

  return (
    <div
      ref={ref}
      data-page-transition={direction}
      className={cn('relative overflow-clip', className)}
    >
      {children}
    </div>
  )
}
