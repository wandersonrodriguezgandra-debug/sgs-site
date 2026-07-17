'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface FrozenTimeAnalysisProps {
  enabled?: boolean
}

// DADO DEMONSTRATIVO — dados simulados para visualização de análise de risco
const ANALYSIS_DATA = [
  { label: 'Tipo de Risco', value: 'Trabalho em Altura' },
  { label: 'Criticalidade', value: 'Crítica', highlight: '#ef4444' },
  { label: 'Localização', value: 'Setor A — Plataforma 3' },
  { label: 'Responsável', value: 'João Silva' },
  { label: 'Prazo', value: '15 dias' },
  { label: 'Ação Recomendada', value: 'Instalação de guarda-corpo' },
  { label: 'Status', value: 'Em análise' },
  { label: 'Controle', value: 'Administrativo + Engenharia' },
]

function lerpColor(c1: string, c2: string, t: number): string {
  const r1 = parseInt(c1.slice(1, 3), 16)
  const g1 = parseInt(c1.slice(3, 5), 16)
  const b1 = parseInt(c1.slice(5, 7), 16)
  const r2 = parseInt(c2.slice(1, 3), 16)
  const g2 = parseInt(c2.slice(3, 5), 16)
  const b2 = parseInt(c2.slice(5, 7), 16)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function getTransitionColor(progress: number): string {
  if (progress <= 0.5) {
    return lerpColor('#ef4444', '#3b82f6', progress * 2)
  }
  return lerpColor('#3b82f6', '#22c55e', (progress - 0.5) * 2)
}

function createRowTexture(
  item: (typeof ANALYSIS_DATA)[number],
  color: string,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 56
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, 512, 56)

  ctx.font = '14px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#94a3b8'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(item.label, 16, 28)

  ctx.font = 'bold 16px Inter, system-ui, sans-serif'
  ctx.fillStyle = item.highlight || color
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(item.value, 496, 28)

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(16, 55)
  ctx.lineTo(496, 55)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createPanelTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 600
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, 512, 600)

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
  ctx.beginPath()
  ctx.roundRect(8, 8, 496, 584, 12)
  ctx.fill()

  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(8, 8, 496, 584, 12)
  ctx.stroke()

  ctx.font = 'bold 18px Inter, system-ui, sans-serif'
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('\u25C6 AN\u00C1LISE DE RISCO \u25C6', 256, 22)

  ctx.strokeStyle = color
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(24, 56)
  ctx.lineTo(488, 56)
  ctx.stroke()
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function FrozenTimeAnalysis({ enabled = true }: FrozenTimeAnalysisProps) {
  const { state } = useCinematicTime()
  const { frozen, freezeProgress, analysisTarget } = state
  const groupRef = useRef<THREE.Group>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const smallRingRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Sprite>(null!)
  const timeRef = useRef(0)
  const { camera } = useThree()

  const panelTextureRef = useRef<THREE.CanvasTexture | null>(null)
  const glowTextureRef = useRef<THREE.CanvasTexture | null>(null)
  const rowTexturesRef = useRef<THREE.CanvasTexture[]>([])

  const transitionColor = useMemo(() => getTransitionColor(freezeProgress), [freezeProgress])
  const panelTexture = useMemo(() => {
    if (panelTextureRef.current) panelTextureRef.current.dispose()
    const tex = createPanelTexture(transitionColor)
    panelTextureRef.current = tex
    return tex
  }, [transitionColor])
  const glowTexture = useMemo(() => {
    const tex = createGlowTexture()
    glowTextureRef.current = tex
    return tex
  }, [])
  const rowTextures = useMemo(() => {
    rowTexturesRef.current.forEach(t => t.dispose())
    const textures = ANALYSIS_DATA.map((item) => createRowTexture(item, transitionColor))
    rowTexturesRef.current = textures
    return textures
  }, [transitionColor])

  useEffect(() => {
    return () => {
      panelTextureRef.current?.dispose()
      glowTextureRef.current?.dispose()
      rowTexturesRef.current.forEach(t => t.dispose())
    }
  }, [])

  const visible = frozen || freezeProgress > 0
  const opacity = frozen
    ? Math.min(1, freezeProgress + 0.2)
    : Math.min(1, freezeProgress * 2)

  useFrame((_, delta) => {
    if (!visible) return
    timeRef.current += delta
    const t = timeRef.current

    const dir = camera.getWorldDirection(new THREE.Vector3())
    groupRef.current.position
      .copy(camera.position)
      .add(dir.multiplyScalar(2.5))
    groupRef.current.quaternion.copy(camera.quaternion)

    if (ringRef.current) {
      const s = 1 + Math.sin(t * 1.8) * 0.04
      ringRef.current.scale.setScalar(s)
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.2 + Math.sin(t * 1.5) * 0.08
    }

    if (smallRingRef.current) {
      smallRingRef.current.rotation.z += delta * 0.5
      const s = 1 + Math.sin(t * 2.3 + 1) * 0.05
      smallRingRef.current.scale.setScalar(s)
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.SpriteMaterial
      mat.opacity = 0.5 + Math.sin(t * 2.5) * 0.3
    }
  })

  if (!enabled) return null
  if (!frozen && freezeProgress === 0) return null

  const ROW_COUNT = ANALYSIS_DATA.length
  const ROW_H = 0.09
  const ROW_GAP = 0.022
  const TOTAL_H = ROW_COUNT * (ROW_H + ROW_GAP)
  const START_Y = TOTAL_H / 2 - ROW_H / 2

  return (
    <group ref={groupRef}>
      {analysisTarget && (
        <sprite ref={glowRef} position={[0, 0.5, -0.15]} scale={[0.2, 0.2, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={transitionColor}
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      )}

      <mesh ref={ringRef}>
        <ringGeometry args={[0.7, 0.72, 64]} />
        <meshBasicMaterial
          color={transitionColor}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={smallRingRef} rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[0.55, 0.57, 48]} />
        <meshBasicMaterial
          color={transitionColor}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <sprite position={[0, 0, 0.01]} scale={[1.5, 1.65, 1]} renderOrder={0}>
        <spriteMaterial
          map={panelTexture}
          transparent
          opacity={opacity * 0.95}
          depthWrite={false}
        />
      </sprite>

      {rowTextures.map((texture, i) => (
        <sprite
          key={ANALYSIS_DATA[i].label}
          position={[0, START_Y - i * (ROW_H + ROW_GAP), 0.02]}
          scale={[1.4, ROW_H, 1]}
          renderOrder={1}
        >
          <spriteMaterial
            map={texture}
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}
