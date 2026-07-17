'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useGraphicsQuality } from '@/hooks/useGraphicsQuality'

interface ScreenShaderUniforms {
  [key: string]: THREE.IUniform<any>
  uTexture: THREE.IUniform<THREE.Texture | null>
  uTime: THREE.IUniform<number>
  uFresnelPower: THREE.IUniform<number>
  uFresnelColor: THREE.IUniform<THREE.Color>
  uFresnelIntensity: THREE.IUniform<number>
  uReflectionStrength: THREE.IUniform<number>
  uEmissionStrength: THREE.IUniform<number>
  uEdgeDarkening: THREE.IUniform<number>
}

interface ScreenShaderMaterialProps {
  map: THREE.Texture | null
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uFresnelPower;
  uniform vec3 uFresnelColor;
  uniform float uFresnelIntensity;
  uniform float uReflectionStrength;
  uniform float uEmissionStrength;
  uniform float uEdgeDarkening;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);

    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
    fresnel = pow(fresnel, uFresnelPower);
    vec3 fresnelGlow = uFresnelColor * fresnel * uFresnelIntensity;

    float edgeDark = smoothstep(0.0, 0.15, vUv.x) * smoothstep(0.0, 0.15, vUv.y)
                   * smoothstep(0.0, 0.15, 1.0 - vUv.x) * smoothstep(0.0, 0.15, 1.0 - vUv.y);
    edgeDark = mix(1.0 - uEdgeDarkening, 1.0, edgeDark);

    float edgeGlow = smoothstep(0.88, 0.98, vUv.x) + smoothstep(0.88, 0.98, 1.0 - vUv.x)
                   + smoothstep(0.88, 0.98, vUv.y) + smoothstep(0.88, 0.98, 1.0 - vUv.y);
    edgeGlow = min(edgeGlow, 1.0) * uEmissionStrength;

    vec3 reflection = vec3(0.02, 0.04, 0.08) * fresnel * uReflectionStrength;

    vec3 finalColor = (texColor.rgb * edgeDark) + fresnelGlow + reflection + vec3(0.1, 0.2, 0.6) * edgeGlow;

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`

export default function ScreenShaderMaterial({ map }: ScreenShaderMaterialProps) {
  const reduced = useReducedMotion()
  const quality = useGraphicsQuality()
  const timeRef = useRef(0)

  const uniforms: ScreenShaderUniforms = useMemo(() => ({
    uTexture: { value: map || new THREE.Texture() },
    uTime: { value: 0 },
    uFresnelPower: { value: quality === 'high' ? 2.0 : 1.5 },
    uFresnelColor: { value: new THREE.Color('#3b82f6') },
    uFresnelIntensity: { value: quality === 'high' ? 0.3 : 0.15 },
    uReflectionStrength: { value: quality === 'high' ? 0.4 : 0.2 },
    uEmissionStrength: { value: quality === 'high' ? 0.12 : 0.06 },
    uEdgeDarkening: { value: quality === 'high' ? 0.15 : 0.08 },
  }), [quality, map])

  useFrame(() => {
    if (reduced) return
    timeRef.current += 0.016
    uniforms.uTime.value = timeRef.current
  })

  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  )
}
