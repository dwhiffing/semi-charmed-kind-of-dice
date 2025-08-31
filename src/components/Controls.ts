import { createElement } from '../utils/createElement'
import { checkGoal, doRoll, doSubmit, state } from '../utils/state'

export const Controls = () => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const btnSubmit = createElement('button', 'Submit') as HTMLButtonElement
  const info = createElement('span', { className: 'info' }, '')
  const buttons = createElement(
    'div',
    { className: 'buttons' },
    btnRoll,
    btnSubmit,
  )
  const controls = createElement(
    'div',
    { className: 'controls' },
    buttons,
    info,
  )

  const update = () => {
    btnRoll.toggleAttribute(
      'disabled',
      state.dice.every((d) => d.selected) || state.status !== 'ready',
    )
    btnSubmit.toggleAttribute(
      'disabled',
      state.dice.every((d) => !d.selected) ||
        state.cards.every((c) => !checkGoal(c)),
    )
    info.textContent =
      state.status === 'lost'
        ? 'You lose!'
        : `You have ${state.lives} lives and ${state.chips} chips`
  }

  btnRoll.onclick = doRoll
  btnSubmit.onclick = doSubmit

  state.addUpdate('lives', update)
  state.addUpdate('status', update)
  state.addUpdate('chips', update)
  state.addUpdate('dice', update)
  update()

  return controls
}
