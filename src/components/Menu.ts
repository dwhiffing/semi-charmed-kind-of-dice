import { createElement } from '../utils/createElement'
import { startGame, state } from '../state'

export const Menu = () => {
  const btnStart = createElement('button', 'Start') as HTMLButtonElement
  const buttons = createElement('div', { className: 'buttons' }, btnStart)

  const container = createElement('div', { className: 'menu' }, buttons)

  const update = () => {
    const disabled = false
    btnStart.toggleAttribute('disabled', disabled)

    const visible = state.status !== 'menu' && state.status !== 'lost'
    container.style.opacity = visible ? '0' : '1'
    container.style.pointerEvents = visible ? 'none' : 'auto'
  }

  btnStart.onclick = () => startGame()

  state.addUpdate('status', update)
  update()

  return container
}
