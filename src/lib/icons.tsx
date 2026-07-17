import type { ReactNode, ComponentType } from 'react'
import {
  FolderTree, RefreshCw, Bell, TrendingUp, FileCheck, Shield,
  BarChart3, Clock, Users, Lightbulb, Building2, KeyRound,
  FileText, ClipboardCheck, Search, FolderOpen, GraduationCap,
  Target, AlertTriangle, PieChart, LayoutDashboard, BellRing,
  CheckCircle, ArrowRight,
} from 'lucide-react'

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  FolderTree, RefreshCw, Bell, TrendingUp, FileCheck, Shield,
  BarChart3, Clock, Users, Lightbulb, Building2, KeyRound,
  FileText, ClipboardCheck, Search, FolderOpen, GraduationCap,
  Target, AlertTriangle, PieChart, LayoutDashboard, BellRing,
  CheckCircle, ArrowRight,
}

const sizeClass: Record<number, string> = {
  16: 'w-4 h-4',
  20: 'w-5 h-5',
  24: 'w-6 h-6',
  32: 'w-8 h-8',
}

export function getIcon(name: string, size = 24): ReactNode {
  const Component = iconMap[name]
  if (!Component) return null
  return <Component className={sizeClass[size] || 'w-6 h-6'} />
}
