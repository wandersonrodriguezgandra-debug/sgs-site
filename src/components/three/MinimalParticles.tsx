'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

const PARTICLE_COUNT = {
  ultra: 150,
  high: 80,
  medium: 30,
  low: 0,
}

const PARTICLE_COLORS = [
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#22c55e', // green
  '#60a5fa', // light blue
  '#4a87eb', // accent blue
]

export default function MinimalParticles() {
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const pointsRef = useRef<THREE.Points>(null!)
  const timeRef = useRef(0)

  const count = quality === 'ultra' ? PARTICLE_COUNT.ultra
    : quality === 'high' ? PARTICLE_COUNT.high
    : quality === 'medium' ? PARTICLE_COUNT.medium
    : 0

  const { positions, velocities, colors } = useMemo(() => {
    if (count === 0) return {
      positions: new Float32Array(),
      velocities: new Float32Array(),
      colors: new Float32Array(),
    }

    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)
    const col = new Float32Array(count * 3)

    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // Spread particles in a hemisphere around the scene
      const angle = Math.random() * Math.PI * 2
      const radius = 1 + Math.random() * 3
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.random() * 2.5 - 0.5
      pos[i * 3 + 2] = Math.sin(angle) * radius - 1.5

      vel[i] = 0.08 + Math.random() * 0.15

      // Random color from palette
      color.set(PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)])
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }

    return { positions: pos, velocities: vel, colors: col }
  }, [count])

  useFrame((_, delta) => {
    if (reduced || count === 0 || !pointsRef.current) return

    timeRef.current += delta * state.timeScale

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      // Gentle floating motion
      pos[i * 3 + 1] += Math.sin(timeRef.current * velocities[i] + i) * 0.0004
      pos[i * 3] += Math.cos(timeRef.current * velocities[i] * 0.7 + i) * 0.0003
      pos[i * 3 + 2] += Math.sin(timeRef.current * velocities[i] * 0.5 + i * 0.3) * 0.0002
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (reduced || count === 0) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
