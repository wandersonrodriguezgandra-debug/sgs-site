import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: string
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div
      className={cn('divide-y divide-sgs-border overflow-hidden rounded-2xl border border-sgs-border bg-white', className)}
    >
      {items.map(item => {
        const isOpen = openId === item.id

        return (
          <div key={item.id}>
            <button
              type="button"
              data-testid={`accordion-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-heading text-base font-medium text-sgs-text-primary transition-colors hover:bg-sgs-surface-secondary sm:px-6 sm:text-lg"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-sgs-text-tertiary transition-transform duration-300 shrink-0',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-sgs-text-secondary leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
