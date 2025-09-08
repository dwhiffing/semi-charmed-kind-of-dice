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
import { getNewCards, resetPools } from './card'
import { updateDice, doRollDie, getDie } from './die'

const initialState = {
  dice: [],
  cards: [],
  passives: [],
  lives: 0,
  chips: 0,
  round: 1,
  pendingSticker: null,
  status: 'menu',
}
export let state = createState(initialState) as IState

export const buyItem = (item: Item) => {
  const cost = item.cost()
  if (state.chips < cost) return

  state.chips -= cost
  item.effect()
}

export const doEnterShop = () => {
  state.round++
  state.chips += state.cards.reduce((sum, c) => sum + (c.score ?? 0), 0)
  state.cards = getNewCards()
  state.dice = state.dice.map((d) => ({ ...d, selected: false, roll: d.sides }))
  state.status = 'shop'
}

export const doNextRound = () => {
  state.status = 'ready'
  setTimeout(() => doRoll(), afterSubmitRollDelay)
}

export const doRoll = async () => {
  if (state.status.match(/passive|sticker/)) {
    state.status = 'shop'
    return
  }

  if (state.cards.every((c) => c.score !== undefined)) {
    return doEnterShop()
  }

  if (state.status === 'shop') {
    doNextRound()
  }

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

  if (state.lives <= 0) {
    state.status = 'lost'
  } else {
    state.status = 'ready'
  }
}

export const doSubmit = (index: number) => {
  if (state.cards[index].score !== undefined) return

  state.cards = state.cards.map((c, i) =>
    i === index
      ? { ...c, score: c.reward().qualified ? c.reward().value : 0 }
      : c,
  )

  if (state.cards.some((c) => c.score === undefined)) {
    // reset dice
    state.dice = state.dice.map((d) => ({ ...d, selected: false, roll: null }))
    doNextRound()
  }
}

export const startGame = () => {
  state.passives = []
  state.lives = 9
  state.chips = 0
  state.round = 1
  state.pendingSticker = null
  state.status = 'ready'
  state.dice = [getDie(4, 0), getDie(4, 1), getDie(4, 2)]
  state.cards = getNewCards()
  resetPools()

  setTimeout(() => doRoll(), afterSubmitRollDelay)
}
