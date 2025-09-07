import { createElement } from '../utils/createElement'
import { doRoll, state } from '../state'

export const Controls = () => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
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
      state.dice.every((d) => d.selected) || state.status !== 'ready'
    btnRoll.toggleAttribute('disabled', rollDisabled)

    gameButtons.classList.toggle('hidden', state.status.includes('shop'))

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

  state.addUpdate('lives', update)
  state.addUpdate('status', update)
  state.addUpdate('chips', update)
  state.addUpdate('dice', update)
  update()

  return container
}
