/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { state } from '.'
import { CARDS } from '../constants'

import type { Card } from '../types'
import { arraysHaveSameValues, shuffle } from '../utils'
import { getHandScore } from './getHandScore'

export const getNewCards = () => [
  CARDS.easySum(),
  CARDS.easySum(),
  CARDS.easySum(),
  CARDS.easySetLength(),
  CARDS.easySetValue(),
  CARDS.easyRunLength(),
]

export const getCardFromCardPool = () => {
  if (state.cardPool.length === 0) {
    state.cardPool = shuffle(getNewCards())
  }
  const nextCard = state.cardPool[0]
  state.cardPool = state.cardPool.slice(1)
  return nextCard
}

export const resetBoard = () => {
  state.cards = new Array(3).fill('').map(getCardFromCardPool)
}

export const getIsCardCompleted = (_card: Card) =>
  _card.goals.every((goal) => {
    const handScore = getHandScore()
    if (handScore.type !== goal.variant) return false
    if (goal.variant === 'set') {
      const lengthEqual =
        typeof goal.length !== 'number' ||
        handScore.sets.some((h) => h.length >= (goal.length ?? 0))
      const valueEqual =
        typeof goal.value !== 'number' ||
        handScore.sets.some((h) => h.value >= (goal.value ?? 0))
      return lengthEqual && valueEqual
    } else if (goal.variant === 'run') {
      const lengthEqual =
        typeof goal.length !== 'number' ||
        (handScore.run?.length ?? 0) >= (goal.length ?? 0)
      const valueEqual =
        typeof goal.value !== 'number' ||
        arraysHaveSameValues(handScore.run?.values ?? [], goal.value ?? [])
      return lengthEqual && valueEqual
    } else {
      if (goal.exact) return goal.value === handScore.sum
      return handScore.sum >= goal.value
    }
  })
