import { state } from '.'
import type { Die } from '../types'
import {
  blackCatSound,
  fullBustSound,
  charmSound,
  getNumberSound,
  upgradeSound,
  newDieSound,
} from '../utils/sounds'
import { zzfx } from '../utils/zzfx'
import { particleSystem } from '../utils/particles'
import { colors } from '../constants'

export const isDieCharm = (die: { roll: number | null; sides: number }) => {
  if (!die.roll) return false
  if (die.sides === 4) return die.roll >= 4 // 25%
  if (die.sides === 6) return die.roll >= 6 // 17%
  if (die.sides === 8) return die.roll >= 7 // 25%
  if (die.sides === 10) return die.roll >= 9 // 20%
  if (die.sides === 12) return die.roll >= 12 // 8%
  if (die.sides === 20) return false // 0%
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
  ({ sides, roll: sides, index } as Die)

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
    const sides = die.sides >= 12 ? 20 : die.sides + 2
    if (i === index) return { ...die, sides, roll: sides }
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
      const roll = rollDie(die.sides)
      state.dice = state.dice.map((d, idx) =>
        idx === die.index ? { ...d, roll } : d,
      )

      const d = { sides: state.dice[die.index].sides, roll }
      const isCharm = isDieCharm(d)
      const isBust = isDieBust(d)
      const charms = isCharm ? (d.sides >= 10 ? 3 : d.sides >= 6 ? 2 : 1) : 0
      const points = isBust || isCharm ? 0 : roll ?? 0

      state.pendingPoints += points

      const dieElement = document.querySelectorAll('.die')[
        die.index
      ] as HTMLElement
      const rect = dieElement.getBoundingClientRect()
      const x = rect.left + rect.width / 2 + (isBust ? 20 : 0)
      const y = rect.top + rect.height / 2 + (isBust ? 20 : 0)
      const color = isBust ? 'black' : isCharm ? '#f1da41' : colors[d.sides]
      const count = isCharm || isBust ? 10 : 6
      const svg = isCharm ? '/charm.svg' : undefined
      particleSystem.createConfetti(x, y, color, count, svg)

      if (isCharm) {
        for (let i = 0; i < charms; i++) {
          setTimeout(() => {
            zzfx(...charmSound)
            state.pendingCharms++
            particleSystem.createOrbitalParticle()
          }, i * 150)
        }
      } else if (isBust) {
        if (state.dice.every((d) => isDieBust(d))) {
          particleSystem.fireOffOrbitalParticles()
          particleSystem.createConfetti(
            particleSystem.centerX,
            particleSystem.centerY,
            'black',
            30,
          )
          zzfx(...fullBustSound)
        } else {
          zzfx(...blackCatSound)
        }
        setTimeout(() => app.classList.add('shake'), 10)
        setTimeout(() => app.classList.remove('shake'), 200)
      } else {
        zzfx(...getNumberSound(state.pendingPoints))
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

const rollDie = (sides: number) => {
  return Math.floor(Math.random() * sides) + 1
}
