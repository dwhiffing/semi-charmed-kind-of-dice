import type { Card } from './types'
import { rollDie } from './utils'

export const DEV = true

export const initialDelay = DEV ? 250 : 150
export const perDieOffset = DEV ? 50 : 500
export const ROUNDS_BEFORE_SHOP = 5
export const afterSubmitRollDelay = DEV ? 50 : 500

export const SVGS = [
  `d${20}`,
  `d${12}`,
  `d${10}`,
  `d${8}`,
  `d${6}`,
  `d${4}`,
  'cat',
]
export const DICE = [20, 12, 10, 8, 6, 4]
export const colors: Record<number, string> = {
  20: 'rgba(56, 126, 255, 1)',
  12: '#7fdbca',
  10: '#ff7f50',
  8: '#f1c232',
  6: '#6f42c1',
  4: '#28a745',
}

export const CARDS: Record<string, () => Card> = {
  easySum: () => {
    const value = rollDie(6) + 6
    return {
      goal: { variant: 'sum', value: value, exact: false },
      reward: { scoreBase: value * 2 },
    }
  },
  easySetLength: () => ({
    goal: { variant: 'set', value: 3 },
    reward: { scoreBase: 100 },
  }),
  easySetValue: () => ({
    goal: { variant: 'set', value: rollDie(4), specific: true },
    reward: { lengthBase: 10 },
  }),
  easyRunLength: () => ({
    goal: { variant: 'run', value: 3 },
    reward: { scoreBase: 100 },
  }),
}

// { variant: 'set', value: rollDie(4) } - // reward: multi = length of set * 2
// { variant: 'set', value: rollDie(4), length: 3 } - // reward: multi = length of set * 3
// { variant: 'sum', value: rollDie(6) + 6, exact: false } - // reward: multi = length of set * 3
// { variant: 'run', length: 3 } // reward: base = length of run * 100
