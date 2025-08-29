/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import type { State } from '../types'
import { createState } from './createState'
import { clickSound } from './sounds'
import { zzfx } from './zzfx'

type Card = {
  variant: 'equal'
  value: number
  reward: 'lives' | 'chips'
  multi: number
}

type Die = {
  sides: number
  selected: boolean
  roll: number | null
  status: 'rolling' | 'ready'
}

export interface IState extends State {
  dice: Die[]
  cards: Card[]
  lives: number
  status: 'ready' | 'rolling' | 'won' | 'lost'
}

export const state = createState({
  dice: [],
  cards: [],
  lives: 9,
  status: 'ready',
}) as IState

let rollInterval: number = -1
let rollTimeout: number = -1

export const doRoll = () => {
  if (state.status === 'rolling') return

  state.status = 'rolling'
  zzfx(...clickSound)

  rollInterval = window.setInterval(() => {
    state.dice = state.dice.map((die) => ({
      ...die,
      roll: die.selected ? die.roll : rollDie(die.sides),
    }))
  }, 60)

  rollTimeout = window.setTimeout(() => {
    clearInterval(rollInterval)
    clearTimeout(rollTimeout)

    state.dice = state.dice.map((die) => ({
      ...die,
      roll: die.selected ? die.roll : rollDie(die.sides),
    }))
    if (state.dice.some((die) => die.roll === 1)) {
      state.lives -= 1
    }

    state.status = state.lives <= 0 ? 'lost' : 'ready'
  }, 700)
}

export const toggleDieSelected = (index: number) => {
  state.dice = state.dice.map((die, i) => {
    if (i === index) return { ...die, selected: !die.selected }
    return die
  })
}

const getDie = (sides: number) =>
  ({
    sides,
    roll: null,
    status: 'ready',
    selected: false,
  } as Die)
export const resetDice = () => {
  state.dice = [getDie(20), getDie(12), getDie(8)]
}

export const resetBoard = () => {
  state.cards = new Array(9).fill('').map(() => ({
    variant: 'equal',
    value: rollDie(20),
    reward: 'chips',
    multi: 1,
  }))
}

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1
