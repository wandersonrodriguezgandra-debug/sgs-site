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
        'group flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:shadow-glow relative overflow-hidden',
        className
      )}
      padding="md"
      hover
    >
      {/* Animated border glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0,86,179,0.1), rgba(6,182,212,0.05), rgba(0,86,179,0.1))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sgs-blue-50 text-sgs-accent transition-all duration-300 group-hover:bg-sgs-accent group-hover:text-white group-hover:scale-110 group-hover:shadow-glow">
          <DynamicIcon name={icon} className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
        </div>
        {badge && <Badge variant="success">{badge}</Badge>}
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-sgs-text-primary mb-1 group-hover:text-sgs-accent transition-colors duration-200">
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
