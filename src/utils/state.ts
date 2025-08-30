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

let rollInterval: number = -1
let rollTimeout: number = -1

export const doRoll = () => {
  if (state.status === 'rolling') return

  state.status = 'rolling'
  zzfx(...clickSound)

  rollInterval = window.setInterval(() => {
    updateDice((die) => ({
      ...die,
      roll: die.selected ? die.roll : null,
    }))
  }, 60)

  rollTimeout = window.setTimeout(() => {
    clearInterval(rollInterval)
    clearTimeout(rollTimeout)

    updateDice((die) => ({
      ...die,
      roll: die.selected ? die.roll : rollDie(die.sides),
    }))
    if (state.dice.some((die) => die.roll === 1)) {
      state.lives -= 1
    }

    state.status = state.lives <= 0 ? 'lost' : 'ready'
  }, 700)
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
      return dice.length === 1 && total === card.value
    case 'sum':
      return total === card.value
    case 'minmax':
      return (
        dice.length === 2 &&
        Math.abs(dice[0].roll! - dice[1].roll!) >= card.value
      )
    case 'odd':
      return oddCount >= card.value
    case 'even':
      return evenCount >= card.value
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
  state.cards = new Array(9).fill('').map(() => {
    const goal = shuffle([
      'equal',
      'sum',
      'odd',
      'even',
      'minmax',
    ])[0] as GoalVariant
    const difficulty = 1

    // TODO: value should be adjusted based on difficulty
    let value = 0
    if (goal === 'equal') {
      value = rollDie(10)
    } else if (goal === 'sum') {
      value = rollDie(10) + 5
    } else if (goal === 'odd' || goal === 'even') {
      value = rollDie(3)
    } else if (goal === 'minmax') {
      value = rollDie(5)
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
const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1
