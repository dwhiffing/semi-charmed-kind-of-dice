/** biome-ignore-all lint/style/noNonNullAssertion: don't care */

import { colors, DICE, textColors } from './constants'
import { createElement } from './createElement'
import type { IState } from './main'
import { clickSound } from './sounds'
import { zzfx } from './zzfx'

export const DiceGame = (state: IState) => {
  const app = createElement('div', { className: 'dice-game' })
  const info = createElement('span', { className: 'info' }, '')

  let rollInterval: number = -1
  let rollTimeout: number = -1

  const doRoll = () => {
    if (state.dieIndex >= DICE.length) return
    if (state.status === 'rolling') return

    state.status = 'rolling'
    zzfx(...clickSound)

    rollInterval = window.setInterval(() => {
      state.currentRoll = rollDie(DICE[state.dieIndex])
    }, 60)

    rollTimeout = window.setTimeout(() => {
      clearInterval(rollInterval)
      clearTimeout(rollTimeout)

      state.currentRoll = rollDie(DICE[state.dieIndex])
      state.status = 'ready'
      if (state.currentRoll === 1) state.status = 'lost'
    }, 700)
  }

  const doPass = () => {
    if (state.currentRoll == null) return
    state.currentRoll = null
    state.dieIndex = state.dieIndex + 1
    state.status = state.dieIndex >= DICE.length ? 'won' : 'ready'
  }

  const update = () => {
    info.textContent =
      state.status === 'lost'
        ? 'You rolled a 1 — you lose. Press Restart to try again.'
        : state.status === 'won'
        ? 'You completed all dice! Great job.'
        : 'Roll the current die. If you roll a 1 you lose'
  }

  state.addUpdate('status', update)

  update()

  app.append(info, DieSvgs(), Controls(state, doRoll, doPass), Die(state))

  return app
}

const DieSvgs = () => {
  const svgs = createElement('div', { className: 'svgs hidden' }, '')

  DICE.forEach(async (side) => {
    const res = await fetch(`/d${side}.svg`)
    const innerHTML = (await res.text()).trim()
    const id = `d${side}`
    svgs.append(createElement('div', { id, innerHTML }))
  })

  return svgs
}

export const Die = (state: IState) => {
  const die = createElement('div', { className: 'die' })
  const number = createElement('div', { className: 'die-number' })

  const update = () => {
    const sides = DICE[state.dieIndex]
    if (!sides) return
    const svg = document.querySelector(`#d${sides} svg`)!

    die.innerHTML = ''
    die.append(number, svg.cloneNode(true))
    die.style.color = colors[sides]
    number.style.color = textColors[sides]

    number.textContent = state.currentRoll ? `${state.currentRoll}` : ''
    die.classList.toggle('rolling', state.status === 'rolling')
  }

  state.addUpdate('dieIndex', update)
  state.addUpdate('currentRoll', update)
  state.addUpdate('status', update)

  return die
}

const Controls = (state: IState, doRoll: () => void, doPass: () => void) => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const btnPass = createElement('button', 'Pass') as HTMLButtonElement
  const controls = createElement(
    'div',
    { className: 'controls' },
    btnRoll,
    btnPass,
  )

  const update = () => {
    btnRoll.toggleAttribute('disabled', state.status !== 'ready')
    btnPass.toggleAttribute(
      'disabled',
      state.currentRoll == null || state.status !== 'ready',
    )
  }

  btnRoll.onclick = doRoll
  btnPass.onclick = doPass

  state.addUpdate('currentRoll', update)
  state.addUpdate('status', update)
  update()

  return controls
}

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1
