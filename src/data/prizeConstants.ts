/**
 * Prize probability weights configuration
 * Higher values = higher probability of winning
 * These weights are relative to each other
 */
export const DEFAULT_PRIZE_PROBABILITIES = {
  'toast-eraser': 25, // Toast Eraser
  'fruit-sticky-notes': 30, // Fruit Sticky notes
  'stress-balls': 15, // stress balls
  lego: 30, // Lego
} as const

const PROBABILITIES_STORAGE_KEY = 'slime-wheel-probabilities'

export type PrizeProbabilityKey = keyof typeof DEFAULT_PRIZE_PROBABILITIES

export const getPrizeProbabilities = (): Record<PrizeProbabilityKey, number> => {
  const stored = localStorage.getItem(PROBABILITIES_STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_PRIZE_PROBABILITIES, ...parsed }
    } catch {
      // If parsing fails, return defaults
    }
  }
  // Initialize with defaults
  localStorage.setItem(PROBABILITIES_STORAGE_KEY, JSON.stringify(DEFAULT_PRIZE_PROBABILITIES))
  return { ...DEFAULT_PRIZE_PROBABILITIES }
}

export const updatePrizeProbability = (prizeId: PrizeProbabilityKey, newProbability: number) => {
  const probabilities = getPrizeProbabilities()
  probabilities[prizeId] = newProbability
  localStorage.setItem(PROBABILITIES_STORAGE_KEY, JSON.stringify(probabilities))
}

export const updateAllPrizeProbabilities = (newProbabilities: Record<PrizeProbabilityKey, number>) => {
  localStorage.setItem(PROBABILITIES_STORAGE_KEY, JSON.stringify(newProbabilities))
}

export const resetPrizeProbabilities = () => {
  localStorage.setItem(PROBABILITIES_STORAGE_KEY, JSON.stringify(DEFAULT_PRIZE_PROBABILITIES))
}
