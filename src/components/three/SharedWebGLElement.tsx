'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'

interface SharedWebGLElementProps {
  value: string
  label: string
  targetSelector: string
  active?: boolean
}

export default function SharedWebGLElement({
  value,
  label,
  targetSelector,
  active = false,
}: SharedWebGLElementProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const { camera, size } = useThree()
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const rafRef = useRef<number>(0)
  const [domStyle, setDomStyle] = useState<CSSProperties | null>(null)

  // Projeta a posição 3D para coordenadas de tela
  useEffect(() => {
    if (!active || !groupRef.current) return

    const worldPos = new THREE.Vector3()
    groupRef.current.getWorldPosition(worldPos)

    const projected = worldPos.clone().project(camera)
    const x = (projected.x * 0.5 + 0.5) * size.width
    const y = (-projected.y * 0.5 + 0.5) * size.height

    setDomStyle({
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-50%, -50%)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      opacity: active ? 1 : 0,
      pointerEvents: 'none',
      zIndex: 50,
    })

    // Atualiza posição contínua durante transição
    const update = () => {
      if (!groupRef.current) return
      const pos = new THREE.Vector3()
      groupRef.current.getWorldPosition(pos)
      const p = pos.clone().project(camera)
      const nx = (p.x * 0.5 + 0.5) * size.width
      const ny = (-p.y * 0.5 + 0.5) * size.height
      setDomStyle((prev) => prev ? { ...prev, left: `${nx}px`, top: `${ny}px` } : null)
      rafRef.current = requestAnimationFrame(update)
    }

    if (active) {
      update()
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active, targetSelector, camera, size])

  // Elemento DOM compartilhado
  useEffect(() => {
    if (!active || !domStyle) return

    const el = document.createElement('div')
    el.id = 'shared-webgl-element-dom'
    Object.assign(el.style, domStyle)
    el.innerHTML = `<div style="text-align:center;"><strong style="font-size:1.25rem;color:#22c55e;display:block;">${value}</strong><span style="font-size:0.75rem;color:#22c55e80;">${label}</span></div>`
    document.body.appendChild(el)

    return () => {
      el.remove()
    }
  }, [active, domStyle, value, label])

  if (!active || reduced || quality === 'low') return null

  return (
    <group ref={groupRef}>
      <Text
        fontSize={0.05}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {value}
      </Text>
      <Text
        position={[0, -0.04, 0]}
        fontSize={0.022}
        color="#22c55e80"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}
