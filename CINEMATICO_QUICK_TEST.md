# 🎬 GUIA RÁPIDO — TESTE DO MODO CINEMATOGRÁFICO

## Como Ativar o Modo Debug

### 1. URL Principal com Tudo Ativado
```
http://localhost:5173/?cinematicDebug=true&graphicsQuality=ultra
```

**O que aparece:**
- Painel de debug no canto inferior direito
- Qualidade gráfica forçada a ULTRA
- Todas as animações ativadas
- Console mostra estado inicial

---

## Botões do Painel

### Cenas (▶️)
- **Executar Abertura** → Inicia voxels e fragmentos
- **Executar Voxels** → Materialização por voxels
- **Executar Scanner** → Varredura de risco
- **Executar Frozen Time** → Tempo congelado + análise
- **Executar Spatial Warp** → Deformação espacial
- **Executar Through-Screen** → Transição pela tela
- **Executar Final Cinematográfico** → Encerramento épico

### Qualidade (⚙️)
- **Ultra** → Efeitos máximos (recomendado)
- **High** → Bom suporte
- **Medium** → Reduzido
- **Low** → Mínimo

### Controles (🎮)
- **Ir ao Topo** → Scroll para início
- **Ir ao Hero** → Scroll para seção hero
- **Forçar Animações** → Ignora preferência reduced-motion

### Memória (🔄)
- **Reiniciar Experiência** → Limpa tudo e recarrega

---

## URLs de Teste Rápido

### Teste 1: Qualidade Ultra
```
http://localhost:5173/?cinematicDebug=true&graphicsQuality=ultra
```
✓ Painel aparece
✓ Qualidade: ULTRA
✓ Todos os efeitos ativos

### Teste 2: Reset Completo
```
http://localhost:5173/?cinematicDebug=true&resetExperience=true
```
✓ Memória limpada
✓ Volta ao topo automaticamente
✓ Todas as sequências disponíveis

### Teste 3: Qualidade Específica
```
http://localhost:5173/?cinematicDebug=true&graphicsQuality=high
http://localhost:5173/?cinematicDebug=true&graphicsQuality=medium
http://localhost:5173/?cinematicDebug=true&graphicsQuality=low
```
✓ Alterna entre níveis de qualidade

---

## Informações do Painel

### 📊 Estado Atual
- **Quality**: ultra / high / medium / low / fallback
- **WebGL**: webgl2 / webgl / ✗
- **Scroll**: 0% → 100%
- **Touch**: ✓ / ✗
- **Reduced**: ✓ / ✗
- **FPS**: Contagem em tempo real
- **Audio**: ✓ / ✗
- **Memory**: MB de heap

### 💾 Experiência
- **Intro Seen**: ✓ / ✗
- **Voxel Sequence Seen**: ✓ / ✗

---

## O Que Verificar

### Visual
1. Abrir `?cinematicDebug=true&graphicsQuality=ultra`
2. Painel aparece no canto inferior direito
3. Clicar em "Executar Voxels"
4. Ver animação de materialização
5. Clicar em outras cenas
6. Todas devem renderizar visualmente

### Console
1. Abrir DevTools (F12)
2. Tab Console
3. Ver `console.table` com estado inicial
4. Mudar qualidade no painel
5. Verificar se qualidade atualiza

### Performance
1. Tab Performance de DevTools
2. Ver FPS no painel
3. Comparar: Ultra vs High vs Low
4. Verificar draw calls se possível

---

## Troubleshooting

### Painel não aparece
```
✗ Sem ?cinematicDebug=true na URL
FIX: Adicione na URL
```

### Qualidade não muda
```
✗ Cache do navegador
FIX: Ctrl+Shift+R (reload com cache limpo)
```

### Animações não aparecem
```
✗ WebGL não suportado
FIX: Verificar console para erro
✗ Qualidade em 'fallback'
FIX: Usar ?graphicsQuality=ultra
```

### Scroll bloqueado
```
✗ Modo debug com painel aberto
FIX: Clicar em "Ir ao Topo" no painel
```

---

## Fluxo Recomendado de Teste

1. **Inicialização**
   ```
   http://localhost:5173/?cinematicDebug=true&graphicsQuality=ultra
   ```

2. **Verificar Painel**
   - Painel visível? ✓
   - Estado correto? ✓

3. **Testar Cenas**
   - Clicar: Executar Abertura
   - Clicar: Executar Voxels
   - Clicar: Executar Frozen Time
   - Cada uma renderiza? ✓

4. **Testar Qualidade**
   - Clicar: Ultra
   - Clicar: High
   - Clicar: Medium
   - Mudanças visuais? ✓

5. **Testar Reset**
   - Clicar: Reiniciar Experiência
   - Página recarrega? ✓
   - Volta ao topo? ✓
   - Intro pode rodar novamente? ✓

6. **Testar Scroll**
   - Clicar: Ir ao Topo
   - Clicar: Ir ao Hero
   - Scroll funciona? ✓

---

## Estado Esperado

### Com ?cinematicDebug=true
```
Graphics Quality: ultra ✓
WebGL Supported: true ✓
WebGL Version: webgl2 ✓
Reduced Motion: false ✓
Touch Device: false (desktop) ✓
Scene Visible: true ✓
Audio Enabled: false (até clicar) → true ✓
Painel visível: SIM ✓
```

### Animações Devem Estar Visíveis
- ✓ Voxels se materializando
- ✓ Fragmentos fragmentando
- ✓ Nucleus pulsando
- ✓ Ondas de organização
- ✓ Scanner varrendo
- ✓ Escudo digital
- ✓ Deformação espacial
- ✓ Congelamento de tempo
- ✓ Transição pela tela
- ✓ Partículas e bloom

---

## Comandos no Console

Se quiser verificar manualmente:

```javascript
// Ver qual é a qualidade atual
console.log(document.querySelector('[data-testid="progressive-scene"]'))

// Verificar memória de experiência
JSON.parse(sessionStorage.getItem('sgs-experience-memory'))

// Verificar suporte WebGL
console.log(document.querySelector('canvas'))
```

---

**Tudo pronto para demonstração! 🚀**
