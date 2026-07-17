export type GraphicsQuality = 'ultra' | 'high' | 'medium' | 'low' | 'fallback'

export type SceneLoadingState =
  | 'poster'
  | 'canvas-loading'
  | 'basic-ready'
  | 'effects-loading'
  | 'complete'
  | 'fallback'
  | 'error'

export interface WebGLSupport {
  supported: boolean
  contextType: 'webgl2' | 'webgl' | null
  maxTextureSize: number
  maxVertexAttribs: number
}

export interface SceneConfig {
  camera: {
    position: [number, number, number]
    fov: number
    near: number
    far: number
  }
  laptop: {
    width: number
    height: number
    depth: number
    screenRatio: number
    bezelSize: number
    hingeRadius: number
    keyboardRowCount: number
    keyboardColCount: number
  }
  cards: {
    count: number
    spread: number
    floatAmplitude: number
    floatSpeed: number
  }
  lighting: {
    ambientIntensity: number
    keyIntensity: number
    fillIntensity: number
    rimIntensity: number
  }
  postprocessing: {
    bloomIntensity: number
    bloomThreshold: number
    dofFocusRange: number
    dofBlurAmount: number
  }
  toneMapping: {
    exposure: number
    type: string
  }
}
