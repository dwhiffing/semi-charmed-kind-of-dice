import { createElement } from './createElement'
import { clickSound } from './sounds'
import type { State } from './types'
import { zzfx } from './zzfx'

const DICE = [20, 12, 10, 8, 6, 4]

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1

export const DiceGame = (state: State) => {
  const app = createElement('div', { className: 'dice-game' })

  const title = createElement('h2', 'Black Cat')
  const info = createElement('p', { className: 'info' }, '')
  const dieLabel = createElement('div', { className: 'die-label' }, '')
  const dieFace = createElement('div', { className: 'die-face' }, '')
  const lastRoll = createElement('div', { className: 'last-roll' }, '')
  const scoreDisplay = createElement('div', { className: 'score' }, '')

  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const btnPass = createElement('button', 'Pass') as HTMLButtonElement
  const btnScore = createElement('button', 'Score Out') as HTMLButtonElement
  const btnRestart = createElement('button', 'Restart') as HTMLButtonElement

  // Rolling animation state
  let rollInterval: number | null = null
  let rollTimeout: number | null = null

  const clearRollTimers = () => {
    if (rollInterval != null) {
      clearInterval(rollInterval)
      rollInterval = null
    }
    if (rollTimeout != null) {
      clearTimeout(rollTimeout)
      rollTimeout = null
    }
  }

  const doRoll = () => {
    const idx = (state.dieIndex as number) ?? 0
    if (idx >= DICE.length) return
    const sides = DICE[idx]
    if ((state.status as string) === 'rolling') return

    state.status = 'rolling'
    zzfx(...clickSound)

    rollInterval = window.setInterval(() => {
      const quick = Math.floor(Math.random() * sides) + 1
      dieFace.textContent = String(quick)
    }, 60) as unknown as number

    rollTimeout = window.setTimeout(() => {
      clearRollTimers()
      const r = rollDie(sides)
      state.currentRoll = r
      dieFace.textContent = String(r)
      state.status = 'playing'
      if (r === 1) state.status = 'lost'
    }, 700) as unknown as number
  }

  const doPass = () => {
    const r = state.currentRoll as number | null
    if (r == null) return
    state.score = ((state.score as number) ?? 0) + r
    state.currentRoll = null
    state.dieIndex = ((state.dieIndex as number) ?? 0) + 1
    if ((state.dieIndex as number) >= DICE.length) {
      state.status = 'won'
    } else {
      state.status = 'ready'
    }
  }

  const doScoreOut = () => {
    const r = state.currentRoll as number | null
    if (r == null) return
    state.score = ((state.score as number) ?? 0) + r
    state.currentRoll = null
    state.status = 'scored'
  }

  const doRestart = () => {
    state.score = 0
    state.dieIndex = 0
    state.currentRoll = null
    dieFace.textContent = ''
    clearRollTimers()
    state.status = 'ready'
  }

  btnRoll.onclick = doRoll
  btnPass.onclick = doPass
  btnScore.onclick = doScoreOut
  btnRestart.onclick = doRestart

  const updateUI = () => {
    const idx = (state.dieIndex as number) ?? 0
    const sides = DICE[idx]
    const roll = state.currentRoll as number | null
    const score = (state.score as number) ?? 0
    const status = (state.status as string) ?? 'ready'

    info.textContent =
      status === 'lost'
        ? 'You rolled a 1 — you lose. Press Restart to try again.'
        : status === 'won'
        ? 'You completed all dice! Great job.'
        : 'Roll the current die. If you roll a 1 you lose. Otherwise you may re-roll, pass to lock the value, or score out.'

    dieLabel.textContent =
      idx < DICE.length ? `Current die: d${sides}` : 'No more dice'
    lastRoll.textContent = roll ? `Last roll: ${roll}` : 'No roll yet'
    const shapeClasses = [
      'shape-d20',
      'shape-d12',
      'shape-d10',
      'shape-d8',
      'shape-d6',
      'shape-d4',
    ]
    shapeClasses.forEach((c) => dieFace.classList.remove(c))
    if (idx < DICE.length) dieFace.classList.add(`shape-d${sides}`)
    if (status === 'rolling') {
      dieFace.classList.add('rolling')
    } else {
      dieFace.classList.remove('rolling')
      dieFace.textContent = roll ? String(roll) : ''
    }
    scoreDisplay.textContent = `Score: ${score}`

    btnRoll.toggleAttribute(
      'disabled',
      status === 'lost' || status === 'won' || status === 'rolling',
    )
    btnPass.toggleAttribute('disabled', roll == null || status !== 'playing')
    btnScore.toggleAttribute('disabled', roll == null || status !== 'playing')
  }

  state.addUpdate('dieIndex', updateUI)
  state.addUpdate('currentRoll', updateUI)
  state.addUpdate('score', updateUI)
  state.addUpdate('status', updateUI)

  updateUI()

  const controls = createElement(
    'div',
    { className: 'controls' },
    btnRoll,
    btnPass,
    btnScore,
    btnRestart,
  )

  app.append(title, info, dieLabel, lastRoll, scoreDisplay, controls, dieFace)

  return app
}
