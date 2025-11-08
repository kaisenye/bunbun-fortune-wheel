import { getPrizeProbabilities } from './prizeConstants'

export interface Prize {
  id: string
  name: string
  nameCN: string
  emoji: string
  initialQuantity: number
  chanceWeight: number
  color: string
}

const BASE_PRIZES: Omit<Prize, 'chanceWeight'>[] = [
  {
    id: 'toast-eraser',
    name: 'Toast Eraser',
    nameCN: '吐司橡皮擦',
    emoji: '🍞',
    initialQuantity: 4,
    color: 'hsl(40, 90%, 70%)',
  },
  {
    id: 'fruit-sticky-notes',
    name: 'Fruit Sticky Notes',
    nameCN: '水果便签',
    emoji: '🍊',
    initialQuantity: 18,
    color: 'hsl(30, 100%, 60%)',
  },
  {
    id: 'stress-balls',
    name: 'Stress Balls',
    nameCN: '解压球',
    emoji: '🎾',
    initialQuantity: 2,
    color: 'hsl(150, 70%, 60%)',
  },
  {
    id: 'lego',
    name: 'Lego',
    nameCN: '乐高',
    emoji: '🧱',
    initialQuantity: 10,
    color: 'hsl(0, 80%, 60%)',
  },
]

export const getPrizes = (): Prize[] => {
  const probabilities = getPrizeProbabilities()
  return BASE_PRIZES.map((prize) => ({
    ...prize,
    chanceWeight: probabilities[prize.id as keyof typeof probabilities] || 25,
  }))
}

// Export PRIZES as a computed value for backward compatibility
export const PRIZES = getPrizes()

const STORAGE_KEY = 'slime-wheel-prizes'

export const getPrizeQuantities = (): Record<string, number> => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  const initial: Record<string, number> = {}
  BASE_PRIZES.forEach((prize) => {
    initial[prize.id] = prize.initialQuantity
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

export const updatePrizeQuantity = (prizeId: string, newQuantity: number) => {
  const quantities = getPrizeQuantities()
  quantities[prizeId] = newQuantity
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities))
}

export const resetPrizeQuantities = () => {
  const initial: Record<string, number> = {}
  BASE_PRIZES.forEach((prize) => {
    initial[prize.id] = prize.initialQuantity
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
}

export const getBasePrizes = () => BASE_PRIZES
