'use client'

import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { sceneConfig } from '@/config/scene'

export default function SceneLighting() {
  const quality = useGraphicsQuality()
  const { lighting } = sceneConfig
  const isUltra = quality === 'ultra'
  const isHigh = quality === 'high' || isUltra

  return (
    <>
      {/* Ambient — base illumination */}
      <ambientLight intensity={lighting.ambientIntensity} />

      {/* Key light — main directional with shadow */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={lighting.keyIntensity}
        castShadow={isHigh}
        shadow-mapSize-width={isHigh ? 1024 : 512}
        shadow-mapSize-height={isHigh ? 1024 : 512}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* Rim light — blue institutional accent */}
      <directionalLight
        position={[-2, 3, 4]}
        intensity={isHigh ? lighting.rimIntensity : lighting.rimIntensity * 0.6}
        color="#3b82f6"
      />

      {/* Fill — soft, no shadow */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={quality === 'medium' ? lighting.fillIntensity * 0.5 : 0}
      />

      {/* Bottom accent — cool blue uplight */}
      {isHigh && (
        <directionalLight
          position={[0, -1.5, 2]}
          intensity={0.25}
          color="#60a5fa"
        />
      )}

      {/* Cyan accent — for tech feel (ultra only) */}
      {isUltra && (
        <pointLight
          position={[2, 1, -1]}
          intensity={0.4}
          color="#06b6d4"
          distance={6}
          decay={2}
        />
      )}

      {/* Warm fill — subtle depth (ultra only) */}
      {isUltra && (
        <pointLight
          position={[-2, 0.5, 1]}
          intensity={0.2}
          color="#f59e0b"
          distance={5}
          decay={2}
        />
      )}
    </>
  )
}
