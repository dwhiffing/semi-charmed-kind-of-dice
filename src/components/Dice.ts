/** biome-ignore-all lint/style/noNonNullAssertion: xxx */
import { createElement } from '../utils/createElement'
import { colors } from '../constants'
import { state } from '../state'
import { getDieUpgradeCost, onClickDie, onClickUpgradeDie } from '../state/die'

export const Dice = () => {
  const dice = createElement('div', { className: 'dice' })

  const update = () => {
    if (dice.querySelectorAll('.die').length === state.dice.length) return

    dice.innerHTML = ''
    state.dice.forEach((_die, index) => {
      dice.append(Die(index))
    })
  }

  state.addUpdate('dice', update)

  return dice
}

const Die = (index: number) => {
  const container = createElement('div', {
    className: 'die-container',
  }) as HTMLDivElement
  const die = createElement('div', {
    className: 'die',
    onclick: () => onClickDie(index),
  }) as HTMLDivElement
  const sticker = createElement('div', {
    className: 'sticker',
  }) as HTMLDivElement
  const number = createElement('div', {
    className: 'die-number',
  }) as HTMLDivElement

  const upgradeButton = createElement(
    'button',
    { className: 'die-upgrade', onclick: () => onClickUpgradeDie(index) },
    'Upgrade',
  ) as HTMLButtonElement
  const cat = document
    .querySelector(`#cat svg`)!
    .cloneNode(true) as SVGSVGElement
  cat.classList.add('die-number')

  let dieSvg = createElement('svg')
  die.append(number, cat, dieSvg, sticker)
  container.append(die, upgradeButton)
  let lastSides = -1

  const update = () => {
    const _die = state.dice[index]
    if (!_die) return

    container.classList.toggle(
      'hidden',
      state.status.includes('shop-passive-pack') ||
        state.status.includes('shop-sticker-pack'),
    )

    die.style.color = colors[_die.sides]
    die.style.opacity = _die.roll == null ? '0.5' : '1'
    die.classList.remove('d4', 'd6', 'd8', 'd10', 'd12', 'd20')
    die.classList.add(`d${_die.sides}`)

    die.classList.toggle('selected', _die.selected)
    die.classList.toggle(
      'clickable',
      state.status === 'ready' || state.status.includes('shop-sticker-apply'),
    )
    die.classList.toggle('die-number-cat', _die.roll === 1)

    number.textContent = _die.roll ? `${_die.roll}` : ''

    upgradeButton.toggleAttribute('disabled', _die.sides >= 20)
    upgradeButton.classList.toggle(
      'hidden',
      state.status !== 'shop-die-upgrade' &&
        state.status !== 'shop-sticker-apply',
    )
    upgradeButton.textContent =
      state.status === 'shop-sticker-apply'
        ? `Apply Sticker`
        : `Upgrade: cost ${getDieUpgradeCost(index)}`

    if (lastSides !== _die.sides) {
      const _dieSvg = document
        .querySelector(`#d${_die.sides} svg`)!
        .cloneNode(true) as SVGSVGElement
      lastSides = _die.sides
      dieSvg.innerHTML = ''
      dieSvg.append(_dieSvg)
    }

    const activeSticker = _die.stickers.find((s) => s.rollValue === _die.roll)
    sticker.classList.toggle('hidden', !activeSticker)
    if (activeSticker)
      sticker.style.backgroundColor =
        activeSticker?.variant === 'number' ? 'blue' : 'red'

    sticker.innerText = activeSticker?.value.toString() ?? ''

    if (!_die.selected)
      die.classList.toggle(
        'rolling',
        state.status === 'rolling' && _die.roll == null,
      )
  }

  state.addUpdate('dice', update)
  state.addUpdate('status', update)
  update()

  return container
}
