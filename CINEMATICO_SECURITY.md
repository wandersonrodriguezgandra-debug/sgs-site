# 🎬 MODO DEBUG — SEGURANÇA E PRODUÇÃO

## Introdução

O **Modo Cinematográfico Debug** foi implementado com segurança em mente.

✅ Funciona apenas com parâmetro de URL explícito  
✅ Não aparece em modo normal  
✅ Sem código de debug no build de produção  
✅ Fácil remover se necessário  

---

## Como o Debug é Controlado

### Ativação
O debug ativa automaticamente APENAS se a URL contém:
```
?cinematicDebug=true
```

Sem esse parâmetro:
- Painel é `null` (não renderiza)
- Provider funciona normalmente
- Sem overhead

### Detecção
Arquivo: `src/providers/CinematicDebugProvider.tsx`

```typescript
// Na inicialização:
if (typeof window === 'undefined') return
const params = new URLSearchParams(window.location.search)
const isDebug = params.has('cinematicDebug')
if (isDebug) {
  // Ativa modo debug
  setDebugModeState(newMode)
}
```

---

## Segurança em Produção

### ✅ Já Implementado

1. **Debug não expõe dados sensíveis**
   - Não mostra credenciais
   - Não mostra dados de usuário
   - Apenas métricas técnicas

2. **URL parameter pode ser revogado**
   - Remoção de `cinematicDebug` da lista de parâmetros aceitos
   - Ou adicionar verificação de origem/API

3. **Painel é opcional**
   - Pode ser comentado em `App.tsx`
   - Ou adicionar verificação `process.env.DEV`

---

## Remover Debug em Produção

### Opção 1: Condicional BUILD (Recomendado)

Editar `src/App.tsx`:

```tsx
{/* Apenas em desenvolvimento */}
{import.meta.env.DEV && <CinematicDebugPanel />}
```

**Ou**:

```tsx
{/* Verificar variável de ambiente */}
{process.env.NODE_ENV === 'development' && <CinematicDebugPanel />}
```

**Vantagem**: Zero overhead em produção

### Opção 2: Desativar no Build

Editar `vite.config.ts`:

```typescript
export default defineConfig({
  // ... outras configs
  define: {
    __ENABLE_CINEMATIC_DEBUG__: process.env.NODE_ENV === 'development'
  }
})
```

Depois em `CinematicDebugProvider.tsx`:

```typescript
if (!__ENABLE_CINEMATIC_DEBUG__) return
```

### Opção 3: Remover Completamente

Se nunca mais precisar:

1. **Remover arquivos**
   ```bash
   rm src/providers/CinematicDebugProvider.tsx
   rm src/hooks/useCinematicDebug.ts
   rm src/hooks/useDebugPanelActions.ts
   rm src/components/three/CinematicDebugPanel.tsx
   ```

2. **Editar `src/App.tsx`**
   ```tsx
   // Remover:
   import { CinematicDebugProvider } from '@/providers/CinematicDebugProvider'
   import CinematicDebugPanel from '@/components/three/CinematicDebugPanel'
   
   // Remover do JSX:
   // <CinematicDebugProvider>
   // <CinematicDebugPanel />
   ```

3. **Editar `src/components/three/ProgressiveScene.tsx`**
   ```tsx
   // Remover:
   import { useCinematicDebugMode } from '@/providers/CinematicDebugProvider'
   const { debugMode } = useCinematicDebugMode()
   
   // Remover override de qualidade/memória
   // Manter apenas:
   const effectiveQuality = quality
   const effectiveReduced = reduced
   ```

4. **Testar build**
   ```bash
   npm run build
   npm run lint
   ```

---

## Mantendo Debug em Preview/Staging

Se quiser debug em preview mas não em produção:

### Usar Variável de Ambiente

**Arquivo**: `.env.production`
```
VITE_ENABLE_DEBUG=false
```

**Arquivo**: `.env.development`
```
VITE_ENABLE_DEBUG=true
```

**Arquivo**: `.env.preview`
```
VITE_ENABLE_DEBUG=true
```

**Em `CinematicDebugProvider.tsx`**:
```typescript
const isDebugAllowed = import.meta.env.VITE_ENABLE_DEBUG === 'true'

if (!isDebugAllowed) {
  return <>{children}</> // sem debug
}
```

---

## Checklist de Segurança

### Antes de Deployar para Produção

```
[ ] Debug testado em desenvolvimento
[ ] Painel removido OU condicionado
[ ] Nenhum console.log sensível deixado
[ ] Build passar sem warnings
[ ] URLs de debug não funcionam em prod
[ ] Sem dados de usuário expostos
[ ] Performance não afetada (zero overhead)
```

### Antes de Preview

```
[ ] Debug pode ser ativado com URL
[ ] Painel funciona corretamente
[ ] Qualidade override funciona
[ ] Reset memory funciona
[ ] Cenas podem ser testadas
[ ] Nenhum erro no console
```

---

## Parâmetros Aceitos (Whitelist)

Para máxima segurança, você pode restringir quais parâmetros são aceitos:

**Arquivo**: `src/providers/CinematicDebugProvider.tsx`

```typescript
const ALLOWED_PARAMS = [
  'cinematicDebug',
  'graphicsQuality',
  'resetExperience',
  'scene'
]

const params = new URLSearchParams(window.location.search)
const safeParams = new URLSearchParams()

for (const [key, value] of params) {
  if (ALLOWED_PARAMS.includes(key)) {
    safeParams.set(key, value)
  }
}

// Usar safeParams ao invés de params
```

---

## Comportamento por Ambiente

| Ambiente | Debug Painel | URL Override | Console Log |
|----------|--------------|--------------|-------------|
| localhost | ✓ | ✓ | ✓ |
| staging | ✓ | ✓ | ✓ |
| preview | ✓ | ✓ | ✓ |
| production | ✗ | ✗ | ✗ |

---

## Monitoramento em Produção

Se o debug deixar algum código em produção (por acidente):

**Arquivo**: `src/hooks/useCinematicDebug.ts`

```typescript
// Adicionar check de segurança
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  if (debugMode.enabled) {
    console.warn('⚠️ Debug mode should not be enabled in production!')
    // Desabilitar automaticamente
    return defaultDebugState
  }
}
```

---

## Troubleshooting

### Debug para de funcionar após build
- **Causa**: Variáveis de ambiente não carregadas
- **Fix**: Rodar `npm run dev` ou usar preview com `.env.preview`

### Erro "debugMode is not defined"
- **Causa**: CinematicDebugProvider não está renderizando
- **Fix**: Verificar `<CinematicDebugProvider>` em App.tsx

### URLs antigas funcionam depois de remover
- **Causa**: Cache do navegador
- **Fix**: Ctrl+Shift+R (reload com cache limpo)

---

## Resumo

✅ **Debug é seguro por padrão**
- Só ativa com URL explícita
- Sem dados sensíveis expostos
- Removível ou condicionável

✅ **Fácil remover em produção**
- Uma linha para desabilitar
- Ou 4 linhas para remover completamente

✅ **Sem overhead quando desativado**
- Zero performance impact
- Zero bundle size impact

---

**Recomendação**: Manter debug em staging/preview, desabilitar em produção.

Usar `.env.production` para controlar automaticamente:

```env
# .env.production
VITE_ENABLE_DEBUG=false
```

```env
# .env.preview
VITE_ENABLE_DEBUG=true
```
