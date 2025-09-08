import { createElement } from '../utils/createElement'
import { doRoll, getIsRoundComplete, state } from '../state'
import { onClickDie } from '../state/die'

export const Controls = () => {
  const btnRoll = createElement('button', '') as HTMLButtonElement
  const roundCount = createElement('div', { className: 'round-count' })
  const lifeCount = createElement('div', { className: 'life-count' })
  const chipCount = createElement('div', { className: 'chip-count' })
  const gameButtons = createElement('div', { className: 'buttons' }, btnRoll)
  const info = createElement(
    'div',
    { className: 'info' },
    roundCount,
    lifeCount,
    chipCount,
  )
  const container = createElement(
    'div',
    { className: 'controls' },
    info,
    gameButtons,
  )

  const update = () => {
    const rollDisabled =
      state.dice.every((d) => d.selected) ||
      !!state.status.match(/rolling|menu|lost/)
    btnRoll.toggleAttribute('disabled', rollDisabled)
    btnRoll.textContent = getIsRoundComplete()
      ? 'Enter Shop'
      : state.status === 'shop'
      ? 'Next Round'
      : state.status.match(/sticker|passive/)
      ? 'Back'
      : 'Roll'

    roundCount.innerHTML = ''
    lifeCount.innerHTML = ''
    chipCount.innerHTML = ''

    roundCount.append(
      createElement('div', {}, `${state.round}`),
      createElement('div', {}, `ROUND`),
    )
    lifeCount.append(
      createElement('div', {}, `${state.lives}`),
      createElement('div', {}, `LIVES`),
    )
    chipCount.append(
      createElement('div', {}, `${state.chips}`),
      createElement('div', {}, `CHIPS`),
    )
  }

  btnRoll.onclick = doRoll

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Space' && !btnRoll.hasAttribute('disabled')) {
      event.preventDefault()
      doRoll()
    }

    const key = parseInt(event.key)
    if (key >= 1 && key <= 9) {
      const dieIndex = key - 1
      if (dieIndex < state.dice.length) {
        event.preventDefault()
        onClickDie(dieIndex)
      }
    }
  }
  document.addEventListener('keydown', handleKeyPress)

  state.addUpdate('lives', update)
  state.addUpdate('status', update)
  state.addUpdate('chips', update)
  state.addUpdate('cards', update)
  state.addUpdate('dice', update)
  update()

  return container
}
