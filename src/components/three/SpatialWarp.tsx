'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useCinematicTime } from '@/hooks/useCinematicTime'

const vertexShader = `
uniform float uProgress;
uniform vec2 uCenter;
uniform float uStrength;
uniform float uRadius;
uniform float uDepth;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vWarp;

void main() {
  vec3 pos = position;

  float dist = distance(pos.xz, uCenter);
  float mask = 1.0 - smoothstep(0.0, uRadius, dist);

  float curve = pos.y * pos.y * 0.3 * mask * uStrength;
  float compression = dist * mask * uStrength * 0.2;
  float radialShift = mask * uStrength * 0.15;

  float wave = sin(dist * 8.0 - uTime * 2.0) * 0.02 * mask * uStrength;
  float depthWarp = pos.z * mask * uDepth * 0.1;

  pos.y += curve + wave;
  pos.x += (pos.x - uCenter.x) * compression + (pos.x - uCenter.x) * radialShift;
  pos.z += depthWarp;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vNormal = normalize(normalMatrix * normal);
  vPosition = mvPosition.xyz;
  vWarp = mask * uStrength;
}
`

const fragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vWarp;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
  float diff = max(0.1, dot(normal, lightDir)) * 0.5 + 0.5;

  float rim = 1.0 - max(0.0, dot(normal, normalize(-vPosition)));
  rim = pow(rim, 3.0);

  float warpGlow = abs(vWarp) * 2.0;
  vec3 warpColor = mix(
    vec3(0.02, 0.71, 0.83),
    vec3(0.23, 0.51, 0.96),
    warpGlow
  );

  vec3 finalColor = uColor * diff + warpColor * warpGlow + vec3(1.0) * rim * 0.2;
  float alpha = uOpacity * (0.3 + 0.7 * diff) + warpGlow * 0.2;

  gl_FragColor = vec4(finalColor, min(alpha, 1.0));
}
`

interface SpatialWarpProps {
  progress?: number
  strength?: number
  radius?: number
  depth?: number
  color?: THREE.ColorRepresentation
  opacity?: number
}

export function SpatialWarp({
  progress = 0,
  strength = 1.0,
  radius = 2.0,
  depth = 1.0,
  color = '#3b82f6',
  opacity = 0.5,
}: SpatialWarpProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()
  const { state } = useCinematicTime()

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uCenter: { value: new THREE.Vector2(0, 0) },
    uStrength: { value: 0 },
    uRadius: { value: radius },
    uDepth: { value: depth },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: 0 },
  }), [radius, depth, color])

  useFrame((_, delta) => {
    const mat = matRef.current
    if (!mat) return

    const p = Math.min(1, progress)
    const eased = p < 0.5
      ? 2 * p * p
      : 1 - Math.pow(-2 * p + 2, 2) / 2

    mat.uniforms.uProgress.value = p
    mat.uniforms.uTime.value += delta * state.timeScale

    mat.uniforms.uCenter.value.set(0, 0)
    mat.uniforms.uStrength.value = strength * eased * 2.0
    mat.uniforms.uDepth.value = depth * eased
    mat.uniforms.uOpacity.value = opacity * eased

    const scale = 1 + eased * 0.15
    meshRef.current?.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size.width * 0.15, size.height * 0.15, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
