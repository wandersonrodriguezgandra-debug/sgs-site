import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

interface SplitTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  delay?: number
  stagger?: number
  by?: 'word' | 'char'
  duration?: number
}

export default function SplitText({
  children,
  className,
  as: Tag = 'div',
  delay = 0,
  stagger = 0.04,
  by = 'word',
  duration = 0.5,
}: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  const items = by === 'word' ? children.split(' ') : children.split('')

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag ref={ref} className={cn('inline', className)}>
      {items.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          className={by === 'word' ? 'inline-block whitespace-nowrap' : 'inline-block'}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: -90 }}
          transition={{
            duration,
            delay: delay + index * stagger,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          {item}
          {by === 'word' && index < items.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}
