import { createElement } from '../utils/createElement'
import { doRoll, state } from '../utils/state'

export const Controls = () => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const controls = createElement('div', { className: 'controls' }, btnRoll)

  const update = () => {
    btnRoll.toggleAttribute(
      'disabled',
      state.dice.every((d) => d.selected) || state.status !== 'ready',
    )
  }

  btnRoll.onclick = doRoll

  state.addUpdate('status', update)
  state.addUpdate('dice', update)
  update()

  return controls
}
