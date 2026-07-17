'use client'

import { useState, useEffect } from 'react'
import type { WebGLSupport } from '@/types/three'

export function useWebGLSupport(): WebGLSupport {
  const [support, setSupport] = useState<WebGLSupport>({
    supported: false,
    contextType: null,
    maxTextureSize: 0,
    maxVertexAttribs: 0,
  })

  useEffect(() => {
    const canvas = document.createElement('canvas')
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null

    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    } catch {
      // WebGL not available
    }

    if (!gl) {
      setSupport({ supported: false, contextType: null, maxTextureSize: 0, maxVertexAttribs: 0 })
      return
    }

    const isWebGL2 = gl instanceof WebGL2RenderingContext
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number

    setSupport({
      supported: true,
      contextType: isWebGL2 ? 'webgl2' : 'webgl',
      maxTextureSize,
      maxVertexAttribs,
    })
  }, [])

  return support
}
