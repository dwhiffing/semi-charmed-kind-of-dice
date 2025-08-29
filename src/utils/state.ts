/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { DICE } from '../constants'
import type { State } from '../types'
import { createState } from './createState'
import { rollDie } from './rollDie'
import { clickSound } from './sounds'
import { zzfx } from './zzfx'

export interface IState extends State {
  dieIndex: number
  currentRoll: number | null
  status: 'ready' | 'rolling' | 'won' | 'lost'
}

export const state = createState({
  dieIndex: 0,
  currentRoll: null,
  status: 'ready',
}) as IState

let rollInterval: number = -1
let rollTimeout: number = -1

export const doRoll = () => {
  if (state.dieIndex >= DICE.length) return
  if (state.status === 'rolling') return

  state.status = 'rolling'
  zzfx(...clickSound)

  rollInterval = window.setInterval(() => {
    state.currentRoll = rollDie(DICE[state.dieIndex])
  }, 60)

  rollTimeout = window.setTimeout(() => {
    clearInterval(rollInterval)
    clearTimeout(rollTimeout)

    state.currentRoll = rollDie(DICE[state.dieIndex])
    state.status = 'ready'
    if (state.currentRoll === 1) state.status = 'lost'
  }, 700)
}

export const doPass = () => {
  if (state.currentRoll == null) return
  state.currentRoll = null
  state.dieIndex = state.dieIndex + 1
  state.status = state.dieIndex >= DICE.length ? 'won' : 'ready'
}
