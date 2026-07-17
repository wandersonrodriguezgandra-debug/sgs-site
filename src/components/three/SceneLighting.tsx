'use client'

import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { sceneConfig } from '@/config/scene'

export default function SceneLighting() {
  const quality = useGraphicsQuality()
  const { lighting } = sceneConfig

  return (
    <>
      <ambientLight intensity={lighting.ambientIntensity} />

      {/* Key light — principal, única com sombra */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={lighting.keyIntensity}
        castShadow={quality === 'high'}
        shadow-mapSize-width={quality === 'high' ? 1024 : 512}
        shadow-mapSize-height={quality === 'high' ? 1024 : 512}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* Rim light — azul institucional */}
      <directionalLight
        position={[-2, 3, 4]}
        intensity={quality === 'high' ? lighting.rimIntensity : lighting.rimIntensity * 0.6}
        color="#3b82f6"
      />

      {/* Fill suave — sem sombra */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={quality === 'medium' ? lighting.fillIntensity * 0.5 : 0}
      />

      {/* Bottom light — apenas high */}
      {quality === 'high' && (
        <directionalLight
          position={[0, -1.5, 2]}
          intensity={0.25}
          color="#60a5fa"
        />
      )}
    </>
  )
}
