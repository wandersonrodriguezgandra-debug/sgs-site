'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface HeroVideoBackgroundProps {
  src: string
  poster: string
}

export default function HeroVideoBackground({ src, poster }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  const startVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    void video.play().catch(() => setIsPlaying(false))
  }, [])

  useEffect(() => {
    const resumeVideo = () => {
      if (!document.hidden) startVideo()
    }

    startVideo()
    document.addEventListener('visibilitychange', resumeVideo)
    document.addEventListener('pointerdown', resumeVideo, { passive: true })
    document.addEventListener('keydown', resumeVideo)
    window.addEventListener('focus', resumeVideo)
    window.addEventListener('pageshow', resumeVideo)

    return () => {
      document.removeEventListener('visibilitychange', resumeVideo)
      document.removeEventListener('pointerdown', resumeVideo)
      document.removeEventListener('keydown', resumeVideo)
      window.removeEventListener('focus', resumeVideo)
      window.removeEventListener('pageshow', resumeVideo)
    }
  }, [startVideo])

  const handleCanPlay = () => {
    setIsReady(true)
    startVideo()
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-neutral-950"
      data-testid="hero-video-background"
      data-video-state={hasError ? 'fallback' : isPlaying ? 'playing' : isReady ? 'paused' : 'loading'}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-[58%_center]"
        style={{ backgroundImage: `url("${poster}")` }}
      />

      {!hasError && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full scale-[1.01] object-cover transition-opacity duration-700 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition: '58% center' }}
          data-testid="hero-background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          tabIndex={-1}
          onLoadedData={handleCanPlay}
          onCanPlay={handleCanPlay}
          onPlaying={() => {
            setIsReady(true)
            setIsPlaying(true)
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-black/5" />
    </div>
  )
}
