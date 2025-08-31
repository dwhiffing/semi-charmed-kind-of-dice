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
  goalsCompleted: 0,
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

export const checkGoal = (card: Card) => {
  const validDice = state.dice.filter(
    (die) => typeof die.roll === 'number' && die.selected,
  )
  const total = validDice.reduce((sum, die) => sum + (die.roll ?? 0), 0)
  const oddCount = validDice.filter((die) => (die.roll ?? 0) % 2 === 1).length
  const evenCount = validDice.filter((die) => (die.roll ?? 0) % 2 === 0).length

  switch (card.goal) {
    case 'equal':
      return validDice.some((d) => (card.value as number[]).includes(d.roll!))
    case 'sum':
      return total === (card.value as number)
    case 'difference':
      return validDice.some((a, i) =>
        validDice.some(
          (b, j) =>
            i !== j &&
            Math.abs((a.roll ?? 0) - (b.roll ?? 0)) === (card.value as number),
        ),
      )
    case 'odd':
      return oddCount >= (card.value as number)
    case 'even':
      return evenCount >= (card.value as number)
    case 'set':
      return isValidSet(validDice, card.value as number)
    case 'run':
      return isValidRun(validDice, card.value as number)
  }
}

export const applyDiceToCard = (index: number) => {
  const card = state.cards[index]
  if (checkGoal(card)) {
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
    state.goalsCompleted++
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
  state.cards = new Array(3).fill('').map((_, i) => {
    const milestone = Math.floor(state.goalsCompleted / 5)
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

const isValidRun = (dice: Die[], value: number) => {
  if (dice.length < value) return false

  const rolls = dice.map((d) => d.roll!).filter((r) => typeof r === 'number')
  const unique = Array.from(new Set(rolls)).sort((a, b) => a - b)

  if (unique.length < value) return false

  for (let i = 0; i <= unique.length - value; i++) {
    let ok = true
    for (let j = 1; j < value; j++) {
      if (unique[i + j] !== unique[i] + j) {
        ok = false
        break
      }
    }
    if (ok) return true
  }

  return false
}

const isValidSet = (dice: Die[], value: number) => {
  if (dice.length < value) return false

  const counts = dice
    .map((d) => d.roll!)
    .filter((r) => typeof r === 'number')
    .reduce<Record<number, number>>((acc, r) => {
      acc[r] = (acc[r] || 0) + 1
      return acc
    }, {})

  return Object.values(counts).some((c) => c >= value)
}
