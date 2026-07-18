'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
import { FileText, HardHat, AlertTriangle, Clock, Shield, BarChart3, Eye, Zap } from 'lucide-react'

const floatingItems = [
  { icon: FileText, label: 'APR', x: 10, y: 15, rotation: -12, delay: 0 },
  { icon: HardHat, label: 'EPI', x: 75, y: 10, rotation: 8, delay: 0.1 },
  { icon: AlertTriangle, label: 'RISCO', x: 20, y: 60, rotation: -5, delay: 0.2 },
  { icon: Clock, label: 'PRAZO', x: 80, y: 55, rotation: 15, delay: 0.3 },
  { icon: Shield, label: 'PROTEÇÃO', x: 45, y: 8, rotation: -8, delay: 0.15 },
  { icon: BarChart3, label: 'DADOS', x: 55, y: 65, rotation: 10, delay: 0.25 },
  { icon: Eye, label: 'INSPEÇÃO', x: 85, y: 35, rotation: -18, delay: 0.35 },
  { icon: Zap, label: 'AÇÃO', x: 15, y: 35, rotation: 6, delay: 0.4 },
]

export default function FrozenTimeSection() {
  const sectionRef = useRef<HTMLDivElement>(null!)
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.15 })
  const [frozen, setFrozen] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const reduced = useReducedMotion()
  const isFrozen = reduced || frozen
  const isAnalysisComplete = reduced || analysisComplete

  useEffect(() => {
    if (reduced || !isInView) return

    // Freeze animation starts after items appear
    const freezeTimer = setTimeout(() => setFrozen(true), 1500)
    const analysisTimer = setTimeout(() => setAnalysisComplete(true), 3500)

    return () => {
      clearTimeout(freezeTimer)
      clearTimeout(analysisTimer)
    }
  }, [isInView, reduced])

  return (
    <section
      ref={sectionRef}
      id="frozen-time"
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #071a33 0%, #0a1628 50%, #071a33 100%)' }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 60%)',
            transition: 'all 1s ease',
            transform: isFrozen ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%) scale(1)',
          }}
        />
      </div>

      <div ref={ref} className="container-sgs relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sgs-warning/20 bg-sgs-warning/5 mb-6">
            <Clock className="h-3.5 w-3.5 text-sgs-warning" />
            <span className="font-mono text-xs tracking-wider uppercase text-sgs-warning">
              Tempo Congelado
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            O momento em que o SGS entra em ação
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Enquanto sua operação continua, o SGS congela o tempo para analisar
            cada risco, cada documento, cada trabalhador — e toma a decisão certa.
          </p>
        </div>

        {/* Frozen elements visualization */}
        <div className="relative max-w-4xl mx-auto h-[400px] sm:h-[500px]">
          {/* Time freeze overlay */}
          {isFrozen && (
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.05) 0%, transparent 50%)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          )}

          {/* Floating items */}
          {floatingItems.map((item, i) => {
            const Icon = item.icon
            const revealed = reduced || isInView
            const isAnalyzed = isAnalysisComplete

            return (
              <div
                key={i}
                className="absolute transition-all duration-700"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: revealed
                    ? `rotate(${item.rotation}deg) scale(${isFrozen ? 0.95 : 1})`
                    : `rotate(${item.rotation + 20}deg) scale(0) translateY(30px)`,
                  opacity: revealed ? 1 : 0,
                  transitionDelay: `${item.delay}s`,
                  animation: isFrozen && !reduced
                    ? `float ${3 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`
                    : 'none',
                }}
              >
                <div
                  className="relative px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-500"
                  style={{
                    background: isAnalyzed
                      ? 'rgba(34, 197, 94, 0.1)'
                      : 'rgba(255, 255, 255, 0.03)',
                    borderColor: isAnalyzed
                      ? 'rgba(34, 197, 94, 0.3)'
                      : isFrozen
                        ? 'rgba(6, 182, 212, 0.2)'
                        : 'rgba(255, 255, 255, 0.06)',
                    boxShadow: isFrozen
                      ? '0 0 20px rgba(6, 182, 212, 0.1)'
                      : 'none',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className="h-4 w-4"
                      style={{
                        color: isAnalyzed ? '#22c55e' : isFrozen ? '#06b6d4' : '#ffffff60',
                      }}
                    />
                    <span className="text-xs font-mono text-white/60">{item.label}</span>
                    {isAnalyzed && (
                      <span className="text-xs text-sgs-success">✓</span>
                    )}
                  </div>

                  {/* Frost effect when frozen */}
                  {isFrozen && !isAnalyzed && (
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, transparent 50%)',
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}

          {/* Center SGS core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-1000"
              style={{
                background: isFrozen
                  ? 'radial-gradient(circle, rgba(0,86,179,0.3) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(0,86,179,0.1) 0%, transparent 60%)',
                boxShadow: isFrozen
                  ? '0 0 60px rgba(6, 182, 212, 0.18), 0 0 120px rgba(0, 86, 179, 0.08)'
                  : 'none',
              }}
            >
              {/* Rings */}
              {isFrozen && (
                <>
                  <div className="absolute inset-0 rounded-full border border-sgs-cyan/20 animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute inset-4 rounded-full border border-sgs-accent/20 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-8 rounded-full border border-sgs-cyan/10 animate-spin" style={{ animationDuration: '6s' }} />
                </>
              )}

              {/* Core text */}
              <div className="text-center">
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">SGS</div>
                <div className="font-mono text-[10px] text-sgs-cyan tracking-wider">
                  {isFrozen ? (isAnalysisComplete ? 'ANÁLISE OK' : 'ANALISANDO...') : 'AGUARDANDO'}
                </div>
              </div>
            </div>
          </div>

          {/* Connection lines when frozen */}
          {isFrozen && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              {floatingItems.map((item, i) => (
                <line
                  key={i}
                  x1="50%"
                  y1="50%"
                  x2={`${item.x}%`}
                  y2={`${item.y}%`}
                  stroke={isAnalysisComplete ? 'rgba(34, 197, 94, 0.2)' : 'rgba(6, 182, 212, 0.15)'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  style={{
                    opacity: isAnalysisComplete ? 1 : 0.5,
                    transition: 'stroke 0.5s ease, opacity 0.5s ease',
                  }}
                />
              ))}
            </svg>
          )}
        </div>

        {/* Analysis results */}
        {isAnalysisComplete && (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Riscos analisados', value: '6', icon: AlertTriangle, color: '#dc2626' },
              { label: 'Ações preventivas', value: '4', icon: Shield, color: '#f59e0b' },
              { label: 'Documentos validados', value: '12', icon: FileText, color: '#3b82f6' },
              { label: 'Resolvidos', value: '6', icon: Zap, color: '#22c55e' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl border border-white/5 bg-white/[0.02] animate-fade-in"
                >
                  <Icon className="h-5 w-5 mx-auto mb-2" style={{ color: stat.color }} />
                  <div className="text-2xl font-bold font-heading text-white">{stat.value}</div>
                  <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
