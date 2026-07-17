'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface DigitalCityProps {
  active?: boolean
  formationProgress?: number
}

export default function DigitalCity({
  active = true,
  formationProgress = 0,
}: DigitalCityProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  const buildings = useMemo(() => {
    const arr: { x: number; z: number; h: number; w: number }[] = []
    for (let i = 0; i < 24; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 2.5,
        z: -0.8 + Math.random() * 0.6,
        h: 0.05 + Math.random() * 0.15,
        w: 0.04 + Math.random() * 0.06,
      })
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (reduced || !groupRef.current) return
    timeRef.current += delta * state.timeScale
    groupRef.current.rotation.y += delta * state.timeScale * 0.02
  })

  if (!active || reduced || quality === 'low' || quality === 'fallback') return null

  return (
    <group ref={groupRef} position={[0, 0.2, -0.5]}>
      {/* Base */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 0.8]} />
        <meshBasicMaterial
          color="#1e3a5f"
          transparent
          opacity={0.2 * formationProgress}
          depthWrite={false}
        />
      </mesh>

      {/* Prédios */}
      {buildings.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.h / 2, b.z]}
          scale={[1, 1 * formationProgress, 1]}
        >
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.4 * formationProgress}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Conexões entre prédios */}
      {(quality === 'ultra' || quality === 'high' || quality === 'medium') && formationProgress > 0.5 && (
        <>
          {buildings.slice(0, 8).map((b, i) => {
            const next = buildings[(i + 1) % 8]
            return (
              <mesh
                key={`conn-${i}`}
                position={[(b.x + next.x) / 2, 0.02, (b.z + next.z) / 2]}
                rotation={[0, Math.atan2(next.x - b.x, next.z - b.z), 0]}
              >
                <planeGeometry args={[0.004, 0.15]} />
                <meshBasicMaterial
                  color="#06b6d4"
                  transparent
                  opacity={0.15 * formationProgress}
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
