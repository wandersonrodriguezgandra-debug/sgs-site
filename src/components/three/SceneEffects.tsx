'use client'

import { type ReactNode, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Selection,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { sceneConfig } from '@/config/scene'

interface SceneEffectsProps {
  children?: ReactNode
}

/**
 * Pipeline de pós-processamento cinematográfico.
 *
 * Estrutura correta: <Selection> envolve a CENA (children) + um ÚNICO
 * EffectComposer com toda a stack. Antes, o DepthOfField ficava fora do
 * composer (inerte) e o Bloom usava luminanceThreshold=0 (wash global).
 *
 * Robustez: se o contexto WebGL não expõe atributos (ex.: swiftshader
 * headless), renderiza a cena SEM pós em vez de derrubar tudo para o
 * fallback (o EffectComposer lançava "reading 'alpha' of null").
 */
export default function SceneEffects({ children }: SceneEffectsProps) {
  const quality = useGraphicsQuality()
  const { postprocessing } = sceneConfig
  const gl = useThree((s) => s.gl)

  const canPostProcess = useMemo(() => {
    try {
      return !!gl.getContextAttributes()
    } catch {
      return false
    }
  }, [gl])

  const caOffset = useMemo(() => new Vector2(0.0006, 0.0006), [])

  if (quality === 'low' || quality === 'fallback' || !canPostProcess) {
    return <>{children}</>
  }

  const isHigh = quality === 'high' || quality === 'ultra'
  const isUltra = quality === 'ultra'

  // Bloom cirúrgico: threshold da config isola o que realmente brilha
  // (núcleos, escudos, energia) em vez de lavar a cena inteira.
  const bloomIntensity = isHigh
    ? postprocessing.bloomIntensity * 2.2
    : postprocessing.bloomIntensity * 1.4

  return (
    <Selection>
      {children}
      <EffectComposer multisampling={isHigh ? 4 : 0}>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={postprocessing.bloomThreshold}
          luminanceSmoothing={0.2}
          mipmapBlur
          radius={isUltra ? 0.8 : 0.7}
        />
        {isHigh ? (
          <DepthOfField
            focusDistance={0.015}
            focalLength={isUltra ? 0.07 : 0.05}
            bokehScale={isUltra ? 3.5 : 2}
          />
        ) : (
          <></>
        )}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={caOffset}
          radialModulation
          modulationOffset={0.35}
        />
        <Vignette eskil={false} offset={0.25} darkness={isUltra ? 0.65 : 0.5} />
        {isUltra ? (
          <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.025} />
        ) : (
          <></>
        )}
      </EffectComposer>
    </Selection>
  )
}
