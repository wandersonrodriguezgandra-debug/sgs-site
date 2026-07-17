'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

// DADO DEMONSTRATIVO — fragmentos representando dados desorganizados que se organizam

const FRAGMENT_COUNTS = { ultra: 300, high: 150, medium: 60, low: 0 }

interface FragmentSystemProps {
  /** 0 = disperso, 1 = organizado */
  organizationProgress?: number
  active?: boolean
  color?: string
}

export default function FragmentSystem({
  organizationProgress = 0,
  active = true,
  color = '#3b82f6',
}: FragmentSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()

  const count = quality === 'ultra' || quality === 'high'
    ? FRAGMENT_COUNTS.ultra
    : quality === 'medium' ? FRAGMENT_COUNTS.high
    : quality === 'low' ? FRAGMENT_COUNTS.low
    : 0

  const { dummy, positions, targets, sizes } = useMemo(() => {
    if (count === 0) return { dummy: new THREE.Object3D(), positions: [], targets: [], sizes: [] }

    const d = new THREE.Object3D()
    const pos: [number, number, number][] = []
    const tgt: [number, number, number][] = []
    const sz: number[] = []

    for (let i = 0; i < count; i++) {
      // Posição inicial — dispersa no espaço 3D
      const radius = 1.5 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos.push([
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.5,
        radius * Math.cos(phi) - 1,
      ])

      // Posição alvo — organizada em grid ou formação de notebook
      const gridCol = i % 16
      const gridRow = Math.floor(i / 16)
      tgt.push([
        (gridCol - 8) * 0.08,
        0.6 - gridRow * 0.05,
        -0.2 + Math.random() * 0.1,
      ])

      sz.push(0.008 + Math.random() * 0.02)
    }

    return { dummy: d, positions: pos, targets: tgt, sizes: sz }
  }, [count])

  // Atualizar instâncias
  useEffect(() => {
    if (!meshRef.current || count === 0) return
    const matrix = new THREE.Matrix4()
    for (let i = 0; i < count; i++) {
      const progress = organizationProgress
      const eased = 1 - Math.pow(1 - progress, 2)

      const x = positions[i][0] + (targets[i][0] - positions[i][0]) * eased
      const y = positions[i][1] + (targets[i][1] - positions[i][1]) * eased
      const z = positions[i][2] + (targets[i][2] - positions[i][2]) * eased

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(sizes[i] * (1 + (1 - eased) * 2))
      dummy.updateMatrix()
      matrix.copy(dummy.matrix)
      meshRef.current.setMatrixAt(i, matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [organizationProgress, count, dummy, positions, targets, sizes])

  // Animação contínua de flutuação
  useFrame((_, delta) => {
    if (!meshRef.current || count === 0 || reduced) return
    // Pequena rotação coletiva
    meshRef.current.rotation.y += delta * state.timeScale * 0.03 * (1 - organizationProgress)
  })

  if (!active || reduced || count === 0) return null

  const shape = new THREE.PlaneGeometry(0.01, 0.01)

  return (
    <instancedMesh
      ref={meshRef}
      args={[shape, undefined, count]}
      frustumCulled={false}
    >
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}
