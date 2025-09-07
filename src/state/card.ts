/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { state } from '.'
import { CARDS } from '../constants'

import type { Card } from '../types'
import { shuffle } from '../utils'
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

export const getIsCardCompleted = (_card: Card) => {
  const goal = _card.goal
  const handScore = getHandScore()
  if (handScore.type !== goal.variant) return false
  if (goal.variant === 'set') {
    const lengthEqual =
      goal.specific || handScore.sets.some((h) => h.length >= goal.value)
    const valueEqual =
      !goal.specific || handScore.sets.some((h) => h.value === goal.value)

    return lengthEqual && valueEqual
  } else if (goal.variant === 'run') {
    const lengthEqual =
      typeof goal.value !== 'number' ||
      (handScore.run?.length ?? 0) >= (goal.value ?? 0)

    return lengthEqual
  } else {
    if (goal.exact) return goal.value === handScore.sum
    return handScore.sum >= goal.value
  }
}
