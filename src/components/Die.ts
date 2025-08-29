/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { colors, DICE, textColors } from '../constants'
import { createElement } from '../utils/createElement'
import { state } from '../utils/state'

export const DieSvgs = () => {
  const svgs = createElement('div', { className: 'svgs hidden' }, '')

  DICE.forEach(async (side) => {
    const res = await fetch(`/d${side}.svg`)
    const innerHTML = (await res.text()).trim()
    const id = `d${side}`
    svgs.append(createElement('div', { id, innerHTML }))
  })

  return svgs
}

export const Die = () => {
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
