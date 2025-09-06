import { state } from '.'
import type { Die, GoalVariant } from '../types'

export const getHandScore = () => {
  const sum = state.dice.reduce((sum, die) => sum + (die.roll ?? 0), 0)
  const sets = getSets(state.dice)
  const run = getRun(state.dice)
  // const oddCount = state.dice.filter((die) => (die.roll ?? 0) % 2 === 1).length
  // const evenCount = state.dice.filter((die) => (die.roll ?? 0) % 2 === 0).length

  const sumString = state.dice.map((d) => d.roll).join('+')
  let score = 0
  let type: GoalVariant = 'sum'
  let label = ''
  if (sets.length > 0) {
    type = 'set'
    score = sum + Math.pow(sets[0].length, 3)
    label = `(${sumString}=${sum}) + ${sets[0].length - 1}^3 = ${score}`
  } else if (run) {
    type = 'run'
    score = sum + Math.pow(run.length, 3)
    label = `(${sumString}+${run.length}^3=${score})`
  } else {
    type = 'sum'
    score = sum
    label = `(${sumString}) = ${score}`
  }

  return { type, sum, score, sets, run, label }
}
const getRun = (dice: Die[]) => {
  const rolls = dice.map((d) => d.roll!).filter((r) => typeof r === 'number')
  const unique = Array.from(new Set(rolls)).sort((a, b) => a - b)
  let longestRun: number[] = []
  let currentRun: number[] = []

  for (let i = 0; i < unique.length; i++) {
    if (i === 0 || unique[i] === unique[i - 1] + 1) {
      currentRun.push(unique[i])
    } else {
      if (currentRun.length > longestRun.length) longestRun = currentRun.slice()
      currentRun = [unique[i]]
    }
  }
  if (currentRun.length > longestRun.length) longestRun = currentRun.slice()

  if (longestRun.length > 2) {
    // collect dice that match the run values
    const runDice = dice.filter(
      (d) => typeof d.roll === 'number' && longestRun.includes(d.roll!),
    )
    return { values: longestRun, dice: runDice, length: longestRun.length }
  }
  return null
}

const getSets = (dice: Die[]) => {
  const groups: Record<number, Die[]> = {}
  dice.forEach((d) => {
    if (typeof d.roll === 'number') {
      if (!groups[d.roll]) groups[d.roll] = []
      groups[d.roll].push(d)
    }
  })
  const sets = Object.entries(groups)
    .map(([value, diceArr]) => ({
      value: Number(value),
      dice: diceArr,
      length: diceArr.length,
    }))
    .filter((set) => set.length > 2)
    .sort((a, b) => b.length - a.length)
  return sets
}
