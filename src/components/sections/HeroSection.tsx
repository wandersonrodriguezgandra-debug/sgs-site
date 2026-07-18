const operationalCycle = [
  {
    number: '01',
    title: 'Detectar',
    description: 'Registrar perigos e desvios no contexto da operação.',
  },
  {
    number: '02',
    title: 'Classificar',
    description: 'Avaliar criticidade e definir a prioridade de resposta.',
  },
  {
    number: '03',
    title: 'Agir',
    description: 'Atribuir responsáveis, prazos e medidas de controle.',
  },
  {
    number: '04',
    title: 'Comprovar',
    description: 'Consolidar documentos e histórico para auditoria.',
  },
] as const

const operationalProofs = [
  'Isolamento por empresa',
  'Privacidade e LGPD por padrão',
  'Histórico rastreável de ações',
] as const

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-testid="hero-section"
      className="relative min-h-[100svh] border-b border-white/15 bg-sgs-blue-950 text-white"
    >
      <div className="container-sgs flex min-h-[100svh] items-center py-28 sm:py-32 lg:py-36">
        <div className="grid w-full gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] lg:items-center lg:gap-16 xl:gap-24">
          <div>
            <p
              data-testid="hero-badge"
              className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-sgs-blue-200 sm:text-sm"
            >
              <span className="h-px w-8 bg-sgs-blue-300" aria-hidden="true" />
              Gestão de SST conectada
            </p>

            <h1
              id="hero-title"
              data-testid="hero-title"
              className="max-w-4xl font-heading text-[clamp(2.5rem,7vw,4.75rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white"
            >
              O sistema que enxerga o risco, organiza a resposta e comprova a proteção.
            </h1>

            <p
              data-testid="hero-description"
              className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8"
            >
              Do registro em campo à evidência auditável, o SGS conecta riscos, responsáveis, prazos e documentos em um único fluxo operacional.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#contato"
                data-testid="hero-cta-demo"
                className="inline-flex min-h-11 w-full items-center justify-center border border-white bg-white px-6 py-3 text-center text-sm font-semibold text-sgs-blue-950 hover:bg-sgs-blue-50 focus-visible:outline-white sm:w-auto"
              >
                Solicitar demonstração
              </a>
              <a
                href="#modules"
                data-testid="hero-cta-modules"
                className="inline-flex min-h-11 w-full items-center justify-center border border-white/40 px-6 py-3 text-center text-sm font-semibold text-white hover:border-white hover:bg-white/10 focus-visible:outline-white sm:w-auto"
              >
                Conhecer os módulos
              </a>
            </div>

            <ul
              aria-label="Compromissos operacionais do SGS"
              className="mt-10 grid border-y border-white/20 sm:grid-cols-3"
            >
              {operationalProofs.map((proof) => (
                <li
                  key={proof}
                  className="flex min-h-14 items-center gap-3 border-b border-white/15 py-4 text-sm leading-5 text-white/80 last:border-b-0 sm:border-r sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                >
                  <span className="h-1.5 w-1.5 shrink-0 bg-sgs-blue-300" aria-hidden="true" />
                  {proof}
                </li>
              ))}
            </ul>
          </div>

          <aside aria-labelledby="hero-cycle-title" className="lg:border-l lg:border-white/20 lg:pl-12">
            <div className="border border-white/20">
              <div className="border-b border-white/20 px-5 py-5 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sgs-blue-200">
                  Da observação à evidência
                </p>
                <h2 id="hero-cycle-title" className="mt-2 font-heading text-xl font-semibold text-white sm:text-2xl">
                  Ciclo operacional SGS
                </h2>
              </div>

              <ol>
                {operationalCycle.map((step) => (
                  <li
                    key={step.number}
                    className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b border-white/15 px-5 py-5 last:border-b-0 sm:gap-4 sm:px-6"
                  >
                    <span className="font-heading text-sm font-semibold text-sgs-blue-200" aria-hidden="true">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-semibold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/65">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
