import { state } from '.'
import { getHandScore } from './getHandScore'
import type { Card } from '../types'
import { randInt, shuffle } from '../utils'

const getDiceSum = () => getHandScore().sum

const getDiceValueCount = (v: number) =>
  state.dice.filter((die) => die.roll === v).length

const getSumCard = (value: number, reward = 50) => {
  return {
    label: `sum ≥ ${value}`,
    reward: () => ({
      qualified: getDiceSum() >= value,
      value: reward,
    }),
  } as Card
}

const getExactSumCard = (value: number, reward = 50) => {
  return {
    label: `sum = ${value}`,
    reward: () => ({
      qualified: getDiceSum() == value,
      value: reward,
    }),
  } as Card
}

const getAnySumCard = () => {
  return {
    label: 'sum',
    reward: () => ({
      label: state.dice
        .filter((d) => (d.roll ?? 0) > 1)
        .map((d) => d.roll)
        .join('+'),
      qualified: true,
      value: getDiceSum(),
    }),
  } as Card
}

const getSetCard = (value = 3, reward = 50) =>
  ({
    label: `${value} oak`,
    reward: () => ({
      qualified: getHandScore().sets.some((s) => s.length >= value),
      value: reward,
    }),
  } as Card)

const getFullHouseCard = (reward = 50) =>
  ({
    label: `full house`,
    reward: () => ({
      qualified: (() => {
        const sets = getHandScore().sets
        return sets.length >= 2 && sets[0].length >= 3 && sets[1].length >= 2
      })(),
      value: reward,
    }),
  } as Card)

const getTwoPairCard = (value = 2, count = 2, reward = 50) =>
  ({
    label: `2 pair`,
    reward: () => ({
      qualified:
        getHandScore().sets.filter((s) => s.length >= value).length >= count,
      value: reward,
    }),
  } as Card)

const getRunCard = (value = 3, reward = 50) =>
  ({
    label: `run of ${value}`,
    reward: () => ({
      qualified: (getHandScore().run?.length ?? 0) >= value,
      value: reward,
    }),
  } as Card)

const getCountCard = (value = 1) => {
  return {
    label: `set of ${value}s`,
    reward: () => ({
      label: `${getDiceValueCount(value)} x 10`,
      qualified: getDiceValueCount(value) > 0,
      value: getDiceValueCount(value) * 10,
    }),
  } as Card
}

const getMinMax = (isMin = false) =>
  state.dice
    .map((d) => Number(d.roll === 1 ? 0 : d.roll))
    .reduce(
      (val, roll) => ((isMin ? roll < val : roll > val) ? roll : val),
      isMin ? 9999 : 0,
    )

const getMinMaxCard = (isMin = false) => {
  const mult = isMin ? 4 : 2
  return {
    label: `${isMin ? 'min' : 'max'}`,
    reward: () => {
      const value = getMinMax(isMin)
      return {
        label: `${value} x ${mult}`,
        qualified: true,
        value: value * mult,
      }
    },
  } as Card
}

const getDifferenceCard = () => {
  const mult = 5
  return {
    label: 'diff',
    reward: () => {
      const min = getMinMax(true)
      const max = getMinMax(false)
      return {
        label: `${max} - ${min} x ${mult}`,
        qualified: true,
        value: (max - min) * mult,
      }
    },
  } as Card
}

export const CARDS: Record<string, () => Card> = {
  chance: () => getAnySumCard(),
  min: () => getMinMaxCard(true),
  max: () => getMinMaxCard(false),
  difference: () => getDifferenceCard(),
  setUnderFour: () => getCountCard(randInt(2, 4)),

  tenSum: () => getSumCard(10, 20),
  pair: () => getSetCard(2, 10),
  threeOak: () => getSetCard(3, 50),
  exactSumEasy: () => getExactSumCard(randInt(6, 12), 25),
  threeRun: () => getRunCard(3, 75),

  fourOak: () => getSetCard(4, 150),
  fourRun: () => getRunCard(4, 200),
  twoPair: () => getTwoPairCard(2, 2, 100),

  fiveOak: () => getSetCard(5, 300),
  fiveRun: () => getRunCard(5, 400),
  fullHouse: () => getFullHouseCard(350),

  sixOak: () => getSetCard(6, 1000),
  sixRun: () => getRunCard(6, 1500),
  // threePair: () => getTwoPairCard(2, 3),
  // doubleTriple: () => getTwoPairCard(3, 2),
}

export let pools: Record<string, Array<Card>> = {}
export const resetPools = () => (pools = {})

const draw = (key: number) => {
  if (!pools[key]) pools[key] = []

  const decks: Card[][] = [
    [CARDS.chance(), CARDS.min(), CARDS.max(), CARDS.setUnderFour()],
    [CARDS.tenSum(), CARDS.pair(), CARDS.threeOak()],
    [CARDS.exactSumEasy(), CARDS.exactSumEasy(), CARDS.threeRun()],
    [CARDS.fourOak(), CARDS.fourRun()],
    [CARDS.fiveOak(), CARDS.fiveRun(), CARDS.fullHouse()],
  ]

  if (pools[key].length === 0) pools[key].push(...shuffle(decks[key] || []))
  return pools[key].pop() as Card
}

export const getNewCards = () => {
  if (state.round <= 5) return [draw(1), draw(0), draw(0)]
  if (state.round <= 10) return [draw(1), draw(1), draw(0)]
  if (state.round <= 15) return [draw(2), draw(1), draw(0)]
  if (state.round <= 20) return [draw(3), draw(2), draw(0)]
  return [draw(4), draw(3), draw(0)]
}
