import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
  href?: string
}

function Logo({
  className,
  variant = 'full',
  href = '#hero',
}: LogoProps) {
  return (
    <a
      href={href}
      className={cn('inline-flex items-center gap-2 no-underline', className)}
      aria-label="SGS - Segurança do Trabalho"
    >
      {variant === 'full' ? (
        <div className="flex flex-col">
          <span className="font-heading font-bold text-xl tracking-tight text-sgs-accent leading-none">
            SGS
          </span>
          <span className="text-xs text-sgs-text-tertiary leading-none mt-0.5">
            Segurança do Trabalho
          </span>
        </div>
      ) : (
        <span className="font-heading font-bold text-2xl text-sgs-accent">
          S
        </span>
      )}
    </a>
  )
}

export default Logo
