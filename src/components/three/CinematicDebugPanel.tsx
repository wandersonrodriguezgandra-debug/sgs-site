'use client'

import { useEffect } from 'react'
import { useCinematicDebugMode } from '@/providers/CinematicDebugProvider'
import { useCinematicDebug, logCinematicDebugState } from '@/hooks/useCinematicDebug'
import { useDebugPanelState, useDebugPanelActions } from '@/hooks/useDebugPanelActions'

export default function CinematicDebugPanel() {
  const { debugMode, togglePanel } = useCinematicDebugMode()
  const { isVisible, isCollapsed, setIsCollapsed } = useDebugPanelState()
  const debugState = useCinematicDebug()
  const actions = useDebugPanelActions()

  // Log state ao console quando o painel é aberto
  useEffect(() => {
    if (isVisible && debugMode.enabled) {
      logCinematicDebugState(debugState)
    }
  }, [isVisible, debugMode.enabled, debugState])

  if (!isVisible) return null

  const sceneActions = actions.filter((a) => a.category === 'scenes')
  const qualityActions = actions.filter((a) => a.category === 'quality')
  const memoryActions = actions.filter((a) => a.category === 'memory')
  const controlActions = actions.filter((a) => a.category === 'control')

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-sgs-blue-950/95 border border-sgs-accent/30 rounded-lg shadow-2xl font-mono text-xs text-white/80"
      style={{
        maxWidth: '480px',
        maxHeight: isCollapsed ? '40px' : '90vh',
        overflow: isCollapsed ? 'hidden' : 'auto',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-sgs-blue-900/90 border-b border-sgs-accent/20 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sgs-accent animate-pulse" />
          <span className="font-bold text-sgs-accent">🎬 CINEMATIC DEBUG</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-2 py-1 hover:bg-white/10 rounded transition-colors"
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-3 space-y-4">
          {/* Estado Atual */}
          <div className="bg-white/5 rounded p-2 space-y-1 text-xs">
            <div className="font-bold text-sgs-accent mb-2">📊 Estado Atual</div>
            <div className="grid grid-cols-2 gap-1 text-white/70">
              <div>
                <span className="text-white/50">Quality:</span> <span className="text-sgs-accent font-bold">{debugState.graphicsQuality}</span>
              </div>
              <div>
                <span className="text-white/50">WebGL:</span> <span className="text-sgs-accent font-bold">{debugState.webglVersion || '✗'}</span>
              </div>
              <div>
                <span className="text-white/50">Scroll:</span> <span className="text-sgs-accent font-bold">{(debugState.scrollProgress * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-white/50">Touch:</span> <span className="text-sgs-accent font-bold">{debugState.isTouchDevice ? '✓' : '✗'}</span>
              </div>
              <div>
                <span className="text-white/50">Reduced:</span> <span className="text-sgs-accent font-bold">{debugState.reducedMotion ? '✓' : '✗'}</span>
              </div>
              <div>
                <span className="text-white/50">FPS:</span> <span className="text-sgs-accent font-bold">{debugState.fps}</span>
              </div>
              <div>
                <span className="text-white/50">Audio:</span> <span className="text-sgs-accent font-bold">{debugState.audioEnabled ? '✓' : '✗'}</span>
              </div>
              <div>
                <span className="text-white/50">Memory:</span> <span className="text-sgs-accent font-bold">{debugState.memoryUsage}</span>
              </div>
            </div>
          </div>

          {/* Memória de Experiência */}
          <div className="bg-white/5 rounded p-2 text-xs">
            <div className="font-bold text-sgs-accent mb-2">💾 Experiência</div>
            <div className="space-y-1 text-white/70">
              <div>Intro Seen: <span className="text-sgs-accent font-bold">{debugState.introSeen ? '✓' : '✗'}</span></div>
              <div>Voxel Sequence Seen: <span className="text-sgs-accent font-bold">{debugState.voxelSequenceSeen ? '✓' : '✗'}</span></div>
            </div>
          </div>

          {/* Executar Cenas */}
          <div className="bg-white/5 rounded p-2">
            <div className="font-bold text-sgs-accent mb-2">▶️ Cenas</div>
            <div className="grid grid-cols-2 gap-1">
              {sceneActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="px-2 py-1 bg-sgs-accent/20 hover:bg-sgs-accent/40 text-sgs-accent rounded text-xs transition-colors truncate"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Qualidade Gráfica */}
          <div className="bg-white/5 rounded p-2">
            <div className="font-bold text-sgs-accent mb-2">⚙️ Qualidade</div>
            <div className="grid grid-cols-4 gap-1">
              {qualityActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`px-2 py-1 rounded text-xs transition-colors
                    ${debugState.graphicsQuality === action.label.toLowerCase()
                      ? 'bg-sgs-accent text-sgs-blue-950 font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-white/70'
                    }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controles */}
          <div className="bg-white/5 rounded p-2 space-y-1">
            <div className="font-bold text-sgs-accent mb-2">🎮 Controles</div>
            <div className="space-y-1">
              {controlActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="w-full px-2 py-1 text-left bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded text-xs transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reiniciar */}
          <div className="bg-white/5 rounded p-2 space-y-1">
            <div className="font-bold text-sgs-accent mb-2">🔄 Memória</div>
            {memoryActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="w-full px-2 py-1 text-left bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-xs transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Fechar Painel */}
          <button
            onClick={togglePanel}
            className="w-full px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 rounded text-xs transition-colors"
          >
            Ocultar Painel
          </button>
        </div>
      )}
    </div>
  )
}
