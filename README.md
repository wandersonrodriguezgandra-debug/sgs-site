# Site SGS

Landing page institucional do SGS (Sistema de Gestão de Segurança), construída com React, TypeScript e Vite.

## Desenvolvimento

```bash
npm ci
npm run dev
```

O servidor local usa `http://localhost:5173`.

### Formulário de demonstração

O envio usa uma Cloudflare Pages Function, Resend e Cloudflare Turnstile. Copie
`.dev.vars.example` para `.dev.vars` e configure:

- `RESEND_API_KEY`: chave criada no Resend;
- `DEMO_TO_EMAIL`: destinatário das solicitações;
- `DEMO_FROM_EMAIL`: remetente pertencente a um domínio verificado no Resend.
- `TURNSTILE_SECRET_KEY`: chave privada usada pela Function para validar o desafio.

Essas variáveis são lidas apenas no servidor e não recebem o prefixo `VITE_`.
Copie também `.env.example` para `.env.local` e configure
`VITE_TURNSTILE_SITE_KEY`, que é a chave pública do widget carregado no navegador.

Para testar o build com a Function localmente:

```bash
npm run build
npx wrangler pages dev dist
```

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

Antes da publicação, cadastre os três segredos no projeto sem gravá-los no repositório:

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name=sgs-site
npx wrangler pages secret put DEMO_TO_EMAIL --project-name=sgs-site
npx wrangler pages secret put DEMO_FROM_EMAIL --project-name=sgs-site
npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name=sgs-site
```

`VITE_TURNSTILE_SITE_KEY` precisa existir no ambiente durante `npm run build`;
ela é pública e não substitui a validação obrigatória com `TURNSTILE_SECRET_KEY`
na Function.
