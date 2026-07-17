'use client'

import { Cloud, ShieldCheck, Smartphone, Expand, LayoutDashboard } from 'lucide-react'
import Section from '@/components/ui/Section'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'

const trustItems = [
  { icon: <Cloud size={22} />, label: 'Plataforma em nuvem' },
  { icon: <ShieldCheck size={22} />, label: 'Permissões e segurança' },
  { icon: <Smartphone size={22} />, label: 'Acesso responsivo' },
  { icon: <Expand size={22} />, label: 'Escalável' },
  { icon: <LayoutDashboard size={22} />, label: 'Gestão integrada' },
]

export default function TrustSection() {
  return (
    <Section variant="muted" className="py-8 md:py-10">
      <Stagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {trustItems.map((item) => (
          <Reveal key={item.label} delay={0.05}>
            <div className="flex flex-col items-center gap-2 text-center p-3">
              <span className="text-sgs-accent">{item.icon}</span>
              <span className="text-xs md:text-sm font-medium text-sgs-text-secondary">
                {item.label}
              </span>
            </div>
          </Reveal>
        ))}
      </Stagger>
    </Section>
  )
}
