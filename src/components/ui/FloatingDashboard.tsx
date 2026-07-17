'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, FileText, Bell, TrendingUp, Users, FileCheck,
} from 'lucide-react'
import { usePointerParallax } from '@/hooks/usePointerParallax'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { cn } from '@/lib/utils'

interface FloatingDashboardProps {
  className?: string
}

export default function FloatingDashboard({ className }: FloatingDashboardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const { x, y } = usePointerParallax(wrapperRef)
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()

  const rotateX = isTouch || reducedMotion ? 0 : y * -3.5
  const rotateY = isTouch || reducedMotion ? 0 : x * 3.5

  return (
    <div
      ref={wrapperRef}
      className={cn('relative w-full max-w-lg mx-auto', className)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-glow border border-white/10 bg-sgs-blue-900/80 backdrop-blur-sm will-change-transform"
        animate={
          reducedMotion
            ? {}
            : {
                y: [-3, 3],
                rotateX,
                rotateY,
              }
        }
        transition={
          reducedMotion
            ? {}
            : {
                y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                rotateX: { type: 'spring', stiffness: 150, damping: 15 },
                rotateY: { type: 'spring', stiffness: 150, damping: 15 },
              }
        }
      >
        {/* Top bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-white/40">SGS Dashboard</span>
          <div className="w-4" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Metric row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <Users size={16} className="text-sgs-blue-300 mb-1" />
              <p className="text-xs text-white/50">Colaboradores</p>
              <p className="text-sm font-semibold text-white">247</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <FileCheck size={16} className="text-green-400 mb-1" />
              <p className="text-xs text-white/50">Documentos</p>
              <p className="text-sm font-semibold text-white">1.2k</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <Bell size={16} className="text-amber-400 mb-1" />
              <p className="text-xs text-white/50">Alertas</p>
              <p className="text-sm font-semibold text-white">5</p>
            </div>
          </div>

          {/* Chart area */}
          <div className="h-16 bg-gradient-to-r from-sgs-accent/20 to-sgs-blue-600/20 rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <BarChart3 size={14} className="text-sgs-accent-light" />
              Gráfico de indicadores — preview
            </div>
          </div>

          {/* Documents list */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-white/40 mb-3">Documentos recentes</p>
            <div className="space-y-2">
              {[
                'DDS 15/07 — Segurança com EPI',
                'APR — Manutenção Elétrica',
                'Inspeção — Setor A',
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                  <FileText size={12} className="text-sgs-blue-300" />
                  {doc}
                </div>
              ))}
            </div>
          </div>

          {/* Footer indicator bar */}
          <div className="flex items-center justify-between text-[10px] text-white/30">
            <span>✓ Dados atualizados</span>
            <span className="flex items-center gap-1">
              <TrendingUp size={10} className="text-green-400" />
              +12% este mês
            </span>
          </div>
        </div>
      </motion.div>

      {/* Reflection effect */}
      {!reducedMotion && (
        <div
          className="absolute -bottom-6 left-[10%] right-[10%] h-16 bg-gradient-to-b from-sgs-accent/5 to-transparent rounded-full blur-xl opacity-60"
          aria-hidden
        />
      )}

      {/* Decorative glows */}
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-sgs-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-sgs-blue-400/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}
