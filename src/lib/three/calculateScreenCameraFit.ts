import * as THREE from 'three'

export interface ScreenFitResult {
  position: [number, number, number]
  target: [number, number, number]
  scale: number
  distance: number
  fov: number
}

export function calculateScreenCameraFit(
  screenWidth: number,
  screenHeight: number,
  screenPosition: [number, number, number],
  screenRotation: number,
  domElement: HTMLElement,
  camera?: THREE.PerspectiveCamera,
): ScreenFitResult {
  const rect = domElement.getBoundingClientRect()
  const vpw = window.innerWidth
  const vph = window.innerHeight
  const aspect = vpw / vph
  const fov = 36
  const fovRad = THREE.MathUtils.degToRad(fov)
  const tanHalf = Math.tan(fovRad / 2)

  const domH = Math.max(rect.height / vph, 0.001)
  const domW = Math.max(rect.width / vpw, 0.001)

  const distFromH = screenHeight / (2 * tanHalf * domH)
  const distFromW = screenWidth / (2 * tanHalf * aspect * domW)
  const distance = Math.max(distFromH, distFromW)

  const nx = Math.sin(screenRotation)
  const nz = Math.cos(screenRotation)

  const basePos: [number, number, number] = [
    screenPosition[0] + nx * distance,
    screenPosition[1],
    screenPosition[2] + nz * distance,
  ]

  const baseTarget: [number, number, number] = [
    screenPosition[0],
    screenPosition[1],
    screenPosition[2],
  ]

  const domCx = (rect.left + rect.width / 2) / vpw
  const domCy = (rect.top + rect.height / 2) / vph
  const ndcx = domCx * 2 - 1
  const ndcy = -(domCy * 2 - 1)

  const cameraDir = new THREE.Vector3(-nx, 0, -nz)
  const up = new THREE.Vector3(0, 1, 0)
  const right = new THREE.Vector3()
  right.crossVectors(cameraDir, up).normalize()
  up.crossVectors(right, cameraDir).normalize()

  const halfH = distance * tanHalf
  const halfW = halfH * aspect

  const offset = new THREE.Vector3()
    .addScaledVector(right, -ndcx * halfW)
    .addScaledVector(up, -ndcy * halfH)

  const result: ScreenFitResult = {
    position: [
      basePos[0] + offset.x,
      basePos[1] + offset.y,
      basePos[2] + offset.z,
    ],
    target: [
      baseTarget[0] + offset.x,
      baseTarget[1] + offset.y,
      baseTarget[2] + offset.z,
    ],
    scale: 1,
    distance,
    fov,
  }

  if (camera) {
    camera.position.set(...result.position)
    camera.lookAt(result.target[0], result.target[1], result.target[2])
  }

  return result
}
