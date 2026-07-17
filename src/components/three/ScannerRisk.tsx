'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface ScannerRiskProps {
  active?: boolean
  /** 0 = início, 1 = completo */
  progress?: number
  color?: string
}

export default function ScannerRisk({
  active = true,
  progress = 0,
  color = '#f59e0b',
}: ScannerRiskProps) {
  const scanRef = useRef<THREE.Mesh>(null!)
  const gridRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced || !scanRef.current || !gridRef.current) return
    timeRef.current += delta * state.timeScale

    const scanY = -0.5 + progress * 1.2
    scanRef.current.position.y = scanY

    const mat = scanRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.2 + Math.sin(timeRef.current * 4) * 0.1

    gridRef.current.rotation.y += delta * state.timeScale * 0.1
  })

  if (!active || reduced || quality === 'low') return null

  return (
    <group>
      {/* Grade de varredura */}
      <group ref={gridRef} position={[0.2, 0, -0.3]}>
        <Select>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.04}
              wireframe
              depthWrite={false}
            />
          </mesh>
        </Select>
      </group>

      {/* Feixe de varredura horizontal */}
      <Select>
        <mesh ref={scanRef} position={[0.2, -0.5, -0.3]}>
          <planeGeometry args={[0.8, 0.008]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Select>

      {/* Marcadores de risco */}
      {(quality === 'ultra' || quality === 'high' || quality === 'medium') && progress > 0.3 && (
        <>
          <mesh position={[0.0, 0.1, -0.2]}>
            <planeGeometry args={[0.02, 0.02]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.5} depthWrite={false} />
          </mesh>
          <mesh position={[0.5, -0.1, -0.4]}>
            <planeGeometry args={[0.015, 0.015]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} depthWrite={false} />
          </mesh>
          <mesh position={[-0.3, 0.2, -0.3]}>
            <planeGeometry args={[0.018, 0.018]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.4} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* Linha de confirmação ao completar */}
      {(quality === 'ultra' || quality === 'high' || quality === 'medium') && progress >= 1 && (
        <Select>
          <mesh position={[0.2, 0.1, -0.3]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.15, 0.003]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.5} depthWrite={false} />
          </mesh>
        </Select>
      )}
    </group>
  )
}
