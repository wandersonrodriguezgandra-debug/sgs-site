import { Children, useMemo, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

type StaggerDirection = 'forward' | 'center'

interface StaggerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
  direction?: StaggerDirection
  delay?: number
}

function getChildVariants(direction: StaggerDirection, index: number, total: number) {
  const base = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  }

  if (direction === 'center') {
    const mid = (total - 1) / 2
    const distance = Math.abs(index - mid)
    const customDelay = distance * 0.1
    return {
      ...base,
      visible: {
        ...base.visible,
        transition: { ...base.visible.transition, delay: customDelay },
      },
    }
  }

  return base
}

export default function Stagger({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
  direction = 'forward',
  delay = 0,
}: StaggerProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: once,
  })

  const childrenArray = Children.toArray(children)
  const total = childrenArray.length

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: direction === 'center' ? 0 : staggerDelay,
      },
    },
  }), [delay, direction, staggerDelay])

  return (
    <m.div
      ref={ref}
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {childrenArray.map((child, index) => {
        const variants = getChildVariants(direction, index, total)
        return (
          <m.div key={index} variants={variants}>
            {child}
          </m.div>
        )
      })}
    </m.div>
  )
}
