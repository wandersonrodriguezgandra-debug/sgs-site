'use client'

import Section from '@/components/ui/Section'
import CTA from '@/components/ui/CTA'
import Reveal from '@/components/motion/Reveal'

export default function FinalCTASection() {
  return (
    <Section id="demo">
      <Reveal>
        <CTA
          variant="dark"
          className="rounded-[2rem] shadow-[0_35px_100px_rgba(7,26,51,0.3)]"
          title="Leve a gestão de Segurança do Trabalho para um novo nível"
          description="Centralize processos, automatize tarefas, controle prazos e tome decisões estratégicas com dados confiáveis. Sua empresa merece uma gestão de SST eficiente e moderna."
          primaryCta={{ label: 'Solicitar demonstração', href: '#demo' }}
          secondaryCta={{ label: 'Falar com um especialista', href: '#contato' }}
        />
      </Reveal>
    </Section>
  )
}
