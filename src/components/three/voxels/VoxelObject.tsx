'use client'

import { useMemo, useRef, type FC } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { voxelConfig } from '@/config/voxel-scene'
import { generateVoxelTargets, type VoxelInstanceData } from './generateVoxelTargets'
import { VERTEX_SHADER } from './voxel.vert.glsl'
import { FRAGMENT_SHADER } from './voxel.frag.glsl'
import { useCinematicTime } from '@/hooks/useCinematicTime'

interface VoxelObjectProps {
  count: number
  progress: number
  quality: string
}

const CUBE_VERTS = 24

const CUBE_POSITIONS = new Float32Array([
  -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
  -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
  -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5, -0.5, -0.5,  0.5,
   0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5,
])

const CUBE_NORMALS = new Float32Array([
  0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
  0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
  0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
  0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
  1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
 -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
])

function expandInstanceData(count: number, data: VoxelInstanceData) {
  const totalVerts = count * CUBE_VERTS
  const positions = new Float32Array(totalVerts * 3)
  const normals = new Float32Array(totalVerts * 3)
  const initPos = new Float32Array(totalVerts * 3)
  const targetPos = new Float32Array(totalVerts * 3)
  const phases = new Float32Array(totalVerts)
  const randoms = new Float32Array(totalVerts)
  const scales = new Float32Array(totalVerts)

  for (let i = 0; i < count; i++) {
    const base = i * CUBE_VERTS * 3
    for (let j = 0; j < CUBE_VERTS; j++) {
      const vo = base + j * 3
      positions[vo] = CUBE_POSITIONS[j * 3]
      positions[vo + 1] = CUBE_POSITIONS[j * 3 + 1]
      positions[vo + 2] = CUBE_POSITIONS[j * 3 + 2]
      normals[vo] = CUBE_NORMALS[j * 3]
      normals[vo + 1] = CUBE_NORMALS[j * 3 + 1]
      normals[vo + 2] = CUBE_NORMALS[j * 3 + 2]
      initPos[vo] = data.initial[i * 3]
      initPos[vo + 1] = data.initial[i * 3 + 1]
      initPos[vo + 2] = data.initial[i * 3 + 2]
      targetPos[vo] = data.target[i * 3]
      targetPos[vo + 1] = data.target[i * 3 + 1]
      targetPos[vo + 2] = data.target[i * 3 + 2]
    }
    const soff = i * CUBE_VERTS
    for (let j = 0; j < CUBE_VERTS; j++) {
      phases[soff + j] = data.phase[i]
      randoms[soff + j] = data.randomFactor[i]
      scales[soff + j] = data.scale[i]
    }
  }

  return { positions, normals, initPos, targetPos, phases, randoms, scales }
}

const VoxelObject: FC<VoxelObjectProps> = ({ count, progress, quality: _quality }) => {
  const { state } = useCinematicTime()
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const instanceData = useMemo(() => generateVoxelTargets(count), [count])

  const geometry = useMemo(() => {
    const expanded = expandInstanceData(count, instanceData)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(expanded.positions, 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(expanded.normals, 3))
    geo.setAttribute('aInitPos', new THREE.BufferAttribute(expanded.initPos, 3))
    geo.setAttribute('aTargetPos', new THREE.BufferAttribute(expanded.targetPos, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(expanded.phases, 1))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(expanded.randoms, 1))
    geo.setAttribute('aScale', new THREE.BufferAttribute(expanded.scales, 1))
    return geo
  }, [count, instanceData])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uNoiseStrength: { value: voxelConfig.animation.noiseStrength },
    uPulse: { value: 0 },
    uSize: { value: 0.012 },
    uColorStart: { value: new THREE.Color(voxelConfig.colors.start) },
    uColorEnd: { value: new THREE.Color(voxelConfig.colors.end) },
  }), [])

  useFrame((_state, delta) => {
    const mat = matRef.current
    if (!mat) return
    mat.uniforms.uTime.value += delta * state.timeScale
    mat.uniforms.uProgress.value = progress

    const pulseStrength = Math.exp(-Math.pow((progress - 0.85) / 0.12, 2))
    const pulse = pulseStrength * (0.5 + 0.5 * Math.sin(mat.uniforms.uTime.value as number * voxelConfig.animation.pulseFrequency))
    mat.uniforms.uPulse.value = pulse
  })

  if (count === 0) return null

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        args={[{
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          uniforms,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }]}
      />
    </mesh>
  )
}

export default VoxelObject
