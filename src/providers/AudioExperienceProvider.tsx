'use client'

import { useRef, useCallback, useState, useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { audioCues } from '@/config/audio-cues'
import { AudioContextCtx } from './audio-experience-context'

export function AudioExperienceProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const activeNodes = useRef<Map<string, OscillatorNode | AudioBufferSourceNode>>(new Map())
  const lastPlayed = useRef<Map<string, number>>(new Map())
  const [enabled, setEnabled] = useState(false)
  const [masterVolume, setMasterVolumeState] = useState(0.3)

  useEffect(() => {
    if (reduced) {
      setEnabled(false)
    }
  }, [reduced])

  const getContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      masterGainRef.current = audioCtxRef.current.createGain()
      masterGainRef.current.gain.value = masterVolume
      masterGainRef.current.connect(audioCtxRef.current.destination)
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [masterVolume])

  const play = useCallback((id: string) => {
    if (!enabled || reduced) return

    const cue = audioCues.find((c) => c.id === id)
    if (!cue) return

    const last = lastPlayed.current.get(id) ?? 0
    if (Date.now() - last < cue.cooldown) return
    lastPlayed.current.set(id, Date.now())

    try {
      const ctx = getContext()
      if (!ctx || !masterGainRef.current) return

      const now = ctx.currentTime
      const gain = ctx.createGain()
      gain.connect(masterGainRef.current)
      gain.gain.setValueAtTime(cue.volume, now)

      switch (cue.type) {
        case 'sine': {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(cue.frequency?.[0] ?? 440, now)
          osc.connect(gain)
          osc.start(now)
          osc.stop(now + cue.duration)
          activeNodes.current.set(id, osc)
          osc.onended = () => activeNodes.current.delete(id)
          break
        }
        case 'sweep': {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          const freq = cue.frequency ?? [200, 600]
          osc.frequency.setValueAtTime(freq[0], now)
          osc.frequency.linearRampToValueAtTime(freq[1], now + cue.duration)
          osc.connect(gain)
          osc.start(now)
          osc.stop(now + cue.duration)
          activeNodes.current.set(id, osc)
          osc.onended = () => activeNodes.current.delete(id)
          break
        }
        case 'noise': {
          const bufferSize = ctx.sampleRate * cue.duration
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
          const data = buffer.getChannelData(0)
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
          }
          const source = ctx.createBufferSource()
          source.buffer = buffer
          source.connect(gain)
          source.start(now)
          activeNodes.current.set(id, source)
          source.onended = () => activeNodes.current.delete(id)
          break
        }
        case 'impact': {
          const bufSize = ctx.sampleRate * cue.duration
          const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
          const ch = buf.getChannelData(0)
          for (let i = 0; i < bufSize; i++) {
            ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05))
          }
          const src = ctx.createBufferSource()
          src.buffer = buf
          src.connect(gain)
          src.start(now)
          activeNodes.current.set(id, src)
          src.onended = () => activeNodes.current.delete(id)
          break
        }
        case 'confirm': {
          const osc1 = ctx.createOscillator()
          osc1.type = 'sine'
          osc1.frequency.setValueAtTime(523.25, now)
          osc1.connect(gain)
          osc1.start(now)
          osc1.stop(now + cue.duration * 0.5)

          const gain2 = ctx.createGain()
          gain2.connect(masterGainRef.current)
          gain2.gain.setValueAtTime(cue.volume * 0.6, now + cue.duration * 0.5)
          const osc2 = ctx.createOscillator()
          osc2.type = 'sine'
          osc2.frequency.setValueAtTime(659.25, now + cue.duration * 0.5)
          osc2.connect(gain2)
          osc2.start(now + cue.duration * 0.5)
          osc2.stop(now + cue.duration)

          const combinedId = `${id}-combined`
          activeNodes.current.set(id, osc1)
          activeNodes.current.set(combinedId, osc2)
          osc1.onended = () => activeNodes.current.delete(id)
          osc2.onended = () => activeNodes.current.delete(combinedId)
          break
        }
      }
    } catch {
      // Web Audio API indisponível
    }
  }, [enabled, reduced, getContext])

  const stop = useCallback((id: string) => {
    const node = activeNodes.current.get(id)
    if (node) {
      try { node.stop() } catch { /* já parou */ }
      activeNodes.current.delete(id)
    }
  }, [])

  const stopAll = useCallback(() => {
    activeNodes.current.forEach((node) => {
      try { node.stop() } catch { /* */ }
    })
    activeNodes.current.clear()
  }, [])

  const setMasterVolume = useCallback((v: number) => {
    setMasterVolumeState(v)
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = v
    }
  }, [])

  if (reduced) {
    return <>{children}</>
  }

  return (
    <AudioContextCtx.Provider value={{ play, stop, stopAll, setMasterVolume, enabled, setEnabled, masterVolume }}>
      {children}
    </AudioContextCtx.Provider>
  )
}
