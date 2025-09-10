import { state } from '.'
import { perDieOffset } from '../constants'
import type { Die } from '../types'
import { rollDie } from '../utils'

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

export const upgradeDie = (index: number) =>
  updateDice((die, i) => {
    if (i === index)
      return {
        ...die,
        sides: die.sides >= 12 ? 20 : die.sides + 2,
        roll: die.sides >= 12 ? 20 : die.sides + 2,
      }
    return die
  })

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

      if (isDieBust(state.dice[die.index])) {
        app.classList.add('shake')
        setTimeout(() => app.classList.remove('shake'), perDieOffset)
      }
      resolve(undefined)
    }, delay),
  )
}

export const getDieUpgradeCost = (sides: number) => {
  if (sides === 20) return 7
  return sides / 2
}
