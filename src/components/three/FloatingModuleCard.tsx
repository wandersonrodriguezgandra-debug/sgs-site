'use client'

import { useRef, useMemo } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'
import { sceneConfig } from '@/config/scene'

interface FloatingModuleCardProps {
  index: number
  label: string
  value: string
  color?: string
  icon?: string
  progress?: number
}

// DADO DEMONSTRATIVO — substituir por dados reais dos módulos SGS

export default function FloatingModuleCard({
  index,
  label,
  value,
  color = '#3b82f6',
  progress,
}: FloatingModuleCardProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const { cards } = sceneConfig

  const floatOffset = useMemo(() => ({
    phase: index * 1.2,
    x: (index - (cards.count - 1) / 2) * cards.spread * 0.5,
    y: 0.3 + Math.random() * 0.3,
    z: -0.3 - Math.random() * 0.5,
  }), [index, cards])

  const entryProgress = useRef(0)

  useFrame((_, delta) => {
    if (reduced) return

    entryProgress.current = Math.min(1, entryProgress.current + delta * state.timeScale * 0.4)

    const t = Date.now() * 0.001 * cards.floatSpeed
    const floatY = Math.sin(t + floatOffset.phase) * cards.floatAmplitude
    const floatX = Math.cos(t * 0.7 + floatOffset.phase) * cards.floatAmplitude * 0.3
    const floatZ = Math.sin(t * 0.5 + floatOffset.phase * 2) * cards.floatAmplitude * 0.2

    const ease = 1 - Math.pow(1 - entryProgress.current, 3)
    const scale = ease * 0.6 + 0.4

    if (groupRef.current) {
      groupRef.current.position.x = floatOffset.x + floatX
      groupRef.current.position.y = floatOffset.y + floatY
      groupRef.current.position.z = floatOffset.z + floatZ
      groupRef.current.scale.setScalar(scale)
    }
  })

  const cardColor = color

  return (
    <group ref={groupRef} position={[floatOffset.x, floatOffset.y, floatOffset.z]}>
      <RoundedBox
        args={[0.35, 0.18, 0.015]}
        radius={0.01}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color={cardColor}
          metalness={0.1}
          roughness={0.3}
          transparent
          opacity={0.85}
          envMapIntensity={0.3}
        />
      </RoundedBox>

      {/* Glow */}
      {quality === 'high' && (
        <mesh position={[0, 0, -0.008]}>
          <planeGeometry args={[0.4, 0.22]} />
          <meshBasicMaterial
            color={cardColor}
            transparent
            opacity={0.15}
          />
        </mesh>
      )}

      {/* Content */}
      <Text
        position={[0, 0.03, 0.01]}
        fontSize={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {value}
      </Text>
      <Text
        position={[0, -0.04, 0.01]}
        fontSize={0.025}
        color="#ffffffb0"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Progress bar */}
      {progress !== undefined && (
        <mesh position={[-0.1, -0.065, 0.01]}>
          <planeGeometry args={[0.2, 0.008]} />
          <meshBasicMaterial color="#ffffff20" />
        </mesh>
      )}
      {progress !== undefined && (
        <mesh position={[-0.1 + progress * 0.1, -0.065, 0.012]}>
          <planeGeometry args={[progress * 0.2, 0.008]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      )}
    </group>
  )
}
