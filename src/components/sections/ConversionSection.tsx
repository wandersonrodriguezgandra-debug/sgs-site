'use client'

import { MessageCircle } from 'lucide-react'
import { m } from 'framer-motion'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Button from '@/components/ui/Button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'

const stats = [
  { value: '+2.000', label: 'empresas' },
  { value: '99,7%', label: 'uptime' },
  { value: 'Suporte 24h', label: 'disponível' },
]

export default function ConversionSection() {
  const reduced = useReducedMotion()
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.15 })

  return (
    <section
      id="conversao"
      data-testid="conversion-section"
      className="relative overflow-hidden bg-gradient-to-br from-sgs-blue-950 via-[#0a1628] to-sgs-blue-950 py-20 md:py-28"
      aria-label="Conversão"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-sgs-accent/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-sgs relative z-10">
        <m.div
          ref={ref}
          initial={reduced ? undefined : { opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto"
        >
          <Heading
            as="h2"
            size="h1"
            align="center"
            className="text-sgs-text-inverse !text-white"
          >
            Transforme a segurança da sua empresa em uma opera&ccedil;&atilde;o
            inteligente
          </Heading>
          <Text size="lg" className="text-sgs-blue-200 max-w-xl">
            Solicite uma demonstra&ccedil;&atilde;o e descubra como o SGS pode
            revolucionar sua gest&atilde;o de Seguran&ccedil;a do Trabalho.
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="primary" size="lg" data-testid="conversion-cta-demo">
              Solicitar demonstra&ccedil;&atilde;o
            </Button>
            <Button
              variant="outline"
              size="lg"
              data-testid="conversion-cta-chat"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com um especialista
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 w-full max-w-lg">
            {stats.map((stat, i) => (
              <m.div
                key={stat.label}
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.15,
                  ease: 'easeOut',
                }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white font-heading">
                  {stat.value}
                </div>
                <div className="text-sm text-sgs-blue-300 mt-1">{stat.label}</div>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  )
}
