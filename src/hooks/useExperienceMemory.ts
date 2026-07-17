'use client'

import { useState, useCallback } from 'react'
import {
  loadExperienceMemory,
  saveExperienceMemory,
  updateMemory,
  markSequenceCompleted,
  type ExperienceMemory,
} from '@/lib/session-experience'

export function useExperienceMemory() {
  const [memory, setMemory] = useState<ExperienceMemory>(loadExperienceMemory)

  const update = useCallback((updates: Partial<ExperienceMemory>) => {
    const updated = updateMemory(updates)
    setMemory(updated)
  }, [])

  const markCompleted = useCallback((sequenceId: string) => {
    const updated = markSequenceCompleted(sequenceId)
    setMemory(updated)
  }, [])

  const resetSession = useCallback(() => {
    const fresh = { schemaVersion: 1, introSeen: false, voxelSequenceSeen: false, soundEnabled: false, completedSequences: [] }
    saveExperienceMemory(fresh)
    setMemory(fresh)
  }, [])

  return { memory, update, markCompleted, resetSession }
}
