'use client'

import { useEffect, useRef, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Badge from '@/components/ui/Badge'
import { ImageWithFallback } from '@/components/common/ImageWithFallback'
import { getIcon } from '@/lib/icons'

interface DialogModule {
  icon: string
  name: string
  description: string
  category: string
  badge?: string
  href?: string
}

interface ModuleDetailsDialogProps {
  module: DialogModule | null
  layoutId: string
  open: boolean
  onClose: () => void
}

const categoryCapabilities: Record<string, string[]> = {
  Gestão: [
    'Dados vinculados ao contexto da operação',
    'Responsáveis, prazos e andamento no mesmo fluxo',
    'Histórico disponível para consulta e auditoria',
  ],
  Documentos: [
    'Registros organizados com contexto e evidências',
    'Validades e pendências fáceis de acompanhar',
    'Integração com planos de ação e responsáveis',
  ],
  Segurança: [
    'Acesso orientado por perfis e responsabilidades',
    'Rastreabilidade das alterações relevantes',
    'Informação protegida ao longo do processo',
  ],
  Analytics: [
    'Indicadores consolidados em uma única visão',
    'Filtros para investigar prioridades e evolução',
    'Dados preparados para apoiar decisões',
  ],
  Comunicação: [
    'Alertas vinculados ao evento que exige atenção',
    'Responsáveis informados no momento adequado',
    'Continuidade entre aviso, ação e registro',
  ],
}

function getPreviewImage(category: string): string {
  if (category === 'Analytics') return '/images/product/cockpit-sst.webp'
  if (category === 'Segurança') return '/images/product/sgs-intelligence.webp'
  return '/images/product/sgs-responsive.webp'
}

function ModuleDetailsDialog({
  module,
  layoutId,
  open,
  onClose,
}: ModuleDetailsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        dialogRef.current?.focus()
      })
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown, onClose])

  if (!module) return null

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 sm:items-center sm:p-6">
          <m.div
            key="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

            <m.div
              ref={dialogRef}
              key={layoutId}
              layoutId={prefersReducedMotion ? undefined : layoutId}
              role="dialog"
              data-testid="module-dialog"
              aria-modal="true"
              aria-label={`Detalhes do módulo ${module.name}`}
            tabIndex={-1}
            initial={
              prefersReducedMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.95, y: 20 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.35,
              ease: 'easeOut',
            }}
            className={cn(
              'relative w-full max-w-lg max-h-[85vh] overflow-y-auto',
              'bg-sgs-surface rounded-2xl shadow-2xl border border-sgs-border',
              'focus:outline-none z-10'
            )}
          >
            <button
              type="button"
              data-testid="dialog-close"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-sgs-surface-secondary text-sgs-text-tertiary hover:bg-sgs-border hover:text-sgs-text-primary transition-colors"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>

            <div className="p-6 pb-4 border-b border-sgs-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sgs-blue-50 text-sgs-accent shrink-0">
                  {getIcon(module.icon, 28)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-xl font-bold text-sgs-text-primary truncate">
                    {module.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="default">{module.category}</Badge>
                    {module.badge && (
                      <Badge variant="success">{module.badge}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sgs-text-secondary leading-relaxed">
                {module.description}
              </p>
            </div>

            <div className="px-6 py-4">
              <div className="group relative overflow-hidden rounded-xl border border-sgs-blue-100 bg-sgs-blue-950 shadow-[0_18px_45px_rgba(7,26,51,0.16)]">
                <ImageWithFallback
                  src={getPreviewImage(module.category)}
                  alt={`Visão da plataforma SGS relacionada ao módulo ${module.name}`}
                  className="aspect-[16/7] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.035]"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sgs-blue-950/70 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-sgs-blue-950/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 backdrop-blur-md">
                  Visão integrada do SGS
                </div>
              </div>
            </div>

            <div className="px-6 pb-4">
              <h3 className="font-heading text-base font-semibold text-sgs-text-primary mb-3">
                Como este módulo se conecta
              </h3>
              <ul className="space-y-2">
                {(categoryCapabilities[module.category] ?? categoryCapabilities.Gestão).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-sgs-text-secondary"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-sgs-success mt-0.5 shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-6 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-sgs-blue-100 bg-sgs-blue-50 px-5 py-3 text-sm font-semibold text-sgs-accent transition-colors hover:border-sgs-blue-200 hover:bg-sgs-blue-100"
              >
                Continuar explorando os módulos
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ModuleDetailsDialog
export { ModuleDetailsDialog }
