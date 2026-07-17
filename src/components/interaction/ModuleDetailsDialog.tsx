'use client'

import { useEffect, useRef, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
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

const genericFeatures = [
  'Gestão completa de documentos e registros',
  'Controle de prazos e vencimentos automático',
  'Relatórios personalizados e exportáveis',
  'Integração com os demais módulos do sistema',
  'Notificações e alertas inteligentes',
  'Histórico completo para auditoria',
]

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
              <div className="rounded-xl bg-sgs-surface-secondary border border-sgs-border border-dashed p-8 text-center">
                <div className="flex flex-col items-center gap-2 text-sgs-text-tertiary">
                  <ArrowRight size={24} className="text-sgs-accent" />
                  <p className="text-sm font-medium text-sgs-text-secondary">
                    IMAGEM TEMPORÁRIA — substituir pela captura oficial
                  </p>
                  <p className="text-xs">Preview do módulo {module.name}</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4">
              <h3 className="font-heading text-base font-semibold text-sgs-text-primary mb-3">
                Funcionalidades
              </h3>
              <ul className="space-y-2">
                {genericFeatures.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-sgs-text-secondary"
                  >
                    <CheckCircle
                      size={16}
                      className="text-sgs-success mt-0.5 shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-6 pt-2">
              <Button className="w-full" size="lg">
                Solicitar demonstração
                <ArrowRight size={18} />
              </Button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ModuleDetailsDialog
export { ModuleDetailsDialog }
