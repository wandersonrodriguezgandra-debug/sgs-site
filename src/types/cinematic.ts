export type CinematicQuality = 'ultra' | 'high' | 'medium' | 'low' | 'fallback'

export type ReducedMotionFallback = 'skip' | 'show-static' | 'fade' | 'html-only'

export interface CinematicSequence {
  id: string
  title: string
  start: number
  end: number
  cameraPath?: string
  activeObjects: string[]
  quality: CinematicQuality | 'all'
  reducedMotionFallback: ReducedMotionFallback
  color: string
  intensity: number
}

export interface CameraPathPoint {
  position: [number, number, number]
  target?: [number, number, number]
}

export interface NarrativeState {
  progress: number
  direction: 'forward' | 'backward' | 'idle'
  activeSequence: CinematicSequence | null
  previousSequence: CinematicSequence | null
  sceneReady: boolean
  currentTheme: {
    color: string
    intensity: number
  }
}

export interface FragmentConfig {
  count: number
  spread: number
  targetSpread: number
  size: number
  speed: number
  color: string
}

export interface CinematicTimeState {
  timeScale: number
  frozen: boolean
  freezeProgress: number
  analysisTarget: string | null
  analysisData: Record<string, string> | null
}

export interface CinematicState {
  activeSequence: string | null
  progress: number
  direction: 1 | -1
  timeScale: number
  quality: CinematicQuality
  introSeen: boolean
  audioEnabled: boolean
}

export interface VoxelUniforms {
  uProgress: { value: number }
  uTime: { value: number }
  uNoiseStrength: { value: number }
  uAssemblyRadius: { value: number }
  uPulse: { value: number }
  uColorStart: { value: string }
  uColorEnd: { value: string }
}

export interface SpatialWarpUniforms {
  uProgress: { value: number }
  uCenter: { value: { x: number; y: number } }
  uStrength: { value: number }
  uRadius: { value: number }
  uDepth: { value: number }
  uTime: { value: number }
}
