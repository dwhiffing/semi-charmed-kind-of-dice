/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import type { Card, Die, GoalVariant, IState, Item } from '../types'
import { createState } from './createState'
import { clickSound } from './sounds'
import { zzfx } from './zzfx'

const DEV = true

const initialDelay = DEV ? 250 : 1000
const perDieOffset = DEV ? 50 : 500
export const afterSubmitRollDelay = DEV ? 50 : 500

export const state = createState({
  dice: [],
  cards: [],
  lives: 9,
  chips: 0,
  round: 0,
  status: 'ready',
  lastScore: '',
}) as IState

export const doSubmit = () => {
  state.round++

  const result = getHandScore()

  let multi = getMultiplier()
  const change = result.score * multi

  state.chips += change

  state.lastScore = `${result.type} ${result.label} * ${multi} = ${change}`

  state.dice = state.dice.map((d) => ({
    ...d,
    selected: false,
    roll: null,
  }))

  if (state.round % 5 === 0) {
    state.dice = state.dice.map((d) => ({ ...d, selected: false, roll: null }))
    state.status = 'shop'
  } else {
    state.status = 'ready'
    setTimeout(() => doRoll(), afterSubmitRollDelay)
    resetBoard()
  }
}
export const doExitShop = () => {
  state.status = 'ready'
  setTimeout(() => doRoll(), afterSubmitRollDelay)
  resetBoard()
}

export const doRoll = () => {
  if (state.status === 'rolling') return

  state.status = 'rolling'
  if (!DEV) zzfx(...clickSound)

  updateDice((die) => ({ ...die, roll: die.selected ? die.roll : null }))

  const totalToRoll = state.dice.filter((d) => !d.selected).length
  let completed = 0
  let j = 0

  const app = document.querySelector('.dice-game')!

  state.dice.forEach((die, i) => {
    if (die.selected) return

    const delay = initialDelay + j++ * perDieOffset
    setTimeout(() => {
      app.classList.remove('shake')
      const roll = rollDie(die.sides)
      state.dice = state.dice.map((d, idx) => (idx === i ? { ...d, roll } : d))

      if (roll === 1) {
        app.classList.add('shake')
        setTimeout(() => app.classList.remove('shake'), 400)
        state.lives -= 1
      }

      if (++completed === totalToRoll)
        state.status = state.lives <= 0 ? 'lost' : 'ready'
    }, delay)
  })
}

const updateDice = (update: (die: Die) => Die) =>
  (state.dice = state.dice.map(update))

export const toggleDieSelected = (index: number) => {
  state.dice = state.dice.map((die, i) => {
    if (i === index)
      return {
        ...die,
        selected: die.roll == null ? die.selected : !die.selected,
      }
    return die
  })
}

export const getMultiplier = () => {
  let multi = 1
  state.cards.forEach((card) => {
    if (getIsCardCompleted(card)) multi += 1
  })
  return multi
}
export const getHandScore = () => {
  const sum = state.dice.reduce((sum, die) => sum + (die.roll ?? 0), 0)
  const sets = getSets(state.dice)
  const run = getRun(state.dice)
  // const oddCount = state.dice.filter((die) => (die.roll ?? 0) % 2 === 1).length
  // const evenCount = state.dice.filter((die) => (die.roll ?? 0) % 2 === 0).length

  const sumString = state.dice.map((d) => d.roll).join('+')
  let score = 0
  let type = ''
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
    type = 'chance'
    score = sum
    label = `(${sumString}) = ${score}`
  }

  return { type, score, sets, run, label }
}

export const buyItem = (item: Item) => {
  if (state.chips < item.cost) return

  state.chips -= item.cost
  item.effect()
}

const getDie = (sides: number) =>
  ({
    sides,
    roll: null,
    status: 'ready',
    selected: false,
  } as Die)
export const resetDice = () => {
  state.dice = [getDie(4), getDie(4), getDie(4)]
}

export const resetBoard = () => {
  state.cards = new Array(3).fill('').map((_, i) => {
    const milestone = Math.floor(state.round / 5)
    const difficulty = rollDie(milestone) + i + 1
    let pool = ['odd', 'even', 'equal']
    if (difficulty === 2) {
      pool = ['odd', 'even', 'equal', 'sum', 'difference']
    } else if (difficulty >= 3) {
      pool = ['odd', 'even', 'equal', 'sum', 'difference', 'set', 'run']
    }
    const goal = shuffle(pool)[0] as GoalVariant

    let value: number | number[] = 0
    if (goal === 'equal') {
      const i = rollDie(4) * 3
      value = adjacentRange(i, Math.max(1, 4 - difficulty))
    } else if (goal === 'sum') {
      value = rollDie(difficulty * 3) + 5
    } else if (goal === 'odd' || goal === 'even') {
      value = rollDie(difficulty)
    } else if (goal === 'difference') {
      value = rollDie(difficulty * 2 + 3) // starts at 2-5,
    } else if (goal === 'set') {
      value = rollDie(difficulty - 4) + 2 // appears at difficulty 4, starts at 2 and goes up 1 per difficulty
    } else if (goal === 'run') {
      value = rollDie(difficulty - 3) + 2 // appears at difficulty 4, starts at 3 and goes up 1 per difficulty
    }

    return { goal, value }
  })
}

const shuffle = <T>(array: T[]): T[] => {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
const rollDie = (sides: number) =>
  sides < 1 ? 0 : Math.floor(Math.random() * sides) + 1

const adjacentRange = (value: number, range: number): number[] => {
  const r = Math.max(1, Math.floor(range))

  // number of items on each side of `value` should sum to r-1
  const half = (r - 1) / 2
  let left = Math.floor(half)
  let right = Math.ceil(half)

  // if unbalanced (happens when r is even) randomly flip which side gets the extra
  if (left !== right && Math.random() < 0.5) {
    ;[left, right] = [right, left]
  }

  const out: number[] = []
  for (let i = value - left; i <= value + right; i++) out.push(i)
  return out
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
export const getIsCardCompleted = (_card: Card) =>
  _card.goal === getHandScore().type
