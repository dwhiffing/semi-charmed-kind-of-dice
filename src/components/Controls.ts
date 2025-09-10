import { createElement } from '../utils/createElement'
import { doEnterShop, doRoll, state } from '../state'
import { getDie, isDieBust } from '../state/die'

export const Controls = () => {
  const btnRoll = createElement('button', '') as HTMLButtonElement
  const btnShop = createElement('button', '') as HTMLButtonElement
  const roundCount = createElement('div', { className: 'round-count' })
  const charmCount = createElement('div', { className: 'charm-count' })
  const pointCount = createElement('div', { className: 'chip-count' })
  const gameButtons = createElement(
    'div',
    { className: 'buttons' },
    btnShop,
    btnRoll,
  )
  const info = createElement(
    'div',
    { className: 'info' },
    roundCount,
    charmCount,
    pointCount,
  )
  const container = createElement(
    'div',
    { className: 'controls' },
    info,
    gameButtons,
  )

  const update = () => {
    const rollDisabled = !!state.status.match(/rolling|menu|lost/)
    const isBust = state.dice.every(isDieBust)
    btnRoll.toggleAttribute('disabled', rollDisabled)
    btnRoll.textContent = isBust
      ? 'End Day'
      : state.status === 'shop'
      ? 'Start Day'
      : 'Roll'
    btnRoll.style.flex = '1'

    const newDieCost = (state.dice.length - 2) * 2
    const buyNewDie = () => {
      if (state.charms < newDieCost) return
      state.dice = [...state.dice, getDie(4, state.dice.length)]
      state.charms -= newDieCost
    }

    btnShop.toggleAttribute(
      'disabled',
      state.status === 'shop'
        ? state.charms < newDieCost
        : state.status !== 'ready',
    )
    btnShop.style.display = isBust ? 'none' : 'block'
    btnShop.innerHTML =
      state.status === 'shop' ? `Buy Die<br/>${newDieCost} Charms` : 'End Day'

    btnRoll.onclick = isBust ? doEnterShop : doRoll
    btnShop.onclick = state.status === 'shop' ? buyNewDie : doEnterShop

    roundCount.innerHTML = ''
    charmCount.innerHTML = ''
    pointCount.innerHTML = ''

    roundCount.append(
      createElement('div', {}, `${state.round}`),
      createElement('div', {}, `DAY`),
    )
    charmCount.append(
      createElement(
        'div',
        {},
        `${state.charms}${
          state.status === 'shop' ? '' : ` + ${state.pendingCharms}`
        }`,
      ),
      createElement('div', {}, `CHARMS`),
    )
    pointCount.append(
      createElement(
        'div',
        {},
        `${state.points}${
          state.status === 'shop' ? '' : ` + ${state.pendingPoints}`
        }`,
      ),
      createElement('div', {}, `POINTS`),
    )
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Space' && !btnRoll.hasAttribute('disabled')) {
      event.preventDefault()
      doRoll()
    }
    if (event.code === 'Enter' && !btnShop.hasAttribute('disabled')) {
      event.preventDefault()
      doEnterShop()
    }
  }
  document.addEventListener('keydown', handleKeyPress)

  state.addUpdate('status', update)
  state.addUpdate('points', update)
  state.addUpdate('charms', update)
  state.addUpdate('dice', update)
  update()

  return container
}
