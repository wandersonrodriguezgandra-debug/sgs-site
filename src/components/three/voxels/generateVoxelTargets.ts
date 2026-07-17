import { voxelConfig } from '@/config/voxel-scene'

export interface VoxelInstanceData {
  initial: Float32Array
  target: Float32Array
  phase: Float32Array
  randomFactor: Float32Array
  scale: Float32Array
}

export function generateVoxelTargets(count: number): VoxelInstanceData {
  const initial = new Float32Array(count * 3)
  const target = new Float32Array(count * 3)
  const phase = new Float32Array(count)
  const randomFactor = new Float32Array(count)
  const scale = new Float32Array(count)

  const { radius, height, thickness } = voxelConfig.shieldShape
  const { assemblyRadius, staggerSpread } = voxelConfig.animation

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.5
    const r = radius + (Math.random() - 0.5) * thickness

    target[i3] = r * Math.sin(phi) * Math.cos(theta)
    target[i3 + 1] = r * Math.cos(phi) * height
    target[i3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    initial[i3] = (Math.random() - 0.5) * assemblyRadius * 2
    initial[i3 + 1] = (Math.random() - 0.5) * assemblyRadius
    initial[i3 + 2] = (Math.random() - 0.5) * assemblyRadius * 2

    phase[i] = Math.random() * staggerSpread
    randomFactor[i] = 0.5 + Math.random() * 0.5
    scale[i] = 0.6 + Math.random() * 0.4
  }

  return { initial, target, phase, randomFactor, scale }
}
