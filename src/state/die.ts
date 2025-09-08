import { buyItem, state } from '.'
import { perDieOffset } from '../constants'
import type { Die, Sticker } from '../types'
import { rollDie } from '../utils'

export const getDie = (sides: number, index: number) =>
  ({
    sides,
    roll: null,
    status: 'ready',
    selected: false,
    index,
    stickers: [],
  } as Die)

export const toggleDieSide = (index: number) =>
  updateDice((die: Die, i) => {
    if (i === index)
      return {
        ...die,
        roll: die.roll === die.sides ? 2 : (die.roll ?? 0) + 1,
      }
    return die
  })

export const toggleDieSelected = (index: number) =>
  updateDice((die, i) => {
    if (i === index && die.roll) return { ...die, selected: !die.selected }
    return die
  })

export const applySticker = (index: number, sticker: Sticker) =>
  updateDice((die, i) => {
    if (i === index)
      return {
        ...die,
        stickers: [...die.stickers, { ...sticker, rollValue: die.roll ?? 1 }],
      }
    return die
  })

export const onClickDie = (index: number) => {
  if (state.status.includes('shop-sticker-apply')) {
    toggleDieSide(index)
  } else if (state.status === 'ready') {
    toggleDieSelected(index)
  }
}

export const onClickUpgradeDie = (index: number) =>
  state.dice[index].sides < 20 &&
  buyItem({
    label: '',
    cost: () => getDieUpgradeCost(index),
    effect: () => {
      if (state.status === 'shop-sticker-apply') {
        applySticker(index, state.pendingSticker!)
      } else {
        upgradeDie(index)
      }
      state.status = 'shop'
    },
  })
export const upgradeDie = (index: number) =>
  updateDice((die, i) => {
    if (i === index)
      return {
        ...die,
        sides: die.sides >= 12 ? 20 : die.sides + 2,
      }
    return die
  })

export const updateDice = (update: (die: Die, i: number) => Die) =>
  (state.dice = state.dice.map(update))

export const doRollDie = async (die: Die, delay: number) => {
  if (die.selected) return

  const app = document.querySelector('.dice-game')!
  return new Promise((resolve) =>
    setTimeout(() => {
      app.classList.remove('shake')
      const roll = rollDie(die.sides, die.index)
      state.dice = state.dice.map((d, idx) =>
        idx === die.index ? { ...d, roll } : d,
      )

      if (roll === 1) {
        app.classList.add('shake')
        setTimeout(() => app.classList.remove('shake'), perDieOffset)
        state.lives -= 1
      }
      resolve(undefined)
    }, delay),
  )
}

export const getDieUpgradeCost = (index: number) => 10 * state.dice[index].sides
