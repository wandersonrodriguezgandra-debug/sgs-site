import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

interface MaskedTextRevealProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  delay?: number
  stagger?: number
  duration?: number
  once?: boolean
}

export default function MaskedTextReveal({
  text,
  className,
  as: Tag = 'div',
  delay = 0,
  stagger = 0.04,
  duration = 0.6,
  once: _once = true,
}: MaskedTextRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  const words = text.split(' ')

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag ref={ref} className={cn('inline', className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="relative inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration,
              delay: delay + index * stagger,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {word}
          </motion.span>
          {'\u00A0'}
        </span>
      ))}
    </Tag>
  )
}
