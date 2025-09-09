import { createElement } from '../utils/createElement'
import { colors } from '../constants'
import { state } from '../state'
import {
  getDieUpgradeCost,
  isDieBust,
  isDieCharm,
  onClickDie,
  onClickUpgradeDie,
} from '../state/die'

export const Die = (index: number) => {
  const container = createElement('div', { className: 'die-container' })
  const number = createElement('div', { className: 'die-number' })
  const catSvg = document.querySelector(`#cat svg`)!.cloneNode(true)
  const charmSvg = document.querySelector(`#charm svg`)!.cloneNode(true)
  const charm2Svg = document.querySelector(`#charm-2 svg`)!.cloneNode(true)
  const charm3Svg = document.querySelector(`#charm-3 svg`)!.cloneNode(true)
  const dieSvg = createElement('svg')

  const die = createElement('div', {
    className: 'die',
    onclick: () => onClickDie(index),
  })
  die.append(number, catSvg, charmSvg, charm2Svg, charm3Svg, dieSvg)

  const upgradeButton = createElement(
    'button',
    { className: 'die-upgrade', onclick: () => onClickUpgradeDie(index) },
    'Upgrade',
  )

  container.append(die, upgradeButton)

  let lastSides = -1

  const update = () => {
    const _die = state.dice[index]
    if (!_die) return

    const isUpgradeButtonHidden = state.status !== 'shop'
    const upgradeCost = getDieUpgradeCost(index)
    const upgradeLabel = `Upgrade ${upgradeCost} Charms`

    const isRolling =
      !_die.selected && state.status === 'rolling' && _die.roll == null

    die.style.color = colors[_die.sides]
    die.classList.remove('d4', 'd6', 'd8', 'd10', 'd12', 'd20')
    die.classList.add(`d${_die.sides}`)
    // die.classList.toggle('clickable', state.status === 'ready')
    die.classList.toggle('rolling', isRolling)
    die.classList.toggle('selected', _die.selected)
    die.classList.toggle('die-number-cat', isDieBust(_die))
    die.classList.toggle('die-number-charm', isDieCharm(_die))
    die.style.opacity = _die.roll === null ? '0.3' : '1'

    number.textContent = _die.roll ? `${_die.roll}` : ''

    upgradeButton.toggleAttribute(
      'disabled',
      state.charms < upgradeCost || _die.sides >= 20,
    )
    upgradeButton.classList.toggle('hidden', isUpgradeButtonHidden)
    upgradeButton.textContent = upgradeLabel

    if (lastSides !== _die.sides) {
      const _dieSvg = document
        .querySelector(`#d${_die.sides} svg`)!
        .cloneNode(true) as SVGSVGElement
      lastSides = _die.sides
      dieSvg.innerHTML = ''
      dieSvg.append(_dieSvg)
    }
  }

  state.addUpdate('dice', update)
  state.addUpdate('charms', update)
  state.addUpdate('status', update)
  update()

  return container
}
