'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface ContextLossHandlers {
  onLost?: () => void
  onRestored?: () => void
  onPermanentLoss?: () => void
}

interface UseWebGLContextLossReturn {
  contextLost: boolean
  reconnecting: boolean
  attempts: number
  permanentlyLost: boolean
}

export function useWebGLContextLoss(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  handlers?: ContextLossHandlers,
): UseWebGLContextLossReturn {
  const [contextLost, setContextLost] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [permanentlyLost, setPermanentlyLost] = useState(false)
  const retryCountRef = useRef(0)
  const maxRetries = 3
  const retryInterval = 2000
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const attemptReconnection = useCallback((canvas: HTMLCanvasElement) => {
    if (retryCountRef.current >= maxRetries) {
      setReconnecting(false)
      setPermanentlyLost(true)
      handlersRef.current?.onPermanentLoss?.()
      return
    }

    retryCountRef.current += 1
    setAttempts(retryCountRef.current)

    const timer = setTimeout(() => {
      canvas.style.display = 'none'
      canvas.offsetHeight
      canvas.style.display = ''
    }, retryInterval)
    timersRef.current.push(timer)
  }, [maxRetries, retryInterval])

  const handleContextLost = useCallback((e: Event) => {
    e.preventDefault()
    setContextLost(true)
    setReconnecting(true)
    handlersRef.current?.onLost?.()

    retryCountRef.current = 0
    const canvas = e.target as HTMLCanvasElement
    attemptReconnection(canvas)
  }, [attemptReconnection])

  const handleContextRestored = useCallback(() => {
    clearTimers()
    setContextLost(false)
    setReconnecting(false)
    setAttempts(0)
    setPermanentlyLost(false)
    retryCountRef.current = 0
    handlersRef.current?.onRestored?.()
  }, [clearTimers])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)

    return () => {
      clearTimers()
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [canvasRef, handleContextLost, handleContextRestored, clearTimers])

  return { contextLost, reconnecting, attempts, permanentlyLost }
}
