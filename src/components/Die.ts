/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { colors } from '../constants'
import { createElement } from '../utils/createElement'
import { state, toggleDieSelected } from '../utils/state'

export const Die = (index: number) => {
  const die = createElement('div', {
    className: 'die',
    onclick: () => toggleDieSelected(index),
  }) as HTMLDivElement
  const number = createElement('div', {
    className: 'die-number',
  }) as HTMLDivElement
  const cat = document
    .querySelector(`#cat svg`)!
    .cloneNode(true) as SVGSVGElement
  cat.classList.add('die-number')

  let dieSvg = createElement('svg')
  die.append(number, cat, dieSvg)
  let lastSides = -1

  const update = () => {
    const _die = state.dice[index]
    if (!_die) return

    die.style.color = colors[_die.sides]
    die.style.opacity = _die.roll == null ? '0.5' : '1'
    die.classList.remove('d4', 'd6', 'd8', 'd10', 'd12', 'd20')
    die.classList.add(`d${_die.sides}`)

    die.classList.toggle('selected', _die.selected)
    die.classList.toggle('die-number-cat', _die.roll === 1)
    number.textContent = _die.roll ? `${_die.roll}` : ''

    if (lastSides !== _die.sides) {
      const _dieSvg = document
        .querySelector(`#d${_die.sides} svg`)!
        .cloneNode(true) as SVGSVGElement
      lastSides = _die.sides
      dieSvg.replaceWith(_dieSvg)
    }

    if (!_die.selected)
      die.classList.toggle('rolling', state.status === 'rolling')
  }

  state.addUpdate('dice', update)
  state.addUpdate('status', update)
  update()

  return die
}
