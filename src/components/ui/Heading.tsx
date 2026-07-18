'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'
type HeadingSize = 'display' | 'h1' | 'h2' | 'h3' | 'h4'
type HeadingAlign = 'left' | 'center'

interface HeadingProps {
  as?: HeadingLevel
  size?: HeadingSize
  children: ReactNode
  className?: string
  align?: HeadingAlign
  /** Desliga o reveal kinético — usar quando o Heading já está dentro de outro reveal orquestrado. */
  reveal?: boolean
}

const sizeStyles: Record<HeadingSize, string> = {
  display: 'text-4xl md:text-5xl md:leading-[3.75rem] font-bold',
  h1: 'text-3xl md:text-4xl font-bold',
  h2: 'text-2xl md:text-3xl font-semibold',
  h3: 'text-xl md:text-2xl font-semibold',
  h4: 'text-lg md:text-xl font-medium',
}

const alignStyles: Record<HeadingAlign, string> = {
  left: 'text-left',
  center: 'text-center',
}

/**
 * Tipografia cinética (assinatura Zajno / Mat Voyce): cada linha do heading
 * vira uma máscara (overflow hidden) e as palavras sobem de dentro dela com
 * leve rotação ao entrar no viewport. Roda uma única vez por elemento.
 * Ativado sob demanda. Os títulos permanecem estáticos por padrão para não
 * competir com a entrada lateral das próprias seções.
 */
export default function Heading({
  as: Tag = 'h2',
  size,
  children,
  className,
  align = 'left',
  reveal = false,
}: HeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null!)
  const reduced = useReducedMotion()
  const canSplit = reveal && typeof children === 'string'

  useEffect(() => {
    if (!canSplit || reduced || !ref.current) return

    let ctx: { revert: () => void } | null = null
    let split: { revert: () => void; words: Element[] } | null = null
    let cancelled = false

    async function init() {
      const { gsap, SplitText } = await import('@/lib/gsap')
      if (cancelled || !ref.current) return

      ctx = gsap.context(() => {
        const s = new SplitText(ref.current, {
          type: 'lines,words',
          linesClass: 'sgs-split-line',
        })
        split = s

        gsap.from(s.words, {
          yPercent: 115,
          rotateZ: 3,
          opacity: 0,
          duration: 0.9,
          stagger: 0.025,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })
    }

    init()

    return () => {
      cancelled = true
      ctx?.revert()
      split?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSplit, reduced])

  return (
    <Tag
      ref={ref}
      className={cn(
        'font-heading text-sgs-text-primary',
        sizeStyles[size ?? Tag],
        alignStyles[align],
        className
      )}
    >
      {children}
    </Tag>
  )
}
