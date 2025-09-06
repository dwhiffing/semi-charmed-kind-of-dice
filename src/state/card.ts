/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { state } from '.'
import type { Card, Goal, GoalVariant } from '../types'
import { arraysHaveSameValues, rollDie, shuffle } from '../utils'
import { getHandScore } from './getHandScore'

const getGoal = (variant: GoalVariant) => {
  let rest = {}
  if (variant === 'set') {
    const subVariant = rollDie(3)
    const length = rollDie(2) + 2
    const value = rollDie(4)
    if (subVariant === 1) {
      rest = { length }
    } else if (subVariant === 2) {
      rest = { value }
    } else {
      rest = { length, value }
    }
  } else if (variant === 'run') {
    const subVariant = rollDie(2)
    if (subVariant === 1) {
      rest = { length: rollDie(2) + 2 }
    } else {
      rest = { value: [1, 2, 3] }
    }
  } else {
    rest = { value: rollDie(6) + 6, exact: rollDie(2) === 1 }
  }

  return { variant, ...rest } as Goal
}
const getCard = (variant: GoalVariant) => {
  // const milestone = Math.floor(state.round / ROUNDS_BEFORE_SHOP)
  // const difficulty = rollDie(milestone) + 1

  const goal: Goal = getGoal(variant)

  return { goals: [goal] } as Card
}

export const getCardFromCardPool = () => {
  if (state.cardPool.length === 0) {
    state.cardPool = shuffle([getCard('set'), getCard('run'), getCard('sum')])
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
