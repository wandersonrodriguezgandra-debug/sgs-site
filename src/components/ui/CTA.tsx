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
  variant?: 'default' | 'dark'
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
        'py-16 md:py-24',
        variant === 'dark' ? 'bg-sgs-blue-950' : 'bg-sgs-accent',
        className
      )}
    >
      <Container>
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <h2
            className={cn(
              'font-heading text-3xl md:text-4xl font-bold',
              variant === 'dark' ? 'text-sgs-text-inverse' : 'text-white'
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              'text-lg leading-relaxed max-w-xl',
              variant === 'dark' ? 'text-sgs-blue-200' : 'text-white/80'
            )}
          >
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant={variant === 'dark' ? 'primary' : 'secondary'}
              href={primaryCta.href}
              size="lg"
            >
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button
                variant={variant === 'dark' ? 'outline' : 'ghost'}
                href={secondaryCta.href}
                size="lg"
                className={
                  variant === 'dark'
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
