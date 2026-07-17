'use client'

import { motion } from 'framer-motion'
import { CheckCircle, FileText, Bell, TrendingUp } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

// DADO DEMONSTRATIVO — substituir por dados reais ou captura oficial.
const cards = [
  {
    icon: <CheckCircle size={16} className="text-green-400" />,
    label: 'Documentos em dia',
    value: '94%',
    accent: 'border-green-500/20 bg-green-500/5',
    desktopPos: 'top-[5%] -right-10',
    mobilePos: '-top-3 -right-6',
    floatY: [0, -6],
    duration: 4.5,
    delay: 1.9,
  },
  {
    icon: <FileText size={16} className="text-sgs-blue-300" />,
    label: 'Inspeções realizadas',
    value: '156',
    accent: 'border-sgs-accent/20 bg-sgs-accent/5',
    desktopPos: 'top-[30%] -left-12',
    mobilePos: '-bottom-4 -left-6',
    floatY: [0, 5],
    duration: 5.5,
    delay: 2.1,
  },
  {
    icon: <TrendingUp size={16} className="text-emerald-400" />,
    label: 'Conformidade',
    value: '87%',
    accent: 'border-emerald-500/20 bg-emerald-500/5',
    desktopPos: 'top-[60%] -right-8',
    mobilePos: undefined,
    floatY: [0, -4],
    duration: 5,
    delay: 2.3,
  },
  {
    icon: <Bell size={16} className="text-amber-400" />,
    label: 'Treinamentos',
    value: '12 este mês',
    accent: 'border-amber-500/20 bg-amber-500/5',
    desktopPos: 'bottom-[10%] -left-10',
    mobilePos: undefined,
    floatY: [0, 7],
    duration: 6,
    delay: 2.5,
  },
]

interface FloatingCardsProps {
  className?: string
}

export default function FloatingCards({ className }: FloatingCardsProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          className={cn(
            'absolute hidden md:flex flex-col items-center justify-center',
            'w-28 h-20 backdrop-blur-md rounded-xl border shadow-lg p-3',
            card.accent,
            'hidden',
            card.desktopPos,
            index < 2 && 'md:flex',
            index >= 2 && 'lg:flex',
          )}
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
          animate={
            reducedMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  y: card.floatY,
                }
          }
          transition={
            reducedMotion
              ? { duration: 0.3, delay: card.delay }
              : {
                  opacity: { duration: 0.5, delay: card.delay },
                  scale: { duration: 0.5, delay: card.delay },
                  y: {
                    duration: card.duration,
                    repeat: Infinity,
                    repeatType: 'reverse' as const,
                    ease: 'easeInOut',
                    delay: card.delay,
                  },
                }
          }
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            {card.icon}
            <span className="text-[10px] font-medium text-white/70">{card.label}</span>
          </div>
          <span className="text-sm font-bold text-white">{card.value}</span>
        </motion.div>
      ))}

      {/* Mobile cards — always 2 */}
      <div className="flex md:hidden absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-3 right-2 w-24 h-16 backdrop-blur-md rounded-xl border border-green-500/20 bg-green-500/5 shadow-lg p-2.5 flex flex-col items-center justify-center"
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
          animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <div className="flex items-center gap-1 mb-0.5">
            <CheckCircle size={12} className="text-green-400" />
            <span className="text-[9px] font-medium text-white/70">Documentos</span>
          </div>
          <span className="text-xs font-bold text-white">94%</span>
        </motion.div>
        <motion.div
          className="absolute -bottom-2 left-2 w-24 h-16 backdrop-blur-md rounded-xl border border-sgs-accent/20 bg-sgs-accent/5 shadow-lg p-2.5 flex flex-col items-center justify-center"
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
          animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2.1 }}
        >
          <div className="flex items-center gap-1 mb-0.5">
            <FileText size={12} className="text-sgs-blue-300" />
            <span className="text-[9px] font-medium text-white/70">Inspeções</span>
          </div>
          <span className="text-xs font-bold text-white">156</span>
        </motion.div>
      </div>
    </div>
  )
}
