'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface ChainReactionProps {
  active?: boolean
  /** 0 = início, 1 = reação completa */
  progress?: number
}

const STEPS = [
  { label: 'Empresa', color: '#3b82f6', x: -0.8, y: 0.2 },
  { label: 'Colaborador', color: '#60a5fa', x: -0.5, y: 0.0 },
  { label: 'Documento', color: '#f59e0b', x: -0.2, y: -0.1 },
  { label: 'Inspeção', color: '#a855f7', x: 0.1, y: 0.0 },
  { label: 'Ação', color: '#22c55e', x: 0.4, y: 0.1 },
  { label: 'Dashboard', color: '#06b6d4', x: 0.7, y: 0.0 },
]

export default function ChainReaction({
  active = true,
  progress = 0,
}: ChainReactionProps) {
  const linesRef = useRef<THREE.Group>(null!)
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (reduced) return
    timeRef.current += delta * state.timeScale
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * state.timeScale * 0.05
    }
  })

  if (!active || reduced || quality === 'low' || quality === 'fallback') return null

  const activeStep = Math.min(Math.floor(progress * STEPS.length), STEPS.length - 1)

  return (
    <group ref={linesRef} position={[0.1, 0.3, -0.3]}>
      {/* Linhas de conexão entre os passos */}
      {STEPS.slice(0, -1).map((_, i) => {
        const curr = STEPS[i]
        const next = STEPS[i + 1]
        const isActive = progress * STEPS.length > i + 0.5
        const opacity = isActive ? 0.3 : 0.05
        return (
          <Select key={i}>
            <mesh
              position={[(curr.x + next.x) / 2, (curr.y + next.y) / 2, 0]}
              rotation={[0, 0, Math.atan2(next.y - curr.y, next.x - curr.x)]}
            >
              <planeGeometry args={[0.25, 0.002]} />
              <meshBasicMaterial
                color={isActive ? curr.color : '#ffffff'}
                transparent
                opacity={opacity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </Select>
        )
      })}

      {/* Marcadores dos passos */}
      {STEPS.map((step, i) => {
        const isActive = i <= activeStep
        return (
          <group key={step.label} position={[step.x, step.y, 0]}>
            <mesh>
              <planeGeometry args={[0.04, 0.04]} />
              <meshBasicMaterial
                color={isActive ? step.color : '#ffffff40'}
                transparent
                opacity={isActive ? 0.6 : 0.2}
                depthWrite={false}
              />
            </mesh>
            {/* Brilho no passo ativo */}
            {isActive && (quality === 'ultra' || quality === 'high') && (
              <mesh>
                <planeGeometry args={[0.05, 0.05]} />
                <meshBasicMaterial
                  color={step.color}
                  transparent
                  opacity={0.1}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Indicador de progresso ao final */}
      {progress >= 1 && (
        <Select>
          <mesh position={[0.9, -0.1, 0]}>
            <planeGeometry args={[0.04, 0.04]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.5} depthWrite={false} />
          </mesh>
        </Select>
      )}
    </group>
  )
}
