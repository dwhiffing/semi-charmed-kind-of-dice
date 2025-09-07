import { createElement } from '../utils/createElement'
import { doRoll, doRollCards, doSubmit, state } from '../state'

export const Controls = () => {
  const btnRoll = createElement('button', 'Roll') as HTMLButtonElement
  const btnRollCards = createElement(
    'button',
    'Roll Cards',
  ) as HTMLButtonElement
  const btnSubmit = createElement('button', 'Submit') as HTMLButtonElement
  const info = createElement('span', { className: 'info' })
  const gameButtons = createElement(
    'div',
    { className: 'buttons' },
    btnRoll,
    btnSubmit,
    btnRollCards,
  )
  const container = createElement(
    'div',
    { className: 'controls' },
    gameButtons,
    info,
  )

  const update = () => {
    const rollDisabled =
      state.dice.every((d) => d.selected) || state.status !== 'ready'
    const submitDisabled = state.dice.some((d) => typeof d.roll !== 'number')
    btnRoll.toggleAttribute('disabled', rollDisabled)
    btnSubmit.toggleAttribute('disabled', submitDisabled)

    gameButtons.classList.toggle('hidden', state.status.includes('shop'))

    const summary = `Round: ${state.round} You have ${state.lives} lives and ${state.chips} chips\nLast score: ${state.scoreInfo}`
    info.textContent = state.status === 'lost' ? 'You lose!' : summary
  }

  btnRoll.onclick = doRoll
  btnRollCards.onclick = doRollCards
  btnSubmit.onclick = doSubmit

  state.addUpdate('lives', update)
  state.addUpdate('status', update)
  state.addUpdate('chips', update)
  state.addUpdate('dice', update)
  update()

  return container
}
