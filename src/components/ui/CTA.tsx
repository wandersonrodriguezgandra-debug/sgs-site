import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

interface CTAButton {
  label: string
  href?: string
}

interface CTAProps {
  title: string
  description: string
  primaryCta: CTAButton
  secondaryCta?: CTAButton
  className?: string
  variant?: 'default' | 'dark' | 'light'
}

export default function CTA({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
  variant = 'default',
}: CTAProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden py-16 md:py-24',
        variant === 'dark'
          ? 'bg-gradient-to-br from-sgs-blue-950 via-[#0a2446] to-[#061426]'
          : variant === 'light'
            ? 'border border-sgs-blue-100 bg-white shadow-[0_30px_90px_rgba(0,61,128,0.14)]'
            : 'bg-sgs-accent',
        className
      )}
    >
      {variant === 'light' && (
        <>
          <div className="sgs-light-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="sgs-showcase-orbit absolute -left-20 -top-20 h-52 w-52 rounded-full border border-dashed border-sgs-accent/20" aria-hidden="true" />
          <div className="sgs-showcase-float-reverse absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-sgs-blue-100/80 blur-3xl" aria-hidden="true" />
        </>
      )}
      {variant === 'dark' && (
        <>
          <div className="sgs-dark-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="sgs-showcase-orbit absolute -left-24 -top-24 h-64 w-64 rounded-full border border-dashed border-sgs-cyan/25" aria-hidden="true" />
          <div className="sgs-showcase-float-reverse absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-sgs-accent/20 blur-3xl" aria-hidden="true" />
        </>
      )}
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <h2
            className={cn(
              'font-heading text-3xl md:text-4xl font-bold',
              variant === 'light'
                ? 'text-sgs-blue-950'
                : variant === 'dark'
                  ? 'text-sgs-text-inverse'
                  : 'text-white'
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              'text-lg leading-relaxed max-w-xl',
              variant === 'light'
                ? 'text-sgs-text-secondary'
                : variant === 'dark'
                  ? 'text-sgs-blue-200'
                  : 'text-white/80'
            )}
          >
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant={variant === 'default' ? 'secondary' : 'primary'}
              href={primaryCta.href}
              size="lg"
            >
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button
                variant={variant === 'light' ? 'outline' : variant === 'dark' ? 'outline' : 'ghost'}
                href={secondaryCta.href}
                size="lg"
                className={
                  variant === 'light'
                    ? 'border-sgs-blue-200 bg-white text-sgs-blue-950 hover:bg-sgs-blue-50'
                    : variant === 'dark'
                      ? 'text-sgs-text-inverse border-sgs-text-inverse'
                      : 'text-white border-white'
                }
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
