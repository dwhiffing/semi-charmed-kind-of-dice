/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { colors, textColors } from '../constants'
import { createElement } from '../utils/createElement'
import { state, toggleDieSelected } from '../utils/state'

export const Die = (index: number) => {
  const die = createElement('div', {
    className: 'die',
    onclick: () => toggleDieSelected(index),
  })
  const number = createElement('div', { className: 'die-number' })

  const update = () => {
    const _die = state.dice[index]
    if (!_die) return

    die.innerHTML = ''
    die.style.color = colors[_die.sides]
    die.style.opacity = _die.selected ? '0.5' : '1'
    number.style.color = textColors[_die.sides]
    number.textContent = _die.roll ? `${_die.roll}` : ''

    const dieSvg = document.querySelector(`#d${_die.sides} svg`)!
    const cat = document
      .querySelector(`#cat svg`)!
      .cloneNode(true) as SVGSVGElement
    cat.style.color = textColors[_die.sides]
    cat.style.width = '26px'
    cat.style.zIndex = '20'
    const numberEl = _die.roll === 1 ? cat : number

    die.append(numberEl, dieSvg.cloneNode(true))
    if (!_die.selected)
      die.classList.toggle('rolling', state.status === 'rolling')
  }

  state.addUpdate('dice', update)
  state.addUpdate('status', update)
  update()

  return die
}
