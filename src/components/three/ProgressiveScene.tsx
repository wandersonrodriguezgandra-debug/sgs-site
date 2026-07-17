'use client'

import { useRef, useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { ContactShadows } from '@react-three/drei'
import SceneCanvas from '@/components/three/SceneCanvas'
import SceneLighting from '@/components/three/SceneLighting'
import SceneEffects from '@/components/three/SceneEffects'
import LaptopModel from '@/components/three/LaptopModel'
import FloatingModuleCard from '@/components/three/FloatingModuleCard'
import FloatingMetrics from '@/components/three/FloatingMetrics'
import CameraRig from '@/components/three/CameraRig'
import MinimalParticles from '@/components/three/MinimalParticles'
import EnergyConnection from '@/components/three/EnergyConnection'
import HolographicIndicator from '@/components/three/HolographicIndicator'
import SharedWebGLElement from '@/components/three/SharedWebGLElement'
import SceneQualityController from '@/components/three/SceneQualityController'
import FragmentSystem from '@/components/three/FragmentSystem'
import OrganizationWave from '@/components/three/OrganizationWave'
import ScannerRisk from '@/components/three/ScannerRisk'
import ProtectionField from '@/components/three/ProtectionField'
import DocumentConstruction from '@/components/three/DocumentConstruction'
import TimelinePrediction from '@/components/three/TimelinePrediction'
import NucleusCore from '@/components/three/NucleusCore'
import { VoxelMaterialization } from '@/components/three/VoxelMaterialization'
import { SpatialWarp } from '@/components/three/SpatialWarp'
import { ThroughScreenTransition } from '@/components/three/ThroughScreenTransition'
import { useSceneVisibility } from '@/hooks/useSceneVisibility'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useNarrativeProgress } from '@/hooks/useNarrativeProgress'
import { useCinematicDirector } from '@/hooks/useCinematicDirector'
import { useExperienceMemory } from '@/hooks/useExperienceMemory'
import { useCinematicAudio } from '@/hooks/useCinematicAudio'
import { useCinematicTime } from '@/hooks/useCinematicTime'
import { useCinematicDebugMode } from '@/providers/CinematicDebugProvider'
import type { GraphicsQuality, SceneLoadingState } from '@/types/three'

const DigitalCity = lazy(() => import('@/components/three/DigitalCity'))
const TunnelOfModules = lazy(() => import('@/components/three/TunnelOfModules'))
const ChainReaction = lazy(() => import('@/components/three/ChainReaction'))
const FrozenTimeAnalysis = lazy(() => import('@/components/three/FrozenTimeAnalysis'))
const AlertTransformation = lazy(() => import('@/components/three/AlertTransformation'))
const CinematicEnding = lazy(() => import('@/components/three/CinematicEnding'))

const moduleData = [
  { label: 'APR Aprovada', value: '12', color: '#22c55e', progress: 0.75 },
  { label: 'Inspeções', value: '156', color: '#3b82f6', progress: 0.62 },
  { label: 'Documentos', value: '24', color: '#f59e0b', progress: 0.88 },
  { label: 'Ações', value: '87%', color: '#06b6d4', progress: 0.91 },
]

interface ProgressiveSceneProps {
  onLoadingChange?: (state: SceneLoadingState) => void
}

export default function ProgressiveScene({ onLoadingChange }: ProgressiveSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const quality = useGraphicsQuality()
  const reduced = useReducedMotion()
  const visible = useSceneVisibility(containerRef)
  const narrativeProgress = useNarrativeProgress()
  const director = useCinematicDirector()
  const [loadingState, setLoadingState] = useState<SceneLoadingState>('poster')
  const { memory, markCompleted } = useExperienceMemory()
  const audio = useCinematicAudio()
  const cinematicTime = useCinematicTime()
  const { debugMode } = useCinematicDebugMode()

  // Quando em modo debug, usar override de qualidade e ignorar flags de memória
  const effectiveQuality: GraphicsQuality = debugMode.graphicsQualityOverride || quality
  const effectiveReduced = debugMode.enabled ? false : reduced
  const voxelSequenceSeen = debugMode.enabled ? false : memory.voxelSequenceSeen

  useEffect(() => {
    const enable = () => {
      if (!audio.enabled) {
        audio.setEnabled(true)
      }
    }
    window.addEventListener('click', enable, { once: true })
    window.addEventListener('touchstart', enable, { once: true })
    return () => {
      window.removeEventListener('click', enable)
      window.removeEventListener('touchstart', enable)
    }
  }, [audio])

  const updateProgress = director.updateProgress
  useEffect(() => {
    updateProgress(narrativeProgress)
  }, [narrativeProgress, updateProgress])

  const handleLoadingChange = useCallback((state: SceneLoadingState) => {
    setLoadingState(state)
    onLoadingChange?.(state)
  }, [onLoadingChange])

  const showFullScene = visible && effectiveQuality !== 'fallback'
  const showReducedPoster = effectiveReduced
  const showEffects = loadingState === 'complete' || loadingState === 'effects-loading'

  const seq = director.state.activeSequence
  const activeObjects = seq?.activeObjects || []
  const cameraPoint = director.getCameraPoint()
  const cameraTarget: [number, number, number] = [0, 0.4 - narrativeProgress * 0.05, 0]

  const openingProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.00) / 0.20))
  const organizeProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.08) / 0.12))
  const scannerProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.25) / 0.10))
  const shieldProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.38) / 0.10))
  const docProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.50) / 0.08))
  const chainProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.60) / 0.10))
  const tunnelProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.72) / 0.10))
  const cityProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.78) / 0.08))
  const timelineProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.84) / 0.06))
  const alertProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.30) / 0.20))
  const endingProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.92) / 0.08))

  const voxelProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.00) / 0.15))
  const warpProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.35) / 0.15))
  const throughScreenProgress = Math.max(0, Math.min(1, (narrativeProgress - 0.70) / 0.12))

  const isAtInspectionSection = narrativeProgress > 0.25 && narrativeProgress < 0.35
  const freezeTriggeredRef = useRef(false)

  useEffect(() => {
    if (
      isAtInspectionSection &&
      !freezeTriggeredRef.current &&
      !effectiveReduced &&
      effectiveQuality !== 'low' &&
      effectiveQuality !== 'fallback'
    ) {
      freezeTriggeredRef.current = true
      cinematicTime.freeze('risk-analysis', {
        riskType: 'Trabalho em Altura',
        criticality: 'Crítica',
        location: 'Setor A — Plataforma 3',
        responsible: 'João Silva',
        deadline: '15 dias',
        action: 'Instalação de guarda-corpo',
        status: 'Em análise',
        control: 'Administrativo + Engenharia',
      })

      if (audio.enabled) {
        audio.play('time-freeze')
      }
    }

    if (narrativeProgress > 0.38 && freezeTriggeredRef.current) {
      if (cinematicTime.state.frozen) {
        cinematicTime.resume()
        if (audio.enabled) {
          audio.play('time-resume')
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAtInspectionSection, effectiveReduced, effectiveQuality, cinematicTime, audio])

  useEffect(() => {
    if (voxelProgress > 0.8 && !voxelSequenceSeen) {
      markCompleted('voxel-materialization')
    }
  }, [voxelProgress, voxelSequenceSeen, markCompleted])

  const prevVoxelRef = useRef(0)
  const prevWarpRef = useRef(0)
  const prevThroughScreenRef = useRef(0)

  useEffect(() => {
    if (voxelProgress > 0.1 && prevVoxelRef.current <= 0.1 && audio.enabled) audio.play('voxel-formation')
    if (voxelProgress > 0.9 && prevVoxelRef.current <= 0.9 && audio.enabled) audio.play('voxel-complete')
    prevVoxelRef.current = voxelProgress
  }, [voxelProgress, audio])

  useEffect(() => {
    if (warpProgress > 0.1 && prevWarpRef.current <= 0.1 && audio.enabled) audio.play('shield-activate')
    prevWarpRef.current = warpProgress
  }, [warpProgress, audio])

  useEffect(() => {
    if (throughScreenProgress > 0.1 && prevThroughScreenRef.current <= 0.1 && audio.enabled) audio.play('through-screen')
    prevThroughScreenRef.current = throughScreenProgress
  }, [throughScreenProgress, audio])

  const themeColor = director.state.currentTheme.color

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] lg:min-h-[500px]"
      data-testid="progressive-scene"
      aria-hidden="true"
    >
      {(loadingState === 'poster' || loadingState === 'canvas-loading' || showReducedPoster) && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 pointer-events-none
            ${loadingState === 'basic-ready' || loadingState === 'complete' ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="relative w-full max-w-lg mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-sgs-blue-900/80 backdrop-blur-sm">
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
                  ].map((stat: { label: string; value: string; color: string }) => (
                    <div key={stat.label} className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/50">{stat.label}</p>
                      <p className={`text-sm font-semibold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-16 bg-gradient-to-r from-sgs-accent/20 to-sgs-blue-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white/50">Carregando cena 3D...</span>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs text-white/40 mb-3">Documentos recentes</p>
                  <div className="space-y-2">
                    {['DDS 15/07 — Segurança com EPI', 'APR — Manutenção Elétrica', 'Inspeção — Setor A'].map((doc: string) => (
                      <div key={doc} className="flex items-center gap-2 text-xs text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-sgs-accent" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFullScene && !showReducedPoster && (
        <SceneCanvas
          onContextLost={() => {}}
          fallback={null}
          onLoadingChange={handleLoadingChange}
        >
          <SceneQualityController onQualityChange={() => {}}>
            <CameraRig
              cinematicPosition={cameraPoint}
              cinematicTarget={cameraTarget}
            />

            <SceneEffects>
              <SceneLighting />

              <FragmentSystem
                organizationProgress={organizeProgress}
                active={openingProgress > 0 && openingProgress < 1}
                color={themeColor}
              />

              <NucleusCore
                active={openingProgress > 0.1}
                formationProgress={Math.max(0, openingProgress - 0.1) * 2}
                color={themeColor}
              />

              {/* Phase 3G — Materialização por voxels (substitui o sistema de pontos anterior) */}
              {(effectiveQuality === 'ultra' || effectiveQuality === 'high' || effectiveQuality === 'medium') && (
                <VoxelMaterialization
                  progress={voxelProgress}
                  quality={effectiveQuality}
                />
              )}

              <OrganizationWave
                progress={organizeProgress}
                active={activeObjects.includes('wave-organize')}
                color={themeColor}
              />

              {openingProgress > 0.15 && (
                <LaptopModel screenTexture={null} />
              )}

              <ScannerRisk
                progress={scannerProgress}
                active={activeObjects.includes('scanner')}
                color={themeColor}
              />

              <ProtectionField
                formationProgress={shieldProgress}
                active={activeObjects.includes('shield')}
                color={themeColor}
              />

              {/* Phase 3G — Deformação espacial */}
              {effectiveQuality === 'ultra' && !effectiveReduced && (
                <SpatialWarp
                  progress={warpProgress}
                  strength={0.8}
                  radius={2.0}
                  depth={1.0}
                  color={themeColor}
                  opacity={0.4}
                />
              )}

              {/* Phase 3G — Frozen Time Analysis */}
              {effectiveQuality !== 'low' && !effectiveReduced && (
                <Suspense fallback={null}>
                  <FrozenTimeAnalysis enabled={isAtInspectionSection} />
                </Suspense>
              )}

              <DocumentConstruction
                progress={docProgress}
                active={activeObjects.includes('document')}
              />

              <Suspense fallback={null}>
                <ChainReaction
                  progress={chainProgress}
                  active={activeObjects.includes('energy-lines')}
                />
              </Suspense>

              <Suspense fallback={null}>
                <TunnelOfModules
                  progress={tunnelProgress}
                  active={activeObjects.includes('tunnel')}
                />
              </Suspense>

              <Suspense fallback={null}>
                <DigitalCity
                  formationProgress={cityProgress}
                  active={activeObjects.includes('city')}
                />
              </Suspense>

              <TimelinePrediction
                progress={timelineProgress}
                active={activeObjects.includes('timeline')}
              />

              <Suspense fallback={null}>
                <AlertTransformation
                  progress={alertProgress}
                  active={alertProgress > 0 && alertProgress < 1}
                />
              </Suspense>

              <Suspense fallback={null}>
                <CinematicEnding
                  progress={endingProgress}
                  active={activeObjects.includes('shield') || endingProgress > 0}
                />
              </Suspense>

              {openingProgress > 0.3 && effectiveQuality !== 'low' && (
                <>
                  {moduleData.map((mod, i) => (
                    <FloatingModuleCard
                      key={mod.label}
                      index={i}
                      label={mod.label}
                      value={mod.value}
                      color={mod.color}
                      progress={mod.progress}
                    />
                  ))}
                  <FloatingMetrics />
                  <HolographicIndicator
                    position={[0.8, 0.1, -0.6]}
                    label="Conformidade"
                    value="94%"
                    color="#22c55e"
                  />
                  <EnergyConnection
                    from={[0.6, 0.3, -0.4]}
                    to={[1.0, 1.1, -0.5]}
                  />
                </>
              )}

              <MinimalParticles />

              <SharedWebGLElement
                value="94%"
                label="Adesão DDS"
                targetSelector="#hero-metric-adesao"
                active={effectiveQuality === 'high' && showEffects}
              />

              {showEffects && effectiveQuality !== 'low' && (
                <ContactShadows
                  position={[0, -0.25, 0]}
                  opacity={0.4}
                  scale={4}
                  blur={2.5}
                  far={1}
                />
              )}

              {/* DepthOfField agora vive DENTRO do EffectComposer em SceneEffects
                  (antes ficava aqui, fora do composer, e era inerte). */}

              {/* Phase 3G — Transição através-da-tela */}
              {effectiveQuality !== 'low' && !effectiveReduced && (
                <ThroughScreenTransition
                  progress={throughScreenProgress}
                  screenWidth={2.4 * 0.8}
                  screenHeight={1.6 * 0.7}
                  screenPosition={[0, 0.35, 0]}
                  screenRotation={0}
                  color={themeColor}
                />
              )}
            </SceneEffects>
          </SceneQualityController>
        </SceneCanvas>
      )}
    </div>
  )
}
