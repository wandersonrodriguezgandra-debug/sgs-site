'use client'

import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'

interface HolographicIndicatorProps {
  position: [number, number, number]
  label: string
  value: string
  color?: string
  active?: boolean
}

export default function HolographicIndicator({
  position,
  label,
  value,
  color = '#3b82f6',
  active = true,
}: HolographicIndicatorProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()

  useFrame(() => {
    if (reduced || !groupRef.current || quality === 'low') return

    const t = Date.now() * 0.001
    const bobY = Math.sin(t * 0.6) * 0.008
    groupRef.current.position.y = position[1] + bobY
  })

  if (!active || quality === 'low') return null

  return (
    <group ref={groupRef} position={position}>
      <Select>
        <mesh>
          <planeGeometry args={[0.3, 0.04]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </Select>

      <Text
        position={[0, 0.05, 0.01]}
        fontSize={0.035}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {value}
      </Text>
      <Text
        position={[0, -0.02, 0.01]}
        fontSize={0.018}
        color={`${color}80`}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}
