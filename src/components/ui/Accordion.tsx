import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motionTokens, cssEase } from '@/components/motion/tokens'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AccordionItem {
  id: string
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

const EASING = cssEase(motionTokens.ease.smooth)

function AccordionPanel({ id, isOpen, children }: { id: string; isOpen: boolean; children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      wrapper.style.height = isOpen ? 'auto' : '0px'
      wrapper.style.opacity = isOpen ? '1' : '0'
      return
    }

    if (reduced) {
      wrapper.style.height = isOpen ? 'auto' : '0px'
      wrapper.style.opacity = isOpen ? '1' : '0'
      return
    }

    const targetHeight = content.getBoundingClientRect().height
    const animation = wrapper.animate(
      [
        { height: isOpen ? '0px' : `${targetHeight}px`, opacity: isOpen ? 0 : 1 },
        { height: isOpen ? `${targetHeight}px` : '0px', opacity: isOpen ? 1 : 0 },
      ],
      { duration: motionTokens.duration.normal * 1000, easing: EASING, fill: 'forwards' },
    )

    return () => animation.cancel()
  }, [isOpen, reduced])

  return (
    <div
      ref={wrapperRef}
      id={id}
      role="region"
      className="overflow-hidden"
      style={{ height: 0 }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  )
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
            <AccordionPanel id={`accordion-content-${item.id}`} isOpen={isOpen}>
              <div className="px-6 pb-5 text-sgs-text-secondary leading-relaxed">
                {item.content}
              </div>
            </AccordionPanel>
          </div>
        )
      })}
    </div>
  )
}
