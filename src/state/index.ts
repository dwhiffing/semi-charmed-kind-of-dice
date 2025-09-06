/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import {
  afterSubmitRollDelay,
  ROUNDS_BEFORE_SHOP,
  DEV,
  initialDelay,
  perDieOffset,
} from '../constants'
import type { IState, Item } from '../types'
import { createState } from '../utils/createState'
import { clickSound } from '../utils/sounds'
import { zzfx } from '../utils/zzfx'
import { getCardFromCardPool, getIsCardCompleted } from './card'
import { getDie, updateDice, doRollDie } from './die'
import { getHandScore } from './getHandScore'

export const state = createState({
  dice: [getDie(4, 0), getDie(4, 1), getDie(4, 2)],
  cards: [],
  cardPool: [],
  lives: 9,
  chips: 0,
  round: 0,
  status: 'ready',
  lastScore: '',
}) as IState

export const buyItem = (item: Item) => {
  if (state.chips < item.cost) return

  state.chips -= item.cost
  item.effect()
}

export const doEnterShop = () => {
  state.dice = state.dice.map((d) => ({ ...d, selected: false, roll: null }))
  state.status = 'shop'
}

export const doNextRound = () => {
  state.status = 'ready'
  setTimeout(() => doRoll(), afterSubmitRollDelay)
}

export const doSubmit = () => {
  const handScore = getHandScore()
  const multi = getMultiplier()
  const change = handScore.score * multi

  state.chips += change
  state.lastScore = `${handScore.type} ${handScore.label} * ${multi} = ${change}`
  state.cards = state.cards.map((card) =>
    getIsCardCompleted(card) ? getCardFromCardPool() : card,
  )

  state.dice = state.dice.map((d) => ({ ...d, selected: false, roll: null }))
  if (++state.round % ROUNDS_BEFORE_SHOP === 0) {
    doEnterShop()
  } else {
    doNextRound()
  }
}

export const doRoll = async () => {
  if (state.status === 'rolling') return
  if (!DEV) zzfx(...clickSound)

  state.status = 'rolling'
  updateDice((die) => ({ ...die, roll: die.selected ? die.roll : null }))

  let j = 0
  await Promise.all(
    state.dice.map(async (die) => {
      const delay = initialDelay + j++ * perDieOffset
      await doRollDie(die, delay)
    }),
  )

  state.status = state.lives <= 0 ? 'lost' : 'ready'
}

const getMultiplier = () => {
  let multi = 1
  state.cards.forEach((card) => {
    if (getIsCardCompleted(card)) multi += 1
  })
  return multi
}
