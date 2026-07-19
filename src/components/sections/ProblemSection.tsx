import { AlertTriangle, ClipboardList, Files } from 'lucide-react'
import Section from '@/components/ui/Section'
import Heading from '@/components/ui/Heading'
import Text from '@/components/ui/Text'
import Reveal from '@/components/motion/Reveal'
import Stagger from '@/components/motion/Stagger'
import ChapterMark from '@/components/ui/ChapterMark'

const problems = [
  {
    icon: ClipboardList,
    number: '01',
    title: 'Rotinas espalhadas',
    description: 'DDS, APR, inspeções e treinamentos vivem em arquivos diferentes e perdem o contexto da operação.',
  },
  {
    icon: Files,
    number: '02',
    title: 'Documentos sem continuidade',
    description: 'Prazos, responsáveis e evidências ficam desconectados, aumentando o retrabalho na hora da auditoria.',
  },
  {
    icon: AlertTriangle,
    number: '03',
    title: 'Risco sem prioridade clara',
    description: 'A equipe enxerga pendências, mas não consegue distinguir rapidamente o que exige ação imediata.',
  },
]

export default function ProblemSection() {
  return (
    <Section
      id="problema"
      className="relative overflow-hidden bg-slate-50/45 !py-24 md:!py-32"
      data-testid="problem-section"
    >
      <div className="sgs-light-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-sgs-blue-100/55 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-48 top-24 h-80 w-80 rounded-full bg-red-100/35 blur-3xl" aria-hidden="true" />

      <div className="relative z-10">
        <div className="mb-14 grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal direction="left" distance={44}>
            <div>
              <ChapterMark number="01" label="Problema" />
              <Heading size="h2" className="max-w-3xl !text-3xl md:!text-5xl md:!leading-[1.08]">
                Informação existe. O problema é ela chegar tarde e sem contexto.
              </Heading>
            </div>
          </Reveal>

          <Reveal direction="right" distance={44} delay={0.08}>
            <Text size="lg" className="lg:pb-1">
              Digitalizar SST não é trocar papel por tela. É conectar cada registro
              à pessoa responsável, ao prazo correto e à decisão que precisa ser tomada.
            </Text>
          </Reveal>
        </div>

        <div className="relative">
          <div className="sgs-risk-connector pointer-events-none absolute left-[16.5%] right-[16.5%] top-[8.25rem] hidden h-px md:block" aria-hidden="true" />
          <Stagger className="relative grid gap-5 md:grid-cols-3" staggerDelay={0.14} direction="center">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            const featured = index === 1

            return (
              <article
                key={problem.title}
                data-testid={`problem-card-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
                className={featured
                  ? 'group relative min-h-72 overflow-hidden rounded-3xl border border-sgs-blue-800 bg-sgs-blue-950 p-7 text-white shadow-[0_28px_80px_rgba(7,26,51,0.24)] transition-transform duration-200 ease-out hover:-translate-y-2 md:-translate-y-5'
                  : 'group relative min-h-72 overflow-hidden rounded-3xl border border-sgs-blue-100 bg-white p-7 shadow-[0_20px_60px_rgba(7,26,51,0.07)] transition-transform duration-200 ease-out hover:-translate-y-1.5'}
              >
                <div className={featured ? 'absolute inset-0 bg-gradient-to-br from-sgs-cyan/10 via-transparent to-transparent' : 'absolute inset-0 bg-gradient-to-br from-sgs-blue-50/45 via-transparent to-transparent'} aria-hidden="true" />
                {featured && <div className="sgs-risk-pulse-ring pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-sgs-cyan/35" aria-hidden="true" />}
                <span className={featured
                  ? 'relative z-10 font-mono text-xs font-semibold tracking-[0.2em] text-sgs-cyan'
                  : 'relative z-10 font-mono text-xs font-semibold tracking-[0.2em] text-sgs-accent'}>
                  {problem.number}
                </span>
                <div className={featured
                  ? 'relative z-10 mt-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sgs-cyan'
                  : 'relative z-10 mt-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-sgs-blue-50 text-sgs-accent transition-colors duration-500 group-hover:bg-sgs-accent group-hover:text-white'}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className={featured
                  ? 'relative z-10 mt-5 font-heading text-xl font-semibold text-white'
                  : 'relative z-10 mt-5 font-heading text-xl font-semibold text-sgs-text-primary'}>
                  {problem.title}
                </h3>
                <p className={featured
                  ? 'relative z-10 mt-3 text-sm leading-relaxed text-white/60'
                  : 'relative z-10 mt-3 text-sm leading-relaxed text-sgs-text-secondary'}>
                  {problem.description}
                </p>
                <span className={featured ? 'relative z-10 mt-8 block h-px w-16 bg-sgs-cyan/60' : 'relative z-10 mt-8 block h-px w-12 bg-sgs-blue-200 transition-all duration-500 group-hover:w-20 group-hover:bg-sgs-accent'} aria-hidden="true" />
              </article>
            )
          })}
          </Stagger>
        </div>
      </div>
    </Section>
  )
}
