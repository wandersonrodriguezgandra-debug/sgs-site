'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface DocumentConstructionProps {
  active?: boolean
  /** 0 = partículas, 0.5 = formando, 1 = completo */
  progress?: number
}

export default function DocumentConstruction({
  active = true,
  progress = 0,
}: DocumentConstructionProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  const particles = useMemo(() => {
    const arr: { x: number; y: number; phase: number }[] = []
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.6,
        y: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (reduced) return
    timeRef.current += delta * state.timeScale
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.2) * 0.1
    }
  })

  if (!active || reduced || quality === 'low') return null

  const showParticles = progress < 0.5
  const showDocument = progress >= 0.3
  const completed = progress >= 1

  const scale = Math.min(1, progress * 1.5)
  const opacity = Math.min(1, (progress - 0.2) * 3)

  return (
    <group ref={groupRef} position={[0, 0.4, -0.2]}>
      {/* Partículas de formação */}
      {showParticles && (
        <group>
          {particles.map((p, i) => {
            const t = timeRef.current
            const x = p.x * (1 - progress) + Math.sin(t + p.phase) * 0.02
            const y = p.y * (1 - progress) + Math.cos(t * 0.7 + p.phase) * 0.02
            return (
              <mesh key={i} position={[x, y, 0]}>
                <planeGeometry args={[0.008, 0.008]} />
                <meshBasicMaterial
                  color="#3b82f6"
                  transparent
                  opacity={0.4 * (1 - progress)}
                  depthWrite={false}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Documento formado */}
      {showDocument && (
        <group scale={[scale, scale, scale]}>
          {/* Plano do documento */}
          <mesh>
            <planeGeometry args={[0.25, 0.18]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={opacity * 0.95}
              depthWrite={false}
            />
          </mesh>

          {/* Borda */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[0.24, 0.17]} />
            <meshBasicMaterial
              color="#f8fafc"
              transparent
              opacity={opacity * 0.8}
              depthWrite={false}
            />
          </mesh>

          {/* Linhas de texto do documento */}
          {completed && (
            <>
              {[0.06, 0.03, 0.0, -0.03, -0.06].map((y, i) => (
                <mesh key={i} position={[-0.07, y, 0.002]}>
                  <planeGeometry args={[0.12 - i * 0.02, 0.005]} />
                  <meshBasicMaterial color="#94a3b8" transparent opacity={0.5} depthWrite={false} />
                </mesh>
              ))}
              {/* Assinatura */}
              <mesh position={[0.05, -0.065, 0.002]}>
                <planeGeometry args={[0.04, 0.005]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} depthWrite={false} />
              </mesh>
            </>
          )}

          {/* Status */}
          <Text
            position={[0, -0.12, 0.002]}
            fontSize={0.025}
            color={completed ? '#22c55e' : '#f59e0b'}
            anchorX="center"
            anchorY="middle"
          >
            {completed ? 'CONCLUÍDO' : progress > 0.7 ? 'VALIDANDO...' : progress > 0.4 ? 'MONTANDO...' : ''}
          </Text>
        </group>
      )}
    </group>
  )
}
