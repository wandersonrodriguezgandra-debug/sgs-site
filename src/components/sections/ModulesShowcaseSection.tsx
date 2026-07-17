'use client'

import { m } from 'framer-motion'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import ModuleCard from '@/components/ui/ModuleCard'
import { modules } from '@/config/modules'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function ModulesShowcaseSection() {
  const reduced = useReducedMotion()
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <Section id="modulos-showcase" variant="default" data-testid="modules-showcase-section">
      <div className="text-center mb-12">
        <Heading size="h2" align="center" className="mb-4">
          Um ecossistema completo para sua segurança
        </Heading>
        <Text size="lg" className="max-w-2xl mx-auto text-center">
          Do DDS ao dashboard estratégico, cada módulo do SGS foi desenhado para
          simplificar a gestão de SST.
        </Text>
      </div>

      <m.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {modules.map((mod) => (
          <m.div
            key={mod.name}
            variants={cardVariants}
            whileHover={reduced ? {} : { y: -8, scale: 1.02 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-sgs-accent/20 to-sgs-blue-400/20 blur-sm pointer-events-none" />
            <ModuleCard
              icon={mod.icon}
              name={mod.name}
              description={mod.description}
              category={mod.category}
              badge={mod.badge}
              href={mod.href}
              className="relative h-full"
            />
          </m.div>
        ))}
      </m.div>
    </Section>
  )
}
