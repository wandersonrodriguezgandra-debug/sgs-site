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

## 2026-07-19 — Prerender promovido a primeira etapa pós-Imersão

**Decisão**: dentro da sequência de peças da Etapa Imersão (arco de
luminância, tipografia de capítulos, dualidade risco/proteção, tiers de
textura), o prerender estático descrito na decisão anterior é promovido a
**primeira etapa do backlog depois que a Imersão terminar** — não mais "a
retomar quando der", mas o próximo item de arquitetura com prioridade
definida.

**Por quê**: a Imersão adiciona camadas visuais adicionais (arco de
luminância, tipografia de capítulos) que também competem por tempo de boot
do React antes do primeiro paint. Resolver o CSR/LCP estrutural antes de
empilhar mais peças em cima dele evita que o débito de performance cresça
junto com a superfície visual da Imersão.

## 2026-07-19 — CLS real sob scroll profundo (~1,9) no lazy mount do Scanner: investigado, não corrigido

**Contexto**: o gate de Lighthouse já aceito mede CLS 0 porque o protocolo
padrão do Lighthouse (`--preset=perf`) não simula scroll do usuário — a
métrica é calculada só até a janela de carregamento inicial, antes de o
Scanner sequer entrar em `rootMargin`. Um teste manual complementar via
`PerformanceObserver` simulando scroll real (8x `wheel` events, viewport
390×844) mediu **CLS ≈ 1.93–1.99**, disparado inteiramente pelo mount do
`LazyScannerSection` (`src/pages/HomePage.tsx`) quando `isNear` vira `true`.

**Causa raiz confirmada**: a Layout Instability API do browser atribui
shift a qualquer nó que apareça com `previousRect: {0,0,0,0}` — ou seja,
qualquer elemento que não existia geometricamente no frame anterior conta
como shift ao aparecer, **mesmo que**:
- o container pai já reserve a altura final via `min-height`/`height` desde
  o placeholder;
- um placeholder idêntico em altura seja mantido sobreposto por cima até um
  frame depois do conteúdo real assentar;
- o pai nunca mude de identidade (só o filho interno é trocado).

Foram tentadas e descartadas nesta sessão, todas medidas e revertidas:
1. Recalibrar a altura estimada do placeholder mobile (`100vh` → `2720px`,
   medida real do `StaticStages` renderizado) — não mudou o CLS porque o
   ambiente de teste (Playwright, viewport 390 sem `hasTouch`) não é
   detectado como touch por `shouldPin()`, então monta `PinnedScanner`
   (pinned), não `StaticStages`.
2. Segurar `min-height` no wrapper por 2 frames (`requestAnimationFrame`
   duplo) após o mount — não mudou nada, porque o shift é atribuído ao nó
   filho que aparece, não ao pai que já tinha a altura certa.
3. Overlap do placeholder (absolutamente posicionado, por cima) mantido
   até um frame depois do real assentar — mesmo resultado; o nó real por
   baixo do overlay ainda conta o shift ao nascer, mesmo coberto
   visualmente.
4. Manter o mesmo `<div id="scanner">` pai vivo, trocando só o filho
   (`isNear ? <ScannerSection/> : <placeholder/>`) — mesmo resultado; o
   filho interno "aparece do zero" de qualquer forma.

**Por que não foi corrigido agora**: a única correção que resolveria de
verdade — manter `<ScannerSection/>` real sempre montado no DOM desde o
primeiro paint (com `visibility: hidden`, preservando geometria) — exige
carregar o chunk do GSAP (~47KB gzip) no mount inicial da página, o que
reintroduziria exatamente a competição pelo LCP que o lazy-loading por
proximidade foi desenhado para evitar. É um trade-off arquitetural real
(CLS sob scroll vs. LCP), não um bug com correção isolada, e a via mais
sólida para resolvê-lo de verdade é a mesma do LCP: prerender estático,
onde o Scanner nasceria com geometria definida no HTML antes mesmo da
hidratação, eliminando o "nó aparece do zero" na raiz.

**Como aplicar esta decisão**: o gate formal de Lighthouse (CLS 0) segue
válido e não foi violado por nenhuma peça da Imersão — nenhuma peça nova
piorou esse número. O CLS sob scroll profundo é débito pré-existente
(confirmado idêntico antes e depois da peça 7 do arco de luminância) e
deve ser resolvido junto do prerender, não isoladamente.

## 2026-07-19 — Mapeamento dos 3 WebP: sem confirmação, sem substituição fabricada

**Contexto**: o adendo da Imersão pediu, antes da peça 1c (reveals de
shader sobre capturas de produto), mapear onde os 3 WebP de produto
aparecem e propor substituição por capturas de tenant demonstrativo caso a
confirmação de variáveis de ambiente do formulário (pendência já antiga)
não chegasse a tempo.

**Mapeamento** (via grep no código-fonte):
- `cockpit-sst.webp` — usado em `DashboardSection.tsx`,
  `ScannerSection.tsx` (preview interno do `PinnedScanner`/`StaticStages`)
  e `ModuleDetailsDialog.tsx` (categoria "Analytics").
- `sgs-intelligence.webp` — usado em `SecuritySection.tsx` e
  `ModuleDetailsDialog.tsx` (categoria "Segurança").
- `sgs-responsive.webp` — usado em `ProductShowcaseSection.tsx` e
  `ModuleDetailsDialog.tsx` (categoria default/fallback).

**Decisão**: não fabricar imagens de "tenant demonstrativo" para
substituir essas 3 capturas. Criar dados ou telas fictícias que aparentem
ser de um cliente real, sem confirmação explícita do que pode ou não ser
mostrado, contradiz o princípio anti-invenção que guia o projeto desde a
Fase 1 (nada de dados fabricados, números inventados ou UI que finja ser
uma tela real do produto sem sê-lo). As 3 imagens atuais permanecem em uso
como estão — elas já são as aprovadas e em produção, mesmo que a
confirmação formal das variáveis de ambiente do formulário siga pendente
separadamente.

**Como aplicar esta decisão**: nenhuma peça da Imersão deve tentar gerar
ou trocar essas imagens por conta própria. Se a confirmação chegar, a
substituição (se necessária) deve ser um item específico, revisado e
aprovado isoladamente — não uma decisão tomada dentro do trabalho de
outra peça.

## 2026-07-19 — Peças 1b e 10 (shader/WebGL) bloqueadas: plano original nunca recebido

**Contexto**: a sequência da Imersão autorizada lista as peças na ordem
7 → 1b → 8 → 9 → 1c → 1d → 2 → 3, referenciando "o plano já aprovado" para
as peças 1b, 1c, 1d, 2 e 3. Só o adendo com as peças 7, 8, 9 e 10 chegou
a esta sessão, com descrição técnica completa. O conteúdo das peças 1b
(scanner em luz de shader), 1c, 1d, 2 e 3 nunca foi apresentado — nem o
plano original, nem um resumo — apesar de terem sido perguntadas
diretamente (ver troca anterior nesta sessão).

**Decisão**: as peças 7, 8, 9 e 10 foram implementadas nesta sessão
porque o adendo trazia detalhe técnico suficiente para decidir com
segurança (paleta, estrutura de conteúdo, comportamento em
reduced-motion). A peça 1b — a primeira que exige WebGL — foi
explicitamente pulada por instrução do usuário ("seguir só com as peças
já descritas por ora"). A peça 10 (tiers de textura high/low por
capacidade de dispositivo) depende inteiramente de 1b existir primeiro
(não há textura sem uma camada WebGL para consumi-la), então também fica
bloqueada por consequência direta, não por escolha independente.

**Por que não avancei sozinho**: reintroduzir WebGL neste projeto é uma
mudança de stack real — nova dependência, novo runtime, orçamento de
chunk (≤180KB lazy, fora do caminho crítico, conforme os trilhos da
Imersão), decisão de qual técnica de shader usar para "luz" sobre o
scanner, e os tiers de qualidade por `deviceMemory`/`hardwareConcurrency`/
DPR da peça 10. O Sprint 0 já removeu Three.js do projeto por não ter
consumidor real — reintroduzir wecGL sem as especificações exatas que o
"dono" presumivelmente já decidiu (e que estão no plano que não chegou)
seria inventar arquitetura em uma área de alto risco de performance e
orçamento de bundle, o oposto do rigor que guiou a migração de animações.

**Como aplicar esta decisão**: 1b e 10 seguem bloqueadas até o conteúdo
real do plano original (peças 1b, 1c, 1d, 2, 3) ser fornecido. Quando
chegar, tratar como uma etapa própria — não encaixar apressadamente no
que já foi implementado sem revisar se a base (arco de luminância, tipo
de capítulos, dualidade) já commitada precisa de ajuste para acomodá-la.
