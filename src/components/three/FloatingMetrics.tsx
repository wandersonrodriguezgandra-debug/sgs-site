'use client'

import { useRef, useMemo } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sceneConfig } from '@/config/scene'

// DADO DEMONSTRATIVO — substituir por dados reais

const metricsData = [
  { label: 'Adesão DDS', value: '94%', color: '#22c55e' },
  { label: 'Inspeções', value: '156', color: '#3b82f6' },
  { label: 'Conformidade', value: '87%', color: '#22c55e' },
  { label: 'Treinamentos', value: '12', color: '#f59e0b' },
]

export default function FloatingMetrics() {
  const groupRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const { laptop } = sceneConfig

  const metricPositions = useMemo(() => {
    const startX = -laptop.width / 2 - 0.35
    return metricsData.map((_, i) => ({
      x: startX + (i % 2) * 0.6,
      y: 0.2 + Math.floor(i / 2) * 0.3,
      z: -0.3 - Math.random() * 0.2,
      phase: i * 1.5,
    }))
  }, [laptop])

  useFrame(() => {
    if (reduced) return
  })

  return (
    <group ref={groupRef}>
      {metricsData.map((metric, i) => (
        <group
          key={metric.label}
          position={[
            metricPositions[i].x,
            metricPositions[i].y,
            metricPositions[i].z,
          ]}
        >
          <Text
            fontSize={0.045}
            color={metric.color}
            anchorX="left"
            anchorY="middle"
            fontWeight="bold"
          >
            {metric.value}
          </Text>
          <Text
            position={[0.12, -0.035, 0]}
            fontSize={0.02}
            color="#ffffff80"
            anchorX="left"
            anchorY="middle"
          >
            {metric.label}
          </Text>
        </group>
      ))}
    </group>
  )
}
