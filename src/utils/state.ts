/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import type { Card, Die, GoalVariant, IState } from '../types'
import { createState } from './createState'
import { clickSound } from './sounds'
import { zzfx } from './zzfx'

export const state = createState({
  dice: [],
  cards: [],
  lives: 9,
  chips: 0,
  status: 'ready',
}) as IState

export const doRoll = () => {
  if (state.status === 'rolling') return

  state.status = 'rolling'
  zzfx(...clickSound)

  updateDice((die) => ({ ...die, roll: die.selected ? die.roll : null }))

  const initialDelay = 1000
  const perDieOffset = 500
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
        selected:
          die.roll == null || die.roll === 1 ? die.selected : !die.selected,
      }
    return die
  })
}

const checkGoal = (card: Card, dice: Die[]) => {
  const total = dice.reduce((sum, die) => sum + (die.roll ?? 0), 0)
  const oddCount = dice.filter((die) => (die.roll ?? 0) % 2 === 1).length
  const evenCount = dice.length - oddCount

  switch (card.goal) {
    case 'equal':
      return (
        dice.length === 1 && (card.value as number[]).includes(dice[0].roll!)
      )
    case 'sum':
      return total === (card.value as number)
    case 'difference':
      return (
        dice.length === 2 &&
        Math.abs(dice[0].roll! - dice[1].roll!) >= (card.value as number)
      )
    case 'odd':
      return oddCount >= (card.value as number)
    case 'even':
      return evenCount >= (card.value as number)
    case 'set':
      return (
        dice.length >= (card.value as number) &&
        dice.every((d) => d.roll === dice[0].roll)
      )
    case 'run':
      return (
        (dice.length >= (card.value as number) &&
          dice
            .map((d) => d.roll!)
            .sort((a, b) => a - b)
            .every((val, i, arr) =>
              i === 0 ? true : val === arr[i - 1] + 1,
            )) ||
        dice
          .map((d) => d.roll!)
          .sort((a, b) => b - a)
          .every((val, i, arr) => (i === 0 ? true : val === arr[i - 1] - 1))
      )
  }
}

export const applyDiceToCard = (index: number) => {
  const card = state.cards[index]
  const selectedDice = state.dice.filter((die) => die.selected)
  if (checkGoal(card, selectedDice)) {
    state.dice = state.dice.map((d) => ({
      ...d,
      selected: false,
      roll: d.selected ? null : d.roll,
    }))
    if (card.reward === 'chips') {
      state.chips += card.multi
    } else {
      state.lives += card.multi
    }
    resetBoard()
  }
}

const getDie = (sides: number) =>
  ({
    sides,
    roll: null,
    status: 'ready',
    selected: false,
  } as Die)
export const resetDice = () => {
  state.dice = [
    getDie(20),
    getDie(12),
    getDie(10),
    // getDie(8),
    // getDie(6),
    // getDie(4),
  ]
}

export const resetBoard = () => {
  state.cards = new Array(3).fill('').map(() => {
    // const difficulty = 1
    const difficulty = rollDie(4)
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

    const reward = rollDie(2) === 1 ? 'chips' : 'lives'
    return { goal, value, reward, multi: difficulty }
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
