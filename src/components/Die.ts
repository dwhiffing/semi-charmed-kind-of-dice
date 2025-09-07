import { createElement } from '../utils/createElement'
import { colors } from '../constants'
import { state } from '../state'
import { getDieUpgradeCost, onClickDie, onClickUpgradeDie } from '../state/die'

export const Die = (index: number) => {
  const container = createElement('div', { className: 'die-container' })
  const number = createElement('div', { className: 'die-number' })
  const sticker = createElement('div', { className: 'sticker' })
  const catSvg = document.querySelector(`#cat svg`)!.cloneNode(true)
  const dieSvg = createElement('svg')

  const die = createElement('div', {
    className: 'die',
    onclick: () => onClickDie(index),
  })
  die.append(number, sticker, catSvg, dieSvg)

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

    const isHidden =
      state.status.includes('shop-passive-pack') ||
      state.status.includes('shop-sticker-pack')

    const isUpgradeButtonHidden =
      state.status !== 'shop' && state.status !== 'shop-sticker-apply'

    const upgradeLabel =
      state.status === 'shop-sticker-apply'
        ? `Apply Sticker`
        : `Upgrade $${getDieUpgradeCost(index)}`

    const isClickable =
      state.status === 'ready' || state.status.includes('shop-sticker-apply')

    const isRolling =
      !_die.selected && state.status === 'rolling' && _die.roll == null

    container.classList.toggle('hidden', isHidden)

    die.style.color = colors[_die.sides]
    die.style.opacity = _die.roll == null ? '0.5' : '1'
    die.classList.remove('d4', 'd6', 'd8', 'd10', 'd12', 'd20')
    die.classList.add(`d${_die.sides}`)
    die.classList.toggle('clickable', isClickable)
    die.classList.toggle('rolling', isRolling)
    die.classList.toggle('selected', _die.selected)
    die.classList.toggle('die-number-cat', _die.roll === 1)

    number.textContent = _die.roll ? `${_die.roll}` : ''

    upgradeButton.toggleAttribute('disabled', _die.sides >= 20)
    upgradeButton.classList.toggle('hidden', isUpgradeButtonHidden)
    upgradeButton.textContent = upgradeLabel

    const activeSticker = _die.stickers.find((s) => s.rollValue === _die.roll)
    sticker.classList.toggle('hidden', !activeSticker)
    sticker.innerText = activeSticker?.value.toString() ?? ''
    sticker.style.backgroundColor =
      activeSticker?.variant === 'number' ? 'blue' : 'red'

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
  state.addUpdate('status', update)
  update()

  return container
}
