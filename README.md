# Site SGS

Landing page institucional do SGS (Sistema de Gestão de Segurança), construída com React, TypeScript e Vite.

## Desenvolvimento

```bash
npm ci
npm run dev
```

O servidor local usa `http://localhost:5173`.

## Verificações

```bash
npm run lint
npm run build
npm run test:e2e:chromium
```

## Estrutura essencial

- `src/`: aplicação React, componentes, configuração e estilos.
- `public/`: assets estáticos usados pela aplicação.
- `tests/`: testes funcionais, de acessibilidade e regressão visual.

## Publicação

O projeto `sgs-site` está hospedado no Cloudflare Pages. O build publicado é o conteúdo de `dist/`, gerado por `npm run build`.

```bash
npx wrangler pages deploy dist --project-name=sgs-site --branch=redesign-visual
```
