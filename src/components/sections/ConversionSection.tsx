'use client'

import { MessageCircle, ArrowRight } from 'lucide-react'
import { m } from 'framer-motion'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Button from '@/components/ui/Button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'

export default function ConversionSection() {
  const reduced = useReducedMotion()
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.15 })

  return (
    <section
      id="conversao"
      data-testid="conversion-section"
      className="relative overflow-hidden py-20 md:py-28"
      aria-label="Conversão"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sgs-blue-950 via-[#0a1628] to-sgs-blue-950" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.14),transparent_50%)]" />

      {/* Central glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-35 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,86,179,0.5) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(74,135,235,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,135,235,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="sgs-showcase-orbit absolute -left-20 top-1/2 h-48 w-48 rounded-full border border-dashed border-sgs-cyan/25" aria-hidden="true" />
      <div className="sgs-showcase-float-reverse absolute -right-10 top-10 h-28 w-28 rounded-full bg-sgs-accent/25 blur-xl" aria-hidden="true" />

      <div className="container-sgs relative z-10">
        <m.div
          ref={ref}
          initial={reduced ? undefined : { opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto"
        >
          {/* Status indicator */}
          <m.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-sgs-cyan/20 bg-sgs-cyan/5 backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-sgs-success animate-pulse" />
            <span className="font-mono text-xs tracking-wider uppercase text-sgs-cyan">
              Sistema operacional
            </span>
          </m.div>

          <Heading
            as="h2"
            size="h1"
            align="center"
            className="!text-white"
          >
            Transforme a segurança da sua empresa em uma operação inteligente
          </Heading>
          <Text size="lg" className="text-white/65 max-w-xl">
            Solicite uma demonstração e descubra como o SGS pode revolucionar sua
            gestão de Segurança do Trabalho.
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="primary" size="lg" data-testid="conversion-cta-demo" className="group">
              Solicitar demonstração
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              data-testid="conversion-cta-chat"
              className="border-white/30 bg-white/[0.04] text-white hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com um especialista
            </Button>
          </div>

        </m.div>
      </div>
    </section>
  )
}
