import { state } from '.'
import type { Die } from '../types'
import { rollDie } from '../utils'
import {
  blackCatSound,
  fullBustSound,
  charmSound,
  numberSound,
  upgradeSound,
  newDieSound,
} from '../utils/sounds'
import { zzfx } from '../utils/zzfx'

export const isDieCharm = (die: { roll: number | null; sides: number }) => {
  if (!die.roll) return false
  if (die.sides === 4) return die.roll >= 4 // 25%
  if (die.sides === 6) return die.roll >= 6 // 17%
  if (die.sides === 8) return die.roll >= 8 // 13%
  if (die.sides === 10) return die.roll >= 9 // 20%
  if (die.sides === 12) return die.roll >= 11 // 17%
  if (die.sides === 20) return die.roll >= 19 // 10%
}

export const isDieBust = (die: { roll: number | null; sides: number }) => {
  if (!die.roll) return false
  if (die.sides === 4) return die.roll <= 1 // 25%
  if (die.sides === 6) return die.roll <= 1 // 17%
  if (die.sides === 8) return die.roll <= 2 // 25%
  if (die.sides === 10) return die.roll <= 3 // 30%
  if (die.sides === 12) return die.roll <= 4 // 33%
  if (die.sides === 20) return die.roll <= 7 // 35%
  return false
}

export const getDie = (sides: number, index: number) =>
  ({
    sides,
    roll: sides,
    status: 'ready',
    index,
    stickers: [],
  } as Die)

export const onClickDie = (_index: number) => {
  state.selectedDie = _index
}

export const onClickUpgradeDie = (index: number) => {
  const sides = state.dice[index].sides
  if (sides >= 20) return false
  const cost = getDieUpgradeCost(sides)
  if (state.charms < cost) return

  state.charms -= cost
  upgradeDie(index)
}

export const upgradeDie = (index: number) => {
  zzfx(...upgradeSound)
  updateDice((die, i) => {
    if (i === index)
      return {
        ...die,
        sides: die.sides >= 12 ? 20 : die.sides + 2,
        roll: die.sides >= 12 ? 20 : die.sides + 2,
      }
    return die
  })
}

export const updateDice = (update: (die: Die, i: number) => Die) =>
  (state.dice = state.dice.map(update))

export const doRollDie = async (die: Die, delay: number) => {
  if (isDieBust(die)) return

  const app = document.querySelector('.dice-game')!
  return new Promise((resolve) =>
    setTimeout(() => {
      app.classList.remove('shake')
      const roll = rollDie(die.sides, die.index)
      state.dice = state.dice.map((d, idx) =>
        idx === die.index ? { ...d, roll } : d,
      )

      if (isDieCharm(state.dice[die.index])) {
        zzfx(...charmSound)
      } else if (isDieBust(state.dice[die.index])) {
        if (state.dice.every((d) => isDieBust(d))) {
          zzfx(...fullBustSound)
        } else {
          zzfx(...blackCatSound)
        }
        setTimeout(() => app.classList.add('shake'), 10)
        setTimeout(() => app.classList.remove('shake'), 200)
      } else {
        zzfx(...numberSound)
      }
      resolve(undefined)
    }, delay),
  )
}

export const getDieUpgradeCost = (sides: number) => {
  if (sides === 20) return 7
  return sides / 2
}

export const getNewDieCost = () => (state.dice.length - 2) * 2
export const buyNewDie = () => {
  const cost = getNewDieCost()
  if (state.charms < cost) return
  zzfx(...newDieSound)
  state.dice = [...state.dice, getDie(4, state.dice.length)]
  state.charms -= cost
}
