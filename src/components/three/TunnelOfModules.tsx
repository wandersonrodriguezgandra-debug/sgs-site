'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface TunnelOfModulesProps {
  active?: boolean
  /** 0 = início do túnel, 1 = saída */
  progress?: number
}

export default function TunnelOfModules({
  active = true,
  progress = 0,
}: TunnelOfModulesProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced || !groupRef.current) return
    timeRef.current += delta * state.timeScale

    // Rotação suave panorâmica
    groupRef.current.rotation.y += delta * state.timeScale * 0.08 * (1 - progress)
  })

  if (!active || reduced || quality === 'low') return null

  const moduleCount = 12
  const radius = 1.2

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {Array.from({ length: moduleCount }).map((_, i) => {
        const angle = (i / moduleCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius - 0.5
        const isActive = progress > i / moduleCount && progress < (i + 1) / moduleCount + 0.05
        const alreadyPassed = progress > (i + 1) / moduleCount + 0.05

        const opacity = alreadyPassed ? 0.3 : isActive ? 0.7 : 0.4

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI, 0]}>
            <mesh>
              <planeGeometry args={[0.15, 0.06]} />
              <meshBasicMaterial
                color={isActive ? '#06b6d4' : '#3b82f6'}
                transparent
                opacity={opacity * (quality === 'high' ? 1 : 0.6)}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Linha de conexão com o centro */}
            {isActive && (
              <mesh position={[-radius / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <planeGeometry args={[0.003, radius * 0.8]} />
                <meshBasicMaterial
                  color="#22c55e"
                  transparent
                  opacity={0.2}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Centro do túnel — núcleo ao fundo */}
      <mesh>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
