import {
  afterSubmitRollDelay,
  DEV,
  initialDelay,
  perDieOffset,
} from '../constants'
import type { IState, Item } from '../types'
import { createState } from '../utils/createState'
import { clickSound } from '../utils/sounds'
import { zzfx } from '../utils/zzfx'
import { updateDice, doRollDie, getDie, isDieBust, isDieCharm } from './die'

const initialState = {
  dice: [],
  charms: 0,
  points: 0,
  highScore: JSON.parse(localStorage.getItem('jynx-dice-highscore') || '0'),
  pendingCharms: 0,
  pendingPoints: 0,
  round: 1,
  status: 'menu',
}
export let state = createState(initialState) as IState

export const buyItem = (item: Item) => {
  const cost = item.cost()
  if (state.charms < cost) return

  state.charms -= cost
  item.effect()
}

export const doEnterShop = () => {
  if (state.round === 13) {
    state.status = 'menu'
    if (state.points > state.highScore) {
      state.highScore = state.points
      localStorage.setItem('jynx-dice-highscore', state.points.toString())
    }
    return
  }
  state.round++
  state.charms += state.pendingCharms
  state.points += state.pendingPoints
  state.pendingCharms = 0
  state.pendingPoints = 0
  state.dice = state.dice.map((d) => ({ ...d, selected: false, roll: d.sides }))
  state.status = 'shop'
}

export const doRoll = async () => {
  if (state.status === 'rolling') return
  if (!DEV) zzfx(...clickSound)

  state.status = 'rolling'
  updateDice((die) => ({
    ...die,
    roll: die.selected || isDieBust(die) ? die.roll : null,
  }))

  let j = 0
  await Promise.all(
    state.dice
      .filter((die) => !die.selected && !isDieBust(die))
      .map(async (die) => {
        const delay = initialDelay + j++ * perDieOffset
        await doRollDie(die, delay)
      }),
  )

  const scoringDice = state.dice.filter(
    (d) => d.roll !== d.sides && d.roll !== 1,
  )
  state.pendingCharms += state.dice
    .filter(isDieCharm)
    .reduce((acc, d) => acc + (d.sides >= 12 ? 3 : d.sides >= 8 ? 2 : 1), 0)
  state.pendingPoints += scoringDice.reduce((acc, d) => acc + (d.roll ?? 0), 0)

  const isBust = state.dice.every((d) => isDieBust(d) || d.selected)

  if (isBust) {
    state.pendingCharms = 0
    state.pendingPoints = 0
  }
  state.status = 'ready'
}

export const doSubmit = () => {
  state.dice = state.dice.map((d) =>
    d.selected ? { ...d, selected: false, roll: null } : d,
  )
}

export const startGame = () => {
  state.charms = 0
  state.points = 0
  state.round = 1
  state.status = 'ready'
  state.dice = [getDie(4, 0), getDie(4, 1), getDie(4, 2), getDie(4, 3)]

  setTimeout(() => doRoll(), afterSubmitRollDelay)
}
