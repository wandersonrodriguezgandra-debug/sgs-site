'use client'

import { useEffect, useMemo, useState } from 'react'

type TypewriterLines = readonly [string, ...string[]]

interface TypewriterTextProps {
  lines: TypewriterLines
  className?: string
  lineClassNames?: readonly string[]
  typingDelay?: number
  deletingDelay?: number
  pauseDelay?: number
}

export default function TypewriterText({
  lines,
  className = '',
  lineClassNames = [],
  typingDelay = 80,
  deletingDelay = 40,
  pauseDelay = 1250,
}: TypewriterTextProps) {
  const lineCharacters = useMemo(
    () => lines.map((line) => Array.from(line)),
    [lines],
  )
  const totalCharacters = lineCharacters.reduce(
    (total, characters) => total + characters.length,
    0,
  )
  const [visibleCount, setVisibleCount] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const restartCycle = () => {
      setVisibleCount(0)
      setIsDeleting(false)
    }

    window.addEventListener('sgs:intro-complete', restartCycle)
    return () => window.removeEventListener('sgs:intro-complete', restartCycle)
  }, [])

  useEffect(() => {
    let delay = isDeleting ? deletingDelay : typingDelay
    let nextStep: () => void

    if (!isDeleting && visibleCount >= totalCharacters) {
      delay = pauseDelay
      nextStep = () => setIsDeleting(true)
    } else if (isDeleting && visibleCount <= 0) {
      delay = 320
      nextStep = () => setIsDeleting(false)
    } else {
      nextStep = () => {
        setVisibleCount((count) => count + (isDeleting ? -1 : 1))
      }
    }

    const timer = window.setTimeout(nextStep, delay)
    return () => window.clearTimeout(timer)
  }, [
    deletingDelay,
    isDeleting,
    pauseDelay,
    totalCharacters,
    typingDelay,
    visibleCount,
  ])

  let remainingCharacters = visibleCount
  const visibleLines = lineCharacters.map((characters) => {
    const visibleLength = Math.max(0, Math.min(characters.length, remainingCharacters))
    remainingCharacters -= visibleLength
    return characters.slice(0, visibleLength).join('')
  })

  let cursorLine = lineCharacters.length - 1
  let cursorPosition = visibleCount
  for (let index = 0; index < lineCharacters.length; index += 1) {
    if (cursorPosition <= lineCharacters[index].length) {
      cursorLine = index
      break
    }
    cursorPosition -= lineCharacters[index].length
  }

  return (
    <h1
      className={className}
      aria-label={lines.join(' ')}
      data-testid="hero-typewriter"
      data-typewriter-state={isDeleting ? 'deleting' : 'typing'}
      data-visible-text={visibleLines.join('\n')}
    >
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={`grid min-h-[1.08em] ${lineClassNames[index] ?? ''}`}
        >
          <span className="invisible col-start-1 row-start-1" aria-hidden="true">
            {line}
          </span>
          <span className="col-start-1 row-start-1">
            {visibleLines[index]}
            {cursorLine === index && (
              <span
                className="ml-[0.08em] inline-block h-[0.88em] w-[0.085em] translate-y-[0.08em] animate-pulse bg-sgs-cyan shadow-[0_0_18px_rgba(6,182,212,0.9)]"
                aria-hidden="true"
              />
            )}
          </span>
        </span>
      ))}
    </h1>
  )
}
