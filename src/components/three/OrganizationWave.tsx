'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface OrganizationWaveProps {
  active?: boolean
  /** 0 = início, 1 = atravessou a cena */
  progress?: number
  color?: string
}

export default function OrganizationWave({
  active = true,
  progress = 0,
  color = '#3b82f6',
}: OrganizationWaveProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced || !meshRef.current) return
    timeRef.current += delta * state.timeScale

    const zPos = -0.5 + progress * 4
    meshRef.current.position.z = zPos

    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.15 + Math.sin(timeRef.current * 3) * 0.05
  })

  if (!active || reduced || quality === 'low') return null

  return (
    <>
      {/* Onda principal — arco volumétrico */}
      <Select>
        <group>
          {/* Arco superior */}
          <mesh
            ref={meshRef}
            position={[0, 0.4, -0.5]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[3, 0.04]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Linhas verticais da onda */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh
              key={i}
              position={[-1.5 + i * 0.6, 0.2, 0]}
            >
              <planeGeometry args={[0.003, 0.4]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.08}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      </Select>

      {/* Partículas de ativação na passagem da onda */}
      {(quality === 'ultra' || quality === 'high' || quality === 'medium') && (
        <group position={[0, 0.3, -0.5 + progress * 4]}>
          <mesh>
            <sphereGeometry args={[0.004, 4, 4]} />
            <meshBasicMaterial
              color="#22c55e"
              transparent
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </>
  )
}
