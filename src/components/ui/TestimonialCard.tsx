import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

interface TestimonialCardProps {
  name: string
  company: string
  role: string
  content: string
  avatar: string
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function TestimonialCard({
  name,
  company,
  role,
  content,
  avatar,
  className,
}: TestimonialCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <Card className={cn('flex flex-col gap-4', className)} padding="lg" hover>
      <div className="text-4xl leading-none text-sgs-accent/20 font-heading select-none">
        &ldquo;
      </div>
      <p className="text-sgs-text-secondary leading-relaxed flex-1">
        {content}
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-sgs-border">
        {avatar && !imgError ? (
          <img
            src={avatar}
            alt={name}
            className="h-10 w-10 rounded-full object-cover shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sgs-blue-50 text-sgs-accent text-sm font-semibold">
            {getInitials(name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sgs-text-primary truncate">
            {name}
          </p>
          <p className="text-xs text-sgs-text-tertiary truncate">
            {role}
            {role && company ? ' · ' : ''}
            {company}
          </p>
        </div>
      </div>
    </Card>
  )
}
