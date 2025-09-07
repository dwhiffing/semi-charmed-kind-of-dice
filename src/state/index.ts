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
  passives: [],
  lives: 9,
  chips: 10000,
  round: 4,
  scoreBase: 0,
  scoreMulti: 1,
  pendingSticker: null,
  scoreInfo: '',
  status: 'ready',
}) as IState

export const buyItem = (item: Item) => {
  const cost = item.cost()
  if (state.chips < cost) return

  state.chips -= cost
  item.effect()
}

export const doEnterShop = () => {
  state.chips += state.scoreBase * state.scoreMulti
  state.scoreBase = 0
  state.scoreMulti = 1
  state.scoreInfo = ''

  state.dice = state.dice.map((d) => ({ ...d, selected: false }))
  state.status = 'shop'
}

export const doNextRound = () => {
  state.status = 'ready'
  setTimeout(() => doRoll(), afterSubmitRollDelay)
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

export const doRollCards = async () => {
  state.cards = state.cards.map(getCardFromCardPool)
}

export const doSubmit = () => {
  // Calculate score
  const handScore = getHandScore()
  let prevScore = state.scoreBase
  // state.scoreBase += handScore.score
  // state.scoreMulti += handScore.multi

  state.cards.forEach((card) => {
    if (getIsCardCompleted(card)) {
      state.scoreBase += card.reward.scoreBase ?? 0
      // state.scoreMulti += card.reward.scoreMulti ?? 0

      const setLength = handScore.sets[0]?.length ?? 0
      const runLength = handScore.run?.length ?? 0
      const length = setLength ?? runLength

      state.scoreBase += (card.reward.lengthBase ?? 0) * length
      // state.scoreMulti += (card.reward.lengthMulti ?? 0) * length
    }
  })

  state.scoreInfo = `${handScore.label}. ${prevScore} + ${handScore.score} = ${
    state.scoreBase
  }.  ${state.scoreBase} * ${state.scoreMulti} = ${
    state.scoreBase * state.scoreMulti
  }`

  // reset completed cards
  state.cards = state.cards.map((card) =>
    getIsCardCompleted(card) ? getCardFromCardPool() : card,
  )

  // next round
  if (++state.round % ROUNDS_BEFORE_SHOP === 0) {
    doEnterShop()
  } else {
    // reset dice
    state.dice = state.dice.map((d) => ({ ...d, selected: false, roll: null }))
    doNextRound()
  }
}
