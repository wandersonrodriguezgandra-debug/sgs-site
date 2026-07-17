'use client'

import { useMemo } from 'react'
import { Plane, Text } from '@react-three/drei'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import { sceneConfig } from '@/config/scene'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import ScreenShaderMaterial from '@/components/three/ScreenShaderMaterial'
import GlassOverlay from '@/components/three/GlassOverlay'

// IMAGEM TEMPORÁRIA — substituir pela captura oficial do dashboard SGS
// Dimensão recomendada: 1920x1200px (16:10)

interface LaptopScreenProps {
  texture?: THREE.Texture | null
}

export default function LaptopScreen({ texture: externalTexture }: LaptopScreenProps) {
  const { laptop } = sceneConfig
  const screenWidth = laptop.width - laptop.bezelSize * 2
  const screenHeight = laptop.height - laptop.bezelSize * 2 - 0.04
  const quality = useGraphicsQuality()

  // Placeholder gradient texture
  const internalTexture = useMemo(() => {
    if (externalTexture) return externalTexture

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 320
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createLinearGradient(0, 0, 512, 320)
    gradient.addColorStop(0, '#1e3a5f')
    gradient.addColorStop(0.5, '#1e40af')
    gradient.addColorStop(1, '#0f172a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 320)

    // Window controls
    ctx.fillStyle = '#ffffff20'
    ctx.beginPath()
    ctx.arc(40, 30, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff20'
    ctx.beginPath()
    ctx.arc(60, 30, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff20'
    ctx.beginPath()
    ctx.arc(80, 30, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('SGS Dashboard', 120, 36)

    // Chart bars
    const barColors = ['#3b82f6', '#60a5fa', '#2563eb', '#93c5fd', '#3b82f6', '#60a5fa']
    const barW = 50
    const barGap = 20
    const barBase = 250
    barColors.forEach((color, i) => {
      const h = 40 + Math.random() * 80
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(30 + i * (barW + barGap), barBase - h, barW, h, 4)
      ctx.fill()
    })

    // Stats boxes
    const stats = [
      { label: 'Adesão DDS', value: '94%', x: 30, y: 180, color: '#22c55e' },
      { label: 'Documentos', value: '87%', x: 200, y: 180, color: '#3b82f6' },
      { label: 'Treinamentos', value: '72%', x: 370, y: 180, color: '#f59e0b' },
    ]
    stats.forEach((s) => {
      ctx.fillStyle = '#ffffff10'
      ctx.beginPath()
      ctx.roundRect(s.x, s.y - 25, 100, 55, 8)
      ctx.fill()
      ctx.fillStyle = s.color
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText(s.value, s.x + 10, s.y + 5)
      ctx.fillStyle = '#ffffff80'
      ctx.font = '10px sans-serif'
      ctx.fillText(s.label, s.x + 10, s.y + 22)
    })

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [externalTexture])

  const useShader = quality !== 'low'

  return (
    <group position={[0, laptop.height / 2 + 0.01, -laptop.depth / 2]}>
      {/* Screen bezel inner border */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[screenWidth + 0.01, screenHeight + 0.01]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      {/* Dashboard texture with custom shader or basic material */}
      <Plane args={[screenWidth, screenHeight]} position={[0, 0, -0.01]}>
        {useShader ? (
          <ScreenShaderMaterial map={internalTexture} />
        ) : (
          <meshBasicMaterial map={internalTexture} toneMapped={false} />
        )}
      </Plane>

      {/* Glass reflection overlay — componentizado */}
      <GlassOverlay width={screenWidth} height={screenHeight} depth={-0.015} />

      {/* Screen glow — bloom seletivo */}
      <Select>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[screenWidth * 0.9, screenHeight * 0.9]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
          />
        </mesh>
      </Select>

      {/* Placeholder text */}
      <Text
        position={[0, -screenHeight / 2 + 0.05, -0.012]}
        fontSize={0.04}
        color="#ffffff40"
        anchorX="center"
        anchorY="bottom"
      >
        {externalTexture ? '' : 'IMAGEM TEMPORÁRIA — substituir pela captura oficial'}
      </Text>
    </group>
  )
}
