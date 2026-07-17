'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface CinematicEndingProps {
  active?: boolean
  /** 0 = início da convergência, 1 = completo */
  progress?: number
}

export default function CinematicEnding({
  active = true,
  progress = 0,
}: CinematicEndingProps) {
  const nucleusRef = useRef<THREE.Group>(null!)
  const fieldRef = useRef<THREE.Mesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced || !nucleusRef.current) return
    timeRef.current += delta * state.timeScale

    // Núcleo expande
    const scale = 1 + progress * 1.5
    nucleusRef.current.scale.setScalar(scale)

    // Campo rotaciona e expande
    if (fieldRef.current) {
      fieldRef.current.rotation.y += delta * state.timeScale * 0.2 * progress
      fieldRef.current.rotation.x += delta * state.timeScale * 0.05 * progress
      const fieldScale = 1 + progress * 2
      fieldRef.current.scale.setScalar(fieldScale)
    }
  })

  if (!active || reduced || quality === 'low') return null

  return (
    <group position={[0, 0.3, 0]}>
      {/* Campo de proteção final */}
      <Select>
        <mesh ref={fieldRef}>
          <torusGeometry args={[0.5, 0.008, 16, 48]} />
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.2 * progress}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Select>

      {/* Anéis concêntricos de convergência */}
      {progress > 0.3 && (
        <Select>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.32, 32]} />
            <meshBasicMaterial
              color="#06b6d4"
              transparent
              opacity={0.1 * (progress - 0.3) * 3}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Select>
      )}

      {/* Núcleo central */}
      <group ref={nucleusRef}>
        <mesh>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.15 * progress} />
        </mesh>
      </group>

      {/* Raios de conexão (alta qualidade) */}
      {quality === 'high' && progress > 0.5 && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.6, Math.sin(angle) * 0.4, 0]}
                rotation={[0, 0, angle]}
              >
                <planeGeometry args={[0.5, 0.002]} />
                <meshBasicMaterial
                  color="#22c55e"
                  transparent
                  opacity={0.05 * progress}
                  depthWrite={false}
                />
              </mesh>
            )
          })}
        </>
      )}
    </group>
  )
}
