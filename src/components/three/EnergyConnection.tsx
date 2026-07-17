'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'

interface EnergyConnectionProps {
  from: [number, number, number]
  to: [number, number, number]
  color?: string
  pulseSpeed?: number
  visible?: boolean
}

export default function EnergyConnection({
  from,
  to,
  color = '#3b82f6',
  pulseSpeed = 1,
  visible = true,
}: EnergyConnectionProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()

  const midY = (from[1] + to[1]) / 2
  const midZ = (from[2] + to[2]) / 2
  const position: [number, number, number] = [
    (from[0] + to[0]) / 2,
    midY,
    midZ,
  ]

  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const dz = to[2] - from[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

  const angleY = Math.atan2(dx, dz)
  const angleX = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz))

  useFrame(() => {
    if (reduced || !meshRef.current) return
    const t = Math.sin(Date.now() * 0.002 * pulseSpeed) * 0.5 + 0.5
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.15 + t * 0.35
  })

  if (reduced || quality === 'low' || !visible) return null

  return (
    <Select>
      <mesh
        ref={meshRef}
        position={position}
        rotation={[angleX, 0, angleY]}
      >
        <planeGeometry args={[0.008, length]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Select>
  )
}
