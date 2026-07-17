'use client'

import { useMemo, useRef, useEffect } from 'react'
import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { useCinematicTime } from '@/hooks/useCinematicTime'
import { sceneConfig } from '@/config/scene'
import LaptopScreen from '@/components/three/LaptopScreen'

interface LaptopModelProps {
  screenTexture?: THREE.Texture | null
}

export default function LaptopModel({ screenTexture }: LaptopModelProps) {
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const { state } = useCinematicTime()
  const { laptop } = sceneConfig
  const groupRef = useRef<THREE.Group>(null!)
  const lidRef = useRef<THREE.Group>(null!)

  const floatY = useRef(0)
  const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([])

  // Material definitions
  const baseMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#1a1a2e',
      metalness: 0.6,
      roughness: 0.3,
      envMapIntensity: 0.8,
    })
    materialsRef.current.push(mat)
    return mat
  }, [])

  const innerMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#16213e',
      metalness: 0.3,
      roughness: 0.5,
    })
    materialsRef.current.push(mat)
    return mat
  }, [])

  const hingeMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#0f3460',
      metalness: 0.8,
      roughness: 0.2,
    })
    materialsRef.current.push(mat)
    return mat
  }, [])

  const keycapMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#2a2a4e',
      metalness: 0.2,
      roughness: 0.7,
    })
    materialsRef.current.push(mat)
    return mat
  }, [])

  // Keyboard keys geometry
  const keys = useMemo(() => {
    const result = []
    const rows = laptop.keyboardRowCount
    const cols = laptop.keyboardColCount
    const keyW = (laptop.width - 0.3) / cols
    const keyH = 0.06
    const keyD = 0.015
    const startX = -laptop.width / 2 + 0.15
    const startZ = 0.08

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isSpace = r === rows - 1 && c >= Math.floor(cols / 3) && c < Math.floor(cols * 2 / 3)
        if (isSpace) continue
        result.push({
          position: [
            startX + c * keyW + keyW / 2,
            -laptop.depth / 2 + keyD,
            startZ + r * (keyH + 0.01),
          ] as [number, number, number],
          scale: [keyW * 0.85, keyD, keyH * 0.8] as [number, number, number],
        })
      }
    }
    return result
  }, [laptop])

  useEffect(() => {
    return () => {
      materialsRef.current.forEach(m => m.dispose())
    }
  }, [])

  // Floating animation
  useFrame((_, delta) => {
    if (reduced) return

    floatY.current += delta * state.timeScale * 0.4
    const yOffset = Math.sin(floatY.current) * 0.008

    if (groupRef.current) {
      groupRef.current.position.y = yOffset
    }
  })

  const baseHeight = laptop.depth
  const baseY = -baseHeight / 2

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Base bottom case */}
      <RoundedBox
        args={[laptop.width, baseHeight, laptop.height * 0.65]}
        radius={0.04}
        smoothness={4}
        position={[0, baseY, 0]}
        castShadow
        receiveShadow={quality !== 'low'}
      >
        <meshPhysicalMaterial {...baseMaterial} />
      </RoundedBox>

      {/* Base top surface */}
      <RoundedBox
        args={[laptop.width - 0.04, 0.008, laptop.height * 0.6]}
        radius={0.02}
        smoothness={4}
        position={[0, baseY + baseHeight / 2, 0]}
      >
        <meshPhysicalMaterial {...innerMaterial} />
      </RoundedBox>

      {/* Keyboard area */}
      {keys.map((key, i) => (
        <RoundedBox
          key={i}
          args={key.scale}
          radius={0.002}
          smoothness={2}
          position={[key.position[0], key.position[1], key.position[2]]}
        >
          <meshPhysicalMaterial {...keycapMaterial} />
        </RoundedBox>
      ))}

      {/* Touchpad */}
      <RoundedBox
        args={[0.3, 0.005, 0.18]}
        radius={0.008}
        smoothness={4}
        position={[0, baseY + baseHeight / 2, -0.12]}
      >
        <meshPhysicalMaterial
          color="#1a1a3e"
          metalness={0.1}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Hinge */}
      <group position={[0, 0, 0.55]}>
        <RoundedBox
          args={[laptop.width * 0.6, laptop.hingeRadius, laptop.hingeRadius * 1.5]}
          radius={0.02}
          smoothness={4}
          position={[0, -laptop.hingeRadius / 2, 0]}
        >
          <meshPhysicalMaterial {...hingeMaterial} />
        </RoundedBox>
      </group>

      {/* Lid (screen back) */}
      <group ref={lidRef} position={[0, laptop.height / 2, 0.52]}>
        <RoundedBox
          args={[laptop.width, laptop.height, laptop.depth]}
          radius={0.03}
          smoothness={4}
          castShadow
          receiveShadow={quality !== 'low'}
        >
          <meshPhysicalMaterial
            color="#0f0f23"
            metalness={0.5}
            roughness={0.4}
            envMapIntensity={0.6}
          />
        </RoundedBox>

        {/* Screen */}
        <LaptopScreen texture={screenTexture} />
      </group>
    </group>
  )
}
