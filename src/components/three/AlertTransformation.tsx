'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface AlertTransformationProps {
  active?: boolean
  /** 0 = vermelho (alerta), 0.5 = laranja/amarelo, 1 = verde (solucionado) */
  progress?: number
}

// Mapeamento de cores: vermelho → laranja → amarelo → azul → verde
const COLORS: [number, number, number][] = [
  [1.0, 0.0, 0.0], // Vermelho
  [1.0, 0.4, 0.0], // Laranja
  [1.0, 0.8, 0.0], // Amarelo
  [0.0, 0.5, 1.0], // Azul
  [0.0, 0.8, 0.3], // Verde
]

function getColor(t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t)) * (COLORS.length - 1)
  const index = Math.floor(clamped)
  const frac = clamped - index
  const i0 = Math.min(index, COLORS.length - 1)
  const i1 = Math.min(index + 1, COLORS.length - 1)
  return [
    COLORS[i0][0] + (COLORS[i1][0] - COLORS[i0][0]) * frac,
    COLORS[i0][1] + (COLORS[i1][1] - COLORS[i0][1]) * frac,
    COLORS[i0][2] + (COLORS[i1][2] - COLORS[i0][2]) * frac,
  ]
}

export default function AlertTransformation({
  active = true,
  progress = 0,
}: AlertTransformationProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const colorRef = useRef(new THREE.Color())
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced || !meshRef.current) return
    timeRef.current += delta * state.timeScale

    const [r, g, b] = getColor(progress)
    colorRef.current.setRGB(r, g, b)
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.color.copy(colorRef.current)

    // Pulsa menos à medida que resolve
    const pulse = 1 - progress * 0.6
    mat.opacity = (0.3 + Math.sin(timeRef.current * 2) * 0.1) * pulse
  })

  if (!active || reduced || quality === 'low') return null

  return (
    <group position={[0.4, 0.2, -0.2]}>
      {/* Indicador principal */}
      <mesh ref={meshRef}>
        <planeGeometry args={[0.04, 0.04]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rótulo de status */}
      <mesh position={[0.07, 0, 0]}>
        <planeGeometry args={[0.1, 0.025]} />
        <meshBasicMaterial
          color={progress < 0.25 ? '#ef4444' : progress < 0.5 ? '#f59e0b' : progress < 0.75 ? '#3b82f6' : '#22c55e'}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
