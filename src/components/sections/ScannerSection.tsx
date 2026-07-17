'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'
import { AlertTriangle, CheckCircle, FileText, Users, Shield, Clock } from 'lucide-react'

const riskItems = [
  { icon: AlertTriangle, label: 'Trabalho em altura', status: 'critical' as const, x: 15, y: 20 },
  { icon: FileText, label: 'APR vencida', status: 'warning' as const, x: 70, y: 15 },
  { icon: Users, label: '3 sem capacitação', status: 'critical' as const, x: 40, y: 65 },
  { icon: Shield, label: 'EPI irregular', status: 'warning' as const, x: 75, y: 55 },
  { icon: Clock, label: 'Inspeção atrasada', status: 'critical' as const, x: 25, y: 75 },
  { icon: CheckCircle, label: 'DDS em dia', status: 'safe' as const, x: 60, y: 35 },
]

export default function ScannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null!)
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })
  const [scanProgress, setScanProgress] = useState(0)
  const [activeRisk, setActiveRisk] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (reduced || !isInView) return

    let startTime = 0
    const DURATION = 4000

    function tick() {
      const now = performance.now()
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / DURATION)
      setScanProgress(progress)

      // Activate risks as scanner passes
      riskItems.forEach((item, i) => {
        const itemProgress = item.x / 100
        if (progress > itemProgress && progress < itemProgress + 0.15) {
          setActiveRisk(i)
        }
      })

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [isInView, reduced])

  return (
    <section
      ref={sectionRef}
      id="scanner"
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #071a33 0%, #00244d 50%, #071a33 100%)' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'linear-gradient(rgba(74,135,235,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(74,135,235,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div ref={ref} className="container-sgs relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sgs-cyan/20 bg-sgs-cyan/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-sgs-cyan animate-pulse" />
            <span className="font-mono text-xs tracking-wider uppercase text-sgs-cyan">
              Scanner de Riscos
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Identificamos riscos antes que eles se tornem problemas
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Nosso sistema varre continuamente sua operação, identificando
            pendências, documentos vencidos e não conformidades em tempo real.
          </p>
        </div>

        {/* Scanner visualization */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main container */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sgs-danger/80" />
                <div className="w-3 h-3 rounded-full bg-sgs-warning/80" />
                <div className="w-3 h-3 rounded-full bg-sgs-success/80" />
              </div>
              <span className="font-mono text-xs text-white/40">SGS Risk Scanner</span>
              <div className="font-mono text-xs text-sgs-cyan">{Math.round(scanProgress * 100)}%</div>
            </div>

            {/* Scanner area */}
            <div className="relative h-[400px] sm:h-[500px]">
              {/* Risk items */}
              {riskItems.map((item, i) => {
                const Icon = item.icon
                const discovered = scanProgress > item.x / 100
                const isActive = activeRisk === i
                const resolved = scanProgress > item.x / 100 + 0.3

                return (
                  <div
                    key={i}
                    className="absolute transition-all duration-500"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: discovered ? 'scale(1)' : 'scale(0)',
                      opacity: discovered ? 1 : 0,
                    }}
                  >
                    {/* Pulse ring */}
                    {isActive && (
                      <div
                        className="absolute inset-0 -m-4 rounded-full border-2 animate-ping"
                        style={{
                          borderColor: item.status === 'critical' ? '#dc2626' : item.status === 'warning' ? '#f59e0b' : '#22c55e',
                        }}
                      />
                    )}

                    {/* Icon container */}
                    <div
                      className="relative flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300"
                      style={{
                        background: resolved
                          ? 'rgba(34, 197, 94, 0.1)'
                          : item.status === 'critical'
                            ? 'rgba(220, 38, 38, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        borderColor: resolved
                          ? 'rgba(34, 197, 94, 0.3)'
                          : item.status === 'critical'
                            ? 'rgba(220, 38, 38, 0.3)'
                            : 'rgba(245, 158, 11, 0.3)',
                        boxShadow: isActive
                          ? `0 0 20px ${resolved ? 'rgba(34, 197, 94, 0.2)' : item.status === 'critical' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                          : 'none',
                      }}
                    >
                      <Icon
                        className="h-5 w-5 shrink-0"
                        style={{
                          color: resolved ? '#22c55e' : item.status === 'critical' ? '#dc2626' : '#f59e0b',
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-white whitespace-nowrap">{item.label}</div>
                        <div
                          className="text-xs font-mono"
                          style={{
                            color: resolved ? '#22c55e' : item.status === 'critical' ? '#dc2626' : '#f59e0b',
                          }}
                        >
                          {resolved ? '✓ Resolvido' : item.status === 'critical' ? '● Crítico' : '● Alerta'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Scanner beam */}
              <div
                className="absolute top-0 bottom-0 w-[3px] transition-none"
                style={{
                  left: `${scanProgress * 100}%`,
                  background: 'linear-gradient(180deg, transparent, #06b6d4, #ffffff, #06b6d4, transparent)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)',
                }}
              />

              {/* Scanner glow */}
              <div
                className="absolute top-0 bottom-0 w-40 pointer-events-none"
                style={{
                  left: `${scanProgress * 100 - 8}%`,
                  background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent)',
                }}
              />

              {/* Progress line at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                <div
                  className="h-full transition-none"
                  style={{
                    width: `${scanProgress * 100}%`,
                    background: 'linear-gradient(90deg, #0056b3, #06b6d4)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats below */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Riscos identificados', value: '6', color: '#dc2626' },
              { label: 'Ações corretivas', value: '4', color: '#f59e0b' },
              { label: 'Resolvidos', value: '2', color: '#22c55e' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="text-2xl font-bold font-heading" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
