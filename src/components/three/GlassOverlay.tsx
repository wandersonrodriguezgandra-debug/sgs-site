'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'

interface GlassOverlayProps {
  width: number
  height: number
  depth?: number
}

export default function GlassOverlay({ width, height, depth = -0.015 }: GlassOverlayProps) {
  const glassRef = useRef<THREE.Mesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()

  const screenWidth = width
  const screenHeight = height

  useFrame(() => {
    if (reduced || !glassRef.current) return
    const mat = glassRef.current.material as THREE.MeshPhysicalMaterial
    mat.opacity = 0.06 + Math.sin(Date.now() * 0.0005) * 0.015
  })

  if (quality === 'low') return null

  return (
    <Select>
      <mesh ref={glassRef} position={[0, 0, depth]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.06}
          roughness={0.05}
          metalness={0.95}
          envMapIntensity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Select>
  )
}
