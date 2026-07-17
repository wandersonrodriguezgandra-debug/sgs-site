'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { calculateScreenCameraFit } from '@/lib/three/calculateScreenCameraFit'
import { sceneConfig } from '@/config/scene'
import { useCinematicTime } from '@/hooks/useCinematicTime'

const glassVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

const glassFragmentShader = `
uniform float uProgress;
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
  fresnel = pow(fresnel, 2.5);

  vec2 center = vUv - 0.5;
  float radialMask = 1.0 - length(center) * 1.4;
  radialMask = smoothstep(0.0, 0.6, radialMask);

  float rim = smoothstep(0.0, 0.3, fresnel) * (1.0 - uProgress);

  float screenGlow = radialMask * uProgress;
  screenGlow *= 1.0 - smoothstep(0.0, 0.3, abs(vUv.y - 0.5) * 2.0);

  float scanline = sin(vUv.y * 400.0 + uTime * 2.0) * 0.5 + 0.5;
  scanline *= 0.15 * uProgress;

  float alpha = rim * 0.6 + screenGlow * 0.4 + scanline;

  vec3 reflection = vec3(0.3, 0.5, 0.7) * fresnel * 0.3;
  vec3 color = uColor * (screenGlow * 0.5 + 0.5) + reflection * (1.0 - uProgress);

  gl_FragColor = vec4(color, alpha);
}
`

interface ThroughScreenTransitionProps {
  progress: number
  domElement?: HTMLElement | null
  screenWidth?: number
  screenHeight?: number
  screenPosition?: [number, number, number]
  screenRotation?: number
  color?: THREE.ColorRepresentation
}

export function ThroughScreenTransition({
  progress,
  domElement,
  screenWidth = sceneConfig.laptop.width * 0.8,
  screenHeight = sceneConfig.laptop.height * 0.7,
  screenPosition: screenPos = [0, 0.35, 0],
  screenRotation = 0,
  color = '#06b6d4',
}: ThroughScreenTransitionProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const coverMatRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, size } = useThree()
  const prevProgressRef = useRef(0)
  const { state: cinematicState } = useCinematicTime()

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uTime: { value: 0 },
  }), [color])

  const coverUniforms = useMemo(() => ({
    uOpacity: { value: 0 },
  }), [])

  const targetDomRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (domElement) {
      targetDomRef.current = domElement
    } else {
      targetDomRef.current = document.querySelector('#dashboard-section') as HTMLElement ||
        document.querySelector('[data-through-screen]') as HTMLElement
    }
  }, [domElement])

  useFrame((_root, delta) => {
    const mat = matRef.current
    const coverMat = coverMatRef.current
    if (!mat) return

    mat.uniforms.uProgress.value = progress
    mat.uniforms.uTime.value += delta * cinematicState.timeScale

    if (progress > 0.01 && targetDomRef.current && camera instanceof THREE.PerspectiveCamera) {
      calculateScreenCameraFit(
        screenWidth,
        screenHeight,
        screenPos,
        screenRotation,
        targetDomRef.current,
        camera,
      )
    }

    if (coverMat && progress > 0.3) {
      const coverProgress = Math.max(0, (progress - 0.3) / 0.4)
      coverMat.uniforms.uOpacity.value = coverProgress
    }

    prevProgressRef.current = progress
  })

  const shouldShow = progress > 0 && progress < 1

  if (!shouldShow) return null

  return (
    <group>
      <mesh ref={meshRef} position={screenPos} rotation={[0, screenRotation, 0]}>
        <planeGeometry args={[screenWidth, screenHeight, 32, 32]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={glassVertexShader}
          fragmentShader={glassFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {progress > 0.3 && (
        <mesh position={[0, 0, 0]} scale={[size.width, size.height, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={coverMatRef}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform float uOpacity;
              varying vec2 vUv;
              void main() {
                float mask = smoothstep(0.3, 0.7, vUv.y) * smoothstep(1.0, 0.4, vUv.y);
                float alpha = uOpacity * mask * 0.3;
                gl_FragColor = vec4(0.02, 0.71, 0.83, alpha);
              }
            `}
            uniforms={coverUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}


