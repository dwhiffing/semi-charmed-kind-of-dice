import { DEV, dieRollTime, LAST_ROUND_NUMBER } from '../constants'
import type { IState } from '../types'
import { createState } from '../utils/createState'
import { particleSystem } from '../utils/particles'
import { clickSound, endDaySound, gameOverSound } from '../utils/sounds'
import { zzfx } from '../utils/zzfx'
import { updateDice, doRollDie, getDie, isDieBust } from './die'

const initialState = {
  dice: [],
  charms: 0,
  points: 0,
  highScore: JSON.parse(localStorage.getItem('jynx-dice-highscore') || '0'),
  pendingCharms: 0,
  pendingPoints: 0,
  muteState: 2,
  selectedDie: -1,
  round: 1,
  status: 'menu',
}
export let state = createState(initialState) as IState

export const doEnterShop = () => {
  particleSystem.pullInOrbitalParticles()

  if (state.round === LAST_ROUND_NUMBER) {
    state.status = 'menu'
    zzfx(...gameOverSound)
    particleSystem.pointCount = 0
    if (state.points > state.highScore) {
      state.highScore = state.points
      localStorage.setItem('jynx-dice-highscore', state.points.toString())
    }
    return
  }

  zzfx(...endDaySound)
  state.round++
  state.charms += state.pendingCharms
  state.points += state.pendingPoints
  state.pendingCharms = 0
  state.pendingPoints = 0
  state.dice = state.dice.map((d) => ({ ...d, roll: d.sides }))
  state.status = 'shop'
}

export const doRoll = async () => {
  if (state.status === 'rolling') return
  if (!DEV) zzfx(...clickSound)

  state.status = 'rolling'
  updateDice((die) => ({
    ...die,
    roll: isDieBust(die) ? die.roll : null,
  }))

  let j = 0
  const delay = dieRollTime / state.dice.length
  await Promise.all(
    state.dice
      .filter((die) => !isDieBust(die))
      .map(async (die) => {
        const _delay = ++j * delay
        await doRollDie(die, _delay)
      }),
  )

  const isBust = state.dice.every((d) => isDieBust(d))

  if (isBust) {
    state.pendingCharms = 0
    state.pendingPoints = 0
  }
  state.status = 'ready'
}

export const startGame = () => {
  state.charms = 3
  state.points = 0
  state.pendingCharms = 0
  state.pendingPoints = 0
  state.round = 1
  state.status = 'shop'
  state.dice = [getDie(4, 0), getDie(4, 1), getDie(4, 2)]
  state.selectedDie = -1

  zzfx(...endDaySound)
}
