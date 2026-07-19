interface ChapterMarkProps {
  number: string
  label: string
  tone?: 'light' | 'dark'
}

// Marca de capítulo: número-fantasma gigante ao fundo (decorativo, fora do
// fluxo de leitura) + rótulo "Capítulo N ( Nome )" visível. Puro CSS/markup,
// sem scroll-trigger — a numeração é estática, não anima.
export default function ChapterMark({ number, label, tone = 'light' }: ChapterMarkProps) {
  const ghostColor = tone === 'dark' ? 'text-white/[0.05]' : 'text-sgs-blue-950/[0.04]'
  const labelColor = tone === 'dark' ? 'text-sgs-blue-200' : 'text-sgs-accent'

  return (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-6 right-0 select-none font-heading text-[9rem] font-bold leading-none sm:text-[14rem] md:text-[18rem] ${ghostColor}`}
      >
        {number}
      </span>
      <p className={`relative z-10 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] ${labelColor}`}>
        Capítulo {number} ( {label} )
      </p>
    </>
  )
}
