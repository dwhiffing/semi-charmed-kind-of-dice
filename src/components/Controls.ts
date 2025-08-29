import { createElement } from '../utils/createElement'
import { doPass, doRoll, state } from '../utils/state'

export const Controls = () => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const btnPass = createElement('button', 'Pass') as HTMLButtonElement
  const controls = createElement(
    'div',
    { className: 'controls' },
    btnRoll,
    btnPass,
  )

  const update = () => {
    btnRoll.toggleAttribute('disabled', state.status !== 'ready')
    btnPass.toggleAttribute(
      'disabled',
      state.currentRoll == null || state.status !== 'ready',
    )
  }

  btnRoll.onclick = doRoll
  btnPass.onclick = doPass

  state.addUpdate('currentRoll', update)
  state.addUpdate('status', update)
  update()

  return controls
}
