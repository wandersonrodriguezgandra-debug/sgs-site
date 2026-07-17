'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from 'three'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'
import { sceneConfig } from '@/config/scene'

interface CameraRigProps {
  scrollProgress?: number
  mouseX?: number
  mouseY?: number
  cinematicTarget?: [number, number, number] | null
  cinematicPosition?: [number, number, number] | null
}

export default function CameraRig({
  scrollProgress = 0,
  mouseX = 0,
  mouseY = 0,
  cinematicTarget = null,
  cinematicPosition = null,
}: CameraRigProps) {
  const { camera } = useThree()
  const quality = useGraphicsQuality()
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const config = sceneConfig.camera

  // Posição da câmera com damping
  const currentPos = useRef(config.position)
  const currentTarget = useRef<[number, number, number]>([0, 0.4, 0])
  const basePos = useRef(config.position)

  // Fly-in de entrada: a câmera "voa" de longe (recuada + FOV mais aberto)
  // e assenta na posição base ao carregar. Sincroniza com o preloader.
  const introStart = useRef<number | null>(null)
  const INTRO_DURATION = 1.8

  useEffect(() => {
    const cam = camera as PerspectiveCamera
    cam.position.set(...config.position)
    cam.lookAt(0, 0.4, 0)
    cam.fov = config.fov
    cam.near = config.near
    cam.far = config.far
    cam.updateProjectionMatrix()
  }, [camera, config])

  useFrame((state) => {
    if (reduced) return

    // Fator do fly-in de entrada (1 = totalmente recuado, 0 = assentado)
    const now = state.clock.elapsedTime
    if (introStart.current === null) introStart.current = now
    const introT = Math.min(1, (now - introStart.current) / INTRO_DURATION)
    const introEase = 1 - Math.pow(1 - introT, 4) // expo.out
    const introAmt = 1 - introEase // 1 -> 0

    // Se posição cinematográfica for fornecida, usar ela
    if (cinematicPosition) {
      const tx = cinematicPosition[0]
      const ty = cinematicPosition[1]
      const tz = cinematicPosition[2]

      const cx = currentPos.current[0] + (tx - currentPos.current[0]) * 0.04
      const cy = currentPos.current[1] + (ty - currentPos.current[1]) * 0.04
      const cz = currentPos.current[2] + (tz - currentPos.current[2]) * 0.04
      currentPos.current = [cx, cy, cz]
      camera.position.set(cx + introAmt * 0.3, cy + introAmt * 0.5, cz + introAmt * 2.2)
    } else {
      // Comportamento padrão: scroll + mouse parallax
      const scrollOffset = scrollProgress * 0.3
      const mouseOffsetX = quality !== 'low' ? mouseX * 0.15 : 0
      const mouseOffsetY = quality !== 'low' ? mouseY * 0.1 : 0

      const tx = basePos.current[0] + mouseOffsetX
      const ty = basePos.current[1] - scrollOffset + mouseOffsetY
      const tz = basePos.current[2] + scrollOffset * 0.5

      const cx = currentPos.current[0] + (tx - currentPos.current[0]) * 0.05
      const cy = currentPos.current[1] + (ty - currentPos.current[1]) * 0.05
      const cz = currentPos.current[2] + (tz - currentPos.current[2]) * 0.05
      currentPos.current = [cx, cy, cz]
      camera.position.set(cx + introAmt * 0.3, cy + introAmt * 0.5, cz + introAmt * 2.2)
    }

    // FOV "punch": começa mais aberto e fecha no valor base (sensação de rush)
    if (introAmt > 0.001) {
      const cam = camera as PerspectiveCamera
      cam.fov = config.fov + introAmt * 9
      cam.updateProjectionMatrix()
    }

    // Look-at
    const lookTarget = cinematicTarget || [0, 0.4 - scrollProgress * 0.05, 0]
    const lx = currentTarget.current[0] + (lookTarget[0] - currentTarget.current[0]) * 0.04
    const ly = currentTarget.current[1] + (lookTarget[1] - currentTarget.current[1]) * 0.04
    const lz = currentTarget.current[2] + (lookTarget[2] - currentTarget.current[2]) * 0.04
    currentTarget.current = [lx, ly, lz]
    camera.lookAt(lx, ly, lz)
  })

  return null
}
