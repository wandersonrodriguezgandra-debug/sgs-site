'use client'

import { useRef, forwardRef, type ForwardedRef } from 'react'
import * as THREE from 'three'
import { voxelConfig } from '@/config/voxel-scene'
import VoxelObject from './voxels/VoxelObject'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'

interface VoxelMaterializationProps {
  progress: number
  quality?: string
}

function VoxelMaterializationComponent(
  { progress, quality: _quality }: VoxelMaterializationProps,
  ref: ForwardedRef<THREE.Group>,
) {
  const reduced = useReducedMotion()
  const graphicsQuality = useGraphicsQuality()
  const groupRef = useRef<THREE.Group>(null)
  const quality = _quality || graphicsQuality

  const getCount = () => {
    if (reduced || quality === 'low' || quality === 'fallback') return 0
    const counts = voxelConfig.counts
    return counts[quality] ?? counts.high ?? 1500
  }

  const count = getCount()

  if (count === 0) return null

  return (
    <group ref={ref ?? groupRef}>
      <VoxelObject count={count} progress={progress} quality={quality} />
    </group>
  )
}

export const VoxelMaterialization = forwardRef(VoxelMaterializationComponent)
