'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCinematicAudio } from '@/hooks/useCinematicAudio'

function VolumeIcon({ volume }: { volume: number }) {
  const waves = volume > 0.66 ? 2 : volume > 0.33 ? 1 : 0

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {waves >= 1 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
      {waves >= 2 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
    </svg>
  )
}

function VolumeMutedIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  )
}

export default function AudioControl() {
  const { enabled, setEnabled, masterVolume, setMasterVolume } = useCinematicAudio()
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }, [toggle])

  if (!mounted) return null

  if (typeof AudioContext === 'undefined' && typeof (window as any)?.webkitAudioContext === 'undefined') {
    return null
  }

  return (
    <div
      data-testid="audio-control"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-sgs-blue-900/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg transition-all duration-300"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {enabled && expanded && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          aria-label="Volume"
          data-testid="audio-volume"
          className="w-20 h-1.5 accent-sgs-accent cursor-pointer"
        />
      )}
      <button
        data-testid="audio-toggle"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-pressed={enabled}
        aria-label={enabled ? 'Desativar som' : 'Ativar som'}
        className="flex items-center justify-center w-8 h-8 rounded-full text-sgs-accent hover:bg-sgs-accent/10 transition-colors focus-visible:outline-2 focus-visible:outline-sgs-accent outline-none"
      >
        {enabled ? <VolumeIcon volume={masterVolume} /> : <VolumeMutedIcon />}
      </button>
    </div>
  )
}
