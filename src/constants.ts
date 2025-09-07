import { state } from './state'
import { getHandScore } from './state/getHandScore'
import type { Card } from './types'
import { rollDie } from './utils'

export const DEV = true

export const initialDelay = DEV ? 250 : 150
export const perDieOffset = DEV ? 50 : 500
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

const getDiceSum = () => getHandScore().sum

const getDiceValueCount = (v: number) =>
  state.dice.filter((die) => die.roll === v).length

const getSumCard = (value: number) => {
  return {
    label: `sum ≥ ${value}`,
    goal: { variant: 'sum', value: value, exact: false },
    reward: () => ({
      qualified: getDiceSum() >= value,
      value: value * 2,
    }),
  } as Card
}

const getChanceCard = () => {
  return {
    label: 'chance',
    goal: { variant: 'sum', value: 1, exact: false },
    reward: () => ({
      label: 'SUM',
      qualified: true,
      value: getDiceSum(),
    }),
  } as Card
}

const getSetCard = (value = 3) =>
  ({
    label: `${value} OAK`,
    goal: { variant: 'set', value },
    reward: () => ({
      qualified: getHandScore().sets.some((s) => s.length >= value),
      value: 100,
    }),
  } as Card)

const getRunCard = (value = 3) =>
  ({
    label: `run of ${value}`,
    goal: { variant: 'run', value },
    reward: () => ({
      qualified: (getHandScore().run?.length ?? 0) >= value,
      value: 100,
    }),
  } as Card)

const getCountCard = (value = 1) => {
  return {
    label: `set of ${value}s`,
    goal: { variant: 'set', value, specific: true },
    reward: () => ({
      label: `${getDiceValueCount(value)} x 10`,
      qualified: getDiceValueCount(value) > 0,
      value: getDiceValueCount(value) * 10,
    }),
  } as Card
}

export const CARDS: Record<string, () => Card> = {
  chance: () => getChanceCard(),
  easySum: () => getSumCard(10),
  easySetLength: () => getSetCard(3),
  easySetValue: () => getCountCard(rollDie(3) + 1), // 2, 3, or 4
  easyRunLength: () => getRunCard(3),
}

// { variant: 'set', value: rollDie(4) } - // reward: multi = length of set * 2
// { variant: 'set', value: rollDie(4), length: 3 } - // reward: multi = length of set * 3
// { variant: 'sum', value: rollDie(6) + 6, exact: false } - // reward: multi = length of set * 3
// { variant: 'run', length: 3 } // reward: base = length of run * 100
