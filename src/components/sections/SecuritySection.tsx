'use client'

import { Shield, Lock, Fingerprint, Database, Monitor, FileSearch } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Card from '@/components/ui/Card'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'
import InteractiveSurface from '@/components/interaction/InteractiveSurface'

const securityFeatures = [
  {
    icon: <Lock size={24} />,
    title: 'Controle de acesso',
    description: 'Estrutura preparada para controle granular de permissões com perfis personalizados para cada tipo de usuário.',
  },
  {
    icon: <Fingerprint size={24} />,
    title: 'Perfis e permissões',
    description: 'Boas práticas de definição de papéis e responsabilidades dentro da plataforma.',
  },
  {
    icon: <Database size={24} />,
    title: 'Registros e auditoria',
    description: 'Histórico completo de todas as ações realizadas na plataforma para conformidade e rastreabilidade.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Backups automáticos',
    description: 'Estrutura preparada para backups periódicos garantindo a integridade dos seus dados.',
  },
  {
    icon: <Monitor size={24} />,
    title: 'Proteção de dados',
    description: 'Boas práticas de segurança da informação alinhadas com a LGPD e normas de proteção de dados.',
  },
  {
    icon: <FileSearch size={24} />,
    title: 'Monitoramento',
    description: 'Estrutura preparada para monitoramento contínuo da segurança e desempenho da plataforma.',
  },
]

export default function SecuritySection() {
  return (
    <Section id="security" variant="dark">
      <Reveal>
        <Heading size="h2" align="center" className="mb-4 text-sgs-text-inverse">
          Seus dados protegidos em todas as etapas
        </Heading>
      </Reveal>
      <Reveal delay={0.1}>
        <Text size="lg" className="mb-12 max-w-2xl mx-auto text-center text-white/60">
          Sua informação é tratada com responsabilidade. Trabalhamos com as melhores
          práticas de segurança para garantir proteção em cada camada do sistema.
        </Text>
      </Reveal>
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityFeatures.map((feature) => (
          <Reveal key={feature.title}>
            <InteractiveSurface tilt="subtle" depth="flat" className="h-full">
              <Card className="bg-white/5 border-white/10 h-full" hover={false}>
                <div className="w-12 h-12 rounded-lg bg-sgs-accent/20 flex items-center justify-center text-sgs-accent-light mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-sgs-text-inverse mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </InteractiveSurface>
          </Reveal>
        ))}
      </Stagger>
    </Section>
  )
}
