# Decisões de arquitetura

## 2026-07-19 — LCP ~3,2s aceito como limitação documentada do CSR; prerender adiado

**Decisão**: manter o site como CSR puro (Vite + React 19, sem SSR/SSG). O
gate de performance mobile (Lighthouse, 5 execuções, build de produção)
mede LCP mediano de **3244ms**, acima da meta de <2500ms. Performance (88),
CLS (0) e transferência (467KB) passam.

**Causa raiz**: o `<h1>` do hero só existe no DOM depois que o bundle JS
inicial (~148KB gzip declarado + ~53KB gzip de Lenis/GSAP carregados logo
em seguida via `ScrollProvider`, ~201KB gzip no total) baixa, parseia e o
React monta a árvore. O breakdown do próprio Lighthouse mostra TTFB de
~5ms e "element render delay" de ~177ms — a diferença até os ~3,2s é
inteiramente o motor de simulação de rede/CPU do Lighthouse processando
essa cadeia de JS antes do primeiro paint do H1.

**Alternativa avaliada**: um spike de prerender estático da rota `/` via
`react-dom/static` (`prerenderToNodeStream`, API estável do React 19.2)
com hidratação no client foi desenhado e parcialmente iniciado. O caminho
teria: extraído o Router de `App.tsx` para aceitar `StaticRouter` no
build; um script `scripts/prerender.mjs` rodando após `vite build`,
injetando HTML real do Header+Hero no `dist/index.html`; `main.tsx`
trocando `createRoot` por `hydrateRoot`; e ajuste do placeholder do
scanner para nascer com altura neutra idêntica em servidor/client (evitar
mismatch de hidratação).

**Por que foi adiado, não descartado**: o usuário decidiu atacar a
migração do Motion System (Framer Motion → GSAP/CSS tokenizado nos 12
arquivos restantes) antes de investir mais tempo no spike de prerender.
É um adiamento consciente — o prerender continua sendo a via mais direta
para resolver o LCP estrutural, e deve ser retomado como item de backlog
prioritário depois que a migração de animações estiver concluída.

**Como aplicar esta decisão**: não tratar o LCP de ~3,2s como bloqueador
de outras entregas até o prerender ser retomado. Qualquer nova seção ou
componente deve continuar seguindo o orçamento de performance já
estabelecido (transform/opacity apenas, lazy-by-proximity quando aplicável,
sem inflar ainda mais o bundle inicial), para não piorar o número enquanto
ele segue como débito conhecido.
