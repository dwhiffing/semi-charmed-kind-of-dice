/** biome-ignore-all lint/style/noNonNullAssertion: don't care */
import { state } from '.'
import { perDieOffset } from '../constants'
import type { Die } from '../types'
import { rollDie } from '../utils'

export const getDie = (sides: number, index: number) =>
  ({ sides, roll: null, status: 'ready', selected: false, index } as Die)

export const toggleDieSelected = (index: number) => {
  state.dice = state.dice.map((die, i) => {
    if (i === index)
      return {
        ...die,
        selected: die.roll == null ? die.selected : !die.selected,
      }
    return die
  })
}

export const updateDice = (update: (die: Die) => Die) =>
  (state.dice = state.dice.map(update))

export const doRollDie = async (die: Die, delay: number) => {
  if (die.selected) return

  const app = document.querySelector('.dice-game')!
  return new Promise((resolve) =>
    setTimeout(() => {
      app.classList.remove('shake')
      const roll = rollDie(die.sides)
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
