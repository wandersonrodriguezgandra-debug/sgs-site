import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

type MetricTrend = 'up' | 'down' | 'neutral'

interface MetricCardProps {
  label: string
  value: string
  icon?: ReactNode
  trend?: MetricTrend
  className?: string
}

const trendConfig: Record<MetricTrend, { icon: ReactNode; color: string; prefix: string }> = {
  up: { icon: <TrendingUp className="h-4 w-4" />, color: 'text-sgs-success', prefix: '+' },
  down: { icon: <TrendingDown className="h-4 w-4" />, color: 'text-sgs-danger', prefix: '-' },
  neutral: { icon: <Minus className="h-4 w-4" />, color: 'text-sgs-text-tertiary', prefix: '' },
}

export default function MetricCard({
  label,
  value,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2', className)} padding="md">
      <div className="flex items-center justify-between">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sgs-blue-50 text-sgs-accent">
            {icon}
          </div>
        )}
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trendConfig[trend].color
            )}
          >
            {trendConfig[trend].icon}
            {trendConfig[trend].prefix}
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold font-heading text-sgs-text-primary">
          {value}
        </p>
        <p className="text-sm text-sgs-text-secondary mt-1">{label}</p>
      </div>
    </Card>
  )
}
