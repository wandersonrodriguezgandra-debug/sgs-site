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

  const webkitAudioContext = (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
    return null
  }

  return (
    <div
      data-testid="audio-control"
      className="fixed bottom-5 right-5 z-50 hidden items-center gap-2 rounded-full border border-sgs-blue-100/80 bg-white/80 px-1.5 py-1.5 text-sgs-accent opacity-60 shadow-[0_12px_35px_rgba(7,26,51,0.14)] backdrop-blur-xl transition-all duration-300 hover:opacity-100 sm:flex"
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
        className="flex h-8 w-8 items-center justify-center rounded-full text-sgs-accent transition-colors hover:bg-sgs-blue-50 focus-visible:outline-2 focus-visible:outline-sgs-accent outline-none"
      >
        {enabled ? <VolumeIcon volume={masterVolume} /> : <VolumeMutedIcon />}
      </button>
    </div>
  )
}
