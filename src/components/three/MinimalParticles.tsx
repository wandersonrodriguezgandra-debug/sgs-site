'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

const PARTICLE_COUNT = {
  high: 80,
  medium: 30,
  low: 0,
}

export default function MinimalParticles() {
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const pointsRef = useRef<THREE.Points>(null!)
  const timeRef = useRef(0)

  const count = quality === 'high' ? PARTICLE_COUNT.high
    : quality === 'medium' ? PARTICLE_COUNT.medium
    : 0

  const { positions, velocities } = useMemo(() => {
    if (count === 0) return { positions: new Float32Array(), velocities: new Float32Array() }

    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3 + 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1
      vel[i] = 0.1 + Math.random() * 0.2
    }

    return { positions: pos, velocities: vel }
  }, [count])

  useFrame((_, delta) => {
    if (reduced || count === 0 || !pointsRef.current) return

    timeRef.current += delta * state.timeScale

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(timeRef.current * velocities[i] + i) * 0.0005
      pos[i * 3] += Math.cos(timeRef.current * velocities[i] * 0.7 + i) * 0.0003
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
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
