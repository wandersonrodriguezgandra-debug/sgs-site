const STORAGE_KEY = 'sgs:experience'

interface ExperienceMemory {
  introSeen: boolean
  introSkipped: boolean
  audioEnabled: boolean
  audioVolume: number
  graphicsQualityOverride?: string
  visitedAt: string | null
  visitCount: number
}

function load(): ExperienceMemory {
  if (typeof window === 'undefined') {
    return { introSeen: false, introSkipped: false, audioEnabled: false, audioVolume: 0.3, visitedAt: null, visitCount: 0 }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ExperienceMemory
  } catch {}
  return { introSeen: false, introSkipped: false, audioEnabled: false, audioVolume: 0.3, visitedAt: null, visitCount: 0 }
}

function save(memory: ExperienceMemory): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
  } catch {}
}

export function getExperienceMemory(): ExperienceMemory {
  return load()
}

export function updateExperienceMemory(updates: Partial<ExperienceMemory>): ExperienceMemory {
  const memory = load()
  Object.assign(memory, updates)
  save(memory)
  return memory
}

export function isFirstVisit(): boolean {
  const memory = load()
  return !memory.visitedAt
}

export function recordVisit(): void {
  const memory = load()
  memory.visitedAt = new Date().toISOString()
  memory.visitCount = (memory.visitCount || 0) + 1
  save(memory)
}

export function hasSeenIntro(): boolean {
  return load().introSeen
}

export function markIntroSeen(): void {
  updateExperienceMemory({ introSeen: true })
}

export function markIntroSkipped(): void {
  updateExperienceMemory({ introSeen: true, introSkipped: true })
}
