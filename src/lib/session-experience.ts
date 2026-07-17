// Memória leve da experiência — apenas sessão atual
// Nenhum dado pessoal é armazenado ou enviado ao servidor

const STORAGE_KEY = 'sgs-experience-memory'
const SCHEMA_VERSION = 1

export interface ExperienceMemory {
  schemaVersion: number
  introSeen: boolean
  voxelSequenceSeen: boolean
  lastViewedModule?: string
  soundEnabled: boolean
  completedSequences: string[]
  lastNarrativeStep?: number
}

function defaultMemory(): ExperienceMemory {
  return {
    schemaVersion: SCHEMA_VERSION,
    introSeen: false,
    voxelSequenceSeen: false,
    soundEnabled: false,
    completedSequences: [],
  }
}

export function loadExperienceMemory(): ExperienceMemory {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultMemory()
    const parsed = JSON.parse(raw) as ExperienceMemory
    if (parsed.schemaVersion !== SCHEMA_VERSION) return defaultMemory()
    return parsed
  } catch {
    return defaultMemory()
  }
}

export function saveExperienceMemory(memory: ExperienceMemory): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
  } catch {
    // storage indisponível — seguir sem persistência
  }
}

export function updateMemory(updates: Partial<ExperienceMemory>): ExperienceMemory {
  const current = loadExperienceMemory()
  const updated = { ...current, ...updates }
  saveExperienceMemory(updated)
  return updated
}

export function markSequenceCompleted(sequenceId: string): ExperienceMemory {
  const current = loadExperienceMemory()
  if (current.completedSequences.includes(sequenceId)) return current
  const updated = {
    ...current,
    completedSequences: [...current.completedSequences, sequenceId],
  }
  saveExperienceMemory(updated)
  return updated
}

export function hasSequenceBeenSeen(sequenceId: string): boolean {
  const memory = loadExperienceMemory()
  return memory.completedSequences.includes(sequenceId)
}
