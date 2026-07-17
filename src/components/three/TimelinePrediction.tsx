'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'

interface TimelinePredictionProps {
  active?: boolean
  /** 0 = histórico, 0.5 = presente, 1 = projeção */
  progress?: number
}

export default function TimelinePrediction({
  active = true,
  progress = 0,
}: TimelinePredictionProps) {
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const timeRef = useRef(0)

  const points = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      x: -0.7 + i * 0.2,
      y: 0.1 + Math.sin(i * 0.8) * 0.06,
    }))
  }, [])

  useFrame((_, delta) => {
    if (reduced) return
    timeRef.current += delta
  })

  if (!active || reduced || quality === 'low') return null

  const activePoints = Math.min(Math.floor(progress * points.length), points.length - 1)

  return (
    <group position={[0, 0.3, -0.3]}>
      {/* Linha base */}
      <mesh position={[0, 0.08, 0]}>
        <planeGeometry args={[1.6, 0.003]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {/* Pontos da linha do tempo */}
      {points.map((p, i) => {
        const isActive = i <= activePoints
        const isFuture = i > Math.floor(points.length * 0.5)
        return (
          <group key={i} position={[p.x, p.y, 0]}>
            <mesh>
              <circleGeometry args={[0.01, 8]} />
              <meshBasicMaterial
                color={isActive ? (isFuture ? '#f59e0b' : '#22c55e') : '#ffffff30'}
                transparent
                opacity={isActive ? 0.6 : 0.15}
                depthWrite={false}
              />
            </mesh>
            {/* Conexão com linha */}
            <mesh
              position={[0, -(p.y - 0.08) / 2, 0]}
            >
              <planeGeometry args={[0.002, Math.abs(p.y - 0.08)]} />
              <meshBasicMaterial
                color={isActive ? '#3b82f6' : '#ffffff20'}
                transparent
                opacity={isActive ? 0.3 : 0.1}
                depthWrite={false}
              />
            </mesh>
          </group>
        )
      })}

      {/* Indicador de projeção futura */}
      {progress > 0.7 && (
        <mesh position={[0.6, 0.2, 0]}>
          <planeGeometry args={[0.08, 0.025]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      )}

      <Text position={[0, -0.05, 0]} fontSize={0.025} color="#ffffff40" anchorX="center" anchorY="middle">
        {progress < 0.3 ? 'HISTÓRICO' : progress < 0.6 ? 'ATUAL' : 'TENDÊNCIAS'}
      </Text>
    </group>
  )
}
