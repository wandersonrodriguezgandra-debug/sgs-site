'use client'

export default function SceneFallback() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-sgs-blue-900/80 backdrop-blur-sm shadow-glow">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-white/40">SGS Dashboard</span>
          <div className="w-4" />
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Adesão DDS', value: '94%', color: 'text-green-400' },
              { label: 'Documentos', value: '87%', color: 'text-sgs-blue-300' },
              { label: 'Treinamentos', value: '72%', color: 'text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50">{stat.label}</p>
                <p className={`text-sm font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="h-16 bg-gradient-to-r from-sgs-accent/20 to-sgs-blue-600/20 rounded-lg flex items-center justify-center">
            <span className="text-xs text-white/50">Gráfico de indicadores — preview</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-white/40 mb-3">Documentos recentes</p>
            <div className="space-y-2">
              {['DDS 15/07 — Segurança com EPI', 'APR — Manutenção Elétrica', 'Inspeção — Setor A'].map((doc) => (
                <div key={doc} className="flex items-center gap-2 text-xs text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-sgs-accent" />
                  {doc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 left-[10%] right-[10%] h-16 bg-gradient-to-b from-sgs-accent/5 to-transparent rounded-full blur-xl opacity-60 pointer-events-none" aria-hidden />
      <p className="text-[10px] text-white/20 text-center mt-6 italic">
        IMAGEM TEMPORÁRIA — substituir pela captura oficial do SGS
      </p>
    </div>
  )
}
