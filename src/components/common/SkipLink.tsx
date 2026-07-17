import { cn } from '@/lib/utils'

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        'fixed left-4 top-4 z-50',
        '-translate-y-[200%] focus:translate-y-0',
        'rounded-lg bg-sgs-accent px-4 py-2',
        'text-sm font-semibold text-white shadow-lg',
        'transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
      )}
    >
      Ir para o conteúdo
    </a>
  )
}
