import type { SceneConfig } from '@/types/three'

export const sceneConfig: SceneConfig = {
  camera: {
    position: [0, 0.8, 4.2],
    fov: 36,
    near: 0.1,
    far: 20,
  },
  laptop: {
    width: 2.4,
    height: 1.6,
    depth: 0.02,
    screenRatio: 16 / 10,
    bezelSize: 0.04,
    hingeRadius: 0.06,
    keyboardRowCount: 6,
    keyboardColCount: 14,
  },
  cards: {
    count: 4,
    spread: 1.6,
    floatAmplitude: 0.04,
    floatSpeed: 0.8,
  },
  lighting: {
    ambientIntensity: 0.4,
    keyIntensity: 1.8,
    fillIntensity: 0.6,
    rimIntensity: 0.8,
  },
  postprocessing: {
    bloomIntensity: 0.3,
    bloomThreshold: 0.6,
    dofFocusRange: 0.02,
    dofBlurAmount: 0.002,
  },
  toneMapping: {
    exposure: 1.0,
    type: 'ACESFilmic',
  },
}
