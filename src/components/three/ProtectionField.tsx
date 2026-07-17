'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface ProtectionFieldProps {
  active?: boolean
  /** 0 = formando, 1 = completo */
  formationProgress?: number
  color?: string
}

export default function ProtectionField({
  active = true,
  formationProgress = 0,
  color = '#22c55e',
}: ProtectionFieldProps) {
  const fieldRef = useRef<THREE.Mesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced || !fieldRef.current || quality === 'low' || quality === 'fallback') return
    timeRef.current += delta * state.timeScale

    const t = timeRef.current

    // Rotação suave
    fieldRef.current.rotation.y += delta * state.timeScale * 0.15 * formationProgress
    fieldRef.current.rotation.x += delta * state.timeScale * 0.05 * formationProgress

    // Escala pulsante
    const pulse = 1 + Math.sin(t * 0.8) * 0.02
    fieldRef.current.scale.setScalar(pulse * formationProgress)
  })

  if (!active || reduced || quality === 'low') return null

  return (
    <Select>
      <group position={[0, 0.3, -0.1]}>
        {/* Anel externo */}
        <mesh ref={fieldRef}>
          <torusGeometry args={[0.6, 0.005, 16, 48]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15 * formationProgress}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Anel interno */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.55, 0.003, 12, 36]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08 * formationProgress}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Pontos de energia no perímetro */}
        {(quality === 'ultra' || quality === 'high') && formationProgress > 0.5 && (
          <mesh>
            <ringGeometry args={[0.58, 0.6, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.1 * formationProgress}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Conexões internas (somente ultra/high) */}
        {quality === 'high' && formationProgress > 0.7 && (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2
              return (
                <mesh
                  key={i}
                  position={[Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0]}
                >
                  <sphereGeometry args={[0.005, 4, 4]} />
                  <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
                </mesh>
              )
            })}
          </>
        )}
      </group>
    </Select>
  )
}
