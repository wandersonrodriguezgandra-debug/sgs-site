'use client'

import { Component, type ReactNode } from 'react'
import SceneFallback from '@/components/three/SceneFallback'

interface WebGLErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface WebGLErrorBoundaryState {
  hasError: boolean
}

export default class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _info: unknown) {
    if (import.meta.env.DEV) {
      console.warn('[WebGL Error]', error.message)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <SceneFallback />
    }
    return this.props.children
  }
}
