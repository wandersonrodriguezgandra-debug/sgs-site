import type { ComponentType } from 'react'
import {
  Building2, Users, KeyRound, FileText, ClipboardCheck, Search,
  FolderOpen, GraduationCap, Target, AlertTriangle, PieChart,
  LayoutDashboard, BellRing,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TiltCard } from '@/components/interaction/TiltCard'

const moduleIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Building2, Users, KeyRound, FileText, ClipboardCheck, Search,
  FolderOpen, GraduationCap, Target, AlertTriangle, PieChart,
  LayoutDashboard, BellRing,
}

interface ModuleCardProps {
  icon: string
  name: string
  description: string
  category?: string
  badge?: string
  href?: string
  className?: string
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = moduleIconMap[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

export default function ModuleCard({
  icon,
  name,
  description,
  category,
  badge,
  href,
  className,
}: ModuleCardProps) {
  const cardContent = (
    <Card
      className={cn(
        'group flex flex-col gap-4 cursor-pointer transition-shadow duration-300 hover:shadow-glow',
        className
      )}
      padding="md"
      hover
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sgs-blue-50 text-sgs-accent transition-all duration-300 group-hover:bg-sgs-accent group-hover:text-white group-hover:scale-110">
          <DynamicIcon name={icon} className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
        </div>
        {badge && <Badge variant="success">{badge}</Badge>}
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-sgs-text-primary mb-1">
          {name}
        </h3>
        <p className="text-sm text-sgs-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
      {category && (
        <Badge variant="default" className="self-start">
          {category}
        </Badge>
      )}
    </Card>
  )

  const wrapped = (
    <TiltCard intensity={5} scale={1.01} glare={false}>
      {cardContent}
    </TiltCard>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block no-underline"
        data-cursor-variant="card"
      >
        {wrapped}
      </a>
    )
  }

  return (
    <div data-cursor-variant="card">
      {wrapped}
    </div>
  )
}
export { ModuleCard }
