'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface NucleusCoreProps {
  active?: boolean
  color?: string
  /** 0 = formando, 1 = completo */
  formationProgress?: number
  pulseIntensity?: number
}

export default function NucleusCore({
  active = true,
  color = '#06b6d4',
  formationProgress = 1,
  pulseIntensity = 0.3,
}: NucleusCoreProps) {
  const sphereRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()

  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced || !active) return
    timeRef.current += delta * state.timeScale

    const t = timeRef.current

    // Núcleo pulsa
    if (sphereRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.02 * pulseIntensity
      sphereRef.current.scale.setScalar(pulse * formationProgress)
    }

    // Anel rotaciona
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * state.timeScale * 0.6
      ringRef.current.rotation.z += delta * state.timeScale * 0.3
      const ringPulse = 1 + Math.sin(t * 2) * 0.03
      ringRef.current.scale.setScalar(ringPulse)
    }

    // Glow pulsa
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.08 + Math.sin(t * 1.2) * 0.04 * pulseIntensity
    }
  })

  if (!active || reduced || quality === 'low') return null

  return (
    <group>
      {/* Glow externo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Anel rotatório */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.08, 0.003, 8, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Anel secundário */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[0.1, 0.002, 8, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Núcleo central */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}
